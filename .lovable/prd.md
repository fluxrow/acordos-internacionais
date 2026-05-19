# PRD — Acordo Internacional

> Documento vivo. Atualizar a cada rodada. Última revisão: 2026-05-19.

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

## 3. Escopo atual (já implementado)

| Área | Status |
|---|---|
| Rotas públicas: `/`, `/acordos`, `/acordos/:pais` (24 países), `/jornadas/:jornada`, `/guias/:slug`, `/blog`, `/glossario`, `/contato`, `/profissional`, `/sobre/dr-marcos` | ✅ |
| Reposicionamento de marca (favicon, og-image, header, footer, metadados) | ✅ |
| OG por país (`public/og/*.jpg`) | ✅ |
| CI: `check-brand` e `check-og` (falha build se sobrar slug antigo ou OG fora do padrão) | ✅ |
| Tipografia e tokens (`src/styles.css`), hover/focus states consistentes | ✅ |
| Lovable Cloud habilitado | ✅ |
| TanStack Start em Cloudflare Workers | ✅ |

## 4. Próxima rodada — Hub do Advogado (MVP pago)

### 4.1 Conteúdo do hub

A base vem de um repositório externo do cliente com:

- **Páginas HTML rascunho por país** (21 bilaterais + 3 multilaterais) contendo: texto do acordo, número e data do decreto, escopo de benefícios, requisitos de totalização, formulários oficiais, observações práticas.
- **Documentos para download** (PDFs, .docx, planilhas) — modelos de petição, formulários, jurisprudência selecionada, tabelas de cálculo.

**Plano de migração:**
1. Importar os HTMLs como dados estruturados em `src/data/acordos.ts` (campos novos: `decretoNumero`, `decretoData`, `formularios[]`, `observacoesTecnicas`, etc.). Não renderizar HTML cru.
2. Documentos vão para storage (Supabase Storage, bucket privado `hub-docs/`) organizados por país: `hub-docs/{pais}/{tipo}/{arquivo}`.
3. Conteúdo visível para advogados logados; metadados (existência do arquivo, título) visíveis no preview gratuito como teaser.

### 4.2 Acesso e autenticação

- **Login**: e-mail + senha (Lovable Cloud auth) + Google sign-in como conveniência.
- **Perfis**: tabela `profiles` ligada a `auth.users` (nome, OAB, telefone, foto).
- **Roles**: tabela separada `user_roles` (`app_role` enum: `subscriber`, `admin`). Nunca armazenar role em `profiles`.
- **Assinatura**: Stripe (Lovable Payments). Plano único mensal/anual no MVP. Webhook atualiza tabela `subscriptions` (status, current_period_end, price_id).
- **Gate de acesso**: server function `getCountryHubData(pais)` checa `subscriptions.status = 'active'` antes de retornar URLs assinadas (signed URLs do Storage com TTL curto). Sem assinatura ativa → retorna só metadata.

### 4.3 Rotas novas

| Rota | Função |
|---|---|
| `/login`, `/cadastro`, `/reset-password` | Auth público |
| `/_authenticated/hub` | Dashboard do advogado (lista de países, downloads recentes, status da assinatura) |
| `/_authenticated/hub/$pais` | Página do país com material técnico + downloads |
| `/_authenticated/conta` | Perfil + gestão de assinatura (portal Stripe) |
| `/precos` | Página pública de pricing → CTA para checkout |
| `/api/public/stripe-webhook` | Webhook Stripe (verificação de assinatura HMAC obrigatória) |

A página pública `/acordos/:pais` ganha um bloco no final: "Material técnico para advogados" + CTA para `/precos`.

### 4.4 Schema (resumo)

```sql
-- profiles (1:1 com auth.users), user_roles (enum app_role),
-- subscriptions (user_id, stripe_customer_id, status, price_id, current_period_end),
-- downloads_log (auditoria: user_id, country, file_path, downloaded_at)
```

Detalhe completo no momento da migração.

### 4.5 Critérios de aceite do MVP do Hub

- Visitante anônimo vê página pública do país + CTA para hub.
- Cadastro grátis funciona, mas área `/hub/*` mostra paywall até assinar.
- Compra via Stripe libera acesso em < 30s (webhook).
- Cancelamento (portal Stripe) revoga acesso ao fim do período pago.
- Downloads geram log em `downloads_log` (uso futuro: limites antiabuso).
- CI continua passando (check-brand, check-og).

## 5. Backlog priorizado pós-MVP do hub

1. **Calculadora de totalização** por país (interativa, usa dados estruturados de `acordos.ts`).
2. **Formulário de contato com envio de e-mail** (Lovable Email para `contato@`).
3. **Blog com CMS leve** (markdown em repo ou Supabase com editor admin).
4. **SEO técnico por país**: JSON-LD `GovernmentService`/`Article`, sitemap dinâmico, hreflang se for ter PT-PT.
5. **Analytics** de leitura/conversão (PostHog ou Plausible).
6. **Idiomas:** decidir se vamos ter EN/ES (público brasileiro no exterior consome PT, mas advogados estrangeiros podem pesquisar).

## 6. Decisões pendentes (preciso de input)

- **URL do repositório externo** com HTMLs e documentos (você ia colar e não veio).
- **Preço da assinatura** (mensal/anual, valor, trial?).
- **Plano único ou tiers** (ex.: por número de países, por volume de downloads)?
- **Nome do produto pago**: "Hub Profissional", "Hub do Advogado", outro?
- **Documentos por país são iguais para todos os assinantes ou tem material premium destacado?**

## 7. Stack e infraestrutura

- **Frontend/SSR:** TanStack Start v1 + React 19 + Vite 7
- **Estilo:** Tailwind v4 via `src/styles.css`
- **Backend:** Lovable Cloud (Supabase) — auth, Postgres, Storage
- **Pagamentos:** Stripe via Lovable Payments (a habilitar na rodada do hub)
- **Deploy:** Cloudflare Workers (`wrangler.jsonc`)
- **CI:** GitHub Actions — `check-brand.yml`, `check-og.yml`

## 8. Repositório GitHub e edição com outras IAs

- O projeto será conectado a um repositório GitHub (criar novo via Lovable, Lovable não importa repos existentes diretamente).
- Sync é bidirecional: edições em qualquer lado se propagam.
- IAs externas (Cursor, Claude Code, Copilot, etc.) podem editar via repo.
- **Regras pra manter o projeto saudável quando outras IAs editarem:**
  - Não mexer em `src/routeTree.gen.ts` (gerado pelo TanStack).
  - Respeitar tokens semânticos em `src/styles.css` — nunca cores hard-coded.
  - Server functions com auth precisam de `requireSupabaseAuth` middleware.
  - CI tem que continuar passando (checks de marca, og).
  - Mudanças em schema: criar migration no Lovable, não escrever SQL solto.

## 9. Fora do escopo agora

- App mobile nativo.
- Marketplace de advogados (lista pública de profissionais).
- IA generativa dentro do hub (chatbot, geração de petições) — fica para depois do MVP pago.
- Suporte multi-idioma.
