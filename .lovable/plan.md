## Objetivo

Aumentar a precisão da extração de **competência** e **salário de contribuição** no parser CNIS quando o layout do PDF varia (Meu INSS web, Dataprev impressão, CNIS exportado por advogado, OCR), preservando o filtro a partir de **07/1994** e a média dos 80% maiores.

## Diagnóstico do parser atual

`src/lib/cnis-parser.ts` tem três pontos frágeis:

1. **Filtro por ano apenas** — `extrairAnoCompetencia` devolve só o ano, então `06/1994` passa pelo filtro. A regra correta é "competência ≥ 07/1994".
2. **Pareamento competência↔valor linha-a-linha** — quando o `pdfjs-dist` quebra a tabela em linhas separadas (competência numa linha, salário em outra), nada casa e o parser cai no fallback global que perde precisão.
3. **Confusão com outros valores monetários** — "Indicadores", "Remuneração consolidada", "Total" e datas de pagamento podem ser capturados como SC. Hoje o filtro é só de range [100, 50000].

## Mudanças no parser (`src/lib/cnis-parser.ts`)

### 1. Competência como `mm/aaaa` (não apenas ano)

Substituir `extrairAnoCompetencia` por `extrairCompetencia(linha) → { ano, mes } | null` aceitando:
- `mm/aaaa` (Meu INSS): `07/1994`
- `aaaa-mm` (export Dataprev): `1994-07`
- `aaaa/mm`
- Nome do mês em PT: `jul/1994`, `Julho/1994`, `JUL 1994` (tabela de mês → número)

Filtro passa a ser `(ano > 1994) || (ano === 1994 && mes >= 7)`. Trava o teste atual de "06/1994 descarta" sem regressar nos casos já cobertos.

### 2. Pareamento robusto competência↔valor (multi-estratégia)

Nova função `extrairCompetenciasESalarios(texto)` com 3 estratégias em cascata. A primeira que casar ≥ 12 pares vence:

- **A. Linha única** (layout atual): competência + valor na mesma linha. Mantém comportamento de hoje.
- **B. Tabela colunar** (layout Meu INSS PDF): varre janelas de N linhas consecutivas; se houver uma sequência de competências `mm/aaaa` seguida de uma sequência igual de valores monetários, pareia por índice.
- **C. Token-stream** (PDFs sem quebras claras): tokeniza o texto inteiro em `[COMPETENCIA, VALOR, COMPETENCIA, VALOR, ...]` ignorando ruído, com janela máxima de N tokens entre competência e próximo valor (default 3) para garantir adjacência.

Cada estratégia retorna `Array<{ ano: number; mes: number; valor: number }>`. O caller aplica o filtro ≥ 07/1994 + range [100, 50000].

### 3. Filtros para evitar falsos positivos de valor

Antes de aceitar um valor como SC:

- Descartar linhas cujo contexto contenha palavras-chave de "não-SC": `Indicadores`, `Total`, `Consolidad`, `13º`, `Décimo`, `Devido`, `Pago em`, `Vencimento`, `Multa`, `Juros`.
- Descartar valores que aparecem em **linhas com 2+ valores monetários sem competência** (provavelmente totais ou pagamentos).
- Manter range [100, 50000].

### 4. De-duplicação por competência

Se a mesma competência aparecer duas vezes (ex.: vínculos paralelos), **somar** os SC da competência (regra do INSS para concorrência de vínculos no mesmo mês), respeitando o teto. Como não temos o teto vigente por competência, aplicar apenas a soma e capar em 50.000 (limite atual de sanidade).

### 5. Fallback mantido

Se nenhuma das 3 estratégias retornar ≥ 1 par válido, mantém o fallback global atual (todos os valores em `R$` ou em formato `BR`, filtrados por range) — assim CNIS muito degradados (OCR ruim) ainda produzem estimativa.

### 6. Cabeçalho mais tolerante

- Nome: aceitar variações com acentos minúsculos (`Nome do Segurado:`, `NOME:`), parar em quebra de linha.
- CPF: aceitar `Nº do CPF` e `CPF/MF`.
- Data nasc: aceitar `DN:`, `Data de Nascimento:`, `Nasc.:`, `Nascido(a) em:`.

Sem mudar a assinatura de `DadosCNIS` — só melhorando a robustez dos matchers.

## Testes (novos / atualizados em `src/lib/__tests__/cnis-parser.test.ts`)

Substituir o teste "filtro por ano < 1994" pelo teste real "filtro por competência ≥ 07/1994":

- `06/1994` é descartado, `07/1994` entra.
- `aaaa-mm` e `jul/1994` reconhecidos.

Novos testes:

- **Tabela colunar**: bloco com 6 competências seguidas + 6 valores na ordem → todos pareados corretamente.
- **Token-stream**: texto sem quebras de linha com competências e valores intercalados.
- **Falsos positivos**: linha com `Total: R$ 99.000,00` (sem competência) é ignorada.
- **Dedup/concorrência de vínculos**: mesma competência aparece 2× com 1.000 e 1.500 → contabiliza 2.500 (uma entrada por competência).
- **Mês por extenso**: `Jul/1994 R$ 800,00` reconhecido como 07/1994 (entra).
- Manter os testes verdes hoje (range, 80% maiores, fallback global, CNIS vazio).

## Fora de escopo

- Correção monetária pelo INPC (já documentado como estimativa).
- Aplicar teto previdenciário por competência (precisaria tabela histórica).
- Extração de vínculos individualizados (empregador, NIT). Hoje só o agregado importa.
- Mudar a UI ou os componentes da calculadora.

## Documentação

- `ROADMAP.md` + `.lovable/prd.md`: nota da rodada de hardening do parser e do filtro corrigido para competência (não ano).