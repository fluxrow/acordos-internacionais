import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { guias } from "@/data/guias";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";


const SAIDA_FISCAL = {
  slug: "saida-definitiva-do-pais",
  titulo: "Comunicação de Saída Definitiva do País",
  novo: true,
};

export function SiteHeader() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthed(!!session)
    );
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Acordos Internacionais
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Previdência · BR
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            to="/acordos"
            className="text-[var(--ink-soft)] transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Países
          </Link>
          <Link
            to="/jornadas"
            className="text-[var(--ink-soft)] transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Jornadas
          </Link>
          <Link
            to="/calculadora"
            className="text-[var(--ink-soft)] transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Calculadora
          </Link>
          <div className="group relative">
            <Link
              to="/guias"
              className="inline-flex items-center gap-1 text-[var(--ink-soft)] transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline underline-offset-8" }}
            >
              Guias
              <span aria-hidden className="text-xs opacity-60 transition-transform group-hover:rotate-180">▾</span>
            </Link>
            <div
              className="invisible absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              role="menu"
            >
              <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]">
                <div className="border-b border-border bg-[var(--accent-ink-soft)]/40 px-5 py-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
                    Biblioteca de guias
                  </p>
                </div>
                <ul className="divide-y divide-border">
                  {guias.map((g) => (
                    <li key={g.slug}>
                      <Link
                        to="/guias/$slug"
                        params={{ slug: g.slug }}
                        className="block px-5 py-3 text-sm text-foreground/85 transition-colors hover:bg-[var(--accent-ink-soft)] hover:text-foreground"
                      >
                        {g.titulo}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/guias/saida-definitiva-do-pais"
                      className="flex items-center justify-between gap-3 px-5 py-3 text-sm text-foreground/85 transition-colors hover:bg-[var(--accent-ink-soft)] hover:text-foreground"
                    >
                      <span>{SAIDA_FISCAL.titulo}</span>
                    </Link>
                  </li>
                </ul>
                <div className="border-t border-border px-5 py-3">
                  <Link
                    to="/guias"
                    className="text-xs underline underline-offset-4 hover:text-[var(--accent-ink)]"
                  >
                    Ver todos os guias →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/profissional"
            className="text-[var(--ink-soft)] transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Hub Profissional
          </Link>

          {isAuthed ? (
            <>
              <Link
                to="/hub"
                className="rounded-full border border-[var(--accent-ink)] bg-[var(--accent-ink)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
              >
                Meu Hub
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
              >
                Sair
              </button>
              <ThemeToggle />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[var(--ink-soft)] transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground underline underline-offset-8" }}
              >
                Entrar no Hub
              </Link>
              <Link
                to="/cadastro"
                className="rounded-full border border-[var(--accent-ink)] bg-[var(--accent-ink)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
              >
                Criar conta no Hub
              </Link>
              <ThemeToggle />
            </>
          )}

        </nav>

        {/* Mobile: atalho + tema + hambúrguer */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to={isAuthed ? "/hub" : "/calculadora"}
            className="text-sm underline underline-offset-4"
          >
            {isAuthed ? "Meu Hub" : "Calculadora"}
          </Link>
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-[var(--accent-ink-soft)]"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto bg-background p-0">
              <SheetHeader className="border-b border-border px-6 py-5 text-left">
                <SheetTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                  Navegação
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-2 py-3 text-sm">
                <MobileLink to="/acordos" onClick={closeMobile}>Países</MobileLink>
                <MobileLink to="/jornadas" onClick={closeMobile}>Jornadas</MobileLink>
                <MobileLink to="/calculadora" onClick={closeMobile}>Calculadora</MobileLink>

                <div className="mt-4 px-4 pb-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
                    Guias
                  </p>
                </div>
                {guias.map((g) => (
                  <MobileLink
                    key={g.slug}
                    to="/guias/$slug"
                    params={{ slug: g.slug }}
                    onClick={closeMobile}
                    indent
                  >
                    {g.titulo}
                  </MobileLink>
                ))}
                <Link
                  to="/guias/saida-definitiva-do-pais"
                  onClick={closeMobile}
                  className="mx-2 flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-[13px] text-foreground/85 transition-colors hover:bg-[var(--accent-ink-soft)] hover:text-foreground"
                >
                  <span>{SAIDA_FISCAL.titulo}</span>
                </Link>
                <MobileLink to="/guias" onClick={closeMobile} indent muted>
                  Ver todos os guias →
                </MobileLink>

                <div className="my-3 h-px bg-border" />

                <MobileLink to="/profissional" onClick={closeMobile}>
                  Hub Profissional
                </MobileLink>

                <div className="my-3 h-px bg-border" />

                {isAuthed ? (
                  <>
                    <Link
                      to="/hub"
                      onClick={closeMobile}
                      className="mx-4 mt-2 inline-flex items-center justify-center rounded-full border border-[var(--accent-ink)] bg-[var(--accent-ink)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
                    >
                      Meu Hub
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        closeMobile();
                        handleSignOut(e);
                      }}
                      className="mx-4 mt-2 text-left text-xs uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <MobileLink to="/login" onClick={closeMobile}>
                      Entrar no Hub
                    </MobileLink>
                    <Link
                      to="/cadastro"
                      onClick={closeMobile}
                      className="mx-4 mt-2 inline-flex items-center justify-center rounded-full border border-[var(--accent-ink)] bg-[var(--accent-ink)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-[var(--accent-ink)] hover:text-[var(--paper)]"
                    >
                      Criar conta no Hub
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  to,
  params,
  onClick,
  children,
  indent = false,
  muted = false,
}: {
  to: string;
  params?: Record<string, string>;
  onClick: () => void;
  children: React.ReactNode;
  indent?: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      onClick={onClick}
      className={`mx-2 rounded-lg px-4 py-2.5 transition-colors hover:bg-[var(--accent-ink-soft)] hover:text-foreground ${
        indent ? "text-[13px]" : "text-sm"
      } ${muted ? "text-foreground/60" : "text-foreground/85"}`}
      activeProps={{ className: "bg-[var(--accent-ink-soft)] text-foreground" }}
    >
      {children}
    </Link>
  );
}
