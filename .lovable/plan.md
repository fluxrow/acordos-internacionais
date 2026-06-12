## Objetivo
Criar uma conta de testes para o Marcos com acesso completo ao Hub (como um assinante pagante), **sem** papel de admin.

- E-mail: `espinola.mv@gmail.com`
- Senha: `Marcos2025*`
- Acesso: Hub completo (lifetime), sem admin

## Passos

1. **Criar usuário no Auth** (via Admin API server-side)
   - `email_confirm: true` para já entrar direto sem precisar confirmar e-mail.
   - Senha definida no momento da criação.

2. **Criar profile** em `public.profiles`
   - `id` = user.id
   - `full_name`: "Marcos (teste)"
   - `email`: espinola.mv@gmail.com

3. **NÃO inserir** nada em `public.user_roles` — garante que não terá `admin`.

4. **Criar subscription "lifetime"** em `public.subscriptions`
   - `user_id` = user.id
   - `status` = `active`
   - `lifetime_access` = `true`
   - `stripe_customer_id` = `null` (conta de teste, não passou pelo Stripe)
   - `price_id` = `null`
   - `cancel_at_period_end` = `false`
   - `current_period_end` = `null` (lifetime não expira)

   Isso replica exatamente o estado de um Fundador que pagou via Stripe, fazendo `getAccountData` retornar `subscription.lifetimeAccess = true` e liberando todo o conteúdo Pro do Hub.

5. **Validar**
   - Login com as credenciais funciona em `/login`.
   - `/hub` carrega sem cair em paywall.
   - `/conta` mostra "acesso vitalício".
   - `isAdmin` no `getHubDashboard` retorna `false` (sem itens admin na sidebar, sem `/hub/leads`).

## Execução técnica

Como o painel Supabase não é acessível no Lovable Cloud e a Service Role Key não fica exposta para uso manual, vou rodar um **script local one-shot** via `bun run scripts/seed-test-user.ts` que usa `supabaseAdmin` (service role já disponível no runtime do servidor) para:
- `supabaseAdmin.auth.admin.createUser({...})`
- `supabaseAdmin.from('profiles').insert(...)`
- `supabaseAdmin.from('subscriptions').insert({ lifetime_access: true, status: 'active', ... })`

O script é descartável (não fica em produção / não vira endpoint público — seria um vazamento de privilégio).

## Fora de escopo
- Mexer em RLS, migrations ou políticas.
- Criar endpoint público / serverFn de "seed".
- Alterar Stripe (a conta teste não passa pelo checkout).
- Qualquer mudança no fluxo de fundadores reais.

## Risco / reversão
Se quiser apagar depois: deletar o user em `auth.users` (cascade limpa `profiles`, `subscriptions`, `user_roles` via FK).
