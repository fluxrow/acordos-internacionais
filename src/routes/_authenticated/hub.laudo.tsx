import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LaudoPdf } from "@/components/laudo/LaudoPdf";
import { loadLaudoPayload, type LaudoPayload } from "@/lib/laudo-payload";

export const Route = createFileRoute("/_authenticated/hub/laudo")({
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
  const [payload, setPayload] = useState<LaudoPayload | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setPayload(loadLaudoPayload());
    setPronto(true);
  }, []);

  if (!pronto) return null;

  if (!payload) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 24,
        background: "#0a0a0a", color: "#F7F3EC",
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, marginBottom: 12, color: "#C9A44A" }}>
            Nenhum laudo carregado
          </h1>
          <p style={{ fontSize: 14, color: "#A89880", lineHeight: 1.6 }}>
            Volte à <a href="/hub/calculadora" style={{ color: "#E2BC6A" }}>calculadora Pro</a>,
            calcule um cenário e clique em <strong>Gerar laudo PDF</strong>.
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
