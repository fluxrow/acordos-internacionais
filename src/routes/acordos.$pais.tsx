import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { acordos, getAcordo } from "@/data/acordos";
import type { DocumentoImportado, OrgaoLigacao } from "@/data/acordos.types";
import { CTAMarcos } from "@/components/cta-marcos";
import { ProContentLock } from "@/components/pro-content-lock";
import { Highlight } from "@/lib/highlight";

export const Route = createFileRoute("/acordos/$pais")({
  head: ({ params }) => {
    const a = getAcordo(params.pais);
    if (!a) {
      return {
        meta: [{ title: "País não encontrado | Acordos Internacionais" }],
      };
    }
    const title = `Acordo de Previdência Brasil–${a.nome} | Acordos Internacionais`;
    const desc = a.conteudo?.destaque ?? a.resumo;
    const url = `https://acordosinternacionais.lovable.app/acordos/${a.slug}`;
    const ogImage = `https://acordosinternacionais.lovable.app/og/${a.slug}.jpg?v=3`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: `Acordo de Previdência Brasil–${a.nome}` },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: title,
                description: desc,
                inLanguage: "pt-BR",
                image: ogImage,
                mainEntityOfPage: url,
                url,
                about: `Acordo internacional de previdência social entre Brasil e ${a.nome}`,
                isPartOf: { "@id": "https://acordosinternacionais.lovable.app/#website" },
                publisher: { "@id": "https://acordosinternacionais.lovable.app/#organization" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Início",
                    item: "https://acordosinternacionais.lovable.app/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Países",
                    item: "https://acordosinternacionais.lovable.app/acordos",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: a.nome,
                    item: url,
                  },
                ],
              },
            ],
          }),
        },
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
        <header className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_28%,_var(--accent-ink-soft)_0%,_transparent_52%),radial-gradient(ellipse_at_92%_85%,_var(--accent-ink-soft)_0%,_transparent_45%)] opacity-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-ink)]/30 to-transparent"
          />
          
          <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-20">
            <div>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link
                  to="/acordos"
                  className="hover:text-[var(--accent-ink)] hover:underline underline-offset-4"
                >
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
                <p className="mt-6 inline-block rounded-full border border-[var(--accent-ink)] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                  {a.status === "ratificacao"
                    ? "Acordo assinado · em ratificação"
                    : "Documentação em organização"}
                </p>
              )}
            </div>
            {a.iso && (
              <div className="md:self-end">
                <div className="flex aspect-[3/2] w-[200px] items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background/70 shadow-[0_8px_24px_-12px_rgba(122,31,31,0.18)] backdrop-blur-sm md:w-[260px]">
                  <img
                    src={`https://flagcdn.com/w320/${a.iso}.png`}
                    alt={`Bandeira de ${a.nome}`}
                    width={260}
                    height={173}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px] md:py-20">
          <div className="space-y-14">
            {/* INSTRUMENTO E DECRETO (público) */}
            {a.importado && (a.importado.decreto || a.importado.vigorDesde || a.importado.instrumento) && (
              <Bloco titulo="Instrumento e vigência">
                <dl className="grid gap-4 sm:grid-cols-3">
                  {a.importado.instrumento && (
                    <FichaItem rotulo="Instrumento" valor={a.importado.instrumento} />
                  )}
                  {a.importado.decreto && (
                    <FichaItem rotulo="Decreto de promulgação" valor={a.importado.decreto} />
                  )}
                  {a.importado.vigorDesde && (
                    <FichaItem rotulo="Em vigor desde" valor={a.importado.vigorDesde} />
                  )}
                </dl>
              </Bloco>
            )}

            {/* ÓRGÃOS DE LIGAÇÃO (público) */}
            {a.importado && (a.importado.orgaoBR || a.importado.orgaoParceiro) && (
              <Bloco titulo="Órgãos de ligação">
                <p className="text-sm text-muted-foreground">
                  Quem operacionaliza o acordo de cada lado. Use estes contatos
                  para protocolar requerimentos ou esclarecer pendências
                  administrativas.
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {a.importado.orgaoBR && <OrgaoCard orgao={a.importado.orgaoBR} />}
                  {a.importado.orgaoParceiro && <OrgaoCard orgao={a.importado.orgaoParceiro} />}
                </div>
              </Bloco>
            )}

            {/* BENEFÍCIOS COBERTOS (público) */}
            {a.importado &&
              (a.importado.beneficios.brasil.length > 0 ||
                a.importado.beneficios.parceiro.length > 0) && (
                <Bloco titulo="Benefícios cobertos pelo acordo">
                  <div className="mt-2 grid gap-8 md:grid-cols-2">
                    {a.importado.beneficios.brasil.length > 0 && (
                      <ListaBeneficios titulo="Lado Brasil" itens={a.importado.beneficios.brasil} />
                    )}
                    {a.importado.beneficios.parceiro.length > 0 && (
                      <ListaBeneficios
                        titulo={`Lado ${a.nome}`}
                        itens={a.importado.beneficios.parceiro}
                      />
                    )}
                  </div>
                </Bloco>
              )}

            {/* COMO FUNCIONA (editorial, só para prioritários) */}
            {a.conteudo && (
              <>
                <Bloco titulo="Como funciona, em linhas gerais">
                  <p className="text-lg leading-relaxed">{a.conteudo.totalizacao}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Conceito geral no guia{" "}
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
              </>
            )}

            {/* DOCUMENTOS (PRO — agrupados por categoria, download trancado) */}
            {a.importado && a.importado.documentos.length > 0 && (
              <Bloco titulo={`Documentos e formulários (${a.importado.documentos.length})`}>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Texto integral do acordo, ajuste administrativo e formulários
                    oficiais para protocolar requerimentos.
                  </p>
                  <Link
                    to="/profissional"
                    className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--accent-ink)] hover:underline underline-offset-4"
                  >
                    <LockIcon /> Download no Hub Profissional →
                  </Link>
                </div>
                <div className="mt-8 space-y-8">
                  {agruparDocumentos(a.importado.documentos).map(([cat, docs]) => (
                    <div key={cat}>
                      <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2">
                        <h3 className="eyebrow text-[var(--accent-ink)]">
                          {CATEGORIA_LABEL[cat] ?? "Outro"}
                        </h3>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          {docs.length} {docs.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                      <ul className="mt-2 divide-y divide-border/60">
                        {docs.map((d: DocumentoImportado) => (
                          <li key={d.nome} className="flex items-start gap-4 py-4">
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-base leading-snug">{d.nome}</p>
                              {d.desc && (
                                <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
                              )}
                            </div>
                            <span
                              className="mt-1 shrink-0 text-muted-foreground/60"
                              aria-label="Acesso restrito ao Hub Profissional"
                            >
                              <LockIcon />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Bloco>
            )}

            {/* Caso país sem dados importados, mantém a versão editorial */}
            {!a.importado && !a.conteudo && (
              <Bloco titulo="Sobre este acordo">
                <p className="text-lg leading-relaxed">{a.resumo}</p>
                <p className="mt-6 text-base text-muted-foreground">
                  A versão pública desta página será expandida em breve. Se
                  você precisa de orientação imediata sobre um caso ligado a{" "}
                  {a.nome}, fale com o Dr. Marcos Espínola.
                </p>
              </Bloco>
            )}

            <ProContentLock
              contexto={`Tudo sobre Brasil–${a.nome} no Hub Profissional`}
              itens={[
                "Benefícios cobertos, destrinchados artigo por artigo",
                `Aplicação da totalização no acordo Brasil–${a.nome}, com exemplos de cálculo`,
                `Texto integral do acordo Brasil–${a.nome} e do decreto de promulgação`,
                "Portarias do INSS aplicáveis, comentadas",
                "Documentos e formulários oficiais exigidos",
                "Modelos de petição e requerimento editáveis",
                "Calculadora de totalização e prorata",
                "Fluxograma processual passo a passo",
                "Jurisprudência relevante consolidada",
                "Quando e como acionar judicialmente",
              ]}
            />
          </div>

          <aside className="space-y-6 md:sticky md:top-6 md:self-start">
            <CTAMarcos
              contexto={`Tem um caso ligado ao acordo Brasil–${a.nome}? Fale com o Dr. Marcos Espínola.`}
            />
            <div className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm">
              <p className="eyebrow">Próximos passos</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: "moro-fora" }}
                    className="ink-link hover:text-[var(--accent-ink)]"
                  >
                    Já moro no exterior →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: "estou-voltando" }}
                    className="ink-link hover:text-[var(--accent-ink)]"
                  >
                    Estou voltando ao Brasil →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guias/$slug"
                    params={{ slug: "prova-de-vida-no-exterior" }}
                    className="ink-link hover:text-[var(--accent-ink)]"
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
      <nav className="border-y border-border/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border/60">
          <Link
            to={prev ? "/acordos/$pais" : "/acordos"}
            params={prev ? { pais: prev.slug } : undefined}
            className="group flex items-center gap-4 bg-background px-6 py-8 transition-colors hover:bg-[var(--accent-ink-soft)]"
          >
            {prev?.iso && (
              <img
                src={`https://flagcdn.com/w80/${prev.iso}.png`}
                alt=""
                width={40}
                height={30}
                loading="lazy"
                className="h-[30px] w-[40px] flex-shrink-0 rounded border border-border/60 object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="eyebrow">← Anterior</p>
              <p className="mt-2 truncate font-display text-lg transition-colors group-hover:text-[var(--accent-ink)]">
                {prev ? prev.nome : "Todos os países"}
              </p>
            </div>
          </Link>
          <Link
            to={next ? "/acordos/$pais" : "/acordos"}
            params={next ? { pais: next.slug } : undefined}
            className="group flex items-center justify-end gap-4 bg-background px-6 py-8 text-right transition-colors hover:bg-[var(--accent-ink-soft)]"
          >
            <div className="min-w-0">
              <p className="eyebrow">Próximo →</p>
              <p className="mt-2 truncate font-display text-lg transition-colors group-hover:text-[var(--accent-ink)]">
                {next ? next.nome : "Todos os países"}
              </p>
            </div>
            {next?.iso && (
              <img
                src={`https://flagcdn.com/w80/${next.iso}.png`}
                alt=""
                width={40}
                height={30}
                loading="lazy"
                className="h-[30px] w-[40px] flex-shrink-0 rounded border border-border/60 object-cover"
              />
            )}
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

function FichaItem({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-5 backdrop-blur-sm transition-colors hover:border-[var(--accent-ink)]/40">
      <dt className="eyebrow">{rotulo}</dt>
      <dd className="mt-3 font-display text-base leading-snug">{valor}</dd>
    </div>
  );
}

function OrgaoCard({ orgao }: { orgao: OrgaoLigacao }) {
  const temDados =
    !!orgao.instituicao || !!orgao.endereco || !!orgao.telefone || !!orgao.email;
  return (
    <article className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm">
      <h3 className="font-display text-lg leading-snug">{orgao.titulo}</h3>
      <hr className="rule mt-3" />
      {temDados ? (
        <dl className="mt-4 space-y-3 text-sm">
          {orgao.instituicao && (
            <div>
              <dt className="eyebrow">Instituição</dt>
              <dd className="mt-1 leading-snug">{orgao.instituicao}</dd>
            </div>
          )}
          {orgao.endereco && (
            <div>
              <dt className="eyebrow">Endereço</dt>
              <dd className="mt-1 leading-snug text-muted-foreground">{orgao.endereco}</dd>
            </div>
          )}
          {orgao.telefone && (
            <div>
              <dt className="eyebrow">Telefone</dt>
              <dd className="mt-1 leading-snug">
                <a
                  href={`tel:${orgao.telefone.replace(/[^+\d]/g, "")}`}
                  className="ink-link"
                >
                  {orgao.telefone}
                </a>
              </dd>
            </div>
          )}
          {orgao.email && (
            <div>
              <dt className="eyebrow">E-mail</dt>
              <dd className="mt-1 leading-snug">
                <a href={`mailto:${orgao.email}`} className="ink-link break-all">
                  {orgao.email}
                </a>
              </dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="mt-4 text-sm italic text-muted-foreground">
          Dados de contato em organização.
        </p>
      )}
    </article>
  );
}

function ListaBeneficios({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div>
      <p className="eyebrow">{titulo}</p>
      <ul className="mt-3 space-y-2">
        {itens.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-snug">
            <span aria-hidden className="mt-0.5 text-foreground">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CATEGORIA_LABEL: Record<string, string> = {
  principal: "Principal",
  complementar: "Complementar",
  formulario: "Formulário",
  roteiro: "Roteiro",
  outro: "Outro",
};




const CATEGORIA_ORDEM = ["principal", "complementar", "roteiro", "formulario", "outro"] as const;

function agruparDocumentos(docs: DocumentoImportado[]): Array<[string, DocumentoImportado[]]> {
  const grupos = new Map<string, DocumentoImportado[]>();
  for (const d of docs) {
    const cat = d.cat ?? "outro";
    if (!grupos.has(cat)) grupos.set(cat, []);
    grupos.get(cat)!.push(d);
  }
  const ordenados: Array<[string, DocumentoImportado[]]> = [];
  for (const cat of CATEGORIA_ORDEM) {
    if (grupos.has(cat)) {
      ordenados.push([cat, grupos.get(cat)!]);
      grupos.delete(cat);
    }
  }
  for (const [cat, items] of grupos) ordenados.push([cat, items]);
  return ordenados;
}

function LockIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}
