/**
 * Helpers server-only para o pipeline de geração de artigos do blog.
 *
 * Pipeline:
 *  1. Pega 1 pauta ativa não usada (mais antiga primeiro, maior prioridade primeiro).
 *  2. Firecrawl `search` em fontes_sugeridas (ou query genérica).
 *  3. Firecrawl `scrape` (markdown, onlyMainContent) nas 3 melhores URLs.
 *  4. Lovable AI Gateway (gemini-2.5-flash) com schema JSON gera o post.
 *  5. Insere em blog_posts como draft + marca a pauta como usada.
 *
 * Este módulo é *.server.ts — só pode ser importado de outros *.server.ts
 * ou via `await import()` dentro de handlers de serverFn / server route.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface FirecrawlSearchHit {
  url: string;
  title?: string;
  description?: string;
}

interface ScrapeResult {
  url: string;
  title?: string;
  markdown: string;
}

interface GeneratedPost {
  slug: string;
  titulo: string;
  resumo: string;
  blocos: Array<{ type: "p" | "h2"; text: string }>;
  tags: string[];
  leitura_min: number;
}

function requireFirecrawl(): string {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) throw new Error("FIRECRAWL_API_KEY ausente");
  return key;
}

function requireLovableAi(): string {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY ausente");
  return key;
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function firecrawlSearch(query: string, limit = 5): Promise<FirecrawlSearchHit[]> {
  const res = await fetch(`${FIRECRAWL_BASE}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireFirecrawl()}`,
    },
    body: JSON.stringify({ query, limit, lang: "pt", country: "br" }),
  });
  if (!res.ok) throw new Error(`firecrawl search ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: { web?: FirecrawlSearchHit[] } | FirecrawlSearchHit[] };
  const data = Array.isArray(json.data) ? json.data : json.data?.web ?? [];
  return data.filter((h) => !!h.url);
}

async function firecrawlScrape(url: string): Promise<ScrapeResult | null> {
  const res = await fetch(`${FIRECRAWL_BASE}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireFirecrawl()}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: { markdown?: string; metadata?: { title?: string } };
    markdown?: string;
    metadata?: { title?: string };
  };
  const markdown = json.data?.markdown ?? json.markdown ?? "";
  const title = json.data?.metadata?.title ?? json.metadata?.title;
  if (!markdown || markdown.length < 200) return null;
  return { url, title, markdown: markdown.slice(0, 12000) };
}

const SYSTEM_PROMPT = `Você é o Dr. Marcos Espínola, advogado previdenciarista brasileiro especialista em acordos internacionais de previdência social. Escreve artigos editoriais para o blog "Acordo Internacional" (acordosinternacionais.com).

Regras absolutas:
- Português brasileiro, didático, tom direto e respeitoso, sem juridiquês desnecessário.
- NUNCA invente depoimentos, casos ou números. Se faltar dado, escreva de forma geral.
- Cite fontes oficiais (gov.br, INSS, Receita Federal, OISS, INPS, SSA etc) usando o nome do órgão no texto — não inclua links inline; eles serão renderizados separadamente.
- Use parágrafos curtos. Subtítulos em forma de pergunta ou afirmação ajudam a leitura.
- Não copie texto literal das fontes. Reescreva e sintetize.
- Não mencione "neste artigo vamos ver" ou meta-comentários.
- Saída em JSON estrito conforme o schema.`;

const RESPONSE_SCHEMA = {
  type: "object",
  required: ["titulo", "resumo", "blocos", "tags", "leitura_min"],
  properties: {
    titulo: { type: "string", description: "Título do artigo, até 90 caracteres" },
    resumo: { type: "string", description: "Resumo até 280 caracteres" },
    blocos: {
      type: "array",
      minItems: 6,
      items: {
        type: "object",
        required: ["type", "text"],
        properties: {
          type: { type: "string", enum: ["p", "h2"] },
          text: { type: "string" },
        },
      },
    },
    tags: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
    leitura_min: { type: "integer", minimum: 3, maximum: 20 },
  },
  additionalProperties: false,
};

async function callLovableAi(userPrompt: string): Promise<GeneratedPost> {
  const res = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireLovableAi()}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "blog_post", strict: true, schema: RESPONSE_SCHEMA },
      },
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI gateway sem conteúdo");
  const parsed = JSON.parse(content) as Omit<GeneratedPost, "slug">;
  return { ...parsed, slug: slugify(parsed.titulo) };
}

export interface GenerateResult {
  slug: string;
  titulo: string;
  topicId: string;
}

/**
 * Executa o pipeline completo. Retorna o slug do post criado.
 * `topicId` opcional força uma pauta específica; senão pega a próxima da fila.
 */
export async function generatePostFromQueue(topicId?: string): Promise<GenerateResult> {
  // 1. Pauta
  const topicQuery = supabaseAdmin
    .from("blog_topics")
    .select("*")
    .eq("ativo", true)
    .is("usado_em", null)
    .order("prioridade", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);
  const { data: topics, error: topicErr } = topicId
    ? await supabaseAdmin.from("blog_topics").select("*").eq("id", topicId).limit(1)
    : await topicQuery;
  if (topicErr) throw topicErr;
  const topic = topics?.[0];
  if (!topic) throw new Error("Nenhuma pauta disponível na fila.");

  // 2. Search + scrape
  const searchQuery =
    topic.fontes_sugeridas && topic.fontes_sugeridas.length > 0
      ? `${topic.titulo_sugerido} site:${new URL(topic.fontes_sugeridas[0]).hostname}`
      : `${topic.titulo_sugerido} acordo previdência social Brasil`;
  let hits: FirecrawlSearchHit[] = [];
  try {
    hits = await firecrawlSearch(searchQuery, 5);
  } catch (e) {
    console.error("[blog-gen] firecrawl search falhou:", e);
  }
  // Inclui as fontes sugeridas mesmo sem search
  const urls = Array.from(
    new Set([
      ...(topic.fontes_sugeridas ?? []),
      ...hits.map((h) => h.url),
    ]),
  ).slice(0, 4);

  const scraped: ScrapeResult[] = [];
  for (const url of urls) {
    try {
      const s = await firecrawlScrape(url);
      if (s) scraped.push(s);
      if (scraped.length >= 3) break;
    } catch (e) {
      console.error("[blog-gen] scrape falhou:", url, e);
    }
  }

  // 3. Prompt para a IA
  const fontesBloco = scraped
    .map((s, i) => `### Fonte ${i + 1} — ${s.title ?? s.url}\nURL: ${s.url}\n\n${s.markdown}`)
    .join("\n\n---\n\n");
  const userPrompt = `Pauta: ${topic.titulo_sugerido}

Instrução editorial:
${topic.prompt}

Tags sugeridas: ${(topic.tags ?? []).join(", ") || "—"}

Fontes consultadas (resumos brutos extraídos via web scraping):
${fontesBloco || "(nenhuma fonte adicional disponível — escreva com base em conhecimento previdenciário público)"}

Escreva o artigo seguindo o schema JSON.`;

  const post = await callLovableAi(userPrompt);

  // 4. Insere como draft (se o slug colidir, sufixar)
  const fontes = scraped.map((s) => ({ url: s.url, titulo: s.title ?? s.url }));
  let finalSlug = post.slug;
  for (let i = 2; i < 10; i++) {
    const { data: exists } = await supabaseAdmin
      .from("blog_posts")
      .select("slug")
      .eq("slug", finalSlug)
      .maybeSingle();
    if (!exists) break;
    finalSlug = `${post.slug}-${i}`;
  }

  const { error: insertErr } = await supabaseAdmin.from("blog_posts").insert({
    slug: finalSlug,
    titulo: post.titulo,
    resumo: post.resumo,
    blocos: post.blocos,
    tags: post.tags,
    fontes,
    leitura_min: post.leitura_min,
    status: "draft",
  });
  if (insertErr) throw insertErr;

  await supabaseAdmin.from("blog_topics").update({ usado_em: new Date().toISOString() }).eq("id", topic.id);

  return { slug: finalSlug, titulo: post.titulo, topicId: topic.id };
}
