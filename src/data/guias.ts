export interface Guia {
  slug: string;
  titulo: string;
  resumo: string;
  blocos: { titulo: string; conteudo: string[] }[];
  paisRelacionado?: string;
}

export const guias: Guia[] = [
  {
    slug: "totalizacao",
    titulo: "Totalização de períodos contributivos",
    resumo:
      "O coração de qualquer acordo internacional: como tempo de contribuição em diferentes países é somado para fins de carência.",
    blocos: [
      {
        titulo: "O que é totalização",
        conteudo: [
          "Totalização é o mecanismo que permite somar períodos de contribuição feitos em dois ou mais países que tenham acordo previdenciário entre si.",
          "Ela serve apenas para verificar se o segurado atinge a carência mínima. O valor do benefício é calculado de forma proporcional (pró-rata) ao tempo efetivamente contribuído em cada país.",
        ],
      },
      {
        titulo: "Como funciona o cálculo pró-rata",
        conteudo: [
          "Cada país calcula como se todo o tempo (Brasil + exterior) tivesse sido contribuído sob sua legislação, e isso resulta no chamado benefício teórico.",
          "Em seguida, aplica a proporção entre o tempo realmente contribuído ali e o tempo total. O resultado é o benefício pró-rata, devido por aquele país.",
        ],
      },
      {
        titulo: "Exemplo prático",
        conteudo: [
          "Maria contribuiu 15 anos no Brasil e 10 anos em Portugal. Para aposentadoria por idade no Brasil ela precisa de 15 anos de carência e sozinha já cumpre. Como tem 10 anos em Portugal, a totalização permitiria somar os 5 do Brasil para alcançar a carência.",
          "Cada país paga a parte proporcional ao tempo contribuído sob sua legislação.",
        ],
      },
    ],
  },
  {
    slug: "prova-de-vida-no-exterior",
    titulo: "Prova de vida do INSS no exterior",
    resumo:
      "Como o brasileiro fora do país comprova vida para manter o benefício ativo.",
    blocos: [
      {
        titulo: "Quem precisa fazer",
        conteudo: [
          "Todo aposentado, pensionista ou recebedor de outros benefícios continuados do INSS, residente no Brasil ou no exterior, deve comprovar vida periodicamente.",
        ],
      },
      {
        titulo: "Formas de fazer no exterior",
        conteudo: [
          "Por consulado ou repartição consular brasileira, que emite atestado de vida específico para o INSS.",
          "Pelo Meu INSS, com biometria facial pelo aplicativo, quando habilitado.",
          "Por procurador no Brasil em casos previstos pela legislação.",
        ],
      },
      {
        titulo: "O que acontece se atrasar",
        conteudo: [
          "O benefício é bloqueado preventivamente após o vencimento. A regularização restabelece o pagamento, geralmente com valores retroativos.",
        ],
      },
    ],
    paisRelacionado: "portugal",
  },
  {
    slug: "certificado-deslocamento-temporario",
    titulo: "Certificado de Deslocamento Temporário (CDT)",
    resumo:
      "O documento que evita dupla contribuição quando um trabalhador é enviado para o país acordante por sua empresa.",
    blocos: [
      {
        titulo: "Para que serve o CDT",
        conteudo: [
          "Quando uma empresa envia um trabalhador para país acordante por período limitado (geralmente até 5 anos), o CDT mantém a filiação previdenciária no país de origem e dispensa a contribuição no país de destino.",
        ],
      },
      {
        titulo: "Quem pode solicitar",
        conteudo: [
          "Trabalhadores empregados deslocados pela própria empresa para país acordante, com vínculo mantido no Brasil.",
          "Autônomos, em casos específicos previstos por cada acordo.",
        ],
      },
      {
        titulo: "Como pedir",
        conteudo: [
          "Pelo Meu INSS, na opção de acordo internacional, ou em uma APS. O documento emitido tem validade pelo período do deslocamento e pode ser prorrogado.",
        ],
      },
    ],
    paisRelacionado: "estados-unidos",
  },
  {
    slug: "aposentadoria-morando-fora",
    titulo: "Aposentadoria do INSS morando no exterior",
    resumo:
      "É plenamente possível receber a aposentadoria brasileira morando fora, e em alguns casos somar com a aposentadoria do país de residência.",
    blocos: [
      {
        titulo: "É possível receber morando fora?",
        conteudo: [
          "Sim. Não há exigência de residência no Brasil para receber aposentadoria do INSS. O pagamento é feito em conta bancária no Brasil, e a manutenção depende da prova de vida regular.",
        ],
      },
      {
        titulo: "Posso pedir lá fora?",
        conteudo: [
          "Em países com acordo, é possível protocolar o pedido junto à autoridade previdenciária local, que oficia o INSS. Em países sem acordo, o pedido deve ser feito ao próprio INSS, geralmente via Meu INSS ou consulado.",
        ],
      },
      {
        titulo: "E a tributação?",
        conteudo: [
          "Aposentadoria do INSS é renda tributável no Brasil. A tributação no país de residência depende da legislação local e de eventuais acordos para evitar dupla tributação (que são distintos dos acordos previdenciários).",
        ],
      },
    ],
    paisRelacionado: "portugal",
  },
];


export function getGuia(slug: string) {
  return guias.find((g) => g.slug === slug);
}
