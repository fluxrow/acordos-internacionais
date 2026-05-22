## Objetivo
Alinhar `/glossario` ao mesmo padrão editorial usado em Jornadas e Guias, sem alterar conteúdo dos termos.

## Mudanças em `src/routes/glossario.tsx`

### 1. Hero editorial
- Wrapper com radial wash `--accent-ink-soft` (mesma assinatura visual de Jornadas/Guias).
- Breadcrumb: `Início / Referência / Glossário`.
- Eyebrow com regrinha vinho: `<span className="h-px w-10 bg-[var(--accent-ink)]" /> Referência · Glossário`.
- Título `font-display text-5xl md:text-7xl`.
- Lede ampliado, com contagem de termos ("9 termos essenciais...").

### 2. Índice alfabético (navegação rápida)
- Faixa logo abaixo do hero com letras iniciais (A, C, F, P, T, V) como âncoras `#letra`.
- `font-display`, hover vinho, separadores sutis.

### 3. Lista de termos — layout editorial
- Trocar `<dl>` por grid 12-col: número/letra à esquerda (`md:col-span-2`, `font-display text-2xl text-[var(--accent-ink)]`), termo (`md:col-span-4 font-display text-2xl`), definição (`md:col-span-6 text-foreground/85 leading-relaxed`).
- Divisores `border-b border-border/60`, padding `py-10`.
- Hover na linha inteira: `hover:bg-[var(--accent-ink-soft)]/40` com transição suave.
- IDs por termo (`id={slug}`) para deep-link.

### 4. Bloco "Relacionado" (novo, antes do footer)
- Grid 12-col assimétrico 5/4/3, mesma assinatura de Jornadas/Guias:
  - **col-span-5** — "Comece por uma jornada" → `/jornadas` (lista 2-3 jornadas em destaque).
  - **col-span-4** — "Guias práticos" destacado com `border-l-2 border-[var(--accent-ink)] bg-background` → `/guias`.
  - **col-span-3** — Card invertido `bg-foreground text-background` → `/calculadora`.

### 5. CTA Marcos
- `<CTAMarcos variant="block" />` ao final, com `contexto` específico de glossário ("Termo confuso no seu caso? Fale com o Dr. Marcos.").

### 6. Meta tags
- Manter `head()` atual (já tem title/description/og). Adicionar `og:type: article` e canonical implícito.

## Documentação
- Atualizar `.lovable/prd.md` e `ROADMAP.md` marcando Glossário como migrado para UI editorial.

## Arquivos
- editar `src/routes/glossario.tsx`
- editar `.lovable/prd.md`, `ROADMAP.md`

Sem mudanças em dados, rotas, ou lógica. Apenas apresentação.