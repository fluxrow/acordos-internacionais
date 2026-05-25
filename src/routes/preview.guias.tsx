import { createFileRoute, Link } from "@tanstack/react-router";
import { guias } from "@/data/guias";

export const Route = createFileRoute("/preview/guias")({
  head: () => ({
    meta: [
      { title: "Pré-visualização · Guias (novo card 05) | Briefing Dr. Marcos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewGuias,
});

function PreviewGuias() {
  // O briefing pede card 05 = Saída Fiscal, adicionado ao final da lista atual.
  const items = [
    ...guias.map((g) => ({
      slug: g.slug,
      titulo: g.titulo,
      resumo: g.resumo,
      preview: false as const,
    })),
    {
      slug: "saida-definitiva-do-pais",
      titulo: "Comunicação de Saída Definitiva do País",
      resumo:
        "Entenda a saída fiscal do Brasil, a DSDP, os prazos e os riscos de manter residência fiscal indevida.",
      preview: true as const,
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
          <p className="eyebrow">Biblioteca · Por tema</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">Guias.</h1>
          <p className="lede mt-6 max-w-2xl">
            Pré-visualização com o novo card <strong>05 — Saída Fiscal</strong>{" "}
            adicionado ao final da lista.
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
                    {g.preview ? "Guia temático · NOVO" : "Guia temático"}
                  </span>
                </div>
                <h2 className="font-display text-2xl leading-tight md:text-3xl">
                  {g.titulo}
                </h2>
                <p className="text-base text-muted-foreground">{g.resumo}</p>
                <span className="mt-auto pt-2 text-sm underline underline-offset-4 group-hover:text-destructive">
                  Abrir guia →
                </span>
              </>
            );
            return (
              <li key={g.slug} className="bg-background">
                {g.preview ? (
                  <Link
                    to="/preview/guias/saida-definitiva-do-pais"
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
    </>
  );
}
