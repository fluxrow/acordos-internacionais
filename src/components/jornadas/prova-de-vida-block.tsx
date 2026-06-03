interface ProvaDeVidaModalidade {
  numero: string;
  titulo: string;
  recomendado?: boolean;
  pros: string[];
  contras?: string[];
  passos: string[];
  links?: { label: string; href: string }[];
  requisitos?: string;
}

const MODALIDADES: ProvaDeVidaModalidade[] = [
  {
    numero: "1",
    titulo: "Presencial no consulado brasileiro",
    recomendado: true,
    pros: ["Mais simples e direto", "Biometria facial realizada no ato"],
    passos: [
      "Dirigir-se ao consulado ou embaixada brasileira",
      "Apresentar documento de identidade",
      "Realizar biometria facial",
    ],
    links: [
      {
        label: "Encontre o consulado mais próximo",
        href: "https://www.gov.br/mre/pt-br/assuntos/Embaixadas-Consulados-Missoes/do-brasil-no-exterior",
      },
    ],
  },
  {
    numero: "2",
    titulo: "Biometria facial online (Gov.br)",
    pros: ["Feito do conforto de casa", "Resultado imediato"],
    contras: ["Requer conta Gov.br Nível Prata ou Ouro"],
    passos: [
      "Acessar o Meu INSS",
      "Fazer login com Gov.br (Prata ou Ouro)",
      "Realizar biometria facial pelo app ou site",
    ],
    links: [
      { label: "Acessar Meu INSS", href: "https://meu.inss.gov.br/#/login" },
      { label: "Criar / elevar conta Gov.br", href: "https://www.gov.br/" },
    ],
  },
  {
    numero: "3",
    titulo: "Notário público com Apostilamento de Haia",
    pros: ["Para quem mora longe de consulado", "Válido internacionalmente"],
    contras: ["Processo mais longo (4 a 6 semanas)"],
    passos: [
      "Baixar o formulário Atestado de Vida",
      "Comparecer presencialmente ao notário público",
      "Assinar o formulário ante notário e reconhecer firma",
      "Solicitar o Apostilamento de Haia (validade internacional)",
      "Enviar o documento original apostilado para o INSS em Brasília",
    ],
    links: [
      {
        label: "Baixar formulário Atestado de Vida (INSS)",
        href: "https://www.gov.br/inss/pt-br/direitos-e-deveres/acordos-internacionais/comprovacao-de-vida-para-beneficiarios-que-moram-no-exterior",
      },
      {
        label: "Ver países signatários da Haia",
        href: "https://www.hcch.net/pt/states/hcch-members",
      },
    ],
  },
  {
    numero: "4",
    titulo: "Via procurador no Brasil",
    pros: ["Se você não puder fazer sozinho", "Obrigatório em países sem acordo"],
    passos: [
      "Nomear um procurador legal no Brasil",
      "O procurador comparece à agência do INSS presencialmente",
      "Realiza a prova de vida em seu nome",
      "Procurador fica responsável por receber e repassar o benefício",
    ],
    requisitos: "Válido apenas em países sem acordo internacional.",
  },
  {
    numero: "5",
    titulo: "Comunicação digital automática",
    pros: ["Sem ação necessária em alguns casos"],
    contras: ["Requer Gov.br Nível Ouro e dados já registrados"],
    passos: [
      "O INSS faz verificação automática cruzando: acessos em Gov.br, biometria já registrada, movimentações bancárias",
      "Alguns beneficiários cumprem o requisito automaticamente",
    ],
  },
];

export function ProvaDeVidaBlock() {
  return (
    <section className="border-y border-[var(--accent-ink)]/30 bg-secondary/30">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <p className="eyebrow">Prova de vida no exterior</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          Prova de vida — como comprovar que está vivo
        </h2>

        {/* Quadro objetivo (5 itens) */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: "Quando", d: "A cada 12 meses, a partir da última prova ou do aniversário." },
            { t: "Como", d: "Consulado, biometria Gov.br, notário + Apostila de Haia ou procurador." },
            { t: "Validade", d: "Atestado de vida assinado vale 90 dias até chegar ao INSS." },
            { t: "Nunca", d: "Não enviar atestado por e-mail. INSS exige documento original." },
            { t: "Risco", d: "Atraso bloqueia o benefício; persistência leva à suspensão." },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                {f.t}
              </p>
              <p className="mt-1.5 text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-5">
          {MODALIDADES.map((m) => (
            <article
              key={m.numero}
              className="rounded-2xl border border-border bg-background p-6 md:p-8"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl text-[var(--accent-ink)]">
                  {m.numero}
                </span>
                <h3 className="font-display text-xl md:text-2xl">{m.titulo}</h3>
                {m.recomendado && (
                  <span className="rounded-full bg-[var(--accent-ink)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-background">
                    Recomendado
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {m.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="text-[var(--accent-ink)]">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
                {m.contras?.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span aria-hidden className="text-destructive">
                      ⚠
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Como fazer
              </p>
              <ol className="mt-2 space-y-1.5 text-sm">
                {m.passos.map((p, i) => (
                  <li key={p} className="flex gap-3">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>

              {m.requisitos && (
                <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {m.requisitos}
                </p>
              )}

              {m.links && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {m.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-[var(--accent-ink)]"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-left font-medium">Modalidade</th>
                <th className="px-4 py-3 text-left font-medium">Tempo</th>
                <th className="px-4 py-3 text-left font-medium">Facilidade</th>
                <th className="px-4 py-3 text-left font-medium">Requisitos</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Consulado", "1 dia", "★★★", "Nenhum"],
                ["Biometria online", "5 min", "★★★★", "Gov.br Prata/Ouro"],
                ["Notário + Haia", "4–6 sem", "★★", "Notário local"],
                ["Procurador", "7 dias", "★★", "Procurador no Brasil"],
                ["Digital automática", "0 dias", "★★★★", "Gov.br Ouro"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border/40 last:border-0">
                  {row.map((c, i) => (
                    <td key={i} className="px-4 py-2.5 align-top">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
