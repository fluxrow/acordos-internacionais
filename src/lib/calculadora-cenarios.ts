// Classifica o resultado da calculadora em um ou mais "cenários" (G1..G4 + 2/2B),
// no padrão das referências do Dr. Marcos. Cada cenário tem um texto humano
// (Segurado vê) e um texto técnico (Advogado vê) gerados a partir dos números
// reais do usuário, mais chips de citação legal.
//
// Puro, sem efeitos colaterais — fácil de testar.

import { formatarMoeda, formatarTempo, type ResultadoCalculo, type TipoBeneficio } from "./calculadora";

export type CenarioId = "G1" | "G2" | "G2B" | "G2F" | "G3" | "G4";

export interface CenarioInputs {
  pais: string;
  tipo: TipoBeneficio;
  carencia: number;
}

export interface Cenario {
  id: CenarioId;
  titulo: string;
  subtitulo: string;
  segurado: string;
  advogado: {
    chamada: string;
    bullets: string[];
  };
  citacoes: string[];
}

/** Decreto/instrumento de cada acordo bilateral por país (display name). */
const PAIS_DECRETO: Record<string, string> = {
  "Alemanha": "Decreto nº 8.000/2013",
  "Argentina": "Decreto nº 5.722/2006 (Mercosul)",
  "Áustria": "Decreto nº 12.952/2026",
  "Bélgica": "Decreto nº 8.405/2015",
  "Bolívia": "Acordo Ibero-americano",
  "Bulgária": "Acordo Brasil-Bulgária",
  "Cabo Verde": "Decreto nº 8.000/2013",
  "Canadá": "Decreto nº 8.288/2014",
  "Chile": "Decreto nº 6.957/2009",
  "Coreia do Sul": "Decreto nº 7.730/2012",
  "Espanha": "Decreto nº 4.729/2003",
  "Estados Unidos": "Decreto nº 9.422/2018",
  "França": "Decreto nº 8.288/2014",
  "Grécia": "Decreto nº 9.388/2018",
  "Índia": "Decreto nº 10.220/2020",
  "Israel": "Decreto nº 11.193/2022",
  "Itália": "Decreto nº 78.787/1976",
  "Japão": "Decreto nº 9.434/2018",
  "Luxemburgo": "Decreto nº 8.443/2015",
  "Moçambique": "Convenção CPLP",
  "Paraguai": "Decreto nº 5.722/2006 (Mercosul)",
  "Portugal": "Decreto nº 1.457/1995",
  "Quebec (Canadá)": "Decreto nº 10.615/2021",
  "República Tcheca": "Decreto nº 8.742/2016",
  "Suíça": "Decreto nº 8.110/2013",
  "Uruguai": "Decreto nº 5.722/2006 (Mercosul)",
};

/** Carência mínima isolada do país para a aposentadoria por idade (meses). */
const PAIS_CARENCIA_ISOLADA: Record<string, number> = {
  "Alemanha": 60,
  "Argentina": 360,
  "Áustria": 180,
  "Bélgica": 0,
  "Bolívia": 180,
  "Bulgária": 180,
  "Cabo Verde": 180,
  "Canadá": 0,
  "Chile": 240,
  "Coreia do Sul": 120,
  "Espanha": 180,
  "Estados Unidos": 40,
  "França": 12,
  "Grécia": 180,
  "Índia": 120,
  "Israel": 60,
  "Itália": 240,
  "Japão": 120,
  "Luxemburgo": 120,
  "Moçambique": 240,
  "Paraguai": 1250,
  "Portugal": 180,
  "Quebec (Canadá)": 12,
  "República Tcheca": 360,
  "Suíça": 12,
  "Uruguai": 180,
};

export function decretoDoPais(pais: string): string {
  return PAIS_DECRETO[pais] ?? "Acordo bilateral aplicável";
}

export function carenciaIsoladaDoPais(pais: string): number | null {
  const v = PAIS_CARENCIA_ISOLADA[pais];
  return typeof v === "number" ? v : null;
}

/** Detecta um ou mais cenários a partir do resultado + entrada. */
export function detectarCenarios(
  resultado: ResultadoCalculo,
  inputs: CenarioInputs,
): Cenario[] {
  const out: Cenario[] = [];
  const { pais, tipo, carencia } = inputs;
  const decreto = decretoDoPais(pais);
  const carenciaPais = carenciaIsoladaDoPais(pais);

  // --- G1: carência já cumprida solo (caso 1) ---------------------------------
  if (resultado.caso === 1) {
    out.push({
      id: "G1",
      titulo: "Carência já cumprida solo (sem totalização)",
      subtitulo: `${resultado.tempoBrasil} meses RGPS → carência de ${carencia} meses satisfeita sem precisar do exterior`,
      segurado: [
        `Você já possui tempo suficiente no Brasil (${formatarTempo(resultado.tempoBrasil)})`,
        `para requerer sua ${tipo === "pensao_morte" ? "pensão" : "aposentadoria"}.`,
        `Recomendamos que converse com um especialista em previdência`,
        `para entender as melhores opções e garantir o maior benefício possível.`,
      ].join(" "),
      advogado: {
        chamada: "Oportunidade de planejamento detectada.",
        bullets: [
          `A carência está satisfeita pelo RGPS solo (${resultado.tempoBrasil} meses). A totalização com ${pais} reduziria o RMI via pro-rata. Avalie com o cliente:`,
          "Requerimento imediato ao INSS sem totalização",
          carenciaPais != null
            ? `Possibilidade de aposentadoria também em ${pais} (${resultado.tempoPais} meses${carenciaPais > 0 ? ` — carência isolada local: ${carenciaPais} meses` : ""}) pelo ${decreto}`
            : `Verificar elegibilidade autônoma em ${pais} pelo ${decreto}`,
          "Estratégia de maximização do PBC para elevar o SB",
        ],
      },
      citacoes: [decreto, "Art. 35, Dec. 3.048/99", "Pro-rata indesejado"],
    });
  }

  // --- G2F: faltam meses (caso 2) ---------------------------------------------
  if (resultado.caso === 2) {
    out.push({
      id: "G2F",
      titulo: "Tempo total insuficiente para o benefício",
      subtitulo: `Brasil ${resultado.tempoBrasil} + ${pais} ${resultado.tempoPais} = ${resultado.tempoTotal} meses (faltam ${resultado.mesesFaltantes ?? carencia - resultado.tempoTotal})`,
      segurado: [
        `Mesmo somando seu tempo no Brasil (${formatarTempo(resultado.tempoBrasil)})`,
        `com o tempo em ${pais} (${formatarTempo(resultado.tempoPais)}),`,
        `o total ainda não alcança o mínimo necessário.`,
        `Um especialista pode indicar um plano de contribuição para você chegar lá.`,
      ].join(" "),
      advogado: {
        chamada: "Carência inatingida mesmo após totalização.",
        bullets: [
          `Faltam ${resultado.mesesFaltantes ?? carencia - resultado.tempoTotal} meses para a carência de ${carencia} meses (${formatarTempo(carencia)}).`,
          "Avaliar contribuição facultativa (NIT 1163) para fechar o tempo",
          "Verificar tempos não computados no CNIS (concomitância, indenização)",
          carenciaPais != null && resultado.tempoPais >= carenciaPais
            ? `Possível benefício autônomo em ${pais} (${resultado.tempoPais} ≥ ${carenciaPais} meses) pelo ${decreto}`
            : `Reavaliar elegibilidade em ${pais} pelo ${decreto}`,
        ],
      },
      citacoes: [decreto, "Art. 25, Lei 8.213/91", "Contribuição facultativa"],
    });
  }

  // --- G2B: aguardar idade (caso 2B) ------------------------------------------
  if (resultado.caso === "2B" && resultado.mesesParaIdade != null) {
    out.push({
      id: "G2B",
      titulo: "Tempo suficiente — aguardando idade mínima",
      subtitulo: `Carência satisfeita após totalização. Faltam ${formatarTempo(resultado.mesesParaIdade)} para a idade mínima (EC 103/2019)`,
      segurado: [
        `Boa notícia: somando seu tempo no Brasil com ${pais}, você já cumpre o tempo mínimo.`,
        `O que falta agora é atingir a idade mínima — faltam ${formatarTempo(resultado.mesesParaIdade)}.`,
        `Vale conversar com um especialista para planejar contribuições nesse intervalo.`,
      ].join(" "),
      advogado: {
        chamada: "Janela de planejamento contributivo aberta.",
        bullets: [
          `Carência total: ${resultado.tempoTotal} meses (≥ ${carencia}). Aguarda idade mínima — faltam ${formatarTempo(resultado.mesesParaIdade)}.`,
          "Continuação contributiva para elevar o denominador brasileiro do pro-rata",
          "Revisão do PBC (80% maiores SC, IPCA-E) — possíveis contribuições facultativas estratégicas",
          `Confirmar elegibilidade paralela em ${pais} pelo ${decreto}`,
        ],
      },
      citacoes: ["EC 103/2019", decreto, "Planejamento contributivo"],
    });
  }

  // --- G2: tempo relevante nos dois países (caso 3 com Brasil < carência e ambos ≥ 96m) ---
  if (
    resultado.caso === 3 &&
    resultado.tempoBrasil < carencia &&
    resultado.tempoBrasil >= 96 &&
    resultado.tempoPais >= 96
  ) {
    out.push({
      id: "G2",
      titulo: "Tempo relevante nos dois países",
      subtitulo: `Brasil ${formatarTempo(resultado.tempoBrasil)} + ${pais} ${formatarTempo(resultado.tempoPais)} — ambos abaixo da carência isolada brasileira`,
      segurado: [
        `Você possui contribuições em dois países.`,
        `Existem acordos internacionais que podem combinar esse tempo para garantir seus direitos.`,
        `Um especialista poderá orientá-lo sobre como aproveitar ao máximo o que você contribuiu.`,
      ].join(" "),
      advogado: {
        chamada: "Situação de dupla elegibilidade potencial.",
        bullets: [
          `Tempo relevante em ambos os países pode viabilizar tanto a totalização para carência quanto a aposentadoria dupla (INSS + sistema ${pais}). Avalie:`,
          "Viabilidade da totalização para atingir carência mínima",
          `Duplo requerimento (benefício pro-rata no Brasil + benefício autônomo em ${pais})`,
          "Impacto do pro-rata no RMI brasileiro vs. benefício independente",
        ],
      },
      citacoes: ["Totalização", "Duplo requerimento", "Art. 1º, Dec. 3.048/99"],
    });
  }

  // --- G3: pro-rata penaliza mais de 20% (caso 3 com valor) -------------------
  if (
    resultado.caso === 3 &&
    resultado.rmiTeorica != null &&
    resultado.rmiProrata != null &&
    resultado.rmiTeorica > 0
  ) {
    const reducao = (resultado.rmiTeorica - resultado.rmiProrata) / resultado.rmiTeorica;
    if (reducao > 0.2) {
      const pct = (reducao * 100).toFixed(1);
      out.push({
        id: "G3",
        titulo: `Pro-rata reduz o RMI em ${pct}%`,
        subtitulo: `RMI teórica ${formatarMoeda(resultado.rmiTeorica)} → pro-rata ${formatarMoeda(resultado.rmiProrata)} — totalização necessária, mas penaliza significativamente o benefício`,
        segurado: [
          `O cálculo inicial do seu benefício pode ser otimizado.`,
          `Consulte um especialista para avaliar estratégias que possam aumentar o valor da sua aposentadoria.`,
        ].join(" "),
        advogado: {
          chamada: `Pro-rata causa redução de ${pct}% no RMI.`,
          bullets: [
            "Verifique se é viável aguardar mais contribuições no RGPS para reduzir o impacto do pro-rata antes do requerimento. Considere também:",
            "Continuação contributiva para aumentar o denominador brasileiro",
            "Revisão do PBC com recolhimentos facultativos estratégicos",
            "Ação judicial para discussão de tempo especial que eleve o tempo RGPS",
          ],
        },
        citacoes: [`Pro-rata ${pct}%`, "Planejamento contributivo", "Tempo especial"],
      });
    }
  }

  // --- G4: tempo no exterior insuficiente para benefício autônomo no país -----
  if (
    carenciaPais != null &&
    carenciaPais > 0 &&
    resultado.tempoPais > 0 &&
    resultado.tempoPais < carenciaPais &&
    resultado.caso !== 2
  ) {
    out.push({
      id: "G4",
      titulo: `Tempo em ${pais} insuficiente para aposentadoria autônoma local`,
      subtitulo: `${resultado.tempoPais} meses em ${pais} — abaixo da carência isolada local (${carenciaPais} meses)`,
      segurado: [
        `Você contribuiu em outro país e pode ter direitos previdenciários no exterior.`,
        `Um advogado especializado pode verificar quais benefícios você tem direito a receber.`,
      ].join(" "),
      advogado: {
        chamada: `Tempo em ${pais} abaixo da carência autônoma estrangeira.`,
        bullets: [
          `${resultado.tempoPais} meses em ${pais} não atingem os ${carenciaPais} meses exigidos autonomamente, mas podem ser totalizados.`,
          `Verifique se ${pais} aceita totalização reversa (tempo brasileiro computa para a carência local).`,
          `Caso positivo, o cliente pode ter direito a benefício pro-rata também em ${pais} pelo ${decreto}.`,
        ],
      },
      citacoes: ["Totalização reversa", decreto, "Benefício no exterior"],
    });
  }

  return out;
}
