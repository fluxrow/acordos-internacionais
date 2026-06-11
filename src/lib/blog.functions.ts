/**
 * ServerFns públicas para leitura do blog. Usadas pelos loaders de
 * /blog e /blog/$slug (rotas públicas, SSR habilitado), portanto
 * carregam o admin client dentro do handler.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface PublicBlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  blocos: Array<{ type: "p" | "h2"; text: string }>;
  tags: string[];
  fontes: Array<{ url: string; titulo: string }>;
  leitura_min: number;
  autor: string;
  publicado_em: string;
}

const POST_COLS = "slug, titulo, resumo, blocos, tags, fontes, leitura_min, autor, publicado_em";

export const listPublishedBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select(POST_COLS)
    .eq("status", "published")
    .order("publicado_em", { ascending: false })
    .limit(100);
  if (error) {
    console.error("[blog] listPublishedBlogPosts:", error);
    return { posts: [] as PublicBlogPost[] };
  }
  return { posts: (data ?? []) as PublicBlogPost[] };
});

export const getPublishedBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_COLS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) {
      console.error("[blog] getPublishedBlogPost:", error);
      return { post: null };
    }
    return { post: (post ?? null) as PublicBlogPost | null };
  });
