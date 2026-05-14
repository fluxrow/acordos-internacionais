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
  "Calculadora de totalização e prorata",
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
      className="border border-border bg-secondary/60 p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow flex items-center gap-2">
          <LockIcon /> {contexto}
        </p>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Hub profissional
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        A profundidade técnica deste país está reservada à área profissional —
        feita para advogados que conduzem casos sob o acordo.
      </p>

      <ul className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        {itens.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 bg-background/70 p-4 text-sm text-muted-foreground"
          >
            <LockIcon className="mt-0.5 shrink-0 opacity-60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          to="/profissional"
          className="inline-flex items-center gap-2 rounded-sm border border-foreground bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
        >
          Acessar o hub <span aria-hidden>→</span>
        </Link>
        <span className="text-xs text-muted-foreground">
          Pagamento único · acesso vitalício
        </span>
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
