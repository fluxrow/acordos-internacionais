import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { jornadas, getJornada, type Jornada, type JornadaPasso } from "@/data/jornadas";
import { acordos } from "@/data/acordos";
import { getGuia } from "@/data/guias";
import { CTAMarcos } from "@/components/cta-marcos";
import { ProvaDeVidaBlock } from "@/components/jornadas/prova-de-vida-block";
import { PlanejamentoTotalizacaoBlock } from "@/components/jornadas/planejamento-totalizacao-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/jornadas/$jornada")({
  head: ({ params }) => {
    const j = getJornada(params.jornada);
    if (!j) return { meta: [{ title: "Jornada não encontrada" }] };
    const title = `${j.titulo} | Jornadas`;
    return {
      meta: [
        { title },
        { name: "description", content: j.resumo },
        { property: "og:title", content: j.titulo },
        { property: "og:description", content: j.resumo },
      ],
    };
  },
  loader: ({ params }) => {
    const j = getJornada(params.jornada);
    if (!j) throw notFound();
    return { jornada: j };
  },
  component: JornadaPage,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function PassosList({ passos, idPrefix }: { passos: JornadaPasso[]; idPrefix?: string }) {
  return (
    <ol className="space-y-12">
      {passos.map((p, i) => (
        <li
          key={p.titulo}
          id={`${idPrefix ? `${idPrefix}-` : ""}passo-${i + 1}`}
          className="scroll-mt-24 grid grid-cols-[auto_1fr] gap-6 border-b border-border/60 pb-12 last:border-0"
        >
          <span className="font-display text-5xl text-[var(--accent-ink)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h2 className="font-display text-2xl md:text-3xl">{p.titulo}</h2>
            <p className="mt-3 text-base leading-relaxed">{p.descricao}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function JornadaPage() {
  const { jornada: j } = Route.useLoaderData() as { jornada: Jornada };
  const paises = (j.paisesRelacionados ?? [])
    .map((s: string) => acordos.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const guia = j.guiaRelacionado ? getGuia(j.guiaRelacionado) : undefined;

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
            <Link to="/" className="hover:underline underline-offset-4">
              Início
            </Link>
            <span aria-hidden> / </span>
            <Link to="/jornadas" className="hover:underline underline-offset-4">
              Jornadas
            </Link>
          </nav>
          <p className="eyebrow mt-6">Jornada · {j.publico}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{j.titulo}</h1>
          <p className="lede mt-6 max-w-2xl">{j.resumo}</p>
        </div>
      </header>

      {/* PASSOS + TOC */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_280px]">
        <div>
          {j.trilhas && j.trilhas.length > 0 ? (
            <Tabs defaultValue={j.trilhas[0].id}>
              <TabsList className="mb-8 flex flex-wrap gap-2 bg-transparent p-0">
                {j.trilhas.map((t) => (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm data-[state=active]:border-[var(--accent-ink)] data-[state=active]:bg-secondary/60"
                  >
                    {t.titulo}
                  </TabsTrigger>
                ))}
              </TabsList>
              {j.trilhas.map((t) => (
                <TabsContent key={t.id} value={t.id} className="space-y-8">
                  <p className="lede max-w-2xl">{t.resumo}</p>
                  <PassosList passos={t.passos} idPrefix={t.id} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <PassosList passos={j.passos} />
          )}
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <div className="border border-border p-6">
            <p className="eyebrow">Nesta jornada</p>
            <ol className="mt-4 space-y-3 text-sm">
              {j.passos.map((p: JornadaPasso, i: number) => (
                <li key={p.titulo}>
                  <a
                    href={`#passo-${i + 1}`}
                    className="group flex gap-3 text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="font-display text-[var(--accent-ink)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="underline-offset-4 group-hover:underline">
                      {p.titulo}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6">
            <CTAMarcos contexto={j.cta} />
          </div>
        </aside>
      </section>

      {/* Bloco específico por jornada (promovido do preview) */}
      {j.slug === "moro-fora" && <ProvaDeVidaBlock />}
      {j.slug === "estou-voltando" && <PlanejamentoTotalizacaoBlock />}


      {/* RELACIONADO */}
      {(paises.length > 0 || guia) && (
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[var(--accent-ink)]" />
              <p className="eyebrow">Relacionado</p>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-4xl leading-tight">
              Aprofunde no que importa para o seu caso
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-12">
              {paises.length > 0 && (
                <div className="md:col-span-5">
                  <p className="eyebrow text-[var(--accent-ink)]">Países relevantes</p>
                  <ol className="mt-5 divide-y divide-border/70">
                    {paises.map((a: NonNullable<ReturnType<typeof acordos.find>>, i: number) => (
                      <li key={a.slug} className="py-3">
                        <Link
                          to="/acordos/$pais"
                          params={{ pais: a.slug }}
                          className="group flex items-baseline gap-4"
                        >
                          <span className="font-display text-sm text-[var(--accent-ink)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-xl underline-offset-4 group-hover:underline">
                            {a.nome}
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

              {guia && (
                <div className="md:col-span-4 border-l-2 border-[var(--accent-ink)] bg-background p-6">
                  <p className="eyebrow">Guia recomendado</p>
                  <p className="mt-3 font-display text-2xl leading-tight">
                    {guia.titulo}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{guia.resumo}</p>
                  <Link
                    to="/guias/$slug"
                    params={{ slug: guia.slug }}
                    className="mt-5 inline-block text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
                  >
                    Abrir guia →
                  </Link>
                </div>
              )}

              <div className="md:col-span-3 bg-card text-card-foreground border border-border p-6">
                <p className="eyebrow text-card-foreground/70">Ferramenta</p>
                <p className="mt-3 font-display text-2xl leading-tight">
                  Calculadora Totalização
                </p>
                <p className="mt-2 text-sm text-card-foreground/70">
                  Estime sua parte proporcional em cada país acordante.
                </p>
                <Link
                  to="/calculadora"
                  className="mt-5 inline-block text-sm underline underline-offset-4 text-card-foreground hover:text-[var(--accent-ink-soft)]"
                >
                  Abrir calculadora →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OUTRAS JORNADAS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:grid md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[var(--accent-ink)]" />
              <p className="eyebrow">Outras jornadas</p>
            </div>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {jornadas
                .filter((x) => x.slug !== j.slug)
                .map((x, i) => (
                  <li key={x.slug}>
                    <Link
                      to="/jornadas/$jornada"
                      params={{ jornada: x.slug }}
                      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 px-2 py-6 transition-colors hover:bg-secondary/40"
                    >
                      <span className="font-display text-2xl text-[var(--accent-ink)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl leading-tight">
                        {x.titulo}
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="hidden md:inline text-xs uppercase tracking-wider text-muted-foreground">
                          {x.publico}
                        </span>
                        <span
                          aria-hidden
                          className="text-[var(--accent-ink)] transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <CTAMarcos variant="block" contexto={j.cta} />
    </article>
  );
}
