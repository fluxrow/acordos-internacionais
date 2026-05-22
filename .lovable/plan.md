## Verificação: aba Guias

Naveguei pelas duas rotas e ambas já estão com a UI editorial aplicada:

- **`/guias` (índice)** — hero com radial wash, breadcrumb, eyebrow com filete vinho, `font-display`, grid 2 colunas de cards numerados (01–04), bloco "Outros caminhos" (Jornadas/Acordos/Calculadora). ✅
- **`/guias/$slug` (detalhe — testado em `/guias/totalizacao`)** — hero editorial, blocos numerados (01/02/03) em grid 2 colunas com TOC sticky, card "Atendimento direto" do Marcos, bloco "Relacionado · Use este guia em contexto" (jornadas + calculadora invertida), "Outros guias" em lista vertical numerada, CTA Marcos full-width. ✅

**Conclusão:** a UI da aba Guias está 100% aplicada. Não há trabalho de refino editorial pendente nas duas rotas.

## Problema encontrado fora do escopo declarado

Ao testar um slug inválido (`/guias/totalizacao-de-periodos-contributivos`), o **404 renderiza com header e footer duplicados** (print mostra dois `SiteHeader` e dois `SiteFooter` empilhados).

Causa: `src/routes/__root.tsx` já envolve o `<Outlet />` com `<SiteHeader/>` + `<SiteFooter/>` no `RootComponent`, mas o `NotFoundComponent` (linha 15) e o `ErrorComponent` (linha 39) também renderizam seus próprios `<SiteHeader/>` e `<SiteFooter/>`, causando duplicação.

## Plano

Mudança cirúrgica de apresentação em `src/routes/__root.tsx`:

1. Remover `<SiteHeader />` e `<SiteFooter />` de dentro de `NotFoundComponent` (linhas 18 e 34), mantendo apenas o miolo da página 404 (eyebrow "Erro 404", título, descrição e botão "Voltar para o início"). Ajustar o wrapper para um container que ocupe a altura disponível dentro do `<main>` do root (`min-h-[60vh] flex items-center justify-center` em vez de `min-h-screen flex flex-col`).
2. Aplicar exatamente a mesma limpeza ao `ErrorComponent` (linhas 45 e 72).
3. Não tocar em `RootComponent`, no shell HTML, nem em qualquer outro arquivo.

### Validação
- Recarregar `/guias/slug-invalido` e confirmar **um** header + **um** footer + bloco 404 centralizado.
- Recarregar `/guias` e `/guias/totalizacao` e confirmar que continuam idênticos ao estado atual (já validado por screenshot).

Nenhuma mudança de lógica, dados, rotas ou tokens de design. Sem atualização de `prd.md`/`ROADMAP.md` (correção de bug pontual, não nova fase).