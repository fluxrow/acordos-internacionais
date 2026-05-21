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
      <section className="border-b border-border/60 bg-[radial-gradient(ellipse_at_15%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)]">
        <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
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
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Calculadora de benefício por totalização internacional
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Trabalhou no Brasil e no exterior? Some os períodos conforme o acordo bilateral
            do INSS e descubra se você tem direito a aposentadoria por idade ou pensão por
            morte — e qual seria o valor estimado pelo pro-rata.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <CalculadoraForm variant="public" />
      </section>
    </main>
  );
}
