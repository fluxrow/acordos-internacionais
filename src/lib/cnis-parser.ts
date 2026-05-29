export interface DadosCNIS {
  nome: string;
  cpf: string;
  dataNasc: string;
  totalMeses: number;
  /**
   * Média dos 80% MAIORES salários de contribuição com competência ≥ 07/1994
   * (Plano Real / início do PBC). Sem correção INPC — estimativa.
   */
  mediasSalarial: number;
}

function calcMesesRaw(dataInicio: string, dataFim: string): number {
  const [di, mi, ai] = dataInicio.split("/").map(Number);
  const [df, mf, af] = dataFim.split("/").map(Number);
  return (af - ai) * 12 + (mf - mi) + (df >= di ? 0 : -1);
}

/** Retorna o ano de uma linha que contenha uma competência mm/aaaa, ou null. */
function extrairAnoCompetencia(linha: string): number | null {
  // Aceita 07/1994 ou 1994-07 ou só ano isolado como fallback fraco
  const m1 = linha.match(/\b(\d{2})\/(\d{4})\b/);
  if (m1) return parseInt(m1[2], 10);
  const m2 = linha.match(/\b(\d{4})-(\d{2})\b/);
  if (m2) return parseInt(m2[1], 10);
  return null;
}

function extrairValorBR(linha: string): number | null {
  const m = linha.match(/R\$\s*([\d.]+,\d{2})/) ||
    linha.match(/(?<![\d.,])(\d{1,3}(?:\.\d{3})*,\d{2})(?![\d])/);
  if (!m) return null;
  const v = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

export function parsearCNIS(texto: string): DadosCNIS {
  const nomeMatch = texto.match(
    /Nome[:\s]+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ ]{2,49}?)(?=\s{2,}|\s*(?:CPF|NIT|Data\b|Nasc|\d{3}\.))/i,
  );
  const cpfMatch = texto.match(/CPF[:\s]+(\d{3}[\.\s]?\d{3}[\.\s]?\d{3}[-\s]?\d{2})/i);
  const nascMatch = texto.match(/(?:Nascimento|Nasc\.?)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);

  const pares = [...texto.matchAll(/(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/g)];
  let totalMeses = 0;
  for (const [, inicio, fim] of pares) {
    const m = calcMesesRaw(inicio, fim);
    if (m > 0 && m < 600) totalMeses += m;
  }

  // SALÁRIOS — apenas competências ≥ 07/1994. Linha-a-linha.
  const linhas = texto.split(/\r?\n/);
  const salariosValidos: number[] = [];
  for (const linha of linhas) {
    const ano = extrairAnoCompetencia(linha);
    if (ano == null) continue;
    if (ano < 1994) continue; // descarta competências anteriores ao Plano Real
    const v = extrairValorBR(linha);
    if (v == null) continue;
    if (v < 100 || v > 50000) continue;
    salariosValidos.push(v);
  }

  // Fallback: se não conseguimos amarrar valor↔competência, usa todos os valores
  // capturados sem janela temporal (estimativa fraca — sinalizada na UI).
  let amostra = salariosValidos;
  if (amostra.length === 0) {
    const todos: number[] = [];
    for (const m of texto.matchAll(/R\$\s*([\d.]+,\d{2})/g)) {
      todos.push(parseFloat(m[1].replace(/\./g, "").replace(",", ".")));
    }
    if (todos.length === 0) {
      for (const m of texto.matchAll(/(?<![\d.,])(\d{1,3}(?:\.\d{3})*,\d{2})(?![\d])/g)) {
        todos.push(parseFloat(m[1].replace(/\./g, "").replace(",", ".")));
      }
    }
    amostra = todos.filter((v) => v >= 100 && v <= 50000);
  }

  amostra = amostra.slice(0, 600);

  // Média dos 80% MAIORES (descarta o quintil inferior — Art. 29, §2º Lei 8.213).
  let mediasSalarial = 0;
  if (amostra.length > 0) {
    const ordenado = [...amostra].sort((a, b) => b - a);
    const corte = Math.max(1, Math.ceil(ordenado.length * 0.8));
    const top = ordenado.slice(0, corte);
    mediasSalarial = top.reduce((a, b) => a + b, 0) / top.length;
  }

  return {
    nome: nomeMatch?.[1]?.trim() ?? "",
    cpf: cpfMatch?.[1] ?? "",
    dataNasc: nascMatch?.[1] ?? "",
    totalMeses,
    mediasSalarial,
  };
}
