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
            <CTAButton to="/precos" variant="solid-light" size="lg" label="Ver planos" />
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
              ["Calcule totalização e pró-rata", "Totalização, conversão de tempo e cálculo pró-rata em segundos."],
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
            <CTAButton to="/precos" variant="solid-light" size="lg" label="Ver planos" />
          </div>
        </div>
      </section>
    </article>
  );
}

// ============================================================================
// Planos — espelha o esquema do /precos (toggle Mensal/Anual + Fundadores),
// mas com botões que levam para /precos para finalizar a assinatura.
// ============================================================================

const MAIN_OPTIONS = {
  mensal: {
    label: "Mensal",
    preco: "R$ 87",
    periodo: "/mês",
    desc: "Acesso completo ao Hub com cobrança mensal. Cancele quando quiser, sem multa.",
    micro: "Cancele quando quiser",
    hash: "mensal",
  },
  anual: {
    label: "Anual",
    preco: "R$ 837",
    periodo: "/ano",
    desc: "Acesso completo ao Hub por 12 meses. Equivale a R$ 69,75/mês. Renovação opcional.",
    micro: "Economize ~20% vs. mensal (R$ 1.044/ano)",
    hash: "anual",
  },
} as const;

type MainKey = keyof typeof MAIN_OPTIONS;

function PlanosSection({
  foundersFull,
  foundersRemaining,
}: {
  foundersFull: boolean;
  foundersRemaining: number;
}) {
  const [billing, setBilling] = useState<MainKey>("anual");
  const main = MAIN_OPTIONS[billing];
  const isAnual = billing === "anual";

  return (
    <section id="planos" className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Planos</p>
          <h2 className="mt-3 font-display text-4xl">
            Mensal, anual ou vitalício para os 100 primeiros.
          </h2>
          <p className="lede mt-6 text-base">
            Conteúdo idêntico em todos os planos — escolha apenas como prefere pagar.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Card principal — Mensal / Anual com toggle */}
          <div className="relative flex flex-col rounded-2xl border border-[var(--accent-ink)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-gold-glow)] transition-all hover:-translate-y-0.5">
            {isAnual && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-ink)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)]">
                Mais popular
              </span>
            )}

            <div
              role="tablist"
              aria-label="Periodicidade de cobrança"
              className="mb-5 inline-flex self-start rounded-full border border-[var(--accent-ink)]/40 bg-[var(--paper)] p-1"
            >
              {(Object.keys(MAIN_OPTIONS) as MainKey[]).map((k) => {
                const active = k === billing;
                return (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setBilling(k)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "bg-[var(--accent-ink)] text-[var(--paper)] shadow-[var(--shadow-soft)]"
                        : "text-[var(--accent-ink)] hover:bg-[color-mix(in_oklab,var(--accent-ink)_10%,transparent)]"
                    }`}
                  >
                    {MAIN_OPTIONS[k].label}
                  </button>
                );
              })}
            </div>

            <div className="mb-4">
              <p className="eyebrow">{main.label}</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-4xl text-[var(--accent-ink)]">{main.preco}</span>
                <span className="mb-1 text-sm text-muted-foreground">{main.periodo}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-[var(--accent-ink)]">{main.micro}</p>
            </div>

            <p className="flex-1 text-sm text-[var(--ink-soft)]">{main.desc}</p>

            <Link
              to="/precos"
              hash={main.hash}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
            >
              Assinar
            </Link>
          </div>

          {/* Card Fundadores */}
          <div className="relative flex flex-col rounded-2xl border border-[var(--accent-ink)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow-gold-glow)] transition-all hover:-translate-y-0.5">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--accent-ink)] bg-[var(--paper)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
              Lançamento · 100 vagas
            </span>

            <div className="mb-4">
              <p className="eyebrow">Fundadores</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-4xl text-[var(--accent-ink)]">R$ 1.297</span>
                <span className="mb-1 text-sm text-muted-foreground">único</span>
              </div>
            </div>

            <p className="flex-1 text-sm text-[var(--ink-soft)]">
              Acesso vitalício para os 100 primeiros. Pague uma vez, acesse para sempre, com todas as atualizações futuras incluídas.
            </p>

            {!foundersFull ? (
              <p className="mt-3 text-xs font-medium text-[var(--accent-ink)]">
                {foundersRemaining} de {FOUNDERS_LIMIT} vagas restantes
              </p>
            ) : (
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Esgotado — todas as {FOUNDERS_LIMIT} vagas preenchidas
              </p>
            )}

            {foundersFull ? (
              <span className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[var(--accent-ink)]/40 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] opacity-70">
                Esgotado
              </span>
            ) : (
              <Link
                to="/precos"
                hash="fundadores"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
              >
                Garantir vaga
              </Link>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Você escolhe e finaliza o pagamento em{" "}
          <Link to="/precos" className="underline">/precos</Link>.
        </p>
      </div>
    </section>
  );
}
