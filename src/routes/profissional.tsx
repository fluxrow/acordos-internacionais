import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { totalAcordos, totalDocs } from "@/data/acordos";
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
            {totalAcordos}+ países · portarias estruturadas · jurisprudência selecionada · calculadoras de totalização · certificados (CDT, CSDP, prorrogação) — tudo num só lugar.
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
              className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-destructive"
            >
              Conhecer o Dr. Marcos →
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section
        className="relative border-b border-border bg-card text-card-foreground border border-border"
        style={{
          backgroundImage: `linear-gradient(color-mix(in oklab, var(--foreground) 86%, transparent), color-mix(in oklab, var(--foreground) 86%, transparent)), url(${imgMap})`,
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
              [`${totalAcordos}+`, "Países cobertos"],
              [`${totalDocs}`, "Documentos organizados"],
              ["Integral", "Texto comentado artigo a artigo"],
              ["Contínua", "Atualização regulatória"],
            ].map(([n, l]) => (
              <div key={l} className="bg-foreground p-8">
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
              ["Consulte fichas-país completas", `Os ${totalAcordos} acordos com base legal, formulários, particularidades e jurisprudência relevante.`],
              ["Leia acordos comentados", "Texto integral de cada acordo internacional comentado artigo a artigo."],
              ["Acesse portarias por tema", "Atos do INSS sobre acordos internacionais, estruturados por tema."],
              ["Pesquise jurisprudência organizada", "Decisões selecionadas por país, tipo de benefício e ponto controvertido."],
              ["Calcule totalização e prorata", "Totalização, conversão de tempo e cálculo prorata em segundos."],
              ["Baixe modelos de certificado", "Saída fiscal, deslocamento temporário, prorrogação — modelos e fluxos."],
              ["Siga fluxogramas de procedimento", "CDT, totalização, prova de vida: passo a passo visual."],
              [`Tenha +${totalDocs} documentos à mão`, "Organizado, buscável e atualizado quando há mudança regulatória."],
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
      <section id="planos" className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Planos</p>
            <h2 className="mt-3 font-display text-4xl">
              Anual para quem trabalha. Vitalício para os 100 primeiros.
            </h2>
            <p className="lede mt-6 text-base">
              Dois caminhos para entrar no Hub. Conteúdo idêntico — muda só a forma de pagar.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* PLANO ANUAL */}
            <div className="flex flex-col border border-border bg-background p-8">
              <p className="eyebrow">Anual</p>
              <p className="mt-3 font-display text-6xl tracking-tight">R$ 797</p>
              <p className="mt-1 text-sm text-muted-foreground">
                /ano · equivale a R$ 66,40/mês
              </p>
              <hr className="rule my-6" />
              <ul className="flex-1 space-y-2 text-sm">
                <li>· Acesso completo ao Hub por 12 meses</li>
                <li>· Atualizações regulatórias incluídas</li>
                <li>· Newsletter interna do Dr. Marcos Espínola</li>
                <li>· Renovação opcional ao fim do período</li>
              </ul>
              <Link
                to="/precos"
                hash="anual"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-foreground bg-background px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Assinar anual
              </Link>
            </div>

            {/* PLANO FUNDADORES */}
            <div className="flex flex-col border border-foreground bg-foreground p-8 text-background">
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                Fundadores · primeiros 100
              </p>
              <p className="mt-3 font-display text-6xl tracking-tight">R$ 1.297</p>
              <p className="mt-1 text-sm opacity-80">
                Pagamento único · acesso vitalício
              </p>
              <hr className="my-6 border-border" />
              <ul className="flex-1 space-y-2 text-sm">
                <li>· Acesso vitalício a todo o conteúdo</li>
                <li>· Todas as atualizações futuras incluídas</li>
                <li>· Newsletter interna do Dr. Marcos Espínola</li>
                <li>· Comunidade fechada (em breve)</li>
                <li className="pt-2 text-xs opacity-70">
                  {foundersFull
                    ? `Esgotado — todas as ${FOUNDERS_LIMIT} vagas preenchidas`
                    : `${foundersRemaining} de ${FOUNDERS_LIMIT} vagas restantes`}
                </li>
              </ul>
              {foundersFull ? (
                <span className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-background/20 px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] opacity-70">
                  Vagas esgotadas
                </span>
              ) : (
                <Link
                  to="/precos"
                  hash="fundadores"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-background/85"
                >
                  Garantir vaga vitalícia
                </Link>
              )}
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Pagamento processado com segurança. Você precisa de uma conta para
            finalizar — <Link to="/cadastro" className="underline">criar conta</Link>{" "}
            ou <Link to="/login" className="underline">entrar</Link>.
          </p>
        </div>
      </section>

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
