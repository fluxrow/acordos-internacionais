import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

type CheckoutResult =
  | { url: string; error?: never }
  | { url?: never; error: string };

export const createCheckoutSession = createServerFn()
  .validator((priceId: string) => priceId)
  .handler(async ({ data: priceId }): Promise<CheckoutResult> => {
    const { userId, userEmail } = await requireSupabaseAuth();
    const admin = createSupabaseAdminClient();

    const apiKey =
      process.env.STRIPE_SANDBOX_API_KEY ?? process.env.STRIPE_API_KEY;
    if (!apiKey) {
      console.error("[checkout] STRIPE_API_KEY não configurado");
      return { error: "Pagamento temporariamente indisponível" };
    }

    let customerId: string | undefined;

    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (sub?.stripe_customer_id) {
      customerId = sub.stripe_customer_id;
    } else {
      const res = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: userEmail ?? "",
          metadata: { supabase_user_id: userId },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[checkout] criar customer:", err);
        return { error: "Erro ao iniciar checkout" };
      }

      const customer = (await res.json()) as { id: string };
      customerId = customer.id;

      await admin
        .from("subscriptions")
        .upsert(
          { user_id: userId, stripe_customer_id: customerId, status: "inactive" },
          { onConflict: "user_id" }
        );
    }

    const origin =
      process.env.APP_URL ??
      process.env.VITE_APP_URL ??
      "https://acordo-internacional.com";

    const sessionRes = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          customer: customerId,
          "line_items[0][price]": priceId,
          "line_items[0][quantity]": "1",
          mode: "subscription",
          success_url: `${origin}/hub?checkout=success`,
          cancel_url: `${origin}/precos?checkout=canceled`,
          "metadata[supabase_user_id]": userId,
        }),
      }
    );

    if (!sessionRes.ok) {
      const err = await sessionRes.text();
      console.error("[checkout] criar session:", err);
      return { error: "Erro ao iniciar checkout" };
    }

    const session = (await sessionRes.json()) as { url: string };
    return { url: session.url };
  });
