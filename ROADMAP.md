# Roadmap — Acordo Internacional

> Visão cronológica do que já foi feito e o que vem. Para qualquer IA (Claude Code, Cursor, Copilot, Lovable) ou humano que abrir o repo saber em que ponto estamos.
> Documento canônico de status. PRD detalhado em [`.lovable/prd.md`](./.lovable/prd.md). Convenções em [`README.md`](./README.md).
> **Regra:** toda mudança significativa atualiza este arquivo + o PRD na mesma rodada.

---

## Legenda

- ✅ Concluído
- 🚧 Em andamento
- 📋 Planejado (próxima rodada)
- 💡 Backlog (sem data)
- ❌ Fora de escopo

---

## Fase 0 — Fundação ✅ (concluída)

- ✅ Bootstrap TanStack Start v1 + React 19 + Vite 7
- ✅ Tailwind v4 com tokens semânticos em `oklch` (`src/styles.css`)
- ✅ Deploy em Cloudflare Workers (`wrangler.jsonc`)
- ✅ Lovable Cloud habilitado (Supabase gerenciado)
- ✅ shadcn/ui como base de componentes

## Fase 1 — Marca e conteúdo público ✅ (concluída)

- ✅ Reposicionamento "Acordo Internacional **by AtlasPrev**" (Dr. Marcos como rosto, não como marca)
- ✅ Favicon, OG-image global, header, footer, metadados
- ✅ Rotas públicas: `/`, `/acordos`, `/acordos/:pais`, `/jornadas/:jornada`, `/guias/:slug`, `/blog`, `/glossario`, `/contato`, `/profissional`, `/sobre/dr-marcos`
- ✅ Conteúdo editorial em `src/data/{acordos,guias,jornadas}.ts`
- ✅ 25 OG images por acordo (`public/og/*.jpg`), multilaterais com selo "MULTI"
- ✅ CI: `check-brand` (impede vazamento de marca antiga) e `check-og` (garante cobertura)
- ✅ Hover/focus/active states consistentes em botões, links e cards (sem texto invisível)

## Fase 2 — Migração de dados técnicos ✅ (concluída)

- ✅ Script `scripts/import-acordos.ts` baixa 24 HTMLs do repo `marcosespinola1379/Mapa-de-Acordos`
- ✅ Parser com `node-html-parser` extrai: decreto, vigência, órgãos de ligação BR + parceiro, benefícios cobertos, formulários e documentos
- ✅ Saída estruturada em `src/data/acordos.generated.ts` + tipos em `src/data/acordos.types.ts`
- ✅ Catálogo curado (`src/data/acordos.ts`) faz **merge** com dados importados
- ✅ Página `/acordos/:pais` reformatada: hero, cards de Órgãos de Ligação, colunas de Benefícios, tabs Acordo/Ajuste, Documentos com badge "Hub PRO" (gate visual)
- ✅ **Refino visual `/acordos/:pais`**: wash wine no hero, bandeira com moldura, aside com `backdrop-blur`, fallback gracioso em órgãos sem dados, nav contextual Anterior/Próximo com mini-bandeiras e hover wine
- ✅ **Refino visual v2 `/acordos/:pais`**: duplo radial wine no hero + linha gradiente no bottom, ficha Instrumento/Decreto/Vigência em cards `backdrop-blur` com hover wine, documentos agrupados por categoria (Principal/Complementar/Roteiro/Formulário) com header eyebrow wine + contador, "Hub PRO" promovido a CTA único no topo do bloco, `ProContentLock` redesenhado (radial wine duplo, headline `font-display`, CTA pill `--accent-ink`)
- ✅ **Refino UX editorial v3 `/acordos/:pais`**: stats line no hero (anos em vigor, órgãos, documentos), `<Highlight>` destacando palavras-chave em wine no lede e em "Como funciona", TOC sticky "Nesta página" no aside com numeração mono e scroll suave, blocos com kicker numerado `01 ·` + lede curto, OrgaoCard com ícones Lucide (Building2/MapPin/Phone/Mail) e rótulo "Lado X" em wine, BeneficiosComparativo em tabela 2-col com divisória wine, documentos em flat-list com pill de categoria wine-soft e cadeado Lucide com hover
- ✅ 3 acordos multilaterais (CPLP, Mercosul, Ibero-Americano) reaproveitam a rota dinâmica

## Fase 3 — Documentação e colaboração ✅ (concluída)

- ✅ Repositório GitHub conectado via Lovable (sync bidirecional)
- ✅ `README.md` na raiz com stack, estrutura, convenções para humanos e IAs externas
- ✅ `ROADMAP.md` (este arquivo)
- ✅ `.lovable/prd.md` atualizado com status real

## Fase 3.5 — Provisionamento Cloud + Stripe ✅ (concluída)

- ✅ Lovable Cloud (Supabase) provisionado de verdade — `src/integrations/supabase/*` e `supabase/migrations/` criados
- ✅ Stripe Payments (seamless) habilitado — sandbox + webhook em `/api/public/payments/webhook?env=sandbox`
- ✅ `COLLAB.md` na raiz com divisão Lovable ↔ Claude
- ✅ Copy de `pro-content-lock.tsx` alinhado a assinatura recorrente

## Fase 4 — Hub do Advogado MVP 🚧 (em andamento — Claude faz infra, Lovable faz UI)

### 4.1 Auth e perfis ✅

- ✅ Lovable Auth pronto na plataforma (e-mail/senha + Google sign-in disponíveis)
- ✅ **Claude**: migration com `profiles` (1:1 + trigger), enum `app_role`, `user_roles` separada, `has_role()` `SECURITY DEFINER`, RLS em tudo
- ✅ **Claude**: `src/routes/_authenticated.tsx` (layout com `beforeLoad` + `redirect` + `<Outlet />`)
- ✅ **Lovable**: UI de `/login`, `/cadastro`, `/reset-password` com email+senha e botão "Continuar com Google" via `lovable.auth.signInWithOAuth` (broker Lovable Cloud). Google provider habilitado via `configure_social_auth`. Smoke test validou `/login` → `/hub` com sessão preservada via navegação interna do TanStack Router.

### 4.2 Pagamento Stripe 🚧

- ✅ Stripe Payments (seamless) habilitado, sandbox ativo, webhook registrado
- 🚧 **Claude**: migration com `subscriptions` (`user_id`, `stripe_customer_id`, `status`, `price_id`, `current_period_end`)
- 🚧 **Claude**: `src/routes/api/public/payments/webhook.ts` (caminho fixo) — consome eventos `subscription.*` e `transaction.*`
- 🚧 **Claude**: `src/lib/checkout.functions.ts` — cria Checkout Session
- 📋 **Lovable**: UI de `/precos` (cards de plano) e portal Stripe em `/_authenticated/conta`

### 4.3 Hub privado 🚧

- 📋 Supabase Storage: bucket privado `hub-docs/{pais}/{tipo}/{arquivo}`
- 📋 Upload manual inicial dos PDFs/docx do repo `Mapa-de-Acordos`
- 🚧 **Claude**: `src/lib/hub.functions.ts` — `getCountryHubData(pais)` com `requireSupabaseAuth`, valida assinatura ativa, devolve signed URLs com TTL curto
- 🚧 **Claude**: migration com `downloads_log` (`user_id`, `country`, `file_path`, `downloaded_at`)
- 📋 **Lovable**: UI de `/_authenticated/hub` (dashboard) e `/_authenticated/hub.$pais` (material por país)
- 📋 **Lovable**: bloco "Material técnico para advogados" no fim de `/acordos/:pais` → CTA para `/precos`
- ✅ **Acesso admin de leitura**: role `admin` em `user_roles` libera Hub como vitalício. `getCountryHubData` e `getAccountData` consultam `user_roles`; dashboard mostra chip "Modo admin" em wine e oculta paywall.
- 💡 **Painel admin de assinaturas** (`/_authenticated/admin/*`): listar usuários, conceder `lifetime_access` manual, revogar acesso, ver `downloads_log`. Plano separado quando atacar.

### 4.4 Critérios de aceite do MVP 📋

- 📋 Anônimo vê página pública + CTA visível para hub
- 📋 Cadastro grátis funciona; `/hub/*` mostra paywall até assinar
- 📋 Compra Stripe libera acesso em <30s (webhook)
- 📋 Cancelamento revoga acesso no fim do período pago
- 📋 Downloads logados em `downloads_log`
- 📋 CI continua passando

## Fase 5 — Pós-MVP 💡 (backlog priorizado)

1. 💡 Calculadora de totalização por país (interativa, usa dados estruturados)
2. 💡 Formulário de contato com envio de e-mail (Lovable Email para `contato@`)
3. 💡 Blog com CMS leve (markdown em repo ou editor admin no Supabase)
4. 💡 SEO técnico: JSON-LD `GovernmentService`/`Article`, sitemap dinâmico, hreflang
5. 💡 Analytics: PostHog ou Plausible
6. 💡 Avaliação de idiomas EN/ES para advogados estrangeiros

## Decisões pendentes ❓

- ❓ Preço da assinatura (mensal? anual? trial?)
- ❓ Plano único ou tiers (por país, por volume de downloads)?
- ❓ Nome final do produto pago ("Hub Profissional", "Hub do Advogado", outro)
- ❓ Documentos por país: tudo igual para todo assinante, ou material premium destacado?

## Fora de escopo ❌

- ❌ App mobile nativo
- ❌ Marketplace de advogados (lista pública)
- ❌ IA generativa dentro do hub (chatbot, geração de petições) — reavaliar após MVP pago
- ❌ Multi-idioma (por enquanto)

---

## Como atualizar este roadmap

1. Concluiu uma task? Marque `📋 → ✅` e mova para a fase concluída.
2. Começou uma task grande? Marque `📋 → 🚧`.
3. Adicionou escopo novo? Adicione como `📋` na fase certa, ou `💡` se não tem data.
4. **Sempre** atualize também `.lovable/prd.md` na mesma rodada.
5. Mudou a stack ou convenção? Atualize também o `README.md`.
