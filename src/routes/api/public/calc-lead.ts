import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyLead } from "@/lib/lead-notify.server";

const schema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  telefone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .regex(/^[\d()+\-\s]+$/),
  pais: z.string().max(64).nullable().optional(),
  tipo: z.string().max(64).nullable().optional(),
  tempo_brasil_meses: z.number().int().min(0).max(1200).nullable().optional(),
  tempo_pais_meses: z.number().int().min(0).max(1200).nullable().optional(),
  data_nasc: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  sexo: z.string().max(16).nullable().optional(),
  resultado_caso: z.string().max(64).nullable().optional(),
  user_agent: z.string().max(500).nullable().optional(),
  referer: z.string().max(500).nullable().optional(),
});

export const Route = createFileRoute("/api/public/calc-lead")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Bad payload", { status: 400 });
        }
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: "validation_failed", details: parsed.error.issues[0]?.message },
            { status: 400 },
          );
        }

        const { data, error } = await supabaseAdmin
          .from("calc_leads")
          .insert({
            nome: parsed.data.nome,
            email: parsed.data.email,
            telefone: parsed.data.telefone,
            pais: parsed.data.pais ?? null,
            tipo: parsed.data.tipo ?? null,
            tempo_brasil_meses: parsed.data.tempo_brasil_meses ?? null,
            tempo_pais_meses: parsed.data.tempo_pais_meses ?? null,
            data_nasc: parsed.data.data_nasc ?? null,
            sexo: parsed.data.sexo ?? null,
            resultado_caso: parsed.data.resultado_caso ?? null,
            user_agent: parsed.data.user_agent ?? null,
            referer: parsed.data.referer ?? null,
          })
          .select("id, created_at")
          .single();

        if (error || !data) {
          console.error("[calc-lead] insert falhou:", error);
          return Response.json({ error: "insert_failed" }, { status: 500 });
        }

        // Notificação em background (não bloqueia a resposta).
        notifyLead({
          id: data.id,
          nome: parsed.data.nome,
          email: parsed.data.email,
          telefone: parsed.data.telefone,
          pais: parsed.data.pais ?? null,
          tipo: parsed.data.tipo ?? null,
          tempo_brasil_meses: parsed.data.tempo_brasil_meses ?? null,
          tempo_pais_meses: parsed.data.tempo_pais_meses ?? null,
          resultado_caso: parsed.data.resultado_caso ?? null,
          created_at: data.created_at,
        }).catch((err) => console.warn("[calc-lead] notifyLead falhou:", err));

        return Response.json({ ok: true, id: data.id }, { status: 201 });
      },
    },
  },
});
