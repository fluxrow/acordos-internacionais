import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPost, blogPosts } from "@/data/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Artigo | Blog" }] };
    return {
      meta: [
        { title: `${post.titulo} | Blog` },
        { name: "description", content: post.resumo },
        { property: "og:title", content: post.titulo },
        { property: "og:description", content: post.resumo },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-4 font-display text-4xl">Artigo não encontrado</h1>
      <Link to="/blog" className="mt-8 inline-block underline underline-offset-4">
        Voltar para o blog
      </Link>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <Link
            to="/blog"
            className="eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-[var(--accent-ink)]"
          >
            <span aria-hidden>←</span> Blog
          </Link>
          <p className="eyebrow mt-6">
            {new Date(post.publicadoEm).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            · {post.leituraMin} min · {post.autor}
          </p>
          <h1 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
            {post.titulo}
          </h1>
          <p className="lede mt-6">{post.resumo}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="space-y-6 text-[17px] leading-[1.75] text-foreground/90">
          {post.blocos.map((b, i) =>
            b.type === "h2" ? (
              <h2
                key={i}
                className="mt-10 font-display text-2xl text-foreground md:text-3xl"
              >
                {b.text}
              </h2>
            ) : (
              <p key={i}>{b.text}</p>
            ),
          )}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-background/60 p-7 shadow-[var(--shadow-soft)]">
          <p className="eyebrow">Próximo passo</p>
          <h3 className="mt-3 font-display text-2xl">
            Quer entender se isso muda o seu caso?
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Conte sua situação ao Dr. Marcos Espínola — cada mensagem é lida
            pessoalmente.
          </p>
          <Link
            to="/contato"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-ink-soft)]"
          >
            Falar com o Dr. Marcos <span aria-hidden>→</span>
          </Link>
        </div>

        {blogPosts.length > 1 && (
          <div className="mt-12 border-t border-border pt-8">
            <Link to="/blog" className="text-sm underline underline-offset-4">
              ← Ver todos os artigos
            </Link>
          </div>
        )}
      </section>
    </article>
  );
}
