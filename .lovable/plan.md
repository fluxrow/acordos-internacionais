# Plano — UX editorial da página `/acordos/$pais`

## Objetivo

Sair do "padrãozão" sem destoar da ID visual (serif wine + paper, tokens oklch). Foco em **leitura guiada**, **hierarquia editorial** e **destaque tipográfico de palavras-chave**, mantendo todos os tokens semânticos atuais.

## O que muda (escopo: só essa página)

### 1. Hero com "lede destacado"
- Mantém o título serif e a bandeira atual.
- Substitui o parágrafo `lede` por uma versão com **palavras-chave em wine** (`text-[var(--accent-ink)]`) e peso médio — usando um helper `<Highlight>` que recebe array de termos a marcar (ex.: *totalização*, *pro-rata*, *vigente desde 1995*).
- Adiciona uma **linha de stats** logo abaixo (chips minimal, sem caixa): `25 anos em vigor · 3 órgãos de ligação · 12 documentos oficiais`. Números em serif, label em eyebrow.

### 2. Sumário lateral (TOC sticky)
- O aside hoje só tem CTA Marcos + "Próximos passos". Adiciona acima um **"Nesta página"** — lista de âncoras (Instrumento, Órgãos, Benefícios, Como funciona, Documentos), item ativo em wine, scroll suave.
- Cada `<Bloco>` recebe `id` para âncora.

### 3. Blocos com "kicker + lede"
- Cada `<Bloco>` ganha um *kicker* (eyebrow numerado: `01 · Instrumento`) e um **lede curto de 1 linha** explicando o porquê do bloco. Reduz a sensação de "lista de FAQ".

### 4. "Como funciona" mais escaneável
- Quebra o parágrafo único em **3 passos numerados** (serif grande para o número, texto ao lado). Palavras-chave em wine via `<Highlight>`.
- Mantém o link para o guia de Totalização.

### 5. Benefícios em par comparativo
- Hoje são duas listas com `✓`. Vira uma **tabela visual 2-col com divisória central wine**, header "Brasil" / "{País}" em eyebrow wine, itens em linhas alternadas com hover sutil. Mais "comparativo" que "checklist".

### 6. Órgãos de ligação — cards com dica de uso
- Adiciona uma micro-linha "Use para: protocolar B1/BR-DE 1, esclarecer pendências" em cada card. Telefone e e-mail ganham ícone Lucide (Phone, Mail) ao invés de só underline.

### 7. Documentos — preview do conteúdo
- Para cada documento, mostra um **trecho/descrição de 1 linha** quando existe. Categoria vira "tag pill" wine soft (`bg-[var(--accent-ink-soft)]`) em vez de header de grupo grosso (mantém o agrupamento mas mais leve).
- Cadeado vira `Lock` do Lucide, e o item inteiro ganha hover wine soft para sinalizar "afford­ance de download".

### 8. Helper de highlight
- Novo util `src/lib/highlight.tsx` exportando `<Highlight text={...} terms={[...]} />` que envolve termos casados em `<mark className="bg-transparent text-[var(--accent-ink)] font-medium">`. Usado no hero, "como funciona" e "para o registro".

## Não-objetivos

- Sem novos tokens em `src/styles.css` (usa os existentes: `--accent-ink`, `--accent-ink-soft`, `--border`, `--muted-foreground`).
- Sem novas libs.
- Não mexer em `/acordos` (listagem) nem no Hub.
- Não mexer em copy de fundo — só estrutura/destaque.

## Arquivos tocados

- `src/routes/acordos.$pais.tsx` — hero, blocos, aside TOC, "como funciona", benefícios comparativo, documentos.
- `src/lib/highlight.tsx` — novo helper.
- `.lovable/prd.md` + `ROADMAP.md` — registrar "Refino UX editorial v3" (regra do projeto).

## Validação

- Screenshot de `/acordos/alemanha` antes/depois (Alemanha tem dados ricos: instrumento, decreto, 2 órgãos, benefícios dos dois lados, ~13 docs).
- Spot-check em um país sem `importado` (ex.: `/acordos/canada` se aplicável) para garantir que os blocos opcionais ainda escondem corretamente.
- Verificar mobile (viewport atual 1021px → também testar ~390px): aside TOC vira accordion no mobile.
