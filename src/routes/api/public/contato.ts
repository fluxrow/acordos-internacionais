import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  nome: z.string().min(1).max(120),
  email: z.string().email().max(200),
  pais: z.string().max(80).optional().default(""),
  situacao: z.string().max(120).optional().default(""),
  urgencia: z.enum(["baixa", "media", "alta"]).optional().default("media"),
  mensagem: z.string().min(5).max(4000),
  // Honeypot — bots costumam preencher campos invisíveis
  website: z.string().max(0).optional().default(""),
});

export const Route = createFileRoute("/api/public/contato")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Dados inválidos", details: parsed.error.flatten() },
            { status: 400 },
          );
        }
        const data = parsed.data;
        if (data.website) {
          // Honeypot acionado — finge sucesso para não dar pistas ao bot
          return Response.json({ success: true });
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
          console.error("[contato] missing supabase env");
          return Response.json(
            { error: "Configuração indisponível" },
            { status: 500 },
          );
        }

        // Render + enqueue diretamente via RPC (mesmo caminho do /lovable/email/transactional/send,
        // sem exigir JWT — esta rota pública aplica a sua própria validação acima).
        const { createClient } = await import("@supabase/supabase-js");
        const { render } = await import("@react-email/components");
        const React = await import("react");
        const { TEMPLATES } = await import("@/lib/email-templates/registry");

        const tpl = TEMPLATES["contact-notification"];
        if (!tpl) {
          console.error("[contato] template not found");
          return Response.json(
            { error: "Template indisponível" },
            { status: 500 },
          );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const messageId = crypto.randomUUID();
        const element = React.createElement(tpl.component, data);
        const html = await render(element);
        const text = await render(element, { plainText: true });
        const subject =
          typeof tpl.subject === "function" ? tpl.subject(data) : tpl.subject;
        const to = tpl.to!;

        await supabase.from("email_send_log").insert({
          message_id: messageId,
          template_name: "contact-notification",
          recipient_email: to,
          status: "pending",
        });

        const { error: enqueueError } = await supabase.rpc("enqueue_email", {
          queue_name: "transactional_emails",
          payload: {
            message_id: messageId,
            to,
            from: `acordosinternacionais <noreply@notify.acordosinternacionais.com>`,
            reply_to: data.email,
            sender_domain: "notify.acordosinternacionais.com",
            subject,
            html,
            text,
            purpose: "transactional",
            label: "contact-notification",
            idempotency_key: `contact-${messageId}`,
            queued_at: new Date().toISOString(),
          },
        });

        if (enqueueError) {
          console.error("[contato] enqueue failed", enqueueError);
          await supabase.from("email_send_log").insert({
            message_id: messageId,
            template_name: "contact-notification",
            recipient_email: to,
            status: "failed",
            error_message: "enqueue failed",
          });
          return Response.json(
            { error: "Não foi possível enviar agora" },
            { status: 500 },
          );
        }

        return Response.json({ success: true });
      },
    },
  },
});
