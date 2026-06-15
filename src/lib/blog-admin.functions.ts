/**
 * ServerFns admin-only para gestão do blog: listar drafts/pautas,
 * gerar artigo (Firecrawl + IA) e publicar.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const listDraftBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
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
    await assertAdmin(context.userId);
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
    await assertAdmin(context.userId);
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
    await assertAdmin(context.userId);
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
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { status: "draft" | "published" | "archived"; publicado_em?: string } = {
      status: data.status,
    };
    if (data.status === "published") patch.publicado_em = new Date().toISOString();
    const { error } = await supabaseAdmin.from("blog_posts").update(patch).eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

const BlocoSchema = z.object({
  type: z.enum(["p", "h2"]),
  text: z.string().min(1).max(4000),
});

const UpdateSchema = z.object({
  slug: z.string().min(1).max(120),
  titulo: z.string().min(3).max(200),
  resumo: z.string().min(3).max(600),
  blocos: z.array(BlocoSchema).min(1).max(200),
  tags: z.array(z.string().min(1).max(60)).max(20),
  leitura_min: z.number().int().min(1).max(60),
});

export const updateBlogPostDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.input<typeof UpdateSchema>) => UpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blog_posts")
      .update({
        titulo: data.titulo,
        resumo: data.resumo,
        blocos: data.blocos,
        tags: data.tags,
        leitura_min: data.leitura_min,
      })
      .eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "post";
}

export const createBlogPostDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { titulo: string }) =>
    z.object({ titulo: z.string().min(3).max(200) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const base = slugify(data.titulo);
    let slug = base;
    // garante unicidade tentando sufixos -2, -3...
    for (let i = 2; i < 50; i++) {
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${base}-${i}`;
    }
    const { error } = await supabaseAdmin.from("blog_posts").insert({
      slug,
      titulo: data.titulo,
      resumo: "",
      blocos: [{ type: "p", text: "" }],
      tags: [],
      fontes: [],
      leitura_min: 5,
      status: "draft",
    });
    if (error) throw error;
    return { slug, titulo: data.titulo };
  });
