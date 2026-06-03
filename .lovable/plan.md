## Rebalancear a base do globo para destacar os marcadores

A base atual ficou clara e dourada demais — compete com os pontos gold dos países. Vou escurecer e neutralizar levemente o tom da esfera (sem perder a temperatura quente do tema) e manter o brilho do mapa alto, de modo que:

- continentes seguem nítidos em qualquer tamanho de tela;
- os marcadores gold ganham contraste real contra a base.

### Mudanças em `src/components/globe.tsx`

`PAPER`:
- `base`: `[0.34, 0.29, 0.20]` → `[0.16, 0.14, 0.12]` (esfera mais escura e neutra-quente)
- `brightness`: `1.6` → `1.4` (continentes ainda bem visíveis)

`BASE_CONFIG`:
- `dark`: `0.25` → `0.32` (mais sombreamento no lado escuro, dá profundidade)
- `diffuse`: `0.85` → `0.65` (reduz "achatamento" sob luz forte)

### Escopo

- `markerColor` e `glowColor` permanecem (pontos continuam gold).
- Tamanho/posição/interação do globo intocados.
- Variante `WINE` não muda.
- Sem mudanças em `src/styles.css` ou tokens globais.

### Validação

- Conferir na home (mobile, tablet, desktop) que os pontos dos países saltam contra a esfera e que os continentes continuam legíveis.
