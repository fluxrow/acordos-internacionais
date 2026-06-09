import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  FileText,
  Trash2,
  ExternalLink,
  Loader2,
  Download,
  Search,
  Calculator,
  Sparkles,
} from "lucide-react";
import {
  listarLaudosHistorico,
  excluirLaudoHistorico,
  type LaudoHistoricoItem,
} from "@/lib/laudo-historico";
import { formatarMoeda } from "@/lib/calculadora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/hub/section-card";

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
  const [busca, setBusca] = useState("");

  const delMutation = useMutation({
    mutationFn: excluirLaudoHistorico,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hub-laudos"] }),
    onSettled: () => setExcluindoId(null),
  });

  const filtrados = useMemo(() => {
    const list = data ?? [];
    const q = busca.trim().toLowerCase();
    if (!q) return list;
    return list.filter((l) =>
      [l.cliente_nome, l.cliente_cpf, l.pais, l.ref, l.caso]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [data, busca]);

  const total = data?.length ?? 0;

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background">
      {/* Header premium */}
      <section className="border-b border-border/60 bg-[var(--surface-premium)] print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Workstation · Arquivo
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Histórico de <span className="text-gold">Laudos</span>
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Todos os PDFs gerados ficam aqui. Reabra para imprimir ou
              compartilhar novamente.
            </p>
          </div>
          <Link
            to="/hub/calculadora"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--rule-gold-strong)] bg-[color-mix(in_oklab,var(--accent-ink)_10%,transparent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklab,var(--accent-ink)_16%,transparent)]"
          >
            <Calculator className="h-3.5 w-3.5" />
            Novo cálculo
          </Link>
        </div>
      </section>

      {/* IDE 2-col */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Tabela densa */}
          <div className="lg:col-span-9">
            <SectionCard gold padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-5 py-3">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  <FileText className="h-4 w-4 text-[var(--accent-ink)]" />
                  Laudos emitidos
                  <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium tracking-normal text-muted-foreground">
                    {total}
                  </span>
                </h2>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por cliente, país, ref…"
                    className="h-8 w-64 pl-8 text-xs"
                  />
                </div>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 px-5 py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando histórico…
                </div>
              )}

              {error && (
                <p className="m-5 border-l-2 border-[var(--state-error)] bg-[var(--state-error-soft)]/40 px-4 py-3 text-sm text-[var(--state-error)]">
                  Falha ao carregar o histórico.
                </p>
              )}

              {!isPending && !error && total === 0 && <EmptyState />}

              {!isPending && total > 0 && filtrados.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Nenhum laudo corresponde a "{busca}".
                </p>
              )}

              {!isPending && filtrados.length > 0 && (
                <div className="hub-scroll overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-background/40 text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        <th className="px-5 py-2 font-medium">Cliente</th>
                        <th className="px-3 py-2 font-medium">País</th>
                        <th className="px-3 py-2 font-medium">Caso</th>
                        <th className="px-3 py-2 text-right font-medium">RMI</th>
                        <th className="px-3 py-2 font-medium">Emitido</th>
                        <th className="px-5 py-2 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrados.map((l) => (
                        <LaudoRow
                          key={l.id}
                          laudo={l}
                          excluindo={excluindoId === l.id && delMutation.isPending}
                          onExcluir={() => {
                            if (!confirm(`Excluir o laudo #${l.ref}? Esta ação não pode ser desfeita.`)) return;
                            setExcluindoId(l.id);
                            delMutation.mutate(l.id);
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Rail */}
          <aside className="space-y-4 lg:col-span-3">
            <div className="sticky top-16 space-y-4">
              <SectionCard>
                <h3 className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent-ink)]" />
                  Atalho
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Cada cálculo finalizado vira um laudo PDF no histórico —
                  pronto para anexar ao processo.
                </p>
                <Link
                  to="/hub/calculadora"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-ink)] px-3 py-2 text-xs font-medium text-[var(--paper)] transition-opacity hover:opacity-90"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  Abrir calculadora
                </Link>
              </SectionCard>

              <SectionCard>
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Dica
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use <kbd className="rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[10px]">Baixar PDF</kbd>{" "}
                  para abrir direto no modo impressão do navegador.
                </p>
              </SectionCard>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function LaudoRow({
  laudo,
  excluindo,
  onExcluir,
}: {
  laudo: LaudoHistoricoItem;
  excluindo: boolean;
  onExcluir: () => void;
}) {
  const dt = new Date(laudo.created_at);
  const dtStr = dt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const horaStr = dt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const rmi = laudo.rmi_valor != null ? formatarMoeda(Number(laudo.rmi_valor)) : "—";
  const caso = laudo.caso ?? "—";
  const cliente = laudo.cliente_nome?.trim() || "(sem nome)";

  return (
    <tr className="group border-b border-border/30 transition-colors hover:bg-[var(--surface-premium)]">
      <td className="px-5 py-3 align-top">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)] text-[var(--accent-ink)]">
            <FileText className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{cliente}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              #{laudo.ref}
              {laudo.cliente_cpf ? ` · ${laudo.cliente_cpf}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 align-top text-foreground">{laudo.pais ?? "—"}</td>
      <td className="px-3 py-3 align-top">
        <span className="rounded-sm border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {caso}
        </span>
      </td>
      <td className="px-3 py-3 text-right align-top font-mono text-xs text-foreground">
        {rmi}
      </td>
      <td className="px-3 py-3 align-top text-xs">
        <span className="text-foreground">{dtStr}</span>{" "}
        <span className="text-muted-foreground/70">{horaStr}</span>
      </td>
      <td className="px-5 py-3 text-right align-top print:hidden">
        <div className="inline-flex items-center gap-1">
          <a
            href={`/hub/laudo?id=${laudo.id}&print=1`}
            target="_blank"
            rel="noopener noreferrer"
            title="Baixar PDF"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)] hover:text-[var(--accent-ink)]"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <a
            href={`/hub/laudo?id=${laudo.id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Excluir"
            className="h-7 w-7 text-muted-foreground hover:bg-[var(--state-error-soft)]/40 hover:text-[var(--state-error)]"
            disabled={excluindo}
            onClick={onExcluir}
          >
            {excluindo ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-12 text-center">
      <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
      <h2 className="font-display text-base text-foreground">
        Nenhum laudo gerado ainda
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Vá até a{" "}
        <Link
          to="/hub/calculadora"
          className="text-[var(--accent-ink)] underline underline-offset-4"
        >
          calculadora Pro
        </Link>
        , rode um cenário e clique em <strong>Gerar laudo PDF</strong>. Cada
        laudo emitido aparece aqui automaticamente.
      </p>
    </div>
  );
}
