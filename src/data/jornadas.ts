export interface JornadaPasso {
  titulo: string;
  descricao: string;
  cta?: { label: string; to: string };
}


export interface JornadaTrilha {
  id: string;
  titulo: string;
  resumo: string;
  passos: JornadaPasso[];
}

export interface Jornada {
  slug: string;
  titulo: string;
  publico: string;
  resumo: string;
  passos: JornadaPasso[];
  /**
   * Quando presente, a página renderiza um Tabs com cada trilha.
   * `passos` continua sendo a versão "consolidada" usada em listagens.
   */
  trilhas?: JornadaTrilha[];
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
        titulo: "Diagnóstico — temporário ou definitivo?",
        descricao:
          "Defina se é deslocamento temporário (com vínculo brasileiro) ou mudança definitiva. A trilha muda inteiramente a partir daí.",
      },
      {
        titulo: "Verifique o acordo com o país de destino",
        descricao:
          "Consulte o índice de acordos e identifique a base legal (decreto, vigência, status).",
      },
      {
        titulo: "Organize seus documentos",
        descricao:
          "Extrato CNIS, carteiras de trabalho, contratos. Tradução juramentada quando exigida pelo país acordante.",
      },
      {
        titulo: "Solicite o CDT (se temporário)",
        descricao:
          "Trabalho com vínculo brasileiro: peça o Certificado de Deslocamento Temporário para evitar dupla contribuição.",
      },
      {
        titulo: "Planeje suas contribuições",
        descricao:
          "Avalie manter recolhimento como facultativo no Brasil; estime o impacto no benefício futuro.",
      },
      {
        titulo: "Verifique se o seu caso tem direito à totalização ou ao planejamento.",
        descricao:
          "Use a calculadora Totalização com diferentes horizontes (5, 10, 20 anos) antes de decidir.",
      },
      {
        titulo: "Formalize a saída fiscal (se definitivo)",
        descricao:
          "CSDP + DSDP na Receita Federal encerram a residência fiscal — passo independente da previdência.",
      },
    ],
    cta: "Tem dúvidas no seu caso?",
    paisesRelacionados: ["portugal", "estados-unidos", "alemanha"],
    guiaRelacionado: "certificado-deslocamento-temporario",
  },
  {
    slug: "moro-fora",
    titulo: "Moro no exterior",
    publico: "Brasileiros que vivem fora do Brasil",
    resumo:
      "Duas trilhas conforme a sua situação: quem já recebe benefício do INSS no exterior e quem ainda está em fase de planejamento.",
    passos: [
      {
        titulo: "Mantenha a prova de vida em dia",
        descricao:
          "A cada 12 meses. Atraso bloqueia o pagamento. Veja modalidades abaixo.",
      },
      {
        titulo: "Confirme o acordo do país onde mora",
        descricao:
          "Identifique acordo, status e órgão de ligação local responsável pelo seu caso.",
      },
      {
        titulo: "Cuide das contribuições onde estiver",
        descricao:
          "Acompanhe se as contribuições no país de residência estão registradas — você precisará desse histórico no futuro.",
      },
      {
        titulo: "Planeje a totalização",
        descricao:
          "Entenda como o tempo lá fora vai se combinar com o INSS no momento certo.",
      },
    ],
    trilhas: [
      {
        id: "ja-recebo",
        titulo: "Já recebo benefício do INSS",
        resumo:
          "Manutenção do benefício no exterior: prova de vida, conta bancária, cadastro e como reagir se o pagamento for bloqueado.",
        passos: [
          {
            titulo: "Faça a prova de vida no prazo",
            descricao:
              "A cada 12 meses. Consulado, biometria Gov.br, notário + Apostila de Haia ou procurador no Brasil — escolha conforme o seu país.",
          },
          {
            titulo: "Mantenha o cadastro atualizado",
            descricao:
              "Endereço, e-mail e telefone no Meu INSS. Mudança de país sem atualização causa problemas no pagamento.",
          },
          {
            titulo: "Conta bancária para receber",
            descricao:
              "Conta no Brasil (titular ou procurador) ou conta no exterior conforme acordo. Confirme se o banco aceita crédito do INSS.",
          },
          {
            titulo: "Se o benefício for bloqueado",
            descricao:
              "Atestado de vida com Apostila de Haia, envio físico ao INSS Brasília e acompanhamento do desbloqueio. Não envie por e-mail.",
          },
        ],
      },
      {
        id: "planejando",
        titulo: "Trabalho fora e quero planejar",
        resumo:
          "Da verificação do acordo ao requerimento futuro: como construir um histórico contributivo sólido morando no exterior.",
        passos: [
          {
            titulo: "Confirme o acordo do país onde mora",
            descricao:
              "Verifique status (vigente / em ratificação / multilateral) e qual é o órgão de ligação local.",
          },
          {
            titulo: "Decida onde contribuir",
            descricao:
              "Sistema do país de residência, facultativo no Brasil, ou ambos. Cada combinação afeta o benefício final.",
          },
          {
            titulo: "Organize seus documentos",
            descricao:
              "Carteira de trabalho local, comprovantes de filiação, contracheques e CNIS brasileiro periodicamente.",
          },
          {
            titulo: "Acompanhe o tempo registrado",
            descricao:
              "Confirme anualmente que as contribuições aparecem no histórico do país acordante — corrigir depois é caro.",
          },
          {
            titulo: "Planeje a totalização",
            descricao:
              "Simule cenários de carência e totalização; entenda quando o tempo somado começa a destravar o direito ao benefício.",
          },
          {
            titulo: "Verifique se o seu caso tem direito à totalização ou ao planejamento.",
            descricao:
              "Use a calculadora Totalização com diferentes horizontes diferentes antes de tomar decisões de longo prazo.",
            cta: { label: "Abrir calculadora", to: "/calculadora" },
          },
          {
            titulo: "Requerimento (no momento certo)",
            descricao:
              "Pode ser feito no país de residência. O órgão local oficia o INSS via formulários de ligação.",
          },
        ],
      },
    ],
    cta: "Quer revisar seu plano?\u00a0",
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
        titulo: "Diagnóstico — qual era o seu vínculo lá fora?",
        descricao:
          "Trabalho local, deslocamento temporário ou contribuição voluntária. A documentação pedida muda em cada caso.",
      },
      {
        titulo: "Identifique o acordo aplicável",
        descricao:
          "Confirme país, vigência e órgão de ligação responsável pelo seu histórico estrangeiro.",
      },
      {
        titulo: "Reúna comprovantes do exterior",
        descricao:
          "Histórico contributivo, contratos, contracheques e comprovantes de filiação ao sistema estrangeiro.",
      },
      {
        titulo: "Solicite os formulários de ligação",
        descricao:
          "Cada acordo tem formulários próprios (PT-BR1, US/BR, DE/BR etc.) emitidos pela autoridade estrangeira.",
      },
      {
        titulo: "Planeje a totalização",
        descricao:
          "Some os tempos antes de protocolar — ajuda a escolher entre acordo bilateral e regras puramente brasileiras.",
      },
      {
        titulo: "Verifique se o seu caso tem direito à totalização ou ao planejamento.",
        descricao:
          "Estime quanto cada país pagará na sua parte proporcional para evitar surpresas.",
      },
      {
        titulo: "Protocole o requerimento no INSS",
        descricao:
          "Pelo Meu INSS ou em uma APS. O INSS oficia o país acordante e calcula a parte proporcional brasileira.",
      },
      {
        titulo: "Acompanhe o processo",
        descricao:
          "Processos internacionais são lentos. Acompanhe e tenha apoio jurídico se houver demora indevida.",
      },
    ],
    cta: "Demora ou indeferimento?\u00a0",
    paisesRelacionados: ["portugal", "alemanha"],
    guiaRelacionado: "totalizacao",
  },
  {
    slug: "quero-me-aposentar",
    titulo: "Quero me aposentar usando o acordo",
    publico: "Quem está perto do tempo de aposentadoria",
    resumo:
      "Totalização, cálculo pro-rata e o passo a passo de quem vai pedir aposentadoria com tempo dos dois países.",
    passos: [
      {
        titulo: "Diagnóstico — quais países entram na conta?",
        descricao:
          "Liste todos os países onde contribuiu. Mais de dois exige acordos encadeados — análise especializada.",
      },
      {
        titulo: "Confirme os acordos e a base legal",
        descricao:
          "Para cada país, verifique decreto, vigência e o que pode ser totalizado (aposentadoria, pensão, auxílio).",
      },
      {
        titulo: "Reúna os documentos",
        descricao:
          "CNIS atualizado + comprovantes contributivos de cada país. Tradução juramentada quando exigida.",
      },
      {
        titulo: "Some o tempo total",
        descricao:
          "Verifique se a soma atinge a carência exigida (180 meses para aposentadoria por idade).",
      },
      {
        titulo: "Entenda a parte proporcional",
        descricao:
          "Cada país paga a parte proporcional ao tempo contribuído sob sua legislação. Não é cumulativo.",
      },
      {
        titulo: "Verifique se o seu caso tem direito à totalização ou ao planejamento.",
        descricao:
          "Em alguns casos vale aposentar pelas regras de cada país separadamente. Calculadora Totalização + análise técnica.",
      },
      {
        titulo: "Escolha onde requerer",
        descricao:
          "É possível requerer no país de residência. O órgão local oficia os demais países envolvidos.",
      },
      {
        titulo: "Acompanhe o processo",
        descricao:
          "Espere meses, não semanas. Mantenha comprovantes, atualize cadastro e cobre se houver demora indevida.",
      },
    ],
    cta: "Quer simular seu caso? Fale com um dos nossos especialistas.",
    paisesRelacionados: ["portugal", "italia", "japao"],
    guiaRelacionado: "aposentadoria-morando-fora",
  },
];

export function getJornada(slug: string) {
  return jornadas.find((j) => j.slug === slug);
}
