import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";
import { createStripeClient } from "@/lib/stripe.server";

type CheckoutResult =
  | { clientSecret: string; error?: never }
  | { clientSecret?: never; error: string };

export const createCheckoutSession = createServerFn()
  .validator((input: { priceId: string; env?: string }) => input)
  .handler(async ({ data: { priceId, env = "sandbox" } }): Promise<CheckoutResult> => {
    const { userId } = await requireSupabaseAuth();
    const admin = createSupabaseAdminClient();

    let stripe: ReturnType<typeof createStripeClient>;
    try {
      stripe = createStripeClient(env);
    } catch {
      return { error: "Pagamento temporariamente indisponível" };
    }

    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    let customerId = sub?.stripe_customer_id ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId },
      });
      customerId = customer.id;

      await admin.from("subscriptions").upsert(
        { user_id: userId, stripe_customer_id: customerId, status: "inactive" },
        { onConflict: "user_id" }
      );
    }

    const origin =
      process.env.APP_URL ??
      process.env.VITE_APP_URL ??
      "https://acordosinternacionais.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: `${origin}/hub?checkout=success`,
      metadata: { userId },
    });

    if (!session.client_secret) {
      console.error("[checkout] session sem client_secret", session.id);
      return { error: "Erro ao iniciar checkout" };
    }

    return { clientSecret: session.client_secret };
  });
