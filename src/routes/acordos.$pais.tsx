import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock, Info } from "lucide-react";
import { acordos, getAcordo } from "@/data/acordos";
import type { DocumentoImportado } from "@/data/acordos.types";
import { getInstrumento } from "@/data/acordos-instrumento-overrides";
import { findTooltipFor } from "@/data/acordo-tooltips";
import { CTAMarcos } from "@/components/cta-marcos";
import { ProContentLock } from "@/components/pro-content-lock";
import { Highlight } from "@/lib/highlight";
import { MULTI_LOGOS } from "@/lib/multi-logos";
import { MULTILATERAIS_MEMBROS } from "@/data/multilaterais-membros";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/acordos/$pais")({
  head: ({ params }) => {
    const a = getAcordo(params.pais);
    if (!a) {
      return {
        meta: [{ title: "País não encontrado | Acordos Internacionais" }],
      };
    }
    const title = `Acordo previdenciário Brasil–${a.nome}`;
    const desc = a.conteudo?.destaque ?? a.resumo;
    const url = `https://acordosinternacionais.com/acordos/${a.slug}`;
    const ogImage = `https://acordosinternacionais.com/og/${a.slug}.jpg?v=3`;
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
                isPartOf: { "@id": "https://acordosinternacionais.com/#website" },
                publisher: { "@id": "https://acordosinternacionais.com/#organization" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Início",
                    item: "https://acordosinternacionais.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Países",
                    item: "https://acordosinternacionais.com/acordos",
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

  // Stats do hero (a partir dos dados disponíveis)
  const anosEmVigor = a.vigencia ? new Date().getFullYear() - parseInt(a.vigencia, 10) : null;
  const numDocs = a.importado?.documentos.length ?? 0;
  const numOrgaos = (a.importado?.orgaoBR ? 1 : 0) + (a.importado?.orgaoParceiro ? 1 : 0);

  // Termos a destacar no lede / corpo
  const termosChave = [
    "totalização",
    "pró-rata",
    "prorata",
    "tempo de contribuição",
    "benefício",
    "aposentadoria",
    a.nome,
    a.vigencia ? `desde ${a.vigencia}` : "",
  ].filter(Boolean);

  // Blocos para o TOC (só os que vão renderizar)
  const tocBlocos: Array<{ id: string; label: string }> = [];
  if (a.importado && (a.importado.decreto || a.importado.vigorDesde || a.importado.instrumento))
    tocBlocos.push({ id: "instrumento", label: "Instrumento" });
  if (
    a.importado &&
    (a.importado.beneficios.brasil.length > 0 || a.importado.beneficios.parceiro.length > 0)
  )
    tocBlocos.push({ id: "beneficios", label: "Benefícios cobertos" });
  if (a.conteudo) tocBlocos.push({ id: "como-funciona", label: "Como funciona" });
  if (a.importado && a.importado.documentos.length > 0)
    tocBlocos.push({ id: "documentos", label: "Documentos" });

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
                {a.status === "vigente" && a.vigencia && ` · vigente desde ${a.vigencia}`}
                {a.status === "ratificacao" && ` · em ratificação`}
                {a.status === "incompleto" && ` · documentação em organização`}
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-7xl">{a.nome}</h1>
              <p className="lede mt-6 max-w-2xl">
                <Highlight
                  text={a.conteudo?.destaque ?? a.resumo}
                  terms={termosChave}
                />
              </p>

              {/* Stats line — sem caixa, tipografia editorial */}
              {(anosEmVigor !== null || numOrgaos > 0 || numDocs > 0) && (
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                  {anosEmVigor !== null && anosEmVigor > 0 && (
                    <StatItem
                      valor={anosEmVigor}
                      rotulo={anosEmVigor === 1 ? "ano em vigor" : "anos em vigor"}
                    />
                  )}
                  {numDocs > 0 && (
                    <StatItem
                      valor={numDocs}
                      rotulo={numDocs === 1 ? "documento oficial" : "documentos oficiais"}
                    />
                  )}
                  {numOrgaos > 0 && (
                    <StatItem
                      valor={numOrgaos}
                      rotulo={numOrgaos === 1 ? "órgão de ligação" : "órgãos de ligação"}
                    />
                  )}
                </dl>
              )}

              {a.status !== "vigente" && (
                <p className="mt-6 inline-block rounded-full border border-[var(--accent-ink)] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                  {a.status === "ratificacao"
                    ? "Acordo assinado · em ratificação"
                    : "Documentação em organização"}
                </p>
              )}
            </div>
            {(a.iso || MULTI_LOGOS[a.slug]) && (
              <div className="md:self-end">
                <div className="flex aspect-[3/2] w-[200px] items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background/70 shadow-[0_8px_24px_-12px_rgba(122,31,31,0.18)] backdrop-blur-sm md:w-[260px]">
                  {a.iso ? (
                    <img
                      src={`https://flagcdn.com/w320/${a.iso}.png`}
                      alt={`Bandeira de ${a.nome}`}
                      width={260}
                      height={173}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={MULTI_LOGOS[a.slug]}
                      alt={`Logo ${a.nome}`}
                      width={260}
                      height={173}
                      className={
                        "h-full w-full object-contain p-6 " +
                        (a.slug === "mercosul"
                          ? "brightness-0 invert opacity-90"
                          : "")
                      }
                    />
                  )}
                </div>
                {MULTILATERAIS_MEMBROS[a.slug] && (
                  <ul className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    {MULTILATERAIS_MEMBROS[a.slug].map((m) => (
                      <li key={m.iso} title={m.nome}>
                        <img
                          src={`https://flagcdn.com/w40/${m.iso}.png`}
                          alt={`Bandeira de ${m.nome}`}
                          width={24}
                          height={16}
                          loading="lazy"
                          className="h-4 w-6 rounded-[2px] border border-border/60 object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </header>


        {/* CONTEÚDO PRINCIPAL */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px] md:py-20">
          <div className="space-y-14">
            {/* INSTRUMENTO E DECRETO (público) */}
            {a.importado && (a.importado.decreto || a.importado.vigorDesde || a.importado.instrumento) && (
              <Bloco
                id="instrumento"
                numero={tocBlocos.findIndex((b) => b.id === "instrumento") + 1}
                titulo="Instrumento e vigência"
                lede="O que foi assinado, quando entrou em vigor e qual decreto o promulgou no Brasil."
              >
                <dl className="grid gap-4 sm:grid-cols-3">
                  {a.importado.instrumento && (
                    <FichaItem rotulo="Instrumento" valor={getInstrumento(a.slug, a.importado.instrumento)} />
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



            {/* BENEFÍCIOS COBERTOS (público) */}
            {a.importado &&
              (a.importado.beneficios.brasil.length > 0 ||
                a.importado.beneficios.parceiro.length > 0) && (
                <Bloco
                  id="beneficios"
                  numero={tocBlocos.findIndex((b) => b.id === "beneficios") + 1}
                  titulo="Benefícios cobertos"
                  lede={`O que cada país reconhece sob o acordo Brasil–${a.nome}.`}
                >
                  <BeneficiosComparativo
                    slug={a.slug}
                    brasil={a.importado.beneficios.brasil}
                    parceiro={a.importado.beneficios.parceiro}
                    paisParceiro={a.nome}
                  />
                </Bloco>
              )}

            {/* COMO FUNCIONA (editorial, só para prioritários) */}
            {a.conteudo && (
              <>
                <Bloco
                  id="como-funciona"
                  numero={tocBlocos.findIndex((b) => b.id === "como-funciona") + 1}
                  titulo="Como funciona, em linhas gerais"
                  lede="A mecânica de totalização aplicada a este acordo."
                >
                  <p className="text-lg leading-relaxed">
                    <Highlight text={a.conteudo.totalizacao} terms={termosChave} />
                  </p>
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
                  <aside className="relative rounded-r-lg border-l-2 border-[var(--accent-ink)] bg-background/50 p-6 backdrop-blur-md">
                    <p className="eyebrow text-[var(--accent-ink)]">Para o registro</p>
                    <p className="mt-3 font-display text-xl leading-snug italic">
                      <Highlight text={a.conteudo.curiosidade} terms={termosChave} />
                    </p>
                  </aside>
                )}
              </>
            )}

            {/* DOCUMENTOS (PRO — agrupados por categoria, download trancado) */}
            {a.importado && a.importado.documentos.length > 0 && (
              <Bloco
                id="documentos"
                numero={tocBlocos.findIndex((b) => b.id === "documentos") + 1}
                titulo="Documentos e formulários"
                lede="Texto integral do acordo, ajuste administrativo e formulários oficiais para protocolar requerimentos."
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-display text-foreground">
                      {a.importado.documentos.length}
                    </span>{" "}
                    arquivos catalogados, agrupados por uso processual.
                  </p>
                  <Link
                    to="/profissional"
                    className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--accent-ink)] hover:underline underline-offset-4"
                  >
                    <Lock size={11} aria-hidden /> Download no Hub Profissional →
                  </Link>
                </div>
                <div className="mt-8 space-y-2">
                  {agruparDocumentos(a.importado.documentos).map(([cat, docs]) =>
                    docs.map((d: DocumentoImportado) => (
                      <div
                        key={d.nome}
                        className="group flex items-start gap-4 rounded-lg border border-border/40 bg-background/50 p-4 transition-colors hover:border-[var(--accent-ink)]/40 hover:bg-[var(--accent-ink-soft)]/40"
                      >
                        <span className="mt-0.5 shrink-0 rounded-full border border-[var(--accent-ink)]/50 bg-[color-mix(in_oklab,var(--accent-ink)_14%,transparent)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                          {CATEGORIA_LABEL[cat] ?? "Outro"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base leading-snug">{d.nome}</p>
                          {d.desc && (
                            <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
                          )}
                        </div>
                        <Lock
                          size={14}
                          className="mt-1 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-[var(--accent-ink)]"
                          aria-label="Acesso restrito ao Hub Profissional"
                        />
                      </div>
                    )),
            )}

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
                  {a.nome}, fale com um dos nossos especialistas.
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
                "Órgãos de ligação: contatos completos (instituição, endereço, telefone, e-mail)",
                "Modelos de petição e requerimento editáveis",
                "Calculadora de totalização",
                "Fluxograma processual passo a passo",
                "Jurisprudência relevante consolidada",
                "Quando e como acionar judicialmente",
              ]}
            />
          </div>

          <aside className="space-y-6 md:sticky md:top-6 md:self-start">
            {tocBlocos.length > 1 && (
              <nav
                aria-label="Nesta página"
                className="hidden rounded-xl border border-border/60 bg-background/70 p-5 backdrop-blur-sm md:block"
              >
                <p className="eyebrow text-[var(--accent-ink)]">Nesta página</p>
                <ol className="mt-4 space-y-2.5 text-sm">
                  {tocBlocos.map((b, i) => (
                    <li key={b.id}>
                      <a
                        href={`#${b.id}`}
                        className="group flex items-baseline gap-3 text-muted-foreground transition-colors hover:text-[var(--accent-ink)]"
                      >
                        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60 group-hover:text-[var(--accent-ink)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{b.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <CTAMarcos contexto={"\n"} />

            <div className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm">
              <p className="eyebrow">Próximos passos</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/jornadas/$jornada"
                    params={{ jornada: "moro-fora" }}
                    className="ink-link hover:text-[var(--accent-ink)]"
                  >
                    Moro no exterior →
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

function Bloco({
  id,
  numero,
  titulo,
  lede,
  children,
}: {
  id?: string;
  numero?: number;
  titulo: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header>
        {numero ? (
          <p className="eyebrow text-[var(--accent-ink)]">
            <span className="font-mono text-foreground/40">
              {String(numero).padStart(2, "0")}
            </span>{" "}
            <span aria-hidden className="mx-1 text-foreground/30">·</span>{" "}
            {titulo}
          </p>
        ) : null}
        <h2 className="mt-2 font-display text-2xl md:text-3xl">{titulo}</h2>
        {lede && (
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">{lede}</p>
        )}
        <hr className="rule mt-4" />
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function StatItem({ valor, rotulo }: { valor: number | string; rotulo: string }) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{rotulo}</dt>
      <dd className="mt-1 font-display text-3xl leading-none text-[var(--accent-ink)]">
        {valor}
      </dd>
    </div>
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

function OrgaoCard({
  orgao,
  lado,
  flagIso,
}: {
  orgao: OrgaoLigacao;
  lado?: string;
  flagIso?: string;
}) {
  const temDados =
    !!orgao.instituicao || !!orgao.endereco || !!orgao.telefone || !!orgao.email;
  return (
    <article className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm transition-colors hover:border-[var(--accent-ink)]/40">
      {lado && (
        <p className="eyebrow flex items-center gap-2 text-[var(--accent-ink)]">
          {flagIso && (
            <img
              src={`https://flagcdn.com/w40/${flagIso}.png`}
              alt=""
              width={20}
              height={14}
              loading="lazy"
              className="h-3.5 w-5 rounded-[2px] border border-border/60 object-cover"
            />
          )}
          {flagIso ? lado : `Lado ${lado}`}
        </p>
      )}
      <h3 className="mt-2 font-display text-lg leading-snug">{orgao.titulo}</h3>
      <hr className="rule mt-3" />
      {temDados ? (
        <dl className="mt-4 space-y-3.5 text-sm">
          {orgao.instituicao && (
            <div className="flex items-start gap-2.5">
              <Building2 size={14} className="mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
              <dd className="leading-snug">{orgao.instituicao}</dd>
            </div>
          )}
          {orgao.endereco && (
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
              <dd className="leading-snug text-muted-foreground">{orgao.endereco}</dd>
            </div>
          )}
          {orgao.telefone && (
            <div className="flex items-start gap-2.5">
              <Phone size={14} className="mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
              <dd className="leading-snug">
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
            <div className="flex items-start gap-2.5">
              <Mail size={14} className="mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
              <dd className="leading-snug">
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

function BeneficiosComparativo({
  slug,
  brasil,
  parceiro,
  paisParceiro,
}: {
  slug: string;
  brasil: string[];
  parceiro: string[];
  paisParceiro: string;
}) {
  const linhas = Math.max(brasil.length, parceiro.length);
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/50">
      <div className="grid grid-cols-2 border-b border-[var(--accent-ink)]/40 bg-[var(--card-bg)]">
        <p className="border-r border-border/60 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
          Lado Brasil
        </p>
        <p className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
          Lado {paisParceiro}
        </p>
      </div>
      <ul className="divide-y divide-border/40">
        {Array.from({ length: linhas }).map((_, i) => (
          <li
            key={i}
            className={
              "grid grid-cols-2 " +
              (i % 2 === 1 ? "bg-[var(--paper-soft)]/40" : "")
            }
          >
            <BeneficioCell
              nome={brasil[i]}
              tooltip={brasil[i] ? findTooltipFor(slug, "brasil", brasil[i])?.tooltip : undefined}
              borderRight
            />
            <BeneficioCell
              nome={parceiro[i]}
              tooltip={parceiro[i] ? findTooltipFor(slug, "parceiro", parceiro[i])?.tooltip : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BeneficioCell({
  nome,
  tooltip,
  borderRight,
}: {
  nome?: string;
  tooltip?: string;
  borderRight?: boolean;
}) {
  return (
    <div
      className={
        "px-4 py-3 text-sm leading-snug " +
        (borderRight ? "border-r border-border/40" : "")
      }
    >
      {nome ? (
        <span className="flex items-start gap-2.5">
          <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-ink)]" />
          <span className="flex-1">{nome}</span>
          {tooltip && (
            <Popover>
              <PopoverTrigger
                aria-label={`Detalhes sobre ${nome}`}
                className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-muted-foreground transition-colors hover:text-[var(--accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ink)]/40"
              >
                <Info className="h-3.5 w-3.5" />
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="max-w-[min(420px,calc(100vw-2rem))] whitespace-pre-line text-sm leading-relaxed"
              >
                {tooltip}
              </PopoverContent>
            </Popover>
          )}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      )}
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

function OrgaosLigacaoBloco({
  acordo,
}: {
  acordo: import("@/data/acordos").Acordo;
}) {
  const imp = acordo.importado!;
  const membros = MULTILATERAIS_MEMBROS[acordo.slug];
  const ehMultilateral = acordo.tipo === "multilateral";
  const membrosComOrgao = membros?.filter((m) => m.orgao) ?? [];
  const membrosSemOrgao = membros?.filter((m) => !m.orgao) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {imp.orgaoBR && <OrgaoCard orgao={imp.orgaoBR} lado="Brasil" />}
        {imp.orgaoParceiro && !ehMultilateral && (
          <OrgaoCard orgao={imp.orgaoParceiro} lado={acordo.nome} />
        )}
      </div>

      {ehMultilateral && membrosComOrgao.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {membrosComOrgao.map((m) => (
            <OrgaoCard
              key={m.iso}
              orgao={m.orgao!}
              lado={m.nome}
              flagIso={m.iso}
            />
          ))}
        </div>
      )}

      {ehMultilateral && membrosSemOrgao.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-background/50 p-5">
          <p className="eyebrow mb-3 text-[var(--accent-ink)]">
            Outros países-membros
          </p>
          <ul className="flex flex-wrap items-center gap-3">
            {membrosSemOrgao.map((m) => (
              <li
                key={m.iso}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <img
                  src={`https://flagcdn.com/w40/${m.iso}.png`}
                  alt=""
                  width={20}
                  height={14}
                  loading="lazy"
                  className="h-3.5 w-5 rounded-[2px] border border-border/60 object-cover"
                />
                <span>{m.nome}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {NOTA_REMISSAO_BILATERAIS}
          </p>
        </div>
      )}

      {ehMultilateral && !membros && (
        <p className="text-sm text-muted-foreground">
          {NOTA_REMISSAO_BILATERAIS}
        </p>
      )}
    </div>
  );
}


