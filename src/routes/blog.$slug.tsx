import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPost, blogPosts } from "@/data/blog-posts";
import { getPublishedBlogPost } from "@/lib/blog.functions";

type Bloco = { type: "p" | "h2"; text: string };
type LoaderPost = {
  slug: string;
  titulo: string;
  resumo: string;
  publicadoEm: string;
  leituraMin: number;
  autor: string;
  tags: string[];
  blocos: Bloco[];
  fontes?: Array<{ url: string; titulo?: string }>;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    // 1) DB first (covers AI-generated/published posts)
    const { post } = await getPublishedBlogPost({ data: { slug: params.slug } });
    if (post) {
      return {
        post: {
          slug: post.slug,
          titulo: post.titulo,
          resumo: post.resumo,
          publicadoEm: post.publicado_em,
          leituraMin: post.leitura_min,
          autor: post.autor,
          tags: post.tags ?? [],
          blocos: (post.blocos ?? []) as Bloco[],
          fontes: post.fontes ?? [],
        } satisfies LoaderPost,
      };
    }
    // 2) Static fallback
    const sp = getBlogPost(params.slug);
    if (!sp) throw notFound();
    return {
      post: {
        slug: sp.slug,
        titulo: sp.titulo,
        resumo: sp.resumo,
        publicadoEm: sp.publicadoEm,
        leituraMin: sp.leituraMin,
        autor: sp.autor,
        tags: sp.tags,
        blocos: sp.blocos,
      } satisfies LoaderPost,
    };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Artigo | Blog" }] };
    const url = `https://acordosinternacionais.com/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.titulo} | Blog` },
        { name: "description", content: post.resumo },
        { property: "og:title", content: post.titulo },
        { property: "og:description", content: post.resumo },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.titulo,
            description: post.resumo,
            datePublished: post.publicadoEm,
            author: { "@type": "Person", name: post.autor },
            keywords: post.tags?.join(", "),
            mainEntityOfPage: url,
            publisher: {
              "@type": "Organization",
              name: "AtlasPrev",
              url: "https://acordosinternacionais.com/",
            },
          }),
        },
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center text-sm text-muted-foreground">
      Não foi possível carregar o artigo.
    </div>
  ),
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
  const { post } = Route.useLoaderData() as { post: LoaderPost };

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

        {post.fontes && post.fontes.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border bg-background/40 p-6">
            <p className="eyebrow">Fontes consultadas</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {post.fontes.map((f, i) => (
                <li key={i}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    {f.titulo ?? f.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

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
