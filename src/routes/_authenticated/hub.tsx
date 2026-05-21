import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAccountData } from "@/lib/profile.functions";
import { CTAButton } from "@/components/cta-button";

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
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export const Route = createFileRoute("/_authenticated/hub")({
  component: HubDashboard,
});

function HubDashboard() {
  const { data, isPending } = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccountData(),
  });

  const active = data?.subscription?.status === "active";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <p className="eyebrow mb-1">{getGreeting()}</p>
        <h1 className="font-display text-4xl">
          {isPending ? " " : (data?.firstName ?? "você")}
        </h1>
        <p className="mt-1 text-muted-foreground">Hub Profissional — Acordos Previdenciários</p>
      </header>

      {!active && !isPending && (
        <div className="mb-8 rounded-2xl border border-border bg-secondary px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
          <p className="font-medium">Acesso bloqueado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assine o Hub Profissional para acessar os materiais técnicos de todos os acordos.
          </p>
          <div className="mt-4">
            <CTAButton to="/precos" variant="dark" label="Ver planos" />
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {PAISES.length} acordos disponíveis
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PAISES.map(({ slug, nome, flag }) => (
            <li key={slug}>
              <Link
                to="/hub/$pais"
                params={{ pais: slug }}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.12)]"
              >
                {flag ? (
                  <img
                    src={`https://flagcdn.com/w40/${flag}.png`}
                    srcSet={`https://flagcdn.com/w80/${flag}.png 2x`}
                    alt={nome}
                    width={40}
                    height={30}
                    className="rounded-md object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-[30px] w-[40px] items-center justify-center rounded-md bg-secondary text-xs text-muted-foreground">
                    MULTI
                  </span>
                )}
                <span className="text-center text-xs leading-tight">{nome}</span>
                {!active && (
                  <span className="text-[10px] text-muted-foreground">🔒</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 flex items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link to="/conta" className="hover:text-foreground">Minha conta</Link>
        {active && data?.subscription?.periodEnd && (
          <span>
            Assinatura ativa até{" "}
            {new Date(data.subscription.periodEnd).toLocaleDateString("pt-BR")}
          </span>
        )}
      </footer>
    </div>
  );
}
