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

const MESES_PT: Record<string, number> = {
  jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6,
  jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
  janeiro: 1, fevereiro: 2, marco: 3, março: 3, abril: 4, maio: 5, junho: 6,
  julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12,
};

interface Competencia { ano: number; mes: number; }

/** Extrai a primeira competência mm/aaaa, aaaa-mm, aaaa/mm ou mês-por-extenso/aaaa. */
function extrairCompetencia(linha: string): Competencia | null {
  let m = linha.match(/\b(0[1-9]|1[0-2])\/(\d{4})\b/);
  if (m) return { mes: +m[1], ano: +m[2] };
  m = linha.match(/\b(\d{4})[-/](0[1-9]|1[0-2])\b/);
  if (m) return { mes: +m[2], ano: +m[1] };
  m = linha.match(/\b([A-Za-zçÇãõ]{3,10})[\/\s.-]+(\d{4})\b/);
  if (m) {
    const key = m[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const mes = MESES_PT[key];
    if (mes) return { mes, ano: +m[2] };
  }
  return null;
}

/** Apenas para detectar presença de competência (sem extrair valores). */
function temCompetencia(linha: string): boolean {
  return extrairCompetencia(linha) !== null;
}

function compGteJulho1994(c: Competencia): boolean {
  return c.ano > 1994 || (c.ano === 1994 && c.mes >= 7);
}

const VALOR_BR_RE = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g;
const VALOR_BR_SINGLE = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/;

function parseValorBR(s: string): number {
  return parseFloat(s.replace(/\./g, "").replace(",", "."));
}

function extrairTodosValores(linha: string): number[] {
  const out: number[] = [];
  for (const m of linha.matchAll(VALOR_BR_RE)) {
    const v = parseValorBR(m[1]);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

const PALAVRAS_NAO_SC = /\b(indicador|indicadores|total|consolidad|13[ºo]|d[ée]cimo|devido|pago em|vencimento|multa|juros|saldo|acumulad)/i;

function valorPlausivelSC(v: number): boolean {
  return v >= 100 && v <= 50000;
}

type Par = Competencia & { valor: number };

// ---------- Estratégias de pareamento competência↔valor ----------

/** A. Competência + valor na mesma linha. */
function estrategiaLinhaUnica(linhas: string[]): Par[] {
  const out: Par[] = [];
  for (const linha of linhas) {
    const comp = extrairCompetencia(linha);
    if (!comp) continue;
    if (PALAVRAS_NAO_SC.test(linha)) continue;
    const valores = extrairTodosValores(linha);
    if (valores.length === 0) continue;
    // Se há múltiplos valores na linha, pegar o primeiro plausível como SC.
    const v = valores.find(valorPlausivelSC);
    if (v == null) continue;
    out.push({ ...comp, valor: v });
  }
  return out;
}

/** B. Tabela colunar: bloco de N competências seguido de bloco de N valores. */
function estrategiaColunar(linhas: string[]): Par[] {
  const out: Par[] = [];
  let i = 0;
  while (i < linhas.length) {
    // coleta sequência de competências (linhas com competência e sem valor monetário)
    const comps: Competencia[] = [];
    let j = i;
    while (j < linhas.length) {
      const c = extrairCompetencia(linhas[j]);
      const tv = extrairTodosValores(linhas[j]);
      if (c && tv.length === 0) { comps.push(c); j++; } else break;
    }
    if (comps.length < 2) { i = j + 1; continue; }
    // coleta sequência de valores (linhas com valor e sem competência)
    const vals: number[] = [];
    let k = j;
    while (k < linhas.length) {
      const c = extrairCompetencia(linhas[k]);
      const tv = extrairTodosValores(linhas[k]);
      if (!c && tv.length === 1 && !PALAVRAS_NAO_SC.test(linhas[k])) {
        vals.push(tv[0]); k++;
      } else break;
    }
    if (vals.length >= 2) {
      const n = Math.min(comps.length, vals.length);
      for (let x = 0; x < n; x++) {
        if (valorPlausivelSC(vals[x])) out.push({ ...comps[x], valor: vals[x] });
      }
      i = k;
    } else {
      i = j;
    }
  }
  return out;
}

/** C. Token-stream: tokeniza texto todo em sequência [COMP, VALOR, ...]. */
function estrategiaTokenStream(texto: string): Par[] {
  // Encontra competências e valores em ordem de aparição
  type Tok = { kind: "comp"; pos: number; comp: Competencia } | { kind: "val"; pos: number; valor: number };
  const toks: Tok[] = [];

  // mm/aaaa
  for (const m of texto.matchAll(/\b(0[1-9]|1[0-2])\/(\d{4})\b/g)) {
    toks.push({ kind: "comp", pos: m.index!, comp: { mes: +m[1], ano: +m[2] } });
  }
  // aaaa-mm / aaaa/mm (evita duplicar mm/aaaa já capturado)
  for (const m of texto.matchAll(/\b(\d{4})[-/](0[1-9]|1[0-2])\b/g)) {
    toks.push({ kind: "comp", pos: m.index!, comp: { mes: +m[2], ano: +m[1] } });
  }
  // valores
  for (const m of texto.matchAll(/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g)) {
    const v = parseValorBR(m[1]);
    if (Number.isFinite(v)) toks.push({ kind: "val", pos: m.index!, valor: v });
  }
  toks.sort((a, b) => a.pos - b.pos);

  const out: Par[] = [];
  for (let i = 0; i < toks.length - 1; i++) {
    const t = toks[i];
    if (t.kind !== "comp") continue;
    // próximo valor dentro de uma janela curta
    for (let j = i + 1; j < Math.min(toks.length, i + 4); j++) {
      const u = toks[j];
      if (u.kind === "val" && valorPlausivelSC(u.valor)) {
        out.push({ ...t.comp, valor: u.valor });
        break;
      }
      if (u.kind === "comp") break;
    }
  }
  return out;
}

function dedupSomandoPorCompetencia(pares: Par[]): number[] {
  const map = new Map<string, number>();
  for (const p of pares) {
    if (!compGteJulho1994(p)) continue;
    if (!valorPlausivelSC(p.valor)) continue;
    const k = `${p.ano}-${p.mes}`;
    map.set(k, (map.get(k) ?? 0) + p.valor);
  }
  const out: number[] = [];
  for (const v of map.values()) out.push(Math.min(v, 50000));
  return out;
}

export function parsearCNIS(texto: string): DadosCNIS {
  const nomeMatch =
    texto.match(/(?:Nome do Segurado|Nome)[:\s]+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ ]{2,79}?)(?=\s{2,}|\s*(?:CPF|NIT|N[ºo°]|Data\b|Nasc|DN\b|\d{3}\.)|\r|\n)/i);
  const cpfMatch = texto.match(/(?:CPF(?:\/MF)?|N[ºo°]\s*(?:do\s+)?CPF)[:\s]+(\d{3}[\.\s]?\d{3}[\.\s]?\d{3}[-\s]?\d{2})/i);
  const nascMatch = texto.match(/(?:Data de Nascimento|Nascimento|Nascido\(?a?\)?\s+em|Nasc\.?|DN)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);

  // ---- Períodos vinculados (dd/mm/aaaa dd/mm/aaaa) ----
  const pares = [...texto.matchAll(/(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/g)];
  let totalMeses = 0;
  for (const [, inicio, fim] of pares) {
    const m = calcMesesRaw(inicio, fim);
    if (m > 0 && m < 600) totalMeses += m;
  }

  // ---- SC: 3 estratégias em cascata; primeira com ≥ 12 pares ganha ----
  const linhas = texto.split(/\r?\n/);
  const stratA = estrategiaLinhaUnica(linhas);
  let pares2: Par[] = stratA;
  if (pares2.length < 12) {
    const stratB = estrategiaColunar(linhas);
    if (stratB.length > pares2.length) pares2 = stratB;
  }
  if (pares2.length < 12) {
    const stratC = estrategiaTokenStream(texto);
    if (stratC.length > pares2.length) pares2 = stratC;
  }

  let amostra = dedupSomandoPorCompetencia(pares2);

  // Fallback global: nada casou → todos os valores no range.
  if (amostra.length === 0) {
    const todos: number[] = [];
    for (const m of texto.matchAll(/(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g)) {
      const v = parseValorBR(m[1]);
      if (valorPlausivelSC(v)) todos.push(v);
    }
    amostra = todos;
  }

  amostra = amostra.slice(0, 600);

  // Média dos 80% MAIORES (Art. 29, §2º, Lei 8.213).
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
