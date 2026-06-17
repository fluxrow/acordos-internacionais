// Dados canônicos dos acordos internacionais de previdência social do Brasil.
// Fonte: gov.br + repositório Mapa-de-Acordos.
//
// Estrutura em camadas:
//   1. acordos[]               — catálogo curado (status, resumo editorial).
//   2. conteudoExpandido       — destaque/storytelling para os prioritários.
//   3. acordosImportados (gen) — dados técnicos crus dos HTMLs do repo,
//                                ligados via slug.

import { acordosImportados } from "./acordos.generated";
import type { AcordoImportado } from "./acordos.types";
import { applyTooltipsToBeneficios } from "./acordo-tooltips";

export type { AcordoImportado } from "./acordos.types";
export type StatusAcordo = "vigente" | "ratificacao" | "incompleto";
export type TipoAcordo = "bilateral" | "multilateral";

export interface Acordo {
  slug: string;
  nome: string;
  iso?: string; // ISO 3166-1 alpha-2 lowercase para flagcdn
  tipo: TipoAcordo;
  docs: number;
  status: StatusAcordo;
  vigencia?: string; // ano de vigência
  resumo: string; // 1-2 frases para listagem
  conteudo?: ConteudoPais; // detalhe editorial (apenas prioritários)
  importado?: AcordoImportado; // dados técnicos vindos do repo Mapa-de-Acordos
}

export interface ConteudoPais {
  // Bloco PÚBLICO — conceitual, suficiente para o cidadão decidir contratar
  destaque: string;
  beneficios: string[];
  totalizacao: string;
  curiosidade?: string;
  // Bloco PRO — itens trancados; não renderizados na rota pública
  pro?: {
    exigencias?: string[];
    extras?: string[];
  };
}

export const acordos: Acordo[] = [
  // ===== BILATERAIS =====
  {
    slug: "alemanha",
    nome: "Alemanha",
    iso: "de",
    tipo: "bilateral",
    docs: 13,
    status: "vigente",
    vigencia: "2013",
    resumo:
      "Acordo amplo entre Brasil e Alemanha cobrindo aposentadorias por idade, invalidez e pensões.",
  },
  {
    slug: "austria",
    nome: "Áustria",
    iso: "at",
    tipo: "bilateral",
    docs: 3,
    status: "vigente",
    resumo: "Acordo bilateral entre Brasil e República da Áustria.",
  },
  {
    slug: "belgica",
    nome: "Bélgica",
    iso: "be",
    tipo: "bilateral",
    docs: 13,
    status: "vigente",
    vigencia: "2014",
    resumo: "Acordo de seguridade social com a Bélgica em vigor desde 2014.",
  },
  {
    slug: "bulgaria",
    nome: "Bulgária",
    iso: "bg",
    tipo: "bilateral",
    docs: 2,
    status: "vigente",
    vigencia: "2024",
    resumo: "Acordo bilateral em vigor com a República da Bulgária desde 01/12/2024, promulgado pelo Decreto 12.498/2025.",

  },
  {
    slug: "cabo-verde",
    nome: "Cabo Verde",
    iso: "cv",
    tipo: "bilateral",
    docs: 2,
    status: "ratificacao",
    resumo: "Acordo assinado, em fase de ratificação interna.",
  },
  {
    slug: "canada",
    nome: "Canadá",
    iso: "ca",
    tipo: "bilateral",
    docs: 19,
    status: "vigente",
    resumo: "Cobre todo o território canadense (federal). Quebec tem instrumento próprio.",
  },
  {
    slug: "chile",
    nome: "Chile",
    iso: "cl",
    tipo: "bilateral",
    docs: 13,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República do Chile.",
  },
  {
    slug: "coreia-do-sul",
    nome: "Coreia do Sul",
    iso: "kr",
    tipo: "bilateral",
    docs: 14,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República da Coreia.",
  },
  {
    slug: "espanha",
    nome: "Espanha",
    iso: "es",
    tipo: "bilateral",
    docs: 8,
    status: "vigente",
    resumo:
      "Acordo bilateral; Espanha também é parte do Acordo Iberoamericano (multilateral).",
  },
  {
    slug: "estados-unidos",
    nome: "Estados Unidos",
    iso: "us",
    tipo: "bilateral",
    docs: 8,
    status: "vigente",
    vigencia: "2018",
    resumo:
      "Acordo entre Brasil e Estados Unidos vigente desde 2018, baseado em totalização de períodos.",
  },
  {
    slug: "franca",
    nome: "França",
    iso: "fr",
    tipo: "bilateral",
    docs: 16,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República Francesa.",
  },
  {
    slug: "grecia",
    nome: "Grécia",
    iso: "gr",
    tipo: "bilateral",
    docs: 5,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República Helênica.",
  },
  {
    slug: "india",
    nome: "Índia",
    iso: "in",
    tipo: "bilateral",
    docs: 8,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República da Índia.",
  },
  {
    slug: "israel",
    nome: "Israel",
    iso: "il",
    tipo: "bilateral",
    docs: 1,
    status: "ratificacao",
    resumo: "Acordo assinado, em fase de ratificação.",
  },
  {
    slug: "italia",
    nome: "Itália",
    iso: "it",
    tipo: "bilateral",
    docs: 16,
    status: "vigente",
    vigencia: "1977",
    resumo:
      "Acordo histórico vigente desde 1977, um dos mais antigos da rede brasileira.",
  },
  {
    slug: "japao",
    nome: "Japão",
    iso: "jp",
    tipo: "bilateral",
    docs: 19,
    status: "vigente",
    vigencia: "2012",
    resumo:
      "Acordo entre Brasil e Japão vigente desde 2012, central para a comunidade nikkei.",
  },
  {
    slug: "luxemburgo",
    nome: "Luxemburgo",
    iso: "lu",
    tipo: "bilateral",
    docs: 3,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com o Grão-Ducado de Luxemburgo.",
  },
  {
    slug: "mocambique",
    nome: "Moçambique",
    iso: "mz",
    tipo: "bilateral",
    docs: 8,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República de Moçambique.",
  },
  {
    slug: "portugal",
    nome: "Portugal",
    iso: "pt",
    tipo: "bilateral",
    docs: 16,
    status: "vigente",
    vigencia: "1995",
    resumo:
      "O acordo mais utilizado pela comunidade brasileira no exterior, vigente desde 1995.",
  },
  {
    slug: "quebec",
    nome: "Quebec",
    iso: "ca",
    tipo: "bilateral",
    docs: 11,
    status: "vigente",
    resumo:
      "Província canadense com regime próprio (RRQ) e acordo específico com o Brasil.",
  },
  {
    slug: "republica-tcheca",
    nome: "República Tcheca",
    iso: "cz",
    tipo: "bilateral",
    docs: 12,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a República Tcheca.",
  },
  {
    slug: "suica",
    nome: "Suíça",
    iso: "ch",
    tipo: "bilateral",
    docs: 10,
    status: "vigente",
    resumo: "Acordo bilateral em vigor com a Confederação Suíça.",
  },

  // ===== MULTILATERAIS =====
  {
    slug: "cplp",
    nome: "CPLP",
    tipo: "multilateral",
    docs: 1,
    status: "ratificacao",
    resumo:
      "Convenção Multilateral da Comunidade dos Países de Língua Portuguesa, assinada, em fase de ratificação. ( Angola, Cabo Verde, Brasil, Guiné-Bissau, Guiné Equatorial, Mossambique, Portugual, São Tomé e Principe e Timor Leste.",
  },
  {
    slug: "mercosul",
    nome: "Mercosul",
    tipo: "multilateral",
    docs: 9,
    status: "vigente",
    resumo:
      "Acordo Multilateral de Seguridade Social do Mercosul (Argentina, Brasil, Paraguai, Uruguai).",
  },
  {
    slug: "iberoamericano",
    nome: "Iberoamericano",
    tipo: "multilateral",
    docs: 9,
    status: "vigente",
    resumo:
      "Convênio Multilateral Iberoamericano de Seguridade Social. (Argentina, Bolívia, Brasil, Chile, El Salvador, Equador, Espanha, Paraguai, Peru, Portugal e Uruguai)",
  },
];

// Conteúdo expandido para os 5 países prioritários da Fase 1.
const conteudoExpandido: Record<string, ConteudoPais> = {
  portugal: {
    destaque:
      "Portugal é, de longe, o destino que mais aciona o acordo internacional do INSS. A proximidade cultural e a comunidade brasileira numerosa fazem deste o instrumento mais procurado.",
    beneficios: [
      "Aposentadoria por idade",
      "Aposentadoria por invalidez",
      "Pensão por morte",
      "Auxílio-doença (em casos específicos)",
    ],
    pro: {
      exigencias: [
        "Contribuições registradas em pelo menos um dos países",
        "Apresentação do Formulário PT-BR1 ou BR-PT1 conforme o caso",
        "Tradução juramentada de documentos quando exigido",
      ],
    },
    totalizacao:
      "Tempo contribuído na Segurança Social portuguesa pode ser somado ao tempo no INSS para alcançar a carência. O cálculo do benefício é proporcional em cada país.",
    curiosidade:
      "Vigente desde 1995, é também o acordo com maior volume de jurisprudência consolidada no Brasil.",
  },
  japao: {
    destaque:
      "Acordo essencial para a comunidade nikkei brasileira que trabalhou no Japão como dekassegui. Permite somar contribuições à Nenkin japonesa e ao INSS.",
    beneficios: [
      "Aposentadoria por idade (Brasil) / Velhice (Japão)",
      "Aposentadoria por invalidez",
      "Pensão por morte",
    ],
    pro: {
      exigencias: [
        "Comprovação de filiação à Nenkin (livreto azul/laranja)",
        "Formulários JP/BR conforme o tipo de pedido",
        "Atenção ao Lump-sum Withdrawal Payment, que pode invalidar a totalização",
      ],
    },
    totalizacao:
      "É possível somar períodos de contribuição na Nenkin Kikin e no INSS. Quem sacou o pagamento de retirada (dakkai ichijikin) pode perder o direito à totalização daqueles períodos.",
    curiosidade:
      "Vigente desde 2012; o Brasil é o primeiro país sul-americano a firmar acordo previdenciário com o Japão.",
  },
  "estados-unidos": {
    destaque:
      "Acordo Brasil–EUA vigente desde 2018. Permite a brasileiros que trabalharam nos EUA sob o Social Security somar tempo para a aposentadoria do INSS, e vice-versa.",
    beneficios: [
      "Old-Age, Survivors and Disability Insurance (EUA)",
      "Aposentadoria por idade, invalidez e pensão por morte (Brasil)",
    ],
    pro: {
      exigencias: [
        "Social Security Number (SSN) e histórico de earnings",
        "Formulários USA/BR conforme o pedido",
        "Mínimo de 6 quarters of coverage nos EUA para totalização",
      ],
    },
    totalizacao:
      "Períodos de contribuição ao US Social Security e ao INSS são somados. O cálculo final é pró-rata em cada país, conforme o tempo efetivamente contribuído.",
  },
  italia: {
    destaque:
      "Um dos acordos mais antigos do Brasil, vigente desde 1977. Beneficia descendentes de italianos que retornaram ao Brasil ou que trabalharam na Itália em algum momento.",
    beneficios: [
      "Aposentadoria por idade (vecchiaia)",
      "Aposentadoria por invalidez",
      "Pensão por morte (superstiti)",
    ],
    pro: {
      exigencias: [
        "Certificato Modello E/IT-BR conforme o caso",
        "Histórico contributivo da INPS italiana",
        "Cidadania italiana NÃO é requisito do acordo previdenciário",
      ],
    },
    totalizacao:
      "Períodos contribuídos à INPS e ao INSS são somados. Cada país paga a parte proporcional ao tempo contribuído sob sua legislação.",
    curiosidade:
      "Não confundir com cidadania italiana: o acordo previdenciário independe de jus sanguinis.",
  },
  alemanha: {
    destaque:
      "Acordo amplo vigente desde 2013, cobrindo as principais prestações da Deutsche Rentenversicherung e do INSS.",
    beneficios: [
      "Aposentadoria por idade (Altersrente)",
      "Aposentadoria por redução de capacidade laboral",
      "Pensão por morte (Hinterbliebenenrente)",
    ],
    pro: {
      exigencias: [
        "Versicherungsnummer (número de segurado alemão)",
        "Formulários DE/BR conforme o pedido",
        "Atenção à Mindestversicherungszeit de 5 anos",
      ],
    },
    totalizacao:
      "Períodos contribuídos à Deutsche Rentenversicherung e ao INSS podem ser somados para alcançar a carência mínima. O cálculo final é pró-rata.",
  },
};

// Aplica conteúdo expandido aos países prioritários
for (const a of acordos) {
  const c = conteudoExpandido[a.slug];
  if (c) a.conteudo = c;
  const imp = acordosImportados[a.slug];
  if (imp) {
    // Clona para não mutar o objeto gerado caso ele seja reusado em testes.
    const beneficios = {
      brasil: applyTooltipsToBeneficios(a.slug, "brasil", imp.beneficios.brasil),
      parceiro: applyTooltipsToBeneficios(a.slug, "parceiro", imp.beneficios.parceiro),
    };
    a.importado = { ...imp, beneficios };
    // docs no catálogo passa a refletir a contagem real do repo quando houver
    if (imp.documentos?.length) a.docs = imp.documentos.length;
  }
}

export const totalDocs = acordos.reduce((s, a) => s + a.docs, 0);
export const totalAcordos = acordos.length; // total mapeados (vigentes + em ratificação + incompletos)
export const totalBilaterais = acordos.filter((a) => a.tipo === "bilateral").length;
export const totalMultilaterais = acordos.filter((a) => a.tipo === "multilateral").length;
export const totalRatificacao = acordos.filter((a) => a.status === "ratificacao").length;
export const totalIncompletos = acordos.filter((a) => a.status === "incompleto").length;
export const totalVigentes = acordos.filter((a) => a.status === "vigente").length;
export const totalBilateraisVigentes = acordos.filter(
  (a) => a.tipo === "bilateral" && a.status === "vigente",
).length;
export const totalMultilateraisVigentes = acordos.filter(
  (a) => a.tipo === "multilateral" && a.status === "vigente",
).length;

export function getAcordo(slug: string): Acordo | undefined {
  return acordos.find((a) => a.slug === slug);
}
