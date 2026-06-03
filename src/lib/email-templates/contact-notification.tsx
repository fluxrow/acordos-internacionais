import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  nome?: string;
  email?: string;
  pais?: string;
  situacao?: string;
  urgencia?: string;
  mensagem?: string;
}

const URGENCIA_LABEL: Record<string, string> = {
  baixa: "Sem pressa",
  media: "Próximas semanas",
  alta: "Urgente",
};

const Email = ({
  nome = "(sem nome)",
  email = "(sem e-mail)",
  pais = "",
  situacao = "",
  urgencia = "media",
  mensagem = "",
}: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo contato no site — {nome}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Novo contato — Acordos Internacionais</Heading>
        <Text style={muted}>
          Mensagem recebida pelo formulário em /contato.
        </Text>

        <Section style={card}>
          <Row label="Nome" value={nome} />
          <Row label="E-mail" value={email} />
          {pais ? <Row label="País do acordo" value={pais} /> : null}
          {situacao ? <Row label="Situação" value={situacao} /> : null}
          <Row label="Urgência" value={URGENCIA_LABEL[urgencia] ?? urgencia} />
        </Section>

        <Hr style={hr} />

        <Text style={label}>Mensagem</Text>
        <Text style={messageBlock}>{mensagem || "(sem conteúdo)"}</Text>

        <Hr style={hr} />
        <Text style={footer}>
          Responder diretamente a este e-mail vai para {email}.
        </Text>
      </Container>
    </Body>
  </Html>
);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={rowText}>
      <span style={rowLabel}>{label}: </span>
      <span style={rowValue}>{value}</span>
    </Text>
  );
}

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `[Acordos Internacionais] Contato — ${d?.nome || "novo lead"}`,
  displayName: "Notificação de contato",
  to: "marcos@acordosinternacionais.com",
  previewData: {
    nome: "Maria Silva",
    email: "maria@example.com",
    pais: "Portugal",
    situacao: "Vou me mudar para outro país",
    urgencia: "alta",
    mensagem:
      "Trabalhei 8 anos em Lisboa e estou voltando ao Brasil. Quero entender como usar o acordo para aposentadoria.",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};
const container = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "560px",
};
const h1 = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#111111",
  margin: "0 0 8px 0",
};
const muted = { color: "#6b7280", fontSize: "13px", margin: "0 0 24px 0" };
const card = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px 20px",
};
const rowText = { fontSize: "14px", color: "#111111", margin: "6px 0" };
const rowLabel = { color: "#6b7280", fontWeight: 500 };
const rowValue = { color: "#111111" };
const hr = { borderColor: "#e5e7eb", margin: "24px 0" };
const label = {
  fontSize: "12px",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "0 0 8px 0",
};
const messageBlock = {
  fontSize: "15px",
  color: "#111111",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: 0,
};
const footer = { fontSize: "12px", color: "#9ca3af", margin: "16px 0 0 0" };
