import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccountData, createPortalSession } from "@/lib/profile.functions";
import { listMyDevices, releaseOtherSessions, releaseSession } from "@/lib/session-guard.functions";
import { getDeviceId } from "@/lib/device-id";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conta")({
  component: ContaPage,
});


const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  inactive: "Inativa",
  past_due: "Pagamento pendente",
  canceled: "Cancelada",
  trialing: "Em trial",
};

function ContaPage() {
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccountData(),
  });

  const devicesQuery = useQuery({
    queryKey: ["my-devices"],
    queryFn: () => listMyDevices(),
    refetchInterval: 30_000,
  });

  const portalMutation = useMutation({
    mutationFn: () =>
      createPortalSession({ data: { env: "sandbox" } }),
    onSuccess: (result) => {
      if ("url" in result) window.location.href = result.url;
    },
  });

  const releaseOthersMutation = useMutation({
    mutationFn: () => releaseOtherSessions({ data: { deviceId: getDeviceId() } }),
    onSuccess: (res) => {
      toast.success(`${res.released ?? 0} dispositivo(s) desconectado(s)`);
      qc.invalidateQueries({ queryKey: ["my-devices"] });
    },
  });

  const releaseOneMutation = useMutation({
    mutationFn: (deviceId: string) => releaseSession({ data: { deviceId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-devices"] }),
  });

  async function handleLogout() {
    try { await releaseSession({ data: { deviceId: getDeviceId() } }); } catch {}
    await supabase.auth.signOut();
    window.location.href = "/";
  }


  const sub = data?.subscription;
  const isActive = sub?.status === "active";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/hub" className="hover:text-foreground">Hub</Link>
        <span className="mx-2">›</span>
        <span>Minha conta</span>
      </nav>

      <h1 className="font-display text-4xl">Minha conta</h1>

      {isPending ? (
        <div className="mt-8 animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 rounded-sm bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="rounded-sm border border-border p-6">
            <p className="eyebrow mb-4">Perfil</p>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted-foreground">Nome</dt>
                <dd>{data?.fullName ?? "—"}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted-foreground">E-mail</dt>
                <dd>{data?.email ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-sm border border-border p-6">
            <p className="eyebrow mb-4">Assinatura</p>

            {sub ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      isActive ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">
                    {STATUS_LABEL[sub.status] ?? sub.status}
                  </span>
                  {sub.lifetimeAccess && (
                    <span className="rounded-sm bg-foreground px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-background">
                      Fundador
                    </span>
                  )}
                </div>

                {sub.lifetimeAccess ? (
                  <p className="text-muted-foreground">Acesso vitalício — sem renovação</p>
                ) : sub.periodEnd ? (
                  <p className="text-muted-foreground">
                    {sub.cancelAtPeriodEnd ? "Acaba em" : "Renova em"}{" "}
                    {new Date(sub.periodEnd).toLocaleDateString("pt-BR")}
                  </p>
                ) : null}

                {isActive && (
                  <button
                    onClick={() => portalMutation.mutate()}
                    disabled={portalMutation.isPending}
                    className="mt-2 inline-flex items-center rounded-sm border border-foreground px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {portalMutation.isPending ? "Abrindo…" : "Gerenciar assinatura"}
                  </button>
                )}

                {"error" in (portalMutation.data ?? {}) && (
                  <p className="text-sm text-destructive">
                    {(portalMutation.data as { error: string }).error}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Sem assinatura ativa.</p>
                <Link
                  to="/precos"
                  className="inline-flex items-center rounded-sm bg-foreground px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
                >
                  Ver planos
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="eyebrow">Dispositivos conectados</p>
              {(devicesQuery.data?.length ?? 0) > 1 && (
                <button
                  onClick={() => releaseOthersMutation.mutate()}
                  disabled={releaseOthersMutation.isPending}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  Sair dos outros
                </button>
              )}
            </div>
            {devicesQuery.isPending ? (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            ) : (devicesQuery.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dispositivo registrado.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {devicesQuery.data!.map((d) => {
                  const isCurrent = d.device_id === getDeviceId();
                  return (
                    <li key={d.device_id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-2 w-2 rounded-full ${d.is_active ? "bg-green-500" : "bg-muted-foreground"}`} />
                          <span className="font-medium">{d.device_label ?? "Dispositivo"}</span>
                          {isCurrent && (
                            <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]">Este</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {d.geo_city ?? "—"}{d.geo_country ? ` · ${d.geo_country}` : ""} · visto {new Date(d.last_seen_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      {!isCurrent && (
                        <button
                          onClick={() => releaseOneMutation.mutate(d.device_id)}
                          className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive"
                        >
                          Desconectar
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sair da conta
          </button>
        </div>
      )}

    </div>
  );
}
