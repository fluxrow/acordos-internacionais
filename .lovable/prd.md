# PRD — Acordo Internacional

> Documento vivo. **Toda mudança no projeto deve atualizar este PRD na mesma rodada.** Última revisão: 2026-05-19.
>
> Coordenação Lovable ↔ Claude (GitHub): ver [`COLLAB.md`](../COLLAB.md). Status cronológico: ver [`ROADMAP.md`](../ROADMAP.md). Convenções de código: ver [`README.md`](../README.md).

## 1. Visão

**Acordo Internacional** é o hub de referência sobre **acordos previdenciários bilaterais e totalização** para brasileiros no exterior e advogados previdenciários que atuam com esse tema.

Dois públicos, um produto:

- **Público 1 — Beneficiário final** (brasileiro no exterior / família): chega por busca orgânica, quer entender se tem direito, em qual país, com qual documento. Conteúdo gratuito e SEO-first.
- **Público 2 — Advogado previdenciário** (cliente pagante do hub): precisa de material técnico organizado por país — texto do acordo, decretos, formulários oficiais, modelos de petição, jurisprudência, planilhas de cálculo. Acessa via **login + assinatura paga**.

**Autoridade-rosto:** Dr. Marcos Espínola. Aparece como especialista nos CTAs, página `/sobre/dr-marcos` e blog — não é a marca.

**Marca / assinatura institucional:** "Acordo Internacional **by AtlasPrev**".

## 2. Métricas de sucesso

- **Aquisição (Público 1):** tráfego orgânico nas 21 páginas de país + 3 multilaterais; CTR no CTA de contato.
- **Conversão (Público 2):** signup de advogado → assinatura ativa; downloads/mês por assinante; retenção mensal.
- **Marca:** menções diretas a "Acordo Internacional" (não a "Dr. Marcos") em buscas.

## 3. Escopo atual (implementado)

| Área | Status |
|---|---|
| Rotas públicas: `/`, `/acordos`, `/acordos/:pais` (25 entradas), `/jornadas/:jornada`, `/guias/:slug`, `/blog`, `/glossario`, `/contato`, `/profissional`, `/sobre/dr-marcos` | ✅ |
| Reposicionamento de marca (favicon, og-image, header, footer, metadados) | ✅ |
| OG por país — 25 imagens, multilaterais com selo "MULTI" | ✅ |
| CI: `check-brand` e `check-og` (falha build se sobrar slug antigo ou OG faltando) | ✅ |
| Tipografia, tokens (`src/styles.css`), hover/focus/active consistentes | ✅ |
| Lovable Cloud (Supabase) provisionado — `src/integrations/supabase/*` e `supabase/migrations/` existem | ✅ |
| Stripe Payments (seamless) habilitado — webhook sandbox registrado em `/api/public/payments/webhook?env=sandbox` | ✅ |
| TanStack Start em Cloudflare Workers | ✅ |
| **Migração de dados do repo `Mapa-de-Acordos`** — 24 HTMLs parseados → `src/data/acordos.generated.ts` | ✅ |
| **Página `/acordos/:pais` reformatada** — Instrumento/Vigência, Órgãos de Ligação BR+parceiro, Benefícios em colunas, Documentos com badge "Hub PRO" | ✅ |
| **Refino visual `/acordos/:pais`** — wash wine no hero, moldura na bandeira, aside com backdrop-blur, fallback gracioso em órgãos vazios, nav Anterior/Próximo com mini-bandeiras e hover wine | ✅ |
| **Refino visual v2 `/acordos/:pais`** — duplo radial wine + linha gradiente no hero, FichaItem em cards backdrop-blur com hover wine, documentos agrupados por categoria com eyebrow wine + contador, CTA "Download no Hub" unificado no topo (em vez de poluir cada linha), ProContentLock redesenhado com duplo radial wine, headline display e CTA pill accent-ink | ✅ |
| **Refino UX editorial v3 `/acordos/:pais`** — stats line no hero (anos em vigor, órgãos, documentos), helper `<Highlight>` destacando palavras-chave em wine no lede e em "Como funciona", TOC sticky "Nesta página" no aside com numeração mono e scroll suave, blocos com kicker `01 ·` + lede curto, OrgaoCard com ícones Lucide e rótulo "Lado X" em wine, BeneficiosComparativo em tabela 2-col com divisória wine, documentos em flat-list com pill de categoria wine-soft e cadeado Lucide com hover wine-soft | ✅ |
| **Repositório GitHub conectado** (sync bidirecional) | ✅ |
| **README.md na raiz** com convenções para humanos e IAs externas | ✅ |
| **ROADMAP.md na raiz** com timeline e próximos passos | ✅ |
| **COLLAB.md na raiz** com divisão Lovable ↔ Claude e regras de coordenação | ✅ |
| Copy de `pro-content-lock.tsx` alinhado a modelo de assinatura (não mais "pagamento único") | ✅ |
| **Infra Hub (Claude PR):** migração SQL (`hub_schema`), `_authenticated.tsx`, `hub.functions.ts`, `payments/webhook.ts`, `checkout.functions.ts` | ✅ |

## 4. Próxima rodada — Hub do Advogado (MVP pago)

### 4.1 Conteúdo do hub

Base **já importada** do repo externo `marcosespinola1379/Mapa-de-Acordos`:
- HTMLs rascunho dos 24 acordos → dados estruturados em `src/data/acordos.generated.ts`.
- **A fazer:** subir documentos (PDFs, .docx) para Supabase Storage, bucket privado `hub-docs/`, organizado por `hub-docs/{pais}/{tipo}/{arquivo}`.
- Metadados (existência do arquivo, título, categoria) já aparecem no preview gratuito como teaser; URL real só sai via signed URL para assinante ativo.

### 4.2 Acesso e autenticação

- **Login / Cadastro / Reset**: `/login`, `/cadastro`, `/reset-password` vivos com email+senha (`supabase.auth.signUp` / `signInWithPassword` / `resetPasswordForEmail` + `updateUser`) e botão "Continuar com Google" via `lovable.auth.signInWithOAuth` (broker Lovable Cloud, provider `google` habilitado). `/cadastro` mostra estado "verifique seu e-mail" quando `auto_confirm_email` está off.
- **Perfis**: `profiles` (1:1 com `auth.users`) — apenas `full_name` e `email` (sem OAB, sem telefone, sem foto). Exibição: "Bom dia, Marcos."
- **Roles**: `user_roles` separada (`app_role` enum: `subscriber`, `admin`). Nunca na `profiles`.
- **Assinatura**: Stripe via Lovable Payments. Plano único mensal/anual no MVP.
- **Gate**: server function `getCountryHubData(pais)` valida `subscriptions.status='active'` antes de devolver signed URLs com TTL curto.
- **Acesso admin**: usuários com role `admin` em `user_roles` são tratados como vitalícios em `getCountryHubData` e `getAccountData` (`AccountData.isAdmin: boolean`). UI do `/_authenticated/hub` mostra chip "Modo admin" em wine e oculta o paywall. Concessão manual via `INSERT INTO user_roles` após cadastro. Painel admin de gestão de assinaturas fica para rodada futura.

### 4.3 Rotas novas

| Rota | Função |
|---|---|
| `/login`, `/cadastro`, `/reset-password` | Auth público |
| `/_authenticated/hub` | Dashboard do advogado |
| `/_authenticated/hub/$pais` | Material técnico + downloads |
| `/_authenticated/conta` | Perfil + portal Stripe |
| `/precos` | Pricing público → checkout |
| `/api/public/payments/webhook` | Webhook Stripe — caminho **fixo** exigido pela plataforma; recebe `?env=sandbox\|live` |

`/acordos/:pais` ganha bloco final "Material técnico para advogados" → CTA para `/precos`.

### 4.4 Schema (resumo)

```sql
-- profiles (1:1 com auth.users)
-- user_roles (user_id, role app_role) + has_role(uuid, app_role) SECURITY DEFINER
-- subscriptions (user_id, stripe_customer_id, status, price_id, current_period_end)
-- downloads_log (user_id, country, file_path, downloaded_at)
```

### 4.5 Critérios de aceite

- Anônimo vê página pública + CTA para hub.
- Cadastro grátis funciona; área `/hub/*` em paywall até assinar.
- Compra Stripe libera acesso em <30s (webhook).
- Cancelamento revoga acesso ao fim do período pago.
- Downloads logados em `downloads_log`.
- CI continua passando.

## 5. Backlog pós-MVP do hub

1. Calculadora de totalização por país (interativa, usa `acordos.ts`).
2. Formulário de contato com envio de e-mail (Lovable Email para `contato@`).
3. Blog com CMS leve (markdown em repo ou Supabase com editor admin).
4. SEO técnico: JSON-LD `GovernmentService`/`Article`, sitemap dinâmico, hreflang.
5. Analytics (PostHog ou Plausible).
6. Idiomas EN/ES — avaliar.

## 6. Decisões pendentes

- **Preço da assinatura** (mensal/anual, valor, trial?).
- **Plano único ou tiers** (por número de países, volume de downloads)?
- **Nome do produto pago**: "Hub Profissional", "Hub do Advogado", outro?
- **Documentos por país**: iguais para todos os assinantes ou material premium destacado?

## 7. Stack

- **Frontend/SSR:** TanStack Start v1 + React 19 + Vite 7
- **Estilo:** Tailwind v4 via `src/styles.css` (tokens oklch)
- **Backend:** Lovable Cloud (Supabase) — auth, Postgres, Storage
- **Pagamentos:** Stripe via Lovable Payments (habilitado — seamless mode)
- **Deploy:** Cloudflare Workers (`wrangler.jsonc`)
- **CI:** GitHub Actions — `check-brand.yml`, `check-og.yml`

## 8. Repositório GitHub e edição com outras IAs

- Repo conectado. Sync **bidirecional** Lovable ↔ GitHub.
- IAs externas (Cursor, Claude Code, Copilot) podem editar via repo.
- **Regras invioláveis pra outras IAs:**
  - Não mexer em `src/routeTree.gen.ts` (auto-gerado pelo TanStack).
  - Respeitar tokens semânticos em `src/styles.css` — nunca cores hard-coded.
  - Server functions com auth precisam de `requireSupabaseAuth`.
  - CI tem que continuar passando.
  - Mudanças em schema: criar migration no Lovable, não escrever SQL solto.
  - **Não usar Supabase Edge Functions** — usar `createServerFn` do TanStack Start.
  - **Não usar React Router DOM** — usar `@tanstack/react-router`.
  - **Roles sempre em tabela separada** (`user_roles`), nunca em `profiles`.
  - **Toda mudança significativa deve atualizar `.lovable/prd.md` e `ROADMAP.md` na mesma rodada.**

## 9. Fora de escopo

- App mobile nativo.
- Marketplace de advogados (lista pública de profissionais).
- IA generativa dentro do hub (chatbot, geração de petições) — pós-MVP pago.
- Suporte multi-idioma (por enquanto).
