## Contexto

Claude (via GitHub) revisou minha proposta de divisão e fez 2 descobertas corretas que mudam o sequenciamento:

1. **`src/integrations/supabase/` e `supabase/migrations/` não existem** — Lovable Cloud nunca foi provisionado de verdade (PRD estava errado). Sem isso, nenhum dos 5 arquivos de infra do Claude compila.
2. **`pro-content-lock.tsx` tem copy errado**: "pagamento único e acesso vitalício" — incompatível com modelo de assinatura recorrente do hub.

Ajuste no plano original: **Lovable provisiona infra primeiro, depois Claude faz PR de schema + server functions, depois Lovable faz UI.**

## Nesta rodada (Lovable, agora)

### 1. Habilitar Lovable Cloud (Supabase)
Chamar `supabase--enable`. Isso cria:
- `src/integrations/supabase/client.ts` (browser)
- `src/integrations/supabase/client.server.ts` (admin)
- `src/integrations/supabase/auth-middleware.ts` (requireSupabaseAuth)
- `src/integrations/supabase/auth-attacher.ts` (attachSupabaseAuth)
- `supabase/migrations/` (diretório)
- `src/start.ts` precisa registrar `attachSupabaseAuth` em `functionMiddleware` (validar após enable)

### 2. Habilitar Stripe Payments (seamless)
- Rodar `payments--recommend_payment_provider` para validar elegibilidade
- Chamar `payments--enable_stripe_payments` (modo seamless, sem BYOK)
- Após enable, anotar nos secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### 3. Criar `COLLAB.md` na raiz
Tabela revisada de divisão Lovable ↔ Claude, regras de coordenação (1 arquivo = 1 dono por rodada, mudanças cross-side via PR), sequência obrigatória de provisionamento. Claude lê esse arquivo ao abrir o repo.

Conteúdo da tabela:

| Lovable (UI + setup) | Claude (infra + lógica) |
|---|---|
| 1. ✅ Habilitar Supabase + Stripe (esta rodada) | 1. `supabase/migrations/{ts}_hub_schema.sql` |
| 2. UI completa `/login` e `/cadastro` | 2. `src/routes/_authenticated.tsx` (beforeLoad + redirect + `<Outlet />`) |
| 3. UI `/_authenticated/hub` (dashboard) | 3. `src/lib/hub.functions.ts` (`getCountryHubData`) |
| 4. UI `/_authenticated/hub.$pais` | 4. `src/routes/api/public/stripe-webhook.ts` (HMAC) |
| 5. UI `/precos` (cards de plano) | 5. `src/lib/checkout.functions.ts` (Stripe checkout session) |

### 4. Corrigir `pro-content-lock.tsx`
- Trocar `"com pagamento único e acesso vitalício"` por `"com assinatura mensal ou anual"`.
- Conservar resto da estrutura/estilo (sem refactor além do copy).

### 5. Atualizar `.lovable/prd.md`
- Corrigir status: "Lovable Cloud habilitado" passa de ✅ (incorreto) para ✅ (real, após enable).
- Adicionar linha: "Stripe Payments habilitado (seamless)".
- Seção 8 ganha referência ao `COLLAB.md` como leitura obrigatória.

### 6. Atualizar `ROADMAP.md`
- Adicionar Fase 3.5 "Provisionamento Cloud + Stripe" marcada como ✅ ao final.
- Mover sub-itens da Fase 4 que dependem só de Supabase/Stripe de `📋` para `🚧` quando Claude começar.

## Para Claude (próxima rodada, via GitHub PR)

Após o sync da habilitação chegar no repo:

- PR único com 5 arquivos: migration SQL + `_authenticated.tsx` + `hub.functions.ts` + `stripe-webhook.ts` + `checkout.functions.ts`
- Schema da migration (mínimo): `profiles` + trigger auto-create, enum `app_role`, `user_roles` + função `has_role(uuid, app_role)` SECURITY DEFINER, `subscriptions`, `downloads_log`, RLS habilitado em todas com policies por `auth.uid()` e `has_role()`.
- Após merge, Claude atualiza `ROADMAP.md` e `.lovable/prd.md` no mesmo PR.

## Pós-Claude (rodada seguinte, Lovable)

- Criar UIs: `/login`, `/cadastro`, `/precos`, `/_authenticated/hub`, `/_authenticated/hub.$pais`, `/_authenticated/conta`.
- Cada uma com `head()` próprio (title <60, description <160).
- `/login` e `/cadastro` chamam diretamente `supabase.auth.signInWithPassword` / `signUp` do `client.ts`.
- `/_authenticated/hub.$pais` chama `getCountryHubData()` via `useServerFn`.

## Arquivos desta rodada (Lovable)

- **Criar:** `COLLAB.md`
- **Editar:** `.lovable/prd.md`, `ROADMAP.md`, `src/components/pro-content-lock.tsx`
- **Habilitações:** Lovable Cloud (Supabase), Stripe Payments (seamless)

## Fora do escopo desta rodada

- Qualquer código de auth, schema, server function, webhook, checkout (é responsabilidade do Claude na próxima rodada).
- Qualquer UI nova (`/login`, `/cadastro`, `/precos`, `/hub`) — depende do schema + server fns do Claude.
- BYOK Stripe (decidido: seamless).
