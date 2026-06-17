import { REGIOES, type Regiao } from "@/data/regioes";

export type StatusFiltro = "todos" | "com-material" | "em-ratificacao";
export type RegiaoFiltro = "todas" | Regiao;

export function DashboardFilters({
  regiao,
  status,
  onRegiao,
  onStatus,
  totalVisivel,
}: {
  regiao: RegiaoFiltro;
  status: StatusFiltro;
  onRegiao: (r: RegiaoFiltro) => void;
  onStatus: (s: StatusFiltro) => void;
  totalVisivel: number;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
      <FilterGroup label="Região">
        <Chip active={regiao === "todas"} onClick={() => onRegiao("todas")}>
          Todas
        </Chip>
        {REGIOES.map((r) => (
          <Chip key={r} active={regiao === r} onClick={() => onRegiao(r)}>
            {r}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Status">
        <Chip active={status === "todos"} onClick={() => onStatus("todos")}>
          Todos
        </Chip>
        <Chip
          active={status === "com-material"}
          onClick={() => onStatus("com-material")}
        >
          Com material
        </Chip>
        <Chip
          active={status === "em-curadoria"}
          onClick={() => onStatus("em-curadoria")}
        >
          Em curadoria
        </Chip>
      </FilterGroup>

      <span className="ml-auto text-xs text-muted-foreground">
        {totalVisivel} {totalVisivel === 1 ? "país" : "países"}
      </span>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
