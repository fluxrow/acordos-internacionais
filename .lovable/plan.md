## Objetivo

Fazer o "Texto integral do acordo" renderizar com a mesma hierarquia visual do .docx oficial (títulos centralizados em negrito, corpo justificado), padronizando para **todos os países** sem mexer no conteúdo já curado em `src/data/acordos-textos/*.ts`.

## O que muda

Apenas `src/components/texto-integral-acordo.tsx`. Em vez de jogar a string em um `<pre>` com `text-center`, vou parsear linha a linha (split por `\n\n`) e renderizar cada bloco com a classe certa:

- **Heading (centralizado, bold, maiúsculo)** quando o bloco for um cabeçalho do acordo. Detecção por regex:
  - Começa com `TÍTULO `, `CAPÍTULO `, `ARTIGO `, `SEÇÃO `, `PARTE ` (com numeração romana ou arábica), ou
  - Bloco curto (≤120 chars) **todo em maiúsculas** (cobre `DISPOSIÇÕES GERAIS`, `INVALIDEZ, VELHICE, MORTE`, `ACORDO DE PREVIDÊNCIA SOCIAL ENTRE…`, etc.).
- **Separador `---`** vira `<hr>` discreto (usado por `canada.ts` e similares).
- **Corpo (justificado)** para o restante, incluindo alíneas `a)`, `b)`, `1.`, `2.` — mantêm o recuo natural via `text-justify` + `whitespace-pre-wrap` para preservar quebras internas.

Tipografia:
- Headings: `font-display font-bold uppercase text-center tracking-wide` com tamanhos escalonados (TÍTULO > CAPÍTULO > ARTIGO > demais).
- Corpo: `text-justify leading-relaxed text-foreground/90`, espaçamento `space-y-4` entre blocos.
- Mantém o container `max-h-[60vh] overflow-y-auto` e o tema atual (sem hex novo, só tokens).

Mesmo tratamento para o bloco `ajuste`.

## Escopo

- Só edita `src/components/texto-integral-acordo.tsx`.
- Nenhum arquivo em `src/data/acordos-textos/*` é alterado — a formatação passa a valer automaticamente para Grécia, Canadá, Alemanha, Itália, Japão e todos os outros 20+ países que usam o mesmo componente.
- Sem mudanças em rotas, dados ou outros componentes.

## Verificação

- Abrir `/acordos/grecia` → "Texto integral do acordo": `TÍTULO I`, `DISPOSIÇÕES GERAIS`, `ARTIGO I…XXVIII` aparecem centralizados em negrito; parágrafos justificados.
- Conferir `/acordos/canada` e `/acordos/alemanha` para garantir que o mesmo layout funciona com textos que já tinham `---` e cabeçalhos longos.
