import { Link } from "@tanstack/react-router";

interface ProContentLockProps {
  contexto?: string;
  itens?: string[];
}

const ITENS_PADRAO = [
  "Texto integral do acordo e do decreto",
  "Portarias do INSS comentadas",
  "Lista de documentos e formulários oficiais",
  "Modelos de petição e requerimento",
  "Calculadora de totalização",
  "Fluxograma processual passo a passo",
  "Jurisprudência relevante por tema",
];

export function ProContentLock({
  contexto = "Conteúdo profissional",
  itens = ITENS_PADRAO,
}: ProContentLockProps) {
  return (
    <section
      aria-label="Conteúdo restrito ao hub profissional"
      className="relative overflow-hidden rounded-xl border border-border/60 bg-background/70 p-8 md:p-10 backdrop-blur-sm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,_var(--accent-ink-soft)_0%,_transparent_55%),radial-gradient(ellipse_at_10%_95%,_var(--accent-ink-soft)_0%,_transparent_50%)] opacity-90"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow flex items-center gap-2 text-[var(--accent-ink)]">
            <LockIcon /> Hub Profissional
          </p>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Acesso vitalício
          </span>
        </div>

        <h3 className="mt-4 max-w-2xl font-display text-2xl leading-tight md:text-3xl">
          {contexto}
        </h3>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          A profundidade técnica — texto integral, portarias comentadas, modelos
          editáveis e calculadora — fica reservada a advogados que conduzem casos
          sob o acordo.
        </p>

        <ul className="mt-7 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/30 sm:grid-cols-2">
          {itens.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-[var(--paper-soft)] p-4 text-sm text-foreground/85 transition-colors hover:bg-[var(--card-bg)]"
            >
              <LockIcon className="mt-0.5 shrink-0 text-[var(--accent-ink)]/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/profissional"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
          >
            Acessar o hub <span aria-hidden>→</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            Pagamento único · acesso vitalício
          </span>
        </div>
      </div>
    </section>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className={className}
    >
      <rect x="4" y="11" width="16" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}
