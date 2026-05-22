import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { jornadas, getJornada } from "@/data/jornadas";
import { acordos } from "@/data/acordos";
import { getGuia } from "@/data/guias";
import { CTAMarcos } from "@/components/cta-marcos";

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

function JornadaPage() {
  const { jornada: j } = Route.useLoaderData();
  const paises = (j.paisesRelacionados ?? [])
    .map((s) => acordos.find((a) => a.slug === s))
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
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 top-6 select-none font-display text-[12rem] leading-none text-[var(--accent-ink)] opacity-[0.06] md:text-[18rem]"
        >
          00
        </span>
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
        <ol className="space-y-12">
          {j.passos.map((p, i) => (
            <li
              key={p.titulo}
              id={`passo-${i + 1}`}
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

        <aside className="md:sticky md:top-6 md:self-start">
          <div className="border border-border p-6">
            <p className="eyebrow">Nesta jornada</p>
            <ol className="mt-4 space-y-3 text-sm">
              {j.passos.map((p, i) => (
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

      {/* RELACIONADO */}
      {(paises.length > 0 || guia) && (
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="eyebrow">Relacionado</p>
            <h2 className="mt-3 font-display text-3xl">
              Aprofunde no que importa para o seu caso
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {paises.length > 0 && (
                <div className="border border-border bg-background p-6">
                  <p className="eyebrow">Países relevantes</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    {paises.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to="/acordos/$pais"
                          params={{ pais: a.slug }}
                          className="ink-link"
                        >
                          {a.nome} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {guia && (
                <div className="border border-border bg-background p-6">
                  <p className="eyebrow">Guia recomendado</p>
                  <p className="mt-3 font-display text-xl leading-tight">
                    {guia.titulo}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {guia.resumo}
                  </p>
                  <Link
                    to="/guias/$slug"
                    params={{ slug: guia.slug }}
                    className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-destructive"
                  >
                    Abrir guia →
                  </Link>
                </div>
              )}
              <div className="border border-border bg-background p-6">
                <p className="eyebrow">Ferramenta</p>
                <p className="mt-3 font-display text-xl leading-tight">
                  Calculadora prorata
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estime sua parte proporcional em cada país acordante.
                </p>
                <Link
                  to="/calculadora"
                  className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-destructive"
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
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="eyebrow">Outras jornadas</p>
          <ul className="mt-4 grid gap-px border border-border bg-border md:grid-cols-3">
            {jornadas
              .filter((x) => x.slug !== j.slug)
              .map((x) => (
                <li key={x.slug} className="bg-background">
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: x.slug }}
                    className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-[var(--accent-ink-soft)]"
                  >
                    <span className="font-display text-lg leading-tight">
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
      </section>

      <CTAMarcos variant="block" contexto={j.cta} />
    </article>
  );
}
