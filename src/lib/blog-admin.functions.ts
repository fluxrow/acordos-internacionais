/**
 * ServerFns admin-only para gestão do blog: listar drafts/pautas,
 * gerar artigo (Firecrawl + IA) e publicar.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: ReturnType<typeof requireSupabaseAuth>; userId: string }): Promise<void> {
  // Não use o supabase do contexto direto — preferimos has_role via supabaseAdmin para evitar RLS recursivo.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const listDraftBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("blog_posts")
      .select("slug, titulo, resumo, tags, status, publicado_em, created_at, updated_at, leitura_min")
      .order("created_at", { ascending: false })
      .limit(50);
    return { posts: data ?? [] };
  });

export const getBlogPostFull = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    return { post };
  });

export const listBlogTopics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("blog_topics")
      .select("*")
      .order("ativo", { ascending: false })
      .order("usado_em", { ascending: true, nullsFirst: true })
      .order("prioridade", { ascending: false });
    return { topics: data ?? [] };
  });

export const generateBlogPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { topicId?: string }) => z.object({ topicId: z.string().uuid().optional() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { generatePostFromQueue } = await import("@/lib/blog-gen.server");
    return await generatePostFromQueue(data.topicId);
  });

export const setBlogPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { slug: string; status: "draft" | "published" | "archived" }) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        status: z.enum(["draft", "published", "archived"]),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "published") patch.publicado_em = new Date().toISOString();
    const { error } = await supabaseAdmin.from("blog_posts").update(patch).eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });
