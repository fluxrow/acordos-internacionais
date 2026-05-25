
## Resumo da análise dos 3 documentos

O Marcos enviou três briefings:

1. **`briefing_caua_acordos_internacionais_I.md`** — mudanças de copy/CTA na **homepage** (seções Cidadão e Advogado), reordenação da seção **Jornadas**, e duas seções novas de conteúdo (**Prova de Vida** com 5 modalidades + **Planejamento da Totalização** em 4 etapas). Tudo dividido em Fase 1 (homepage) e Fase 2 (jornadas/conteúdo).
2. **`instrucoes_caua_homepage.html`** — mesmo conteúdo do .md, em formato diff visual com "antes/depois", já mapeado por seção.
3. **`instrucoes_caua_saida_fiscal.html` + `guias.saida-definitiva-do-pais.tsx`** — uma **nova página de guia** (Saída Fiscal / DSDP) pronta em React, com instruções para: criar a rota `/guias/saida-definitiva-do-pais`, adicionar item "Saída Fiscal" no header, adicionar card 05 na listagem de guias, e linkar a partir das jornadas relevantes.

### Mapeamento para o nosso código atual

| Pedido do Marcos | Onde mora hoje no projeto |
|---|---|
| Seção "01 Para o cidadão" | `src/routes/index.tsx` |
| Seção "02 Para o advogado" | `src/routes/index.tsx` + `src/routes/profissional.tsx` (remover "modelos de petição") |
| Jornadas + ordem + CTA Marcos abaixo | `src/routes/jornadas.index.tsx` + `src/data/jornadas.ts` |
| Prova de vida (5 modalidades) | conteúdo novo dentro da jornada "Moro fora" (`src/routes/jornadas.$jornada.tsx`) |
| Planejamento da Totalização (4 etapas) | conteúdo novo dentro da jornada "Voltei para o Brasil" |
| Página Saída Fiscal | nova rota `src/routes/guias.saida-definitiva-do-pais.tsx` (o .tsx entregue usa `react-router-dom` — precisa adaptar para `@tanstack/react-router`) |
| Aba "Saída Fiscal" no header | `src/components/site-header.tsx` |
| Card 05 na listagem | `src/routes/guias.index.tsx` (atualmente lê de `src/data/guias.ts`) |

---

## Estratégia: sandbox `/preview/*` sem mexer no site atual

Crio um conjunto de **rotas espelho** sob o prefixo `/preview/`, marcadas como `noindex,nofollow`, que servem como "vitrine" das mudanças propostas. O site público (`/`, `/jornadas`, `/profissional`, `/guias`) **permanece intocado**. O Marcos abre o link `/preview/...`, compara lado a lado, e só depois a gente promove o que ele aprovar.

### Rotas a criar

```text
/preview              → índice com cards linkando para cada preview + diff curto
/preview/home         → cópia de src/routes/index.tsx com a Fase 1 aplicada
                        (nova headline cidadão, novos CTAs, novo título/tagline
                         advogado, "modelos de petição" removido)
/preview/jornadas     → seção de jornadas reordenada (1.Moro fora · 2.Voltei
                        · 3.Trabalho temp · 4.bloco CTA Marcos abaixo)
/preview/jornadas/moro-fora        → jornada existente + bloco "Prova de Vida"
                                     (5 modalidades, tabela-resumo, alertas
                                     de prazo/bloqueio)
/preview/jornadas/voltei-para-o-brasil → jornada existente + bloco
                                         "Planejamento da Totalização"
                                         (CDT × CDSP, 4 etapas, cenários,
                                         erros comuns, fluxo)
/preview/guias                     → listagem + novo card 05 Saída Fiscal
/preview/guias/saida-definitiva-do-pais → página nova adaptada do .tsx
                                          do Marcos (Tanstack Router, design
                                          tokens do projeto, sem hex hardcoded)
/preview/profissional              → /profissional sem menção a "modelos de
                                     petição" + nova descrição
```

### Como o usuário compara

No `/preview` (índice) cada card mostra:
- print/preview da versão atual (link para a rota real)
- preview da versão proposta (link para `/preview/...`)
- bullet curto do que mudou (ex.: "headline reescrita + 3 CTAs novos + Blog")

Também adiciono um **banner fixo discreto** no topo de qualquer rota `/preview/*` dizendo "🧪 Pré-visualização — versão proposta, ainda não publicada" com botão "voltar para o site atual".

### Componentes reutilizados vs novos

- **Reuso**: `SiteHeader`, `SiteFooter`, `CTAMarcos`, `CTAButton`, tokens em `src/styles.css`. Zero duplicação de header/footer.
- **Novos componentes** (em `src/components/preview/`): `PreviewBanner`, `ProvaDeVidaBlock`, `PlanejamentoTotalizacaoBlock`. Servem só dentro de `/preview/*` por enquanto; quando o Marcos aprovar, a gente move para `src/components/` e wire-a nas rotas de produção.

### Regras inegociáveis aplicadas no preview

- **noindex,nofollow** em todas as rotas `/preview/*` (não polui SEO).
- **Tokens semânticos** (`oklch`) — sem hex direto vindo dos HTMLs do Marcos.
- **Tanstack Router** (`@tanstack/react-router`), nada de `react-router-dom` apesar do arquivo do Marcos usar.
- **Brand**: "Acordo Internacional / AtlasPrev". Dr. Marcos é especialista, não marca.
- **Calculadora pública** continua aberta; o CTA pós-resultado continua sendo `CTAMarcos` → `/contato` (já corrigido em rodada anterior). Não mexo.
- **Hub pago** continua atrás de `_authenticated` + assinatura.

### Fora do escopo desta rodada

- Promover o preview para produção (faço só quando ele validar).
- Reescrever `src/data/jornadas.ts` (no preview, monto o conteúdo localmente).
- Blog: o Marcos pede CTA `[Blog] → /blog`. Vou usar o link, mas se a rota não existir no preview o botão fica desabilitado com tooltip "Rota a definir" — sinalizo para validar com ele.
- Página `/sobre` (ele cita `/sobre`, projeto tem `/sobre/dr-marcos`): no preview aponto para o que existe (`/sobre/dr-marcos`) e anoto a dúvida no índice `/preview`.

### Documentação obrigatória

Atualizo na mesma rodada: `.lovable/prd.md`, `ROADMAP.md` (registrando "Sandbox /preview do briefing do Marcos — 25/mai/2026, aguardando aprovação para promover").

---

## Detalhes técnicos (para o dev)

- Rotas TanStack: `src/routes/preview.tsx` (layout com `<Outlet />` + `PreviewBanner`), `src/routes/preview.index.tsx`, `src/routes/preview.home.tsx`, `src/routes/preview.jornadas.tsx`, `src/routes/preview.jornadas.$jornada.tsx`, `src/routes/preview.guias.tsx`, `src/routes/preview.guias.saida-definitiva-do-pais.tsx`, `src/routes/preview.profissional.tsx`. Cada route file define `head()` com `robots: noindex,nofollow`.
- Sem alteração em `src/routes/index.tsx`, `jornadas.*`, `guias.*`, `profissional.tsx`, `site-header.tsx`, `site-footer.tsx`, `data/jornadas.ts`, `data/guias.ts`. Aspiro a *zero linhas modificadas* fora de `src/routes/preview.*`, `src/components/preview/*`, `.lovable/prd.md`, `ROADMAP.md`.
- Adaptação do `guias.saida-definitiva-do-pais.tsx`: substituir `import { Link } from "react-router-dom"` por `import { Link } from "@tanstack/react-router"` e trocar `<Link to="...">` mantendo tipagem; sem hex (`#1a1a2e`, etc.) — usar `text-foreground`, `bg-secondary`, `var(--accent-ink)` que já existem no `src/styles.css`.
- `PreviewBanner` é client-only (sticky no topo, fora do `SiteHeader`, com close opcional via state local — sem persistir).

## Validação

- `/preview` lista todos os comparativos e abre em nova aba.
- Visitar `/` em janela anônima mostra exatamente o que está hoje em produção (nada quebrou).
- `view-source:/preview/home` contém `<meta name="robots" content="noindex,nofollow">`.
- Build passa sem erro de tipo no Tanstack Router (todas as rotas `/preview/*` resolvíveis).
- Banner "🧪 Pré-visualização" aparece em toda rota `/preview/*` e não aparece em rota normal.
