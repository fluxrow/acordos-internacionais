import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { LaudoPdf } from "@/components/laudo/LaudoPdf";
import {
  loadLaudoPayload,
  saveLaudoPayload,
  type LaudoPayload,
} from "@/lib/laudo-payload";
import { carregarLaudoHistorico } from "@/lib/laudo-historico";

type Search = { id?: string; print?: "1" };

export const Route = createFileRoute("/_authenticated/hub/laudo")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
    print: search.print === "1" ? "1" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Laudo RMI Pro-rata — Acordos Internacionais" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: LaudoPage,
});

function LaudoPage() {
  const { id, print } = Route.useSearch();
  const printedRef = useRef(false);
  const [payload, setPayload] = useState<LaudoPayload | null>(null);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        if (id) {
          const reg = await carregarLaudoHistorico(id);
          if (!ativo) return;
          if (!reg) {
            setErro("Laudo não encontrado ou já foi excluído.");
          } else {
            // Sincroniza o sessionStorage para que reimpressões funcionem se a aba for recarregada
            saveLaudoPayload(reg.payload);
            setPayload(reg.payload);
          }
        } else {
          setPayload(loadLaudoPayload());
        }
      } catch (e) {
        if (ativo) setErro(e instanceof Error ? e.message : "Falha ao carregar o laudo.");
      } finally {
        if (ativo) setPronto(true);
      }
    })();
    return () => { ativo = false; };
  }, [id]);

  if (!pronto) return null;

  if (erro || !payload) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 24,
        background: "#0a0a0a", color: "#F7F3EC",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, marginBottom: 12, color: "#C9A44A" }}>
            {erro ? "Não foi possível abrir o laudo" : "Nenhum laudo carregado"}
          </h1>
          <p style={{ fontSize: 14, color: "#A89880", lineHeight: 1.6 }}>
            {erro ?? (
              <>
                Volte à <a href="/hub/calculadora" style={{ color: "#E2BC6A" }}>calculadora Pro</a>,
                calcule um cenário e clique em <strong>Gerar laudo PDF</strong>. Você também pode
                acessar seu <a href="/hub/laudos" style={{ color: "#E2BC6A" }}>histórico de laudos</a>.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LaudoPdf payload={payload} />
      <div className="laudo-no-print laudo-print-wrap">
        <button
          type="button"
          className="laudo-print-btn"
          onClick={() => window.print()}
        >
          ⬇ Baixar / Imprimir PDF
        </button>
      </div>
    </>
  );
}
