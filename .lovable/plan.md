# Onda 1 — Destravar o Hub (plano de execução)

## Decisões já tomadas
- **Importar tudo**: 192 docs do repo `marcosespinola1379/Mapa-de-Acordos`, incluindo **Suíça** (10 docs) → o Hub passa de 24 para **25 países**.
- **Cabo Verde** e **Iberoamericano** continuam visíveis com badge "Em curadoria".
- **Nomes de arquivo**: slugificados no bucket (sem acentos/espaços), mas o `Content-Disposition` força o download a sair com o `doc.nome` curado. Advogado vê nome humano na pasta Downloads.

---

## Passo 1 — Script de sincronização (`scripts/sync-hub-docs.ts`)

Cria um script único, idempotente, que faz tudo:

1. Lista a árvore do repo via `https://api.github.com/repos/marcosespinola1379/Mapa-de-Acordos/git/trees/main?recursive=1`.
2. Filtra só `.pdf`, `.doc`, `.docx` (case-insensitive).
3. Aplica o **mapa de pastas → slugs** (próximo passo).
4. Para cada arquivo:
   - baixa em stream de `raw.githubusercontent.com/…/<path>`
   - slugifica o nome (preserva extensão original lowercased)
   - faz upload via `supabaseAdmin.storage.from("hub-docs").upload(slug + "/" + filename, buffer, { upsert: true, contentType })`
5. Ao final, escreve `scripts/sync-hub-docs.report.json` com `{ uploaded, skipped, missing, errors }`.

**Como rodar** (você decide quando):
```bash
bun scripts/sync-hub-docs.ts          # importa tudo
bun scripts/sync-hub-docs.ts --dry    # só lista o que faria
bun scripts/sync-hub-docs.ts --pais alemanha  # só um país (debug)
```

O script usa `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (já existem como secrets).

### Mapa de pastas (GitHub → nosso slug)

| GitHub | Nosso slug | Obs |
|---|---|---|
| `alemanha/` | `alemanha` | 13 docs |
| `austria/` | `austria` | 3 |
| `belgica/` | `belgica` | 12 (era 0 no dataset → destrava!) |
| `bulgaria/` | `bulgaria` | 1 |
| `canada/` | `canada` | 16 |
| `chile/` | `chile` | 8 |
| `coreia/` | **`coreia-do-sul`** | 14 — rename! |
| `espanha/` | `espanha` | 4 |
| `estados-unidos/` | `estados-unidos` | 8 |
| `grecia/` | `grecia` | 5 |
| `india/` | `india` | 8 |
| `italia/` | `italia` | 16 |
| `japao/` | `japao` | 13 |
| `luxemburgo/` | `luxemburgo` | 3 |
| `mercosul/` | `mercosul` | 9 |
| `mocambique/` | `mocambique` | 8 |
| `portugal/` | `portugal` | 15 |
| `quebec/` | `quebec` | 11 (era 0 → destrava!) |
| `republica-tcheca/` | `republica-tcheca` | 12 (era 0 → destrava!) |
| `suica/` | **`suica`** (novo país) | 10 |
| raiz `Acordo Brasil - Bélgica (2009).pdf` | → `belgica/` | já tem duplicata na pasta — pular |
| raiz `…Israel.pdf` | → `israel/` | único arquivo do Israel |
| raiz `Convenção Multilateral…CPLP.pdf` | → `cplp/` | único arquivo do CPLP |
| (não existe) | `cabo-verde` | só badge "Em curadoria" |
| (não existe) | `franca` | **FALTA NO REPO** — verificar com Marcos |
| (não existe) | `iberoamericano` | só badge |

**ATENÇÃO — França sumiu do repo**: o `import-acordos.ts` esperava `acordo-franca.html` (parser de HTML para metadados, OK), mas a pasta `franca/` com PDFs não existe. Vou registrar isso no relatório e tratar França também como "Em curadoria" até o Marcos subir. Pode ser que ele suba durante a execução, então o script é idempotente.

---

## Passo 2 — Regenerar `acordos.generated.ts`

Hoje o `arquivo:` no dataset veio do parse de HTML e **não bate** com os nomes reais. Vou:

1. Adaptar `scripts/import-acordos.ts` (que já existe) para, depois do parse de HTML, cruzar com a **listagem real do bucket** (`supabaseAdmin.storage.from("hub-docs").list(slug)`).
2. Para cada `documentos[i]`: tentar match por:
   - igualdade case-insensitive,
   - fuzzy match no `nome` curado vs nome do arquivo (Levenshtein simples),
   - fallback: se não casar, preservar a entrada mas `arquivo: null` (UI já trata como "Indisponível").
3. **Arquivos no bucket sem entrada no dataset**: adicionar como nova entrada com `cat: "outro"` e `nome: humanizado a partir do filename`. Isso garante que TODO arquivo importado fica acessível.
4. Adicionar Suíça ao dataset (escrever bloco mínimo: título, instrumento, decreto, vigor — placeholders pendentes de curadoria, mas com documentos disponíveis).
5. Regenerar `src/data/acordos.generated.ts`.

**Rodar:**
```bash
bun scripts/import-acordos.ts --reconcile-storage
```

---

## Passo 3 — `Content-Disposition` no serverFn

No `src/lib/hub.functions.ts`, ao gerar a signed URL:

```ts
const { data: signed } = await supabaseAdmin.storage
  .from("hub-docs")
  .createSignedUrl(`${pais}/${arquivo}`, 60, {
    download: `${doc.nome}.pdf`,  // força filename humano no download
  });
```

(A opção `download` do `createSignedUrl` já injeta `response-content-disposition=attachment; filename=…` na URL.)

---

## Passo 4 — Adicionar Suíça ao dashboard

Em `src/routes/_authenticated/hub.tsx`, adicionar:
```ts
{ slug: "suica", nome: "Suíça", flag: "ch" },
```

Lista vai de 24 para 25. Ordem alfabética mantida.

---

## Passo 5 — Card da Calculadora no /hub

Acima do grid de países, bloco destacado:

```
┌─────────────────────────────────────────────────────────┐
│ [ícone]  Calculadora RMI Pro-rata                       │
│          Laudo técnico com tabela detalhada              │
│          [Abrir calculadora →]                          │
└─────────────────────────────────────────────────────────┘
```

- `bg-secondary`, `rounded-2xl`, ícone Lucide `Calculator` à esquerda.
- Variant para sem acesso: mesmo card vira preview borrado + CTA `/precos`.
- Usa `<Link to="/hub/calculadora">`.

---

## Passo 6 — Selo de cobertura nos cards de país

Helper client-side `coberturaDoPais(slug)`:
```ts
function cobertura(slug: string) {
  const d = acordosImportados[slug];
  if (!d) return { docs: 0, trecho: false, orgaos: false, emCuradoria: true };
  return {
    docs: d.documentos.filter(x => x.arquivo).length,
    trecho: !!d.acordoTrecho,
    orgaos: !!(d.orgaoBR && d.orgaoParceiro),
    emCuradoria: d.documentos.filter(x => x.arquivo).length === 0,
  };
}
```

No card do país, linha sob o nome:
- Tem docs: `"13 docs · trecho · órgãos"` (em `text-[10px] text-muted-foreground`)
- Sem docs: badge `"Em curadoria"` (em `bg-[var(--accent-ink)]/10 text-[var(--accent-ink)] rounded-full px-2 py-0.5 text-[10px]`)

Países que vão receber badge "Em curadoria" na Onda 1: **Cabo Verde, Iberoamericano, França** (até Marcos subir).

---

## Passo 7 — Validação end-to-end

Checklist automatizado (`scripts/validate-hub.ts`):

1. Para cada país do dataset: contar `documentos.filter(d => d.arquivo).length`.
2. Para cada arquivo: `supabaseAdmin.storage.from("hub-docs").list(pais)` → verificar que existe.
3. Gerar 3 signed URLs aleatórias e fazer HEAD nelas (status 200, content-length > 0).
4. Imprimir relatório:
   ```
   ✓ alemanha:    13/13 docs OK
   ✓ canada:      16/16 docs OK
   ⚠ cabo-verde:   0 docs (em curadoria)
   ✓ TOTAL: 192 arquivos no bucket, 192 referenciados, 0 inconsistências
   ```

---

## Passo 8 — Atualizar docs do projeto (regra de memória core)

- `.lovable/prd.md`: registrar "Onda 1 Hub: 192 docs importados, calculadora visível, selos de cobertura, Suíça (25º país)".
- `ROADMAP.md`: mover itens da Onda 1 para "concluído", manter Ondas 2-4 como próximos.

---

## Ordem de execução (e o que você precisa fazer)

| # | Ação | Quem |
|---|---|---|
| 1 | Aprovar este plano | Você |
| 2 | Criar `scripts/sync-hub-docs.ts` + rodar `--dry` para validar mapeamento | Claude |
| 3 | Mostrar o relatório dry-run pra você | Claude → Você |
| 4 | Rodar sync real (192 uploads, ~3-5 min) | Claude |
| 5 | Adaptar `import-acordos.ts` + regenerar dataset | Claude |
| 6 | Aplicar Content-Disposition no serverFn | Claude |
| 7 | Adicionar Suíça ao dashboard, card da Calculadora, selos | Claude |
| 8 | Rodar `validate-hub.ts` e mostrar relatório | Claude |
| 9 | Atualizar prd.md + ROADMAP.md | Claude |
| 10 | Você testa: login como admin, abre Alemanha, baixa 1 PDF, abre Canadá, baixa outro, abre calculadora | Você |

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| GitHub rate limit (60 req/h sem token) | Script faz 1 chamada à API (lista a árvore), depois baixa via `raw.githubusercontent.com` (sem limit) |
| Upload de 192 arquivos demora muito | Upload em paralelo com `Promise.all` em batches de 10 |
| Storage cobra por GB | 192 PDFs ≈ ~200 MB total → bem abaixo do free tier |
| Nome de arquivo com caracteres estranhos quebra path | Slugify rigoroso: `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")` → minúsculas → `[^a-z0-9.-]` vira `-` |
| Conflito de nomes após slugify (2 arquivos viram o mesmo path) | Detectar no script e sufixar `-2`, `-3`. Relatório mostra. |
| `cabo-verde`, `iberoamericano`, `franca` sem arquivos | UI já trata via badge "Em curadoria" |
| Suíça sem metadados curados (instrumento, decreto, etc.) | Placeholders `"Em curadoria"` no dataset, mas docs disponíveis. Curadoria de texto fica para depois. |

---

## Critério de "Onda 1 concluída"

- [ ] `scripts/sync-hub-docs.ts` rodado com sucesso, relatório mostra 192 uploads.
- [ ] `acordos.generated.ts` regenerado, 25 países, todo `arquivo:` tem objeto no bucket.
- [ ] `/hub` mostra card da calculadora no topo + 25 países com selo de cobertura.
- [ ] 3 países sem docs (Cabo Verde, Iberoamericano, França) mostram badge "Em curadoria".
- [ ] Login como admin, abrir 3 países diferentes, baixar 1 PDF de cada — todos abrem e o filename salvo é o `doc.nome` humano.
- [ ] `prd.md` + `ROADMAP.md` atualizados.

---

**Aguardo seu OK para iniciar.** Se quiser ajustar algo (ex.: pular Suíça por ora, mudar slug, deixar nome do arquivo igual ao do GitHub sem slugificar), me avisa antes do go.
