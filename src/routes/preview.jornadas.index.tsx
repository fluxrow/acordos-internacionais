import { createFileRoute, Link } from "@tanstack/react-router";
import { CTAButton } from "@/components/cta-button";

// Ordem do briefing: 1) Moro fora · 2) Voltei · 3) Trabalho temp · 4) CTA Marcos
type PreviewJornada = {
  slug: "moro-fora" | "estou-voltando" | "vou-me-mudar" | "quero-me-aposentar";
  titulo: string;
  publico: string;
  resumo: string;
};

const JORNADAS_ORDENADAS: PreviewJornada[] = [
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

export const Route = createFileRoute("/preview/jornadas/")({
  head: () => ({
    meta: [
      { title: "Pré-visualização · Jornadas | Briefing Dr. Marcos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewJornadasIndex,
});

function PreviewJornadasIndex() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="eyebrow">Por situação</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">
            Escolha sua situação.
          </h1>
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
              <PreviewJornadaLink jornada={j} index={i} />
            </li>
          ))}
        </ul>

        {/* 04 · Bloco "Atendimento direto" — APÓS as três jornadas */}
        <div className="mt-12 rounded-3xl border-2 border-[var(--accent-ink)] bg-[var(--accent-ink-soft)] p-10 md:p-14">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl text-[var(--accent-ink)] opacity-70">
              04
            </span>
            <span className="rounded-full bg-[var(--accent-ink)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-background">
              Atendimento direto
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
            Atendimento direto com o Dr. Marcos Espínola
          </h2>
          <p className="lede mt-4 max-w-2xl">
            Cada caso tem nuances que nenhuma jornada cobre por completo. Se
            você já explorou as três acima e quer um olhar pessoal, fale com o
            Dr. Marcos.
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
      </section>
    </>
  );
}

function PreviewJornadaLink({
  jornada,
  index,
}: {
  jornada: PreviewJornada;
  index: number;
}) {
  // moro-fora e estou-voltando vão para os previews completos com os blocos novos
  const previewSlug =
    jornada.slug === "moro-fora" || jornada.slug === "estou-voltando"
      ? jornada.slug
      : null;

  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-3xl text-[var(--accent-ink)] md:text-4xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow">{jornada.publico}</span>
      </div>
      <h2 className="font-display text-2xl leading-tight md:text-3xl">
        {jornada.titulo}
      </h2>
      <p className="text-base text-muted-foreground">{jornada.resumo}</p>
      <span className="mt-auto pt-2 text-sm underline underline-offset-4 group-hover:text-destructive">
        Saiba mais →
      </span>
    </>
  );

  if (previewSlug) {
    return (
      <Link
        to="/preview/jornadas/$jornada"
        params={{ jornada: previewSlug }}
        className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-[var(--accent-ink-soft)] md:p-10"
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link
      to="/jornadas/$jornada"
      params={{ jornada: jornada.slug }}
      className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-[var(--accent-ink-soft)] md:p-10"
    >
      {inner}
    </Link>
  );
}
