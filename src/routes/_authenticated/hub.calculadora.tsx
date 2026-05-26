import { createFileRoute, Link } from "@tanstack/react-router";
import { CalculadoraFormPro } from "@/components/calculadora-form-pro";
import { CalcHistoryList } from "@/components/hub/calc-history-list";

export const Route = createFileRoute("/_authenticated/hub/calculadora")({
  head: () => ({
    meta: [
      { title: "Calculadora RMI Pro-rata · Hub do Advogado" },
      {
        name: "description",
        content:
          "Ferramenta profissional para cálculo de RMI pro-rata. Exclusivo para assinantes.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CalculadoraProPage,
});

function CalculadoraProPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-background/70 print:hidden">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/hub" className="hover:text-[var(--accent-ink)] hover:underline underline-offset-4">
              Hub Profissional
            </Link>
            <span aria-hidden>/</span>
            <span>Calculadora RMI</span>
          </nav>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            Hub do Advogado
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Calculadora RMI Pro-rata
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Laudo técnico com tabela detalhada, fórmulas e rodapé identificável — pronto
            para impressão ou anexo ao processo administrativo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <CalculadoraFormPro />
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 print:hidden">
        <h2 className="font-display text-2xl mb-4">Cálculos recentes</h2>
        <CalcHistoryList />
      </section>
    </main>
  );
}
