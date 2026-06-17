## Contexto

Atualmente, a seção **"Órgãos de Ligação"** (instituição, endereço, telefone, e-mail dos órgãos do Brasil e do país parceiro) aparece na página pública de cada país em `src/routes/acordos.$pais.tsx`, dentro do bloco `#orgaos`.

No HUB fechado (`src/routes/_authenticated/hub.$pais.tsx`), os dados já são entregues pelo server function (`orgaoBR` e `orgaoParceiro` em `HubDataUnlocked`) e o componente `OrgaoCard` já existe — mas **não é renderizado em nenhuma aba**. Ou seja: o dado chega no hub, só falta exibir.

## Mudanças

### 1. Remover do público — `src/routes/acordos.$pais.tsx`
- Remover o bloco `{/* ÓRGÃOS DE LIGAÇÃO */}` (linhas ~403–417) que renderiza `<Bloco id="orgaos">...<OrgaosLigacaoBloco />`.
- Remover a entrada `"orgaos"` do array `tocBlocos` (índice lateral).
- Remover o componente `OrgaosLigacaoBloco`, o componente auxiliar `OrgaoCard` e os imports não usados depois disso (`Mail`, `Phone`, `MapPin`, `Building2`, tipo `OrgaoLigacao`, `Popover*`, `findTooltipFor`, `NOTA_REMISSAO_BILATERAIS` — somente os que ficarem órfãos; vou conferir antes de apagar cada um).
- Atualizar o bullet correspondente em `<ProContentLock>` para deixar claro que "Órgãos de ligação (contatos completos)" é benefício do hub.

### 2. Adicionar no HUB — `src/routes/_authenticated/hub.$pais.tsx`
- Em `VisaoTab`, acrescentar uma seção **"Órgãos de Ligação"** logo após "Benefícios cobertos", renderizando o `OrgaoCard` já existente para `data.orgaoBR` (lado Brasil) e `data.orgaoParceiro` (lado país parceiro). A seção só aparece se existir pelo menos um dos dois.
- Nenhuma mudança em `hub.functions.ts` — o payload já carrega os dois campos.

### 3. Escopo
Vale para **todos os países** automaticamente: a renderização é guiada pelos dados em `acordosImportados`, então qualquer país que tenha `orgaoBR`/`orgaoParceiro` passa a exibir só no hub.

## Fora de escopo
- Nenhuma alteração nos dados (`src/data/acordos.generated.ts`, JSONs de origem).
- Nenhuma alteração em rotas/RLS/backend.
- A nav lateral "Próximos passos" e o restante do conteúdo público permanecem iguais.
