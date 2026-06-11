/**
 * Endpoint público chamado pelo pg_cron 2x por semana para gerar um
 * novo artigo do blog em modo draft (publicação manual depois).
 *
 * Autenticação: header `apikey` deve bater com a anon key do projeto
 * (já injetada pelo Lovable Cloud em SUPABASE_PUBLISHABLE_KEY).
 */
import { createFileRoute } from "@tanstack/react-router";

function unauthorized() {
  return new Response("Unauthorized", { status: 401 });
}

export const Route = createFileRoute("/api/public/hooks/blog-gen")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected) return new Response("Server misconfigured", { status: 500 });
        const apikey = request.headers.get("apikey") ?? request.headers.get("x-api-key");
        if (apikey !== expected) return unauthorized();

        try {
          const { generatePostFromQueue } = await import("@/lib/blog-gen.server");
          const result = await generatePostFromQueue();
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          console.error("[blog-gen cron]", message);
          return Response.json({ ok: false, error: message }, { status: 500 });
        }
      },
    },
  },
});
