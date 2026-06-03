import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Cancelar inscrição | Acordos Internacionais" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "missing" }
  | { kind: "invalid" }
  | { kind: "already" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function UnsubscribePage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) {
      setState({ kind: "missing" });
      return;
    }
    setToken(t);
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.status === 404) return setState({ kind: "invalid" });
        if (!r.ok) return setState({ kind: "error", message: data.error ?? "Erro" });
        if (data.valid) return setState({ kind: "valid" });
        if (data.reason === "already_unsubscribed")
          return setState({ kind: "already" });
        setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "error", message: "Falha de conexão" }));
  }, []);

  async function confirm() {
    if (!token) return;
    setSubmitting(true);
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setState({ kind: "error", message: data.error ?? "Erro" });
      } else if (data.success) {
        setState({ kind: "success" });
      } else if (data.reason === "already_unsubscribed") {
        setState({ kind: "already" });
      } else {
        setState({ kind: "error", message: "Não foi possível confirmar" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="eyebrow">Acordos Internacionais</p>
      <h1 className="mt-4 font-display text-3xl md:text-4xl">
        Cancelar <span className="text-gold">inscrição</span>
      </h1>

      <div className="mt-8 rounded-xl border border-border bg-background p-8 shadow-[var(--shadow-soft)]">
        {state.kind === "loading" && (
          <p className="text-sm text-muted-foreground">Validando…</p>
        )}
        {state.kind === "missing" && (
          <p className="text-sm">Link inválido — token ausente.</p>
        )}
        {state.kind === "invalid" && (
          <p className="text-sm">
            Link inválido ou expirado. Se o problema persistir, entre em
            contato.
          </p>
        )}
        {state.kind === "already" && (
          <p className="text-sm">
            Você já está descadastrado. Não enviaremos mais e-mails para este
            endereço.
          </p>
        )}
        {state.kind === "valid" && (
          <>
            <p className="text-sm">
              Confirme que você não quer mais receber e-mails deste site.
            </p>
            <button
              type="button"
              onClick={confirm}
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? "Confirmando…" : "Confirmar cancelamento"}
            </button>
          </>
        )}
        {state.kind === "success" && (
          <p className="text-sm">
            Pronto. Você foi descadastrado e não receberá mais nossos e-mails.
          </p>
        )}
        {state.kind === "error" && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>
    </article>
  );
}
