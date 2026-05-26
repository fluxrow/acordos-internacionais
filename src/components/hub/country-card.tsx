import { Link } from "@tanstack/react-router";
import { acordosImportados } from "@/data/acordos.generated";
import { MULTI_LOGOS } from "@/lib/multi-logos";

type Pais = { slug: string; nome: string; flag: string | null };

function cobertura(slug: string) {
  const d = acordosImportados[slug];
  if (!d) return { docs: 0, emCuradoria: true, temTrecho: false, orgaos: 0 };
  const docs = d.documentos.filter((x) => x.arquivo).length;
  const orgaos = (d.orgaoBR ? 1 : 0) + (d.orgaoParceiro ? 1 : 0);
  return {
    docs,
    emCuradoria: docs === 0,
    temTrecho: !!d.acordoTrecho,
    orgaos,
  };
}

export function CountryCard({
  pais,
  hasAccess,
}: {
  pais: Pais;
  hasAccess: boolean;
}) {
  const c = cobertura(pais.slug);

  return (
    <Link
      to="/hub/$pais"
      params={{ pais: pais.slug }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.16)]"
    >
      <div className="flex items-start justify-between gap-3">
        {pais.flag ? (
          <img
            src={`https://flagcdn.com/w80/${pais.flag}.png`}
            srcSet={`https://flagcdn.com/w160/${pais.flag}.png 2x`}
            alt={pais.nome}
            width={56}
            height={42}
            className="rounded-lg object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
            loading="lazy"
          />
        ) : MULTI_LOGOS[pais.slug] ? (
          <img
            src={MULTI_LOGOS[pais.slug]}
            alt={pais.nome}
            width={56}
            height={42}
            className="h-[42px] w-[56px] rounded-lg bg-background object-contain p-1 shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-border"
            loading="lazy"
          />
        ) : (
          <span className="flex h-[42px] w-[56px] items-center justify-center rounded-lg bg-secondary text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            MULTI
          </span>
        )}
        {!hasAccess && !c.emCuradoria && (
          <span className="text-xs text-muted-foreground">🔒</span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium leading-tight">{pais.nome}</p>
        {c.emCuradoria ? (
          <span className="mt-2 inline-flex items-center rounded-full bg-[var(--accent-ink)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-ink)]">
            Em curadoria
          </span>
        ) : (
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
            {c.docs} {c.docs === 1 ? "doc" : "docs"}
            {c.temTrecho && " · trecho"}
            {c.orgaos > 0 && ` · ${c.orgaos} ${c.orgaos === 1 ? "órgão" : "órgãos"}`}
          </p>
        )}
      </div>
    </Link>
  );
}
