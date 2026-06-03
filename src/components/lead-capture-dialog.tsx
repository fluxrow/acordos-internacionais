import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";


export interface LeadContexto {
  pais?: string;
  tipo?: string;
  tempo_brasil_meses?: number;
  tempo_pais_meses?: number;
  data_nasc?: string | null;
  sexo?: string;
  resultado_caso?: string;
}

export interface LeadData {
  nome: string;
  email: string;
  telefone: string;
}

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo.").max(100),
  email: z.string().trim().email("E-mail inválido.").max(255),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone com DDD, mínimo 10 dígitos.")
    .max(20)
    .regex(/^[\d()+\-\s]+$/, "Use apenas números e ( ) - +."),
});

function maskTel(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function LeadCaptureDialog({
  open,
  onOpenChange,
  contexto,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contexto: LeadContexto;
  onSubmitted: (lead: LeadData) => void;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!aceite) {
      setErro("Confirme que aceita ser contatado pela nossa equipe.");
      return;
    }
    const parsed = schema.safeParse({ nome, email, telefone });
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Verifique os dados.");
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: parsed.data.telefone,
        pais: contexto.pais ?? null,
        tipo: contexto.tipo ?? null,
        tempo_brasil_meses: contexto.tempo_brasil_meses ?? null,
        tempo_pais_meses: contexto.tempo_pais_meses ?? null,
        data_nasc: contexto.data_nasc ?? null,
        sexo: contexto.sexo ?? null,
        resultado_caso: contexto.resultado_caso ?? null,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
        referer:
          typeof document !== "undefined" ? document.referrer || null : null,
      };
      try {
        const res = await fetch("/api/public/calc-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          // não bloqueia o resultado — apenas loga
          // eslint-disable-next-line no-console
          console.error("calc-lead POST falhou", res.status);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("calc-lead network error", err);
      }
      try {
        sessionStorage.setItem("triagem_lead_v1", "1");
      } catch {
        /* noop */
      }
      onSubmitted(parsed.data);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (enviando) return;
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (enviando) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Falta só um passo para ver seu resultado
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para liberar a análise. Nossa equipe pode entrar
            em contato para tirar dúvidas sobre o seu caso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lead-nome">Nome completo</Label>
            <Input
              id="lead-nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-email">E-mail</Label>
            <Input
              id="lead-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-tel">Telefone / WhatsApp</Label>
            <Input
              id="lead-tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefone}
              onChange={(e) => setTelefone(maskTel(e.target.value))}
              required
              placeholder="(11) 99999-9999"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={aceite}
              onCheckedChange={(v) => setAceite(v === true)}
              className="mt-0.5"
            />
            <span>
              Aceito ser contatado pela equipe do Acordo Internacional para
              tratar do meu caso. Seus dados ficam protegidos e não são
              compartilhados.
            </span>
          </label>

          {erro && (
            <p className="rounded-sm border-l-2 border-[var(--state-error)] bg-[var(--state-error-soft)]/40 px-3 py-2 text-sm text-[var(--state-error)]">
              {erro}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                "Ver meu resultado"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
