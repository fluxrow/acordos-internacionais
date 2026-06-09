import { createFileRoute, Link } from "@tanstack/react-router";
import { CTAMarcos } from "@/components/cta-marcos";

const TITLE = "Glossário de previdência internacional";
const DESC =
  "Termos essenciais sobre acordos internacionais de previdência social do Brasil: totalização, pro-rata, CDT, CNIS e mais.";

const CANONICAL = "https://acordosinternacionais.com/glossario";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: termos.map((t) => ({
            "@type": "Question",
            name: t.termo,
            acceptedAnswer: { "@type": "Answer", text: t.def },
          })),
        }),
      },
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
    termo: "APSAI",
    def: "Agência da Previdência Social de Atendimento a Acordos Internacionais. Unidades especializadas do INSS que processam pedidos de totalização e benefícios com base em acordos.",
  },
  {
    termo: "Atestado de vida",
    def: "Documento que comprova que o beneficiário está vivo. Pode ser feito por consulado, biometria Gov.br, notário com Apostila de Haia ou procurador. Validade de 90 dias até a entrega ao INSS.",
  },
  {
    termo: "Benefício teórico",
    def: "Valor hipotético do benefício calculado como se todo o tempo (Brasil + país acordante) tivesse sido contribuído sob a legislação brasileira. Base para o cálculo pro-rata.",
  },
  {
    termo: "Benefício pro-rata",
    def: "Parte proporcional do benefício teórico paga pelo Brasil, calculada na razão entre o tempo contribuído no Brasil e o tempo total considerado. Cada país acordante paga sua própria fração.",
  },
  {
    termo: "Carência",
    def: "Número mínimo de contribuições mensais exigido para que o segurado tenha direito a um benefício. Em acordos, o tempo no exterior conta para atingir a carência (totalização).",
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
    termo: "CSDP",
    def: "Comunicação de Saída Definitiva do País. Comunica à Receita Federal a saída fiscal do Brasil — passo prévio à DSDP. Marco para residência fiscal e contribuição como facultativo.",
  },
  {
    termo: "DSDP",
    def: "Declaração de Saída Definitiva do País. Declaração entregue à Receita Federal no ano seguinte ao da saída, consolidando o encerramento da residência fiscal brasileira.",
  },
  {
    termo: "Dupla contribuição",
    def: "Situação em que o trabalhador recolhe previdência simultaneamente em dois países pelo mesmo período. Os acordos existem justamente para evitar isso (via CDT ou regra de filiação única).",
  },
  {
    termo: "Formulário de ligação",
    def: "Documentos padronizados (PT-BR1, US/BR, JP/BR etc.) usados para comunicação oficial entre as autoridades previdenciárias dos países acordantes.",
  },
  {
    termo: "Órgão de ligação",
    def: "Autoridade designada por cada país para operacionalizar o acordo: trocar formulários, certificar tempo de contribuição e processar pedidos. No Brasil é o INSS via APSAI.",
  },
  {
    termo: "Pro-rata (cálculo pro-rata)",
    def: "Forma de calcular o benefício quando há totalização: cada país paga a parte proporcional ao tempo contribuído sob sua legislação.",
  },
  {
    termo: "Residência fiscal",
    def: "País onde a pessoa é considerada contribuinte fiscal. Encerrar a residência fiscal brasileira (CSDP + DSDP) é independente da residência previdenciária e tem efeitos próprios.",
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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const letras = Array.from(new Set(termos.map((t) => t.termo[0].toUpperCase()))).sort();

function Glossario() {
  return (
    <article>
      {/* Hero editorial */}
      <header className="relative overflow-hidden border-b border-border bg-[var(--accent-ink-soft)]/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,_color-mix(in_oklab,_var(--accent-ink)_14%,_transparent)_0%,_transparent_60%)]"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
          <nav className="text-xs uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Início</Link>
            <span className="mx-2 opacity-50">/</span>
            <span>Referência</span>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-foreground">Glossário</span>
          </nav>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--accent-ink)]" />
            <p className="eyebrow">Referência · Glossário</p>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
            Vocabulário dos acordos previdenciários
          </h1>
          <p className="lede mt-8 max-w-2xl">
            {termos.length} termos essenciais para ler — e escrever — sobre acordos
            internacionais de previdência social sem ambiguidade.
          </p>
        </div>
      </header>

      {/* Índice alfabético */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Índice
          </span>
          {letras.map((l) => (
            <a
              key={l}
              href={`#letra-${l}`}
              className="font-display text-lg text-foreground/80 transition-colors hover:text-[var(--accent-ink)]"
            >
              {l}
            </a>
          ))}
        </div>
      </nav>

      {/* Lista editorial */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <ul className="border-t border-border/60">
          {termos.map((t) => {
            const letra = t.termo[0].toUpperCase();
            const id = slugify(t.termo);
            return (
              <li
                key={t.termo}
                id={id}
                className="group border-b border-border/60 transition-colors hover:bg-[var(--accent-ink-soft)]/40"
              >
                <a
                  id={`letra-${letra}`}
                  className="grid gap-4 px-2 py-10 md:grid-cols-12 md:gap-8"
                  href={`#${id}`}
                >
                  <div className="md:col-span-2">
                    <span className="font-display text-2xl text-[var(--accent-ink)]">
                      {letra}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h2 className="font-display text-2xl leading-tight">{t.termo}</h2>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-base leading-relaxed text-foreground/85">
                      {t.def}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Relacionado */}
      <section className="border-y border-border bg-[var(--accent-ink-soft)]/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--accent-ink)]" />
            <p className="eyebrow">Relacionado</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <Link
              to="/jornadas"
              className="group md:col-span-5 border border-border bg-background p-8 transition-colors hover:border-[var(--accent-ink)]"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Por situação
              </p>
              <h3 className="mt-3 font-display text-2xl leading-tight">
                Comece por uma jornada
              </h3>
              <p className="mt-3 text-sm text-foreground/80">
                Caminhos guiados por cenário: aposentar morando fora, prova de vida,
                deslocamento temporário e mais.
              </p>
              <span className="mt-6 inline-block text-sm text-[var(--accent-ink)] group-hover:underline">
                Ver jornadas →
              </span>
            </Link>

            <Link
              to="/guias"
              className="group md:col-span-4 border-l-2 border-[var(--accent-ink)] bg-background p-8 transition-colors hover:bg-[var(--accent-ink-soft)]/30"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Biblioteca
              </p>
              <h3 className="mt-3 font-display text-2xl leading-tight">
                Guias práticos
              </h3>
              <p className="mt-3 text-sm text-foreground/80">
                Passo a passo dos procedimentos: documentos, formulários, prazos.
              </p>
              <span className="mt-6 inline-block text-sm text-[var(--accent-ink)] group-hover:underline">
                Abrir guias →
              </span>
            </Link>

            <Link
              to="/calculadora"
              className="group md:col-span-3 bg-foreground p-8 text-background transition-colors hover:text-[var(--accent-ink-soft)]"
            >
              <p className="text-xs uppercase tracking-wider opacity-60">Ferramenta</p>
              <h3 className="mt-3 font-display text-2xl leading-tight">
                Calculadora de totalização
              </h3>
              <span className="mt-6 inline-block text-sm underline underline-offset-4">
                Calcular →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CTAMarcos
        variant="block"
        contexto="Um termo confuso no seu caso concreto? O Dr. Marcos Espínola traduz a teoria para a sua situação."
      />
    </article>
  );
}
