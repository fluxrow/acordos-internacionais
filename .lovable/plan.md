# Plano — Substituir texto do Acordo Brasil–Canadá

## Objetivo
Atualizar `src/data/acordos-textos/canada.ts` (campo `acordo`) com o conteúdo formatado do `Acordo_formatado.docx`, preservando a estrutura hierárquica (títulos, subtítulos, listas) que o componente `TextoIntegralAcordo` já renderiza dentro de `<pre>` com `whitespace-pre-wrap`.

Escopo limitado ao Canadá. Nada de mudar template global, componente de renderização ou outros países.

## Alterações

### 1. `src/data/acordos-textos/canada.ts`
- Substituir a string `acordo` pelo conteúdo do .docx, reorganizado nas seguintes seções (na ordem do documento):
  1. Cabeçalho (Decreto nº 8.288/2014 + considerandos + Art. 1º)
  2. **FUNDAMENTAÇÃO LEGAL DO ACORDO BRASIL–CANADÁ** (6 bullets)
  3. **OBJETIVOS DO ACORDO** (4 itens numerados)
  4. **O QUE É ACORDO INTERNACIONAL DE PREVIDÊNCIA SOCIAL**
  5. **ORGANISMOS DE LIGAÇÃO** (Brasil: APSAIBR)
  6. **TOTALIZAÇÃO DOS PERÍODOS DE CONTRIBUIÇÃO** + exemplo País A/B
  7. **BENEFÍCIOS PREVISTOS NO ACORDO** → 8.1 No Brasil (RGPS/RPPS: idade, invalidez, pensão por morte) → 8.2 No Canadá (Lei da Proteção Social do Idoso, Plano de Pensão do Canadá)
  8. **APOSENTADORIA POR IDADE NO BRASIL** (65/60 anos, carência 180 meses, 70%+1%)
  9. **APOSENTADORIA POR INVALIDEZ NO BRASIL** (perícia, carência 12 contribuições, 100%)
  10. **PENSÃO POR MORTE NO BRASIL** (a/b/c)
  11. **CERTIFICADO DE DESLOCAMENTO TEMPORÁRIO** (60 meses)
  12. **REGRAS PARA DETERMINAR A LEGISLAÇÃO APLICÁVEL** (3 itens)
  13. **ONDE REQUERER OS BENEFÍCIOS PREVIDENCIÁRIOS** → Residentes no Brasil (APS + APSAIBR W3 Sul, telefones, e-mail `apsai23001140@inss.gov.br`) → Residentes no exterior
- Manter o formato de string com `\r\n`, separadores `---` entre seções e bullets com `•`/letras (mesmo padrão atual do arquivo) para continuar legível no `<pre>` do `TextoIntegralAcordo`.
- Remover o comentário `// AUTO-GENERATED` no topo (esse arquivo passa a ser fonte de verdade manual, já que estamos sobrescrevendo a geração).
- **Não alterar** `ajuste` — o texto do Ajuste Administrativo continua como está.

### 2. `scripts/import-acordos.ts`
- Adicionar `"canada"` a uma lista de slugs preservados (skip overwrite) para que uma futura reimportação não desfaça a edição manual, seguindo o mesmo padrão de override já usado para `instrumento`.

### 3. Documentação (regra Core do projeto)
- `.lovable/prd.md`: nota curta "Texto integral do Acordo Brasil–Canadá reescrito a partir do material oficial formatado".
- `ROADMAP.md`: mesma nota na seção corrente.

## Fora de escopo
- Não mexer em `TextoIntegralAcordo` (renderização atual já serve).
- Não tocar nos textos dos outros 24 acordos.
- Não alterar páginas `/acordos/canada` nem `/hub/canada` — elas leem do mesmo arquivo automaticamente.
- Sem mudança de schema, RLS ou rotas.

## Arquivos alterados
- `src/data/acordos-textos/canada.ts`
- `scripts/import-acordos.ts`
- `.lovable/prd.md`
- `ROADMAP.md`
