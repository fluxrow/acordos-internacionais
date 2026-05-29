import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFoundersCount, FOUNDERS_LIMIT } from "@/lib/founders.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { supabase } from "@/integrations/supabase/client";

// Lookup keys que o Lovable precisa criar via payments--batch_create_product:
//   hub_mensal      → R$ 97,00/mês   recorrente
//   hub_anual       → R$ 797,00/ano  recorrente
//   hub_fundadores  → R$ 797,00      pagamento único (acesso vitalício)
const STRIPE_ENV = "sandbox" as const;

// Plano principal (assinatura) — alternável via toggle Mensal/Anual.
const MAIN_OPTIONS = {
  mensal: {
    id: "hub_mensal",
    label: "Mensal",
    preco: "R$ 97",
    periodo: "/mês",
    desc: "Acesso completo ao Hub com cobrança mensal. Cancele quando quiser, sem multa.",
    micro: "Cancele quando quiser",
  },
  anual: {
    id: "hub_anual",
    label: "Anual",
    preco: "R$ 797",
    periodo: "/ano",
    desc: "Acesso completo ao Hub por 12 meses. Equivale a R$ 66,40/mês. Renovação opcional.",
    micro: "Economize ~32% vs. mensal (R$ 1.164/ano)",
  },
} as const;

type MainKey = keyof typeof MAIN_OPTIONS;

const FOUNDERS_PLAN = {
  id: "hub_fundadores",
  nome: "Fundadores",
  preco: "R$ 1.297",
  periodo: "único",
  desc: "Acesso vitalício para os 100 primeiros. Pague uma vez, acesse para sempre, com todas as atualizações futuras incluídas.",
} as const;

export const Route = createFileRoute("/precos")({
  component: PrecosPage,
});

function PrecosPage() {
  const [billing, setBilling] = useState<MainKey>("anual");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { data: founders } = useQuery({
    queryKey: ["founders-count"],
    queryFn: () => getFoundersCount(),
    refetchInterval: 30_000,
  });

  // Referência para o elemento do checkout embutido
  const checkoutRef = { current: null as HTMLDivElement | null };

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setAuthError(true);
        return null;
      }
      return createCheckoutSession({ data: { priceId, env: STRIPE_ENV } });
    },
    onSuccess: (result) => {
      if (!result) return;
      if ("error" in result) {
        setCheckoutError(result.error ?? "Erro ao iniciar checkout");
        return;
      }
      setClientSecret(result.clientSecret);
    },
  });

  // Monta o checkout embutido via Stripe.js quando clientSecret estiver disponível
  useEffect(() => {
    if (!clientSecret || !checkoutRef.current) return;

    // Token publicável vem do Lovable Payments (sandbox/live escolhido automaticamente pelo build)
    const publishableKey = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
    if (!publishableKey) {
      console.error("[precos] VITE_PAYMENTS_CLIENT_TOKEN não configurado");
      return;
    }

    const script = Object.assign(document.createElement("script"), {
      src: "https://js.stripe.com/v3/",
      async: true,
    });

    script.onload = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stripe = (window as any).Stripe(publishableKey);
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
      checkout.mount("#stripe-embedded-checkout");
    };

    document.head.appendChild(script);
    return () => script.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret]);

  const foundersFull = founders?.isFull ?? false;
  const foundersRemaining = founders?.remaining ?? FOUNDERS_LIMIT;

  if (clientSecret) {
    return (
      <div className="mx-auto max-w-xl px-6 py-10">
        <button
          onClick={() => { setClientSecret(null); setSelectedPlan(null); }}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar aos planos
        </button>
        <div
          id="stripe-embedded-checkout"
          ref={(el) => { checkoutRef.current = el; }}
          className="min-h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Hub Profissional</p>
        <h1 className="font-display text-5xl text-[var(--ink)]">
          Planos e <span className="text-gold">preços</span>
        </h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          Material técnico completo sobre acordos previdenciários bilaterais —
          textos, decretos, formulários e modelos para advogados previdenciaristas.
        </p>
      </div>

      {authError && (
        <div className="mx-auto mb-8 max-w-md rounded-xl border border-[var(--accent-ink)]/40 bg-[var(--card-bg)] p-4 text-center text-sm">
          <p>Você precisa estar logado para assinar.</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link
              to="/login"
              search={{ redirect: "/precos" }}
              className="rounded-full bg-[var(--accent-ink)] px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--paper)] transition-colors hover:bg-[var(--accent-ink-soft)]"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="rounded-full border border-[var(--accent-ink)] px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--accent-ink)] hover:bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)]"
            >
              Criar conta
            </Link>
          </div>
        </div>
      )}

      {checkoutError && (
        <p className="mb-6 text-center text-sm text-destructive">{checkoutError}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => {
          const isFoundersUnavailable = plan.isFounder && foundersFull;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-[var(--card-bg)] p-6 transition-all hover:-translate-y-0.5 ${
                plan.destaque || plan.isFounder
                  ? "border-[var(--accent-ink)] shadow-[var(--shadow-gold-glow)]"
                  : "border-border shadow-[var(--shadow-soft)] hover:border-[var(--accent-ink)]/60 hover:shadow-[var(--shadow-soft-hover)]"
              }`}
            >
              {plan.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-ink)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)]">
                  Mais popular
                </span>
              )}

              {plan.isFounder && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--accent-ink)] bg-[var(--paper)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                  Lançamento · 100 vagas
                </span>
              )}

              <div className="mb-4">
                <p className="eyebrow">{plan.nome}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-display text-4xl text-[var(--accent-ink)]">{plan.preco}</span>
                  <span className="mb-1 text-sm text-muted-foreground">{plan.periodo}</span>
                </div>
              </div>

              <p className="flex-1 text-sm text-[var(--ink-soft)]">{plan.desc}</p>

              {plan.isFounder && !foundersFull && (
                <p className="mt-3 text-xs font-medium text-[var(--accent-ink)]">
                  {foundersRemaining} de {FOUNDERS_LIMIT} vagas restantes
                </p>
              )}

              {plan.isFounder && foundersFull && (
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  Esgotado — todas as {FOUNDERS_LIMIT} vagas preenchidas
                </p>
              )}

              <button
                onClick={() => {
                  setAuthError(false);
                  setCheckoutError(null);
                  setSelectedPlan(plan.id);
                  checkoutMutation.mutate(plan.id);
                }}
                disabled={
                  isFoundersUnavailable ||
                  (checkoutMutation.isPending && selectedPlan === plan.id)
                }
                className={`mt-6 w-full rounded-full px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  plan.destaque || plan.isFounder
                    ? "bg-[var(--accent-ink)] text-[var(--paper)] shadow-[var(--shadow-soft)] hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
                    : "border border-[var(--accent-ink)] text-[var(--accent-ink)] hover:bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)]"
                }`}
              >
                {checkoutMutation.isPending && selectedPlan === plan.id
                  ? "Aguarde…"
                  : isFoundersUnavailable
                  ? "Esgotado"
                  : "Assinar"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem acesso completo aos 24 acordos previdenciários,
          documentos oficiais, formulários e modelos. Dúvidas?{" "}
          <Link to="/contato" className="underline hover:text-foreground">
            Fale conosco
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
