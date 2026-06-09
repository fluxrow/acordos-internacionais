## Diagnóstico

O badge "Em curadoria" no `/hub` é decidido em `src/components/hub/country-card.tsx` apenas por:

```ts
emCuradoria: docs === 0  // docs = documentos[] com `arquivo` em acordos.generated.ts
```

Rodando contra `src/data/acordos.generated.ts`:

- **Suíça** → ausente do generated. O `scripts/import-acordos.ts` lista 24 países e esqueceu a Suíça, embora `acordo-suica.html` exista no repo `marcosespinola1379/Mapa-de-Acordos` (HTTP 200 confirmado).
- **Bélgica** → presente no generated, com trecho do acordo, órgãos BR/parceiro e texto integral, mas `documentos: []`. O HTML existe no repo; o parser não extraiu a lista de PDFs.
- **Iberoamericano** → mesmo caso da Bélgica.

Logo: não é o conteúdo que está faltando no repo — é o pipeline de importação que está desatualizado/incompleto para esses três.

## O que vou fazer

1. **Adicionar Suíça ao importador**
   - `scripts/import-acordos.ts` → incluir `{ file: "acordo-suica", slug: "suica", txtName: "Suíça" }` na lista `SOURCES`.

2. **Corrigir extração de documentos para Bélgica e Iberoamericano**
   - Baixar os HTMLs dos três (`acordo-suica`, `acordo-belgica`, `acordo-iberoamericano`) e comparar a estrutura usada para listar PDFs com a dos países que funcionam (ex.: Alemanha).
   - Ajustar o parser de `documentos` em `scripts/import-acordos.ts` para reconhecer a variação de markup que esses HTMLs usam (provavelmente um seletor diferente para os anexos).

3. **Regenerar dados**
   - Rodar `bun scripts/import-acordos.ts` para reescrever `src/data/acordos.generated.ts` com Suíça incluída e Bélgica/Iberoamericano com `documentos[]` preenchido.

4. **Catálogo curado (`src/data/acordos.ts`)**
   - Conferir/ajustar o card da Suíça (hoje declara `docs: 10`) e Bélgica (`docs: 13`) — a contagem real vem do generated automaticamente (`if (imp.documentos?.length) a.docs = imp.documentos.length`), então basta garantir que o slug "suica" exista no catálogo (já existe).

5. **Sincronização de PDFs no bucket `hub-docs`** (opcional, só se PDFs vierem com link no HTML)
   - Rodar `bun scripts/sync-hub-docs.ts` para subir os arquivos novos e depois `bun scripts/check-hub-docs.ts` para validar.

6. **Validação visual**
   - Abrir `/hub` e confirmar que Suíça, Bélgica e Iberoamericano não trazem mais o badge "Em curadoria" e que os filtros "Com material" / "Em curadoria" continuam coerentes.

7. **Atualizar PRD/Roadmap** conforme regra do projeto:
   - `.lovable/prd.md` e `ROADMAP.md`: registrar o fix de cobertura (Suíça adicionada ao pipeline; parser de documentos generalizado).

## Fora de escopo

- Não vou mexer na regra do badge em `country-card.tsx` — ela continua válida; o que estava errado eram os dados.
- Não vou alterar o conteúdo editorial expandido (`conteudoExpandido`) desses países nesta rodada.
