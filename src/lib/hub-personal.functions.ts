import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const paisSchema = z.string().min(1).max(64).regex(/^[a-z0-9-]+$/i);

// ============ Favoritos ============

export const listFavoritos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("hub_favoritos")
      .select("pais")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: { pais: string }) => r.pais);
  });

export const toggleFavorito = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ pais: paisSchema }).parse(input))
  .handler(async ({ data, context }): Promise<{ favorito: boolean }> => {
    const { supabase, userId } = context;
    const { data: exists } = await supabase
      .from("hub_favoritos")
      .select("id")
      .eq("user_id", userId)
      .eq("pais", data.pais)
      .maybeSingle();
    if (exists) {
      const { error } = await supabase
        .from("hub_favoritos")
        .delete()
        .eq("id", exists.id);
      if (error) throw new Error(error.message);
      return { favorito: false };
    }
    const { error } = await supabase
      .from("hub_favoritos")
      .insert({ user_id: userId, pais: data.pais });
    if (error) throw new Error(error.message);
    return { favorito: true };
  });

// ============ Notas ============

export const getNota = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ pais: paisSchema }).parse(input))
  .handler(async ({ data, context }): Promise<{ conteudo: string }> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("hub_notas")
      .select("conteudo")
      .eq("user_id", userId)
      .eq("pais", data.pais)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { conteudo: row?.conteudo ?? "" };
  });

export const saveNota = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ pais: paisSchema, conteudo: z.string().max(5000) })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("hub_notas")
      .upsert(
        {
          user_id: userId,
          pais: data.pais,
          conteudo: data.conteudo,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,pais" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ Histórico de cálculos ============

export type CalcHistoryItem = {
  id: string;
  pais: string;
  tipo: string;
  inputs: string; // JSON string (kept opaque for type-safe transport)
  resultado: string; // JSON string
  rotulo: string | null;
  created_at: string;
};

export const listCalcs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CalcHistoryItem[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("calc_history")
      .select("id, pais, tipo, inputs, resultado, rotulo, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      pais: r.pais,
      tipo: r.tipo,
      inputs: JSON.stringify(r.inputs ?? {}),
      resultado: JSON.stringify(r.resultado ?? {}),
      rotulo: r.rotulo,
      created_at: r.created_at,
    }));
  });

export const saveCalc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        pais: z.string().min(1).max(120),
        tipo: z.string().min(1).max(64),
        inputs: z.string().max(8000), // JSON-encoded by caller
        resultado: z.string().max(8000),
        rotulo: z.string().max(160).optional().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("calc_history")
      .insert({
        user_id: userId,
        pais: data.pais,
        tipo: data.tipo,
        inputs: JSON.parse(data.inputs),
        resultado: JSON.parse(data.resultado),
        rotulo: data.rotulo ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteCalc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("calc_history")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
