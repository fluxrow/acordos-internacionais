import { createFileRoute, Link } from "@tanstack/react-router";
import { CTAButton } from "@/components/cta-button";

const TITLE = "Jornadas — o que fazer em cada momento da sua vida internacional";
const DESC =
  "Três percursos práticos para brasileiros que moram fora, estão voltando ou trabalham temporariamente no exterior. Atendimento Personalizado.";

type JornadaIdx = {
  slug: "moro-fora" | "estou-voltando" | "vou-me-mudar";
  titulo: string;
  publico: string;
  resumo: string;
};

const JORNADAS_ORDENADAS: JornadaIdx[] = [
  {
    slug: "moro-fora",
    titulo: "Moro fora",
    publico: "Brasileiros que vivem no exterior",
    resumo:
      "Preciso receber meu benefício, entender como funciona em países com/sem acordo e fazer a prova de vida (5 modalidades).",
  },
  {
    slug: "estou-voltando",
    titulo: "Voltei para o Brasil",
    publico: "Retornados ao Brasil após período no exterior",
    resumo:
      "Validar contribuições no exterior, solicitar totalização e planejar a aposentadoria com tempo dos dois países.",
  },
  {
    slug: "vou-me-mudar",
    titulo: "Trabalho temporariamente no exterior",
    publico: "Brasileiros em deslocamento temporário",
    resumo:
      "Manter contribuições no Brasil, entender como funciona para turistas, expatriados e contratos de curto prazo.",
  },
];

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
          <h1 className="mt-5 font-display text-4xl md:text-6xl">Jornadas.</h1>
          <p className="lede mt-6 max-w-2xl">
            Três percursos práticos. Quando precisar de um olhar pessoal sobre
            o seu caso, o Dr. Marcos Espínola está logo abaixo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
          {JORNADAS_ORDENADAS.map((j, i) => (
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
                <span className="mt-auto pt-2 text-sm underline underline-offset-4 group-hover:text-[var(--accent-ink)]">
                  Ver jornada →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 04 · Atendimento Personalizado */}
        <div className="mt-12 relative overflow-hidden rounded-3xl border-2 border-[var(--accent-ink)] bg-[var(--card-bg)] p-10 shadow-[var(--shadow-gold-glow)] md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,_color-mix(in_oklab,_var(--accent-ink)_16%,_transparent)_0%,_transparent_60%)]"
          />
          <div className="relative">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl text-[var(--accent-ink)] opacity-70">
              04
            </span>
            <span className="rounded-full bg-[var(--accent-ink)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--paper)]">
              Atendimento direto
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
            Atendimento Personalizado
          </h2>
          <p className="lede mt-4 max-w-2xl">
            Cada caso tem nuances que nenhuma jornada cobre por completo. Se
            você já explorou as três acima e quer um olhar pessoal, fale com
            o Dr. Marcos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CTAButton
              to="/contato"
              variant="dark"
              size="lg"
              label="Agendar consulta"
            />
            <Link
              to="/sobre/dr-marcos"
              className="text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Conhecer o Dr. Marcos →
            </Link>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
