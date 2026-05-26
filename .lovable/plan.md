## Objetivo

Promover as mudanças aprovadas em `/preview/*` para as rotas reais correspondentes, eliminar as rotas de preview e o banner, e atualizar `prd.md` + `ROADMAP.md`.

## Mapa preview → destino


| Preview                                      | Destino real                                         | Natureza da mudança                                                                      |
| -------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `preview.home.tsx`                           | `routes/index.tsx`                                   | Reescrita do bloco "dois públicos" (cidadão + advogado)                                  |
| `preview.jornadas.index.tsx`                 | `routes/jornadas.index.tsx`                          | Reordenação dos cards + novo bloco 04 "Atendimento direto" com Dr. Marcos                |
| `preview.jornadas.$jornada.tsx`              | `routes/jornadas.$jornada.tsx`                       | Injetar `ProvaDeVidaBlock` (moro-fora) e `PlanejamentoTotalizacaoBlock` (estou-voltando) |
| `preview.guias.tsx`                          | `routes/guias.index.tsx`                             | Adicionar card 05 "Comunicação de Saída Definitiva do País" apontando para a nova rota   |
| `preview.guias.saida-definitiva-do-pais.tsx` | **nova** `routes/guias.saida-definitiva-do-pais.tsx` | Promover conteúdo integral como guia real (head/meta SEO real, sem `noindex`)            |
| `preview.profissional.tsx`                   | `routes/profissional.tsx`                            | Hero/descrição/lista de features reescritas sem "modelos de petição"                     |


## Mudanças por arquivo

### 1. `src/routes/index.tsx`

Substituir a seção "dois públicos" pelo bloco do preview:

- Card 01 (cidadão): nova headline + CTAs `Ver os 25 países` (dark), `Explorar por situação / jornadas`, `Blog`.
- Card 02 (advogado): novo título "Hub Profissional em Direito Previdenciário Internacional: Educação, Eficiência e Excelência.", descrição completa, tagline em itálico, CTAs `Conhecer o hub`, `Blog`, `Sobre o Dr. Marcos`. Sem menção a "modelos de petição".
- HERO, stats e "países em destaque" permanecem como estão hoje.

### 2. `src/routes/jornadas.index.tsx`

- Reordenar para: 1) Moro fora · 2) Voltei · 3) Trabalho temporariamente no exterior (usar fonte `JORNADAS_ORDENADAS` do preview).
- Abaixo dos 3 cards, adicionar o bloco 04 "Atendimento direto com o Dr. Marcos Espínola" (wine, `border-[var(--accent-ink)]`, `bg-[var(--accent-ink-soft)]`) com CTA `Agendar consulta` → `/contato` e link "Conhecer o Dr. Marcos" → `/sobre/dr-marcos`.

### 3. `src/routes/jornadas.$jornada.tsx`

- Importar `ProvaDeVidaBlock` e `PlanejamentoTotalizacaoBlock` (mover de `src/components/preview/` para `src/components/jornadas/` — não pertencem mais a preview).
- Renderizar `<ProvaDeVidaBlock />` quando `slug === "moro-fora"` e `<PlanejamentoTotalizacaoBlock />` quando `slug === "estou-voltando"`, entre os passos e o CTA final.

### 4. `src/routes/guias.index.tsx`

- Adicionar item extra (após os existentes de `guias`) com slug `saida-definitiva-do-pais` apontando para `/guias/$slug` (não mais para `/preview/...`).
- Adicionar o `guia` no array em `src/data/guias.ts` (slug, título, resumo) para manter a fonte única de verdade — assim o item aparece naturalmente sem hardcode no `index.tsx`.

### 5. **Nova** `src/routes/guias.saida-definitiva-do-pais.tsx`

- Promover o conteúdo integral de `preview.guias.saida-definitiva-do-pais.tsx`.
- Substituir `head()` por `title`/`description`/`og:title`/`og:description` reais (sem `noindex`), com canonical `https://acordosinternacionais.com/guias/saida-definitiva-do-pais`.
- Atualizar breadcrumb (`Início / Guias / Saída Fiscal`).
- Observação: como esse guia tem layout próprio (FAQ, fontes oficiais), ele vive como rota dedicada e o resolver de `guias.$slug.tsx` continua atendendo os outros. O card no índice aponta para esta rota dedicada via `Link to="/guias/saida-definitiva-do-pais"`.

### 6. `src/routes/profissional.tsx`

- Substituir hero (novo H1 longo, descrição completa, tagline em itálico).
- Substituir a lista "O que está dentro" pelos 8 itens do preview (sem "modelos de petição") + nota de rodapé `Modelos de petição: funcionalidade suspensa por hora — retorna em versão futura.`
- Manter blocos de planos/preço/founders/CTA final como estão hoje (preview só reescreveu hero + features).

## Limpeza

- Excluir:
  - `src/routes/preview.tsx`
  - `src/routes/preview.index.tsx`
  - `src/routes/preview.home.tsx`
  - `src/routes/preview.jornadas.index.tsx`
  - `src/routes/preview.jornadas.$jornada.tsx`
  - `src/routes/preview.guias.tsx`
  - `src/routes/preview.guias.saida-definitiva-do-pais.tsx`
  - `src/routes/preview.profissional.tsx`
  - `src/components/preview/preview-banner.tsx`
- Mover (renomear pasta):
  - `src/components/preview/prova-de-vida-block.tsx` → `src/components/jornadas/prova-de-vida-block.tsx`
  - `src/components/preview/planejamento-totalizacao-block.tsx` → `src/components/jornadas/planejamento-totalizacao-block.tsx`
- `src/routeTree.gen.ts` será regenerado automaticamente pelo plugin do Vite.

## Documentação

- `.lovable/prd.md`: anotar promoção dos previews → produção (Fase 1 + Fase 2 + nova página Saída Fiscal).
- `ROADMAP.md`: marcar como concluídos os itens das fases promovidas; remover menções à sandbox `/preview`.

## Fora de escopo

- Não tocar lógica de calculadora, auth, dados de acordos ou Hub autenticado.
- A aba **"Saída Fiscal"** no `site-header` global **não** está incluída — a nota original sugeria adicionar, mas o header tem critérios próprios (espaço, prioridade). Confirmar separadamente se deseja que entre no menu principal ou fique acessível apenas pelo card no índice de Guias. vamos colocar um acoerdeam mas com um efeito quer fca a pessoa passar o dedo ou clicar pra ver tudo que tem ali.

## Pergunta antes de executar

Adicionar "Saída Fiscal" como item de navegação no `site-header` global, ou manter acessível apenas via card no índice de Guias?   
vamos colocar um acoerdeam mas com um efeito quer fca a pessoa passar o dedo ou clicar pra ver tudo que tem ali.