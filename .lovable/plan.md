## Contexto

Hoje, ao clicar num card de país na home, o usuário cai em `/acordos/portugal` (e similares) onde encontra: lista de benefícios, explicação de como funciona a totalização, curiosidade histórica, "quando procurar um advogado", CTA pro Dr. Marcos e só no final o `ProContentLock` da ficha técnica.

O problema: muito desse conteúdo intermediário (totalização explicada, quando acionar advogado, benefícios destrinchados) é exatamente o que o **advogado** procura. Se está aberto, ele resolve o caso lendo a página pública e nunca compra o hub.

A regra que você definiu:

- **Cidadão final** vê o suficiente pra entender o que é o acordo e procurar ajuda.
- **Advogado** vê uma vitrine do que tem dentro do hub e é levado pra página de compra.

## O que muda em cada página de país (`/acordos/$pais`)

### Continua aberto (cidadão final)

- Hero: nome, bandeira, tipo (bilateral/multilateral), vigência, status.
- Parágrafo único de resumo (`destaque` ou `resumo`).
- Curiosidade histórica (quando existir) — é narrativa, não operacional.
- CTA do Dr. Marcos no aside (cidadão com caso real).
- Navegação entre países (anterior/próximo).
- Links para jornadas e guia "Prova de vida" no aside.

### Sai da página pública (vai pro hub)

- Lista detalhada de benefícios cobertos (vira bullet teaser dentro do lock).
- Explicação de como funciona a totalização daquele país.
- Bloco "Quando procurar um advogado" (é orientação técnica).
- Ficha técnica completa (já estava trancada).

### Novo bloco central: "O que tem no hub sobre {país}"

Substitui o miolo técnico atual. Um único `ProContentLock` expandido, com:

- Título: "Tudo sobre o acordo Brasil–{país} no Hub Profissional"
- Lista visual do que está dentro (já existe no componente, refinar copy):
  - Benefícios cobertos, destrinchados artigo por artigo
  - Como aplicar a totalização neste acordo, com exemplos
  - Texto integral do acordo + decreto
  - Portarias do INSS comentadas
  - Documentos e formulários oficiais
  - Modelos de petição editáveis
  - Calculadora de totalização e prorata
  - Fluxograma processual
  - Jurisprudência consolidada
  - Quando e como acionar judicialmente
- CTA principal: "Acessar o hub →" (leva pra `/profissional`, que já é a landing de venda).
- Selo: "Pagamento único · acesso vitalício".

## O que muda na home (`/`)

Os cards "Países em destaque" continuam mostrando: bandeira, nome, tipo, vigência. Isso é vitrine institucional, não conteúdo técnico — pode ficar.

Adicionar **abaixo da grade de países em destaque** um bloco de transição claro:

- Eyebrow: "Para advogados"
- Frase curta: "Cada país abre uma vitrine pública. A profundidade técnica fica no Hub Profissional."
- Link discreto: "Conhecer o hub →"

Isso resolve o desconforto visual de "abre tudo direto" — o usuário vê na home que existe uma camada paga antes mesmo de clicar.

## O que NÃO muda

- Home não ganha nem perde countries cards.
- `/acordos` (lista completa) continua igual — é catálogo institucional.
- `/profissional` continua sendo a página de venda real do hub.
- `ProContentLock` mantém o design atual; só ajusto a copy.
- Jornadas e guias não são tocadas nesta rodada (são conteúdo pra cidadão final, já estão no escopo certo).

## Arquivos afetados

- `src/routes/acordos.$pais.tsx` — remover blocos "Benefícios", "Totalização" e "Quando procurar um advogado"; manter hero, curiosidade, aside; substituir miolo por `ProContentLock` expandido.
- `src/components/pro-content-lock.tsx` — pequeno ajuste de copy do parágrafo introdutório pra reforçar tom de "vitrine de venda".
- `src/routes/index.tsx` — adicionar um bloco curto de transição abaixo de "Países em destaque" sinalizando a camada paga.

## Trade-off de SEO (para você decidir consciente)

Tirar a totalização e a lista de benefícios da página pública reduz o conteúdo indexável de cada país. O Google vai indexar bem menos cauda longa do tipo "como funciona totalização Brasil Portugal". Em troca, a página converte melhor pra venda do hub.

Se quiser preservar SEO, posso manter **um parágrafo curto de totalização** aberto (genérico, sem mostrar o cálculo) e trancar só o aprofundamento. Me diz se prefere essa variante antes de eu implementar. 

Pode seguir com essa sugestão de manter um pagarafl curto de totalização aberto 