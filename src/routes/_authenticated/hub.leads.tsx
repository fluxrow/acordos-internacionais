import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Copy, MessageCircle, Check } from "lucide-react";
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
  novo: "bg-[var(--accent-ink)]/15 text-[var(--accent-ink)] border-[var(--accent-ink)]/30",
  contatado: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  convertido: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  descartado: "bg-muted text-muted-foreground border-border",
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
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
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

  const total = leads.data?.length ?? 0;
  const novos = (leads.data ?? []).filter((l) => l.status === "novo").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Admin · Leads da calculadora</p>
          <h1 className="font-display text-3xl">
            Leads <span className="text-gold">recebidos</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} no total · {novos} aguardando primeiro contato
          </p>
        </div>
        <Link
          to="/hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Hub
        </Link>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nome, e-mail ou país…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filtroStatus}
          onValueChange={(v) => setFiltroStatus(v as LeadStatus | "todos")}
        >
          <SelectTrigger className="w-44">
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

      {leads.isPending ? (
        <p className="text-sm text-muted-foreground">Carregando leads…</p>
      ) : filtrados.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Nenhum lead com esse filtro.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((l) => {
            const wa = waUrl(l.telefone);
            const created = new Date(l.created_at).toLocaleString("pt-BR");
            return (
              <li
                key={l.id}
                className="rounded-2xl border border-border bg-background/60 p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-soft-hover)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg">{l.nome}</p>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${STATUS_TONE[l.status]}`}
                      >
                        {STATUS_LABEL[l.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{created}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(l.email);
                        setCopiado(l.id);
                        setTimeout(() => setCopiado((c) => (c === l.id ? null : c)), 1500);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
                    >
                      {copiado === l.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> E-mail
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      E-mail
                    </dt>
                    <dd className="truncate">{l.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Telefone
                    </dt>
                    <dd>{l.telefone}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      País
                    </dt>
                    <dd>{l.pais ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tipo
                    </dt>
                    <dd>{l.tipo ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tempo Brasil
                    </dt>
                    <dd>{fmtMeses(l.tempo_brasil_meses)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tempo exterior
                    </dt>
                    <dd>{fmtMeses(l.tempo_pais_meses)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Resultado da triagem
                    </dt>
                    <dd>{l.resultado_caso ?? "—"}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr_auto]">
                  <Select
                    value={l.status}
                    onValueChange={(v) =>
                      mutate.mutate({ id: l.id, status: v as LeadStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="contatado">Contatado</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                      <SelectItem value="descartado">Descartado</SelectItem>
                    </SelectContent>
                  </Select>
                  <NotasEditor
                    initial={l.notas ?? ""}
                    onSave={(notas) => mutate.mutate({ id: l.id, notas })}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
    <div className="flex gap-2 md:col-span-2">
      <Textarea
        placeholder="Notas internas…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={2}
        className="flex-1"
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
