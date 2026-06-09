import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Copy,
  MessageCircle,
  Check,
  Search,
  Inbox,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  listAdminLeads,
  updateAdminLead,
  type AdminLead,
  type LeadStatus,
} from "@/lib/admin-leads.functions";
import { getHubDashboard } from "@/lib/hub.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/hub/section-card";

export const Route = createFileRoute("/_authenticated/hub/leads")({
  component: HubLeadsPage,
});

const STATUS_LABEL: Record<LeadStatus, string> = {
  novo: "Novo",
  contatado: "Contatado",
  convertido: "Convertido",
  descartado: "Descartado",
};

const STATUS_TONE: Record<LeadStatus, string> = {
  novo: "border-[var(--rule-gold-strong)] bg-[color-mix(in_oklab,var(--accent-ink)_12%,transparent)] text-[var(--accent-ink)]",
  contatado: "border-[var(--state-info)]/40 bg-[var(--state-info-soft)]/40 text-[var(--state-info)]",
  convertido: "border-[var(--state-success)]/40 bg-[var(--state-success-soft)]/40 text-[var(--state-success)]",
  descartado: "border-border/60 bg-background/60 text-muted-foreground",
};

function waUrl(tel: string): string | null {
  const d = tel.replace(/\D/g, "");
  if (d.length < 10) return null;
  return `https://wa.me/55${d.replace(/^55/, "")}`;
}

function fmtMeses(m: number | null): string {
  if (m == null) return "—";
  const a = Math.floor(m / 12);
  const r = m % 12;
  if (a === 0) return `${m}m`;
  if (r === 0) return `${a}a`;
  return `${a}a ${r}m`;
}

function HubLeadsPage() {
  const qc = useQueryClient();
  const dashboard = useQuery({
    queryKey: ["hub-dashboard"],
    queryFn: () => getHubDashboard(),
  });
  const leads = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => listAdminLeads(),
    enabled: dashboard.data?.isAdmin === true,
  });

  const [filtroStatus, setFiltroStatus] = useState<LeadStatus | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);

  const mutate = useMutation({
    mutationFn: (input: { id: string; status?: LeadStatus; notas?: string | null }) =>
      updateAdminLead({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  const filtrados = useMemo<AdminLead[]>(() => {
    const list = leads.data ?? [];
    const q = busca.trim().toLowerCase();
    return list.filter((l) => {
      if (filtroStatus !== "todos" && l.status !== filtroStatus) return false;
      if (!q) return true;
      return (
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.pais ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads.data, filtroStatus, busca]);

  if (dashboard.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!dashboard.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta página é visível apenas para administradores.
        </p>
        <div className="mt-6">
          <Link
            to="/hub"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent-ink)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao Hub
          </Link>
        </div>
      </div>
    );
  }

  const all = leads.data ?? [];
  const total = all.length;
  const counts = {
    novo: all.filter((l) => l.status === "novo").length,
    contatado: all.filter((l) => l.status === "contatado").length,
    convertido: all.filter((l) => l.status === "convertido").length,
    descartado: all.filter((l) => l.status === "descartado").length,
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background">
      {/* Header */}
      <section className="border-b border-border/60 bg-[var(--surface-premium)] print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 py-6">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Admin · Pipeline
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Leads <span className="text-gold">recebidos</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} no total · {counts.novo} aguardando primeiro contato
            </p>
          </div>
        </div>
      </section>

      {/* IDE 2-col */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Lista densa */}
          <div className="lg:col-span-9">
            <SectionCard gold padded={false}>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-5 py-3">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  <Inbox className="h-4 w-4 text-[var(--accent-ink)]" />
                  Pipeline
                  <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium tracking-normal text-muted-foreground">
                    {filtrados.length}
                  </span>
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar nome, e-mail, país…"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="h-8 w-60 pl-8 text-xs"
                    />
                  </div>
                  <Select
                    value={filtroStatus}
                    onValueChange={(v) => setFiltroStatus(v as LeadStatus | "todos")}
                  >
                    <SelectTrigger className="h-8 w-40 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="novo">Novos</SelectItem>
                      <SelectItem value="contatado">Contatados</SelectItem>
                      <SelectItem value="convertido">Convertidos</SelectItem>
                      <SelectItem value="descartado">Descartados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {leads.isPending ? (
                <div className="flex items-center gap-2 px-5 py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando leads…
                </div>
              ) : filtrados.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Nenhum lead com esse filtro.
                </p>
              ) : (
                <div className="hub-scroll overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-background/40 text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        <th className="w-8 px-3 py-2 font-medium" />
                        <th className="px-3 py-2 font-medium">Lead</th>
                        <th className="px-3 py-2 font-medium">País / Tipo</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Recebido</th>
                        <th className="px-5 py-2 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrados.map((l) => {
                        const isOpen = aberto === l.id;
                        const isNew = l.status === "novo";
                        return (
                          <LeadRow
                            key={l.id}
                            l={l}
                            isOpen={isOpen}
                            isNew={isNew}
                            copiado={copiado === l.id}
                            onToggle={() => setAberto(isOpen ? null : l.id)}
                            onCopy={() => {
                              navigator.clipboard.writeText(l.email);
                              setCopiado(l.id);
                              setTimeout(
                                () => setCopiado((c) => (c === l.id ? null : c)),
                                1500,
                              );
                            }}
                            onStatus={(s) =>
                              mutate.mutate({ id: l.id, status: s })
                            }
                            onNotas={(n) => mutate.mutate({ id: l.id, notas: n })}
                          />
                        );
                      })}
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
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Funil
                </h3>
                <ul className="mt-3 space-y-1.5 text-xs">
                  {(
                    [
                      ["novo", "Novos", counts.novo],
                      ["contatado", "Contatados", counts.contatado],
                      ["convertido", "Convertidos", counts.convertido],
                      ["descartado", "Descartados", counts.descartado],
                    ] as const
                  ).map(([k, label, n]) => {
                    const active = filtroStatus === k;
                    return (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() =>
                            setFiltroStatus(active ? "todos" : (k as LeadStatus))
                          }
                          className={`flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-left transition-colors ${
                            active
                              ? "border-[var(--rule-gold-strong)] bg-[color-mix(in_oklab,var(--accent-ink)_10%,transparent)] text-[var(--accent-ink)]"
                              : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span>{label}</span>
                          <span className="font-mono text-[11px]">{n}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </SectionCard>

              <SectionCard>
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Dica
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Clique na linha para expandir detalhes da triagem e editar
                  notas internas. WhatsApp e e-mail ficam em ações rápidas.
                </p>
              </SectionCard>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function LeadRow({
  l,
  isOpen,
  isNew,
  copiado,
  onToggle,
  onCopy,
  onStatus,
  onNotas,
}: {
  l: AdminLead;
  isOpen: boolean;
  isNew: boolean;
  copiado: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onStatus: (s: LeadStatus) => void;
  onNotas: (n: string) => void;
}) {
  const wa = waUrl(l.telefone);
  const dt = new Date(l.created_at);
  const dtStr = dt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const horaStr = dt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <tr
        className={`group cursor-pointer border-b border-border/30 transition-colors hover:bg-[var(--surface-premium)] ${
          isNew
            ? "border-l-2 border-l-[var(--rule-gold-strong)]"
            : "border-l-2 border-l-transparent"
        }`}
        onClick={onToggle}
      >
        <td className="px-3 py-3 align-top text-muted-foreground">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </td>
        <td className="px-3 py-3 align-top">
          <p className="font-medium text-foreground">{l.nome}</p>
          <p className="truncate text-[11px] text-muted-foreground">{l.email}</p>
        </td>
        <td className="px-3 py-3 align-top text-xs">
          <p className="text-foreground">{l.pais ?? "—"}</p>
          <p className="text-muted-foreground">{l.tipo ?? "—"}</p>
        </td>
        <td className="px-3 py-3 align-top">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${STATUS_TONE[l.status]}`}
          >
            {STATUS_LABEL[l.status]}
          </span>
        </td>
        <td className="px-3 py-3 align-top text-xs">
          <span className="text-foreground">{dtStr}</span>{" "}
          <span className="text-muted-foreground/70">{horaStr}</span>
        </td>
        <td
          className="px-5 py-3 text-right align-top"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex items-center gap-1">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--state-success-soft)]/40 hover:text-[var(--state-success)]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onCopy}
              title="Copiar e-mail"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="border-b border-border/30 bg-[var(--surface-premium)]/50">
          <td colSpan={6} className="px-5 py-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs md:grid-cols-4">
              <Field label="Telefone" value={l.telefone} />
              <Field label="Tempo Brasil" value={fmtMeses(l.tempo_brasil_meses)} />
              <Field label="Tempo exterior" value={fmtMeses(l.tempo_pais_meses)} />
              <Field label="Triagem" value={l.resultado_caso ?? "—"} />
            </dl>
            <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr]">
              <div>
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Status
                </p>
                <Select
                  value={l.status}
                  onValueChange={(v) => onStatus(v as LeadStatus)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contatado">Contatado</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
                    <SelectItem value="descartado">Descartado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Notas internas
                </p>
                <NotasEditor initial={l.notas ?? ""} onSave={onNotas} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}

function NotasEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (notas: string) => void;
}) {
  const [val, setVal] = useState(initial);
  const dirty = val !== initial;
  return (
    <div className="flex gap-2">
      <Textarea
        placeholder="Notas internas…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={2}
        className="flex-1 text-xs"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!dirty}
        onClick={() => onSave(val)}
      >
        Salvar
      </Button>
    </div>
  );
}
