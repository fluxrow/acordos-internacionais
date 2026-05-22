import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Acordo Internacional" },
      {
        name: "description",
        content:
          "Crie sua conta no Hub Profissional de Acordos Previdenciários.",
      },
      { property: "og:title", content: "Criar conta — Acordo Internacional" },
      {
        property: "og:description",
        content:
          "Crie sua conta no Hub Profissional de Acordos Previdenciários.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/hub" });
  },
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/hub",
      },
    });
    setLoading(false);

    if (authError) {
      const msg = authError.message;
      const lower = msg.toLowerCase();
      if (lower.includes("already registered") || lower.includes("user already")) {
        setError("Esse e-mail já tem conta. Entre em vez de cadastrar.");
      } else if (lower.includes("weak") || lower.includes("pwned")) {
        setError("Essa senha apareceu em vazamentos públicos. Use uma senha mais forte (combine letras, números e símbolos).");
      } else if (lower.includes("invalid email")) {
        setError("E-mail inválido.");
      } else {
        setError(msg);
      }
      return;
    }

    if (data.session) {
      await navigate({ to: "/hub", replace: true });
      return;
    }

    setSent(true);
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/hub",
    });
    if (result.error) {
      setError("Não foi possível iniciar o login com Google.");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl">Criar conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesso ao Hub Profissional de Acordos Previdenciários
        </p>

        {sent ? (
          <div className="mt-8 rounded-sm border border-border p-4 text-sm">
            <p>
              Te enviamos um link de confirmação para <strong>{email}</strong>.
              Abra o e-mail para ativar a conta.
            </p>
            <p className="mt-3 text-muted-foreground">
              Já confirmou?{" "}
              <Link to="/login" className="underline hover:text-foreground">
                Entrar
              </Link>
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              className="mt-8 w-full rounded-sm border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Continuar com Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Nome completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-sm border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-sm border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-sm border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-foreground px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85 disabled:opacity-50"
              >
                {loading ? "Criando…" : "Criar conta"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="underline hover:text-foreground">
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
