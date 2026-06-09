import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, LogOut, ExternalLink } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

type Crumb = { label: string; to?: string };

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/conta") return [{ label: "Hub", to: "/hub" }, { label: "Minha conta" }];
  if (pathname.startsWith("/hub/calculadora"))
    return [{ label: "Hub", to: "/hub" }, { label: "Calculadora" }];
  if (pathname.startsWith("/hub/laudos"))
    return [{ label: "Hub", to: "/hub" }, { label: "Laudos" }];
  if (pathname.startsWith("/hub/laudo"))
    return [{ label: "Hub", to: "/hub" }, { label: "Laudo" }];
  if (pathname.startsWith("/hub/leads"))
    return [{ label: "Hub", to: "/hub" }, { label: "Leads", to: "/hub/leads" }];
  const m = pathname.match(/^\/hub\/([^/]+)$/);
  if (m) {
    return [
      { label: "Hub", to: "/hub" },
      { label: "Países", to: "/hub" },
      { label: decodeURIComponent(m[1]).replace(/-/g, " ") },
    ];
  }
  return [{ label: "Hub Profissional" }];
}

export function HubTopbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = buildCrumbs(pathname);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-border/60 bg-[var(--surface-premium-strong)] px-3 backdrop-blur-md print:hidden">
      <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />

      <nav className="flex min-w-0 items-center gap-1.5 text-[12px]" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <div key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRight aria-hidden className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            )}
            {c.to ? (
              <Link
                to={c.to}
                className="truncate text-muted-foreground hover:text-foreground"
              >
                {c.label}
              </Link>
            ) : (
              <span className="truncate capitalize text-foreground">{c.label}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <Link
          to="/"
          className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
        >
          <ExternalLink className="h-3 w-3" />
          Site
        </Link>
        <ThemeToggle />
        <button
          type="button"
          onClick={signOut}
          aria-label="Sair"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
