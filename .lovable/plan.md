## Objetivo

Adicionar suíte de testes para travar as regras de negócio das três funções centrais (`calcularTriagem`, `calcularResultado`, `parsearCNIS`), evitando regressões em piso do salário mínimo, pro-rata e filtros de competências do CNIS.

## Stack de testes

- **Vitest** (alinhado com Vite 7 do projeto) + `@vitest/coverage-v8`.
- Ambiente `node` (funções puras, sem DOM).
- Script `test` no `package.json`: `vitest run` e `test:watch`: `vitest`.
- Config mínima em `vitest.config.ts` com alias `@` apontando para `src/`.

## Arquivos a criar

```
vitest.config.ts
src/lib/__tests__/calculadora.test.ts
src/lib/__tests__/calculadora-resultado.test.ts
src/lib/__tests__/cnis-parser.test.ts
src/lib/__tests__/fixtures/cnis-sample.txt
src/lib/__tests__/fixtures/cnis-pre-1994.txt
```

## Cobertura de testes

### 1. `calcularTriagem` — triagem comercial (sem valores)

- **BR_SOLO**: `tempoBrasilMeses ≥ carencia` → retorna caso `BR_SOLO`, ignora país.
- **INSUFICIENTE**: Brasil + país < carência → retorna `mesesFaltantes` correto.
- **AGUARDA_IDADE**: aposentadoria por idade, carência somada OK, idade < mínima (62 F / 65 M) → retorna `mesesParaIdadeMin > 0`.
- **TOTALIZACAO_OK**: idade suficiente + tempo somado suficiente, Brasil sozinho não basta.
- **Pensão por morte** ignora idade mesmo com idade baixa (não cai em AGUARDA_IDADE).
- Garante que `ResultadoTriagem` NÃO contém chaves `sb`, `rmi`, `coeficiente`, `prestacaoTeorica` (regra: triagem é sem valores).

### 2. `calcularResultado` — cálculo técnico (Pro)

Foco em **piso**, **pro-rata** e **ordem da aplicação**:

- **Caso 1 (BR solo)**: Brasil cumpre carência → `rmiTeorica = max(SB×coef, SMmin)`; sem `indiceProrata` nem `rmiProrata`.
- **Caso 2 (insuficiente)**: tempo total < carência → `mesesFaltantes` correto; sem campos monetários.
- **Caso 2B (aguarda idade)**: carência ok, idade pendente → `indiceProrata = tBR/tTotal`, `rmiProrata` projetada usando prestação COM piso.
- **Caso 3 com SB informado**:
  - **Piso aplica ANTES do pro-rata**: `prestacaoTeorica = max(SB×coef, SMmin)`, depois `rmiProrata = prestacaoTeorica × tBR/tTotal`. Cenário: SB baixo que ativa piso → conferir que `rmiProrata = SMmin × indice` (e não `SB×coef×indice`).
  - **Pro-rata não tem piso pós-aplicação**: cenário em que `rmiProrata < SMmin` deve ser retornado como tal (sem re-piso).
  - `indiceProrata = tBR/(tBR+tPais)` com precisão.
- **Caso 3 sem SB**: retorna coeficiente mas sem `sb`/`rmiProrata` e com descrição pedindo o SB.
- **Coeficiente da aposentadoria por idade**: 0.70 + 0.01 × anos, capped em 1.0.
- **Pensão por morte**: coeficiente fixo 1.0 independente do tempo.

### 3. `parsearCNIS` — extração e filtros

Usando texto sintético em fixtures (não PDF):

- **Extração de nome/CPF/data de nascimento** com layout padrão.
- **Soma de períodos** via pares `dd/mm/aaaa dd/mm/aaaa`, descartando intervalos negativos ou > 600 meses.
- **Filtro ≥ 07/1994 (Plano Real)**: linha com competência `06/1994` + valor é DESCARTADA; competência `07/1994` é incluída.
- **Filtro de valores absurdos** (`< 100` ou `> 50000`) descartados.
- **Média dos 80% maiores SC**: dada uma lista conhecida, validar que o quintil inferior é descartado e a média bate com cálculo manual.
- **Fallback sem competência casada**: texto só com valores em `R$` → usa fallback global, ainda aplica filtros de range.
- **CNIS vazio / sem dados**: retorna zeros e strings vazias sem lançar erro.
- **Limite de amostra 600**: lista com 800 valores → considera somente 600.

## Detalhes técnicos

- `vitest.config.ts` simples:
  ```ts
  import { defineConfig } from 'vitest/config'
  import path from 'path'
  export default defineConfig({
    test: { environment: 'node', include: ['src/**/*.test.ts'] },
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  })
  ```
- Datas de nascimento dependentes de "hoje" (`calcIdade`, `mesesParaIdade`): usar `vi.setSystemTime(new Date('2026-05-29'))` em `beforeEach` para tornar os testes determinísticos.
- Sem mocks de Supabase nem de PDF.js — `parsearCNIS` recebe `string` pronta, e as fixtures simulam o texto que o `pdfjs-dist` produziria.
- Não tocar em `calculadora-form.tsx`, `calculadora-form-pro.tsx`, nem em rotas — somente lógica pura.

## Documentação

- `ROADMAP.md`: marcar "Suíte de testes das regras de cálculo" como concluída.
- `.lovable/prd.md`: nota curta de que as regras (piso → pro-rata, filtro 07/1994, 80% maiores) estão cobertas por Vitest.

## Fora de escopo

- Testes de componentes React / formulários.
- Testes E2E.
- Mock de `pdfjs-dist` (apenas o texto extraído é testado).
- CI/pipeline — apenas script local `bun run test`.