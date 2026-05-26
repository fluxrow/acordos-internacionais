// Lógica de cálculo de totalização internacional (RGPS + acordos bilaterais).
// 100% client-side. Usada pela calculadora pública e pela Pro.

// SMmin — atualizar todo janeiro
export const SMmin = 1412;

// Carências (em meses)
export const CARENCIAS = {
  aposentadoria_idade: 180,
  pensao_morte: 18,
} as const;

// Coeficientes base
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

/**
 * Calcula meses entre duas datas no formato ISO (YYYY-MM-DD) vindo de <input type="date">.
 * Retorna 0 se inválido ou negativo.
 */
export function calcMesesEntreDatas(iso1: string, iso2: string): number {
  if (!iso1 || !iso2) return 0;
  const d1 = new Date(iso1 + "T12:00:00");
  const d2 = new Date(iso2 + "T12:00:00");
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  return diff > 0 ? Math.round(diff) : 0;
}

export type TipoBeneficio = "aposentadoria_idade" | "pensao_morte";
export type Sexo = "F" | "M";

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

export interface ResultadoCalculo {
  caso: 1 | 2 | "2B" | 3;
  titulo: string;
  descricao: string;
  rmiProrata?: number;
  rmiTeorica?: number;
  tempoBrasil: number;
  tempoPais: number;
  tempoTotal: number;
  mesesFaltantes?: number;
  mesesParaIdade?: number;
}

export function calcularResultado(params: {
  tempoBrasilMeses: number;
  tempoPaisMeses: number;
  sbFinal: number;
  tipo: TipoBeneficio;
  nascInput: string;
  sexo: Sexo;
  nomePais: string;
}): ResultadoCalculo {
  const { tempoBrasilMeses, tempoPaisMeses, sbFinal, tipo, nascInput, sexo, nomePais } = params;
  const carencia = CARENCIAS[tipo];
  const coef = COEFICIENTES[tipo];
  const tempoTotal = tempoBrasilMeses + tempoPaisMeses;
  const idadeMin = sexo === "F" ? 62 : 65;
  const idadeAtual = calcIdade(nascInput);

  const semSalario = !sbFinal || sbFinal <= 0;

  // Caso 1: Brasil já tem carência solo
  if (tempoBrasilMeses >= carencia) {
    const rmiTeorica = semSalario ? undefined : sbFinal * coef;
    return {
      caso: 1,
      titulo: "Totalização desnecessária",
      descricao: semSalario
        ? `Com ${formatarTempo(tempoBrasilMeses)} apenas no Brasil, você já atingiu a carência de ${carencia} meses. Não é necessário juntar o tempo no exterior — recomendamos requerer pelo Brasil isoladamente.`
        : `Com ${formatarTempo(tempoBrasilMeses)} apenas no Brasil, você já atingiu a carência de ${carencia} meses. A totalização usaria pro-rata e REDUZIRIA o valor do benefício. Recomendamos requerer pelo Brasil isoladamente.`,
      rmiTeorica,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }

  // Caso 2: tempo total insuficiente
  if (tempoTotal < carencia) {
    return {
      caso: 2,
      titulo: "Totalização inviável",
      descricao: `Mesmo somando Brasil (${formatarTempo(tempoBrasilMeses)}) + ${nomePais} (${formatarTempo(tempoPaisMeses)}), o total de ${formatarTempo(tempoTotal)} é insuficiente. Faltam ${carencia - tempoTotal} meses de contribuição.`,
      mesesFaltantes: carencia - tempoTotal,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }

  // Caso 2B: carência ok, mas sem idade mínima (só p/ aposentadoria por idade)
  if (tipo === "aposentadoria_idade" && idadeAtual < idadeMin) {
    const mesesRestantes = mesesParaIdade(nascInput, idadeMin);
    return {
      caso: "2B",
      titulo: "Planejamento — aguardar idade mínima",
      descricao: `Carência atingida (${formatarTempo(tempoTotal)}), mas você tem ${idadeAtual} anos. A idade mínima é ${idadeMin} anos (EC 103/2019). Faltam ${formatarTempo(mesesRestantes)} para atingir a idade.`,
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
      descricao: `Você cumpre o tempo mínimo somando Brasil + ${nomePais}. Para saber o valor exato do benefício, carregue o extrato do INSS (CNIS).`,
      tempoBrasil: tempoBrasilMeses,
      tempoPais: tempoPaisMeses,
      tempoTotal,
    };
  }
  const rmiTeorica = sbFinal * coef;
  const rmiProrata = rmiTeorica * (tempoBrasilMeses / tempoTotal);
  const rmiAjustada = Math.max(rmiProrata, SMmin);
  return {
    caso: 3,
    titulo: "Totalização válida",
    descricao: `Benefício calculado por pro-rata em acordo com ${nomePais}. Período brasileiro: ${formatarTempo(tempoBrasilMeses)} / Total: ${formatarTempo(tempoTotal)}.`,
    rmiTeorica,
    rmiProrata: rmiAjustada,
    tempoBrasil: tempoBrasilMeses,
    tempoPais: tempoPaisMeses,
    tempoTotal,
  };
}

