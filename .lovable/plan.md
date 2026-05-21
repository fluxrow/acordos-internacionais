# Ajuste do hero no mobile

## O que está acontecendo

No mobile (390px), o hero ficou com problemas claros:

1. **Globo quase invisível** — a paleta wine sobre paper ficou muito clara: `baseColor [0.96, 0.95, 0.93]` + `glowColor [0.94, 0.92, 0.88]` praticamente somem contra o fundo paper da página. Aparece só uma silhueta fantasma. No desktop passou despercebido porque está num grid lado a lado com mais contexto visual; no mobile o globo fica isolado no centro, então a falta de contraste salta aos olhos.
2. **Espaço vertical enorme** — o globo ocupa um quadrado de ~375×375px logo depois dos CTAs, criando uma "zona morta" gigante antes das estatísticas. O hero mobile fica com ~1000px de altura, e mais da metade é o globo pálido.
3. **Sem hierarquia** — no mobile o globo virou o primeiro grande bloco visual, mas ele é decorativo. O foco deveria continuar sendo o título + CTAs.

## O que mudar

### 1. Paleta do globo com mais contraste
Escurecer levemente o `baseColor` (esfera) e o `glowColor` (halo) para o globo ter presença sem destoar da paleta Paper & Ink. Manter o `markerColor` wine.

- `baseColor`: `[0.88, 0.85, 0.80]` (cinza-areia, claramente distinguível do paper `#f5f3ee`)
- `glowColor`: `[0.85, 0.82, 0.76]` (halo discreto mas visível)
- `mapBrightness`: subir de `1.15` para `1.3` para os continentes ficarem mais nítidos

### 2. Tamanho responsivo do globo
No mobile, reduzir o container para ~280px (em vez de ocupar toda a largura). No tablet/desktop continua igual.

Mudança em `src/components/globe.tsx`:
- `max-w-[640px]` → `max-w-[280px] sm:max-w-[420px] lg:max-w-[640px]`

### 3. Ordem visual no mobile
Manter o globo **depois** do bloco de texto (já está assim no flow de grid), mas reduzir o `gap` do grid no mobile pra colar mais o globo no resto do conteúdo:
- `gap-12` → `gap-6 md:gap-10 lg:gap-8`

E reduzir o padding-bottom do hero no mobile, já que o globo agora é menor:
- `pb-20 md:pb-28` → `pb-12 md:pb-20 lg:pb-28`

## Fora de escopo

- Mudanças no resto do site (cards, jornadas, guias) — usuário pediu pra checar o hero mobile especificamente.
- Bandeiras dos países em destaque aparecem em branco no screenshot — provavelmente bloqueio de `flagcdn.com` no preview; tratar separado se for problema real.
- Fontes, paleta global, conteúdo do título — está OK conforme feedback anterior.

## Arquivos afetados

- `src/components/globe.tsx` — ajustar cores e `max-w-*`
- `src/routes/index.tsx` — ajustar `gap` e `pb` do grid do hero
