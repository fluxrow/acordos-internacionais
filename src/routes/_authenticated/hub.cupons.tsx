import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ensureAcordos10Coupon } from "@/lib/admin-coupons.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/hub/cupons")({
  component: HubCuponsPage,
});

function HubCuponsPage() {
  const [log, setLog] = useState<string[]>([]);

  const run = useMutation({
    mutationFn: async (env: "sandbox" | "live") => {
      const res = await ensureAcordos10Coupon({ data: { env } });
      return { env, res };
    },
    onSuccess: ({ env, res }) => {
      if ("ok" in res && res.ok) {
        setLog((l) => [
          `[${env}] OK — ${res.created ? "criado/atualizado" : "já existia"} · coupon=${res.couponId} · code=${res.promotionCode}`,
          ...l,
        ]);
      } else {
        setLog((l) => [`[${env}] ERRO — ${(res as { error: string }).error}`, ...l]);
      }
    },
    onError: (e) => {
      setLog((l) => [`ERRO — ${e instanceof Error ? e.message : String(e)}`, ...l]);
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <header>
        <h1 className="font-display text-3xl text-[var(--ink)]">
          Cupom <span className="text-gold">ACORDOS10</span>
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          10% de desconto único · expira em 90 dias · até 200 resgates. Crie em
          <strong> sandbox</strong> para testar e em <strong>live</strong> para produção.
          Operação idempotente — pode rodar de novo sem duplicar.
        </p>
      </header>

      <div className="flex gap-3">
        <Button
          onClick={() => run.mutate("sandbox")}
          disabled={run.isPending}
          variant="outline"
        >
          Criar em Sandbox
        </Button>
        <Button
          onClick={() => run.mutate("live")}
          disabled={run.isPending}
        >
          Criar em Live
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm font-mono space-y-1 min-h-[120px]">
        {log.length === 0 ? (
          <p className="text-[var(--ink-soft)]">Nenhuma ação executada ainda.</p>
        ) : (
          log.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}
