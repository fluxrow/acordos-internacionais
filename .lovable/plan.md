## Diagnóstico

Os cards da imagem são da grid de itens trancados em `src/components/pro-content-lock.tsx` (linhas 52–62), não eram `bg-secondary`. Por isso a rodada anterior não mexeu neles. Eles usam `bg-background/85` sobre uma grade `bg-border/60`, o que dá esse visual quase opaco quase-bege.

## Mudança proposta

Em `src/components/pro-content-lock.tsx`:

1. **Grid container (linha 52)**: trocar `bg-border/60` por `bg-border/30` para os "gaps" entre células ficarem mais sutis.
2. **Itens da lista (linha 54–60)**: trocar `bg-background/85` por `bg-background/40 backdrop-blur-md`, e adicionar `hover:bg-background/60` para deixar o vidro reativo.
3. Manter o `LockIcon` e tipografia.

Resultado: o radial gradient atrás (linhas 27–30) passa a atravessar cada célula, dando o efeito de vidro real em vez de "caixa cinza".

## Fora de escopo

- Sem mudanças em outros componentes ou na lógica de bloqueio.
- Sem alterar tokens em `src/styles.css`.

Posso aplicar?
