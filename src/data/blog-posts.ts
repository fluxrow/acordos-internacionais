// Posts do blog editorial do Acordo Internacional.
// Conteúdo curado pelo Dr. Marcos Espínola. Estrutura simples para
// permitir leitura linear (heading + parágrafos). Sem dependência de
// parser markdown.

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  publicadoEm: string; // ISO
  leituraMin: number;
  autor: string;
  tags: string[];
  blocos: BlogBlock[];
}

const saidaDefinitiva: BlogPost = {
  slug: "saida-definitiva-do-brasil-imposto-inss-e-mitos",
  titulo:
    "Saída definitiva do Brasil: o que muda no imposto, no INSS e por que ela não é tão definitiva assim",
  resumo:
    "A saída definitiva é antes de tudo uma mudança de residência fiscal — não apaga o tempo de INSS nem impede o retorno ao Brasil. Entenda o que muda no imposto, o risco para quem não fez a CDSP e quando a contribuição ao INSS continua valendo.",
  publicadoEm: "2026-06-03",
  leituraMin: 8,
  autor: "Dr. Marcos Espínola",
  tags: ["Saída definitiva", "Imposto de renda", "INSS", "Residência fiscal"],
  blocos: [
    { type: "p", text: "Muita gente lê a expressão “saída definitiva” e imagina uma mudança sem volta, como se a pessoa estivesse cortando todos os laços com o Brasil. Não é isso. Na prática, a saída definitiva é, antes de tudo, uma mudança de residência fiscal. Ela serve para informar à Receita Federal que aquela pessoa deixou de ser tratada como residente fiscal no país." },
    { type: "p", text: "É por isso que o nome assusta mais do que a realidade. A saída definitiva não apaga a história da pessoa no Brasil, não apaga o tempo já contribuído ao INSS e não impede que ela volte a morar aqui no futuro. O que ela faz é mudar a forma como a Receita passa a olhar para essa pessoa e, principalmente, a forma como ela será tributada. A própria Receita informa que a pessoa volta a ser considerada residente no Brasil se retornar com intenção de morar aqui ou se permanecer no país por mais de 183 dias, consecutivos ou não, dentro de 12 meses." },

    { type: "h2", text: "O que é CDSP?" },
    { type: "p", text: "CDSP é a sigla para Comunicação de Saída Definitiva do País. Em linguagem simples, é o aviso formal feito à Receita Federal de que a pessoa saiu do Brasil em caráter permanente ou passou à condição de não residente fiscal. A comunicação é obrigatória para quem sai em definitivo ou para quem saiu temporariamente e depois passou à condição de não residente." },
    { type: "p", text: "Aqui existe uma diferença importante que costuma confundir muita gente. A CDSP é a comunicação. Já a DSDP é a Declaração de Saída Definitiva do País, que funciona como a declaração de imposto de renda de saída. Uma não substitui a outra. A Receita deixa isso claro ao informar que a comunicação não dispensa o envio da declaração, nem o pagamento dos impostos apurados." },
    { type: "p", text: "Em regra, a comunicação deve ser feita da data da saída até o último dia de fevereiro do ano seguinte. Depois, no ano seguinte à saída ou à caracterização da não residência, a pessoa também deve entregar a DSDP no prazo regulamentar da declaração do imposto de renda." },

    { type: "h2", text: "Quando a pessoa passa a ser não residente?" },
    { type: "p", text: "Segundo a Receita, isso pode acontecer em duas situações mais comuns. A primeira é quando a pessoa sai do Brasil em caráter permanente. Nesse caso, a condição de não residente começa na própria data da saída. A segunda é quando a pessoa sai de forma temporária ou vai morar fora sem formalizar logo a situação. Nessa hipótese, ela continua sendo tratada como residente e só passa à condição de não residente depois de completar 12 meses consecutivos fora do Brasil, se não tiver feito a CDSP antes." },
    { type: "p", text: "Esse ponto é decisivo, porque muita gente muda de país e acha que, só por estar vivendo no exterior, já deixou automaticamente de ter obrigações fiscais no Brasil. Nem sempre é assim." },

    { type: "h2", text: "Por que a saída definitiva não é tão definitiva assim?" },
    { type: "p", text: "Porque ela não é um rompimento total com o Brasil. O que ela encerra é uma fase fiscal. Se a pessoa voltar com intenção de morar no país, volta a ser considerada residente na data da chegada. E também pode voltar à condição de residente se permanecer no Brasil por mais de 183 dias, consecutivos ou não, dentro de um período de 12 meses." },
    { type: "p", text: "Então, a forma mais simples de entender é esta: saída definitiva não significa “adeus ao Brasil”; significa que, naquele momento, a Receita deixou de tratar aquela pessoa como residente fiscal." },

    { type: "h2", text: "O maior risco de quem não fez a CDSP" },
    { type: "p", text: "O ponto mais delicado para quem foi morar fora e não fez a CDSP é o seguinte: durante os primeiros 12 meses consecutivos de ausência, a pessoa pode continuar sendo tratada como residente fiscal no Brasil. E isso muda muito o imposto." },
    { type: "p", text: "Enquanto a pessoa continua como residente, o Brasil pode exigir que ela declare não apenas os rendimentos recebidos no Brasil, mas também os rendimentos recebidos no exterior. Em termos simples, é isso que muita gente chama de tributação global." },
    { type: "p", text: "Traduzindo: sem a formalização correta, a pessoa pode morar fora, pagar imposto no país onde vive e ainda assim continuar tendo obrigação de informar essa renda no Brasil." },

    { type: "h2", text: "E se o imposto já foi pago no outro país?" },
    { type: "p", text: "Pode haver compensação, mas isso não acontece de forma automática em qualquer caso. Quando houver acordo, tratado, convenção internacional ou reciprocidade, o imposto pago no país de origem pode ser compensado dentro do limite legal. Sem isso, o imposto pago no exterior pode não ser compensado no Brasil." },
    { type: "p", text: "Por isso, deixar a saída definitiva para depois pode sair caro." },

    { type: "h2", text: "Quanto se paga de imposto?" },
    { type: "p", text: "Aqui é importante separar duas situações: quem ainda está sendo tratado como residente e quem já está na condição de não residente." },

    { type: "h2", text: "1) Quem não fez a CDSP e ainda está na condição de residente" },
    { type: "p", text: "Durante os primeiros 12 meses fora do Brasil, se a pessoa ainda não passou formalmente à condição de não residente, a tributação continua seguindo a lógica do residente. Isso significa que não existe, nesse período, uma alíquota fixa única para aluguel, pró-labore, honorários, aposentadoria e outros rendimentos. A regra geral é a tributação normal do residente, com uso da tabela progressiva, conforme o tipo de rendimento." },
    { type: "p", text: "Na tabela mensal de 2026, a Receita informa as alíquotas de 7,5%, 15%, 22,5% e 27,5%, além de uma redução que pode zerar o imposto para rendimentos tributáveis mensais de até R$ 5.000,00 e reduzir gradualmente a carga até R$ 7.350,00." },
    { type: "p", text: "Na prática, isso quer dizer que quem não fez a CDSP pode continuar, por um tempo, sujeito à lógica completa do residente no Brasil. E isso inclui o risco de tributação sobre renda recebida no exterior." },

    { type: "h2", text: "2) Quem já fez a CDSP ou já passou à condição de não residente" },
    { type: "p", text: "Quando a pessoa já é tratada como não residente, a lógica muda. Os rendimentos recebidos de fontes situadas no Brasil passam a ser tributados exclusivamente na fonte, e os rendimentos recebidos de fontes situadas no exterior deixam, em regra, de ser alcançados pela tributação brasileira." },
    { type: "p", text: "É aqui que entram as alíquotas que mais interessam para quem mora fora e continua recebendo valores do Brasil. Os rendimentos do trabalho e da prestação de serviços pagos a não residente ficam, em regra, sujeitos à alíquota de 25%. Nessa categoria costumam entrar, de forma prática, pró-labore e honorários por serviços. Já os demais rendimentos de fontes situadas no Brasil, quando não houver regra específica diferente, ficam sujeitos à alíquota de 15%. É nessa faixa que, em regra, costuma entrar o aluguel recebido do Brasil por quem já é não residente." },
    { type: "p", text: "No caso da aposentadoria e da pensão por morte ou invalidez pagas a não residente, a regra indicada pela Receita para 2026 é a tabela progressiva, e não uma alíquota fixa de 25%." },
    { type: "p", text: "Resumindo de forma bem direta: aluguel, em regra, 15%; pró-labore e honorários, em regra, 25%; aposentadoria e pensão por morte ou invalidez, tabela progressiva. Há uma observação importante: em algumas situações envolvendo residente em país com tributação favorecida, a alíquota pode ser maior." },

    { type: "h2", text: "A saída definitiva corta o INSS?" },
    { type: "p", text: "Não. Esse é um dos maiores mitos sobre o tema. A saída definitiva não apaga o tempo que a pessoa já contribuiu no Brasil. Também não elimina automaticamente direitos previdenciários. O que ela altera é o status fiscal. A parte previdenciária continua existindo e precisa ser analisada separadamente." },

    { type: "h2", text: "Quem mora fora pode continuar contribuindo para o INSS?" },
    { type: "p", text: "Sim. Em regra, isso é totalmente possível. O segurado facultativo é a pessoa maior de 16 anos que se filia ao Regime Geral de Previdência Social por vontade própria, mediante contribuição, desde que não esteja exercendo atividade remunerada que a enquadre como segurado obrigatório." },
    { type: "p", text: "Na prática, isso permite que muitas pessoas que vivem no exterior continuem contribuindo para o INSS para manter proteção previdenciária no Brasil. O segurado facultativo pode contribuir, em regra, com alíquota de 20% sobre o salário de contribuição escolhido, respeitados os limites mínimo e máximo, ou com alíquota reduzida de 11% sobre o salário-mínimo." },

    { type: "h2", text: "Qual é a exceção mais importante?" },
    { type: "p", text: "A exceção mais importante é quem participa de RPPS. RPPS é o Regime Próprio de Previdência Social, ou seja, a previdência dos servidores públicos titulares de cargo efetivo. Em linguagem simples: é a previdência própria do servidor concursado, e não o INSS comum aplicado à maior parte dos trabalhadores da iniciativa privada." },
    { type: "p", text: "Além disso, a Constituição veda a filiação ao RGPS, na qualidade de segurado facultativo, de pessoa participante de regime próprio de previdência. Então, para esse grupo, a resposta não é a mesma." },

    { type: "h2", text: "Conclusão" },
    { type: "p", text: "A saída definitiva do Brasil não é um adeus ao país. Ela é, acima de tudo, uma mudança de status fiscal. E o ponto mais importante para quem mora fora é este: quem não faz a CDSP pode continuar sendo tratado como residente por até 12 meses consecutivos de ausência. Nesse período, não existe apenas a preocupação com aluguel, pró-labore, honorários ou aposentadoria recebidos do Brasil. Também pode existir obrigação fiscal sobre rendimentos recebidos no exterior." },
    { type: "p", text: "Depois que a pessoa passa à condição de não residente, a lógica muda. O Brasil, em regra, deixa de tributar a renda de fonte no exterior e passa a olhar principalmente para a renda com fonte no Brasil, com retenções próprias do não residente. E, na parte previdenciária, o recado também é importante: morar fora não impede, por si só, a contribuição ao INSS. Em muitos casos, ela continua sendo possível. A grande exceção, como regra geral, está em quem participa de RPPS." },
  ],
};

export const blogPosts: BlogPost[] = [saidaDefinitiva];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
