## Objetivo
Disponibilizar o plano **Mensal R$ 97/mês** na página `/precos`, hoje só com Anual e Fundadores.

## Layout
Duas colunas no desktop:

```text
┌──────────────────────────────┐  ┌────────────────────┐
│  [ Mensal | Anual ]  toggle  │  │   Fundadores       │
│                              │  │   R$ 1.297 único   │
│  R$ XX  /período             │  │   100 vagas        │
│  descrição dinâmica          │  │                    │
│  [ Assinar ]                 │  │  [ Garantir vaga ] │
└──────────────────────────────┘  └────────────────────┘
```

- Toggle pill (Mensal / Anual) no topo do card principal, estilo Premium Dark + Gold (segmented control com fundo `--card-bg`, pílula ativa em `--accent-ink`).
- Quando **Anual** estiver ativo: badge "Mais popular" + microcopy "Economize ~32% vs. mensal" (R$ 797 vs. 12 × R$ 97 = R$ 1.164).
- Quando **Mensal** estiver ativo: microcopy "Cancele quando quiser".
- Card Fundadores permanece como hoje (vagas restantes, esgotado etc.).
- Mobile: cards empilhados, toggle continua dentro do card principal.

## Mudanças de código

**`src/routes/precos.tsx`**
- Substituir a constante `PLANS` por:
  - `MAIN_PLAN_OPTIONS` (mensal / anual) com `id`, `preco`, `periodo`, `desc`, `economia?`.
  - `FOUNDERS_PLAN` separado.
- Novo `useState<"mensal" | "anual">("anual")` para o toggle (Anual default = destaque).
- Renderizar grid `md:grid-cols-2`: card principal (com toggle) + card Fundadores.
- Passar `selectedMain` (`hub_mensal` ou `hub_anual`) para `checkoutMutation.mutate(...)`.
- Manter toda a lógica de `clientSecret`, `authError`, `checkoutError`, Stripe embedded.

**Backend / Pagamentos**
- Confirmar via `payments--batch_create_product` (no momento da implementação em build mode) que existe o price `hub_mensal` (R$ 97,00 BRL, recorrente mensal, `quantity_min/max = 1`). Se não existir, criar junto com Anual e Fundadores já configurados.
- Nenhuma mudança em `src/lib/checkout.functions.ts` (já recebe `priceId` genérico).

**Documentação**
- Atualizar `.lovable/prd.md` e `ROADMAP.md` mencionando o novo plano Mensal e o toggle.

## Fora do escopo
- Nenhuma mudança em autenticação, RLS, ou nos demais componentes do site.
- Sem mexer em `src/integrations/supabase/*` nem em `routeTree.gen.ts`.