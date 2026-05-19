import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Caminho FIXO exigido pela Lovable Cloud: /api/public/payments/webhook?env=sandbox|live
export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const rawEnv = url.searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return new Response("Invalid env", { status: 400 });
        }
        const secret =
          rawEnv === "live"
            ? process.env.PAYMENTS_LIVE_WEBHOOK_SECRET
            : process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET;
        if (!secret) {
          console.error(`[webhook] secret não configurado para env=${rawEnv}`);
          return new Response("Configuration error", { status: 500 });
        }

        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });

        const valid = await verifyStripeSignature(rawBody, signature, secret);
        if (!valid) return new Response("Invalid signature", { status: 401 });

        let event: { type: string; data: { object: Record<string, unknown> } };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const obj = event.data.object as Record<string, unknown>;

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const userId = (obj.metadata as Record<string, string> | null)?.userId;
              const subId = obj.subscription as string | null;
              const custId = obj.customer as string | null;
              if (!userId || !subId) break;
              await supabaseAdmin.from("subscriptions").upsert(
                {
                  user_id: userId,
                  stripe_customer_id: custId,
                  stripe_subscription_id: subId,
                  status: "active",
                },
                { onConflict: "user_id" },
              );
              break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
              const userId = (obj.metadata as Record<string, string> | null)?.userId;
              if (!userId) break;
              const items = obj.items as
                | { data: Array<{ price: { lookup_key?: string; id: string }; current_period_end?: number }> }
                | undefined;
              const item = items?.data?.[0];
              const priceId = item?.price?.lookup_key ?? item?.price?.id ?? null;
              const periodEnd =
                item?.current_period_end ?? (obj.current_period_end as number | undefined);
              await supabaseAdmin.from("subscriptions").upsert(
                {
                  user_id: userId,
                  stripe_customer_id: obj.customer as string,
                  stripe_subscription_id: obj.id as string,
                  status: obj.status as string,
                  price_id: priceId,
                  current_period_end: periodEnd
                    ? new Date(periodEnd * 1000).toISOString()
                    : null,
                  cancel_at_period_end: (obj.cancel_at_period_end as boolean) ?? false,
                },
                { onConflict: "user_id" },
              );
              break;
            }
            case "customer.subscription.deleted": {
              await supabaseAdmin
                .from("subscriptions")
                .update({ status: "canceled" })
                .eq("stripe_subscription_id", obj.id as string);
              break;
            }
            case "invoice.payment_failed": {
              const subId = obj.subscription as string | null;
              if (!subId) break;
              await supabaseAdmin
                .from("subscriptions")
                .update({ status: "past_due" })
                .eq("stripe_subscription_id", subId);
              break;
            }
            default:
              console.log(`[webhook] evento ignorado: ${event.type}`);
          }
        } catch (err) {
          console.error("[webhook] erro processando evento:", err);
          return new Response("Webhook error", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});

async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  let timestamp: string | undefined;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v;
    if (k === "v1") v1.push(v);
  }
  if (!timestamp || !v1.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  );
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return v1.includes(computed);
}

