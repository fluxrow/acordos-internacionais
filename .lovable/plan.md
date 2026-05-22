# Alinhar a aba Guias à UI editorial

Hoje a página `/guias/$slug` ainda usa o layout "neutro" antigo (hero simples, blocos com `<hr>` discreto, sidebar com cartão de "Outros guias" e CTA). Além disso, **não existe um índice `/guias`** — só dá pra entrar via link direto.

Vamos espelhar exatamente o tratamento que aplicamos em Jornadas.

## 1. Novo índice `/guias` (`src/routes/guias.index.tsx`)

- Hero editorial: breadcrumb, eyebrow com rule wine ("Biblioteca · Guias"), `font-display 4xl/6xl`, lede.
- Grid 2 colunas com 4 cartões numerados (`01–04`), número grande wine + título display + resumo + "Abrir guia →".
- Bloco secundário com 3 links horizontais: Jornadas, Acordos, Calculadora.
- `head()` próprio com title, description e og:title/description.

## 2. Refinar `/guias/$slug` (`src/routes/guias.$slug.tsx`)

### Hero
- Adicionar wash radial wine no canto (`--accent-ink-soft`), igual à jornada.
- Breadcrumb com link real para o novo `/guias`.
- Eyebrow `Guia · {tema curto}` (usar o slug humanizado, ou simplesmente "Guia temático" como hoje).

### Corpo dos blocos
- Numerar os blocos `01/02/03` em `font-display` wine à esquerda (grid `auto_1fr` igual aos passos da jornada), removendo o `<hr className="rule">`.
- Manter `space-y-12` e divisor sutil `border-b border-border/60` entre blocos.

### Sidebar
- Adicionar **TOC sticky** com os títulos dos blocos numerados (espelha o "Nesta jornada"), antes do CTA.
- Trocar o card "Outros guias" por lista editorial sem borda completa: eyebrow + numeração wine + título display + seta.
- CTA Marcos mantém posição.

### Nova seção "Relacionado" (antes de "Outros guias" virar rodapé)
- Grid 12 colunas assimétrico (5/4/3), igual à jornada:
  - **Jornadas relacionadas** (col-span-5): lista numerada das jornadas onde esse guia aparece como `guiaRelacionado` (já temos esse vínculo em `src/data/jornadas.ts`).
  - **Acordo destacado** (col-span-4): card com `border-l-2 border-[var(--accent-ink)]` apontando para um país relevante (vamos adicionar `paisRelacionado?: string` opcional em `Guia` com mapeamento simples — ex: `prova-de-vida-no-exterior` → Portugal; `certificado-deslocamento-temporario` → Estados Unidos; `aposentadoria-morando-fora` → Portugal; `totalizacao` → omitido).
  - **Calculadora** (col-span-3): bloco invertido `bg-foreground text-background`, idêntico ao da jornada.
- Fundo da seção: `bg-[var(--accent-ink-soft)]/40`.
- Só renderiza se houver pelo menos uma relação.

### Rodapé "Outros guias"
- Lista editorial vertical (`divide-y`) com numeração wine + título display + seta, em `md:col-span-8` (igual ao "Outras jornadas").

### CTA final
- Adicionar `<CTAMarcos variant="block" />` no fim, igual à jornada (hoje o CTA só aparece na sidebar).

## 3. Dados (`src/data/guias.ts`)
- Adicionar `paisRelacionado?: string` ao `interface Guia`.
- Mapear: `prova-de-vida-no-exterior` → "portugal", `certificado-deslocamento-temporario` → "estados-unidos", `aposentadoria-morando-fora` → "portugal". `totalizacao` fica sem.

## 4. Navegação
- `site-header.tsx`: verificar se há link "Guias" — se sim, apontar para `/guias` (índice).
- `index.tsx` (home): se já existe seção de guias, adicionar "Ver todos os guias →".

## 5. Documentação
- Atualizar `.lovable/prd.md` (seção Guias) e `ROADMAP.md` marcando o refino editorial como concluído.

## Arquivos a criar/editar
- **Criar**: `src/routes/guias.index.tsx`
- **Editar**: `src/routes/guias.$slug.tsx`, `src/data/guias.ts`, `src/components/site-header.tsx` (se aplicável), `src/routes/index.tsx` (se aplicável), `.lovable/prd.md`, `ROADMAP.md`

## O que NÃO muda
- Conteúdo dos guias (textos dos blocos).
- Slugs/URLs existentes (`/guias/totalizacao` etc. seguem funcionando).
- Outros componentes globais.

Posso seguir?
