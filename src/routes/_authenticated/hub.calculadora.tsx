import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, FileText, Sparkles, ShieldCheck } from "lucide-react";
import { CalculadoraFormPro } from "@/components/calculadora-form-pro";
import { CalcHistoryList } from "@/components/hub/calc-history-list";
import { SectionCard } from "@/components/hub/section-card";

export const Route = createFileRoute("/_authenticated/hub/calculadora")({
  head: () => ({
    meta: [
      { title: "Calculadora Totalização · Hub do Advogado" },
      {
        name: "description",
        content:
          "Ferramenta profissional para cálculo de RMI pró-rata. Exclusivo para assinantes.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CalculadoraProPage,
});

function CalculadoraProPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background">
      {/* Header compacto premium */}
      <section className="border-b border-border/60 bg-[var(--surface-premium)] print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Workstation · Cálculo
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Calculadora <span className="text-gold">Totalização</span>
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Laudo técnico com tabela detalhada, fórmulas e rodapé identificável
              — pronto para impressão ou anexo ao processo administrativo.
            </p>
          </div>
          <Link
            to="/hub/laudos"
            className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[var(--rule-gold-strong)] hover:text-[var(--accent-ink)]"
          >
            <FileText className="h-3.5 w-3.5" />
            Ver laudos gerados
          </Link>
        </div>
      </section>

      {/* IDE 2-col workstation */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Coluna principal: formulário */}
          <div className="lg:col-span-8 xl:col-span-9">
            <SectionCard gold>
              <header className="mb-5 flex items-center gap-2 border-b border-border/50 pb-3">
                <Calculator className="h-4 w-4 text-[var(--accent-ink)]" />
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  Editor de cálculo
                </h2>
              </header>
              <CalculadoraFormPro />
            </SectionCard>
          </div>

          {/* Rail lateral sticky */}
          <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
            <div className="sticky top-16 space-y-4">
              <SectionCard>
                <h3 className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                  Resumo do método
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent-ink)]">·</span>
                    Prestação <strong className="text-foreground">teórica</strong>{" "}
                    com SB do RGPS aplicada ao coeficiente do país.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent-ink)]">·</span>
                    <strong className="text-foreground">Pró-rata</strong>{" "}
                    proporcional ao tempo contribuído no Brasil.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent-ink)]">·</span>
                    Carências: <strong className="text-foreground">180 m</strong>{" "}
                    (idade) · <strong className="text-foreground">18 m</strong>{" "}
                    (pensão).
                  </li>
                </ul>
              </SectionCard>

              <SectionCard>
                <h3 className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                  Boas práticas
                </h3>
                <p className="mt-3 text-xs text-muted-foreground">
                  Carregue o CNIS em PDF para autopreencher SB e tempo. Os campos
                  manuais são sobrescritos quando o CNIS é reconhecido.
                </p>
              </SectionCard>
            </div>
          </aside>
        </div>
      </section>

      {/* Histórico denso */}
      <section className="mx-auto max-w-7xl px-6 pb-12 print:hidden">
        <SectionCard>
          <header className="mb-4 flex items-center justify-between gap-2 border-b border-border/50 pb-3">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              <FileText className="h-4 w-4 text-[var(--accent-ink)]" />
              Cálculos recentes
            </h2>
            <Link
              to="/hub/laudos"
              className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-[var(--accent-ink)]"
            >
              Todos os laudos →
            </Link>
          </header>
          <CalcHistoryList />
        </SectionCard>
      </section>
    </main>
  );
}
