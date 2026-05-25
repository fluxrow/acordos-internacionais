import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/preview/")({
  head: () => ({
    meta: [
      { title: "Pré-visualização — Índice | Briefing Dr. Marcos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewIndex,
});

type Item = {
  to:
    | "/preview/home"
    | "/preview/jornadas"
    | "/preview/jornadas/moro-fora"
    | "/preview/jornadas/estou-voltando"
    | "/preview/guias"
    | "/preview/guias/saida-definitiva-do-pais"
    | "/preview/profissional";
  current:
    | "/"
    | "/jornadas"
    | "/jornadas/moro-fora"
    | "/jornadas/estou-voltando"
    | "/guias"
    | "/profissional";
  titulo: string;
  fase: "Fase 1" | "Fase 2" | "Nova página";
  resumo: string;
};

const items: Item[] = [
  {
    to: "/preview/home",
    current: "/",
    titulo: "Homepage",
    fase: "Fase 1",
    resumo:
      "Nova headline cidadão · 3 CTAs (25 países, Jornadas, Blog) · novo título + tagline na seção advogado · 'modelos de petição' removido.",
  },
  {
    to: "/preview/jornadas",
    current: "/jornadas",
    titulo: "Jornadas (reordenadas)",
    fase: "Fase 1",
    resumo:
      "Ordem: 1.Moro fora · 2.Voltei · 3.Trabalho temp · 4.bloco CTA Dr. Marcos abaixo das três.",
  },
  {
    to: "/preview/jornadas/moro-fora",
    current: "/jornadas/moro-fora",
    titulo: "Jornada Moro fora + Prova de Vida",
    fase: "Fase 2",
    resumo:
      "Bloco completo com 5 modalidades de prova de vida, tabela-resumo e alertas de prazo/bloqueio.",
  },
  {
    to: "/preview/jornadas/estou-voltando",
    current: "/jornadas/estou-voltando",
    titulo: "Jornada Voltei + Planejamento Totalização",
    fase: "Fase 2",
    resumo:
      "CDT × CDSP, 4 etapas, cenários A/B/C, erros comuns e fluxo recomendado.",
  },
  {
    to: "/preview/guias",
    current: "/guias",
    titulo: "Guias (novo card 05)",
    fase: "Nova página",
    resumo: "Listagem com o card novo: 'Comunicação de Saída Definitiva do País'.",
  },
  {
    to: "/preview/guias/saida-definitiva-do-pais",
    current: "/guias",
    titulo: "Guia · Saída Fiscal (DSDP)",
    fase: "Nova página",
    resumo:
      "Página inteira adaptada do briefing — DSDP, riscos, FAQ, fontes oficiais.",
  },
  {
    to: "/preview/profissional",
    current: "/profissional",
    titulo: "Hub Profissional (sem petições)",
    fase: "Fase 1",
    resumo:
      "Hero, descrição e cards reescritos sem 'modelos de petição' (funcionalidade suspensa).",
  },
];

function PreviewIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <p className="eyebrow">Sandbox de revisão</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        Pré-visualização das mudanças propostas
      </h1>
      <p className="lede mt-6 max-w-2xl">
        Compare cada item abaixo com a versão publicada hoje. Nada aqui está no
        ar — é uma vitrine privada (noindex). Quando aprovar, promovemos para o
        site real.
      </p>

      <div className="mt-12 grid gap-5">
        {items.map((it) => (
          <article
            key={it.to}
            className="rounded-2xl border border-border bg-background p-6 transition-colors hover:border-[var(--accent-ink)] md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl">{it.titulo}</h2>
              <span className="rounded-full border border-[var(--accent-ink)]/30 bg-[var(--accent-ink-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                {it.fase}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{it.resumo}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <Link
                to={it.to}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 font-medium text-background transition-colors hover:bg-foreground/85"
              >
                Ver proposta →
              </Link>
              <Link
                to={it.current}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 font-medium transition-colors hover:bg-secondary"
              >
                Ver versão atual
              </Link>
            </div>
          </article>
        ))}
      </div>

      <aside className="mt-14 rounded-2xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Notas para o Dr. Marcos</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            O CTA <strong>[Blog]</strong> usado nos novos botões aponta para{" "}
            <code>/blog</code> (já existe como "Em construção").
          </li>
          <li>
            O briefing menciona <code>/sobre</code>; o projeto tem{" "}
            <code>/sobre/dr-marcos</code>. Mantive este destino — confirmar se
            deve criar um <code>/sobre</code> separado.
          </li>
          <li>
            A nova aba <strong>"Saída Fiscal"</strong> no header global será
            adicionada apenas quando você aprovar a promoção. No preview, o
            acesso é via card acima.
          </li>
        </ul>
      </aside>
    </main>
  );
}
