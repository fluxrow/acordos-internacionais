# Globo como camada de fundo do hero

## Ideia

Em vez do globo ocupar uma coluna ao lado do texto, ele vira uma **camada decorativa** atrás do título, lede e CTAs. Isso libera muito espaço vertical (especialmente no mobile, onde hoje há um quadrado de ~280px só pro globo) e dá ao hero uma presença visual mais cinematográfica — o leitor "lê o conteúdo sobre o mundo".

Vale em todos os formatos (mobile, tablet, desktop), com posicionamento e tamanho diferentes em cada um.

## Cor do globo

Voltar à paleta clara anterior:
- `baseColor: [0.96, 0.95, 0.93]`
- `glowColor: [0.94, 0.92, 0.88]`
- `markerColor: [0.48, 0.12, 0.12]` (wine, marcadores continuam destacados)
- `mapBrightness: 1.15`

Como agora ele fica como camada de fundo (e não elemento focal), a paleta pálida faz sentido: continentes visíveis, marcadores wine sutilmente pontuando o mundo, sem competir com o título.

## Layout do hero

### Mobile (até 768px)
- Globo posicionado **absoluto à direita**, recortado pela borda da tela (~60% para fora), tamanho ~420px.
- Texto continua à esquerda, ocupando ~75% da largura. Título mantém prioridade visual.
- Um leve mask/gradient da esquerda garante legibilidade do texto sobre o globo.

```text
+----------------------+
| EYEBROW              |
| O mapa            ()() <-- globo grande, parcialmente
| definitivo dos    ()()    para fora da tela à direita
| acordos previd... ()()
|                      |
| Lede...              |
|                      |
| [CTA primário]       |
| [CTA secundário]     |
+----------------------+
```

### Desktop / tablet (≥768px)
- Globo centralizado horizontalmente, **atrás** do conteúdo, tamanho ~700px no desktop.
- Texto centralizado na coluna principal, com largura limitada (~640px) para o globo sobrar dos dois lados.
- Z-index: globo `-z-10`, conteúdo `z-10`.
- Gradient radial muito leve do `--paper` no centro pra dar respiro ao texto (radial-gradient(circle at center, var(--paper) 0%, transparent 60%)).

```text
+----------------------------------+
|         ··· EYEBROW ···          |
|     ()()()()()()()()()()()       |
|    ()()  O mapa definitivo  ()() |
|    ()()  dos acordos prev   ()() |
|    ()()  do Brasil.         ()() |
|     ()()()()()()()()()()()       |
|         Lede centralizada        |
|       [CTA 1]   [CTA 2]          |
+----------------------------------+
```

### Altura do hero
- Mobile: ~600px (vs ~1000px atual)
- Desktop: mantém ~720px, mas agora o conteúdo respira mais

## Mudanças concretas

### `src/components/globe.tsx`
- Reverter `BASE`, `GLOW`, `mapBrightness` para os valores claros originais.
- Trocar `max-w-[280px] sm:max-w-[420px] lg:max-w-[640px]` por algo flexível via prop, mantendo só `w-full aspect-square` no container. O posicionamento (tamanho/offset) fica responsabilidade do hero.
- Remover `mx-auto` padrão (deixar o pai controlar).

### `src/routes/index.tsx` — hero
- Trocar o grid `lg:grid-cols-[1.05fr_1fr]` por um único container `relative` com:
  - `<div className="absolute ...">` envolvendo o `<Globe>` (posicionamento diferente por breakpoint).
  - `<div className="relative z-10 text-center md:text-center ...">` com eyebrow, h1, lede, CTAs centralizados a partir de md, alinhados à esquerda no mobile.
- Adicionar overlay gradient radial sutil (`bg-[radial-gradient(circle_at_center,_var(--paper)_0%,_transparent_65%)]`) entre globo e conteúdo pra garantir contraste de leitura.
- Centralizar o bloco de texto e os CTAs (`justify-center`) no desktop; manter alinhamento à esquerda no mobile (CTA empilhado).

## Fora de escopo

- Stats, "Dois públicos", países em destaque, jornadas, guias — sem mudança.
- Cores globais, tipografia, paleta.
- Interatividade do globo (continua arrastável + auto-rotação).

## Arquivos afetados

- `src/components/globe.tsx`
- `src/routes/index.tsx`
