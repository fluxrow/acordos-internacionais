# Investigar e corrigir o "buraco" na grade de /acordos

## Diagnóstico

A grade renderiza os 25 acordos na **ordem do arquivo `src/data/acordos.ts`** (que está aproximadamente alfabética em português mas não 100%). Em 3 colunas (`lg:grid-cols-3`), as linhas ficam assim:

```text
r1: Alemanha    | Áustria      | Bélgica
r2: Bulgária    | Cabo Verde   | Canadá
r3: Chile       | Coreia       | Espanha
r4: EUA         | França       | Grécia
r5: Índia       | Israel       | Itália        ← visível na imagem
r6: Japão       | Luxemburgo   | Moçambique    ← visível, Moçambique "sumido"
r7: Portugal    | Quebec       | Rep. Tcheca   ← visível na imagem
r8: Suíça       | CPLP         | Mercosul
r9: Iberoamericano | (vazio)   | (vazio)
```

A célula que aparece "vazia" no print é a posição de **Moçambique**. Pelo código (`acordos.index.tsx`) e pelos dados (`acordos.ts` linhas 208–216), Moçambique tem `slug`, `nome`, `iso: "mz"`, `tipo: "bilateral"`, `resumo` — ou seja, **deveria renderizar normalmente** como os outros.

Duas hipóteses possíveis para o vazio na sua tela:

1. **Filtro/busca residual**: se houver algum texto digitado na busca (mesmo um espaço) ou um filtro ativo, Moçambique pode estar sendo excluído da lista. O contador "N resultados" no canto direito da toolbar confirma o número real exibido.
2. **Falha de render isolada do card**: improvável a partir do código atual, mas possível se a bandeira `mz` no flagcdn falhar de uma forma que quebre o layout (não vi nada no código que cause isso, mas vale blindar).

Sem ver o estado da toolbar no momento do print, a hipótese mais provável é a **(1)** — provavelmente algo digitado na busca filtrando Moçambique sem você notar.

## Plano

### 1. Confirmar a hipótese (1 ação rápida)
- Pedir para você verificar o contador "N resultados" e o input de busca no topo da página. Se o contador < 25 com filtro "Todos", a busca está filtrando.

### 2. Melhorias preventivas em `src/routes/acordos.index.tsx`
Independente da causa, vamos blindar a UX para que esse tipo de "vazio inexplicado" não volte:

- **Ordenar a lista alfabeticamente por `nome`** (locale `pt-BR`) antes de renderizar. Hoje a ordem é a do arquivo de dados, que mistura bilaterais e multilaterais e dá saltos como "Luxemburgo → Moçambique → Portugal". Ordenando, a leitura fica previsível e qualquer "buraco" salta aos olhos imediatamente.
- **Botão "Limpar"** ao lado do contador, visível só quando `busca !== ""` ou `filtro !== "todos"`. Resolve o caso de filtro esquecido em uma ação.
- **Empty state contextual**: quando `lista.length < acordos.length`, mostrar um pequeno texto "Mostrando N de 25 — limpar filtros" no contador, para deixar óbvio que há itens escondidos.

### 3. Fora de escopo
- Mudar a ordem do array em `src/data/acordos.ts` (a ordenação fica na view).
- Mudar o layout/estética dos cards (já alinhado ao Home na rodada anterior).
- Página individual `/acordos/$pais` (próximo "caminho" da auditoria).

## Detalhes técnicos

- Arquivo único: `src/routes/acordos.index.tsx`.
- Sort: `[...acordos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))` aplicado **antes** dos filtros, dentro do `useMemo`.
- Botão "Limpar" reseta `busca` e `filtro` para os estados iniciais.
- Sem novas dependências, sem novos tokens, sem mudança de dados.
