import { createFileRoute, Link } from "@tanstack/react-router";
import { CTAMarcos } from "@/components/cta-marcos";
import {
  InteractiveImageAccordion,
  type AccordionItem,
} from "@/components/interactive-image-accordion";
import imgTotalizacao from "@/assets/atuacao/totalizacao.jpg";
import imgAposentadoria from "@/assets/atuacao/aposentadoria.jpg";
import imgPensaoMorte from "@/assets/atuacao/pensao-morte.jpg";
import imgProvaVida from "@/assets/atuacao/prova-vida.jpg";
import imgCdt from "@/assets/atuacao/cdt.jpg";
import imgCsdp from "@/assets/atuacao/csdp.jpg";
import imgPlanejamento from "@/assets/atuacao/planejamento.jpg";

const TITLE = "Dr. Marcos Espínola — Advogado em previdência internacional";
const DESC =
  "Advogado previdenciarista, sócio do escritório Pagliuca, Espínola e Lessnau, fundador do hub Acordos Internacionais. Atuação em totalização, CDT, CSDP, prova de vida e benefícios para brasileiros no exterior.";

const ATUACAO_INTERNACIONAL: AccordionItem[] = [
  {
    id: "totalizacao",
    titulo: "Totalização de períodos",
    descricao:
      "Soma do tempo contributivo no Brasil e no exterior para alcançar a carência exigida em um dos países signatários do acordo.",
    imagem: imgTotalizacao,
    alt: "Documentos previdenciários brasileiros e europeus organizados sobre mesa de madeira",
  },
  {
    id: "aposentadoria",
    titulo: "Aposentadoria por idade e invalidez",
    descricao:
      "Pedidos de benefício programado e benefício por incapacidade combinando o tempo nos dois sistemas, com requerimento no país de residência.",
    imagem: imgAposentadoria,
    alt: "Pessoa idosa sentada à janela com luz suave",
  },
  {
    id: "pensao-morte",
    titulo: "Pensão por morte",
    descricao:
      "Concessão de pensão a dependentes quando o segurado tinha vínculo nos dois países, com totalização de carência e prova internacional do óbito.",
    imagem: imgPensaoMorte,
    alt: "Flor seca sobre uma carta manuscrita dobrada",
  },
  {
    id: "prova-vida",
    titulo: "Prova de vida",
    descricao:
      "Manutenção do benefício do INSS recebido fora do Brasil: prova de vida consular, eletrônica ou por procurador, sem suspensão do pagamento.",
    imagem: imgProvaVida,
    alt: "Mãos segurando passaporte brasileiro junto a uma janela",
  },
  {
    id: "cdt",
    titulo: "Certificado de Deslocamento Temporário (CDT)",
    descricao:
      "Documento que mantém o trabalhador deslocado vinculado ao INSS, evitando dupla contribuição enquanto está em missão no exterior.",
    imagem: imgCdt,
    alt: "Passaporte aberto com carimbos sobre mapa-múndi e bússola",
  },
  {
    id: "csdp",
    titulo: "Comunicação de Saída Definitiva do País (CSDP)",
    descricao:
      "Formalização tributária e previdenciária da saída definitiva do Brasil, com impacto direto em filiação ao INSS e tempo de contribuição.",
    imagem: imgCsdp,
    alt: "Mala única em corredor vazio de aeroporto ao amanhecer",
  },
  {
    id: "planejamento",
    titulo: "Planejamento previdenciário internacional",
    descricao:
      "Estruturação da vida contributiva para que funcione nos dois países. Cada decisão pesa: o que é feito antes da mudança raramente pode ser desfeito depois.",
    imagem: imgPlanejamento,
    alt: "Mesa de escritório com caderno aberto, caneta tinteiro, mapa e óculos",
  },
];

export const Route = createFileRoute("/sobre/dr-marcos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: SobreMarcos,
});

function SobreMarcos() {
  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_oklab,_var(--accent-ink)_14%,_transparent)_0%,_transparent_60%)]"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="eyebrow">Sobre</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">
            Dr. Marcos Espínola
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Advogado previdenciarista com atuação exclusiva em Direito
            Previdenciário. Sócio do escritório{" "}
            <span className="text-foreground">
              Pagliuca, Espínola e Lessnau — Advocacia com Propósito
            </span>
            , em Curitiba. Fundador do hub Acordos Internacionais, criado para
            organizar, em um único lugar, a base técnica e informativa sobre
            os acordos bilaterais firmados pelo Brasil.
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            OAB/PR 49.038
          </p>
        </div>
      </header>

      {/* Atuação — texto */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <Bloco titulo="Atuação">
            <p>
              No previdenciário <strong>nacional</strong>, atendo segurados em
              aposentadorias, benefícios por incapacidade, pensão por morte,
              revisões de benefícios concedidos e planejamento contributivo. A
              atuação exclusiva em previdenciário tem uma razão objetiva: o
              sistema é complexo o suficiente para exigir especialização real.
            </p>
            <p className="mt-4">
              No previdenciário <strong>internacional</strong>, atendo
              brasileiros que vivem ou viveram no exterior, estrangeiros com
              tempo contributivo no Brasil, expatriados e trabalhadores em
              processo de emigração.
            </p>
            <p className="mt-4">
              Meu trabalho é principalmente{" "}
              <em>planejamento previdenciário internacional</em>: estruturar
              sua vida contributiva para que funcione nos dois países. São
              situações que combinam dois sistemas previdenciários distintos,
              acordos bilaterais e, frequentemente, decisões que não têm como
              ser desfeitas depois.
            </p>
          </Bloco>
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <CTAMarcos contexto="Conte sua situação. Cada mensagem é lida pessoalmente pelo Dr. Marcos Espínola." />
        </aside>
      </section>

      {/* Accordion interativo — Áreas de atuação internacional */}
      <section className="border-y border-border bg-[var(--accent-ink-soft)]/30">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Previdenciário internacional</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Áreas de atuação
            </h2>
            <p className="lede mt-4">
              Sete frentes que combinam dois sistemas previdenciários,
              acordos bilaterais e decisões que raramente podem ser desfeitas.
            </p>
          </div>
          <div className="mt-10">
            <InteractiveImageAccordion items={ATUACAO_INTERNACIONAL} />
          </div>
          <p className="mt-6 text-xs text-muted-foreground md:text-sm">
            Passe o mouse sobre cada card (ou toque, no mobile) para abrir.
          </p>
        </div>
      </section>

      {/* Por que este hub existe + Como falar */}
      <section className="mx-auto max-w-4xl space-y-12 px-6 py-16 md:py-20">
        <Bloco titulo="Por que este hub existe">
          <p>
            A informação sobre acordos internacionais do INSS está dispersa.
            Está no gov.br, em portarias que não se falam, em literatura
            especializada inacessível para quem mais precisa. Quem vai se
            mudar para o exterior raramente sabe o que acontece com os anos
            contribuídos no Brasil. Quem volta, muitas vezes descobre tarde
            demais que perdeu tempo contributivo por falta de orientação.
          </p>
          <p className="mt-4">
            O hub foi construído para resolver isso: linguagem clara para o
            cidadão, profundidade técnica para o advogado. Tudo no mesmo
            lugar.
          </p>
        </Bloco>
        <Bloco titulo="Como falar comigo">
          <p>
            Pelo{" "}
            <Link to="/contato" className="ink-link">
              formulário de contato
            </Link>
            . Cada mensagem é lida pessoalmente. Para advogados, o{" "}
            <Link to="/profissional" className="ink-link">
              hub profissional
            </Link>{" "}
            tem base técnica completa, portarias comentadas, modelos de
            petição, jurisprudência e calculadoras por país.
          </p>
        </Bloco>
      </section>

      <CTAMarcos
        variant="block"
        contexto="Conte sua situação — totalização, CDT, CSDP, prova de vida ou planejamento internacional. Cada caso é lido pessoalmente pelo Dr. Marcos Espínola."
      />
    </article>
  );
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl">{titulo}</h2>
      <hr className="rule mt-3" />
      <div className="mt-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}
