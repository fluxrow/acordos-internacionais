import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Glossário de previdência internacional";
const DESC =
  "Termos essenciais sobre acordos internacionais de previdência social do Brasil: totalização, prorata, CDT, CNIS e mais.";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Glossario,
});

const termos: { termo: string; def: string }[] = [
  {
    termo: "Acordo previdenciário internacional",
    def: "Tratado bilateral ou multilateral que coordena os sistemas de seguridade social de dois ou mais países, evitando dupla contribuição e permitindo a totalização de períodos.",
  },
  {
    termo: "APS",
    def: "Agência da Previdência Social: unidade local do INSS para atendimento presencial.",
  },
  {
    termo: "Carência",
    def: "Número mínimo de contribuições mensais exigido para que o segurado tenha direito a um benefício.",
  },
  {
    termo: "CDT",
    def: "Certificado de Deslocamento Temporário. Documento que mantém a filiação no país de origem quando o trabalhador é enviado temporariamente ao país acordante.",
  },
  {
    termo: "CNIS",
    def: "Cadastro Nacional de Informações Sociais: base de dados das contribuições previdenciárias no Brasil.",
  },
  {
    termo: "Formulários de ligação",
    def: "Documentos padronizados (PT-BR1, US/BR, JP/BR etc.) usados para comunicação oficial entre as autoridades previdenciárias dos países acordantes.",
  },
  {
    termo: "Prorata (cálculo prorata)",
    def: "Forma de calcular o benefício quando há totalização: cada país paga a parte proporcional ao tempo contribuído sob sua legislação.",
  },
  {
    termo: "Totalização",
    def: "Soma de períodos contributivos cumpridos em diferentes países acordantes para fins de carência. Não soma valores, soma tempo.",
  },
  {
    termo: "Vigência",
    def: "Data a partir da qual o acordo passa a produzir efeitos jurídicos. Pode haver retroatividade conforme cláusulas específicas.",
  },
];

function Glossario() {
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="eyebrow">Referência</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">Glossário</h1>
          <p className="lede mt-6 max-w-2xl">
            Termos essenciais para entender qualquer texto sobre acordos
            internacionais de previdência.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <dl className="divide-y divide-border border-y border-border">
          {termos.map((t) => (
            <div key={t.termo} className="grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-12">
              <dt className="font-display text-xl">{t.termo}</dt>
              <dd className="text-base leading-relaxed text-foreground/90">{t.def}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
