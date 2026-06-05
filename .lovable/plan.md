## Problema

Na página **/hub/laudos** (Histórico de Laudos) cada linha tem só dois botões: **Abrir** e **Excluir**. Não existe um botão direto para baixar o PDF — o usuário precisa abrir o laudo numa aba nova e, lá dentro, clicar manualmente em "⬇ Baixar / Imprimir PDF".

Na página do laudo em si (`/hub/laudo?id=...`) o botão de imprimir/baixar já existe e funciona via `window.print()` (com CSS `@media print` cuidando do layout PDF). Ou seja, a infra de geração de PDF já está pronta — só falta atalho na listagem.

## Solução proposta

1. **Em `src/routes/_authenticated/hub/laudo.tsx`**: aceitar um novo parâmetro de busca `print=1`. Quando presente, após o payload carregar e o componente renderizar, chamar `window.print()` automaticamente uma única vez (com pequeno `setTimeout` para garantir que fontes e layout estabilizaram).

2. **Em `src/routes/_authenticated/hub/laudos.tsx`**: adicionar um botão **"Baixar PDF"** em cada `LaudoRow`, posicionado antes do botão "Abrir". Ele abre `/hub/laudo?id={laudo.id}&print=1` em nova aba (`target="_blank"`), o que aciona o diálogo de impressão/salvar como PDF do navegador assim que a página carrega.

   - Ícone: `Download` do `lucide-react`.
   - Estilo: mesmo padrão visual do botão "Abrir" (mesma classe, mesma altura), para manter a régua tipográfica da linha.
   - Mantém "Abrir" e "Excluir" como estão.

## Detalhes técnicos

- O `validateSearch` da rota `/hub/laudo` passa a aceitar `print: "1" | undefined`.
- O `useEffect` que dispara a impressão só roda quando `pronto && payload && search.print === "1"`, e usa uma ref para garantir disparo único.
- Nenhuma alteração de backend, banco ou geração de PDF — reaproveita 100% do fluxo `window.print()` + CSS de impressão já existente em `src/components/laudo/laudo-pdf.css`.

## Fora de escopo

- Geração server-side de PDF (Puppeteer/pdf-lib). Não é necessário para resolver o pedido e exigiria infra adicional.
- Mudanças visuais no laudo em si.