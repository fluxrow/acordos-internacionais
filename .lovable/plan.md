
## Diagnóstico

Inconsistência: site mostra **21 vigentes + 3 em ratificação = 24**, mas o catálogo tem **25 acordos**. A Bulgária está como `status: "incompleto"` e some das contagens. Correção factual: o acordo Brasil–Bulgária entrou em vigor em 2024 — deve ser `vigente`.

Resultado esperado:
- **22 vigentes** (21 atuais + Bulgária)
- **3 em ratificação** (Cabo Verde, Israel, CPLP) — sem mudança
- **0 incompletos**
- **25 acordos mapeados** — sem mudança

## Mudanças

### 1. `src/data/acordos.ts` — entrada `bulgaria`
- `status: "incompleto"` → `status: "vigente"`
- Adicionar `vigencia: "2024"`
- Reescrever `resumo` para refletir acordo em vigor (remover "Documentação ainda em organização")
- Ajustar `docs` se houver documentos catalogados (ou manter 1 se for o que está no bucket)

Os agregados em `acordos.ts` (`totalVigentes`, `totalIncompletos`, `totalBilateraisVigentes`) e em `site-stats.ts` são derivados — recalculam sozinhos.

### 2. Varredura de números hard-coded
Rodar `rg -n "\b21\b|incompleto|em ratifica" src/routes src/components` e trocar qualquer literal por referência a `siteStats`:
- `src/routes/index.tsx`
- `src/routes/acordos.index.tsx`
- `src/routes/precos.tsx`
- `src/routes/profissional.tsx`
- `src/routes/guias.index.tsx`
- e qualquer copy/CTA que diga "21 países em vigor", "3 em ratificação", "incompletos"

Regra: contadores **sempre** vêm de `siteStats`, nunca hard-coded.

### 3. Filtros e badges
- `src/routes/acordos.index.tsx`: se o filtro/listagem tem uma seção "Incompletos", removê-la (vai ficar vazia) ou mantê-la condicionalmente baseada em `siteStats.acordosIncompletos > 0`.
- Verificar `src/components/hub/country-card.tsx` e badges no card da Bulgária — deve mostrar "Vigente" agora.

### 4. Documentação (regra do projeto)
- `.lovable/prd.md`: atualizar menções aos contadores.
- `ROADMAP.md`: registrar a correção factual (Bulgária em vigor desde 2024).

## QA (verificação visual)

1. `rg -n "\b21\b" src/routes src/components` antes/depois — sem literais sobrando.
2. Preview `/acordos`: contador mostra **22 vigentes** e **3 em ratificação**. Card da Bulgária com badge "Vigente".
3. Preview `/` (home): hero/stats refletem 22.
4. `/acordos/bulgaria`: página abre sem alerta de "incompleto".
5. Typecheck rodado pelo harness sem erros.

## Fora de escopo

Sem mudança visual, de layout ou de outras informações de países. Só status da Bulgária e textos derivados de contadores.
