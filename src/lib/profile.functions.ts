import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

export type AccountData = {
  firstName: string;
  fullName: string | null;
  email: string | null;
  subscription: {
    status: string;
    periodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    priceId: string | null;
    stripeCustomerId: string | null;
  } | null;
};

export const getAccountData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccountData> => {
    const { userId, claims } = context;

    const [{ data: profile }, { data: sub }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .maybeSingle(),
      supabaseAdmin
        .from("subscriptions")
        .select(
          "status, current_period_end, cancel_at_period_end, price_id, stripe_customer_id",
        )
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    const fullName = profile?.full_name ?? null;
    const email =
      profile?.email ?? (claims as { email?: string }).email ?? null;
    const firstName =
      fullName?.split(" ")[0] ?? email?.split("@")[0] ?? "você";

    return {
      firstName,
      fullName,
      email,
      subscription: sub
        ? {
            status: sub.status,
            periodEnd: sub.current_period_end,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            priceId: sub.price_id,
            stripeCustomerId: sub.stripe_customer_id,
          }
        : null,
    };
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { env: StripeEnv }) => input)
  .handler(
    async ({ data, context }): Promise<{ url: string } | { error: string }> => {
      const { userId } = context;
      const { env } = data;

      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!sub?.stripe_customer_id) return { error: "Sem assinatura ativa" };

      let stripe: ReturnType<typeof createStripeClient>;
      try {
        stripe = createStripeClient(env);
      } catch {
        return { error: "Serviço temporariamente indisponível" };
      }

      const origin =
        process.env.APP_URL ?? "https://acordosinternacionais.lovable.app";

      const session = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id,
        return_url: `${origin}/conta`,
      });

      return { url: session.url };
    },
  );
