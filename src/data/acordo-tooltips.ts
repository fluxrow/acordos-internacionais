// Tooltips curados pelo Dr. Marcos para 8 acordos prioritários.
// Estrutura: slug -> lado -> lista de itens (nome canônico + tooltip).
// Se `insertIfMissing` for true e o nome não existir em
// `importado.beneficios[lado]`, ele é adicionado ao final.
// O matching é case-insensitive e tolerante a acentos.

export type TooltipLado = "brasil" | "parceiro";

export interface AcordoTooltipItem {
  /** Nome canônico do benefício. Usado tanto para casar com o item existente
   *  quanto para inserir um novo, se `insertIfMissing` for true. */
  nome: string;
  /** Aliases (case/acento-insensitive, substring) para casar com nomes que
   *  já estejam no acordo gerado mas escritos de forma ligeiramente diferente. */
  aliases?: string[];
  tooltip: string;
  /** Se true e nenhum item casar, adiciona `nome` ao final da lista. */
  insertIfMissing?: boolean;
  /** Se preenchido, substitui o nome atual do item casado por este texto
   *  (útil para limpar nomes "sujos" no dataset gerado). */
  rename?: string;
}

export type AcordoTooltips = Partial<Record<TooltipLado, AcordoTooltipItem[]>>;

const FRANCA_PENSAO_MORTE_TOOLTIP = `Na legislação francesa, "prestações a sobreviventes" pode abranger, conforme o caso, pensão de reversão, auxílio viuvez, capital por morte, renda aos dependentes em caso de acidente de trabalho ou doença profissional e prestações específicas ao cônjuge sobrevivente inválido.

1. Pensão de reversão (retraite de réversion / pension de réversion). É a prestação mais clássica ao cônjuge ou ex-cônjuge sobrevivente, sob condições. A Assurance Retraite trata esse direito como uma parte da aposentadoria do segurado falecido.

2. Auxílio viuvez (allocation veuvage). É uma prestação temporária para viúvo ou viúva, sujeita a requisitos como idade e renda.

3. Capital por morte (capital décès). É um pagamento único, voltado a ajudar com as despesas e o impacto financeiro imediato do falecimento. Não é pensão mensal.

4. Renda aos dependentes em caso de acidente do trabalho ou doença profissional (rente aux ayants droit). Se o falecimento decorre de acidente de trabalho ou doença ocupacional, os dependentes podem receber uma renda periódica específica.

5. Pensão para viúvo ou viúva inválido(a) (pension de veuf/veuve invalide). Existe também essa prestação específica no sistema francês, ligada à condição de invalidez do cônjuge sobrevivente, em hipóteses próprias.`;

export const acordoTooltips: Record<string, AcordoTooltips> = {
  franca: {
    parceiro: [
      {
        nome: "Benefício por óbito",
        tooltip:
          "No sistema francês, este item cobre prestações ligadas ao falecimento do segurado. Não é sinônimo automático de pensão por morte, porque o acordo também trata separadamente das prestações a sobreviventes.",
      },
      {
        nome: "Pensão por morte e prestações a sobreviventes",
        aliases: ["pensão por morte e prestações"],
        rename: "Pensão por morte e prestações a sobreviventes",
        tooltip: FRANCA_PENSAO_MORTE_TOOLTIP,
      },
      {
        nome: "Benefícios familiares",
        tooltip:
          "Na aplicação do acordo França-Brasil, “benefícios familiares” abrange, em especial, os abonos de família e o subsídio de nascimento ou de adoção da prestação de acolhimento à criança (PAJE). Os abonos de família são prestações pagas para ajudar nas despesas com filhos a cargo, e a PAJE inclui ajuda financeira ligada ao nascimento ou à adoção.",
        insertIfMissing: true,
      },
    ],
  },

  suica: {
    parceiro: [
      {
        nome: "Aposentadoria por idade",
        tooltip:
          "Na Suíça denominada 'renda de velhice'. Regida pelo seguro-velhice e sobreviventes, cujas siglas são AVS (Assurance-vieillesse et survivants, em francês) e AHV (Alters- und Hinterlassenenversicherung, em alemão). A totalização com períodos brasileiros pode ser usada para atingir o mínimo exigido.",
        insertIfMissing: true,
      },
      {
        nome: "Aposentadoria por invalidez",
        tooltip:
          "Na Suíça denominada 'renda de invalidez'. Regida pelo seguro-invalidez, cujas siglas são AI (Assurance-invalidité, em francês) e IV (Invalidenversicherung, em alemão). Cobre incapacidade para o trabalho reconhecida pela legislação suíça, incluindo doença geral e acidente.",
        insertIfMissing: true,
      },
      {
        nome: "Pensão por morte",
        tooltip:
          "Na Suíça denominada 'renda de sobrevivência'. Regida pelo mesmo seguro-velhice e sobreviventes (AVS/AHV), concedida ao cônjuge sobrevivente e aos órfãos quando o direito decorre de períodos de seguro cobertos pelo acordo.",
        insertIfMissing: true,
      },
    ],
  },

  portugal: {
    parceiro: [
      {
        nome: "Assistência médica",
        tooltip:
          "No lado português, a assistência médica refere-se às prestações em espécie de doença e maternidade no sistema público de saúde, nos termos do acordo.",
      },
      {
        nome: "Benefícios familiares",
        tooltip:
          "No lado português, benefícios familiares abrangem prestações pagas em razão dos encargos familiares, conforme a legislação aplicável e os formulários do acordo.",
      },
    ],
    brasil: [
      {
        nome: "Assistência médica",
        tooltip:
          "No lado brasileiro, “assistência médica” refere-se ao atendimento na rede pública de saúde, atualmente no âmbito do SUS. No contexto do acordo, a previsão tem função de coordenação e reciprocidade entre os sistemas, e não de criação de um acesso exclusivo à saúde pública.",
      },
    ],
  },

  bulgaria: {
    parceiro: [
      {
        nome: "Pensão por períodos de seguro e idade",
        tooltip:
          "Benefício búlgaro concedido conforme períodos de seguro e idade. É a categoria mais próxima da aposentadoria por idade, mas segue os critérios próprios do Seguro Social Estatal da Bulgária.",
      },
      {
        nome: "Aposentadoria por Invalidez",
        tooltip:
          "Benefício búlgaro por invalidez. O acordo reúne nessa categoria as situações de incapacidade reconhecidas pela legislação búlgara, sem necessidade de separar a causa no card.",
      },
      {
        nome: "Pensão de sobreviventes",
        tooltip:
          "Benefício destinado às pessoas sobreviventes ou dependentes, quando o direito decorre das categorias previdenciárias cobertas pela legislação búlgara. É a categoria mais próxima da pensão por morte.",
        insertIfMissing: true,
      },
    ],
  },

  canada: {
    parceiro: [
      {
        nome: "Lei da Proteção Social do Idoso e seus Regulamentos",
        tooltip:
          "Base legal do programa canadense de velhice/idade. No contexto do acordo, ela se relaciona principalmente à aposentadoria por idade no sistema OAS, além de prestações complementares vinculadas à renda e à condição familiar, conforme as regras internas do Canadá.",
        insertIfMissing: true,
      },
      {
        nome: "Plano de Pensão do Canadá e seus Regulamentos",
        tooltip:
          "Base legal do Canada Pension Plan (CPP), o regime contributivo canadense. No acordo, ele se conecta aos benefícios de aposentadoria contributiva, invalidez e sobrevivência, inclusive algumas prestações pagas a dependentes e sobreviventes, conforme a legislação canadense aplicável.",
        insertIfMissing: true,
      },
    ],
  },

  alemanha: {
    parceiro: [
      {
        nome: "Seguro Previdenciário",
        tooltip:
          "Abrange as principais prestações da previdência alemã: aposentadorias por idade (Altersrenten), benefícios por incapacidade laboral (Erwerbsminderungsrenten) e pensões por morte/dependentes (Hinterbliebenenrenten).",
      },
      {
        nome: "Seguro Complementar da Caixa dos Operários Siderúrgicos",
        tooltip:
          "Regime complementar alemão específico para certos trabalhadores da indústria siderúrgica, com prestações adicionais relacionadas à aposentadoria, incapacidade e proteção aos dependentes.",
      },
      {
        nome: "Seguro de Aposentadoria dos Agricultores",
        tooltip:
          "Sistema próprio dos agricultores na Alemanha. Pode envolver prestações por idade, incapacidade laboral e pensões por morte, conforme a legislação alemã aplicável.",
      },
      {
        nome: "Seguro de Acidentes",
        tooltip:
          "Cobre acidentes de trabalho e doenças ocupacionais. No contexto do acordo, o foco está nas prestações pecuniárias, como rendas/pensões por redução da capacidade laboral e prestações para dependentes.",
        insertIfMissing: true,
      },
    ],
  },

  quebec: {
    parceiro: [
      {
        nome: "Lei da Proteção Social do Idoso (Lei Q-2)",
        tooltip:
          "Garante renda básica aos idosos residentes no Québec que não possuem pensão suficiente. Não exige histórico de contribuição — é baseado na residência e na renda do beneficiário.",
      },
      {
        nome: "Plano de Pensão do Canadá",
        tooltip:
          "Benefício contributivo baseado nas contribuições realizadas durante a vida laboral no Canadá. Cobre aposentadoria por idade, aposentadoria por invalidez e pensão por morte dos dependentes.",
      },
      {
        nome: "Seguro de Deslocamento",
        tooltip:
          "Cobertura previdenciária para trabalhadores brasileiros temporariamente deslocados ao Québec. Evita a dupla contribuição e garante que o período trabalhado no exterior seja reconhecido para fins de benefício.",
        insertIfMissing: true,
      },
    ],
    brasil: [
      {
        nome: "Aposentadoria por Idade",
        aliases: ["aposentadoria por idade"],
        tooltip:
          "Devida ao segurado que atingir a idade mínima (65 anos para homens, 62 para mulheres) com o período de carência exigido. Os períodos contribuídos no Québec podem ser totalizados para atingir a carência.",
      },
      {
        nome: "Aposentadoria por Invalidez",
        aliases: ["aposentadoria por invalidez"],
        tooltip:
          "Devida ao segurado considerado incapaz e insusceptível de reabilitação para o exercício de atividade que lhe garanta subsistência. Carência de 12 contribuições mensais, salvo acidente ou doença profissional.",
      },
      {
        nome: "Pensão por Morte",
        aliases: ["pensão por morte"],
        tooltip:
          "Devida ao conjunto de dependentes do segurado que falecer, aposentado ou não. O valor corresponde a 100% da aposentadoria recebida ou que o segurado teria direito, rateado entre os dependentes.",
      },
      {
        nome: "Incapacidade Permanente para o Trabalho",
        aliases: ["incapacidade permanente"],
        tooltip:
          "Corresponde à aposentadoria por invalidez na legislação brasileira. É concedida ao segurado que, após cumprida a carência, for considerado incapaz de forma permanente para qualquer atividade laboral.",
      },
      {
        nome: "Regime Geral de Previdência Social (RGPS)",
        aliases: ["rgps"],
        tooltip:
          "Regime previdenciário administrado pelo INSS que cobre trabalhadores da iniciativa privada, autônomos e contribuintes individuais. É o regime geral ao qual se aplica a totalização de períodos do acordo com o Québec.",
      },
      {
        nome: "Regimes Próprios de Previdência Social (RPPS)",
        tooltip:
          "Regimes previdenciários exclusivos dos servidores públicos efetivos da União, Estados, Distrito Federal e Municípios. Também reconhecidos no acordo para fins de totalização de períodos.",
        insertIfMissing: true,
      },
    ],
  },

  italia: {
    parceiro: [
      {
        nome: "Auxílio-funeral",
        tooltip:
          "Refere-se à prestação paga em razão das despesas decorrentes do falecimento, prevista nos documentos do acordo Itália-Brasil.",
      },
      {
        nome: "Benefícios do seguro contra tuberculose",
        tooltip:
          "Corresponde ao regime italiano de seguro contra tuberculose mencionado no Protocolo Adicional do acordo.",
        insertIfMissing: true,
      },
    ],
    brasil: [
      {
        nome: "Assistência médica",
        tooltip:
          "No lado brasileiro, “assistência médica” refere-se ao atendimento na rede pública de saúde, atualmente no âmbito do SUS. No contexto do acordo, a previsão tem função de coordenação e reciprocidade entre os sistemas, e não de criação de um acesso exclusivo à saúde pública.",
      },
    ],
  },
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Procura o item de tooltip que casa com `nome` (case/acento-insensitive). */
export function findTooltipFor(
  slug: string,
  lado: TooltipLado,
  nome: string,
): AcordoTooltipItem | undefined {
  const items = acordoTooltips[slug]?.[lado];
  if (!items) return undefined;
  const n = normalize(nome);
  for (const it of items) {
    const candidates = [it.nome, ...(it.aliases ?? [])].map(normalize);
    if (candidates.some((c) => n === c || n.startsWith(c) || n.includes(c))) {
      return it;
    }
  }
  return undefined;
}

/** Retorna lista de benefícios de um lado já com inserções de
 *  `insertIfMissing` aplicadas e renames consolidados. */
export function applyTooltipsToBeneficios(
  slug: string,
  lado: TooltipLado,
  beneficios: string[],
): string[] {
  const items = acordoTooltips[slug]?.[lado];
  if (!items) return beneficios;
  const out = [...beneficios];

  // Renames
  for (let i = 0; i < out.length; i++) {
    const tt = findTooltipFor(slug, lado, out[i]);
    if (tt?.rename) out[i] = tt.rename;
  }

  // Inserts (somente se não houver match com nenhum existente)
  for (const it of items) {
    if (!it.insertIfMissing) continue;
    const has = out.some((b) => {
      const tt = findTooltipFor(slug, lado, b);
      return tt && tt.nome === it.nome;
    });
    if (!has) out.push(it.nome);
  }
  return out;
}
