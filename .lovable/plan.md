## Intensificar contraste do globo (acima do PRD)

Subir o brilho do mapa e clarear levemente a base para deixar os continentes nitidamente visíveis, mantendo a paleta gold do tema.

### Mudanças em `src/components/globe.tsx`

`PAPER`:
- `base`: `[0.18, 0.16, 0.13]` → `[0.22, 0.19, 0.14]` (dourado escuro um pouco mais claro)
- `brightness`: `0.95` → `1.25`

`BASE_CONFIG`:
- `dark`: `0.12` → `0.18`
- `diffuse`: `0.58` → `0.7`

### Escopo

- Sem mexer em `markerColor`, `glowColor`, marcadores, tamanho, posicionamento ou interações.
- Variante `WINE` permanece intocada.
- Sem mudanças em tokens globais (`src/styles.css`).

### Validação

- Conferir na home (hero) que os continentes ganharam presença sem o globo virar protagonista do fundo preto.
