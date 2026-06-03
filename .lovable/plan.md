## Ajuste de contraste do globo (Premium Dark + Gold)

Aplicar os valores recomendados no `src/components/globe.tsx`, mantendo a identidade dourada e sem mexer no fundo/layout ao redor.

### Mudanças

Em `PAPER` (paleta ativa do tema):
- `base`: `[0.12, 0.12, 0.14]` → `[0.18, 0.16, 0.13]` (dourado escuro sutil)
- `brightness`: `0.55` → `0.95` (continentes perceptíveis)

Em `BASE_CONFIG`:
- `dark`: `0` → `0.12`
- `diffuse`: `0.5` → `0.58`

### Escopo

- Não alterar `markerColor`, `glowColor`, marcadores, tamanho do globo, interações ou posicionamento.
- Variante `WINE` permanece como está (compat).
- Sem mudanças em CSS/tokens globais — apenas constantes do componente do globo.

### Validação

- Verificar visualmente na home (hero) que os continentes ficaram legíveis sobre o oceano e que o globo continua se integrando ao fundo preto sem virar protagonista.
