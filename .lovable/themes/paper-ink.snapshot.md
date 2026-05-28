# Snapshot · Tema Paper & Ink (light editorial)

Data: 28/05/2026
Substituído por: Premium Dark + Gold

## Como reverter (1 passo)

Copie os blocos `:root { ... }` e `.dark { ... }` de
`src/styles/themes/paper-ink.css.bak` por cima dos blocos correspondentes em
`src/styles.css`. Os tokens semânticos não mudaram de nome, então todos os
componentes seguem funcionando sem refactor.

Opcional: depois da reversão, restaurar o CTAButton para os mapeamentos
originais (`bg-foreground`/`bg-background`) — neste round o componente foi
ajustado para apontar para `--accent-ink` (gold) em algumas variantes.

## Tokens (Paper & Ink)

| Token | Valor oklch | Hex aprox. | Papel |
|---|---|---|---|
| `--paper` | `oklch(0.965 0.008 85)` | `#f5f3ee` | fundo (off-white) |
| `--paper-soft` | `oklch(0.928 0.011 80)` | `#e8e4dd` | bandas / muted |
| `--ink` | `oklch(0.16 0 0)` | `#0d0d0d` | tinta / foreground |
| `--ink-soft` | `oklch(0.30 0 0)` | `#2d2d2d` | corpo |
| `--rule` | `oklch(0.84 0.012 80)` | — | hairline |
| `--accent-ink` | `oklch(0.40 0.13 28)` | `#7a1f1f` | wine (destaque) |
| `--accent-ink-soft` | `oklch(0.92 0.04 28)` | — | wine wash claro |

Mapeamento semântico: `--background`=paper, `--foreground`=ink, `--primary`=ink,
`--secondary`=paper-soft, `--destructive`=accent-ink (wine), etc.

## Por que voltar

- Se o cliente quiser tom editorial claro / impresso para campanhas específicas
- Se uma página (ex.: artigo longo) ficar melhor em fundo claro

A migração para Premium Dark + Gold foi feita só via tokens, então é seguro
alternar entre os dois temas sem reescrever componentes.
