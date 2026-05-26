## Objetivo

Substituir o fundo cinza chapado (`bg-secondary`) dos cards que destoam da identidade visual por um tratamento de vidro (glassmorphism), alinhado aos demais cards da página que já usam `bg-background/70 backdrop-blur-sm`.

## Escopo (apenas o que aparece no screenshot)

Mudanças focadas na página `/acordos/[país]`. Nada de backend, dados ou rotas.

### 1. Card "Atendimento direto" — `src/components/cta-marcos.tsx` (linha 131)

- Trocar `border-border bg-secondary` por algo como:
`border-border/60 bg-background/60 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(122,31,31,0.12)]`
- Manter o restante (padding, radius, conteúdo).

### 2. Aside "Para o registro" / curiosidade — `src/routes/acordos.$pais.tsx` (linha 314)

- Trocar `bg-secondary` por `bg-background/50 backdrop-blur-md`, mantendo a borda esquerda em accent-ink que dá a personalidade editorial.

## Fora de escopo

- Não vou mexer nos outros arquivos que usam `bg-secondary` (botões, sheets, hub, home, etc.) — só os dois cards da tela `/acordos/[país]` mostrados. Se quiser estender depois, faço numa próxima rodada. pode incluir pra aplicar nas oputras paginas tbm.
- Sem alterar tokens em `src/styles.css` — o efeito vem de classes utilitárias (`bg-background/60 backdrop-blur-md`) sobre o radial gradient que a página já tem no hero, dando o "vidro" real.

## Verificação

Conferir visualmente em desktop (1021px) e mobile que os cards ganharam translucidez sobre o fundo, sem perder legibilidade.

Posso aplicar?