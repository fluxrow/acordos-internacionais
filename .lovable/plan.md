# Globo à esquerda + entrada suave

Teste de variação visual da seção "Países em destaque" na home.

## Mudanças

1. **Posição do globo** — mover de `right-[-20%]` para `left-[-20%]` (e `left-[-35%]` no breakpoint md). O wash radial acompanha: centro em `30% 50%` em vez de `70% 50%`. Sensação de movimento: globo "entrando" pela esquerda enquanto o olhar do usuário corre da esquerda (texto) para a direita (cards).

2. **Entrada suave e lenta** — adicionar animação one-shot ao wrapper do globo:
   - `opacity: 0 → 0.6`
   - `transform: translateX(-40px) → translateX(0)` (somado ao `-translate-y-1/2` já existente, via composição)
   - `duration: 2200ms`, `ease-out`, sem delay extra além do fade nativo do canvas (700ms)
   - dispara só uma vez no mount (não em scroll)

## Arquivos

| Arquivo | Mudança |
|---|---|
| `src/styles.css` | Adicionar keyframe `globe-enter-left` (opacity + translateX) e utilitária `.animate-globe-enter-left` com `2.2s ease-out both` |
| `src/routes/index.tsx` | Trocar `right-[-20%]`/`lg:right-[-20%]` por `left-[-35%]`/`lg:left-[-20%]`; trocar gradiente radial para `at 30% 50%`; aplicar `animate-globe-enter-left` no wrapper do globo |

## Fora de escopo

- Não mexer no globo do hero.
- Não trocar paleta nem tokens.
- Sem animação em scroll, sem parallax, sem IntersectionObserver — entrada simples no mount.

## QA

- Conferir que o globo não cobre o texto "Países em destaque" no breakpoint md (1021px atual).
- Conferir que a animação não causa layout shift (translateX em wrapper `absolute`, então seguro).
