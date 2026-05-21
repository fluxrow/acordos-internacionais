# Plano — Acesso admin ao Hub

## Contexto

Hoje o Hub (`/_authenticated/hub` e `/_authenticated/hub/$pais`) libera conteúdo só se a `subscriptions.status = 'active'` ou `lifetime_access = true`. O enum `app_role` já existe com valores `subscriber | admin` e a tabela `user_roles` está pronta com a função `has_role(uuid, app_role)`. Mas ninguém está cadastrado ainda como admin e o backend não consulta `has_role` ao decidir liberar o Hub.

Este plano cobre **só o acesso de leitura ao Hub como admin**. O painel para administrar assinaturas (gerenciar usuários, conceder lifetime, cancelar etc.) fica para uma próxima rodada conforme você pediu.

## O que muda

### 1. Backend — admin é tratado como acesso liberado

No `src/lib/hub.functions.ts` e `src/lib/profile.functions.ts`, adicionar uma checagem `OR has_role(userId, 'admin')` na decisão de `hasAccess`. Implementação: chamar `supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle()` em paralelo com a leitura de `subscriptions`. Se for admin, o handler segue o fluxo "unlocked" como se fosse assinante vitalício.

`AccountData` ganha um campo opcional `isAdmin: boolean` para a UI poder mostrar um selo "Modo admin" e não mostrar a barra "Acesso bloqueado · Ver planos" para quem é admin.

### 2. Frontend — Hub mostra estado admin

- `/_authenticated/hub` (dashboard): se `isAdmin && !active`, esconde o aviso "Acesso bloqueado" e mostra um chip discreto `MODO ADMIN` em wine no topo. Lista de países renderiza como sempre.
- `/_authenticated/hub/$pais`: nada a mudar — o backend já vai retornar `locked: false` para admin, então a página renderiza igual a um assinante.

### 3. Conceder admin para você

Como ainda não existe nenhum usuário em `profiles` (você ainda não criou conta), o caminho é:

1. Você se cadastra normalmente em `/login` com email + senha (ou Google).
2. Me passa o email que você usou no cadastro.
3. Rodo uma migração one-shot que insere `(user_id, 'admin')` em `user_roles` usando esse email para resolver o `user_id` via `auth.users`.

Alternativa, se você preferir já me passar o email agora antes de cadastrar: o INSERT pode ficar guardado num arquivo `supabase/seed-admin.sql` e roda automaticamente quando você criar a conta — mas o caminho 1-2-3 acima é mais simples e auditável.

## Não-objetivos (ficam para depois)

- Painel `/_authenticated/admin/*` para listar usuários, ver assinaturas, conceder lifetime manual, ver logs de download, etc.
- Permissão para escrever em `subscriptions` direto pela UI.
- Granularidade de roles (ex.: `editor` que só edita conteúdo de país).

Quando você quiser atacar isso, fazemos um plano separado — provavelmente envolvendo um layout `_authenticated/_admin.tsx` gated por `has_role`, server functions de admin (`listUsers`, `grantLifetime`, `revokeAccess`, `listDownloads`), e UI shadcn (`Table`, `Sheet`, `Dialog`).

## Arquivos tocados

- `src/lib/hub.functions.ts` — adicionar checagem de `has_role` no `getCountryHubData`.
- `src/lib/profile.functions.ts` — adicionar `isAdmin` em `AccountData`.
- `src/routes/_authenticated/hub.tsx` — chip "MODO ADMIN", esconder "Acesso bloqueado" se admin.
- Migração SQL (manual após você me passar o email) inserindo em `user_roles`.
- `.lovable/prd.md` + `ROADMAP.md` — registrar "Acesso admin ao Hub".

## O que preciso de você

**Qual email você quer que vire admin?** (e me confirme se já criou conta ou se vai criar agora)
