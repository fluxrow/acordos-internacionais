## Bug

Clicar no card "Calculadora RMI Pro-rata" muda a URL para `/hub/calculadora` mas a página da calculadora não aparece — a tela continua mostrando o dashboard do Hub (ou fica em branco).

## Causa

No TanStack Router, qualquer arquivo `foo.tsx` que tenha arquivos irmãos `foo.bar.tsx` vira automaticamente uma **rota-layout** — e precisa renderizar `<Outlet />` para que as filhas apareçam.

`src/routes/_authenticated/hub.tsx` está nessa situação (tem como filhos `hub.calculadora.tsx` e `hub.$pais.tsx`), mas seu componente `HubDashboard` renderiza só o dashboard, sem `<Outlet />`. Então a rota `/hub/calculadora` é matched, o componente filho é carregado em memória, mas não tem onde renderizar — e o usuário continua vendo o conteúdo de `/hub`.

## Correção

`/hub` é uma página real (dashboard), não um layout que envolve outras telas. A solução correta é renomear o arquivo para `hub.index.tsx`, transformando `/hub` em rota-folha e libertando as filhas.

### Mudanças

1. **Renomear** `src/routes/_authenticated/hub.tsx` → `src/routes/_authenticated/hub.index.tsx`.
2. Trocar o `createFileRoute("/_authenticated/hub")` por `createFileRoute("/_authenticated/hub/")` dentro do arquivo (TanStack exige a barra final para `index.tsx`).
3. Nenhuma outra mudança: `routeTree.gen.ts` é regenerado automaticamente; o `<Link to="/hub">` continua válido; nenhuma outra tela referencia o arquivo pelo nome antigo.

### Fora de escopo

- Nada de mexer na calculadora, no design ou em autenticação. O bug é puramente de roteamento.
- Não atualizo `.lovable/prd.md` / `ROADMAP.md` porque é correção de bug, não mudança significativa de produto.
