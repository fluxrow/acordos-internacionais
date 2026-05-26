import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Scale, Users, ArrowRight } from "lucide-react";
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

      {/* Atuação — dois campos */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Prática profissional</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Atuação</h2>
          <p className="lede mt-4">
            Dois campos, uma especialização. A atuação exclusiva em Direito
            Previdenciário existe por uma razão objetiva: o sistema é complexo
            o suficiente para exigir foco real.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* Nacional */}
          <article className="rounded-2xl border border-border/60 bg-background/60 p-7 backdrop-blur-md md:p-8">
            <p className="eyebrow">Previdenciário nacional</p>
            <h3 className="mt-2 font-display text-2xl">Segurados do INSS no Brasil</h3>
            <p className="mt-4 text-base leading-relaxed">
              Aposentadorias, benefícios por incapacidade, pensão por morte,
              revisões de benefícios concedidos e planejamento contributivo
              para quem vive e contribui no Brasil.
            </p>
          </article>

          {/* Internacional — destacado */}
          <article className="relative overflow-hidden rounded-2xl border border-[var(--accent-ink)]/30 bg-[var(--accent-ink-soft)] p-7 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,_color-mix(in_oklab,_var(--accent-ink)_22%,_transparent)_0%,_transparent_60%)]"
            />
            <div className="relative">
              <p className="eyebrow text-[var(--accent-ink)]">Previdenciário internacional</p>
              <h3 className="mt-2 font-display text-2xl">
                Brasileiros entre dois sistemas
              </h3>
              <p className="mt-4 text-base leading-relaxed">
                Brasileiros que vivem ou viveram no exterior, estrangeiros com
                tempo contributivo no Brasil, expatriados e trabalhadores em
                processo de emigração. O foco é{" "}
                <em>planejamento previdenciário internacional</em>: estruturar
                a vida contributiva para que funcione nos dois países — porque
                o que se decide antes da mudança raramente pode ser desfeito
                depois.
              </p>
            </div>
          </article>
        </div>

        {/* Stats / autoridade */}
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            { label: "Atuação exclusiva", value: "Direito Previdenciário" },
            { label: "Hub público", value: "Mantido pelo escritório" },
            { label: "Registro", value: "OAB/PR 49.038" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-background p-5"
            >
              <p className="eyebrow">{s.label}</p>
              <p className="mt-2 font-display text-lg leading-tight">
                {s.value}
              </p>
            </div>
          ))}
        </div>
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

      {/* Manifesto — Por que este hub existe */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <p className="eyebrow">Manifesto</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          Por que este hub existe
        </h2>
        <hr className="rule mt-4" />

        <blockquote className="relative mt-8 max-w-2xl">
          <span
            aria-hidden
            className="absolute -left-2 -top-6 font-display text-7xl leading-none text-[var(--accent-ink)]/35 select-none md:-left-6 md:text-8xl"
          >
            “
          </span>
          <p className="font-display text-xl italic leading-snug md:text-2xl">
            A informação sobre acordos internacionais do INSS está dispersa —
            no gov.br, em portarias que não se falam, em literatura técnica
            inacessível para quem mais precisa.
          </p>
        </blockquote>

        <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed">
          <p>
            Quem vai se mudar para o exterior raramente sabe o que acontece
            com os anos contribuídos no Brasil. Quem volta, muitas vezes
            descobre tarde demais que perdeu tempo contributivo por falta de
            orientação.
          </p>
          <p>
            O hub foi construído para resolver isso: linguagem clara para o
            cidadão, profundidade técnica para o advogado. Tudo no mesmo lugar.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            { icon: BookOpen, titulo: "Linguagem clara", texto: "Para o cidadão entender o que está em jogo." },
            { icon: Scale, titulo: "Profundidade técnica", texto: "Portarias, jurisprudência e modelos para o advogado." },
            { icon: Users, titulo: "Um único lugar", texto: "Toda a base sobre acordos bilaterais reunida." },
          ].map(({ icon: Icon, titulo, texto }) => (
            <div
              key={titulo}
              className="rounded-xl border border-border bg-secondary p-5"
            >
              <Icon className="h-5 w-5 text-[var(--accent-ink)]" aria-hidden />
              <p className="mt-3 font-display text-base leading-tight">
                {titulo}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como falar — dois caminhos */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Acesso</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Como falar comigo
          </h2>
          <p className="lede mt-4">
            Dois caminhos, dois públicos. Escolha o que faz sentido para o
            seu momento.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* Cidadão */}
          <article className="flex flex-col rounded-2xl border border-border bg-secondary p-7 md:p-8">
            <p className="eyebrow">Para o cidadão</p>
            <h3 className="mt-2 font-display text-2xl">Conte sua situação</h3>
            <p className="mt-4 flex-1 text-base leading-relaxed">
              Pelo formulário de contato. Cada mensagem é lida pessoalmente
              pelo Dr. Marcos Espínola — totalização, CDT, CSDP, prova de vida
              ou planejamento internacional.
            </p>
            <Link
              to="/contato"
              className="mt-6 inline-flex items-center gap-2 font-display text-base underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Formulário de contato
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>

          {/* Advogado */}
          <article className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--accent-ink)]/30 bg-[var(--accent-ink)] p-7 text-[var(--paper)] md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,_color-mix(in_oklab,_var(--paper)_18%,_transparent)_0%,_transparent_55%)]"
            />
            <div className="relative flex h-full flex-col">
              <p className="eyebrow text-[var(--paper)]/80">Para advogados</p>
              <h3 className="mt-2 font-display text-2xl">Hub profissional</h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--paper)]/90">
                Base técnica completa: portarias comentadas, modelos de
                petição, jurisprudência selecionada e calculadoras por país.
                Construído para quem opera o sistema.
              </p>
              <Link
                to="/profissional"
                className="mt-6 inline-flex items-center gap-2 font-display text-base text-[var(--paper)] underline underline-offset-4 hover:text-[var(--paper)]/80"
              >
                Acessar o hub profissional
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <CTAMarcos
        variant="block"
        contexto="Conte sua situação — totalização, CDT, CSDP, prova de vida ou planejamento internacional. Cada caso é lido pessoalmente pelo Dr. Marcos Espínola."
      />
    </article>
  );
}
