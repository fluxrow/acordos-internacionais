import { createFileRoute, Link } from "@tanstack/react-router";
import { guias } from "@/data/guias";

const TITLE = "Guias — conceitos centrais dos acordos previdenciários";
const DESC =
  "Totalização, prova de vida no exterior, CDT e aposentadoria morando fora: os temas que aparecem em quase todo processo internacional, explicados sem juridiquês.";

export const Route = createFileRoute("/guias/")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: GuiasIndex,
});

function GuiasIndex() {
  const items = [
    ...guias.map((g) => ({
      slug: g.slug,
      titulo: g.titulo,
      resumo: g.resumo,
      novo: false as const,
    })),
    {
      slug: "saida-definitiva-do-pais",
      titulo: "Comunicação de Saída Definitiva do País",
      resumo:
        "Entenda a saída fiscal do Brasil, a DSDP, os prazos e os riscos de manter residência fiscal indevida.",
      novo: true as const,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline underline-offset-4">
              Início
            </Link>
            <span aria-hidden> / </span>
            <span>Guias</span>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[var(--accent-ink)]" />
            <p className="eyebrow">Biblioteca · Por tema</p>
          </div>
          <h1 className="mt-5 font-display text-4xl md:text-6xl"><span className="text-gold">Guias</span>.</h1>
          <p className="lede mt-6 max-w-2xl">
            Os conceitos que voltam em quase todo processo internacional —
            explicados de forma direta, com exemplos práticos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <ul className="grid gap-px border border-border bg-border md:grid-cols-2">
          {items.map((g, i) => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-3xl text-[var(--accent-ink)] md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow">
                    {g.novo ? "Guia temático · NOVO" : "Guia temático"}
                  </span>
                </div>
                <h2 className="font-display text-2xl leading-tight md:text-3xl">
                  {g.titulo}
                </h2>
                <p className="text-base text-muted-foreground">{g.resumo}</p>
                <span className="mt-auto pt-2 text-sm underline underline-offset-4 group-hover:text-[var(--accent-ink)]">
                  Abrir guia →
                </span>
              </>
            );
            return (
              <li key={g.slug} className="bg-background">
                {g.novo ? (
                  <Link
                    to="/guias/saida-definitiva-do-pais"
                    className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-[var(--accent-ink-soft)] md:p-10"
                  >
                    {inner}
                  </Link>
                ) : (
                  <Link
                    to="/guias/$slug"
                    params={{ slug: g.slug }}
                    className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-[var(--accent-ink-soft)] md:p-10"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>


      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="eyebrow">Procurando outra entrada?</p>
          <h2 className="mt-3 font-display text-3xl">Outros caminhos</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              to="/jornadas"
              className="group block border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="eyebrow">Por situação</p>
              <p className="mt-2 font-display text-xl">Jornadas</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Vou me mudar, moro fora, voltando, ou perto de aposentar.
              </p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-[var(--accent-ink)]">
                Ver jornadas →
              </span>
            </Link>
            <Link
              to="/acordos"
              className="group block border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="eyebrow">Por país</p>
              <p className="mt-2 font-display text-xl">Acordos vigentes</p>
              <p className="mt-2 text-sm text-muted-foreground">
                25 países e três acordos multilaterais.
              </p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-[var(--accent-ink)]">
                Ver índice →
              </span>
            </Link>
            <Link
              to="/calculadora"
              className="group block border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="eyebrow">Ferramenta</p>
              <p className="mt-2 font-display text-xl">Calculadora prorata</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Estime sua parte proporcional em cada país.
              </p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-[var(--accent-ink)]">
                Abrir calculadora →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
