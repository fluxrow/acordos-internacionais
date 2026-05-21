# Globo na seção "Países em destaque" + quebra de cor

Aplicar o globo interativo (já existe em `src/components/globe.tsx`, baseado em `cobe` — a mesma lib do componente do 21st.dev) como **camada de fundo** da seção "Países em destaque" na home, tingido com o vinho do destaque do hero. Cards ficam translúcidos para o globo respirar atrás.

## Conceito visual

A seção hoje é um grid sólido sobre fundo paper. Vamos:

- Colocar o globo girando atrás do grid, ancorado ao centro-direita, parcialmente sangrando para fora da viewport (mesma linguagem do hero, mas em escala maior e mais sutil).
- Tingir o globo na cor `--accent-ink` (mesmo wine do "acordos previdenciários" no H1). Hoje o globo usa wine só nos markers; vamos levar o wine também para `baseColor` e `glowColor` em versões dessaturadas/claras, mantendo legibilidade.
- Cards passam de `bg-background` opaco para `bg-background/70` + `backdrop-blur-sm`, com hairline `border-border/60`. A grade some — vira cards individuais com gap real, em vez de "tabela colada".
- Um leve gradiente radial paper nas bordas da seção evita que o globo "vaze" para o texto da próxima seção.

## Quebra de cor no resto do site (sutil, controlada)

Hoje quase tudo é paper + ink + um único wine. Para dar vida sem destruir a identidade editorial:

- Introduzir 1 token novo: `--accent-ink-soft` (versão clara/translúcida do wine, usada como wash de fundo). Sem novas hues.
- Aplicar esse wash em 2–3 momentos respiráveis: fundo da seção "Países em destaque" (wash radial atrás do globo), hover state dos cards de países (em vez de virar foreground preto, vira wine), e divisores eyebrow chave.
- Não trocar a paleta global. Não mexer em header, footer, formulários, hub autenticado.

## Escopo de arquivos

| Arquivo | Mudança |
|---|---|
| `src/styles.css` | Adicionar `--accent-ink-soft` (wine claro translúcido) + mapear em `@theme inline` |
| `src/components/globe.tsx` | Aceitar prop `tint` opcional → reconfigurar `baseColor` / `markerColor` / `glowColor` em variante "wine". Manter default Paper & Ink atual. |
| `src/routes/index.tsx` | Reescrever a seção "Países em destaque": wrapper relativo, globo absoluto atrás, grid de cards com transparência + blur, hover state em wine soft. |

Nada fora disso. Nenhuma rota nova, nenhum dado, nenhum backend.

## Detalhes técnicos

**Globo tingido (`globe.tsx`):**

```text
variant "wine":
  baseColor:   oklch ~0.55 0.09 28   → wine dessaturado/claro
  markerColor: oklch ~0.40 0.13 28   → accent-ink puro
  glowColor:   oklch ~0.92 0.04 28   → paper levemente rosado
  mapBrightness: 1.4 (mais alto para o tint não escurecer demais)
```

Converter para tupla RGB normalizada `[r,g,b]` que `cobe` exige, dentro do componente.

**Seção (`index.tsx`):**

```text
<section className="relative overflow-hidden border-y border-border bg-[var(--paper)]">
  {/* wash radial accent-ink-soft */}
  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(...)]" />
  {/* globo */}
  <div aria-hidden className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[820px] opacity-[0.55] pointer-events-none">
    <Globe tint="wine" />
  </div>
  {/* conteúdo */}
  <div className="relative z-10 ...">
    <ul className="grid ... gap-4">  // gap real, sem grid-de-1px
      <li><a className="rounded-xl border border-border/60 bg-background/70 backdrop-blur-sm hover:bg-[var(--accent-ink-soft)] hover:border-accent-ink ...">
```

Cards perdem o efeito "hover preto sólido" — passa a hover em wine soft (continua legível, dá vida).

## Fora de escopo

- Não trocar o globo do hero (continua com a paleta atual).
- Não aplicar transparência em cards de outras seções (PathCard, hub, preços).
- Não mexer em tipografia ou em outros tokens semânticos.
- Sem animação extra além do giro nativo do `cobe`.

## QA

- Conferir contraste do nome do país sobre card translúcido com globo atrás (mobile e desktop).
- Conferir que o globo não invade visualmente a seção "Jornadas/Guias" abaixo.
- Conferir performance: o globo já roda no hero — segundo canvas pode pesar. Se necessário, baixar `mapSamples` da instância de fundo.
