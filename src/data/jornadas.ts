export interface Jornada {
  slug: string;
  titulo: string;
  publico: string;
  resumo: string;
  passos: { titulo: string; descricao: string }[];
  cta: string;
  paisesRelacionados?: string[];
  guiaRelacionado?: string;
}

export const jornadas: Jornada[] = [
  {
    slug: "vou-me-mudar",
    titulo: "Vou me mudar para outro país",
    publico: "Brasileiros em vias de mudança internacional",
    resumo:
      "Antes de embarcar, garanta que seus anos de contribuição no Brasil contem lá fora, e vice-versa.",
    passos: [
      {
        titulo: "Confirme se há acordo",
        descricao:
          "Verifique no índice se o país de destino tem acordo previdenciário com o Brasil.",
      },
      {
        titulo: "Solicite o CDT",
        descricao:
          "Se for trabalho temporário com vínculo brasileiro, solicite o Certificado de Deslocamento Temporário (CDT) para evitar dupla contribuição.",
      },
      {
        titulo: "Organize seus documentos",
        descricao:
          "Extrato CNIS, carteiras de trabalho, contratos. Tradução juramentada quando exigida.",
      },
      {
        titulo: "Mantenha contribuições ativas",
        descricao:
          "Estude se vale manter recolhimento como facultativo no Brasil enquanto estiver fora.",
      },
    ],
    cta: "Tem dúvidas no seu caso? Fale com o Dr. Marcos Espínola.",
    paisesRelacionados: ["portugal", "estados-unidos", "alemanha"],
    guiaRelacionado: "certificado-deslocamento-temporario",
  },
  {
    slug: "moro-fora",
    titulo: "Já moro no exterior",
    publico: "Brasileiros que vivem fora do Brasil",
    resumo:
      "Da prova de vida ao planejamento da aposentadoria: o que muda quando o INSS é acessado de outro país.",
    passos: [
      {
        titulo: "Faça a prova de vida certa",
        descricao:
          "Brasileiros no exterior podem fazer a prova de vida em consulados, biometria facial ou via Meu INSS.",
      },
      {
        titulo: "Mantenha o cadastro atualizado",
        descricao: "Endereço, conta bancária e e-mail atualizados no Meu INSS.",
      },
      {
        titulo: "Compute seu tempo lá fora",
        descricao:
          "Confirme periodicamente que suas contribuições no país de residência estão registradas corretamente.",
      },
      {
        titulo: "Planeje a totalização",
        descricao:
          "Entenda como o tempo contribuído fora se combinará com o INSS quando chegar a hora.",
      },
    ],
    cta: "Quer revisar seu plano? Fale com o Dr. Marcos Espínola.",
    paisesRelacionados: ["portugal", "japao", "estados-unidos"],
    guiaRelacionado: "prova-de-vida-no-exterior",
  },
  {
    slug: "estou-voltando",
    titulo: "Estou voltando ao Brasil",
    publico: "Retornados ao Brasil após período no exterior",
    resumo:
      "Como aproveitar o tempo contribuído fora ao retomar a vida (e a aposentadoria) no Brasil.",
    passos: [
      {
        titulo: "Reúna comprovantes do exterior",
        descricao:
          "Histórico contributivo, formulários de ligação e comprovantes de filiação ao sistema estrangeiro.",
      },
      {
        titulo: "Solicite os formulários de ligação",
        descricao:
          "Cada acordo tem formulários próprios (PT-BR1, US/BR, DE/BR etc.) emitidos pela autoridade estrangeira.",
      },
      {
        titulo: "Protocole a totalização no INSS",
        descricao:
          "Pelo Meu INSS ou em uma APS, o INSS oficia o país acordante e calcula a parte proporcional brasileira.",
      },
      {
        titulo: "Acompanhe o processo",
        descricao:
          "Processos internacionais são mais lentos. Acompanhe e tenha apoio jurídico se houver demora indevida.",
      },
    ],
    cta: "Demora ou indeferimento? Fale com o Dr. Marcos Espínola.",
    paisesRelacionados: ["portugal", "alemanha"],
    guiaRelacionado: "totalizacao",
  },
  {
    slug: "quero-me-aposentar",
    titulo: "Quero me aposentar usando o acordo",
    publico: "Quem está perto do tempo de aposentadoria",
    resumo:
      "Totalização, cálculo prorata e o passo a passo de quem vai pedir aposentadoria com tempo dos dois países.",
    passos: [
      {
        titulo: "Faça a contagem de tempo total",
        descricao:
          "Some os períodos contribuídos no Brasil e no país acordante para verificar se atinge a carência.",
      },
      {
        titulo: "Entenda o cálculo prorata",
        descricao:
          "Cada país paga a parte proporcional ao tempo contribuído sob sua legislação. Não é cumulativo, é proporcional.",
      },
      {
        titulo: "Escolha onde requerer",
        descricao:
          "É possível requerer no país de residência. O órgão local oficia os demais países envolvidos.",
      },
      {
        titulo: "Avalie cenários",
        descricao:
          "Em alguns casos vale mais aposentar pelas regras de cada país separadamente. Análise técnica é essencial.",
      },
    ],
    cta: "Quer simular seu caso? Fale com o Dr. Marcos Espínola.",
    paisesRelacionados: ["portugal", "italia", "japao"],
    guiaRelacionado: "aposentadoria-morando-fora",
  },
];

export function getJornada(slug: string) {
  return jornadas.find((j) => j.slug === slug);
}
