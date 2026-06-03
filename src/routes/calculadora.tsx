import { createFileRoute, Link } from "@tanstack/react-router";
import { CalculadoraForm } from "@/components/calculadora-form";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "Calculadora de Benefício Internacional · Acordos" },
      {
        name: "description",
        content:
          "Calcule gratuitamente seu benefício por totalização internacional. Aposentadoria por idade e pensão por morte com acordos do INSS.",
      },
      { property: "og:title", content: "Calculadora de Benefício Internacional" },
      {
        property: "og:description",
        content:
          "Trabalhei no exterior e tenho direito? Descubra em minutos com nossa calculadora gratuita de totalização previdenciária.",
      },
      { property: "og:url", content: "https://acordosinternacionais.com/calculadora" },
    ],
    links: [
      { rel: "canonical", href: "https://acordosinternacionais.com/calculadora" },
    ],
  }),
  component: CalculadoraPublicaPage,
});

function CalculadoraPublicaPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 bg-[var(--paper-soft)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_30%,_color-mix(in_oklab,_var(--accent-ink)_18%,_transparent)_0%,_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-[var(--accent-ink)] hover:underline underline-offset-4">
              Início
            </Link>
            <span aria-hidden>/</span>
            <span>Calculadora</span>
          </nav>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            Ferramenta gratuita
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
            Calculadora de <span className="text-gold">benefício</span> por totalização internacional
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--ink-soft)]">
            Trabalhou no Brasil e no exterior? Some os períodos conforme o acordo bilateral
            do INSS e descubra se você tem direito a aposentadoria por idade ou pensão por
            morte.
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground text-slate-100">
            Sem Custo · Resultado em 2 minutos
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <CalculadoraForm />
        <p className="mt-6 rounded-xl border border-border bg-[var(--paper-soft)] px-4 py-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Resultado estimado.</strong>{" "}
          A análise oficial depende dos dados completos do CNIS, documentos
          estrangeiros, regras do país acordante e da decisão do INSS.
        </p>
      </section>
    </main>
  );
}
