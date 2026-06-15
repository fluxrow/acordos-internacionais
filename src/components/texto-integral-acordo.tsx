import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface TextoIntegralAcordoProps {
  slug: string;
}

type Estado =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "loaded"; acordo: string; ajuste: string }
  | { kind: "error" };

export function TextoIntegralAcordo({ slug }: TextoIntegralAcordoProps) {
  const [estado, setEstado] = useState<Estado>({ kind: "idle" });
  const [aberto, setAberto] = useState<"acordo" | "ajuste" | null>(null);

  async function carregar() {
    if (estado.kind === "loaded" || estado.kind === "loading") return;
    setEstado({ kind: "loading" });
    try {
      const mod = await import(`../data/acordos-textos/${slug}.ts`);
      setEstado({
        kind: "loaded",
        acordo: mod.acordo ?? "",
        ajuste: mod.ajuste ?? "",
      });
    } catch (e) {
      console.error("Falha ao carregar texto integral", e);
      setEstado({ kind: "error" });
    }
  }

  function toggle(qual: "acordo" | "ajuste") {
    carregar();
    setAberto((a) => (a === qual ? null : qual));
  }

  const acordo = estado.kind === "loaded" ? estado.acordo : "";
  const ajuste = estado.kind === "loaded" ? estado.ajuste : "";

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Texto integral importado do mapa oficial de acordos. Conteúdo extenso —
        clique para expandir.
      </p>

      <Linha
        titulo="Texto integral do acordo"
        aberto={aberto === "acordo"}
        onToggle={() => toggle("acordo")}
      >
        {estado.kind === "loading" && (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        )}
        {estado.kind === "error" && (
          <p className="text-sm text-destructive">
            Não foi possível carregar o texto agora.
          </p>
        )}
        {estado.kind === "loaded" && acordo && <TextoFormatado raw={acordo} />}
        {estado.kind === "loaded" && !acordo && (
          <p className="text-sm text-muted-foreground">
            Texto não disponível para este acordo.
          </p>
        )}
      </Linha>

      {(estado.kind !== "loaded" || ajuste) && (
        <Linha
          titulo="Ajuste administrativo"
          aberto={aberto === "ajuste"}
          onToggle={() => toggle("ajuste")}
        >
          {estado.kind === "loading" && (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          )}
          {estado.kind === "loaded" && ajuste && (
            <TextoFormatado raw={ajuste} />
          )}
          {estado.kind === "loaded" && !ajuste && (
            <p className="text-sm text-muted-foreground">
              Sem ajuste administrativo cadastrado.
            </p>
          )}
        </Linha>
      )}
    </div>
  );
}

type Bloco =
  | { tipo: "hr"; key: number }
  | { tipo: "h1" | "h2" | "h3" | "h4"; texto: string; key: number }
  | { tipo: "p"; texto: string; key: number };

const RE_TITULO = /^T[ÍI]TULO\s+[IVXLCDM0-9]+/i;
const RE_CAPITULO = /^CAP[ÍI]TULO\s+[IVXLCDM0-9]+/i;
const RE_ARTIGO = /^ARTIGO\s+[IVXLCDM0-9]+/i;
const RE_SECAO = /^(SE[ÇC][ÃA]O|PARTE)\s+[IVXLCDM0-9]+/i;

function classificar(bloco: string, key: number): Bloco {
  const t = bloco.trim();
  if (t === "---") return { tipo: "hr", key };

  const primeiraLinha = t.split("\n")[0].trim();

  if (RE_TITULO.test(primeiraLinha)) return { tipo: "h1", texto: t, key };
  if (RE_CAPITULO.test(primeiraLinha)) return { tipo: "h2", texto: t, key };
  if (RE_ARTIGO.test(primeiraLinha)) return { tipo: "h3", texto: t, key };
  if (RE_SECAO.test(primeiraLinha)) return { tipo: "h3", texto: t, key };

  // Bloco curto e todo em maiúsculas → subtítulo (ex.: DISPOSIÇÕES GERAIS)
  const semPontuacao = t.replace(/[^\p{L}\p{N}]/gu, "");
  if (
    t.length <= 160 &&
    semPontuacao.length > 2 &&
    semPontuacao === semPontuacao.toUpperCase()
  ) {
    return { tipo: "h4", texto: t, key };
  }

  return { tipo: "p", texto: t, key };
}

function TextoFormatado({ raw }: { raw: string }) {
  const blocos = useMemo<Bloco[]>(() => {
    return raw
      .split(/\n{2,}/)
      .map((b, i) => [b, i] as const)
      .filter(([b]) => b.trim().length > 0)
      .map(([b, i]) => classificar(b, i));
  }, [raw]);

  return (
    <div className="max-h-[60vh] overflow-y-auto px-2 sm:px-6 py-2 space-y-4 text-foreground/90 font-serif">
      {blocos.map((b) => {
        if (b.tipo === "hr") {
          return (
            <hr key={b.key} className="my-6 border-border/40" />
          );
        }
        if (b.tipo === "h1") {
          return (
            <h3
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-base sm:text-lg pt-4"
            >
              {b.texto}
            </h3>
          );
        }
        if (b.tipo === "h2") {
          return (
            <h4
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-base pt-2"
            >
              {b.texto}
            </h4>
          );
        }
        if (b.tipo === "h3") {
          return (
            <h5
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-sm sm:text-base pt-2"
            >
              {b.texto}
            </h5>
          );
        }
        if (b.tipo === "h4") {
          return (
            <p
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-sm sm:text-base"
            >
              {b.texto}
            </p>
          );
        }
        return (
          <p
            key={b.key}
            className="text-justify leading-relaxed text-sm whitespace-pre-wrap"
            style={{ textIndent: 0, hyphens: "auto" }}
          >
            {b.texto}
          </p>
        );
      })}
    </div>
  );
}

function Linha({
  titulo,
  aberto,
  onToggle,
  children,
}: {
  titulo: string;
  aberto: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/50 transition-colors hover:border-[var(--accent-ink)]/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span className="font-display text-base">{titulo}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted-foreground transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>
      {aberto && <div className="border-t border-border/40 p-2 sm:p-4">{children}</div>}
    </div>
  );
}
