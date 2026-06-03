import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siteStats } from "@/data/site-stats";
import { CTAButton } from "@/components/cta-button";
import { getFoundersCount, FOUNDERS_LIMIT } from "@/lib/founders.functions";
import imgMarcos from "@/assets/marcos-espinola.jpg";
import imgProblem from "@/assets/lp/problem-papers.jpg";
import imgOrganized from "@/assets/lp/hub-organized.jpg";
import imgMap from "@/assets/lp/world-map-pins.jpg";

const TITLE = "Hub Profissional — Acordos internacionais resolvidos hoje";
const DESC =
  "A base técnica completa de direito previdenciário internacional, num único lugar coordenado: 40+ países, portarias, jurisprudência, calculadoras, certificados e fluxogramas. Para advogados que precisam fechar o caso hoje.";

export const Route = createFileRoute("/profissional")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Profissional,
});

function Profissional() {
  const { data: founders } = useQuery({
    queryKey: ["founders-count"],
    queryFn: () => getFoundersCount(),
    refetchInterval: 60_000,
  });

  const foundersFull = founders?.isFull ?? false;
  const foundersRemaining = founders?.remaining ?? FOUNDERS_LIMIT;

  return (
    <article>
      {/* HERO */}
      <header className="border-b border-border bg-card text-card-foreground border border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
            Hub Profissional · Direito Previdenciário Internacional
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            O fundamento técnico dos acordos internacionais, para você fechar o caso hoje.
          </h1>
          <p className="mt-8 max-w-2xl text-lg opacity-80">
            {siteStats.acordosMapeados}+ países · portarias estruturadas · jurisprudência selecionada · calculadoras de totalização · certificados (CDT, CSDP, prorrogação) — tudo num só lugar.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton href="#planos" variant="solid-light" size="lg" label="Ver planos" />
            <span className="text-xs uppercase tracking-[0.14em] opacity-70">
              {foundersRemaining} de {FOUNDERS_LIMIT} vagas Fundadores restantes
            </span>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-start">
            <div>
              <p className="eyebrow">Por que isso existe</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                Caso internacional cai na sua mesa. E agora?
              </h2>
              <p className="lede mt-6">
                Você abre o Gov.br, o site do MPS, o do INSS, a Receita, o consulado, e em todos a mesma informação aparece repartida, com nomes diferentes, em PDFs de 2008. Três dias só pra mapear a base legal de um caso que o cliente quer resolvido hoje.
              </p>
            </div>
            <div className="overflow-hidden border border-border">
              <img
                src={imgProblem}
                alt="Mesa de advogado coberta de PDFs impressos e notas"
                loading="lazy"
                width={1920}
                height={1080}
                className="block aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {[
              ["O texto do acordo", "PDF velho do MPS, sem índice, sem versão atualizada. Você relê três vezes pra achar o artigo."],
              ["O certificado que o INSS pede", "CDT, CSDP, prorrogação. Cada hora um roteiro diferente. Você refaz do zero."],
              ["O prazo do cliente", "Resposta hoje. Você precisa de três dias só pra mapear a base legal antes de começar."],
              ["A informação espalhada", "Gov.br, MPS, INSS, Receita, consulados — a mesma coisa em 12 abas, com nomes diferentes em cada uma."],
            ].map(([t, d]) => (
              <li key={t} className="bg-background p-8">
                <h3 className="font-display text-xl">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-12 border-t border-border pt-14 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="overflow-hidden border border-border md:order-first">
              <img
                src={imgOrganized}
                alt="Mesa organizada com laptop fechado, caderno e caneta"
                loading="lazy"
                width={1920}
                height={1080}
                className="block aspect-[16/10] w-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">A resposta</p>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">
                Tudo num único lugar coordenado.
              </h3>
              <p className="lede mt-6">
                Texto integral do acordo comentado artigo a artigo. Portarias agrupadas por tema. Jurisprudência por país e ponto controvertido. Mapas e endereços dos órgãos. Modelos de documentos prontos pra baixar. Fluxogramas de procedimento.
              </p>
              <p className="mt-4 text-foreground">
                Você para de garimpar e volta a advogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="overflow-hidden border border-border bg-background">
            <img
              src={imgMarcos}
              alt="Retrato do Dr. Marcos Espínola"
              loading="lazy"
              width={1280}
              height={1707}
              className="block aspect-[3/4] w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Quem construiu</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Construído por quem usa todo dia.
            </h2>
            <p className="lede mt-6">
              Dr. Marcos Espínola atua há mais de dez anos exclusivamente em Direito Previdenciário. Cansado de ver advogados refazendo a mesma pesquisa do zero, organizou dentro do Hub tudo o que usa no escritório — texto, portaria, jurisprudência, fluxo, modelo.
            </p>
            <Link
              to="/sobre/dr-marcos"
              className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Conhecer o Dr. Marcos →
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section
        className="relative border-b border-border bg-card text-card-foreground"
        style={{
          backgroundImage: `linear-gradient(color-mix(in oklab, var(--background) 88%, transparent), color-mix(in oklab, var(--background) 88%, transparent)), url(${imgMap})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
            O que entra junto
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">
            Cobertura, profundidade e autoridade técnica.
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-background/15 bg-background/15 md:grid-cols-4">
            {[
              [`${siteStats.acordosMapeados}+`, "Países cobertos"],
              [`${siteStats.documentosOrganizados}`, "Documentos organizados"],
              ["Integral", "Texto comentado artigo a artigo"],
              ["Contínua", "Atualização regulatória"],
            ].map(([n, l]) => (
              <div key={l} className="bg-card p-8">
                <p className="font-display text-5xl tracking-tight md:text-6xl">{n}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] opacity-70">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
              Curadoria de
            </p>
            <p className="mt-4 max-w-3xl font-display text-2xl leading-snug md:text-3xl">
              Dr. Marcos Espínola — sócio de Pagliuca, Espínola & Lessnau · Diretor Científico Adjunto do IBDP · Membro da Comissão de Direito Previdenciário OAB/PR · professor e autor em obras coletivas de Direito Previdenciário.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">O que está dentro</p>
          <h2 className="mt-3 font-display text-4xl">Para o trabalho do dia a dia.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {[
              ["Consulte fichas-país completas", `Os ${siteStats.acordosMapeados} acordos com base legal, formulários, particularidades e jurisprudência relevante.`],
              ["Leia acordos comentados", "Texto integral de cada acordo internacional comentado artigo a artigo."],
              ["Acesse portarias por tema", "Atos do INSS sobre acordos internacionais, estruturados por tema."],
              ["Pesquise jurisprudência organizada", "Decisões selecionadas por país, tipo de benefício e ponto controvertido."],
              ["Calcule totalização e pro-rata", "Totalização, conversão de tempo e cálculo pro-rata em segundos."],
              ["Baixe modelos de certificado", "Saída fiscal, deslocamento temporário, prorrogação — modelos e fluxos."],
              ["Siga fluxogramas de procedimento", "CDT, totalização, prova de vida: passo a passo visual."],
              [`Tenha +${siteStats.documentosOrganizados} documentos à mão`, "Organizado, buscável e atualizado quando há mudança regulatória."],
            ].map(([t, d]) => (
              <li key={t} className="bg-background p-8">
                <h3 className="font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PLANOS */}
      <PlanosSection
        foundersFull={foundersFull}
        foundersRemaining={foundersRemaining}
      />


      {/* CTA FINAL */}
      <section className="bg-card text-card-foreground border border-border">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
            Pronto para entrar?
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            100 vagas vitalícias. Depois, só anual.
          </h2>
          <p className="mt-6 text-lg opacity-80">
            {foundersFull
              ? "Vagas Fundadores esgotadas. O plano anual continua aberto."
              : `${foundersRemaining} de ${FOUNDERS_LIMIT} vagas restantes.`}
          </p>
          <div className="mt-10 flex justify-center">
            <CTAButton href="#planos" variant="solid-light" size="lg" label="Ver planos" />
          </div>
        </div>
      </section>
    </article>
  );
}
