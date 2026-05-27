export interface DadosCNIS {
  nome: string;
  cpf: string;
  dataNasc: string;
  totalMeses: number;
  mediasSalarial: number;
}

function calcMesesRaw(dataInicio: string, dataFim: string): number {
  const [di, mi, ai] = dataInicio.split("/").map(Number);
  const [df, mf, af] = dataFim.split("/").map(Number);
  return (af - ai) * 12 + (mf - mi) + (df >= di ? 0 : -1);
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

  // Salários: aceita "R$ 1.234,56", "1.234,56" (padrão BR com vírgula decimal)
  // e, como fallback, valores precedidos por rótulos típicos do CNIS.
  const candidatos: number[] = [];

  // Padrão 1: explicitamente prefixado por R$
  for (const m of texto.matchAll(/R\$\s*([\d.]+,\d{2})/g)) {
    candidatos.push(parseFloat(m[1].replace(/\./g, "").replace(",", ".")));
  }

  // Padrão 2: valores no formato brasileiro standalone (1.234,56 ou 567,89)
  // Restringe a 2 casas decimais para evitar capturar datas / códigos.
  if (candidatos.length === 0) {
    for (const m of texto.matchAll(/(?<![\d.,])(\d{1,3}(?:\.\d{3})*,\d{2})(?![\d])/g)) {
      candidatos.push(parseFloat(m[1].replace(/\./g, "").replace(",", ".")));
    }
  }

  const salarios = candidatos
    .filter((v) => v >= 100 && v <= 50000)
    .slice(0, 360);
  const mediasSalarial = salarios.length
    ? salarios.reduce((a, b) => a + b, 0) / salarios.length
    : 0;

  return {
    nome: nomeMatch?.[1]?.trim() ?? "",
    cpf: cpfMatch?.[1] ?? "",
    dataNasc: nascMatch?.[1] ?? "",
    totalMeses,
    mediasSalarial,
  };
}
