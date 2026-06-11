
## Diagnóstico (o que encontrei)

**Repositório do Marcos** — pasta `Acordos e Ajustes Revisados` no GitHub tem **44 arquivos .docx** revisados: 25 Acordos (todos os países do nosso dataset) + 19 Ajustes Administrativos. Mesmo padrão do `Acordo_formatado.docx` que importamos para o Canadá na rodada passada.

**Blog** — tecnicamente as rotas `/blog` e `/blog/$slug` funcionam, **mas** só existe **1 post hardcoded** em `src/data/blog-posts.ts` (saída definitiva). Não há tabela no banco, não há geração automática, não há cron de publicação. O "não funciona" é isso: o pipeline planejado nunca foi montado.

**Firecrawl** — conector **Fluxrow** existe na workspace, **não linkado** a este projeto. Nenhum código usa Firecrawl hoje.

**Cron jobs ativos no Supabase** — só dois: `cleanup-session-events` (3h diário) e `process-email-queue` (5s). **Não existe** nenhum cron de geração de artigos.

---

## Plano

### Bloco 1 — Importar os 44 documentos revisados

1. **Script `scripts/import-acordos-revisados.ts`** (novo) — baixa cada `.docx` do repo, extrai texto via `mammoth`, separa em seções (Cabeçalho, Fundamentação, Objetivos, Organismos, Totalização, Benefícios, Aposentadoria por idade, Aposentadoria por invalidez, Pensão por morte, Certificado de deslocamento, Regras de legislação, Onde requerer) seguindo a estrutura do Canadá, e reescreve `src/data/acordos-textos/<slug>.ts` (exports `acordo` e `ajuste`). Mapa folder→slug igual ao `sync-hub-docs.ts`.
2. **Rodar o script** — gera 25 arquivos atualizados (acordos) + sobrescreve `ajuste` em 19 deles. Países sem `Ajuste Administrativo` no repo (Bulgária, Cabo Verde, Coreia, Israel, CPLP, Moçambique) mantêm o `ajuste` atual.
3. **`scripts/import-acordos.ts`** — expandir `PRESERVE_TEXTO_INTEGRAL` para incluir os 25 slugs, para que reimportações futuras do dataset original não sobrescrevam o texto curado.
4. **Spot-check visual** em `/acordos/canada`, `/acordos/alemanha`, `/acordos/japao` (3 amostras de regiões diferentes).

### Bloco 2 — Pipeline de geração de artigos do blog

**Schema do banco** (migração):
- Tabela `public.blog_posts` (slug pk, titulo, resumo, blocos jsonb, tags text[], fontes jsonb [{url,titulo}], leitura_min, status text default 'draft', publicado_em timestamptz, created_at, updated_at). Trigger `handle_updated_at`. RLS: SELECT anon para `status='published'`; ALL para admin via `has_role`. GRANTs explícitos.
- Tabela `public.blog_topics` (id, prompt text, tags text[], fontes_sugeridas text[], usado_em timestamptz, ativo bool) — fila de pautas. Admin-only. Vou popular com 12 pautas iniciais (acordos, totalização, saída definitiva, prova de vida, CDSP, INSS exterior, etc).

**Firecrawl** — linkar o connector `Fluxrow` ao projeto. Secret `FIRECRAWL_API_KEY` fica disponível para serverFn.

**ServerFn `src/lib/blog-gen.functions.ts`**:
- `generateBlogPostFromTopic` (admin-only, `requireSupabaseAuth` + `has_role('admin')`): pega 1 pauta ativa não usada → Firecrawl `search` nas fontes sugeridas (gov.br, INSS, OIT, Receita) → top 3 URLs → Firecrawl `scrape` (markdown, onlyMainContent) → Lovable AI Gateway (`google/gemini-2.5-flash`) com prompt no estilo Dr. Marcos (didático, citando fontes, sem inventar depoimentos) gera `{titulo, resumo, blocos[], tags, leitura_min}` em JSON estruturado → insere em `blog_posts` como `draft` com `fontes` preenchidas → marca pauta como usada.
- `publishBlogPost(slug)` (admin) — muda status para `published` e seta `publicado_em`.
- `listDraftBlogPosts` / `listPublishedBlogPosts`.

**Rota pública cron** `src/routes/api/public/hooks/blog-gen.ts` — POST que valida `apikey` header contra anon key, chama internamente a lógica de `generateBlogPostFromTopic` (sem o gate de auth, mas com o gate da apikey + verificação de não ser chamada externa abusiva). Gera **draft** — publicação manual pelo admin no Hub.

**Cron Supabase** — `pg_cron` 2x/semana (terça e sexta 09:00 BRT = 12:00 UTC) chama a rota pública com `apikey` header.

### Bloco 3 — Frontend do blog

5. **`src/routes/blog.tsx`** — ler posts via serverFn público `listPublishedBlogPosts` (loader). Mescla com o post hardcoded existente (mantém compatibilidade) ou migra o hardcoded para um seed na migração — vou seed via migração para ter fonte única.
6. **`src/routes/blog.$slug.tsx`** — loader busca por slug no DB. Renderiza blocos + bloco extra "Fontes consultadas" com links das `fontes` quando existirem.
7. **Página admin `/hub/blog`** (`_authenticated/hub.blog.tsx`) — lista drafts, botão "Gerar artigo" (chama serverFn manualmente para testar), botão "Publicar" por draft, preview inline.

### Bloco 4 — Documentação

8. Atualizar `.lovable/prd.md`, `ROADMAP.md` (Core memory já obriga).

---

## Detalhes técnicos

- `mammoth` (já listado no projeto se não, `bun add -D mammoth`) para `.docx → text`.
- Lovable AI Gateway: usar `google/gemini-2.5-flash` (default, sem custo extra para texto curto) com `response_format: json_schema`.
- Cron usa pattern documentado: `apikey` header com anon key, sem secret custom.
- `blog_posts.blocos` JSONB com shape `[{type:'p'|'h2', text:string}]` (igual ao tipo já existente).
- Hub admin gate: `has_role(auth.uid(), 'admin')`.
- Imagens: **não vou gerar** — o tema atual usa cards tipográficos sem imagem no blog.

## Fora de escopo

- Não muda visual do `/blog` (segue Premium Dark + Gold atual).
- Não muda os 24 acordos no público além de substituir o texto.
- Sem auto-publicação — drafts ficam aguardando revisão do Marcos.
- Sem email de notificação de novo draft (pode ser adendo depois).

## Arquivos a criar/editar

**Novos:**
- `scripts/import-acordos-revisados.ts`
- `src/lib/blog-gen.functions.ts`
- `src/lib/blog-gen.server.ts` (Firecrawl + AI helpers)
- `src/routes/api/public/hooks/blog-gen.ts`
- `src/routes/_authenticated/hub.blog.tsx`
- Migração: tabelas `blog_posts` + `blog_topics` + seeds

**Editados:**
- 25× `src/data/acordos-textos/<pais>.ts`
- `scripts/import-acordos.ts` (expandir PRESERVE)
- `src/routes/blog.tsx`, `src/routes/blog.$slug.tsx`
- `src/components/hub/hub-sidebar.tsx` (link Blog no admin)
- `.lovable/prd.md`, `ROADMAP.md`

## Confirmações que preciso antes de executar

1. **Linkar o connector Firecrawl `Fluxrow`** a este projeto — ok?
2. **Cron 2x/semana** — terça e sexta 09:00 BRT está bom, ou outra cadência?
3. **Drafts** — confirma que NÃO quero auto-publicação (Marcos revisa e clica publicar no Hub)?
