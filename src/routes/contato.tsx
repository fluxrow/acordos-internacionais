import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { acordos } from "@/data/acordos";

const TITLE = "Falar com o Dr. Marcos Espínola | Acordos Internacionais";
const DESC =
  "Conte sua situação envolvendo acordos previdenciários internacionais e receba um retorno qualificado.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    pais: "",
    situacao: "",
    urgencia: "media",
    mensagem: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fase 1: fallback via mailto (Cloud + Lovable Email entram em seguida)
    const corpo = encodeURIComponent(
      `Nome: ${form.nome}\nE-mail: ${form.email}\nPaís do acordo: ${form.pais}\nSituação atual: ${form.situacao}\nUrgência: ${form.urgencia}\n\n${form.mensagem}`,
    );
    const assunto = encodeURIComponent(
      `[Acordos Internacionais] Contato — ${form.nome || "novo lead"}`,
    );
    window.location.href = `mailto:contato@acordosinternacionais.com?subject=${assunto}&body=${corpo}`;
    setEnviado(true);
  }

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="eyebrow">Atendimento direto</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">
            Falar com o <span className="text-gold">Dr. Marcos</span> Espínola
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Conte sua situação. Quanto mais contexto, melhor o retorno. Cada
            mensagem é lida pessoalmente.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_320px]">
        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Field label="Seu nome">
              <input
                required
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border-0 border-b border-border bg-transparent py-3 text-base focus:border-[var(--accent-ink)] focus:outline-none"
              />
            </Field>

            <Field label="Seu e-mail">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-0 border-b border-border bg-transparent py-3 text-base focus:border-[var(--accent-ink)] focus:outline-none"
              />
            </Field>

            <Field label="País do acordo (se já souber)">
              <select
                value={form.pais}
                onChange={(e) => setForm({ ...form, pais: e.target.value })}
                className="w-full appearance-none border-0 border-b border-border bg-transparent py-3 text-base focus:border-[var(--accent-ink)] focus:outline-none"
              >
                <option value="">Selecione…</option>
                {acordos.map((a) => (
                  <option key={a.slug} value={a.nome}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Situação atual">
              <select
                required
                value={form.situacao}
                onChange={(e) => setForm({ ...form, situacao: e.target.value })}
                className="w-full appearance-none border-0 border-b border-border bg-transparent py-3 text-base focus:border-[var(--accent-ink)] focus:outline-none"
              >
                <option value="">Selecione…</option>
                <option>Vou me mudar para outro país</option>
                <option>Já moro no exterior</option>
                <option>Estou voltando ao Brasil</option>
                <option>Quero me aposentar usando o acordo</option>
                <option>Outro</option>
              </select>
            </Field>

            <Field label="Urgência">
              <div className="flex flex-wrap gap-2 pt-2">
                {(
                  [
                    ["baixa", "Sem pressa"],
                    ["media", "Próximas semanas"],
                    ["alta", "Urgente"],
                  ] as const
                ).map(([v, l]) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setForm({ ...form, urgencia: v })}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors " +
                      (form.urgencia === v
                        ? "border-[var(--accent-ink)] bg-[var(--accent-ink)] text-[var(--paper)]"
                        : "border-border hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]")
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Conte mais">
              <textarea
                required
                rows={6}
                value={form.mensagem}
                onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                className="w-full border border-border bg-transparent p-3 text-base focus:border-[var(--accent-ink)] focus:outline-none"
                placeholder="Período no exterior, contribuições, idade, dúvida específica…"
              />
            </Field>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[var(--paper)] shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-ink-soft)] hover:shadow-[var(--shadow-gold-glow)]"
            >
              Enviar mensagem <span aria-hidden>→</span>
            </button>

            <p className="text-xs text-muted-foreground">
              Ao enviar, você concorda em ser contatado pelo Dr. Marcos Espínola sobre
              sua situação. Seus dados não são compartilhados com terceiros.
            </p>
          </form>
        ) : (
          <div className="border border-[var(--accent-ink)]/60 bg-background/60 p-8 backdrop-blur-md">
            <p className="eyebrow">Tudo certo</p>
            <h2 className="mt-3 font-display text-3xl">Mensagem em rota</h2>
            <p className="lede mt-4 text-base">
              Abrimos seu cliente de e-mail com a mensagem pronta. Confirme o
              envio. Em breve você terá retorno.
            </p>
          </div>
        )}

        <aside className="md:sticky md:top-6 md:self-start">
          <div className="border border-border p-6">
            <p className="eyebrow">Outras formas</p>
            <p className="mt-3 text-sm">
              Para advogados interessados no hub profissional, existe uma
              página dedicada com preview e checkout (em breve).
            </p>
          </div>
        </aside>
      </section>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
