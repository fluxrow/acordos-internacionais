import { createFileRoute, Link } from "@tanstack/react-router";
import {
  acordos,
  totalAcordos,
  totalBilaterais,
  totalDocs,
  totalMultilaterais,
} from "@/data/acordos";

const TITLE = "Acordos Internacionais de Previdência Social do Brasil";
const DESC =
  "O hub de referência sobre os acordos previdenciários internacionais firmados pelo Brasil. Para o cidadão brasileiro no exterior e para o advogado previdenciarista.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
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
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="eyebrow">Brasil · Previdência Social Internacional</p>
          <h1 className="mt-6 max-w-4xl font-display text-[2.75rem] leading-[1.05] tracking-tight md:text-[4.25rem]">
            O mapa definitivo dos{" "}
            <em className="font-normal italic text-destructive">acordos previdenciários</em>{" "}
            do Brasil.
          </h1>
          <p className="lede mt-8 max-w-2xl">
            Para o brasileiro no exterior que precisa entender seus direitos.
            Para o advogado que trabalha com totalização, prova de vida,
            certificados e benefícios internacionais.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/acordos"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
            >
              Ver os {totalAcordos} países
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/profissional"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-secondary"
            >
              Hub para advogados
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
          {[
            { n: totalAcordos, l: "Acordos vigentes" },
            { n: totalBilaterais, l: "Bilaterais" },
            { n: totalMultilaterais, l: "Multilaterais" },
            { n: `${totalDocs}+`, l: "Documentos organizados" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl tracking-tight md:text-5xl">{s.n}</p>
              <p className="eyebrow mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOIS PÚBLICOS */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-2">
          <PathCard
            number="01"
            eyebrow="Para o cidadão"
            titulo="Brasileiro no exterior"
            descricao="Você mora fora, vai se mudar ou está voltando ao Brasil. Entenda como o tempo contribuído conta e fale diretamente com o advogado responsável quando precisar."
            ctaLabel="Ver jornadas"
            ctaTo="/jornadas/$jornada"
            ctaParams={{ jornada: "moro-fora" }}
            secondaryLabel="Falar com o Dr. Marcos"
            secondaryTo="/contato"
          />
          <PathCard
            number="02"
            eyebrow="Para o advogado"
            titulo="Hub profissional"
            descricao="Base técnica completa por país: portarias comentadas, modelos de petição, jurisprudência, calculadoras e fluxogramas. Acesso vitalício, atualização contínua."
            ctaLabel="Conhecer o hub"
            ctaTo="/profissional"
            secondaryLabel="Sobre o Dr. Marcos"
            secondaryTo="/sobre/dr-marcos"
            inverso
          />
        </div>
      </section>

      {/* PAÍSES EM DESTAQUE */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Mais procurados</p>
              <h2 className="mt-3 font-display text-4xl">Países em destaque</h2>
            </div>
            <Link
              to="/acordos"
              className="text-sm underline underline-offset-4 hover:text-destructive"
            >
              Ver todos os {totalAcordos} →
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/acordos/$pais"
                  params={{ pais: a.slug }}
                  className="group flex h-full items-center gap-5 bg-background p-6 transition-colors hover:bg-foreground hover:text-background"
                >
                  {a.iso && (
                    <img
                      src={`https://flagcdn.com/w160/${a.iso}.png`}
                      alt=""
                      width={56}
                      height={42}
                      loading="lazy"
                      className="h-[42px] w-[56px] flex-shrink-0 border border-border object-cover"
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
                    className="ml-auto text-lg transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
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
              className="text-sm underline underline-offset-4 hover:text-destructive"
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
                    className="group flex items-center justify-between py-4 text-base transition-colors hover:text-destructive"
                  >
                    <span>{label}</span>
                    <span aria-hidden className="opacity-50 group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
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
                    className="group flex items-center justify-between py-4 text-base transition-colors hover:text-destructive"
                  >
                    <span>{label}</span>
                    <span aria-hidden className="opacity-50 group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function PathCard(props: {
  number: string;
  eyebrow: string;
  titulo: string;
  descricao: string;
  ctaLabel: string;
  ctaTo: string;
  ctaParams?: Record<string, string>;
  secondaryLabel: string;
  secondaryTo: string;
  inverso?: boolean;
}) {
  const wrap = props.inverso
    ? "bg-foreground text-background"
    : "bg-background text-foreground";
  return (
    <div className={`${wrap} flex flex-col gap-6 p-10 md:p-14`}>
      <div className="flex items-baseline gap-4">
        <span className="font-display text-3xl opacity-50">{props.number}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
          {props.eyebrow}
        </span>
      </div>
      <h3 className="font-display text-3xl leading-tight md:text-4xl">{props.titulo}</h3>
      <p className="text-base opacity-80 md:text-lg">{props.descricao}</p>
      <div className="mt-auto flex flex-wrap items-center gap-5 pt-4">
        <Link
          to={props.ctaTo as any}
          params={props.ctaParams as any}
          className={
            props.inverso
              ? "inline-flex items-center gap-2 rounded-sm bg-background px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-secondary"
              : "inline-flex items-center gap-2 rounded-sm bg-foreground px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
          }
        >
          {props.ctaLabel} <span aria-hidden>→</span>
        </Link>
        <Link
          to={props.secondaryTo as any}
          className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100"
        >
          {props.secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
