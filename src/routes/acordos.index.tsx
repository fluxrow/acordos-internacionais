import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { acordos, totalAcordos } from "@/data/acordos";

const TITLE = "Países com acordo previdenciário com o Brasil";
const DESC =
  "Lista completa dos 25 países com acordo internacional de previdência social com o Brasil: bilaterais e multilaterais (CPLP, Mercosul, Iberoamericano).";

export const Route = createFileRoute("/acordos/")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AcordosIndex,
});

type Filtro = "todos" | "bilateral" | "multilateral" | "ratificacao";

function AcordosIndex() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const lista = useMemo(() => {
    return acordos
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

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="eyebrow">Mapa</p>
          <h1 className="mt-5 font-display text-4xl md:text-6xl">
            {totalAcordos} países, três multilaterais.
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Acordos previdenciários firmados pelo Brasil. Use a busca ou os
            filtros para encontrar o país que importa para você.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar país…"
              className="w-full max-w-xs border-0 border-b border-border bg-transparent py-3 text-base font-serif placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
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
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setFiltro(k)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors " +
                    (filtro === k
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="ml-auto text-xs text-muted-foreground">
              {lista.length} resultado{lista.length === 1 ? "" : "s"}
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/acordos/$pais"
                  params={{ pais: a.slug }}
                  className="group flex h-full flex-col gap-4 bg-background p-6 transition-colors hover:bg-foreground hover:text-background"
                >
                  <div className="flex items-center gap-4">
                    {a.iso ? (
                      <img
                        src={`https://flagcdn.com/w160/${a.iso}.png`}
                        alt=""
                        width={56}
                        height={42}
                        loading="lazy"
                        className="h-[42px] w-[56px] flex-shrink-0 rounded-md border border-border object-cover transition-colors group-hover:border-background/30"
                      />
                    ) : (
                      <div className="flex h-[42px] w-[56px] flex-shrink-0 items-center justify-center rounded-md border border-border text-[9px] uppercase tracking-[0.14em] transition-colors group-hover:border-background/30">
                        Multi
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl leading-tight">{a.nome}</h2>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] opacity-70">
                        {a.tipo === "bilateral" ? "Bilateral" : "Multilateral"}
                        {a.vigencia && ` · desde ${a.vigencia}`}
                      </p>
                    </div>
                    {a.status !== "vigente" && (
                      <span
                        className={
                          "border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] transition-colors " +
                          (a.status === "ratificacao"
                            ? "border-current"
                            : "border-current opacity-60")
                        }
                      >
                        {a.status === "ratificacao" ? "Em ratificação" : "Incompleto"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-80">{a.resumo}</p>
                  <div className="mt-auto flex items-center justify-end border-t border-border pt-3 text-xs opacity-70 transition-colors group-hover:border-background/30">
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">Ver país →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {lista.length === 0 && (
            <div className="mt-16 border border-dashed border-border p-12 text-center">
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
