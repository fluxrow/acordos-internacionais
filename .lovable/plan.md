# Hero com globo interativo + refresh visual

Trazer um ar mais contemporâneo para a home sem perder a alma editorial "Paper & Ink". O núcleo da mudança é um hero novo com um **globo 3D** que destaca os países com acordo com o Brasil, e pequenos ajustes de respiro/escala no resto do site para conversar com esse novo hero.

## O que muda

### 1. Hero novo (home)
- Layout em duas colunas no desktop, empilhado no mobile:
  - Esquerda: eyebrow + título grande + lede + dois CTAs (mantém os existentes "Ver os 24 países" / "Hub para advogados").
  - Direita: **globo interativo** marcando os países dos acordos.
- Copy mantém a voz atual ("O mapa definitivo dos acordos previdenciários do Brasil."). Só ganha hierarquia visual nova.
- Estatísticas (24 acordos, bilaterais, multilaterais, 600+ docs) viram uma faixa fina logo abaixo do hero — mais discreta, sem o bloco cinza atual.

### 2. Globo
- Componente `Globe` baseado em **cobe** (canvas WebGL leve, ~10kb).
- Cores casadas com o tema Paper & Ink: base off-white, marcadores no `accent-ink` (wine), brilho neutro. Nada de laranja genérico.
- Marcadores:
  - **Brasil** como ponto âncora, tamanho maior.
  - **24 países com acordo** com Brasil (todos os bilaterais + capitais dos blocos multilaterais), tamanho menor.
  - Os 5 "destaques" da home (Portugal, Japão, EUA, Itália, Alemanha, Espanha) ganham marcador médio para hierarquia visual.
- Auto-rotação suave, arrastável com mouse/touch. Sem interação cliclável por ponto (escopo desta entrega).

### 3. Refresh do resto da home
- Aumenta respiro vertical entre seções, alinhando à nova escala do hero.
- "Países em destaque": cards ganham hover mais sutil (sem inversão preto-total, vira destaque com borda).
- "Jornadas / Guias": mantém estrutura, só ajusta tipografia para o novo ritmo.

### 4. Tokens / estilo
- Sem trocar paleta nem fontes. Só novos utilitários de espaçamento e um leve ajuste no peso do `h1` para parear com o globo.

## Detalhes técnicos

- **Dependência nova**: `cobe` (npm). `lucide-react` e `@radix-ui/react-slot` já existem no projeto.
- **Componente**: `src/components/globe.tsx` — versão tipada (TS estrito), sem `any`, sem `let` no escopo do componente (refs internas), com cleanup correto em `useEffect`. Não vamos copiar o snippet `originui/button` — o projeto já tem `src/components/ui/button.tsx`.
- **Dados dos marcadores**: nova lista `src/data/paises-coords.ts` com `{ slug, lat, lng }` para os 24 países do `acordos.ts`. Brasil incluído como âncora separada.
- **SSR**: `cobe` toca `window`/`canvas`, então o `Globe` é renderizado client-side (efeito + `if (typeof window === 'undefined') return null` no caminho do `createGlobe`). Sem `"use client"` (TanStack Start não usa essa diretiva).
- **Acessibilidade**: globo é decorativo; `<canvas aria-hidden="true">`. CTAs e hierarquia do hero seguem semânticos.
- **Performance**: canvas a `devicePixelRatio: 2`, `mapSamples: 16000`. Lazy import opcional se medirmos impacto no LCP.

## Fora de escopo

- Clicar num marcador para navegar até a página do país (pode vir depois).
- Modo escuro do globo.
- Mudança de fontes ou paleta.

## Arquivos tocados

- `package.json` — adicionar `cobe`.
- `src/components/globe.tsx` — novo.
- `src/data/paises-coords.ts` — novo.
- `src/routes/index.tsx` — hero reescrito, stats compactadas, refinamento de seções.
- `src/styles.css` — eventuais utilitários de respiro (se necessário).
