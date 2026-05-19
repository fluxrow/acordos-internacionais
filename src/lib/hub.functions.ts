import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";
import { acordosImportados } from "@/data/acordos.generated";

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
  orgaoBR: string;
  orgaoParceiro: string;
  beneficios: { brasil: string[]; parceiro: string[] };
  acordoTrecho: string;
  documentos: DocumentoComUrl[];
};

export type HubData = HubDataLocked | HubDataUnlocked;

export const getCountryHubData = createServerFn()
  .validator((pais: string) => pais)
  .handler(async ({ data: pais }): Promise<HubData> => {
    const { userId } = await requireSupabaseAuth();
    const admin = createSupabaseAdminClient();

    const acordoData = acordosImportados[pais];
    if (!acordoData) throw new Error(`Acordo não encontrado: ${pais}`);

    const { data: sub } = await admin
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!sub || sub.status !== "active") {
      return {
        locked: true,
        pais,
        titulo: acordoData.titulo,
        instrumento: acordoData.instrumento,
        decreto: acordoData.decreto,
        vigorDesde: acordoData.vigorDesde,
        documentosPreview: acordoData.documentos
          .slice(0, 1)
          .map((d) => ({ nome: d.nome, cat: d.cat })),
      };
    }

    const documentos = await Promise.all(
      acordoData.documentos.map(async (doc) => {
        const filePath = `${pais}/${doc.arquivo}`;
        const { data: signed } = await admin.storage
          .from("hub-docs")
          .createSignedUrl(filePath, 60);
        return { ...doc, url: signed?.signedUrl ?? null };
      })
    );

    await admin.from("downloads_log").insert({
      user_id: userId,
      country: pais,
      file_path: `${pais}/*`,
    });

    return {
      locked: false,
      pais,
      titulo: acordoData.titulo,
      instrumento: acordoData.instrumento,
      decreto: acordoData.decreto,
      vigorDesde: acordoData.vigorDesde,
      orgaoBR: acordoData.orgaoBR,
      orgaoParceiro: acordoData.orgaoParceiro,
      beneficios: acordoData.beneficios,
      acordoTrecho: acordoData.acordoTrecho,
      documentos,
    };
  });
