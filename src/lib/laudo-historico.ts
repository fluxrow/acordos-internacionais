import { supabase } from "@/integrations/supabase/client";
import type { LaudoPayload } from "@/lib/laudo-payload";

export type LaudoHistoricoItem = {
  id: string;
  ref: string;
  cliente_nome: string | null;
  cliente_cpf: string | null;
  pais: string | null;
  tipo: string | null;
  rmi_valor: number | null;
  caso: string | null;
  created_at: string;
};

export type LaudoHistoricoFull = LaudoHistoricoItem & {
  payload: LaudoPayload;
};

function rmiDoPayload(p: LaudoPayload): number | null {
  const r = p.resultado;
  if (r.caso === 1) return r.rmiTeorica ?? null;
  if (r.caso === 2) return null;
  return r.rmiProrata ?? r.rmiTeorica ?? null;
}

function casoStr(c: LaudoPayload["resultado"]["caso"]): string {
  return String(c);
}

/** Insere um novo laudo no histórico. Lança em caso de erro. */
export async function salvarLaudoHistorico(payload: LaudoPayload): Promise<string> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw new Error("Sessão não encontrada — faça login novamente.");

  const { data, error } = await supabase
    .from("hub_laudos")
    .insert({
      user_id: userData.user.id,
      ref: payload.ref,
      cliente_nome: payload.cliente.nome || null,
      cliente_cpf: payload.cliente.cpf || null,
      pais: payload.pais || null,
      tipo: payload.cliente.especie || null,
      rmi_valor: rmiDoPayload(payload),
      caso: casoStr(payload.resultado.caso),
      payload: payload as unknown as Record<string, unknown>,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function listarLaudosHistorico(): Promise<LaudoHistoricoItem[]> {
  const { data, error } = await supabase
    .from("hub_laudos")
    .select("id, ref, cliente_nome, cliente_cpf, pais, tipo, rmi_valor, caso, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as LaudoHistoricoItem[];
}

export async function carregarLaudoHistorico(id: string): Promise<LaudoHistoricoFull | null> {
  const { data, error } = await supabase
    .from("hub_laudos")
    .select("id, ref, cliente_nome, cliente_cpf, pais, tipo, rmi_valor, caso, created_at, payload")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as Omit<LaudoHistoricoFull, "payload">),
    payload: data.payload as unknown as LaudoPayload,
  };
}

export async function excluirLaudoHistorico(id: string): Promise<void> {
  const { error } = await supabase.from("hub_laudos").delete().eq("id", id);
  if (error) throw error;
}
