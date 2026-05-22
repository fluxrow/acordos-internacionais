import { createFileRoute, Link } from "@tanstack/react-router";
import { jornadas } from "@/data/jornadas";

const TITLE = "Jornadas — o que fazer em cada momento da sua vida internacional";
const DESC =
  "Quatro percursos práticos para brasileiros que vão se mudar, já moram fora, estão voltando ou querem se aposentar usando acordo internacional.";

export const Route = createFileRoute("/jornadas/")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: JornadasIndex,
});

function JornadasIndex() {
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
            <span>Jornadas</span>
          </nav>
          <p className="eyebrow mt-6">Por situação</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">
            Jornadas.
          </h1>
          <p className="lede mt-6 max-w-2xl">
            O que fazer em cada momento da sua vida internacional — do
            embarque ao retorno, passando pela aposentadoria com tempo de
            dois países.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <ul className="grid gap-px border border-border bg-border md:grid-cols-2">
          {jornadas.map((j, i) => (
            <li key={j.slug} className="bg-background">
              <Link
                to="/jornadas/$jornada"
                params={{ jornada: j.slug }}
                className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-[var(--accent-ink-soft)] md:p-10"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-3xl text-[var(--accent-ink)] md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow">{j.publico}</span>
                </div>
                <h2 className="font-display text-2xl leading-tight md:text-3xl">
                  {j.titulo}
                </h2>
                <p className="text-base text-muted-foreground">{j.resumo}</p>
                <span className="mt-auto pt-2 text-sm underline underline-offset-4 group-hover:text-destructive">
                  Ver jornada →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="eyebrow">Procurando algo específico?</p>
          <h2 className="mt-3 font-display text-3xl">Outras entradas</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              to="/acordos"
              className="group block border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="eyebrow">Por país</p>
              <p className="mt-2 font-display text-xl">Acordos vigentes</p>
              <p className="mt-2 text-sm text-muted-foreground">
                25 países e três acordos multilaterais.
              </p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-destructive">
                Ver índice →
              </span>
            </Link>
            <Link
              to="/guias/$slug"
              params={{ slug: "totalizacao" }}
              className="group block border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="eyebrow">Por tema</p>
              <p className="mt-2 font-display text-xl">Guias práticos</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Totalização, prova de vida, CDT, aposentadoria fora.
              </p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-destructive">
                Abrir guias →
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
              <span className="mt-4 inline-block text-sm underline underline-offset-4 group-hover:text-destructive">
                Abrir calculadora →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
