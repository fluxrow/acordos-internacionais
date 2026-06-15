import { useMemo } from "react";

type Bloco =
  | { tipo: "hr"; key: number }
  | { tipo: "h1" | "h2" | "h3" | "h4"; texto: string; key: number }
  | { tipo: "p"; texto: string; key: number };

const RE_ACORDO = /^ACORDO\s+(DE|ENTRE|SOBRE)/i;
const RE_TITULO = /^T[ÍI]TULO\s+[IVXLCDM0-9]+/i;
const RE_CAPITULO = /^CAP[ÍI]TULO\s+[IVXLCDM0-9]+/i;
const RE_ARTIGO = /^ARTIGO\s+[IVXLCDM0-9]+/i;
const RE_SECAO = /^(SE[ÇC][ÃA]O|PARTE)\s+[IVXLCDM0-9]+/i;

function classificar(bloco: string, key: number): Bloco {
  const t = bloco.trim();
  if (t === "---") return { tipo: "hr", key };

  const primeiraLinha = t.split("\n")[0].trim();

  if (RE_ACORDO.test(primeiraLinha)) return { tipo: "h1", texto: t, key };
  if (RE_TITULO.test(primeiraLinha)) return { tipo: "h1", texto: t, key };
  if (RE_CAPITULO.test(primeiraLinha)) return { tipo: "h2", texto: t, key };
  if (RE_ARTIGO.test(primeiraLinha)) return { tipo: "h3", texto: t, key };
  if (RE_SECAO.test(primeiraLinha)) return { tipo: "h3", texto: t, key };

  // Bloco curto e todo em maiúsculas → subtítulo (ex.: DISPOSIÇÕES GERAIS)
  const semPontuacao = t.replace(/[^\p{L}\p{N}]/gu, "");
  if (
    t.length <= 200 &&
    semPontuacao.length > 2 &&
    semPontuacao === semPontuacao.toUpperCase()
  ) {
    return { tipo: "h4", texto: t, key };
  }

  return { tipo: "p", texto: t, key };
}

export function TextoFormatado({ raw }: { raw: string }) {
  const blocos = useMemo<Bloco[]>(() => {
    return raw
      .split(/\n{2,}/)
      .map((b, i) => [b, i] as const)
      .filter(([b]) => b.trim().length > 0)
      .map(([b, i]) => classificar(b, i));
  }, [raw]);

  return (
    <div className="space-y-4 text-foreground/90 font-serif">
      {blocos.map((b) => {
        if (b.tipo === "hr") {
          return <hr key={b.key} className="my-6 border-border/40" />;
        }
        if (b.tipo === "h1") {
          return (
            <h3
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-base sm:text-lg pt-4 whitespace-pre-wrap"
            >
              {b.texto}
            </h3>
          );
        }
        if (b.tipo === "h2") {
          return (
            <h4
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-base pt-2 whitespace-pre-wrap"
            >
              {b.texto}
            </h4>
          );
        }
        if (b.tipo === "h3") {
          return (
            <h5
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-sm sm:text-base pt-2 whitespace-pre-wrap"
            >
              {b.texto}
            </h5>
          );
        }
        if (b.tipo === "h4") {
          return (
            <p
              key={b.key}
              className="text-center font-bold uppercase tracking-wide text-sm sm:text-base whitespace-pre-wrap"
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
