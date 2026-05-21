import { createFileRoute, Link } from "@tanstack/react-router";
import { CalculadoraForm } from "@/components/calculadora-form";

const TITLE = "Calculadora RMI Pro-rata · Hub do Advogado";
const DESC =
  "Ferramenta profissional para cálculo de RMI pro-rata em acordos internacionais. Exclusivo para assinantes.";

export const Route = createFileRoute("/_authenticated/hub/calculadora")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CalculadoraPro,
});

function CalculadoraPro() {
  return (
    <>
      <section className="border-b border-border/60 bg-background/70 print:hidden">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-12">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/hub" className="hover:text-[var(--accent-ink)] hover:underline underline-offset-4">
              Hub Profissional
            </Link>
            <span aria-hidden>/</span>
            <span>Calculadora RMI</span>
          </nav>
          <p className="eyebrow mt-6">Ferramenta técnica</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">
            Calculadora RMI pro-rata
          </h1>
          <p className="lede mt-4 max-w-2xl">
            Cálculo formal de totalização internacional para uso em pareceres,
            petições e atendimento ao cliente. Saída pronta para impressão e PDF.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 md:py-14 print:py-0">
        <CalculadoraForm variant="pro" />
      </section>
    </>
  );
}
