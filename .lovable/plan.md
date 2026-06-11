# Corrigir mojibake nos textos de acordos

## Problema (confirmado por QA)

Amostrei Canadá, Portugal e Itália comparando `.docx` original do GitHub com `src/data/acordos-textos/*.ts`. Resultado:

- Todo caractere acentuado foi corrompido. Ex.: `República` → `blica`, `aplicação` → `aplicaã`, `Canadá` → `canadã`, `benefício` → `benefã`.
- Scan automático: **24 de 25 arquivos** (todos menos `iberoamericano.ts`) estão afetados.
- O texto estrutural (parágrafos, ordem das seções, valores numéricos) está correto — só o encoding quebrou.

Causa raiz: `scripts/import-acordos-revisados.ts` da rodada anterior passou o buffer do `.docx` ao `mammoth` em modo `latin1`/`binary` em vez de buffer puro, gerando UTF‑8 duplo-decodificado.

## Plano de correção

1. **Auditar `scripts/import-acordos-revisados.ts`** e corrigir a leitura: usar `fs.readFileSync(path)` (Buffer puro) e `mammoth.extractRawText({ buffer })`. Garantir que o `writeFileSync` do `.ts` use UTF‑8 explícito.
2. **Re‑rodar o script** para os 25 países, baixando novamente os 44 `.docx` do repositório `marcosespinola1379/Mapa-de-Acordos/Acordos e Ajustes Revisados`.
3. **Sobrescrever** os 24 arquivos afetados em `src/data/acordos-textos/` (mais `iberoamericano.ts` se a re-extração trouxer mudanças). Formato preservado: `export const acordo = "..."; export const ajuste = "...";` com `\n` literais.
4. **Validar pós‑import** com o mesmo script de QA (cobertura por tokens entre `.docx` e `.ts`): zero tokens contendo `ã` órfão e zero tokens só presentes no `.docx` por motivo de encoding. Cabeçalhos como "República Federativa do Brasil e Canadá" devem aparecer intactos.
5. **Atualizar `.lovable/prd.md` e `ROADMAP.md`** com nota curta sobre a correção de encoding (mesma rodada — regra Core de memória).

## Fora de escopo

- Continuar o trabalho de blog + cron (já pendente de outras decisões — fica para a próxima rodada).
- Mudanças visuais ou estruturais nas páginas de acordo (só substituição de string).
- `iberoamericano.ts` só será tocado se a re‑extração mudar bytes.

## Riscos

- Países que tinham edições manuais pós‑import seriam sobrescritos. Pelo histórico, todas as 25 strings vieram do mesmo script — então sobrescrever é seguro.
- Repositório GitHub é público e estável; download via `raw.githubusercontent.com` já foi validado nesta QA.
