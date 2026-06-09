import { Link } from "@tanstack/react-router";
import { Lock, ArrowUpRight } from "lucide-react";
import { acordosImportados } from "@/data/acordos.generated";
import { MULTI_LOGOS } from "@/lib/multi-logos";
import { REGIAO_POR_PAIS } from "@/data/regioes";
import { StatusBadge } from "@/components/hub/status-badge";

type Pais = { slug: string; nome: string; flag: string | null };

function cobertura(slug: string) {
  const d = acordosImportados[slug];
  if (!d) return { docs: 0, emCuradoria: true, temTrecho: false, orgaos: 0, temAjuste: false };
  const docs = d.documentos.filter((x) => x.arquivo).length;
  const orgaos = (d.orgaoBR ? 1 : 0) + (d.orgaoParceiro ? 1 : 0);
  return {
    docs,
    emCuradoria: docs === 0,
    temTrecho: !!d.acordoTrecho,
    orgaos,
    temAjuste: false,
  };
}

/**
 * Country card estilo showcase-card-1 (21st.dev):
 * cover com bandeira/logo, título com micro-acento gold no hover,
 * métricas em rodapé compacto, estados visuais por status.
 */
export function CountryCard({
  pais,
  hasAccess,
}: {
  pais: Pais;
  hasAccess: boolean;
}) {
  const c = cobertura(pais.slug);
  const regiao = REGIAO_POR_PAIS[pais.slug];
  const locked = !hasAccess && !c.emCuradoria;

  return (
    <Link
      to="/hub/$pais"
      params={{ pais: pais.slug }}
      aria-label={`Abrir ${pais.nome}`}
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--surface-premium-strong)] backdrop-blur-md shadow-[var(--shadow-soft)] transition-all",
        "border-border/60",
        locked
          ? "opacity-90 hover:opacity-100"
          : "hover:-translate-y-1 hover:border-[var(--rule-gold-strong)] hover:shadow-[var(--shadow-soft-hover)]",
      ].join(" ")}
    >
      {/* Cover */}
      <div className="relative h-24 w-full overflow-hidden border-b border-border/40 bg-[var(--paper-soft)]">
        {pais.flag ? (
          <img
            src={`https://flagcdn.com/w320/${pais.flag}.png`}
            srcSet={`https://flagcdn.com/w640/${pais.flag}.png 2x`}
            alt=""
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              c.emCuradoria ? "grayscale" : ""
            }`}
            loading="lazy"
          />
        ) : MULTI_LOGOS[pais.slug] ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--card-bg)] px-4">
            <img
              src={MULTI_LOGOS[pais.slug]}
              alt=""
              className="max-h-14 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Multi
          </div>
        )}

        {/* Overlay sutil para legibilidade do topo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-premium-strong)] via-transparent to-transparent" />

        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--paper)]/60 backdrop-blur-[2px]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rule-gold-strong)] bg-[var(--paper)]/80 text-[var(--accent-ink)]">
              <Lock className="h-4 w-4" />
            </span>
          </div>
        )}

        <ArrowUpRight
          aria-hidden
          className="absolute right-2 top-2 h-4 w-4 -translate-y-1 text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:text-[var(--accent-ink)] group-hover:opacity-100"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-3.5 pb-3.5 pt-3">
        <div className="min-h-[34px]">
          <p className="font-display text-[15px] leading-tight text-foreground transition-colors group-hover:text-[var(--accent-ink)]">
            {pais.nome}
          </p>
          {regiao && (
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {regiao}
            </p>
          )}
        </div>

        <div className="mt-auto">
          {c.emCuradoria ? (
            <StatusBadge kind="curadoria" label="Em curadoria" tone="muted" />
          ) : locked ? (
            <p className="text-[11px] text-muted-foreground">
              Disponível no plano Pro
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              <span className="text-foreground">{c.docs}</span>{" "}
              {c.docs === 1 ? "doc" : "docs"}
              {c.temTrecho && " · trecho"}
              {c.orgaos > 0 && ` · ${c.orgaos} ${c.orgaos === 1 ? "órgão" : "órgãos"}`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
