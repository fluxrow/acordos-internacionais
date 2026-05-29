// Lógica de cálculo de totalização internacional (RGPS + acordos bilaterais).
// 100% client-side. Compartilhada entre:
// - Calculadora pública (segurado) → usa `calcularTriagem` (sem valores).
// - Calculadora Pro (advogado)     → usa `calcularResultado` (laudo técnico).

// SMmin — atualizar todo janeiro
export const SMmin = 1621;

// Carências (em meses)
export const CARENCIAS = {
  aposentadoria_idade: 180,
  pensao_morte: 18,
} as const;

// Coeficiente base (Pensão por morte é fixo; aposentadoria por idade é calculada
// por `coeficienteAposentadoriaIdade` em função do tempo total).
export const COEFICIENTES = {
  aposentadoria_idade: 0.70,
  pensao_morte: 1.0,
} as const;

export const PAISES_ACORDO = [
  "Alemanha", "Argentina", "Áustria", "Bélgica", "Bolívia", "Bulgária",
  "Cabo Verde", "Canadá", "Chile", "Coreia do Sul", "Espanha",
  "Estados Unidos", "França", "Grécia", "Índia", "Israel", "Itália",
  "Japão", "Luxemburgo", "Moçambique", "Paraguai", "Portugal",
  "Quebec (Canadá)", "República Tcheca", "Suíça", "Uruguai",
] as const;

export type TipoBeneficio = "aposentadoria_idade" | "pensao_morte";
export type Sexo = "F" | "M";

/** Coeficiente da prestação teórica (Art. 39 II e III + regras de acordo). */
export function coeficienteAposentadoriaIdade(tempoTotalMeses: number): number {
  const anos = Math.floor(tempoTotalMeses / 12);
  return Math.min(1.0, 0.70 + anos * 0.01);
}

export function coeficientePara(tipo: TipoBeneficio, tempoTotalMeses: number): number {
  return tipo === "pensao_morte" ? 1.0 : coeficienteAposentadoriaIdade(tempoTotalMeses);
}

/** Meses entre duas datas ISO (vindas de <input type="date">). */
export function calcMesesEntreDatas(iso1: string, iso2: string): number {
  if (!iso1 || !iso2) return 0;
  const d1 = new Date(iso1 + "T12:00:00");
  const d2 = new Date(iso2 + "T12:00:00");
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  return diff > 0 ? Math.round(diff) : 0;
}

export function calcMeses(dataInicio: string, dataFim: string): number {
  const [di, mi, ai] = dataInicio.split("/").map(Number);
  const [df, mf, af] = dataFim.split("/").map(Number);
  return (af - ai) * 12 + (mf - mi) + (df >= di ? 0 : -1);
}

export function calcIdade(dataNasc: string, dataRef = new Date()): number {
  const [d, m, a] = dataNasc.split("/").map(Number);
  const nasc = new Date(a, m - 1, d);
  let idade = dataRef.getFullYear() - nasc.getFullYear();
  if (dataRef < new Date(dataRef.getFullYear(), nasc.getMonth(), nasc.getDate())) idade--;
  return idade;
}

export function mesesParaIdade(dataNasc: string, idadeAlvo: number): number {
  const [d, m, a] = dataNasc.split("/").map(Number);
  const alvo = new Date(a + idadeAlvo, m - 1, d);
  const hoje = new Date();
  if (alvo <= hoje) return 0;
  return (alvo.getFullYear() - hoje.getFullYear()) * 12 + (alvo.getMonth() - hoje.getMonth());
}

export function formatarTempo(meses: number): string {
  const a = Math.floor(meses / 12);
  const m = meses % 12;
  if (a === 0) return `${m} mês${m !== 1 ? "es" : ""}`;
  if (m === 0) return `${a} ano${a !== 1 ? "s" : ""}`;
  return `${a} ano${a !== 1 ? "s" : ""} e ${m} mês${m !== 1 ? "es" : ""}`;
}

export function formatarMoeda(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function idadeMinimaPara(sexo: Sexo): number {
  return sexo === "F" ? 62 : 65;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIAGEM (calculadora pública — segurado). SEM valores monetários.
// ═══════════════════════════════════════════════════════════════════════════

export type TriagemCaso = "BR_SOLO" | "INSUFICIENTE" | "AGUARDA_IDADE" | "TOTALIZACAO_OK";

export interface ResultadoTriagem {
  caso: TriagemCaso;
  titulo: string;
  mensagem: string;
  tempoBrasil: number;
  tempoPais: number;
  tempoTotal: number;
  carencia: number;
  idadeAtual: number;
  idadeMin: number;
  mesesFaltantes?: number;
  mesesParaIdadeMin?: number;
}

export function calcularTriagem(params: {
  tempoBrasilMeses: number;
  tempoPaisMeses: number;
  tipo: TipoBeneficio;
  nascInput: string; // BR (dd/mm/aaaa)
  sexo: Sexo;
}): ResultadoTriagem {
  const { tempoBrasilMeses, tempoPaisMeses, tipo, nascInput, sexo } = params;
  const carencia = CARENCIAS[tipo];
  const tempoTotal = tempoBrasilMeses + tempoPaisMeses;
  const idadeMin = idadeMinimaPara(sexo);
  const idadeAtual = calcIdade(nascInput);

  // 1) Brasil já cumpre carência sozinho
  if (tempoBrasilMeses >= carencia) {
    return {
      caso: "BR_SOLO",
      titulo: "Indícios de direito pelo Brasil (sem totalização)",
      mensagem:
        "Você pode ter direito ao benefício no Brasil sem depender da totalização internacional. É importante fazer uma análise técnica para confirmar o melhor caminho.",
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
      carencia,
      idadeAtual,
      idadeMin,
    };
  }

  // 2) Tempo total ainda insuficiente
  if (tempoTotal < carencia) {
    return {
      caso: "INSUFICIENTE",
      titulo: "Tempo ainda insuficiente",
      mensagem:
        "Ainda não há tempo suficiente, mesmo somando Brasil e exterior. Uma análise pode verificar alternativas, ajustes ou períodos não computados.",
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
      carencia,
      idadeAtual,
      idadeMin,
      mesesFaltantes: carencia - tempoTotal,
    };
  }

  // 3) Aposentadoria por idade — carência somada OK mas idade pendente
  if (tipo === "aposentadoria_idade" && idadeAtual < idadeMin) {
    return {
      caso: "AGUARDA_IDADE",
      titulo: "Tempo cumprido — aguardando idade mínima",
      mensagem:
        "Você já possui tempo suficiente considerando Brasil e exterior, mas ainda não atingiu a idade mínima. Um planejamento pode indicar a melhor data para requerer.",
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
      carencia,
      idadeAtual,
      idadeMin,
      mesesParaIdadeMin: mesesParaIdade(nascInput, idadeMin),
    };
  }

  // 4) Totalização viável
  return {
    caso: "TOTALIZACAO_OK",
    titulo: "Indícios de direito à totalização internacional",
    mensagem:
      "Há indícios de direito à totalização internacional. A análise técnica é necessária para calcular o valor e preparar o requerimento.",
    tempoBrasil: tempoBrasilMeses,
    tempoPais: tempoPaisMeses,
    tempoTotal,
    carencia,
    idadeAtual,
    idadeMin,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CÁLCULO TÉCNICO (Pro — advogado).
// ═══════════════════════════════════════════════════════════════════════════

export interface ResultadoCalculo {
  caso: 1 | 2 | "2B" | 3;
  titulo: string;
  descricao: string;
  /** SB usado no cálculo (média dos 80% maiores SC ≥ 07/1994, corrigidos pelo INPC quando informado). */
  sb?: number;
  coeficiente?: number;
  /** SB × coeficiente, ANTES de aplicar o piso do salário mínimo. */
  prestacaoTeoricaSemPiso?: number;
  /** max(prestacaoTeoricaSemPiso, SMmin) — piso aplicado ANTES do pro-rata. */
  prestacaoTeorica?: number;
  indiceProrata?: number;
  /** RMI integral (sem pro-rata) — usada no cenário em que o Brasil cumpre carência sozinho. */
  rmiTeorica?: number;
  /** RMI proporcional (prestacaoTeorica × indiceProrata). Sem piso pós pro-rata. */
  rmiProrata?: number;
  tempoBrasil: number;
  tempoPais: number;
  tempoTotal: number;
  mesesFaltantes?: number;
  mesesParaIdade?: number;
}

export function calcularResultado(params: {
  tempoBrasilMeses: number;
  tempoPaisMeses: number;
  /** Salário de Benefício (média dos 80% maiores SC ≥ 07/1994, idealmente corrigido pelo INPC). */
  sbFinal: number;
  tipo: TipoBeneficio;
  nascInput: string;
  sexo: Sexo;
  nomePais: string;
}): ResultadoCalculo {
  const { tempoBrasilMeses, tempoPaisMeses, sbFinal, tipo, nascInput, sexo, nomePais } = params;
  const carencia = CARENCIAS[tipo];
  const tempoTotal = tempoBrasilMeses + tempoPaisMeses;
  const idadeMin = idadeMinimaPara(sexo);
  const idadeAtual = calcIdade(nascInput);
  const semSalario = !sbFinal || sbFinal <= 0;

  const coef = coeficientePara(tipo, tempoTotal);
  const prestSemPiso = semSalario ? undefined : sbFinal * coef;
  const prestComPiso = prestSemPiso == null ? undefined : Math.max(prestSemPiso, SMmin);

  // Caso 1: Brasil já tem carência solo — RMI integral (sem pro-rata)
  if (tempoBrasilMeses >= carencia) {
    return {
      caso: 1,
      titulo: "Carência cumprida no Brasil sem necessidade de totalização",
      descricao: semSalario
        ? `Com ${formatarTempo(tempoBrasilMeses)} apenas no Brasil, a carência de ${carencia} meses já está atingida. A totalização com ${nomePais} reduziria o valor — recomenda-se requerimento isolado pelo RGPS.`
        : `Com ${formatarTempo(tempoBrasilMeses)} apenas no Brasil, a carência de ${carencia} meses já está atingida. A totalização com ${nomePais} aplicaria pro-rata e REDUZIRIA o valor — recomenda-se requerimento isolado pelo RGPS.`,
      sb: semSalario ? undefined : sbFinal,
      coeficiente: coef,
      prestacaoTeoricaSemPiso: prestSemPiso,
      prestacaoTeorica: prestComPiso,
      rmiTeorica: prestComPiso,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }

  // Caso 2: tempo total insuficiente
  if (tempoTotal < carencia) {
    return {
      caso: 2,
      titulo: "Carência insuficiente mesmo com totalização",
      descricao: `Mesmo somando Brasil (${formatarTempo(tempoBrasilMeses)}) + ${nomePais} (${formatarTempo(tempoPaisMeses)}), o total de ${formatarTempo(tempoTotal)} é insuficiente. Faltam ${carencia - tempoTotal} meses de contribuição.`,
      mesesFaltantes: carencia - tempoTotal,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }

  // Caso 2B: aposentadoria por idade com carência ok mas sem idade mínima
  if (tipo === "aposentadoria_idade" && idadeAtual < idadeMin) {
    const mesesRestantes = mesesParaIdade(nascInput, idadeMin);
    const indice = tempoTotal > 0 ? tempoBrasilMeses / tempoTotal : 0;
    const rmiProjetada = prestComPiso != null ? prestComPiso * indice : undefined;
    return {
      caso: "2B",
      titulo: "Totalização viável — idade mínima ainda não atingida",
      descricao: `Carência atingida (${formatarTempo(tempoTotal)}), mas idade atual é ${idadeAtual} anos (mínima ${idadeMin} — EC 103/2019). Faltam ${formatarTempo(mesesRestantes)}. Pode-se projetar a RMI pro-rata para planejamento.`,
      sb: semSalario ? undefined : sbFinal,
      coeficiente: coef,
      prestacaoTeoricaSemPiso: prestSemPiso,
      prestacaoTeorica: prestComPiso,
      indiceProrata: indice,
      rmiProrata: rmiProjetada,
      mesesParaIdade: mesesRestantes,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }

  // Caso 3: totalização válida
  if (semSalario) {
    return {
      caso: 3,
      titulo: "Totalização válida",
      descricao: `Tempo mínimo atingido somando Brasil + ${nomePais}. Informe o SB (ou carregue o CNIS) para calcular a RMI pro-rata.`,
      coeficiente: coef,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }
  const indiceProrata = tempoBrasilMeses / tempoTotal;
  // PISO APLICA ANTES DO PRO-RATA — não há piso pós pro-rata.
  const rmiProrata = (prestComPiso as number) * indiceProrata;
  return {
    caso: 3,
    titulo: "Totalização válida",
    descricao: `RMI pro-rata calculada pelo acordo com ${nomePais}. Período brasileiro: ${formatarTempo(tempoBrasilMeses)} / Total: ${formatarTempo(tempoTotal)}.`,
    sb: sbFinal,
    coeficiente: coef,
    prestacaoTeoricaSemPiso: prestSemPiso,
    prestacaoTeorica: prestComPiso,
    indiceProrata,
    rmiTeorica: prestComPiso,
    rmiProrata,
    tempoBrasil: tempoBrasilMeses,
    tempoPais: tempoPaisMeses,
    tempoTotal,
  };
}
