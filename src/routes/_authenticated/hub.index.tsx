import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Calculator, ArrowRight, FileText, Inbox, History } from "lucide-react";
import { getHubDashboard } from "@/lib/hub.functions";
import { CTAButton } from "@/components/cta-button";
import { acordosImportados } from "@/data/acordos.generated";
import { REGIAO_POR_PAIS } from "@/data/regioes";
import { CountryCard } from "@/components/hub/country-card";
import { StatusBadge } from "@/components/hub/status-badge";
import { SectionCard } from "@/components/hub/section-card";
import {
  DashboardFilters,
  type RegiaoFiltro,
  type StatusFiltro,
} from "@/components/hub/dashboard-filters";
import { MULTI_LOGOS } from "@/lib/multi-logos";

const PAISES = [
  { slug: "alemanha", nome: "Alemanha", flag: "de" },
  { slug: "austria", nome: "Áustria", flag: "at" },
  { slug: "belgica", nome: "Bélgica", flag: "be" },
  { slug: "bulgaria", nome: "Bulgária", flag: "bg" },
  { slug: "cabo-verde", nome: "Cabo Verde", flag: "cv" },
  { slug: "canada", nome: "Canadá", flag: "ca" },
  { slug: "chile", nome: "Chile", flag: "cl" },
  { slug: "coreia-do-sul", nome: "Coreia do Sul", flag: "kr" },
  { slug: "cplp", nome: "CPLP", flag: null },
  { slug: "espanha", nome: "Espanha", flag: "es" },
  { slug: "estados-unidos", nome: "Estados Unidos", flag: "us" },
  { slug: "franca", nome: "França", flag: "fr" },
  { slug: "grecia", nome: "Grécia", flag: "gr" },
  { slug: "iberoamericano", nome: "Ibero-Americano", flag: null },
  { slug: "india", nome: "Índia", flag: "in" },
  { slug: "israel", nome: "Israel", flag: "il" },
  { slug: "italia", nome: "Itália", flag: "it" },
  { slug: "japao", nome: "Japão", flag: "jp" },
  { slug: "luxemburgo", nome: "Luxemburgo", flag: "lu" },
  { slug: "mercosul", nome: "Mercosul", flag: null },
  { slug: "mocambique", nome: "Moçambique", flag: "mz" },
  { slug: "portugal", nome: "Portugal", flag: "pt" },
  { slug: "quebec", nome: "Québec", flag: "ca" },
  { slug: "republica-tcheca", nome: "Rep. Tcheca", flag: "cz" },
  { slug: "suica", nome: "Suíça", flag: "ch" },
] as const;

const PAIS_POR_SLUG = Object.fromEntries(PAISES.map((p) => [p.slug, p]));

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function temMaterial(slug: string) {
  const d = acordosImportados[slug];
  if (!d) return false;
  return d.documentos.some((x) => x.arquivo);
}

export const Route = createFileRoute("/_authenticated/hub/")({
  component: HubDashboard,
});

function HubDashboard() {
  const { data, isPending } = useQuery({
    queryKey: ["hub-dashboard"],
    queryFn: () => getHubDashboard(),
  });

  const hasAccess = data?.hasAccess === true;
  const isAdmin = data?.isAdmin === true;
  const isActive = data?.isActive === true;

  const [regiao, setRegiao] = useState<RegiaoFiltro>("todas");
  const [status, setStatus] = useState<StatusFiltro>("todos");

  const EM_RATIFICACAO = new Set(["cabo-verde", "israel", "cplp"]);

  const paisesFiltrados = useMemo(() => {
    return PAISES.filter((p) => {
      if (regiao !== "todas" && REGIAO_POR_PAIS[p.slug] !== regiao) return false;
      const tem = temMaterial(p.slug);
      if (status === "com-material" && !tem) return false;
      if (status === "em-ratificacao" && !EM_RATIFICACAO.has(p.slug)) return false;
      return true;
    });
  }, [regiao, status]);

  const recentItems = (data?.recentCountries ?? [])
    .map((r) => {
      const p = PAIS_POR_SLUG[r.pais];
      return p ? { pais: r.pais, nome: p.nome, flag: p.flag, lastAt: r.lastAt } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 6);

  const planoBadge = isAdmin ? (
    <StatusBadge kind="admin" label="Modo admin" />
  ) : isActive ? (
    <StatusBadge kind="pro" label="Plano Pro" />
  ) : (
    <StatusBadge kind="trial" label="Trial" tone="muted" />
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
      {/* Header curto — uma linha */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {getGreeting()}
          </p>
          <h1 className="mt-1 font-display text-3xl">
            Hub <span className="text-gold">Profissional</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {planoBadge}
          {!isAdmin && isActive && data?.periodEnd && (
            <span className="hidden text-[11px] text-muted-foreground sm:inline">
              renova {new Date(data.periodEnd).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      </header>

      {!hasAccess && !isPending && (
        <SectionCard gold className="mb-6">
          <p className="font-medium">Acesso bloqueado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assine o Hub Profissional para acessar os materiais técnicos de todos os
            acordos e a calculadora RMI.
          </p>
          <div className="mt-4">
            <CTAButton to="/precos" variant="dark" label="Ver planos" />
          </div>
        </SectionCard>
      )}

      {/* Banda de ações compacta — uma fileira de 3 cards */}
      <section className="mb-7 grid gap-3 md:grid-cols-3">
        <ActionCard
          to="/hub/calculadora"
          icon={Calculator}
          eyebrow="Ferramenta inclusa"
          title="Calculadora Totalização"
          desc="Laudo técnico pronto para anexar ao processo."
          gold
        />
        <ActionCard
          to="/hub/laudos"
          icon={FileText}
          eyebrow="Histórico"
          title="Laudos gerados"
          desc="Reabra e baixe novamente qualquer laudo PDF."
        />
        {isAdmin ? (
          <ActionCard
            to="/hub/leads"
            icon={Inbox}
            eyebrow="Admin"
            title="Leads da calculadora"
            desc="Acompanhe e contate cada lead que veio do site."
            gold
          />
        ) : (
          <ActionCard
            to="/hub"
            icon={ArrowRight}
            eyebrow="Continuar"
            title="Países disponíveis"
            desc="Salte direto para o seu acordo favorito abaixo."
          />
        )}
      </section>

      {/* Workspace — grid + rail */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-9">
          <FiltersToolbar
            regiao={regiao}
            status={status}
            onRegiao={setRegiao}
            onStatus={setStatus}
            total={paisesFiltrados.length}
          />
          {paisesFiltrados.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
              Nenhum país nesse filtro.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {paisesFiltrados.map((p) => (
                <li key={p.slug}>
                  <CountryCard pais={p} hasAccess={hasAccess} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Rail sticky */}
        <aside className="lg:col-span-3">
          <div className="space-y-4 lg:sticky lg:top-16">
            {recentItems.length > 0 && (
              <SectionCard>
                <div className="mb-3 flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Continuar lendo
                  </h2>
                </div>
                <ul className="-mx-1">
                  {recentItems.map((it) => (
                    <li key={it.pais}>
                      <Link
                        to="/hub/$pais"
                        params={{ pais: it.pais }}
                        className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-[var(--paper-soft)]"
                      >
                        {it.flag ? (
                          <img
                            src={`https://flagcdn.com/w40/${it.flag}.png`}
                            alt=""
                            width={20}
                            height={15}
                            className="rounded-sm object-cover"
                            loading="lazy"
                          />
                        ) : MULTI_LOGOS[it.pais] ? (
                          <img
                            src={MULTI_LOGOS[it.pais]}
                            alt=""
                            width={20}
                            height={15}
                            className="h-[15px] w-[20px] rounded-sm bg-background object-contain ring-1 ring-border"
                            loading="lazy"
                          />
                        ) : (
                          <span className="h-[15px] w-[20px] rounded-sm bg-secondary" />
                        )}
                        <span className="flex-1 truncate text-foreground/85 group-hover:text-foreground">
                          {it.nome}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            <SectionCard>
              <h2 className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Atalhos
              </h2>
              <ul className="space-y-1.5 text-[13px]">
                <li>
                  <Link
                    to="/hub/calculadora"
                    className="block rounded-md px-2 py-1.5 text-foreground/85 transition-colors hover:bg-[var(--paper-soft)] hover:text-[var(--accent-ink)]"
                  >
                    Nova totalização →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hub/laudos"
                    className="block rounded-md px-2 py-1.5 text-foreground/85 transition-colors hover:bg-[var(--paper-soft)] hover:text-[var(--accent-ink)]"
                  >
                    Meus laudos →
                  </Link>
                </li>
                <li>
                  <Link
                    to="/conta"
                    className="block rounded-md px-2 py-1.5 text-foreground/85 transition-colors hover:bg-[var(--paper-soft)] hover:text-[var(--accent-ink)]"
                  >
                    Minha conta →
                  </Link>
                </li>
              </ul>
            </SectionCard>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionCard({
  to,
  icon: Icon,
  eyebrow,
  title,
  desc,
  gold = false,
}: {
  to: string;
  icon: typeof Calculator;
  eyebrow: string;
  title: string;
  desc: string;
  gold?: boolean;
}) {
  return (
    <Link
      to={to}
      className={[
        "group flex items-start gap-3 rounded-2xl border bg-[var(--surface-premium)] p-4 backdrop-blur-md shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5",
        gold
          ? "border-[var(--rule-gold)] hover:border-[var(--rule-gold-strong)] hover:shadow-[var(--shadow-gold-glow)]"
          : "border-border/60 hover:border-foreground/40 hover:shadow-[var(--shadow-soft-hover)]",
      ].join(" ")}
    >
      <span
        className={
          gold
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-ink)] text-[var(--paper)]"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-foreground"
        }
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`mb-0.5 text-[10px] font-medium uppercase tracking-[0.16em] ${
            gold ? "text-[var(--accent-ink)]" : "text-muted-foreground"
          }`}
        >
          {eyebrow}
        </p>
        <p className="font-display text-[15px] leading-tight">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--accent-ink)]" />
    </Link>
  );
}

function FiltersToolbar(props: {
  regiao: RegiaoFiltro;
  status: StatusFiltro;
  onRegiao: (r: RegiaoFiltro) => void;
  onStatus: (s: StatusFiltro) => void;
  total: number;
}) {
  return (
    <div className="mb-4 rounded-xl border border-border/60 bg-[var(--surface-premium)] px-3 py-2 backdrop-blur-md">
      <DashboardFilters
        regiao={props.regiao}
        status={props.status}
        onRegiao={props.onRegiao}
        onStatus={props.onStatus}
        totalVisivel={props.total}
      />
    </div>
  );
}
