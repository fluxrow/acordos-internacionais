## Diagnóstico

Comparei o repositório `marcosespinola1379/Mapa-de-Acordos` com o estado atual do Hub (bucket `hub-docs` + `src/data/acordos.generated.ts`):


| País                        | Repo              | Bucket hoje | Catálogo `docs:` | Status        |
| --------------------------- | ----------------- | ----------- | ---------------- | ------------- |
| **cabo-verde**              | 2 PDFs            | **0**       | 2                | faltando 100% |
| **franca**                  | 16 docs (PDF+DOC) | **0**       | 16               | faltando 100% |
| **iberoamericano**          | 9 PDFs            | **0**       | 6                | faltando 100% |
| bulgaria                    | 1                 | 1           | 1                | ok            |
| israel                      | 1 (raiz)          | 1           | 1                | ok            |
| cplp                        | 1 (raiz)          | 1           | 1                | ok            |
| austria, luxemburgo, demais | aliados           | aliados     | ok               | ok            |


**Causa raiz:** `scripts/sync-hub-docs.ts` tem um `FOLDER_TO_SLUG` que **não inclui** `cabo-verde`, `franca` e `iberoamericano`. Por isso o sync nunca subiu esses arquivos. O `acordos.generated.ts` tem metadados curados (órgãos, benefícios, trecho do acordo), mas os documentos ficaram com `arquivo: ""` — então no Hub aparecem sem link de download.

## Plano

### 1. Corrigir `scripts/sync-hub-docs.ts`

Adicionar ao `FOLDER_TO_SLUG`:

```ts
"cabo-verde": "cabo-verde",
franca: "franca",
iberoamericano: "iberoamericano",
```

### 2. Rodar o sync (precisa de `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` no ambiente)

```bash
bun scripts/sync-hub-docs.ts --pais cabo-verde
bun scripts/sync-hub-docs.ts --pais franca
bun scripts/sync-hub-docs.ts --pais iberoamericano
```

Resultado esperado: 2 + 16 + 9 = **27 arquivos** novos no bucket `hub-docs`.

### 3. Re-gerar `src/data/acordos.generated.ts`

```bash
bun scripts/reconcile-hub-docs.ts
```

O reconcile faz match fuzzy entre os arquivos do bucket e as entradas existentes em `acordos.generated.ts`, preenchendo `arquivo` + `tamanho`. Arquivos sem match viram entradas novas (cat `outro`/`formulario`/etc.).

### 4. Ajustar contagens em `src/data/acordos.ts`

Recalcular `docs:` para os 3 países depois do reconcile. Provável resultado:

- cabo-verde: 2 (mantém)
- franca: 16 (mantém)
- iberoamericano: 6 → **9** (atualizar)

Se cabo-verde ainda estiver com status `ratificacao` mas agora tem texto integral disponível, manter status como está — não foi pedido para reavaliar status, só completar dados.

### 5. Atualizar `.lovable/prd.md` e `ROADMAP.md`

Registrar que Cabo Verde, França e Ibero-Americano passaram a ter documentos servíveis no Hub.

## Fora de escopo

- Não mexer em status (`ratificacao` / `incompleto` / `vigente`) sem pedido explícito.
- Não tocar nos demais países que já estão alinhados.
- Não alterar conteúdo editorial (`conteudoExpandido`).

## Pré-requisito (precisa do usuário)

O passo 2 roda contra o Supabase com a **service role key**. Posso rodar no sandbox se os env vars `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estiverem disponíveis (checo com `compgen -e` antes). Se não estiverem, preparo as alterações do código (passos 1, 4 e 5) e você roda o sync localmente.

## Quer que eu inclua também?

- **Israel** e **CPLP** hoje têm só 1 PDF (o texto do acordo). O repo não tem mais documentos para esses — sem ação possível agora.
- **Bulgária** tem só o acordo (status `incompleto`). Idem — nada novo no repo.  
  
pode incluir também.