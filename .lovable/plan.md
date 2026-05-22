
# Plano — próxima rodada pós-oferta unificada

Oferta já decidida: **Anual R$ 797/ano + Fundadores R$ 1.297 vitalício (100 vagas)**. Agora seguimos com: (1) auditoria da UI do hub logado, (2) checkout Stripe ligado de verdade, (3) limpeza de docs e blog.

## 1. Auditoria UI do hub logado (Lovable)

Logar como admin e revisar com o mesmo critério editorial do site público:
- `/hub` (dashboard): saudação, contador de vagas Fundadores (se logado deslogado de plano), atalhos para países, estado "admin" claro.
- `/hub/$pais`: layout dos documentos liberados, signed URLs, log de download visível.
- `/hub/calculadora`: paridade visual com `/calculadora` pública.
- `/conta`: perfil + botão "Gerenciar assinatura" (portal Stripe).

Entregáveis: lista de ajustes finos por rota + correções de copy/cores/espaço. Sem mudar lógica de negócio.

## 2. Checkout Stripe ligado (Lovable + Claude)

Estado atual: `createCheckoutSession` em `src/lib/checkout.functions.ts` já resolve `priceId` via `lookup_keys` e separa one-time (Fundadores) de subscription (Anual). Falta:

**Lovable:**
- Em `/precos`, ligar cada botão "ASSINAR" a `createCheckoutSession({ priceId: "hub_anual" | "hub_fundadores", env })` + montar Stripe embedded checkout (return em `/hub?checkout=success`).
- Tratar estados loading/erro/sucesso. Exibir mensagem do contador de vagas no card Fundadores.
- Em `/conta`, botão "Gerenciar assinatura" → `createPortalSession` (criar a server fn ao lado de `createCheckoutSession`, padrão do knowledge `stripe-subscriptions`).

**Claude (peço pra ele rodar via repo):**
- Criar produtos/prices no Stripe via `payments--batch_create_product` com `lookup_key` = `hub_anual` (recurring/year, R$ 797) e `hub_fundadores` (one_time, R$ 1.297).
- Conferir/ajustar `src/routes/api/public/payments/webhook.ts` pra: (a) marcar `subscriptions.status='active'` + `price_id='hub_fundadores'` em `checkout.session.completed` de modo `payment` (lifetime), (b) tratar `customer.subscription.*` normal pro plano anual.
- Garantir filtro por `environment` (sandbox vs live) em todas as leituras de `subscriptions`, conforme `stripe-subscriptions`.

## 3. Limpeza de conteúdo

- `/blog`: já saiu do footer. Manter rota pública só com placeholder; quando tiver 1 post real, voltar pro footer.
- `/glossario`: revisar visual (mesmo passe da auditoria de hub).
- Home: confirmar que CTA "Hub para advogados" leva pra `/profissional` (a página da oferta), não pra `/precos` direto — já está coerente.

## 4. Sincronizar PRD + Roadmap

- `.lovable/prd.md` §6 ("Decisões pendentes"): mover preço/plano/nome pra "resolvidas" (oferta híbrida, "Hub Profissional"). Adicionar linha na §3 marcando `/profissional` e `/precos` como oferta unificada ✅. Adicionar `/precos` à tabela §4.3.
- `ROADMAP.md`: atualizar Fase 4.2 — marcar UI de `/precos` ✅ (cards prontos), criação de produtos Stripe como 📋 (Claude), wiring de checkout como 📋 (Lovable).
- README: sem mudança de stack/convenções nesta rodada.

## 5. O que peço pro Claude (resumo pra colar no chat dele)

> 1. Criar produtos Stripe via `payments--batch_create_product`:
>    - `hub_anual` — recurring `year`, BRL 797,00.
>    - `hub_fundadores` — one_time, BRL 1.297,00.
>    Usar `lookup_key` igual ao nome (já é o que `checkout.functions.ts` espera).
> 2. Auditar `src/routes/api/public/payments/webhook.ts` cobrir:
>    - `checkout.session.completed` com `mode='payment'` e `metadata.isFounder='true'` → upsert em `subscriptions` com `status='active'`, `price_id='hub_fundadores'`, `current_period_end=null` (vitalício).
>    - `customer.subscription.created/updated/deleted` para o plano anual (padrão do knowledge `stripe-webhooks`).
>    - Sempre setar `environment` explicitamente (sandbox/live) na linha gravada.
> 3. Confirmar que `subscriptions` tem coluna `environment` (default `sandbox`). Se faltar, migration adicionando.
> 4. Adicionar `createPortalSession` em `src/lib/checkout.functions.ts` (ou arquivo irmão) com `requireSupabaseAuth`, filtro por `environment`, conforme knowledge `stripe-subscriptions`.

## Ordem de execução

1. Auditoria visual do hub (passo 1) — relatório curto.
2. Disparar tarefas pro Claude (passo 5).
3. Enquanto Claude trabalha: wiring de `/precos` e `/conta` no front (passo 2 — Lovable).
4. Atualizar PRD + Roadmap (passo 4) na mesma rodada.

