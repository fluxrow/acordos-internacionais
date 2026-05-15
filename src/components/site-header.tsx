import { Link } from "@tanstack/react-router";

export function SiteHeader() {
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
            to="/jornadas/$jornada"
            params={{ jornada: "moro-fora" }}
            className="text-foreground/80 transition-colors hover:text-foreground"
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
            to="/sobre/dr-marcos"
            className="text-foreground/80 transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground underline underline-offset-8" }}
          >
            Dr. Marcos
          </Link>
          <Link
            to="/profissional"
            className="rounded-sm border border-foreground bg-foreground px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
          >
            Hub profissional
          </Link>
        </nav>

        <Link
          to="/acordos"
          className="text-sm underline underline-offset-4 md:hidden"
        >
          Países
        </Link>
      </div>
    </header>
  );
}
