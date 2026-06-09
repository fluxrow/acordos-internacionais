import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { acordos } from "@/data/acordos";
import { blogPosts } from "@/data/blog-posts";
import { guias } from "@/data/guias";
import { jornadas } from "@/data/jornadas";

const BASE_URL = "https://acordosinternacionais.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/acordos", changefreq: "weekly", priority: "0.9" },
          { path: "/jornadas", changefreq: "monthly", priority: "0.8" },
          { path: "/guias", changefreq: "monthly", priority: "0.8" },
          { path: "/guias/saida-definitiva-do-pais", changefreq: "monthly", priority: "0.7" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/calculadora", changefreq: "monthly", priority: "0.8" },
          { path: "/glossario", changefreq: "monthly", priority: "0.6" },
          { path: "/profissional", changefreq: "monthly", priority: "0.8" },
          { path: "/precos", changefreq: "monthly", priority: "0.6" },
          { path: "/sobre/dr-marcos", changefreq: "yearly", priority: "0.6" },
          { path: "/contato", changefreq: "yearly", priority: "0.5" },
          { path: "/login", changefreq: "yearly", priority: "0.3" },
          { path: "/cadastro", changefreq: "yearly", priority: "0.3" },
          { path: "/reset-password", changefreq: "yearly", priority: "0.2" },
          { path: "/unsubscribe", changefreq: "yearly", priority: "0.2" },
        ];

        for (const a of acordos) entries.push({ path: `/acordos/${a.slug}`, changefreq: "monthly", priority: "0.7" });
        for (const j of jornadas) entries.push({ path: `/jornadas/${j.slug}`, changefreq: "monthly", priority: "0.6" });
        for (const g of guias) entries.push({ path: `/guias/${g.slug}`, changefreq: "monthly", priority: "0.6" });
        for (const p of blogPosts) entries.push({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" });

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
