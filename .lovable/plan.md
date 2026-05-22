# Refino editorial das Jornadas

Alinhar a aba Jornadas ao padrão editorial do resto do site (Acordos, Guias, Sobre) e criar um índice próprio.

## 1. Novo `/jornadas` (índice)

Arquivo: `src/routes/jornadas.index.tsx`

- Hero editorial: eyebrow "Jornadas" + `h1` em `font-display 4xl/6xl` + lede.
- Grid 2 col com 4 cards numerados (`01–04`) — título, público, resumo, "Ver jornada →".
- Bloco secundário: "Procurando algo específico?" com 3 links (Acordos por país, Guias práticos, Calculadora).
- `head()` com title/description/og próprios.

## 2. Refino de `/jornadas/$jornada`

Arquivo: `src/routes/jornadas.$jornada.tsx`

- Hero: adicionar wash radial `--accent-ink-soft` e número fantasma `00` em `font-display` atrás do título (mesmo padrão de `acordos.$pais`).
- Breadcrumb: passar a apontar para `/jornadas` (índice novo).
- Stepper lateral sticky: lista numerada com âncoras para cada passo (TOC), substituindo o bloco "Outras jornadas" do topo.
- Passos: usar `text-[var(--accent-ink)]` no número, separadores mais sutis.
- Novo bloco "Relacionado" (3 col antes do CTA final):
  - **Países relevantes** (mapa estático slug→países no `jornadas.ts`).
  - **Guia recomendado** (slug do guia).
  - **Calculadora** (link fixo).
- Footer da página: "Outras jornadas" como linha horizontal com 3 links.

## 3. Dados

Arquivo: `src/data/jornadas.ts`

Adicionar campos opcionais por jornada:
- `paisesRelacionados: string[]` (slugs de `acordos`)
- `guiaRelacionado?: string` (slug de `guias`)

Sugestão de mapeamento:
- `vou-me-mudar` → países top (portugal, estados-unidos, alemanha) · guia: cdt
- `moro-fora` → portugal, japao, estados-unidos · guia: prova-de-vida
- `estou-voltando` → portugal, alemanha · guia: totalizacao
- `quero-me-aposentar` → portugal, italia, japao · guia: prorata

## 4. CTA-Marcos global (ajuste pequeno)

Arquivo: `src/components/cta-marcos.tsx`

`variant="block"`: trocar `bg-secondary` por wash `--accent-ink-soft` + borda superior `--accent-ink/20`, mantendo tipografia. Aplica em todas as páginas que já usam o bloco (home, acordos, guias, jornadas, sobre).

## 5. Navegação

- `src/components/site-header.tsx`: link "Jornadas" passa a apontar para `/jornadas` (não mais para `moro-fora` hardcoded).
- `src/routes/index.tsx`: cards de jornada na home apontam para `/jornadas/$jornada` (já fazem) + um link "Ver todas as jornadas →" para `/jornadas`.

## 6. PRD + Roadmap

Atualizar `.lovable/prd.md` (seção de IA/conteúdo: índice de Jornadas) e `ROADMAP.md` (marcar refino editorial das Jornadas como feito).

## Detalhes técnicos

- Tudo via tokens em `src/styles.css` (`--accent-ink`, `--accent-ink-soft`, `font-display`, `eyebrow`, `lede`, `ink-link`). Sem hex novo.
- TOC sticky usa `<a href="#passo-N">` + `scroll-mt-24` nos `<li>` dos passos.
- Sem mudanças de rota legadas: `/jornadas/moro-fora` etc. continuam funcionando.
