import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, type StripeEnv, getStripeErrorMessage } from "@/lib/stripe.server";

type CheckoutInput = {
  priceId: string;
  env: StripeEnv;
};

type CheckoutResult =
  | { clientSecret: string; error?: never }
  | { clientSecret?: never; error: string };

/**
 * Resolve (ou cria) o Stripe Customer com metadata.userId.
 *
 * É CRÍTICO usar busca por metadata em vez de cachear o customer_id em
 * uma tabela local, porque sandbox e live têm IDs diferentes — reusar
 * um id de sandbox em live (ou vice-versa) gera "No such customer".
 */
async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { userId: string; email?: string },
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");

  // 1) Busca por metadata.userId (mesmo env)
  const found = await stripe.customers.search({
    query: `metadata['userId']:'${options.userId}'`,
    limit: 1,
  });
  if (found.data.length) return found.data[0].id;

  // 2) Fallback por e-mail e backfill do userId no metadata
  if (options.email) {
    const byEmail = await stripe.customers.list({ email: options.email, limit: 1 });
    if (byEmail.data.length) {
      const c = byEmail.data[0];
      if (c.metadata?.userId !== options.userId) {
        await stripe.customers.update(c.id, {
          metadata: { ...c.metadata, userId: options.userId },
        });
      }
      return c.id;
    }
  }

  // 3) Cria
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    metadata: { userId: options.userId },
  });
  return created.id;
}

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
    const { userId, supabase } = context;
    const { priceId, env } = data;

    try {
      const stripe = createStripeClient(env);

      // Resolve lookup_key humano para o id real do Stripe
      const prices = await stripe.prices.list({ lookup_keys: [priceId], limit: 1 });
      if (!prices.data.length) {
        return { error: `Preço "${priceId}" não encontrado no ambiente ${env}.` };
      }
      const stripePrice = prices.data[0];

      // E-mail do usuário autenticado (para fallback no resolveOrCreateCustomer)
      const { data: { user } } = await supabase.auth.getUser();

      const customerId = await resolveOrCreateCustomer(stripe, {
        userId,
        email: user?.email ?? undefined,
      });

      const origin =
        process.env.APP_URL ?? "https://acordosinternacionais.lovable.app";

      // Fundadores → pagamento único; demais → assinatura
      const isOneTime = stripePrice.type === "one_time";

      // PaymentIntent description (só one-off): resolve o Product real
      let productDescription: string | undefined;
      if (isOneTime) {
        const productId = typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        productDescription = product.name;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: isOneTime ? "payment" : "subscription",
        ui_mode: "embedded_page",
        return_url: `${origin}/hub?checkout=${isOneTime ? "founder" : "success"}&session_id={CHECKOUT_SESSION_ID}`,
        metadata: { userId, ...(isOneTime ? { isFounder: "true" } : {}) },
        ...(isOneTime
          ? { payment_intent_data: { description: productDescription } }
          : { subscription_data: { metadata: { userId } } }),
      });

      if (!session.client_secret) {
        console.error("[checkout] session sem client_secret", session.id);
        return { error: "Erro ao iniciar checkout" };
      }
      return { clientSecret: session.client_secret };
    } catch (error) {
      console.error("[checkout] stripe error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });
