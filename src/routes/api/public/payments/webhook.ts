import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

// Caminho FIXO exigido pela Lovable Cloud — não alterar.
// Registrado automaticamente em /api/public/payments/webhook?env=sandbox|live
export const APIRoute = createAPIFileRoute("/api/public/payments/webhook")({
  POST: async ({ request }) => {
    const url = new URL(request.url);
    const env = url.searchParams.get("env") ?? "sandbox";

    const secret =
      env === "live"
        ? process.env.PAYMENTS_LIVE_WEBHOOK_SECRET
        : process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET;

    if (!secret) {
      console.error(`[webhook] secret não configurado para env=${env}`);
      return new Response("Configuration error", { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") ?? "";

    if (signature) {
      const valid = await verifyStripeSignature(rawBody, signature, secret);
      if (!valid) {
        return new Response("Signature inválida", { status: 401 });
      }
    }

    let event: { type: string; data: { object: Record<string, unknown> } };
    try {
      event = JSON.parse(rawBody) as typeof event;
    } catch {
      return new Response("Payload inválido", { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const obj = event.data.object;

    switch (event.type) {
      case "checkout.session.completed": {
        const userId = obj.metadata as Record<string, string> | null;
        const subId = obj.subscription as string | null;
        const custId = obj.customer as string | null;
        if (!userId?.userId || !subId) break;

        await admin.from("subscriptions").upsert(
          {
            user_id: userId.userId,
            stripe_customer_id: custId,
            stripe_subscription_id: subId,
            status: "active",
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const userId = (obj.metadata as Record<string, string> | null)?.userId;
        if (!userId) break;

        await admin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: obj.customer as string,
            stripe_subscription_id: obj.id as string,
            status: obj.status as string,
            price_id: ((obj.items as { data: { price: { id: string } }[] } | null)
              ?.data?.[0]?.price?.id) ?? null,
            current_period_end: obj.current_period_end
              ? new Date((obj.current_period_end as number) * 1000).toISOString()
              : null,
            cancel_at_period_end: (obj.cancel_at_period_end as boolean) ?? false,
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subId = obj.id as string;
        await admin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "invoice.payment_failed": {
        const subId = obj.subscription as string | null;
        if (!subId) break;
        await admin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "invoice.payment_succeeded":
        // Status já atualizado via customer.subscription.updated
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

async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string
): Promise<boolean> {
  // Stripe usa "t=timestamp,v1=hmac" no header stripe-signature
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const timestamp = parts["t"];
  const v1 = parts["v1"];
  if (!timestamp || !v1) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${payload}`)
  );
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === v1;
}
