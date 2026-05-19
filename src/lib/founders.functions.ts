import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const FOUNDERS_LIMIT = 100;

/** Pública — sem auth. Retorna quantas vagas de Fundadores foram preenchidas. */
export const getFoundersCount = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ count: number; remaining: number; isFull: boolean }> => {
    const { count } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("lifetime_access", true);

    const total = count ?? 0;
    return {
      count: total,
      remaining: Math.max(0, FOUNDERS_LIMIT - total),
      isFull: total >= FOUNDERS_LIMIT,
    };
  },
);
