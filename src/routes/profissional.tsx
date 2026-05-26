import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { totalAcordos, totalDocs } from "@/data/acordos";
import { CTAButton } from "@/components/cta-button";
import { getFoundersCount, FOUNDERS_LIMIT } from "@/lib/founders.functions";

const TITLE = "Hub Profissional para advogados | Acordos Internacionais";
const DESC =
  "Base técnica completa sobre acordos internacionais de previdência social: portarias comentadas, modelos, jurisprudência, calculadoras e fluxogramas. Plano anual ou vitalício para os 100 primeiros.";

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
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
            Hub profissional · Para advogados previdenciaristas
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            Hub Profissional em Direito Previdenciário Internacional:
            Educação, Eficiência e Excelência.
          </h1>
          <p className="mt-8 max-w-2xl text-lg opacity-80">
            Base técnica completa, sem juridiquês: textos integrais dos acordos
            internacionais comentados, portarias estruturadas por tema,
            jurisprudência organizada, calculadoras de totalização e benefícios
            previdenciários, certificados (saída fiscal, deslocamento
            temporário, prorrogação). Tudo integrado para economizar tempo e
            fundamentar suas estratégias em lei.
          </p>
          <p className="mt-4 max-w-2xl text-sm italic opacity-75">
            O fundamento técnico que você merece. A eficiência que você precisa.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton href="#planos" variant="solid-light" size="lg" label="Ver planos" />
            <span className="text-xs uppercase tracking-[0.14em] opacity-70">
              Anual ou vitalício · {foundersRemaining} de {FOUNDERS_LIMIT} vagas Fundadores
            </span>
          </div>
        </div>
      </header>

      {/* O QUE TEM */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">O que está dentro</p>
          <h2 className="mt-3 font-display text-4xl">Para o trabalho do dia a dia.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {[
              ["Fichas-país completas", `Os ${totalAcordos} acordos com base legal, formulários, particularidades e jurisprudência relevante.`],
              ["Acordos comentados", "Texto integral de cada acordo internacional com comentários artigo a artigo."],
              ["Portarias por tema", "Atos do INSS sobre acordos internacionais, estruturados por tema."],
              ["Jurisprudência organizada", "Decisões selecionadas por país, tipo de benefício e ponto controvertido."],
              ["Calculadoras", "Totalização, conversão de tempo e cálculo prorata."],
              ["Certificados", "Saída fiscal, deslocamento temporário, prorrogação — modelos e fluxos."],
              ["Fluxogramas", "CDT, totalização, prova de vida: passo a passo visual."],
              [`+${totalDocs} documentos`, "Tudo organizado, buscável e atualizado quando há mudança regulatória."],
            ].map(([t, d]) => (
              <li key={t} className="bg-background p-8">
                <h3 className="font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Modelos de petição: funcionalidade suspensa por hora — retorna em
            versão futura.
          </p>
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
              <hr className="my-6 border-background/20" />
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
      <section>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="eyebrow">Dúvidas antes de assinar?</p>
          <h2 className="mt-3 font-display text-4xl">
            Fale diretamente com o Dr. Marcos Espínola.
          </h2>
          <p className="lede mt-6">
            Cada mensagem é lida pessoalmente. Sem formulário automático.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CTAButton to="/contato" variant="dark" size="lg" label="Iniciar contato" />
            <Link
              to="/sobre/dr-marcos"
              className="text-sm underline underline-offset-4 hover:text-destructive"
            >
              Conhecer o Dr. Marcos Espínola →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
