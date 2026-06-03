# Corrigir amarelo destoante em /jornadas/$jornada

## Diagnóstico

O token `--accent-ink-soft` (`oklch(0.85 0.13 90)` — amarelo claro mostarda) está sendo usado como **background de seção** em vários pontos. No tema Premium Dark + Gold, esse wash claro fica gritante e destoa do restante do site.

Esse token foi pensado para acentos pequenos (sublinhados, badges, bordas), não para preencher áreas grandes.

## Mudanças

Trocar todos os usos de `bg-[var(--accent-ink-soft)]/40` em superfícies grandes por tons da paleta dark, mantendo o ouro apenas como detalhe (borda/texto/ícone).

### 1. `src/components/jornadas/prova-de-vida-block.tsx`
- Seção raiz: trocar `bg-[var(--accent-ink-soft)]/40` por `bg-secondary/30` (ou `bg-card/40`), mantendo `border-y border-[var(--accent-ink)]/30` para preservar o respiro gold.

### 2. `src/routes/jornadas.$jornada.tsx`
- Linha 151 (seção "Relacionado"): trocar `bg-[var(--accent-ink-soft)]/40` por `bg-secondary/30`.
- Linha 245 (hover "Outras jornadas"): trocar `hover:bg-[var(--accent-ink-soft)]/40` por `hover:bg-secondary/40`.
- Linha 99 (TabsTrigger ativo): trocar `data-[state=active]:bg-[var(--accent-ink-soft)]/40` por `data-[state=active]:bg-secondary/60` (mantendo `data-[state=active]:border-[var(--accent-ink)]` para o destaque gold ficar na borda).

## Escopo

- Mudança puramente visual, sem tocar lógica.
- Não altera o token `--accent-ink-soft` em `styles.css` (ele continua válido para usos pontuais como `text-` / `border-` em outras telas).
- Não toca em globos nem em outras páginas além das listadas.

## Verificação

Após aplicar, abrir `/jornadas/moro-fora` no preview e conferir que:
- A seção "Prova de vida" tem fundo neutro escuro com bordas gold sutis.
- A seção "Relacionado" não tem mais o wash amarelo.
- Hover sobre os itens de "Outras jornadas" mostra um realce neutro, não amarelo.
