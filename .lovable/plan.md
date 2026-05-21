# Hero com globo ancorado à direita (estilo Ruixen)

## Referência

Imagem enviada (Ruixen UI Globe Feature Section): globo grande à direita, parcialmente recortado pela borda da tela, texto à esquerda em coluna estreita. O globo é o "ambiente", não um item ao lado do texto — sensação de profundidade sem competir com o título.

## Cor do globo

Voltar à paleta pálida (como estava antes do último ajuste):
- `baseColor: [0.96, 0.95, 0.93]`
- `glowColor: [0.94, 0.92, 0.88]`
- `markerColor: [0.48, 0.12, 0.12]` (wine, pontos destacados)
- `mapBrightness: 1.15`

Funciona porque agora o globo é grande e os marcadores wine pontuam o mundo como pequenos sinais — não precisa de contraste forte na esfera.

## Layout — três formatos

### Desktop (≥1024px)
- Container `relative` ocupando toda a largura do hero.
- Globo posicionado `absolute right-[-15%] top-1/2 -translate-y-1/2`, tamanho `~720px`. Cerca de 20–25% do globo fica fora da viewport à direita.
- Texto numa coluna `max-w-[560px]` à esquerda, com `z-10`.
- Altura do hero: ~640px (em vez dos ~720 atuais — ganha respiro).

```text
+----------------------------------------+
|                                        |
| EYEBROW                  ()()()()()    |
|                       ()()       ()()  |
| O mapa definitivo    ()(  ·  ·  · )()  |
| dos acordos          ()(  ·     · )()  |
| previdenciários      ()(       ·  )()  |
| do Brasil.           ()()       ()() __|
|                       ()()()()()()     |  ← cortado
| Lede curta...                       ↑globo
|                                     fora
| [CTA primário]  [secundário]        da tela
|                                        |
+----------------------------------------+
```

### Tablet (768–1023px)
- Mesmo princípio, globo `right-[-25%]`, tamanho ~560px.
- Texto `max-w-[480px]`, mantém alinhamento à esquerda.
- O recorte do globo é mais agressivo (mais fora da tela) porque a largura é menor.

### Mobile (<768px)
- Globo posicionado `absolute right-[-40%] top-[55%]`, tamanho ~360px (ainda recortado pela direita).
- Texto ocupa a largura toda (sem max-width), mas o globo fica **atrás** do bloco de CTAs, criando o efeito de camada sem reduzir legibilidade do título.
- Opacidade do globo reduzida pra `0.65` no mobile pra garantir que o texto sobre ele continue legível.
- Altura do hero: ~580px (ganho de ~420px vs atual).

```text
+--------------------+
| EYEBROW            |
| O mapa             |
| definitivo dos     |
| acordos prev.      |
| do Brasil.         |
|                    |
| Lede curta...      |
|              ()()()|
| [CTA primário] )()|
|              ()(  |
| [CTA secund.]()() |
+--------------------+
```

## Legibilidade

Em todos os formatos, adicionar um overlay sutil entre globo e texto:
- `bg-[linear-gradient(to_right,_var(--paper)_0%,_var(--paper)_35%,_transparent_70%)]` no desktop/tablet (fade horizontal da esquerda).
- No mobile, `bg-[radial-gradient(circle_at_top_left,_var(--paper)_0%,_var(--paper)_45%,_transparent_75%)]` (mancha de paper no canto sup. esq. protegendo o título).

Resultado: texto sempre nítido, globo "respirando" atrás.

## Tipografia / CTAs

Manter como está hoje (título serif grande, lede, dois CTAs lado a lado). Sem mudanças de fonte ou tamanho.

## Mudanças concretas

### `src/components/globe.tsx`
- Reverter `BASE`, `GLOW`, `MARKER`, `mapBrightness` para os valores claros originais.
- Remover `max-w-[280px] sm:max-w-[420px] lg:max-w-[640px]` — agora o container externo controla tamanho/posição via `className` prop. Manter só `aspect-square w-full` no canvas wrapper.

### `src/routes/index.tsx`
- Substituir o grid de 2 colunas por:
  - Wrapper `relative` com altura responsiva (`min-h-[580px] md:min-h-[600px] lg:min-h-[640px]`).
  - `<div className="absolute inset-0 pointer-events-auto">` envolvendo o `<Globe>` com classes responsivas de posição/tamanho.
  - `<div className="absolute inset-0 -z-0 ...">` com o gradient overlay.
  - `<div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">` com texto + CTAs em coluna estreita à esquerda.
- Ajustar `pointer-events` do canvas para `auto` só no desktop/tablet (no mobile fica `none` pra não roubar toque dos CTAs).

## Fora de escopo

- Stats, "Dois públicos", países em destaque, jornadas, guias.
- Fontes, paleta global.
- Interatividade do globo continua igual (auto-rotação + arrastar onde aplicável).

## Arquivos afetados

- `src/components/globe.tsx`
- `src/routes/index.tsx`
