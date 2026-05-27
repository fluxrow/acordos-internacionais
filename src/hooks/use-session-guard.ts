import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId, getDeviceLabel, getUserAgent } from "@/lib/device-id";
import {
  claimSession,
  heartbeatSession,
  releaseSession,
} from "@/lib/session-guard.functions";

const HEARTBEAT_MS = 60_000;

export function useSessionGuard() {
  const claimFn = useServerFn(claimSession);
  const beatFn = useServerFn(heartbeatSession);
  const releaseFn = useServerFn(releaseSession);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const { data } = await supabase.auth.getSession();
      if (!data.session || cancelled) return;
      const deviceId = getDeviceId();

      try {
        const res = await claimFn({
          data: {
            deviceId,
            deviceLabel: getDeviceLabel(),
            userAgent: getUserAgent(),
          },
        });
        if (!res.ok) {
          if (res.reason === "taken") {
            toast.error("Conta em uso em outro dispositivo", {
              description: `${res.other_device_label ?? "Outro dispositivo"}${res.other_city ? ` · ${res.other_city}` : ""}. Saia de lá ou use "Sair de outros dispositivos" em /conta.`,
              duration: 10_000,
            });
          }
          await supabase.auth.signOut();
          return;
        }
        activeRef.current = true;
        intervalRef.current = setInterval(async () => {
          try {
            const hb = await beatFn({ data: { deviceId } });
            if (!hb.ok) {
              toast.error("Você foi desconectado", {
                description: "Sua conta entrou em outro dispositivo.",
              });
              await supabase.auth.signOut();
            }
          } catch {}
        }, HEARTBEAT_MS);
      } catch (e) {
        console.error("session-guard claim", e);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (!activeRef.current) start();
      } else if (event === "SIGNED_OUT") {
        activeRef.current = false;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    });

    start();

    const onUnload = () => {
      if (!activeRef.current) return;
      const deviceId = getDeviceId();
      releaseFn({ data: { deviceId } }).catch(() => {});
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener("beforeunload", onUnload);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [claimFn, beatFn, releaseFn]);
}
