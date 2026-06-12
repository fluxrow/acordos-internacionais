import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TextoIntegralAcordoProps {
  slug: string;
}

type Estado =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "loaded"; acordo: string; ajuste: string }
  | { kind: "error" };

export function TextoIntegralAcordo({ slug }: TextoIntegralAcordoProps) {
  const [estado, setEstado] = useState<Estado>({ kind: "idle" });
  const [aberto, setAberto] = useState<"acordo" | "ajuste" | null>(null);

  async function carregar() {
    if (estado.kind === "loaded" || estado.kind === "loading") return;
    setEstado({ kind: "loading" });
    try {
      const mod = await import(`../data/acordos-textos/${slug}.ts`);
      setEstado({
        kind: "loaded",
        acordo: mod.acordo ?? "",
        ajuste: mod.ajuste ?? "",
      });
    } catch (e) {
      console.error("Falha ao carregar texto integral", e);
      setEstado({ kind: "error" });
    }
  }

  function toggle(qual: "acordo" | "ajuste") {
    carregar();
    setAberto((a) => (a === qual ? null : qual));
  }

  const acordo = estado.kind === "loaded" ? estado.acordo : "";
  const ajuste = estado.kind === "loaded" ? estado.ajuste : "";

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Texto integral importado do mapa oficial de acordos. Conteúdo extenso —
        clique para expandir.
      </p>

      <Linha
        titulo="Texto integral do acordo"
        aberto={aberto === "acordo"}
        onToggle={() => toggle("acordo")}
      >
        {estado.kind === "loading" && (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        )}
        {estado.kind === "error" && (
          <p className="text-sm text-destructive">
            Não foi possível carregar o texto agora.
          </p>
        )}
        {estado.kind === "loaded" && acordo && (
          <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-center text-sm leading-relaxed font-sans text-foreground/90">
            {acordo}
          </pre>
        )}
        {estado.kind === "loaded" && !acordo && (
          <p className="text-sm text-muted-foreground">
            Texto não disponível para este acordo.
          </p>
        )}
      </Linha>

      {(estado.kind !== "loaded" || ajuste) && (
        <Linha
          titulo="Ajuste administrativo"
          aberto={aberto === "ajuste"}
          onToggle={() => toggle("ajuste")}
        >
          {estado.kind === "loading" && (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          )}
          {estado.kind === "loaded" && ajuste && (
            <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-center text-sm leading-relaxed font-sans text-foreground/90">
              {ajuste}
            </pre>
          )}
          {estado.kind === "loaded" && !ajuste && (
            <p className="text-sm text-muted-foreground">
              Sem ajuste administrativo cadastrado.
            </p>
          )}
        </Linha>
      )}
    </div>
  );
}

function Linha({
  titulo,
  aberto,
  onToggle,
  children,
}: {
  titulo: string;
  aberto: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/50 transition-colors hover:border-[var(--accent-ink)]/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span className="font-display text-base">{titulo}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted-foreground transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>
      {aberto && <div className="border-t border-border/40 p-4">{children}</div>}
    </div>
  );
}
