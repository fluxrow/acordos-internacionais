## Objetivo

Migrar o conteúdo dos 24 arquivos HTML do repositório `marcosespinola1379/Mapa-de-Acordos` para o projeto, transformando-os em dados estruturados que alimentam as rotas `/acordos/:pais` (e novas rotas para multilaterais). Marcar campos sensíveis como PRO para o hub pago da próxima rodada.

## Mapa do gap


| Categoria                | Repo                                | Projeto hoje | Ação                                    |
| ------------------------ | ----------------------------------- | ------------ | --------------------------------------- |
| Bilaterais com OG e rota | 21                                  | 21           | Enriquecer dados                        |
| Multilaterais            | 3 (CPLP, Ibero-Americano, Mercosul) | 0            | Criar do zero                           |
| Suíça                    | 0                                   | 1            | Manter (fonte externa, marcar pendente) |
| **Total acordos**        | **24**                              | **22**       | **→ 25 (com Suíça)**                    |


## O que entra no schema

Estender `Acordo` em `src/data/acordos.ts` com novos campos importados dos HTMLs:

```text
orgaoBR:        { instituicao, endereco, telefone, email }
orgaoParceiro:  { instituicao, endereco, telefone, email, pais }
beneficios:     { brasil: string[], parceiro: string[] }
acordo:         { decreto, dataDecreto, vigenciaDesde, textoUrl? }
ajusteAdmin:    { decreto?, dataDecreto?, textoUrl? }
documentos:     Documento[]  // ← campo principal do hub
```

Onde `Documento` é:

```text
{
  titulo,
  tipo: 'formulario' | 'modelo-peticao' | 'jurisprudencia' | 'tabela' | 'outro',
  acesso: 'publico' | 'pro',   // gate do hub
  url?: string,                 // futuro: signed URL do Storage
}
```

No MVP desta rodada, `documentos` só carrega o que está nos HTMLs (links públicos para formulários oficiais do INSS/órgãos parceiros). O upload de PDFs próprios fica para a rodada do hub pago.

## Etapas

### 1. Script de importação (one-shot, fica versionado)

`scripts/import-acordos.ts`:

- Baixa os 24 HTMLs via `fetch` direto do `raw.githubusercontent.com`.
- Parsing com `node-html-parser` (já compatível com Workers/Node).
- Mapeia repo → slugs do projeto:
  - `acordo-coreia.html` → `coreia-do-sul`
  - `acordo_belgica.html` → `belgica`
  - `acordo-iberoamericano.html` → `ibero-americano` (novo)
  - `acordo-cplp.html` → `cplp` (novo)
  - `acordo-mercosul.html` → `mercosul` (novo)
- Produz `src/data/acordos.generated.ts` com os campos extraídos.
- Loga divergências (campos vazios, países sem decreto).

Roda manualmente: `bun run import:acordos`. Não roda no CI.

### 2. Merge com dados manuais

Em `src/data/acordos.ts`, fazer merge do gerado com overrides curados (resumos editoriais, `destaque`, `curiosidade`, status final). O importado preenche os campos técnicos; o curado fica para o storytelling.

### 3. Renderização nova de `/acordos/:pais`

Reorganizar a página em seções, todas com tokens semânticos do design system:

1. **Hero** (já existe) — bandeira, nome, status, vigência.
2. **Órgãos de ligação** — dois cards lado a lado (BR + parceiro): instituição, endereço, telefone clicável, e-mail clicável.
3. **Benefícios cobertos** — duas colunas (Brasil / Parceiro) com checklist.
4. **Tabs Acordo / Ajuste Administrativo** — decreto, data, vigência, link para texto oficial.
5. **Documentos e formulários** — lista. Itens `acesso: 'publico'` clicáveis; `'pro'` mostram cadeado + CTA "Disponível no Hub Profissional" (link para `/profissional`).

Tudo em frontend/presentation: hover/focus já corrigidos, sem hard-coded colors.

### 4. Rotas novas para multilaterais

Não criar rotas separadas — reusar `/acordos/:pais` que já é dinâmico. Só adicionar `cplp`, `ibero-americano`, `mercosul` em `acordos.ts` com `tipo: 'multilateral'` e ajustar o hero para não pedir bandeira de país único (usar ícone/lista de países membros).

Atualizar índice `/acordos` para mostrar seção "Acordos multilaterais" separada dos bilaterais.

### 5. OG images para os 3 multilaterais

Rodar `scripts/build-og.sh` (já existe) com 3 entradas novas: `cplp.jpg`, `ibero-americano.jpg`, `mercosul.jpg`. Validar no `scripts/check-og.ts`.

### 6. CI

`scripts/check-brand.ts` continua passando. Adicionar checagem leve em `check-og.ts` para garantir que todo slug em `acordos.ts` tem um `public/og/{slug}.jpg` correspondente.

### 7. Documentação

Atualizar `.lovable/prd.md` seção 4.1 marcando essa migração como concluída e listando o que ainda falta (upload de PDFs próprios = rodada do hub pago).

## Fora do escopo desta rodada

- Upload de PDFs/.docx próprios (vai para Supabase Storage na rodada do hub).
- Auth, paywall, Stripe (rodada do hub pago).
- Editor admin para curar conteúdo (continua manual em `acordos.ts`).
- Calculadora de totalização.

## Detalhes técnicos

- Parser HTML: `node-html-parser` (puro JS, compatível com Workers, sem dependência nativa).
- Mapeamento de campos baseado nas marcações `🏢 Instituição`, `📍 Endereço`, `📞 Telefone`, `✉️ E-mail` que aparecem em todos os HTMLs.
- Slug normalization centralizada em `src/lib/slug.ts` (criar): remove acentos, troca espaço por hífen.
- Campos vazios no HTML fonte ficam como `undefined`, não string vazia — UI esconde a seção quando ausente.
- `documentos` no MVP só lista links externos extraídos dos HTMLs; arquivos próprios chegam na próxima rodada.

## Critérios de aceite

- 24 países/acordos com dados estruturados completos em `acordos.ts`.
- 3 rotas novas funcionando: `/acordos/cplp`, `/acordos/ibero-americano`, `/acordos/mercosul`.
- 3 OGs novas geradas e passando no `check-og`.
- Página `/acordos/:pais` renderiza órgãos de ligação, benefícios, decreto e lista de documentos com gate PRO visual (sem auth real ainda).
- `check-brand` + `check-og` verdes.
- `.lovable/prd.md` atualizado.  
  
e jogue o projeto que estamos fazendo aqui no lovable para maior controle do que estamos mexendo. assim o posso usar o claude para outras tarefas enquanto voce foca em outra 