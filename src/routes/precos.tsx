import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFoundersCount, FOUNDERS_LIMIT } from "@/lib/founders.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { siteStats } from "@/data/site-stats";
import { supabase } from "@/integrations/supabase/client";

// Lookup keys que o Lovable precisa criar via payments--batch_create_product:
//   hub_mensal      → R$ 87,00/mês   recorrente
//   hub_anual       → R$ 837,00/ano  recorrente
//   hub_fundadores  → R$ 1.297,00    pagamento único (acesso vitalício)

// Ambiente derivado do prefixo do token publicável (pk_test_ → sandbox,
// pk_live_ → live). NUNCA hardcodar "sandbox" — em produção isso quebra
// o checkout (mismatch entre token live e client_secret sandbox).
const PUBLISHABLE_KEY = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
function detectStripeEnv(): "sandbox" | "live" | null {
  if (PUBLISHABLE_KEY?.startsWith("pk_test_")) return "sandbox";
  if (PUBLISHABLE_KEY?.startsWith("pk_live_")) return "live";
  return null;
}
const STRIPE_ENV = detectStripeEnv();


// Plano principal (assinatura) — alternável via toggle Mensal/Anual.
const MAIN_OPTIONS = {
  mensal: {
    id: "hub_mensal",
    label: "Mensal",
    preco: "R$ 87",
    periodo: "/mês",
    desc: "Acesso completo ao Hub com cobrança mensal. Cancele quando quiser, sem multa.",
    micro: "Cancele quando quiser",
  },
  anual: {
    id: "hub_anual",
    label: "Anual",
    preco: "R$ 837",
    periodo: "/ano",
    desc: "Acesso completo ao Hub por 12 meses. Equivale a R$ 69,75/mês. Renovação opcional.",
    micro: "Economize ~20% vs. mensal (R$ 1.044/ano)",
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

  // Referência ao container do checkout embutido — useRef para sobreviver re-renders
  const checkoutRef = useRef<HTMLDivElement | null>(null);

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      if (!STRIPE_ENV) {
        throw new Error(
          "Pagamentos não estão configurados nesta build. Tente novamente em alguns minutos.",
        );
      }
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setAuthError(true);
        return null;
      }
      return createCheckoutSession({ data: { priceId, env: STRIPE_ENV! } });
    },
    onSuccess: (result) => {
      if (!result) return;
      if ("error" in result) {
        setCheckoutError(result.error ?? "Erro ao iniciar checkout");
        return;
      }
      setCheckoutError(null);
      setClientSecret(result.clientSecret);
    },
    onError: (err) => {
      setCheckoutError(err instanceof Error ? err.message : "Erro ao iniciar checkout");
    },
  });

  // Monta o checkout embutido via Stripe.js quando clientSecret estiver disponível.
  // Aguarda o container montar (a tela troca quando clientSecret é setado),
  // por isso poll curto em vez de checagem síncrona do ref.
  useEffect(() => {
    if (!clientSecret) return;
    if (!PUBLISHABLE_KEY) {
      setCheckoutError("Pagamentos não configurados nesta build.");
      return;
    }

    let cancelled = false;
    let cleanupCheckout: (() => void) | null = null;

    const ensureStripeJs = () =>
      new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).Stripe) return resolve();
        const existing = document.querySelector<HTMLScriptElement>(
          'script[src="https://js.stripe.com/v3/"]',
        );
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Falha ao carregar Stripe.js")), { once: true });
          return;
        }
        const script = Object.assign(document.createElement("script"), {
          src: "https://js.stripe.com/v3/",
          async: true,
        });
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Falha ao carregar Stripe.js"));
        document.head.appendChild(script);
      });

    const waitForContainer = () =>
      new Promise<HTMLElement>((resolve, reject) => {
        const t0 = Date.now();
        const tick = () => {
          if (cancelled) return reject(new Error("cancelled"));
          const el = document.getElementById("stripe-embedded-checkout");
          if (el) return resolve(el);
          if (Date.now() - t0 > 4000) return reject(new Error("Container do checkout não encontrado"));
          setTimeout(tick, 30);
        };
        tick();
      });

    (async () => {
      try {
        await ensureStripeJs();
        if (cancelled) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stripe = (window as any).Stripe(PUBLISHABLE_KEY);
        const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
        if (cancelled) {
          checkout.destroy?.();
          return;
        }
        await waitForContainer();
        if (cancelled) {
          checkout.destroy?.();
          return;
        }
        checkout.mount("#stripe-embedded-checkout");
        cleanupCheckout = () => checkout.destroy?.();
      } catch (e) {
        if (!cancelled) {
          setCheckoutError(e instanceof Error ? e.message : "Erro ao abrir o checkout");
        }
      }
    })();

    return () => {
      cancelled = true;
      cleanupCheckout?.();
    };
  }, [clientSecret]);


  const foundersFull = founders?.isFull ?? false;
  const foundersRemaining = founders?.remaining ?? FOUNDERS_LIMIT;

  if (clientSecret) {
    return (
      <div className="mx-auto max-w-xl px-6 py-10">
        <button
          onClick={() => { setClientSecret(null); setSelectedPlan(null); setCheckoutError(null); }}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar aos planos
        </button>
        {STRIPE_ENV === "sandbox" && (
          <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-700 dark:text-amber-300">
            Ambiente de teste — use o cartão 4242 4242 4242 4242, validade futura e CVC 123.
          </div>
        )}
        {checkoutError && (
          <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {checkoutError}
          </p>
        )}
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
      {STRIPE_ENV === "sandbox" && (
        <div className="mx-auto mb-6 max-w-3xl rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-700 dark:text-amber-300">
          Pagamentos em modo de teste — esta preview não cobra de verdade. A produção (acordosinternacionais.com) usa Stripe live.
        </div>
      )}
      {STRIPE_ENV === null && (
        <div className="mx-auto mb-6 max-w-3xl rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          Pagamentos indisponíveis nesta build. Tente novamente em instantes.
        </div>
      )}
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
        {/* Card principal — Mensal / Anual com toggle */}
        {(() => {
          const main = MAIN_OPTIONS[billing];
          const isAnual = billing === "anual";
          const isPending = checkoutMutation.isPending && selectedPlan === main.id;
          return (
            <div className="relative flex flex-col rounded-2xl border border-[var(--accent-ink)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-gold-glow)] transition-all hover:-translate-y-0.5">
              {isAnual && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-ink)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)]">
                  Mais popular
                </span>
              )}

              {/* Segmented toggle Mensal / Anual */}
              <div
                role="tablist"
                aria-label="Periodicidade de cobrança"
                className="mb-5 inline-flex self-start rounded-full border border-[var(--accent-ink)]/40 bg-[var(--paper)] p-1"
              >
                {(Object.keys(MAIN_OPTIONS) as MainKey[]).map((k) => {
                  const active = k === billing;
                  return (
                    <button
                      key={k}
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setBilling(k);
                        setAuthError(false);
                        setCheckoutError(null);
                      }}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                        active
                          ? "bg-[var(--accent-ink)] text-[var(--paper)] shadow-[var(--shadow-soft)]"
                          : "text-[var(--accent-ink)] hover:bg-[color-mix(in_oklab,var(--accent-ink)_10%,transparent)]"
                      }`}
                    >
                      {MAIN_OPTIONS[k].label}
                    </button>
                  );
                })}
              </div>

              <div className="mb-4">
                <p className="eyebrow">{main.label}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-display text-4xl text-[var(--accent-ink)]">{main.preco}</span>
                  <span className="mb-1 text-sm text-muted-foreground">{main.periodo}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-[var(--accent-ink)]">{main.micro}</p>
              </div>

              <p className="flex-1 text-sm text-[var(--ink-soft)]">{main.desc}</p>

              <button
                onClick={() => {
                  setAuthError(false);
                  setCheckoutError(null);
                  setSelectedPlan(main.id);
                  checkoutMutation.mutate(main.id);
                }}
                disabled={isPending}
                className="mt-6 w-full rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Aguarde…" : "Assinar"}
              </button>
            </div>
          );
        })()}

        {/* Card Fundadores */}
        {(() => {
          const plan = FOUNDERS_PLAN;
          const unavailable = foundersFull;
          const isPending = checkoutMutation.isPending && selectedPlan === plan.id;
          return (
            <div className="relative flex flex-col rounded-2xl border border-[var(--accent-ink)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-gold-glow)] transition-all hover:-translate-y-0.5">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--accent-ink)] bg-[var(--paper)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                Lançamento · 100 vagas
              </span>

              <div className="mb-4">
                <p className="eyebrow">{plan.nome}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-display text-4xl text-[var(--accent-ink)]">{plan.preco}</span>
                  <span className="mb-1 text-sm text-muted-foreground">{plan.periodo}</span>
                </div>
              </div>

              <p className="flex-1 text-sm text-[var(--ink-soft)]">{plan.desc}</p>

              {!unavailable ? (
                <p className="mt-3 text-xs font-medium text-[var(--accent-ink)]">
                  {foundersRemaining} de {FOUNDERS_LIMIT} vagas restantes
                </p>
              ) : (
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
                disabled={unavailable || isPending}
                className="mt-6 w-full rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Aguarde…" : unavailable ? "Esgotado" : "Garantir vaga"}
              </button>
            </div>
          );
        })()}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem acesso completo aos {siteStats.acordosMapeados} acordos
          previdenciários mapeados ({siteStats.acordosVigentes} em vigor +{" "}
          {siteStats.acordosEmRatificacao} em ratificação), documentos oficiais,
          formulários e modelos. Dúvidas?{" "}
          <Link to="/contato" className="underline hover:text-foreground">
            Fale conosco
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
