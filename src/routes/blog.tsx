import { createFileRoute, Link } from "@tanstack/react-router";

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
  return (
    <article className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="eyebrow">Em construção</p>
      <h1 className="mt-4 font-display text-5xl">Blog</h1>
      <p className="lede mt-6">
        Em breve: análises de jurisprudência, atualizações de portarias e
        estudos de caso reais, escritos pelo Dr. Marcos.
      </p>
      <Link
        to="/contato"
        className="mt-10 inline-block underline underline-offset-4 hover:text-destructive"
      >
        Quer receber por e-mail? Cadastre-se no contato →
      </Link>
    </article>
  );
}
