## Objetivo

Nas abas **Acordo (texto integral)** e **Ajuste administrativo** dentro de `/hub/$pais`, o texto longo hoje empurra a página inteira — o usuário perde de vista o cabeçalho do país e a barra de abas. Quero que o scroll aconteça **apenas dentro da caixa do texto**, mantendo o nome do país e as abas sempre visíveis no topo.

## O que muda

Apenas o componente `TextoIntegralTab` em `src/routes/_authenticated/hub.$pais.tsx` (linhas 447–537). Nada de mudança em dados, rotas ou outras abas.

A caixa `<pre>` que renderiza o texto integral passa a ter:

- altura máxima limitada à viewport menos o que o cabeçalho + abas ocupam (algo como `max-h-[calc(100vh-280px)]`, com um piso mínimo tipo `min-h-[400px]` pra telas baixas);
- `overflow-y-auto` próprio, com scroll suave e barra estilizada via tokens do tema (cantos arredondados mantidos);
- `overscroll-contain` pra evitar que o scroll "vaze" pra página quando chega no fim;
- borda/padding atuais preservados (mesmo visual Premium Dark + Gold).

O botão **Copiar** e a linha "Conteúdo importado na íntegra…" continuam fora da área rolável, então seguem sempre visíveis junto com o cabeçalho do país.

## Detalhes técnicos

- Editar somente o `<pre>` do estado `loaded` (linhas 527–531).
- Classes Tailwind novas no `<pre>`: `max-h-[calc(100vh-280px)] min-h-[400px] overflow-y-auto overscroll-contain`.
- Sem novas dependências, sem mudança de estado, sem mudança nas demais abas (Visão, Documentos, Órgãos, Trecho).
- Sem impacto em mobile: o `calc(100vh-280px)` continua dando uma janela utilizável; o `min-h-[400px]` garante leitura confortável em telas baixas.

## Fora de escopo

- Não vou tornar o cabeçalho/abas "sticky" — eles já ficam no topo do fluxo; a única razão de sumirem era o `<pre>` esticar a página. Limitando a altura do `<pre>`, o problema some sem precisar mexer no layout da página.
- Não vou mexer no tema, tokens, ou nas outras abas.
