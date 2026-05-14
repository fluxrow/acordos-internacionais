import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { acordos, getAcordo } from "@/data/acordos";
import { CTAMarcos } from "@/components/cta-marcos";
import { ProContentLock } from "@/components/pro-content-lock";

export const Route = createFileRoute("/acordos/$pais")({
  head: ({ params }) => {
    const a = getAcordo(params.pais);
    if (!a) {
      return {
        meta: [{ title: "País não encontrado | Acordos Internacionais" }],
      };
    }
    const title = `Acordo de Previdência Brasil – ${a.nome}`;
    const desc = a.conteudo?.destaque ?? a.resumo;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(a.iso
          ? [{ property: "og:image", content: `https://flagcdn.com/w640/${a.iso}.png` }]
          : []),
      ],
    };
  },
  loader: ({ params }) => {
    const a = getAcordo(params.pais);
    if (!a) throw notFound();
    return { acordo: a };
  },
  component: AcordoPais,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-4 font-display text-4xl">País não encontrado</h1>
      <Link to="/acordos" className="mt-6 inline-block underline underline-offset-4">
        Ver todos os países →
      </Link>
    </div>
  ),
});

function AcordoPais() {
  const { acordo: a } = Route.useLoaderData();

  // Próximos países (navegação contextual)
  const idx = acordos.findIndex((x) => x.slug === a.slug);
  const prev = idx > 0 ? acordos[idx - 1] : null;
  const next = idx < acordos.length - 1 ? acordos[idx + 1] : null;

  const tipoLabel = a.tipo === "bilateral" ? "Acordo Bilateral" : "Acordo Multilateral";

  return (
    <>
      <article>
        {/* HERO PAÍS */}
        <header className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_auto] md:py-20">
            <div>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/acordos" className="hover:underline underline-offset-4">
                  Países
                </Link>
                <span aria-hidden>/</span>
                <span>{a.nome}</span>
              </nav>
              <p className="eyebrow mt-6">
                {tipoLabel}
                {a.vigencia && ` · vigente desde ${a.vigencia}`}
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-7xl">{a.nome}</h1>
              <p className="lede mt-6 max-w-2xl">
                {a.conteudo?.destaque ?? a.resumo}
              </p>

              {a.status !== "vigente" && (
                <p className="mt-6 inline-block border border-foreground px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]">
                  {a.status === "ratificacao"
                    ? "Acordo assinado · em ratificação"
                    : "Documentação em organização"}
                </p>
              )}
            </div>
            {a.iso && (
              <div className="md:self-end">
                <img
                  src={`https://flagcdn.com/w320/${a.iso}.png`}
                  alt={`Bandeira de ${a.nome}`}
                  width={240}
                  height={160}
                  className="h-auto w-[200px] border border-border md:w-[260px]"
                />
              </div>
            )}
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px] md:py-20">
          <div className="space-y-12">
            {a.conteudo ? (
              <>
                <Bloco titulo="Quais benefícios o acordo cobre">
                  <ul className="mt-2 space-y-1">
                    {a.conteudo.beneficios.map((b: string) => (
                      <li key={b} className="border-b border-border py-3 text-base">
                        {b}
                      </li>
                    ))}
                  </ul>
                </Bloco>

                <Bloco titulo="Como funciona a totalização">
                  <p className="text-lg leading-relaxed">{a.conteudo.totalizacao}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Veja em detalhe no guia{" "}
                    <Link
                      to="/guias/$slug"
                      params={{ slug: "totalizacao" }}
                      className="ink-link"
                    >
                      Totalização de períodos contributivos
                    </Link>
                    .
                  </p>
                </Bloco>

                {a.conteudo.curiosidade && (
                  <aside className="border-l-2 border-foreground bg-secondary p-6">
                    <p className="eyebrow">Para o registro</p>
                    <p className="mt-3 font-display text-xl leading-snug italic">
                      {a.conteudo.curiosidade}
                    </p>
                  </aside>
                )}

                <Bloco titulo="Quando procurar um advogado">
                  <p className="text-lg leading-relaxed">
                    Indeferimentos, atrasos no protocolo internacional, erro
                    no cálculo prorata, totalização negada por documentação
                    estrangeira — situações em que orientação jurídica
                    especializada faz diferença direta no benefício final.
                  </p>
                  <p className="mt-4 text-base text-muted-foreground">
                    O Dr. Marcos atende casos ligados ao acordo Brasil–{a.nome}.
                  </p>
                </Bloco>

                <ProContentLock
                  contexto={`Ficha técnica completa · ${a.nome}`}
                  itens={[
                    `Texto integral do acordo Brasil–${a.nome} e do decreto de promulgação`,
                    "Portarias do INSS aplicáveis, comentadas",
                    "Documentos e formulários oficiais exigidos",
                    "Modelos de petição e requerimento editáveis",
                    "Calculadora de totalização específica",
                    "Fluxograma processual passo a passo",
                    "Jurisprudência relevante consolidada",
                  ]}
                />
              </>
            ) : (
              <Bloco titulo="Sobre este acordo">
                <p className="text-lg leading-relaxed">{a.resumo}</p>
                <p className="mt-6 text-base text-muted-foreground">
                  A versão pública desta página será expandida em breve. Se
                  você precisa de orientação imediata sobre um caso ligado a{" "}
                  {a.nome}, fale com o Dr. Marcos.
                </p>
                <div className="mt-8">
                  <ProContentLock contexto={`Ficha técnica · ${a.nome}`} />
                </div>
              </Bloco>
            )}
          </div>

          <aside className="space-y-6 md:sticky md:top-6 md:self-start">
            <CTAMarcos
              contexto={`Tem um caso ligado ao acordo Brasil–${a.nome}? Fale com o Dr. Marcos.`}
            />
            <div className="border border-border p-6">
              <p className="eyebrow">Próximos passos</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: "moro-fora" }}
                    className="ink-link"
                  >
                    Já moro no exterior →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: "estou-voltando" }}
                    className="ink-link"
                  >
                    Estou voltando ao Brasil →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guias/$slug"
                    params={{ slug: "prova-de-vida-no-exterior" }}
                    className="ink-link"
                  >
                    Prova de vida no exterior →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </article>

      {/* NAV ENTRE PAÍSES */}
      <nav className="border-y border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border">
          <Link
            to={prev ? "/acordos/$pais" : "/acordos"}
            params={prev ? { pais: prev.slug } : undefined}
            className="bg-background px-6 py-8 transition-colors hover:bg-secondary"
          >
            <p className="eyebrow">← Anterior</p>
            <p className="mt-2 font-display text-lg">{prev ? prev.nome : "Todos os países"}</p>
          </Link>
          <Link
            to={next ? "/acordos/$pais" : "/acordos"}
            params={next ? { pais: next.slug } : undefined}
            className="bg-background px-6 py-8 text-right transition-colors hover:bg-secondary"
          >
            <p className="eyebrow">Próximo →</p>
            <p className="mt-2 font-display text-lg">{next ? next.nome : "Todos os países"}</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl">{titulo}</h2>
      <hr className="rule mt-3" />
      <div className="mt-4">{children}</div>
    </section>
  );
}
