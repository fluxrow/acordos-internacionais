import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
            to="/guias/$slug"
            params={{ slug: "totalizacao" }}
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Guias
          </Link>
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
          to={isAuthed ? "/hub" : "/acordos"}
          className="text-sm underline underline-offset-4 md:hidden"
        >
          {isAuthed ? "Meu Hub" : "Países"}
        </Link>
      </div>
    </header>
  );
}
