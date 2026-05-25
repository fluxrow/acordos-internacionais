import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock, FileText } from "lucide-react";
import { listCalcs, type CalcHistoryItem } from "@/lib/hub-personal.functions";

function parseRes(s: string): { rmiProrata?: number; rmiTeorica?: number; titulo?: string } {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CalcHistoryList() {
  const { data, isPending } = useQuery({
    queryKey: ["calc-history"],
    queryFn: () => listCalcs(),
  });

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">Carregando histórico…</p>
    );
  }
  const items: CalcHistoryItem[] = data ?? [];
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
        Nenhum cálculo salvo ainda. Use "Salvar este cálculo" após gerar um laudo.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((c) => {
        const r = parseRes(c.resultado);
        const valor = r.rmiProrata ?? r.rmiTeorica;
        return (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {c.pais} ·{" "}
                {c.tipo === "pensao_morte" ? "Pensão por Morte" : "Aposentadoria"}
              </p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(c.created_at).toLocaleString("pt-BR")}
                {valor != null && <span>· {formatBRL(valor)}</span>}
              </p>
            </div>
          </li>
        );
      })}
      <li className="pt-2 text-right">
        <Link
          to="/hub"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Voltar ao hub →
        </Link>
      </li>
    </ul>
  );
}
