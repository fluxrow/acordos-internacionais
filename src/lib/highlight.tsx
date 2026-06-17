import React from "react";

interface HighlightProps {
  text: string;
  terms: string[];
  className?: string;
}

/**
 * Envolve, dentro de `text`, cada ocorrência dos `terms` em <mark>
 * tipografado em wine (token --accent-ink). Case-insensitive, mantém
 * o casing original. Sem regex de palavra inteira para casar expressões
 * com espaços e hífens (ex.: "pró-rata", "em vigor desde 1995").
 */
export function Highlight({ text, terms, className }: HighlightProps) {
  if (!terms.length) return <>{text}</>;

  const escaped = terms
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length); // mais longos primeiro

  if (!escaped.length) return <>{text}</>;

  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const matchRe = new RegExp(`^(?:${escaped.join("|")})$`, "i");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) =>
        matchRe.test(part) ? (
          <mark
            key={i}
            className={
              className ??
              "bg-transparent font-medium text-[var(--accent-ink)]"
            }
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
