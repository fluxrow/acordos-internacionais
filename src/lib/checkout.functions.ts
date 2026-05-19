import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

type CheckoutInput = {
  priceId: string;
  env: StripeEnv;
};

type CheckoutResult =
  | { clientSecret: string; error?: never }
  | { clientSecret?: never; error: string };

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CheckoutInput) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(input.priceId)) {
      throw new Error("Invalid priceId");
    }
    if (input.env !== "sandbox" && input.env !== "live") {
      throw new Error("Invalid env");
    }
    return input;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    const { userId } = context;
    const { priceId, env } = data;

    let stripe: ReturnType<typeof createStripeClient>;
    try {
      stripe = createStripeClient(env);
    } catch {
      return { error: "Pagamento temporariamente indisponível" };
    }

    // Resolve priceId (human-readable lookup_key) para o id real do Stripe
    const prices = await stripe.prices.list({ lookup_keys: [priceId], limit: 1 });
    if (!prices.data.length) return { error: "Preço não encontrado" };
    const stripePrice = prices.data[0];

    // Customer: reusa se já existe; senão cria com metadata.userId
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    let customerId = sub?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { userId } });
      customerId = customer.id;
      await supabaseAdmin.from("subscriptions").upsert(
        { user_id: userId, stripe_customer_id: customerId, status: "inactive" },
        { onConflict: "user_id" },
      );
    }

    const origin =
      process.env.APP_URL ?? "https://acordosinternacionais.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: `${origin}/hub?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });

    if (!session.client_secret) {
      console.error("[checkout] session sem client_secret", session.id);
      return { error: "Erro ao iniciar checkout" };
    }
    return { clientSecret: session.client_secret };
  });
