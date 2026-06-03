// Server-only helper para notificar Marcos e o lead após o cadastro na calculadora.
// Tenta enviar via Lovable Emails (rota interna /lovable/email/transactional/send).
// Enquanto a infra de e-mail não estiver provisionada, faz no-op + log — o lead
// continua salvo no banco e visível no painel admin do Hub.

const MARCOS_EMAIL = "marcos@acordosinternacionais.com";
// WhatsApp do Marcos (somente dígitos, formato internacional)
const MARCOS_WHATSAPP = "5581992345678"; // TODO: ajustar com o número real

type LeadEmailPayload = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pais: string | null;
  tipo: string | null;
  tempo_brasil_meses: number | null;
  tempo_pais_meses: number | null;
  resultado_caso: string | null;
  created_at: string;
};

function fmtMeses(m: number | null): string {
  if (m == null) return "—";
  const anos = Math.floor(m / 12);
  const resto = m % 12;
  if (anos === 0) return `${m} meses`;
  if (resto === 0) return `${anos} ano${anos > 1 ? "s" : ""}`;
  return `${anos}a ${resto}m`;
}

function getBaseUrl(): string {
  // Em produção podemos derivar da requisição; aqui basta o domínio público.
  return "https://acordosinternacionais.com";
}

async function trySend(payload: {
  templateName: string;
  recipientEmail: string;
  idempotencyKey: string;
  templateData: Record<string, unknown>;
  subject?: string;
}): Promise<void> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Quando a infra estiver ativa, o gateway interno autentica via service-role.
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn(
        `[lead-notify] envio ${payload.templateName} retornou ${res.status} — lead permanece salvo`,
      );
    }
  } catch (err) {
    console.warn(`[lead-notify] falha ao enviar ${payload.templateName}:`, err);
  }
}

export async function notifyLead(lead: LeadEmailPayload): Promise<void> {
  const telDigits = lead.telefone.replace(/\D/g, "");
  const waLead = telDigits.length >= 10 ? `https://wa.me/55${telDigits.replace(/^55/, "")}` : null;
  const waMarcos = `https://wa.me/${MARCOS_WHATSAPP}`;
  const adminUrl = `${getBaseUrl()}/hub/leads`;
  const createdLocal = new Date(lead.created_at).toLocaleString("pt-BR", {
    timeZone: "America/Recife",
  });

  // 1) E-mail para Marcos
  await trySend({
    templateName: "novo-lead-calculadora",
    recipientEmail: MARCOS_EMAIL,
    idempotencyKey: `lead-marcos-${lead.id}`,
    subject: `Novo lead calculadora — ${lead.nome}${lead.pais ? ` (${lead.pais})` : ""}`,
    templateData: {
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      whatsapp_url: waLead,
      pais: lead.pais ?? "—",
      tipo: lead.tipo ?? "—",
      tempo_brasil: fmtMeses(lead.tempo_brasil_meses),
      tempo_exterior: fmtMeses(lead.tempo_pais_meses),
      resultado: lead.resultado_caso ?? "—",
      criado_em: createdLocal,
      admin_url: adminUrl,
    },
  });

  // 2) Cópia de confirmação para o próprio lead
  await trySend({
    templateName: "confirmacao-lead",
    recipientEmail: lead.email,
    idempotencyKey: `lead-cliente-${lead.id}`,
    subject: "Recebemos seus dados — Acordo Internacional",
    templateData: {
      nome: lead.nome,
      whatsapp_marcos: waMarcos,
    },
  });
}
