import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Comunicação de Saída Definitiva do País — Guia completo";
const DESC =
  "Saída fiscal do Brasil: o que é a CSDP, diferença para a DSDP, riscos de não regularizar, FAQ e fontes oficiais da Receita Federal.";
const CANONICAL =
  "https://acordosinternacionais.com/guias/saida-definitiva-do-pais";

const PARA_QUE_SERVE = [
  "Evitar permanência indevida como residente fiscal no Brasil.",
  "Reduzir risco de bitributação sobre rendimentos recebidos no exterior.",
  "Definir corretamente a tributação de rendimentos de fonte brasileira.",
  "Evitar omissões em declaração de imposto de renda.",
  "Regularizar a situação perante a Receita Federal.",
  "Dar segurança a planejamentos previdenciários, patrimoniais e internacionais.",
  "Evitar inconsistências com bancos, corretoras e fontes pagadoras.",
  "Organizar quem saiu há anos e nunca formalizou a saída fiscal.",
];

const RISCOS = [
  "Bitributação.",
  "Multa por atraso.",
  "CPF com pendência por omissão de declaração.",
  "Rendimentos no exterior tratados como omitidos.",
  "Retenção incorreta sobre rendimentos de fonte brasileira.",
  "Problemas com bancos, corretoras e fontes pagadoras.",
  "Dificuldade de regularização retroativa.",
  "Inconsistência entre situação fiscal, previdenciária e migratória.",
  "Risco de passivo fiscal acumulado.",
  "Dificuldade na comprovação da condição de não residente.",
];

const FAQ = [
  {
    q: "Fazer saída definitiva cancela meu CPF?",
    a: "Não. A saída definitiva comunica a condição de não residente fiscal. Ela não cancela automaticamente o CPF.",
  },
  {
    q: "Posso voltar ao Brasil depois de fazer saída definitiva?",
    a: "Sim. Se a pessoa retornar com ânimo definitivo, a residência fiscal será reavaliada a partir do retorno.",
  },
  {
    q: "A saída definitiva acaba com meus direitos no INSS?",
    a: "Não automaticamente. A análise previdenciária é separada da fiscal e depende da categoria de segurado, contribuições, país de residência e eventual acordo internacional.",
  },
  {
    q: "Saída definitiva é a mesma coisa que perder residência migratória?",
    a: "Não. Saída definitiva é fiscal. Não é perda de nacionalidade, não é expulsão, não é impedimento de retorno.",
  },
  {
    q: "Quem saiu temporariamente também precisa fazer?",
    a: "Depende. Se permaneceu fora por 12 meses consecutivos, pode passar à condição de não residente fiscal a partir do dia seguinte ao 12º mês de ausência.",
  },
];

const FONTES_OFICIAIS = [
  {
    label: "Comunicação de Saída Definitiva — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/declaracoes/comunicacao-de-saida-definitiva-do-pais",
  },
  {
    label: "Declaração de Saída Definitiva (DSDP)",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/declaracoes/declaracao-de-saida-definitiva-do-pais-dsdp",
  },
  {
    label: "Residente e Não Residente — Receita Federal",
    href: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/mais-informacoes/residencia-fiscal",
  },
];

export const Route = createFileRoute("/guias/saida-definitiva-do-pais")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Acordos Internacionais` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: SaidaFiscalPage,
});

function SaidaFiscalPage() {
  return (
    <article>
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_30%,_var(--accent-ink-soft)_0%,_transparent_55%)] opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-20">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:underline underline-offset-4">
              Início
            </Link>
            <span aria-hidden> / </span>
            <Link to="/guias" className="hover:underline underline-offset-4">
              Guias
            </Link>
            <span aria-hidden> / </span>
            <span>Saída Fiscal</span>
          </nav>
          <p className="eyebrow mt-6">Guia temático · Saída fiscal</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">
            Comunicação de Saída Definitiva do País
          </h1>
          <p className="lede mt-6 max-w-2xl">
            A saída definitiva é, antes de tudo, uma regularização fiscal
            perante a Receita Federal. Ela informa que o brasileiro deixou de
            ser residente fiscal no Brasil — sem impedir que ele retorne
            quando quiser.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/contato"
              className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
            >
              Falar com especialista
            </Link>
            <a
              href="#quando-fazer"
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Entender quando devo fazer
            </a>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-[var(--accent-ink-soft)]/40">
        <div className="mx-auto max-w-4xl px-6 py-8 md:py-10">
          <p className="text-base font-medium leading-relaxed">
            Apesar do nome <em className="not-italic font-semibold">"definitiva"</em>,
            a saída definitiva é uma saída <strong>fiscal</strong>. Ela não
            impede que a pessoa volte ao Brasil, não cancela a nacionalidade e
            não significa que a pessoa nunca mais poderá residir aqui.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20 space-y-16">
        <section>
          <p className="eyebrow">01</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">
            O que é a Comunicação de Saída Definitiva do País
          </h2>
          <p className="mt-4 text-muted-foreground">
            É o procedimento pelo qual a pessoa física informa à Receita
            Federal que saiu do Brasil em caráter permanente, ou que passou à
            condição de não residente fiscal. Trata-se de uma definição de
            residência fiscal — não de perda de nacionalidade nem de
            cancelamento de CPF.
          </p>
        </section>

        <section>
          <p className="eyebrow">02</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">
            Para que serve a Saída Fiscal
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PARA_QUE_SERVE.map((item, i) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-background p-5"
              >
                <p className="font-display text-2xl text-[var(--accent-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="quando-fazer">
          <p className="eyebrow">03</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">
            Comunicação de Saída × Declaração de Saída
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-5 py-3 text-left font-medium">CSDP</th>
                  <th className="px-5 py-3 text-left font-medium border-l border-border">
                    DSDP
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  [
                    "Comunicação inicial da saída.",
                    "Declaração de imposto de renda da saída.",
                  ],
                  [
                    "Informa à Receita a data da saída do Brasil.",
                    "Entregue no ano seguinte ao da saída, no prazo da DAA.",
                  ],
                  [
                    "Indica fontes pagadoras no Brasil, quando houver.",
                    "Informa rendimentos, bens e dívidas do período de residência.",
                  ],
                  [
                    "Até o último dia de fevereiro do ano-calendário seguinte.",
                    "Eventual imposto apurado é pago em quota única.",
                  ],
                ].map(([csdp, dsdp], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3 align-top">{csdp}</td>
                    <td className="px-5 py-3 align-top border-l border-border/50">
                      {dsdp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <p className="eyebrow">04</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">
            Riscos de não regularizar
          </h2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {RISCOS.map((r) => (
              <li
                key={r}
                className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
              >
                <span aria-hidden className="text-destructive">
                  ✗
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="eyebrow">05</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-6 divide-y divide-border border border-border rounded-xl">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-medium">
                  <span className="mr-2 text-[var(--accent-ink)] group-open:rotate-90 inline-block transition-transform">
                    ›
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow">Fontes oficiais</p>
          <ul className="mt-4 space-y-2 text-sm">
            {FONTES_OFICIAIS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-[var(--accent-ink)]"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
