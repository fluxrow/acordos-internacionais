import { createFileRoute } from "@tanstack/react-router";
import { CalculadoraForm } from "@/components/calculadora-form";

const TITLE = "Calculadora de Benefício Internacional · Acordos";
const DESC =
  "Calcule gratuitamente seu benefício por totalização internacional. Aposentadoria por idade e pensão por morte com acordos do INSS.";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: CalculadoraPublica,
});

function CalculadoraPublica() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="eyebrow">Calculadora do segurado</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">
            Você tem direito a se aposentar somando Brasil e exterior?
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Estimativa rápida e gratuita do seu benefício por totalização internacional.
            Envie seu CNIS em PDF ou preencha manualmente — o cálculo é feito no seu navegador.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <CalculadoraForm variant="public" />

        <p className="mt-12 text-xs leading-relaxed text-muted-foreground">
          Esta calculadora é informativa e não substitui análise jurídica. O cálculo
          definitivo depende do exame do CNIS, do certificado de tempo do país parceiro
          e da legislação aplicável a cada acordo. Os dados informados não são enviados
          a servidores — todo o processamento ocorre no seu navegador.
        </p>
      </section>
    </>
  );
}
