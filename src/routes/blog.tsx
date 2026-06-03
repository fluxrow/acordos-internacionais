import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog-posts";

const TITLE = "Blog | Acordos Internacionais";
const DESC =
  "Análises, atualizações regulatórias e estudos de caso sobre acordos previdenciários internacionais do Brasil.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Blog,
});

function Blog() {
  const posts = [...blogPosts].sort((a, b) =>
    b.publicadoEm.localeCompare(a.publicadoEm),
  );

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="eyebrow">Editorial</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">
            <span className="text-gold">Blog</span> do Acordo Internacional
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Análises de jurisprudência, atualizações regulatórias e estudos de
            caso reais, escritos pelo Dr. Marcos Espínola.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group block rounded-2xl border border-border bg-background/60 p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent-ink)]/60 hover:shadow-[var(--shadow-soft-hover)]"
              >
                <p className="eyebrow">
                  {new Date(post.publicadoEm).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {post.leituraMin} min
                </p>
                <h2 className="mt-3 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-[var(--accent-ink)]">
                  {post.titulo}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {post.resumo}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                  Ler artigo <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
