import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { totalAcordos, totalDocs } from "@/data/acordos";
import { CTAButton } from "@/components/cta-button";
import { getFoundersCount, FOUNDERS_LIMIT } from "@/lib/founders.functions";

export const Route = createFileRoute("/preview/profissional")({
  head: () => ({
    meta: [
      {
        title: "Pré-visualização · Hub Profissional (sem petições) | Briefing Dr. Marcos",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewProfissional,
});

function PreviewProfissional() {
  const { data: founders } = useQuery({
    queryKey: ["founders-count"],
    queryFn: () => getFoundersCount(),
    refetchInterval: 60_000,
  });

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
              {foundersRemaining} de {FOUNDERS_LIMIT} vagas Fundadores
            </span>
          </div>
        </div>
      </header>

      {/* O QUE TEM — sem "modelos de petição" */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow">O que está dentro</p>
          <h2 className="mt-3 font-display text-4xl">Para o trabalho do dia a dia.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {[
              [
                "Fichas-país completas",
                `Os ${totalAcordos} acordos com base legal, formulários, particularidades e jurisprudência relevante.`,
              ],
              [
                "Acordos comentados",
                "Texto integral de cada acordo internacional com comentários artigo a artigo.",
              ],
              [
                "Portarias por tema",
                "Atos do INSS sobre acordos internacionais, estruturados por tema.",
              ],
              [
                "Jurisprudência organizada",
                "Decisões selecionadas por país, tipo de benefício e ponto controvertido.",
              ],
              [
                "Calculadoras",
                "Totalização, conversão de tempo e cálculo prorata.",
              ],
              [
                "Certificados",
                "Saída fiscal, deslocamento temporário, prorrogação — modelos e fluxos.",
              ],
              [
                "Fluxogramas",
                "CDT, totalização, prova de vida: passo a passo visual.",
              ],
              [
                `+${totalDocs} documentos`,
                "Tudo organizado, buscável e atualizado quando há mudança regulatória.",
              ],
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

      {/* CTA FINAL */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="eyebrow">Dúvidas antes de assinar?</p>
          <h2 className="mt-3 font-display text-4xl">
            Fale diretamente com o Dr. Marcos Espínola.
          </h2>
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
