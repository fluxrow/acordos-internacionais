# COLLAB.md — Coordenação Lovable ↔ Claude (via GitHub)

> Regras de trabalho paralelo entre o agente do **Lovable** (UI + setup via plataforma) e o **Claude Code** (infra + lógica via repositório GitHub).
> Leitura obrigatória antes de qualquer commit. PRD em [`.lovable/prd.md`](./.lovable/prd.md). Status em [`ROADMAP.md`](./ROADMAP.md). Convenções em [`README.md`](./README.md).

---

## Regra de ouro

**Quem mexe num arquivo é dono daquele arquivo na rodada.** Se precisar tocar arquivo do outro lado, abre PR + review — não comita direto na `main`.

---

## Divisão de responsabilidades — Hub do Advogado (MVP)

| # | Lovable (UI + plataforma) | Claude (infra + lógica via PR) |
|---|---|---|
| 1 | ✅ Habilitar Lovable Cloud (Supabase) — gera `src/integrations/supabase/*` e `supabase/migrations/` | `supabase/migrations/{ts}_hub_schema.sql` |
| 2 | ✅ Habilitar Stripe Payments (seamless) — registra webhook em `/api/public/payments/webhook` automaticamente | `src/routes/_authenticated.tsx` (com `beforeLoad` + `redirect` + `<Outlet />`) |
| 3 | UI completa de `/login` e `/cadastro` (chama `supabase.auth.signInWithPassword` / `signUp` + `lovable.auth.signInWithOAuth("google", …)`) | `src/lib/hub.functions.ts` — `createServerFn` com `requireSupabaseAuth`, valida assinatura, devolve signed URLs |
| 4 | UI de `/_authenticated/hub` (dashboard com lista de países contratados) | `src/routes/api/public/payments/webhook.ts` — handler do webhook Stripe (verificação HMAC já registrada pela plataforma) |
| 5 | UI de `/_authenticated/hub.$pais` (consome `getCountryHubData()`) | `src/lib/checkout.functions.ts` — cria Stripe Checkout Session |
| 6 | UI de `/precos` (cards de plano) | — |
| 7 | UI de `/_authenticated/conta` (perfil + portal Stripe) | — |

---

## Pontos críticos de coordenação

### Caminho do webhook é FIXO
O Lovable Cloud registra o webhook automaticamente em `https://project--{id}.lovable.app/api/public/payments/webhook?env=sandbox|live`. **O arquivo TEM que estar em `src/routes/api/public/payments/webhook.ts`** — qualquer outro caminho quebra o registro. Eventos já assinados:
- `subscription.created`, `subscription.updated`, `subscription.canceled`
- `transaction.completed`, `transaction.payment_failed`

Claude **não** precisa registrar webhook manualmente — só implementar o handler.

### `_authenticated.tsx` layout route
```tsx
// src/routes/_authenticated.tsx  ← arquivo do CLAUDE
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: () => <Outlet />, // OBRIGATÓRIO — sem isso, filhos não renderizam
});
```

Depois disso o Lovable cria `src/routes/_authenticated/hub.tsx`, `src/routes/_authenticated/hub.$pais.tsx`, `src/routes/_authenticated/conta.tsx` livremente — zero conflito.

### Schema (resumo do que vem no PR do Claude)
- `profiles` (1:1 com `auth.users`, trigger auto-create no signup) — nome, OAB, telefone, foto
- `app_role` enum (`subscriber`, `admin`)
- `user_roles` (separada da `profiles`) + função `has_role(_user_id uuid, _role app_role)` `SECURITY DEFINER`
- `subscriptions` (`user_id`, `stripe_customer_id`, `status`, `price_id`, `current_period_end`)
- `downloads_log` (`user_id`, `country`, `file_path`, `downloaded_at`)
- RLS habilitado em todas, policies por `auth.uid()` + `has_role()`

### Stripe — modo seamless
- Lovable é merchant of record na sandbox; usuário claima conta para ir live
- Secrets já no Supabase: `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`
- **Não** usar `enable_stripe` (BYOK) — esse é o legacy
- Claude consome esses secrets via `process.env.*` **dentro de** `.handler()` (nunca em módulo)

---

## Sequência obrigatória

1. ✅ **Lovable** (concluído): habilitou Cloud + Stripe, criou este `COLLAB.md`, corrigiu copy do `pro-content-lock`, atualizou PRD/ROADMAP
2. 🚧 **Claude** (próxima rodada): PR único com 5 arquivos (migration + `_authenticated.tsx` + `hub.functions.ts` + `payments/webhook.ts` + `checkout.functions.ts`) + atualização de PRD/ROADMAP no mesmo PR
3. 📋 **Lovable** (rodada seguinte): UIs (`/login`, `/cadastro`, `/precos`, `/_authenticated/{hub,hub.$pais,conta}`)

---

## Regras invioláveis (resumo do `README.md` e `mem://index.md`)

- ❌ Nunca editar `src/routeTree.gen.ts` (auto-gerado)
- ❌ Nunca editar `src/integrations/supabase/{client,client.server,auth-middleware,auth-attacher,types}.ts` (auto-gerados pelo Cloud)
- ❌ Nunca usar Supabase Edge Functions — backend é `createServerFn` (interno) ou `createFileRoute` em `/api/public/*` (webhooks externos)
- ❌ Nunca `react-router-dom` — só `@tanstack/react-router`
- ❌ Nunca cor `#hex` em componente — só tokens semânticos `oklch` em `src/styles.css`
- ❌ Roles **nunca** em `profiles` — sempre em `user_roles` separada com `has_role()` `SECURITY DEFINER`
- ❌ Nunca ler `process.env.*` em módulo compartilhado — sempre dentro de `.handler()` ou código server-only
- ✅ Toda rota shareable tem `head()` próprio (title <60, description <160)
- ✅ Toda mudança significativa atualiza `.lovable/prd.md` + `ROADMAP.md` na mesma rodada
- ✅ Mudanças em stack/convenções também atualizam `README.md`

---

## Fluxo de PR (Claude)

1. Branch `feat/hub-infra` (ou `fix/...`, `chore/...`)
2. Commits atômicos com mensagens em português, escopo claro
3. PR aberto contra `main`, descrição linka issue/decisão do PRD
4. Aguarda merge antes que Lovable comece a UI dependente
