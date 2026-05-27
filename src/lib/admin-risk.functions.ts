import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type RiskFlag = {
  id: string;
  user_id: string;
  user_email: string | null;
  kind: string;
  score: number;
  evidence: string;
  created_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
};


async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const listRiskFlags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RiskFlag[]> => {
    await assertAdmin(context.userId);
    const { data: flags } = await supabaseAdmin
      .from("account_risk_flags")
      .select("id, user_id, kind, score, evidence, created_at, resolved_at, resolution_note")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!flags?.length) return [];

    const userIds = Array.from(new Set(flags.map((f) => f.user_id)));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .in("id", userIds);

    const emailMap = new Map((profiles ?? []).map((p) => [p.id, p.email]));

    return flags.map((f) => ({
      ...f,
      evidence: JSON.stringify(f.evidence ?? {}),
      user_email: emailMap.get(f.user_id) ?? null,
    }));

  });

export const resolveRiskFlag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      flagId: z.string().uuid(),
      note: z.string().max(500).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await supabaseAdmin
      .from("account_risk_flags")
      .update({
        resolved_at: new Date().toISOString(),
        resolved_by: context.userId,
        resolution_note: data.note ?? null,
      })
      .eq("id", data.flagId);
    return { ok: true };
  });
