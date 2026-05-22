# Plano — Conceder admin para fbcfarias@icloud.com

## Situação

O email `fbcfarias@icloud.com` ainda não tem conta no sistema (tabela `profiles` está vazia). Não dá para inserir em `user_roles` sem um `user_id` real — a chave estrangeira aponta para `auth.users`.

As alterações de código backend/frontend para reconhecer admin no Hub **já foram aplicadas na rodada anterior** (chip "Modo admin", server functions consultando `has_role`). Falta só plugar você como admin.

## Caminho

1. Você se cadastra em `/login` com o email `fbcfarias@icloud.com` — pode ser email+senha ou Google (qualquer um cria a conta no `auth.users` e dispara o trigger que popula `profiles`).
2. Me avisa "criei a conta".
3. Eu rodo uma migração one-shot:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'fbcfarias@icloud.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

4. Você dá refresh em `/hub` — o chip "Modo admin" aparece em wine e todos os 25 países ficam liberados como se fosse vitalício.

## Atualização de documentação (mesma rodada da migração)

- `.lovable/prd.md` — adicionar nota "Acesso admin ao Hub: role `admin` em `user_roles` libera Hub como vitalício".
- `ROADMAP.md` — marcar "Acesso admin de leitura ao Hub" como concluído. Adicionar item futuro "Painel admin para gerenciar assinaturas".

## Próxima rodada (não agora)

Painel `/_authenticated/admin/*` para gerenciar assinaturas: listar usuários, ver status, conceder `lifetime_access` manual, revogar, ver `downloads_log`. Plano separado quando você quiser.

## O que preciso de você agora

Cadastre a conta `fbcfarias@icloud.com` em `/login` e me avise. Aí eu rodo a migração no ato.
