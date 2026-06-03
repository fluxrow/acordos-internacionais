
## Diagnóstico

Pasta `bulgaria/` no repo `marcosespinola1379/Mapa-de-Acordos` ganhou um novo PDF: `D12498_Bulgaria.pdf` (Decreto 12.498/2025, que promulgou o acordo). Nosso dataset está defasado em três pontos:

1. **Decreto e vigência genéricos** (`"Conferir ato de promulgação"` / `"Conforme Art. 29 do Acordo"`).
2. **Lista de benefícios incompleta** — falta `Aposentadoria por invalidez` (Brasil) e `Pensão de sobreviventes` (Bulgária).
3. **Catálogo de documentos** lista só 1 PDF; agora são 2.

## Mudanças

### 1. Upload do novo PDF ao bucket `hub-docs` (Lovable Cloud)
- Baixar `https://raw.githubusercontent.com/marcosespinola1379/Mapa-de-Acordos/main/bulgaria/D12498_Bulgaria.pdf`.
- Subir como `bulgaria/decreto-12498-2025-promulgacao-bulgaria.pdf` (padrão de nomes kebab-case usado no bucket) via `supabase--storage_upload`.

### 2. `src/data/acordos.generated.ts` — bloco `"bulgaria"`
- `decreto`: `"Decreto 12.498/2025"`
- `vigorDesde`: `"01/12/2024"`
- `docsInfo`: `"2 documentos disponíveis"`
- `beneficios.brasil`: adicionar `"Aposentadoria por invalidez"`
- `beneficios.parceiro`: adicionar `"Pensão de sobreviventes"`
- `documentos[]`: adicionar segunda entrada
  ```ts
  {
    nome: "Decreto 12.498/2025 — Promulgação",
    desc: "Decreto que promulga o acordo Brasil-Bulgária e fixa entrada em vigor em 01/12/2024",
    cat: "principal",
    arquivo: "decreto-12498-2025-promulgacao-bulgaria.pdf",
    tamanho: "211 KB"
  }
  ```
- Atualizar `acordoTrecho` não é necessário (já tem trecho representativo).

Nota: `acordos.generated.ts` é marcado como AUTO-GENERATED, mas o ROADMAP mostra que já foi editado manualmente em rodadas anteriores quando o sync script não cobre o caso. A próxima execução de `bun scripts/reconcile-hub-docs.ts` vai preservar os campos válidos (re-casa por tokens do nome) — registramos isso na nota do ROADMAP.

### 3. `src/data/acordos.ts` — entrada `bulgaria`
- `docs: 1` → `docs: 2`
- Manter `status: "vigente"`, `vigencia: "2024"` (já aplicado).

### 4. `src/data/acordo-tooltips.ts` (opcional, baixo custo)
- Como agora temos 3 benefícios em cada lado, adicionar `bulgaria` ao mapa com nota curta no benefício "Pensão de sobreviventes" (equivalente da pensão por morte na legislação búlgara). Pular se ficar mais comprido que valor — só se couber em 1 linha por benefício.

### 5. Documentação
- `ROADMAP.md`: adicionar entrada na seção "Correção factual — Bulgária" (já criada na rodada anterior) listando o upload e o enriquecimento de metadados.
- `.lovable/prd.md`: anexar uma linha curta sob a entrada da Bulgária descrevendo "Decreto 12.498/2025 promulgou; vigor 01/12/2024".

## QA (verificação)

1. `bun scripts/reconcile-hub-docs.ts --dry-run` (se existir) ou `rg -n "bulgaria" src/data/acordos.generated.ts` — conferir que o novo `arquivo` está presente.
2. Preview `/acordos/bulgaria`: lista mostra 2 documentos, ambos com botão de download funcional (não 404).
3. Página mostra Decreto 12.498/2025 e "vigor desde 01/12/2024" no header do acordo.
4. Listagem de benefícios mostra 3 itens em cada lado.
5. Typecheck rodado pelo harness sem erros.

## Fora de escopo

Sem mudança visual, sem rever outros países. Só Bulgária.
