import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

type WebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = new Uint8Array(
    (signature.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16))
  );
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
}

// Caminho FIXO exigido pela Lovable Cloud — não alterar.
// Registrado automaticamente em /api/public/payments/webhook?env=sandbox|live
export const APIRoute = createAPIFileRoute("/api/public/payments/webhook")({
  POST: async ({ request }) => {
    const secret =
      process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET ??
      process.env.PAYMENTS_WEBHOOK_SECRET;

    if (!secret) {
      console.error("[webhook] PAYMENTS_WEBHOOK_SECRET não configurado");
      return new Response("Configuration error", { status: 500 });
    }

    const rawBody = await request.text();

    const signature =
      request.headers.get("x-lovable-signature") ??
      request.headers.get("x-signature") ??
      "";

    if (signature) {
      const valid = await verifySignature(rawBody, signature, secret);
      if (!valid) {
        return new Response("Signature inválida", { status: 401 });
      }
    }

    let event: WebhookEvent;
    try {
      event = JSON.parse(rawBody) as WebhookEvent;
    } catch {
      return new Response("Payload inválido", { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated": {
        const d = event.data as {
          user_id: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string;
          status: string;
          price_id?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
        };
        const { error } = await admin.from("subscriptions").upsert(
          {
            user_id: d.user_id,
            stripe_customer_id: d.stripe_customer_id ?? null,
            stripe_subscription_id: d.stripe_subscription_id ?? null,
            status: d.status,
            price_id: d.price_id ?? null,
            current_period_end: d.current_period_end ?? null,
            cancel_at_period_end: d.cancel_at_period_end ?? false,
          },
          { onConflict: "user_id" }
        );
        if (error) console.error("[webhook] upsert subscription:", error);
        break;
      }

      case "subscription.canceled": {
        const d = event.data as { stripe_subscription_id: string };
        await admin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", d.stripe_subscription_id);
        break;
      }

      case "transaction.payment_failed": {
        const d = event.data as { stripe_subscription_id: string };
        await admin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", d.stripe_subscription_id);
        break;
      }

      case "transaction.completed":
        // Status já atualizado via subscription.updated
        break;

      default:
        console.log(`[webhook] evento ignorado: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
