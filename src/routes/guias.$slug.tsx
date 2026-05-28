import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { guias, getGuia, type Guia } from "@/data/guias";
import { jornadas } from "@/data/jornadas";
import { acordos } from "@/data/acordos";
import { CTAMarcos } from "@/components/cta-marcos";

export const Route = createFileRoute("/guias/$slug")({
  head: ({ params }) => {
    const g = getGuia(params.slug);
    if (!g) return { meta: [{ title: "Guia não encontrado" }] };
    const title = `${g.titulo} | Guias`;
    return {
      meta: [
        { title },
        { name: "description", content: g.resumo },
        { property: "og:title", content: g.titulo },
        { property: "og:description", content: g.resumo },
      ],
    };
  },
  loader: ({ params }) => {
    const g = getGuia(params.slug);
    if (!g) throw notFound();
    return { guia: g };
  },
  component: GuiaPage,
});

function GuiaPage() {
  const { guia: g } = Route.useLoaderData() as { guia: Guia };
  const jornadasRelacionadas = jornadas.filter((j) => j.guiaRelacionado === g.slug);
  const pais = g.paisRelacionado ? acordos.find((a) => a.slug === g.paisRelacionado) : undefined;
  const temRelacionado = jornadasRelacionadas.length > 0 || !!pais;

  return (
    <article>
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline underline-offset-4">Início</Link>
            <span aria-hidden> / </span>
            <Link to="/guias" className="hover:underline underline-offset-4">Guias</Link>
          </nav>
          <p className="eyebrow mt-6">Guia temático</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{g.titulo}</h1>
          <p className="lede mt-6 max-w-2xl">{g.resumo}</p>
        </div>
      </header>

      {/* BLOCOS + TOC */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_280px]">
        <ol className="space-y-12">
          {g.blocos.map((b, i) => (
            <li
              key={b.titulo}
              id={`bloco-${i + 1}`}
              className="scroll-mt-24 grid grid-cols-[auto_1fr] gap-6 border-b border-border/60 pb-12 last:border-0"
            >
              <span className="font-display text-5xl text-[var(--accent-ink)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl">{b.titulo}</h2>
                <div className="mt-4 space-y-4">
                  {b.conteudo.map((p, idx) => (
                    <p key={idx} className="text-base leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <aside className="md:sticky md:top-6 md:self-start">
          <div className="border border-border p-6">
            <p className="eyebrow">Neste guia</p>
            <ol className="mt-4 space-y-3 text-sm">
              {g.blocos.map((b, i) => (
                <li key={b.titulo}>
                  <a
                    href={`#bloco-${i + 1}`}
                    className="group flex gap-3 text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="font-display text-[var(--accent-ink)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="underline-offset-4 group-hover:underline">
                      {b.titulo}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6">
            <CTAMarcos />
          </div>
        </aside>
      </section>

      {/* RELACIONADO */}
      {temRelacionado && (
        <section className="border-t border-border bg-[var(--accent-ink-soft)]/40">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[var(--accent-ink)]" />
              <p className="eyebrow">Relacionado</p>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-4xl leading-tight">
              Use este guia em contexto
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-12">
              {jornadasRelacionadas.length > 0 && (
                <div className="md:col-span-5">
                  <p className="eyebrow text-[var(--accent-ink)]">Jornadas que usam este guia</p>
                  <ol className="mt-5 divide-y divide-border/70">
                    {jornadasRelacionadas.map((j, i) => (
                      <li key={j.slug} className="py-3">
                        <Link
                          to="/jornadas/$jornada"
                          params={{ jornada: j.slug }}
                          className="group flex items-baseline gap-4"
                        >
                          <span className="font-display text-sm text-[var(--accent-ink)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-xl underline-offset-4 group-hover:underline">
                            {j.titulo}
                          </span>
                          <span
                            aria-hidden
                            className="ml-auto text-[var(--accent-ink)] transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {pais && (
                <div className="md:col-span-4 border-l-2 border-[var(--accent-ink)] bg-background p-6">
                  <p className="eyebrow">Acordo destacado</p>
                  <p className="mt-3 font-display text-2xl leading-tight">{pais.nome}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Veja como este tema se aplica ao acordo com {pais.nome}.
                  </p>
                  <Link
                    to="/acordos/$pais"
                    params={{ pais: pais.slug }}
                    className="mt-5 inline-block text-sm underline underline-offset-4 hover:text-destructive"
                  >
                    Abrir ficha →
                  </Link>
                </div>
              )}

              <div className="md:col-span-3 bg-card text-card-foreground border border-border p-6">
                <p className="eyebrow text-background/70">Ferramenta</p>
                <p className="mt-3 font-display text-2xl leading-tight">
                  Calculadora prorata
                </p>
                <p className="mt-2 text-sm text-background/70">
                  Estime sua parte proporcional em cada país acordante.
                </p>
                <Link
                  to="/calculadora"
                  className="mt-5 inline-block text-sm underline underline-offset-4 text-background hover:text-[var(--accent-ink-soft)]"
                >
                  Abrir calculadora →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OUTROS GUIAS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:grid md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[var(--accent-ink)]" />
              <p className="eyebrow">Outros guias</p>
            </div>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {guias
                .filter((x) => x.slug !== g.slug)
                .map((x, i) => (
                  <li key={x.slug}>
                    <Link
                      to="/guias/$slug"
                      params={{ slug: x.slug }}
                      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 px-2 py-6 transition-colors hover:bg-[var(--accent-ink-soft)]/40"
                    >
                      <span className="font-display text-2xl text-[var(--accent-ink)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl leading-tight">
                        {x.titulo}
                      </span>
                      <span
                        aria-hidden
                        className="text-[var(--accent-ink)] transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <CTAMarcos variant="block" />
    </article>
  );
}
