import { Link } from "@tanstack/react-router";

export function PreviewBanner() {
  return (
    <div className="sticky top-0 z-50 border-b border-[var(--accent-ink)]/30 bg-[var(--accent-ink-soft)] print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs">
        <p className="font-medium text-foreground">
          <span aria-hidden>🧪</span>{" "}
          <span className="uppercase tracking-[0.14em] text-[var(--accent-ink)]">
            Pré-visualização
          </span>{" "}
          — versão proposta pelo briefing do Dr. Marcos. Não publicada. Não indexada.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/preview"
            className="underline underline-offset-4 hover:text-[var(--accent-ink)]"
          >
            Índice
          </Link>
          <Link
            to="/"
            className="underline underline-offset-4 hover:text-[var(--accent-ink)]"
          >
            ← Site atual
          </Link>
        </div>
      </div>
    </div>
  );
}
