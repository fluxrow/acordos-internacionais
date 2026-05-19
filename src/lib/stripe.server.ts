// Wrapper do cliente Stripe para Cloudflare Workers.
// Sempre usar createStripeClient() — nunca instanciar Stripe() diretamente.
import Stripe from "stripe";

export function createStripeClient(env?: string) {
  const key =
    env === "live"
      ? process.env.STRIPE_LIVE_API_KEY
      : (process.env.STRIPE_SANDBOX_API_KEY ?? process.env.STRIPE_API_KEY);

  if (!key) throw new Error(`[stripe] API key não configurada (env=${env ?? "sandbox"})`);

  return new Stripe(key, {
    apiVersion: "2024-12-18.acacia",
    // Compatível com Cloudflare Workers (sem Node.js http)
    httpClient: Stripe.createFetchHttpClient(),
  });
}
