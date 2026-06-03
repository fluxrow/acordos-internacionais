import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type LeadStatus = "novo" | "contatado" | "convertido" | "descartado";

export type AdminLead = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pais: string | null;
  tipo: string | null;
  tempo_brasil_meses: number | null;
  tempo_pais_meses: number | null;
  resultado_caso: string | null;
  status: LeadStatus;
  notas: string | null;
  created_at: string;
};

async function ensureAdmin(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("forbidden");
}

export const listAdminLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminLead[]> => {
    const { userId } = context;
    await ensureAdmin(userId);

    const { data, error } = await supabaseAdmin
      .from("calc_leads")
      .select(
        "id, nome, email, telefone, pais, tipo, tempo_brasil_meses, tempo_pais_meses, resultado_caso, status, notas, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      ...r,
      status: (r.status as LeadStatus) ?? "novo",
    }));
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "contatado", "convertido", "descartado"]).optional(),
  notas: z.string().max(2000).nullable().optional(),
});

export const updateAdminLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { userId } = context;
    await ensureAdmin(userId);

    const patch: { status?: LeadStatus; notas?: string | null } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.notas !== undefined) patch.notas = data.notas;

    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await supabaseAdmin
      .from("calc_leads")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
