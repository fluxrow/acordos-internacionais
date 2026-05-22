# Plano — Cadastro funcional para criar conta admin

## Problema

A rota `/cadastro` não existe. O `/login.tsx` linka para ela, mas o arquivo nunca foi criado — bate em 404. A única coisa que se parece com "cadastro" hoje é o waitlist em `/profissional`, que só guarda email num formulário fake.

Sem `/cadastro` você não consegue criar a conta `fbcfarias@icloud.com` para eu conceder admin.

## O que construir

### 1. `/cadastro` — `src/routes/cadastro.tsx`

Página pública de signup. Espelha visualmente o `/login.tsx` atual (mesmo layout centrado, mesma tipografia, mesmos tokens).

Campos:
- Nome completo
- E-mail
- Senha (mínimo 8 caracteres)

Ação principal: `supabase.auth.signUp({ email, password, options: { data: { full_name }, emailRedirectTo: window.location.origin + "/hub" } })`. O trigger `handle_new_user` já existe e popula `profiles` automaticamente.

Tratamento dos casos:
- Sucesso com confirmação por email: mostra "Te enviamos um link de confirmação para `<email>`. Abra para ativar a conta."
- Sucesso já logado (auto-confirm): redireciona para `/hub`.
- Erro `User already registered`: mostra "Esse e-mail já tem conta. Entre em vez de cadastrar." com link para `/login`.
- Outros erros: mostra a mensagem.

Botão secundário "Continuar com Google" via broker:
```ts
import { lovable } from "@/integrations/lovable";
await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/hub" });
```

Link no rodapé: "Já tem conta? Entrar".

### 2. `/login.tsx` — adicionar Google

Mesmo botão "Continuar com Google" via broker. Mantém email+senha existente.

### 3. `/reset-password` — `src/routes/reset-password.tsx`

Pequena página obrigatória pelo nosso fluxo de recuperação (link em `/login.tsx` já aponta pra ela). Dois modos:

- Sem hash `type=recovery` na URL: formulário "Esqueci minha senha" — input email + `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + "/reset-password" })`.
- Com `type=recovery`: formulário "Nova senha" — `supabase.auth.updateUser({ password })` e redireciona para `/hub`.

### 4. Habilitar Google no Supabase

Chamar `supabase--configure_social_auth` com `providers: ["google"]` na mesma rodada. Sem isso, o botão Google falha com "Unsupported provider".

### 5. Confirmação de email

Hoje `auto_confirm_email` está desligado por padrão (e deve continuar). Isso significa: você vai receber um email do Lovable Cloud com link de ativação. Clica no link, abre `/hub`, vira admin assim que eu rodar a migração.

Alternativa se você não quiser receber email: posso ligar `auto_confirm_email` só pra você terminar o setup e desligar depois. **Pergunta abaixo.**

### 6. Conceder admin (após cadastro)

Assim que você confirmar conta criada:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'fbcfarias@icloud.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### 7. Documentação

- `ROADMAP.md`: marcar `/cadastro`, `/reset-password` e Google sign-in como ✅.
- `.lovable/prd.md`: nota de que `/cadastro` está vivo e Google OAuth ligado.

## Arquivos tocados

- `src/routes/cadastro.tsx` (novo)
- `src/routes/reset-password.tsx` (novo)
- `src/routes/login.tsx` (adiciona botão Google)
- `supabase--configure_social_auth` (config, sem código)
- `ROADMAP.md`, `.lovable/prd.md`

## Não-objetivos

- Não mexer no waitlist do `/profissional` — esse fica como funil de pré-lançamento.
- Não criar painel admin de gestão de assinaturas (próxima rodada).
- Não trocar copy nem layout do `/login` além de adicionar o botão Google.

## Pergunta para você

Quer que eu **ligue `auto_confirm_email`** para pular o passo de confirmar o link no email? É o caminho mais rápido para você cadastrar e já virar admin. Posso desligar depois se preferir manter confirmação em produção.

- **Sim, liga** → cadastro fica instantâneo, sem email.
- **Não, mantém confirmação** → você cadastra, recebe email do Lovable Cloud, clica no link, aí me avisa.
