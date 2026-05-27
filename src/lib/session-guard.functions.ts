import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const deviceSchema = z.object({
  deviceId: z.string().min(8).max(128),
  deviceLabel: z.string().max(120).optional(),
  userAgent: z.string().max(500).optional(),
});

function readGeo() {
  const ip =
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined;
  const city = getRequestHeader("cf-ipcity") ?? undefined;
  const region = getRequestHeader("cf-region") ?? undefined;
  const country = getRequestHeader("cf-ipcountry") ?? undefined;
  const latStr = getRequestHeader("cf-iplatitude");
  const lonStr = getRequestHeader("cf-iplongitude");
  const lat = latStr ? Number(latStr) : undefined;
  const lon = lonStr ? Number(lonStr) : undefined;
  return {
    p_ip: ip,
    p_city: city,
    p_region: region,
    p_country: country,
    p_lat: Number.isFinite(lat) ? lat : undefined,
    p_lon: Number.isFinite(lon) ? lon : undefined,
  };
}


export type ClaimResult =
  | { ok: true }
  | {
      ok: false;
      reason: "taken" | "unauthenticated" | "error";
      other_device_label?: string;
      other_city?: string | null;
      other_last_seen?: string;
    };

export const claimSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => deviceSchema.parse(input))
  .handler(async ({ data, context }): Promise<ClaimResult> => {
    const { supabase } = context;
    const geo = readGeo();
    const { data: res, error } = await supabase.rpc("claim_session", {
      p_device_id: data.deviceId,
      p_device_label: data.deviceLabel ?? null,
      p_user_agent: data.userAgent ?? null,
      ...geo,
    });
    if (error) {
      console.error("claim_session", error);
      return { ok: false, reason: "error" };
    }
    return res as ClaimResult;
  });

export const heartbeatSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ deviceId: z.string().min(8).max(128) }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean; reason?: string }> => {
    const { supabase } = context;
    const geo = readGeo();
    const { data: res, error } = await supabase.rpc("heartbeat_session", {
      p_device_id: data.deviceId,
      ...geo,
    });
    if (error) {
      console.error("heartbeat_session", error);
      return { ok: false, reason: "error" };
    }
    return res as { ok: boolean; reason?: string };
  });

export const releaseSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ deviceId: z.string().min(8).max(128) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await supabase.rpc("release_session", { p_device_id: data.deviceId });
    return { ok: true };
  });

export const releaseOtherSessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ deviceId: z.string().min(8).max(128) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: res } = await supabase.rpc("release_other_sessions", {
      p_device_id: data.deviceId,
    });
    return (res as { ok: boolean; released?: number }) ?? { ok: false };
  });

export type DeviceRow = {
  device_id: string;
  device_label: string | null;
  user_agent: string | null;
  geo_city: string | null;
  geo_country: string | null;
  created_at: string;
  last_seen_at: string;
  is_active: boolean;
};

export const listMyDevices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DeviceRow[]> => {
    const { supabase } = context;
    const { data, error } = await supabase.rpc("list_my_devices");
    if (error) {
      console.error("list_my_devices", error);
      return [];
    }
    return (data ?? []) as DeviceRow[];
  });
