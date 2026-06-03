## Clarear ainda mais a base do globo

Subir significativamente a base e o brilho do mapa para que os continentes fiquem nítidos e os marcadores gold ganhem destaque por contraste.

### Mudanças em `src/components/globe.tsx`

`PAPER`:
- `base`: `[0.22, 0.19, 0.14]` → `[0.34, 0.29, 0.20]` (oceano/esfera bem mais clara, ainda dourada)
- `brightness`: `1.25` → `1.6` (continentes nítidos)

`BASE_CONFIG`:
- `dark`: `0.18` → `0.25`
- `diffuse`: `0.7` → `0.85`

### Escopo

- Não mexer em `markerColor`/`glowColor` — markers continuam gold e ficam mais visíveis por contraste com a base mais clara.
- Variante `WINE` intocada.
- Sem mudanças em tokens globais.

### Validação

- Conferir na home que o globo ganha presença mas continua harmônico com o fundo preto e que os pontos dos países saltam à vista.
