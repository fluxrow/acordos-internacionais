import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { guias } from "@/data/guias";

const SAIDA_FISCAL = {
  slug: "saida-definitiva-do-pais",
  titulo: "Comunicação de Saída Definitiva do País",
  novo: true,
};

export function SiteHeader() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

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
            className="text-foreground/80 transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Países
          </Link>
          <Link
            to="/jornadas"
            className="text-foreground/80 transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Jornadas
          </Link>
          <Link
            to="/calculadora"
            className="text-foreground/80 transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Calculadora
          </Link>
          <div className="group relative">
            <Link
              to="/guias"
              className="inline-flex items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
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
                      <span className="shrink-0 rounded-full border border-[var(--accent-ink)] bg-[var(--accent-ink-soft)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                        Novo
                      </span>
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
            className="text-foreground/80 transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Hub Profissional
          </Link>

          {isAuthed ? (
            <>
              <Link
                to="/hub"
                className="rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
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
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground underline underline-offset-8" }}
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>

        <Link
          to={isAuthed ? "/hub" : "/calculadora"}
          className="text-sm underline underline-offset-4 md:hidden"
        >
          {isAuthed ? "Meu Hub" : "Calculadora"}
        </Link>
      </div>
    </header>
  );
}
