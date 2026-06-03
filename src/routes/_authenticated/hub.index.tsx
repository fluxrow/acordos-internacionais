import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Calculator, ArrowRight, FileText, Inbox } from "lucide-react";
import { getHubDashboard } from "@/lib/hub.functions";
import { CTAButton } from "@/components/cta-button";
import { acordosImportados } from "@/data/acordos.generated";
import { REGIAO_POR_PAIS } from "@/data/regioes";
import { CountryCard } from "@/components/hub/country-card";
import {
  DashboardFilters,
  type RegiaoFiltro,
  type StatusFiltro,
} from "@/components/hub/dashboard-filters";
import { ContinueReading } from "@/components/hub/continue-reading";

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

  const [regiao, setRegiao] = useState<RegiaoFiltro>("todas");
  const [status, setStatus] = useState<StatusFiltro>("todos");

  const paisesFiltrados = useMemo(() => {
    return PAISES.filter((p) => {
      if (regiao !== "todas" && REGIAO_POR_PAIS[p.slug] !== regiao) return false;
      const tem = temMaterial(p.slug);
      if (status === "com-material" && !tem) return false;
      if (status === "em-curadoria" && tem) return false;
      return true;
    });
  }, [regiao, status]);

  const recentItems = (data?.recentCountries ?? [])
    .map((r) => {
      const p = PAIS_POR_SLUG[r.pais];
      return p ? { pais: r.pais, nome: p.nome, flag: p.flag, lastAt: r.lastAt } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <p className="eyebrow mb-1">{getGreeting()}</p>
        <h1 className="font-display text-4xl">Hub Profissional</h1>
        <p className="mt-1 text-muted-foreground">Acordos Previdenciários Internacionais</p>
        {isAdmin && (
          <span className="mt-3 inline-flex items-center rounded-full border border-[var(--accent-ink)]/30 bg-[var(--accent-ink)]/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
            Modo admin
          </span>
        )}
      </header>

      {!hasAccess && !isPending && (
        <div className="mb-8 rounded-2xl border border-border/60 bg-background/60 px-6 py-5 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
          <p className="font-medium">Acesso bloqueado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assine o Hub Profissional para acessar os materiais técnicos de todos os acordos e a calculadora RMI.
          </p>
          <div className="mt-4">
            <CTAButton to="/precos" variant="dark" label="Ver planos" />
          </div>
        </div>
      )}

      {/* Card destacado: Calculadora RMI */}
      <Link
        to="/hub/calculadora"
        className="group mb-8 flex items-center gap-5 rounded-2xl border border-border/60 bg-background/60 px-6 py-5 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.16)]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-ink)] text-[var(--paper)]">
          <Calculator className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="eyebrow mb-1">Ferramenta inclusa</p>
          <p className="font-display text-lg">Calculadora RMI Pro-rata</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Laudo técnico com tabela detalhada, fórmulas e rodapé identificável — pronto para anexar ao processo.
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>

      {/* Atalho: Histórico de laudos */}
      <Link
        to="/hub/laudos"
        className="group mb-8 flex items-center gap-5 rounded-2xl border border-border/60 bg-background/60 px-6 py-4 backdrop-blur-md shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[var(--shadow-soft-hover)]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-foreground">
          <FileText className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="font-display text-base">Histórico de laudos</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Reabra e baixe novamente qualquer laudo PDF gerado anteriormente.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>

      {isAdmin && (
        <Link
          to="/hub/leads"
          className="group mb-8 flex items-center gap-5 rounded-2xl border border-[var(--accent-ink)]/40 bg-[var(--accent-ink)]/5 px-6 py-4 backdrop-blur-md shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent-ink)] hover:shadow-[var(--shadow-soft-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-ink)] text-[var(--paper)]">
            <Inbox className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="eyebrow mb-1 text-[var(--accent-ink)]">Admin</p>
            <p className="font-display text-base">Leads da calculadora</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Veja, contate e acompanhe o status de cada lead que veio do site.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      )}

      <ContinueReading items={recentItems} />

      <section>
        <DashboardFilters
          regiao={regiao}
          status={status}
          onRegiao={setRegiao}
          onStatus={setStatus}
          totalVisivel={paisesFiltrados.length}
        />
        {paisesFiltrados.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            Nenhum país nesse filtro.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {paisesFiltrados.map((p) => (
              <li key={p.slug}>
                <CountryCard pais={p} hasAccess={hasAccess} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-10 flex items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link to="/conta" className="hover:text-foreground">Minha conta</Link>
        {data?.isActive && data?.periodEnd && (
          <span>
            Assinatura ativa até{" "}
            {new Date(data.periodEnd).toLocaleDateString("pt-BR")}
          </span>
        )}
      </footer>
    </div>
  );
}
