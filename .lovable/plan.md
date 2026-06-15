## Cupom ACORDOS10 — 10% de desconto, 3 meses, 200 usos

Cupons no Stripe têm duas peças: o **Coupon** (define o desconto) e o **Promotion Code** (o texto digitável `ACORDOS10`). Precisamos criar ambos via API do Stripe (sandbox e live) e habilitar o campo de cupom no checkout.

### Passos

1. **Habilitar campo de cupom no checkout**
  - Em `src/lib/checkout.functions.ts`, no `stripe.checkout.sessions.create`, adicionar `allow_promotion_codes: true`. Sem isso, mesmo criado no Stripe, o cupom não aparece para digitar na tela de pagamento.
2. **Criar server function admin para provisionar o cupom**
  - Novo arquivo `src/lib/admin-coupons.functions.ts` com `createServerFn` protegida por `requireSupabaseAuth` + checagem `has_role(..., 'admin')`.
  - A função recebe `{ env: "sandbox" | "live" }` e:
    - `stripe.coupons.create({ id: "acordos10_3m", percent_off: 10, duration: "repeating", duration_in_months: 3, max_redemptions: 200, name: "ACORDOS10" })` — válido para os 3 primeiros ciclos da assinatura (e desconto único no plano Fundadores).
    - `stripe.promotionCodes.create({ coupon: "acordos10_3m", code: "ACORDOS10", active: true })`.
  - Idempotente: se já existir (`resource_already_exists`), retorna ok.
3. **Disparar a criação uma vez**
  - Criar uma rota admin simples `/admin/cupons` (ou um botão na conta admin) que chama essa server fn para `sandbox` e depois `live`. Alternativa mais rápida: rodar manualmente via `invoke-server-function` após o deploy. Eu sigo pela rota admin para deixar repetível.

### Sobre os parâmetros

- **3 meses**: interpretado como "desconto aplicado por 3 ciclos de cobrança" (`duration: "repeating", duration_in_months: 3`). No plano **Mensal** isso é 3 meses de 10% off; no **Anual** o desconto aplica em 3 renovações (efetivamente vitalício na prática para anual); no **Fundadores** (pagamento único) o desconto incide só na compra.
- **200 cupons**: `max_redemptions: 200` no Coupon — para de aceitar após 200 resgates.
- **Validade do código**: se a intenção é que o cupom *expire* em 3 meses corridos (e não "desconte por 3 meses"), uso `redeem_by: <timestamp +90d>` no Coupon e `duration: "once"`. **Confirmar antes de implementar.**

### Pergunta antes de executar

O "3 meses" é:

- (A) **Desconto de 10% pelos 3 primeiros meses de assinatura** (`duration: repeating, 3 months`), cupom segue resgatável até bater 200 usos. — *opção que descrevi acima - Não, e a pçoa abaixo que eu complementei*
- (B) **Cupom expira em 90 dias** (deixa de poder ser digitado depois disso), desconto de 10% único no checkout. sim, desconto deve ser aplicaod no priemeiro mems somente. 

Me diz qual é antes de eu construir, pra eu não criar errado no Stripe live.