import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { jornadas, getJornada } from "@/data/jornadas";
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

function JornadaPage() {
  const { jornada: j } = Route.useLoaderData();

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline underline-offset-4">Início</Link>
            <span aria-hidden> / </span>
            <span>Jornadas</span>
          </nav>
          <p className="eyebrow mt-6">Jornada · {j.publico}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{j.titulo}</h1>
          <p className="lede mt-6 max-w-2xl">{j.resumo}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px]">
        <ol className="space-y-12">
          {j.passos.map((p: { titulo: string; descricao: string }, i: number) => (
            <li key={p.titulo} className="grid grid-cols-[auto_1fr] gap-6 border-b border-border pb-12 last:border-0">
              <span className="font-display text-5xl text-muted-foreground">
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
          <CTAMarcos contexto={j.cta} />
          <div className="mt-6 border border-border p-6">
            <p className="eyebrow">Outras jornadas</p>
            <ul className="mt-4 space-y-3 text-sm">
              {jornadas
                .filter((x) => x.slug !== j.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link
                      to="/jornadas/$jornada"
                      params={{ jornada: x.slug }}
                      className="ink-link"
                    >
                      {x.titulo} →
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </section>

      <CTAMarcos variant="block" contexto={j.cta} />
    </article>
  );
}
