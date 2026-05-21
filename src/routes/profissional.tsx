import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { totalAcordos, totalDocs } from "@/data/acordos";

const TITLE = "Hub profissional para advogados | Acordos Internacionais";
const DESC =
  "Base técnica completa sobre acordos internacionais de previdência social: portarias comentadas, modelos, jurisprudência, calculadoras e fluxogramas. Acesso vitalício.";

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
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <article>
      {/* HERO */}
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
            Hub profissional · Para advogados previdenciaristas
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            A base técnica que faltava em previdência internacional.
          </h1>
          <p className="mt-8 max-w-2xl text-lg opacity-80">
            Portarias comentadas, modelos de petição e requerimentos,
            jurisprudência por tema, calculadoras de totalização, fluxogramas
            de procedimento, organizados pelos {totalAcordos} países
            acordantes do Brasil.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton href="#waitlist" variant="solid-light" size="lg" label="Entrar na lista de espera" />
            <span className="text-xs uppercase tracking-[0.14em] opacity-70">
              Pagamento único · Acesso vitalício
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
              ["Fichas-país completas", `Os ${totalAcordos} acordos com base legal, formulários, particularidades, jurisprudência relevante.`],
              ["Portarias comentadas", "Atos do INSS sobre acordos internacionais, explicados por tema."],
              ["Modelos de petição", "Petições iniciais, requerimentos administrativos e recursos editáveis."],
              ["Calculadoras", "Totalização, conversão de tempo, cálculo prorata."],
              ["Fluxogramas de procedimento", "CDT, totalização, prova de vida: passo a passo visual."],
              [`+${totalDocs} documentos`, "Tudo organizado, buscável e atualizado quando há mudança regulatória."],
            ].map(([t, d]) => (
              <li key={t} className="bg-background p-8">
                <h3 className="font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PREÇO */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Preço</p>
            <h2 className="mt-3 font-display text-4xl">Pagamento único, acesso vitalício.</h2>
            <p className="lede mt-6 text-base">
              Sem mensalidade. Sem renovação. Compre uma vez e tenha acesso
              para sempre, incluindo as atualizações que vierem.
            </p>
          </div>
          <div className="border border-foreground bg-background p-8">
            <p className="eyebrow">Early bird · primeiros 100</p>
            <p className="mt-3 font-display text-6xl tracking-tight">R$ 1.297</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Depois: R$ 1.997 · pagamento único
            </p>
            <hr className="rule my-6" />
            <ul className="space-y-2 text-sm">
              <li>· Acesso vitalício a todo o conteúdo</li>
              <li>· Atualizações regulatórias incluídas</li>
              <li>· Newsletter interna do Dr. Marcos Espínola</li>
              <li>· Comunidade fechada (em breve)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="eyebrow">Disponível em breve</p>
          <h2 className="mt-3 font-display text-4xl">
            Entre na lista de espera.
          </h2>
          <p className="lede mt-6">
            Receba o aviso quando o checkout abrir e garanta a vaga no early bird.
          </p>

          {!enviado ? (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 border-0 border-b border-foreground bg-transparent py-3 text-center text-base focus:outline-none sm:text-left"
              />
              <button
                type="submit"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
              >
                Quero ser avisado
              </button>
            </form>
          ) : (
            <p className="mt-10 inline-block border border-foreground px-6 py-4 text-sm">
              Pronto, {email}. Você será avisado.
            </p>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Lista de espera local, em breve integrada ao Lovable Cloud para
            disparo automático.
          </p>

          <Link
            to="/sobre/dr-marcos"
            className="mt-12 inline-block underline underline-offset-4 hover:text-destructive"
          >
            Conhecer o Dr. Marcos Espínola →
          </Link>
        </div>
      </section>
    </article>
  );
}
