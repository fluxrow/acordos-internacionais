# Aplicar UI editorial a "Relacionado" e "Outras jornadas"

Você tem razão: as duas seções do final da página de jornada (na imagem) estão "neutras" — fundo bege chapado, três cartões idênticos com borda fininha, e a lista de "Outras jornadas" parecendo botões. Não conversam com o resto do site (hero com wash wine, eyebrow + rule, números display em wine, hierarquia editorial).

A proposta é refazer essas duas seções usando exatamente os mesmos tokens já aplicados no hero e na lista de passos.

## Mudanças (apenas `src/routes/jornadas.$jornada.tsx`)

### 1. Seção "Relacionado" — virar editorial, não cartões iguais

Hoje: 3 cartões idênticos com `border + bg-background` sobre `bg-secondary/40`. Fica chato e simétrico demais.

Novo:
- **Fundo da seção**: trocar `bg-secondary/40` por um wash sutil `bg-[var(--accent-ink-soft)]/40` para criar continuidade com o hero.
- **Eyebrow "Relacionado"**: adicionar rule wine curta (`h-px w-10 bg-[var(--accent-ink)]`) ao lado do texto, igual ao padrão editorial.
- **Heading**: manter `font-display text-3xl`, mas adicionar variante `md:text-4xl` para ganhar peso.
- **Grid**: 12 colunas com pesos diferentes (não 3 iguais):
  - **Países relevantes** (`md:col-span-5`): sem cartão branco — vira lista editorial direto no wash, com numeração `01/02/03` em wine pequena e links `ink-link` grandes (`font-display text-xl`).
  - **Guia recomendado** (`md:col-span-4`): único bloco "destacado" com `bg-background border-l-2 border-[var(--accent-ink)]` (regra vertical wine em vez de borda completa). Título em `font-display text-2xl`.
  - **Calculadora** (`md:col-span-3`): tratamento de "ferramenta" — fundo `bg-foreground text-background` invertido, com `font-display` claro. Cria contraste e quebra a simetria.

### 2. Seção "Outras jornadas" — virar índice editorial

Hoje: 3 retângulos lado a lado com bordas, parecendo botões CTA.

Novo:
- Remover a malha de bordas (`grid gap-px bg-border`).
- Substituir por uma **lista vertical** com hairlines (`divide-y divide-border`), cada item com:
  - número `01/02/03` em `font-display` wine à esquerda
  - título da jornada em `font-display text-2xl`
  - micro-label do público à direita (ex: "Para quem mora fora") em `text-xs text-muted-foreground uppercase tracking-wider`
  - seta `→` em wine que translada no hover, com `hover:bg-[var(--accent-ink-soft)]/30` em toda a linha
- Eyebrow "Outras jornadas" com rule wine, igual ao "Relacionado".
- Em md+: layout em 2 colunas (lista ocupa `md:col-span-8`, coluna direita `md:col-span-4` vazia respira — padrão editorial assimétrico já usado em outras páginas).

## O que NÃO muda
- Hero, lista de passos, TOC sticky e CTA Marcos final permanecem como estão (já estão alinhados ao editorial).
- Nenhuma mudança de dados, rotas ou componentes globais.
- Sem mudanças em outras páginas — escopo restrito a estas duas seções.

## Arquivos
- `src/routes/jornadas.$jornada.tsx` — apenas os dois blocos `{/* RELACIONADO */}` e `{/* OUTRAS JORNADAS */}`.

Posso seguir?
