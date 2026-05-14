import { createFileRoute, Link } from "@tanstack/react-router";
import { CTAMarcos } from "@/components/cta-marcos";

const TITLE = "Dr. Marcos Espínola — Advogado em previdência internacional";
const DESC =
  "Advogado responsável pelo hub Acordos Internacionais. Atuação em totalização, certificados de deslocamento, prova de vida e benefícios para brasileiros no exterior.";

export const Route = createFileRoute("/sobre/dr-marcos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: SobreMarcos,
});

function SobreMarcos() {
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="eyebrow">Sobre</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">Dr. Marcos Espínola</h1>
          <p className="lede mt-6 max-w-2xl">
            Advogado previdenciarista, fundador do hub Acordos Internacionais
            e autor do mapa que organiza, em um único lugar, todos os acordos
            previdenciários firmados pelo Brasil.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <Bloco titulo="Atuação">
            <p>
              Atendimento direto a brasileiros no exterior, retornados e
              estrangeiros com tempo no Brasil. Casos típicos: totalização de
              períodos, pedidos de aposentadoria por idade e invalidez,
              pensões por morte, prova de vida e Certificado de Deslocamento
              Temporário (CDT).
            </p>
          </Bloco>
          <Bloco titulo="Por que este hub existe">
            <p>
              A informação sobre acordos internacionais do INSS está
              fragmentada entre o gov.br, portarias dispersas e literatura
              especializada. O hub nasceu para juntar tudo num único lugar: em
              linguagem clara para o cidadão e em profundidade técnica para
              o advogado.
            </p>
          </Bloco>
          <Bloco titulo="Como falar comigo">
            <p>
              A melhor forma é pelo formulário de contato. Cada pedido é lido
              pessoalmente. Para advogados, há também o{" "}
              <Link to="/profissional" className="ink-link">
                hub profissional
              </Link>{" "}
              com base técnica e ferramentas.
            </p>
          </Bloco>
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <CTAMarcos contexto="Conte sua situação. Cada mensagem é lida pessoalmente pelo Dr. Marcos." />
        </aside>
      </section>
    </article>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl">{titulo}</h2>
      <hr className="rule mt-3" />
      <div className="mt-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}
