import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { acordos } from "@/data/acordos";
import { siteStats } from "@/data/site-stats";
import { MULTI_LOGOS } from "@/lib/multi-logos";

const TITLE = "Países com acordo previdenciário com o Brasil";
const DESC = `Os ${siteStats.acordosMapeados} acordos previdenciários do Brasil — ${siteStats.acordosVigentes} em vigor e ${siteStats.acordosEmRatificacao} em ratificação. Bilaterais e multilaterais (CPLP, Mercosul, Iberoamericano).`;
const CANONICAL = "https://acordosinternacionais.com/acordos";

export const Route = createFileRoute("/acordos/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: CANONICAL,
          inLanguage: "pt-BR",
          isPartOf: { "@id": "https://acordosinternacionais.com/#website" },
        }),
      },
    ],
  }),
  component: AcordosIndex,
});

type Filtro = "todos" | "bilateral" | "multilateral" | "ratificacao";

function AcordosIndex() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const lista = useMemo(() => {
    return [...acordos]
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .filter((a) => {
        if (filtro === "bilateral" && a.tipo !== "bilateral") return false;
        if (filtro === "multilateral" && a.tipo !== "multilateral") return false;
        if (filtro === "ratificacao" && a.status !== "ratificacao") return false;
        return true;
      })
      .filter((a) => {
        if (!busca.trim()) return true;
        return a.nome.toLowerCase().includes(busca.toLowerCase().trim());
      });
  }, [busca, filtro]);

  const filtrosAtivos = busca.trim() !== "" || filtro !== "todos";
  const limpar = () => {
    setBusca("");
    setFiltro("todos");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="eyebrow">Mapa</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">
            <span className="text-gold">{siteStats.acordosVigentes} em vigor</span>
            {siteStats.acordosEmRatificacao > 0 && (
              <>
                {" "}+ {siteStats.acordosEmRatificacao} em ratificação
              </>
            )}.
          </h1>
          <p className="lede mt-6 max-w-2xl">
            {siteStats.acordosMapeados} acordos previdenciários mapeados pelo
            Brasil — bilaterais e multilaterais. Use a busca ou os filtros para
            encontrar o que importa para você.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 pt-10">
          {/* TOOLBAR */}
          <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm md:flex-row md:items-center">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar país…"
              className="w-full max-w-xs rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-base font-serif placeholder:text-muted-foreground focus:border-[var(--accent-ink)] focus:bg-background focus:outline-none"
              aria-label="Buscar país"
            />
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["todos", "Todos"],
                  ["bilateral", "Bilaterais"],
                  ["multilateral", "Multilaterais"],
                  ["ratificacao", "Em ratificação"],
                ] as [Filtro, string][]
              ).map(([k, label]) => {
                const ativo = filtro === k;
                return (
                  <button
                    key={k}
                    onClick={() => setFiltro(k)}
                    aria-pressed={ativo}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors " +
                      (ativo
                        ? "border-[var(--accent-ink)] bg-[var(--accent-ink)] text-[var(--paper)]"
                        : "border-border/60 text-foreground hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]")
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <p className="eyebrow text-muted-foreground">
                {filtrosAtivos
                  ? `Mostrando ${lista.length} de ${acordos.length}`
                  : `${lista.length} resultado${lista.length === 1 ? "" : "s"}`}
              </p>
              {filtrosAtivos && (
                <button
                  type="button"
                  onClick={limpar}
                  className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)] underline underline-offset-4 hover:opacity-80"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* GRADE */}
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/acordos/$pais"
                  params={{ pais: a.slug }}
                  className="group flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-background/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent-ink)] hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
                >
                  <div className="flex items-center gap-4">
                    {a.iso ? (
                      <img
                        src={`https://flagcdn.com/w160/${a.iso}.png`}
                        alt=""
                        width={56}
                        height={42}
                        loading="lazy"
                        className="h-[42px] w-[56px] flex-shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : MULTI_LOGOS[a.slug] ? (
                      <img
                        src={MULTI_LOGOS[a.slug]}
                        alt=""
                        width={56}
                        height={42}
                        loading="lazy"
                        className="h-[42px] w-[56px] flex-shrink-0 rounded-md border border-border bg-background object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-[42px] w-[56px] flex-shrink-0 items-center justify-center rounded-md border border-border text-[9px] uppercase tracking-[0.14em]">
                        Multi
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl leading-tight">{a.nome}</h2>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {a.tipo === "bilateral" ? "Bilateral" : "Multilateral"}
                        {a.vigencia && ` · desde ${a.vigencia}`}
                      </p>
                    </div>
                    {a.status !== "vigente" && (
                      <span
                        className={
                          "rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] " +
                          (a.status === "ratificacao"
                            ? "border-[var(--accent-ink)] text-[var(--accent-ink)]"
                            : "border-border/60 text-muted-foreground")
                        }
                      >
                        {a.status === "ratificacao" ? "Em ratificação" : "Incompleto"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{a.resumo}</p>
                  <div className="mt-auto flex items-center justify-end border-t border-border/60 pt-3 text-xs">
                    <span
                      aria-hidden
                      className="text-[var(--accent-ink)] transition-transform group-hover:translate-x-1"
                    >
                      Ver país →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {lista.length === 0 && (
            <div className="mt-16 rounded-xl border border-border/60 bg-background/70 p-12 text-center backdrop-blur-sm">
              <p className="font-display text-2xl">Nenhum país encontrado</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tente ajustar a busca ou o filtro.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
