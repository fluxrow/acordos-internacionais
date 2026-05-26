## Diagnóstico

Os logs confirmam que seu login com Google (fbcfarias@gmail.com) **deu certo** — o Supabase emitiu o token às 17:25:52. Mas a tela continua em `/login?redirect=/hub/calculadora`.

A causa é uma **race condition** entre o callback OAuth e o guard de rota:

1. Você clica em "Continuar com Google" → o `redirect_uri` aponta para `/hub/calculadora`.
2. O navegador volta da Google e renderiza a rota protegida `/_authenticated/hub/calculadora`.
3. O `beforeLoad` do `_authenticated` chama `supabase.auth.getUser()` **antes** da sessão terminar de hidratar no `localStorage`.
4. Como `getUser()` ainda retorna `null` nesse instante, o guard joga `redirect({ to: "/login" })`.
5. Quando o `/login` finalmente carrega, ele *também* chama `getUser()` no `beforeLoad` — mas naquele momento o `beforeLoad` já decidiu, e o componente renderiza. Sem nada que reaja à hidratação tardia, você fica preso ali.

A confirmação extra: a página inicial está tendo erro de **hidratação SSR** (texto antigo vs. novo) — isso atrapalha justamente o ciclo de auth restore logo após o callback.

## Plano de correção

### 1. `src/routes/login.tsx` — reagir quando a sessão chegar tarde
Adicionar um listener `onAuthStateChange` no componente da tela de login. Assim que a sessão for hidratada (evento `SIGNED_IN` ou `INITIAL_SESSION` com user), navegar automaticamente para `redirectTo ?? "/hub"`.

### 2. `src/routes/_authenticated.tsx` — não chutar fora antes da hidratação
Em vez de só `supabase.auth.getUser()`, primeiro tentar `supabase.auth.getSession()` (que aguarda o restore do storage) e só redirecionar para `/login` se realmente não houver sessão. Mantém o `getUser()` como validação final.

### 3. Limpar o erro de hidratação na home
O console mostra mismatch SSR/CSR na frase do hero (`Para o brasileiro...`). Vou conferir se sobrou cache antigo no `head()`/SEO ou se algum trecho ainda usa o texto antigo, e padronizar. Isso destrava o `__root` e permite o `onAuthStateChange` rodar de forma limpa.

### 4. Verificação
- Logout → login com Google → confirmar que cai direto em `/hub/calculadora`.
- Refresh em `/hub/calculadora` autenticado → não deve mais piscar para `/login`.

## Detalhes técnicos

- `lovable.auth.signInWithOAuth("google", ...)` continua sendo a chamada correta (broker da Lovable Cloud). Não mexer nisso.
- Não vou trocar `redirect_uri` nem mexer em config de OAuth no Supabase — o problema é 100% client-side timing.
- Não vou criar Edge Function nem mexer em RLS — não é necessário.
- Arquivos afetados: `src/routes/login.tsx`, `src/routes/_authenticated.tsx`, e possivelmente `src/routes/index.tsx` (para o hydration mismatch).

Aprova para eu implementar?
