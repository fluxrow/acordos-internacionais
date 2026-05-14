
# Ajuste de escopo: o que fica aberto vs o que vai para o hub pago

Faz total sentido. Hoje o site público entrega quase tudo — não há razão para um advogado pagar R$ 1.997 se ele resolve no `/acordos/portugal` aberto. Precisamos rebalancear: a área pública vira **lead-gen para o Dr. Marcos** (suficiente para o cidadão decidir contratar, insuficiente para o advogado trabalhar), e a profundidade técnica fica atrás do paywall.

## Princípio de divisão

> **Aberto** responde *"o que é, se eu tenho direito, e com quem falo".*
> **Pago** responde *"como eu, advogado, executo o caso de ponta a ponta".*

## Área aberta (PF + SEO) — o que fica

Mantém o tráfego orgânico e converte para o Marcos, sem entregar manual de trabalho.

- **Home dual** (igual hoje)
- **`/acordos`** — grid dos 25 países (nome, bandeira, status, 1 linha)
- **`/acordos/{pais}`** — versão **resumida**:
  - O que é o acordo (2–3 parágrafos)
  - Principais benefícios cobertos (lista curta, sem detalhe técnico)
  - "Quem deve procurar um advogado" + **CTA Marcos**
  - Link "Sou advogado, quero a ficha técnica completa →" para `/profissional`
- **`/jornadas/{jornada}`** — narrativa do cidadão (vou me mudar, moro fora, etc.) com CTA Marcos
- **`/guias/{slug}`** — guias conceituais leigos (totalização explicada, prova de vida)
- **`/glossario`** — termos básicos
- **`/blog`** — SEO
- **`/sobre/dr-marcos`**, **`/contato`**
- **`/profissional`** — landing de venda do hub (preview do que tem dentro + checkout)

## Área pública — o que **sai** e vai para o hub

Hoje as páginas-país abertas estão entregando coisa de hub. Remover da versão pública:

- Texto integral do acordo / decreto / portaria
- Lista de documentos oficiais com links
- Tabela de benefícios detalhada (RMI, carência, regras de totalização caso a caso)
- Procedimentos passo-a-passo de requerimento
- Formulários oficiais e modelos
- Comparativos entre países
- Qualquer "ficha técnica"

## Área profissional (`/app/*`, paywall) — o que entra

Tudo que foi removido do público + o que estava previsto na Fase 2:

- **`/app/paises/{pais}`** — ficha técnica completa: texto do acordo, decreto, portarias aplicáveis, benefícios cobertos com regras, documentos exigidos, formulários, prazos, autoridade competente, jurisprudência relevante
- **`/app/portarias`** — atos normativos comentados
- **`/app/modelos`** — petições, requerimentos, procurações
- **`/app/calculadoras`** — totalização, conversão de tempo
- **`/app/fluxogramas`** — passo-a-passo processual por país
- **`/app/atualizacoes`** — changelog regulatório
- **`/app/jurisprudencia`**
- **`/app/conta`**

## Sinalização visual no site público

Para o advogado entender que tem mais lá dentro (sem o cidadão se sentir bloqueado):

- Nas páginas-país abertas, no fim da seção: bloco discreto **"Conteúdo profissional"** listando *"Texto integral do acordo · Portarias comentadas · Modelos de petição · Calculadora de totalização · Fluxograma processual"* todos em cinza, com cadeado fino e CTA "Acessar o hub →"
- Header ganha um link permanente "Hub profissional"
- `/profissional` mostra screenshots reais (mockados na Fase 1) do que tem dentro

## Impacto na Fase 1 atual

Trabalho a fazer agora (somente front, sem mexer em backend):

1. **`src/data/acordos.ts`** — separar campos em dois blocos: `public` (resumo, benefícios em linha, quando procurar advogado) e `pro` (texto do acordo, decreto, portarias, documentos, procedimentos). O `pro` fica no arquivo mas não é renderizado pela rota pública.
2. **`src/routes/acordos.$pais.tsx`** — reescrever para consumir só o bloco `public` + adicionar bloco "Conteúdo profissional (cadeado)" + CTA Marcos no topo e fim.
3. **`src/routes/acordos.index.tsx`** — remover qualquer detalhe técnico dos cards; deixar apenas país, bandeira, status, 1 linha.
4. **`src/routes/jornadas.$jornada.tsx`** e **`src/routes/guias.$slug.tsx`** — revisar para não conter procedimento técnico; se contiver, mover para `pro` e substituir por linguagem leiga + CTA.
5. **`src/components/site-header.tsx`** — adicionar link "Hub profissional".
6. **`src/routes/profissional.tsx`** — reforçar a lista do que tem dentro (usando exatamente os itens removidos do público) + screenshots mockados.
7. Novo componente **`<ProContentLock />`** reutilizável: bloco cinza com cadeado, lista de itens trancados, CTA "Acessar o hub".

## O que **não** muda

- Identidade Paper & Ink, fontes, tokens
- Lista dos 25 acordos
- Estrutura de rotas públicas
- Plano de Fase 2 (auth + pagamento) segue como estava

## Pergunta antes de implementar

Confirma este corte? Ou quer ajustar onde fica a linha — por exemplo, manter "lista de documentos exigidos" no público (ajuda o cidadão a se preparar antes de falar com o Marcos) e trancar só o resto?
