import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJornada } from "@/data/jornadas";
import { CTAButton } from "@/components/cta-button";
import { ProvaDeVidaBlock } from "@/components/preview/prova-de-vida-block";
import { PlanejamentoTotalizacaoBlock } from "@/components/preview/planejamento-totalizacao-block";

export const Route = createFileRoute("/preview/jornadas/$jornada")({
  head: ({ params }) => ({
    meta: [
      {
        title: `Pré-visualização · Jornada ${params.jornada} | Briefing Dr. Marcos`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ params }) => {
    const j = getJornada(params.jornada);
    if (!j) throw notFound();
    return { jornada: j };
  },
  component: PreviewJornada,
});

function PreviewJornada() {
  const { jornada } = Route.useLoaderData();
  const slug = jornada.slug;

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/preview" className="hover:underline underline-offset-4">
              Preview
            </Link>
            <span aria-hidden> / </span>
            <Link to="/preview/jornadas" className="hover:underline underline-offset-4">
              Jornadas
            </Link>
          </nav>

          <p className="eyebrow mt-6">{jornada.publico}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{jornada.titulo}</h1>
          <p className="lede mt-6 max-w-2xl">{jornada.resumo}</p>
        </div>
      </header>

      {/* Passos originais */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <p className="eyebrow">Passo a passo</p>
        <ol className="mt-6 space-y-6">
          {jornada.passos.map((p, i) => (
            <li
              key={p.titulo}
              className="rounded-2xl border border-border bg-background p-6 md:p-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-2xl text-[var(--accent-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl md:text-2xl">{p.titulo}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.descricao}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bloco novo conforme briefing */}
      {slug === "moro-fora" && <ProvaDeVidaBlock />}
      {slug === "estou-voltando" && <PlanejamentoTotalizacaoBlock />}

      {/* CTA Marcos no fim */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="eyebrow">Cada caso é único</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{jornada.cta}</h2>
        <div className="mt-8 flex justify-center">
          <CTAButton
            to="/contato"
            variant="dark"
            size="lg"
            label="Falar com o Dr. Marcos"
          />
        </div>
      </section>
    </article>
  );
}
