import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { acordosImportados } from "@/data/acordos.generated";
import type { OrgaoLigacao } from "@/data/acordos.types";

type DocumentoComUrl = {
  nome: string;
  desc: string;
  cat: string;
  arquivo: string;
  tamanho: string;
  url: string | null;
};

export type HubDataLocked = {
  locked: true;
  pais: string;
  titulo: string;
  instrumento: string;
  decreto: string;
  vigorDesde: string;
  documentosPreview: Array<{ nome: string; cat: string }>;
};

export type HubDataUnlocked = {
  locked: false;
  pais: string;
  titulo: string;
  instrumento: string;
  decreto: string;
  vigorDesde: string;
  orgaoBR: OrgaoLigacao | null;
  orgaoParceiro: OrgaoLigacao | null;
  beneficios: { brasil: string[]; parceiro: string[] };
  acordoTrecho: string;
  documentos: DocumentoComUrl[];
};

export type HubData = HubDataLocked | HubDataUnlocked;

export const getCountryHubData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { pais: string }) => {
    if (!/^[a-z0-9-]+$/i.test(input.pais)) throw new Error("Invalid pais");
    return input;
  })
  .handler(async ({ data, context }): Promise<HubData> => {
    const { userId } = context;
    const { pais } = data;

    const acordoData = acordosImportados[pais];
    if (!acordoData) throw new Error(`Acordo não encontrado: ${pais}`);

    const [{ data: sub }, { data: adminRole }] = await Promise.all([
      supabaseAdmin
        .from("subscriptions")
        .select("status, lifetime_access")
        .eq("user_id", userId)
        .maybeSingle(),
      supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle(),
    ]);

    const isAdmin = !!adminRole;
    const hasAccess =
      isAdmin || sub?.status === "active" || sub?.lifetime_access === true;
    if (!hasAccess) {
      return {
        locked: true,
        pais,
        titulo: acordoData.titulo ?? "",
        instrumento: acordoData.instrumento ?? "",
        decreto: acordoData.decreto ?? "",
        vigorDesde: acordoData.vigorDesde ?? "",
        documentosPreview: acordoData.documentos
          .slice(0, 1)
          .map((d) => ({ nome: d.nome, cat: d.cat })),
      };
    }

    const documentos: DocumentoComUrl[] = await Promise.all(
      acordoData.documentos.map(async (doc) => {
        const arquivo = doc.arquivo ?? "";
        let url: string | null = null;
        if (arquivo) {
          const { data: signed } = await supabaseAdmin.storage
            .from("hub-docs")
            .createSignedUrl(`${pais}/${arquivo}`, 60);
          url = signed?.signedUrl ?? null;
        }
        return {
          nome: doc.nome,
          desc: doc.desc ?? "",
          cat: doc.cat,
          arquivo,
          tamanho: doc.tamanho ?? "",
          url,
        };
      }),
    );

    await supabaseAdmin.from("downloads_log").insert({
      user_id: userId,
      country: pais,
      file_path: `${pais}/*`,
    });

    return {
      locked: false,
      pais,
      titulo: acordoData.titulo ?? "",
      instrumento: acordoData.instrumento ?? "",
      decreto: acordoData.decreto ?? "",
      vigorDesde: acordoData.vigorDesde ?? "",
      orgaoBR: acordoData.orgaoBR ?? null,
      orgaoParceiro: acordoData.orgaoParceiro ?? null,
      beneficios: acordoData.beneficios,
      acordoTrecho: acordoData.acordoTrecho ?? "",
      documentos,
    };
  });
