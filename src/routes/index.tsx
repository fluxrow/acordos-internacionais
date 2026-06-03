import { createFileRoute, Link } from "@tanstack/react-router";
import { acordos } from "@/data/acordos";
import { siteStats } from "@/data/site-stats";
import { Globe } from "@/components/globe";
import { CTAButton } from "@/components/cta-button";


const TITLE = "Acordos Internacionais — Acordos previdenciários para brasileiros no exterior";
const DESC =
  "Acordos Internacionais é a referência sobre os acordos previdenciários bilaterais do Brasil. Para o cidadão no exterior e para o advogado previdenciarista.";
const OG_IMAGE = "https://acordosinternacionais.lovable.app/og-image.jpg?v=2";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: Home,
});

function Home() {
  const destaques = [
    "portugal",
    "japao",
    "estados-unidos",
    "italia",
    "alemanha",
    "espanha",
  ]
    .map((s) => acordos.find((a) => a.slug === s))
    .filter(Boolean) as typeof acordos;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative min-h-[580px] md:min-h-[600px] lg:min-h-[640px]">
          {/* Camada globo — absoluto, ancorado à direita, parcialmente fora */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[40%] top-[48%] w-[360px] -translate-y-1/2 opacity-65 md:pointer-events-auto md:-right-[25%] md:top-1/2 md:w-[560px] md:opacity-100 lg:-right-[15%] lg:w-[720px]"
          >
            <Globe />
          </div>

          {/* Overlay para legibilidade do texto sobre o globo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--paper)_0%,_color-mix(in_oklab,_var(--paper)_85%,_transparent)_30%,_transparent_70%)] md:bg-[linear-gradient(to_right,_var(--paper)_0%,_color-mix(in_oklab,_var(--paper)_70%,_transparent)_25%,_transparent_55%)]"
          />

          {/* Conteúdo */}
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="max-w-full md:max-w-[480px] lg:max-w-[560px]">
              <p className="eyebrow">Brasil · Previdência Social Internacional</p>
              <h1 className="mt-6 font-display text-[2.5rem] leading-[1.02] tracking-tight md:text-[3.5rem] lg:text-[4.25rem]">
                O mapa definitivo dos{" "}
                <span className="text-gold">
                  acordos previdenciários
                </span>{" "}
                do Brasil.
              </h1>

              <p className="lede mt-8 max-w-xl">
                Para o brasileiro que trabalha ou trabalhou no exterior e que
                precisa entender seus direitos previdenciários.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  to="/calculadora"
                  variant="dark"
                  size="lg"
                  label="Simular meu benefício · grátis"
                />
                <CTAButton
                  to="/acordos"
                  variant="light"
                  size="lg"
                  label={`Ver os ${siteStats.acordosMapeados} países`}
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Trabalhou no exterior? Descubra em 2 minutos. Sem cadastro. Sem pagar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 md:py-12">
          {[
            { n: siteStats.acordosVigentes, l: "Acordos em vigor" },
            { n: siteStats.acordosBilateraisVigentes, l: "Bilaterais em vigor" },
            { n: siteStats.acordosEmRatificacao, l: "Em ratificação" },
            { n: `${siteStats.documentosOrganizados}+`, l: "Documentos organizados" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl tracking-tight md:text-4xl">{s.n}</p>
              <p className="eyebrow mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOIS PÚBLICOS — reescrito (cidadão + advogado) */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2 md:py-20">
          {/* 01 · Cidadão */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-10 shadow-[var(--shadow-soft)] md:p-14">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-3xl opacity-50">01</span>
              <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                Para o cidadão
              </span>
            </div>
            <h3 className="font-display text-2xl leading-tight md:text-3xl">
              Para o brasileiro que trabalha ou trabalhou no exterior e que
              precisa entender seus direitos previdenciários.
            </h3>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              <CTAButton
                to="/acordos"
                variant="dark"
                size="md"
                label={`Ver os ${siteStats.acordosMapeados} países`}
              />
              <Link
                to="/jornadas"
                className="rounded-full border border-[var(--accent-ink)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]"
              >
                Explorar por situação / jornadas
              </Link>
              <Link
                to="/blog"
                className="rounded-full border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* 02 · Advogado */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[var(--accent-ink)] bg-card p-10 text-card-foreground shadow-[var(--shadow-soft)] md:p-14">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-3xl opacity-50">02</span>
              <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                Para o advogado
              </span>
            </div>
            <h3 className="font-display text-2xl leading-tight md:text-3xl">
              Hub Profissional em Direito Previdenciário Internacional:
              Educação, Eficiência e Excelência.
            </h3>
            <p className="text-base opacity-80 md:text-lg">
              Base técnica completa: textos integrais dos
              acordos internacionais comentados, portarias estruturadas por
              tema, jurisprudência organizada, calculadoras de totalização e
              benefícios previdenciários, certificados (saída fiscal,
              deslocamento temporário, prorrogação). Tudo integrado para
              economizar tempo no seu dia a dia e fundamentar suas estratégias
              em lei.
            </p>
            <p className="text-sm italic opacity-75">
              O fundamento técnico que você merece. A eficiência que você precisa.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              <CTAButton
                to="/profissional"
                variant="solid-light"
                size="md"
                label="Conhecer o hub"
              />
              <Link
                to="/blog"
                className="rounded-full border border-[var(--accent-ink)]/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
              >
                Blog
              </Link>
              <Link
                to="/sobre/dr-marcos"
                className="rounded-full border border-[var(--accent-ink)]/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
              >
                Sobre o Dr. Marcos
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* PAÍSES EM DESTAQUE */}
      <section className="relative overflow-hidden border-y border-border bg-background">
        {/* Wash radial wine soft */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_var(--accent-ink-soft)_0%,_transparent_60%)] opacity-70"
        />
        {/* Globo de fundo */}
        <div
          aria-hidden
          className="animate-globe-enter-left pointer-events-none absolute left-[-35%] top-1/2 hidden w-[680px] -translate-y-1/2 opacity-60 md:block lg:left-[-20%] lg:w-[820px]"
        >
          <Globe tint="wine" mapSamples={10000} />
        </div>
        {/* Fade nas bordas verticais para não vazar */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Mais procurados</p>
              <h2 className="mt-3 font-display text-4xl">Países em destaque</h2>
            </div>
            <Link
              to="/acordos"
              className="text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Ver todos os {siteStats.acordosMapeados} →
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/acordos/$pais"
                  params={{ pais: a.slug }}
                  className="group flex h-full items-center gap-5 rounded-xl border border-border/60 bg-background/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent-ink)] hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
                >
                  {a.iso && (
                    <img
                      src={`https://flagcdn.com/w160/${a.iso}.png`}
                      alt=""
                      width={56}
                      height={42}
                      loading="lazy"
                      className="h-[42px] w-[56px] flex-shrink-0 rounded-md border border-border object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-display text-xl leading-tight">{a.nome}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] opacity-70">
                      {a.tipo === "bilateral" ? "Bilateral" : "Multilateral"}
                      {a.vigencia && ` · desde ${a.vigencia}`}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="ml-auto text-lg text-[var(--accent-ink)] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Para advogados</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Cada país abre uma vitrine pública. A profundidade técnica
                (texto integral, portarias, modelos, calculadora, jurisprudência)
                fica no Hub Profissional.
              </p>
            </div>
            <Link
              to="/profissional"
              className="text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Conhecer o hub →
            </Link>
          </div>
        </div>
      </section>

      {/* JORNADAS / GUIAS */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="eyebrow">Por situação</p>
            <h2 className="mt-3 font-display text-3xl">Jornadas</h2>
            <p className="lede mt-4 text-base">
              O que fazer em cada momento da sua vida internacional.
            </p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {[
                ["vou-me-mudar", "Vou me mudar para outro país"],
                ["moro-fora", "Já moro no exterior"],
                ["estou-voltando", "Estou voltando ao Brasil"],
                ["quero-me-aposentar", "Quero me aposentar usando o acordo"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: slug }}
                    className="group flex items-center justify-between py-4 text-base transition-colors hover:text-[var(--accent-ink)]"
                  >
                    <span>{label}</span>
                    <span aria-hidden className="opacity-50 group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/jornadas"
              className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Ver todas as jornadas →
            </Link>
          </div>

          <div>
            <p className="eyebrow">Por tema</p>
            <h2 className="mt-3 font-display text-3xl">Guias</h2>
            <p className="lede mt-4 text-base">
              Conceitos centrais explicados sem juridiquês.
            </p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {[
                ["totalizacao", "Totalização de períodos contributivos"],
                ["prova-de-vida-no-exterior", "Prova de vida no exterior"],
                ["certificado-deslocamento-temporario", "Certificado de Deslocamento Temporário"],
                ["aposentadoria-morando-fora", "Aposentadoria do INSS morando fora"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    to="/guias/$slug"
                    params={{ slug }}
                    className="group flex items-center justify-between py-4 text-base transition-colors hover:text-[var(--accent-ink)]"
                  >
                    <span>{label}</span>
                    <span aria-hidden className="opacity-50 group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/guias"
              className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-[var(--accent-ink)]"
            >
              Ver todos os guias →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

