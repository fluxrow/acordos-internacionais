import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const FOUNDERS_LIMIT = 100;

/**
 * Baseline social: vagas exibidas como já preenchidas enquanto não há volume
 * orgânico, para sinalizar que o lote está em andamento (não é a primeira
 * compra do mundo). Some-se ao count real e respeita o teto.
 */
const FOUNDERS_SOCIAL_BASELINE = 23;

/** Pública — sem auth. Retorna quantas vagas de Fundadores foram preenchidas. */
export const getFoundersCount = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ count: number; remaining: number; isFull: boolean }> => {
    const { count } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("lifetime_access", true);

    const real = count ?? 0;
    const displayed = Math.min(FOUNDERS_LIMIT, real + FOUNDERS_SOCIAL_BASELINE);
    return {
      count: displayed,
      remaining: Math.max(0, FOUNDERS_LIMIT - displayed),
      isFull: displayed >= FOUNDERS_LIMIT,
    };
  },
);

