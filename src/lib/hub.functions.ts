import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { acordosImportados } from "@/data/acordos.generated";
import type { OrgaoLigacao } from "@/data/acordos.types";

export type HubDashboardData = {
  hasAccess: boolean;
  isAdmin: boolean;
  isActive: boolean;
  lifetime: boolean;
  periodEnd: string | null;
  recentCountries: Array<{ pais: string; lastAt: string; count: number }>;
};

export const getHubDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<HubDashboardData> => {
    const { userId } = context;

    const [{ data: sub }, { data: adminRole }, { data: recent }] =
      await Promise.all([
        supabaseAdmin
          .from("subscriptions")
          .select("status, lifetime_access, current_period_end")
          .eq("user_id", userId)
          .maybeSingle(),
        supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle(),
        supabaseAdmin
          .from("downloads_log")
          .select("country, downloaded_at")
          .eq("user_id", userId)
          .order("downloaded_at", { ascending: false })
          .limit(30),
      ]);

    const isAdmin = !!adminRole;
    const isActive = sub?.status === "active";
    const lifetime = sub?.lifetime_access === true;
    const hasAccess = isAdmin || isActive || lifetime;

    // Dedup mantendo o mais recente por país, máx 5
    const seen = new Map<string, { lastAt: string; count: number }>();
    for (const row of recent ?? []) {
      const cur = seen.get(row.country);
      if (cur) {
        cur.count += 1;
      } else {
        seen.set(row.country, { lastAt: row.downloaded_at, count: 1 });
      }
    }
    const recentCountries = Array.from(seen.entries())
      .slice(0, 5)
      .map(([pais, v]) => ({ pais, lastAt: v.lastAt, count: v.count }));

    return {
      hasAccess,
      isAdmin,
      isActive,
      lifetime,
      periodEnd: sub?.current_period_end ?? null,
      recentCountries,
    };
  });

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

    const slugifyFilename = (name: string): string => {
      const dot = name.lastIndexOf(".");
      const base = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
      const slug = base
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return slug + ext;
    };

    const documentos: DocumentoComUrl[] = await Promise.all(
      acordoData.documentos.map(async (doc) => {
        const arquivo = doc.arquivo ?? "";
        let url: string | null = null;
        if (arquivo) {
          // Storage usa nomes slugificados (ver scripts/sync-hub-docs.ts)
          const storageName = slugifyFilename(arquivo);
          // Extensão real do arquivo no bucket
          const ext = arquivo.match(/\.[a-z0-9]+$/i)?.[0] ?? ".pdf";
          // Nome humano que o advogado vê na pasta Downloads
          const filename = `${doc.nome}${ext}`.replace(/[\\/:*?"<>|]/g, "-");
          const { data: signed } = await supabaseAdmin.storage
            .from("hub-docs")
            .createSignedUrl(`${pais}/${storageName}`, 60, { download: filename });
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
