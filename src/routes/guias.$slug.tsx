import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { guias, getGuia } from "@/data/guias";
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
  const { guia: g } = Route.useLoaderData();

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline underline-offset-4">Início</Link>
            <span aria-hidden> / </span>
            <span>Guias</span>
          </nav>
          <p className="eyebrow mt-6">Guia temático</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{g.titulo}</h1>
          <p className="lede mt-6 max-w-2xl">{g.resumo}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          {g.blocos.map((b: { titulo: string; conteudo: string[] }) => (
            <section key={b.titulo}>
              <h2 className="font-display text-2xl md:text-3xl">{b.titulo}</h2>
              <hr className="rule mt-3" />
              <div className="mt-4 space-y-4">
                {b.conteudo.map((p: string, i: number) => (
                  <p key={i} className="text-base leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <CTAMarcos />
          <div className="mt-6 border border-border p-6">
            <p className="eyebrow">Outros guias</p>
            <ul className="mt-4 space-y-3 text-sm">
              {guias
                .filter((x) => x.slug !== g.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link to="/guias/$slug" params={{ slug: x.slug }} className="ink-link">
                      {x.titulo} →
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </section>
    </article>
  );
}
