import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Trash2, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import {
  listarLaudosHistorico,
  excluirLaudoHistorico,
  type LaudoHistoricoItem,
} from "@/lib/laudo-historico";
import { formatarMoeda } from "@/lib/calculadora";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/hub/laudos")({
  head: () => ({
    meta: [
      { title: "Histórico de Laudos — Hub Profissional" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: HistoricoLaudosPage,
});

function HistoricoLaudosPage() {
  const qc = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ["hub-laudos"],
    queryFn: listarLaudosHistorico,
  });

  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const delMutation = useMutation({
    mutationFn: excluirLaudoHistorico,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hub-laudos"] }),
    onSettled: () => setExcluindoId(null),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <Link
          to="/hub/calculadora"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar à calculadora
        </Link>
        <p className="eyebrow mb-1">Hub Profissional</p>
        <h1 className="font-display text-4xl">
          Histórico de <span className="text-gold">Laudos</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Todos os laudos PDF que você gerou ficam aqui. Reabra para imprimir ou compartilhar de novo.
        </p>
      </header>

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      )}

      {error && (
        <p className="border-l-2 border-[var(--state-error)] bg-[var(--state-error-soft)]/40 px-4 py-3 text-sm text-[var(--state-error)]">
          Falha ao carregar o histórico.
        </p>
      )}

      {!isPending && !error && (data?.length ?? 0) === 0 && (
        <EmptyState />
      )}

      {!isPending && (data?.length ?? 0) > 0 && (
        <ul className="space-y-3">
          {data!.map((l) => (
            <LaudoRow
              key={l.id}
              laudo={l}
              excluindo={excluindoId === l.id || (delMutation.isPending && excluindoId === l.id)}
              onExcluir={() => {
                if (!confirm(`Excluir o laudo #${l.ref}? Esta ação não pode ser desfeita.`)) return;
                setExcluindoId(l.id);
                delMutation.mutate(l.id);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function LaudoRow({
  laudo, excluindo, onExcluir,
}: { laudo: LaudoHistoricoItem; excluindo: boolean; onExcluir: () => void }) {
  const dt = new Date(laudo.created_at);
  const dtStr = dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const horaStr = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const rmi = laudo.rmi_valor != null ? formatarMoeda(Number(laudo.rmi_valor)) : "—";
  const caso = laudo.caso ?? "—";
  const cliente = laudo.cliente_nome?.trim() || "(sem nome)";

  return (
    <li className="group rounded-2xl border border-border/60 bg-background/60 p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[var(--shadow-soft-hover)]">
      <div className="flex flex-wrap items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-ink)] text-[var(--paper)]">
          <FileText className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="truncate font-display text-lg leading-tight">{cliente}</p>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              #{laudo.ref}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {laudo.pais ?? "—"}
            {laudo.cliente_cpf ? <> · CPF {laudo.cliente_cpf}</> : null}
            {" · "}
            <span className="text-foreground">{dtStr}</span>
            <span className="text-muted-foreground/70"> {horaStr}</span>
          </p>
          <p className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em]">
            <span className="rounded-sm border border-border/60 bg-background/80 px-2 py-0.5 text-muted-foreground">
              Caso {caso}
            </span>
            <span className="rounded-sm border border-border/60 bg-background/80 px-2 py-0.5 text-foreground">
              RMI {rmi}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 print:hidden">
          <a
            href={`/hub/laudo?id=${laudo.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-all hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Abrir
          </a>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-sm text-muted-foreground hover:text-[var(--state-error)]"
            disabled={excluindo}
            onClick={onExcluir}
          >
            {excluindo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Excluir
          </Button>
        </div>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-10 text-center">
      <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
      <h2 className="font-display text-xl">Nenhum laudo gerado ainda</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Vá até a <Link to="/hub/calculadora" className="underline underline-offset-4 hover:text-foreground">calculadora Pro</Link>,
        rode um cenário e clique em <strong>Gerar laudo PDF</strong>. Cada laudo emitido aparece aqui automaticamente.
      </p>
    </div>
  );
}
