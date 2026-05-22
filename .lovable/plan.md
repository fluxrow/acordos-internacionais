# Plano de execução — Hub Profissional

> Substitui o plano anterior (refinamento /sobre/dr-marcos, já implementado).
> Escopo: tirar o Hub do estado "biblioteca quebrada" e levá-lo ao nível de produto que justifica o preço (Fundadores R$ 597 / Anual R$ 797).

---

## Diagnóstico (estado real, 22/05/2026)

### O que existe e funciona
- **24 acordos** no dataset (`src/data/acordos.generated.ts`), todos com metadados: instrumento, decreto, vigor, órgãos de ligação BR + parceiro, benefícios cobertos.
- **20 acordos** com trecho legal citável; **19 acordos** com pelo menos 1 documento referenciado (159 entradas no total).
- **Auth + gate de assinatura** funcionando: `getCountryHubData` checa `subscriptions.status='active'` ou `lifetime_access=true` ou `role='admin'` antes de assinar URLs do storage.
- **Calculadora RMI Pro-rata** existe e está plugada em `/hub/calculadora` (506 linhas, upload de CNIS via PDF.js, parsing, cálculo, layout para impressão).
- **Log de downloads**: cada acesso unlocked grava em `downloads_log` (base para futuras métricas).

### Gaps críticos (em ordem de gravidade)

**1. CRÍTICO — Bucket `hub-docs` vazio (0 arquivos).** Dataset referencia 159 arquivos por nome, mas nenhum subiu para o storage. Resultado: assinante paga e vê **"Indisponível"** em todos os "Baixar". Produto quebrado.
   - **Resolução à vista**: o repo `github.com/marcosespinola1379/Mapa-de-Acordos` tem **192 documentos** organizados por pasta (Alemanha 13, Canadá 16, Itália 16, Portugal 15, etc.). Inclui pastas que faltavam (Bélgica 12, Québec 11, Rep. Tcheca 12). Inclui pasta `suica/` que não está no nosso dataset (oportunidade de novo país).
   - **Atenção ao mapeamento**: nomes das pastas no GitHub usam slug curto (`coreia/`) vs nosso slug (`coreia-do-sul`), e os nomes dos PDFs não batem com o campo `arquivo:` no dataset. Vamos regenerar o dataset a partir da listagem real do repo.

**2. CRÍTICO — Calculadora não tem entrada no /hub.** A rota `/hub/calculadora` existe e funciona, mas o dashboard `/hub` não linka. O assinante só descobre se digitar a URL. Para um diferencial de venda destacado em `/profissional`, isso é invisibilizar o produto.

**3. ALTO — Cobertura desigual entre países (sem sinalização).** 4 países sem trecho do acordo (Ibero-americano, Québec, Rep. Tcheca, Cabo Verde parcial). Card no /hub não sinaliza nada — usuário entra esperando material e encontra página fina.

**4. ALTO — UI do dashboard /hub não reflete preço/posicionamento.** Hoje é grid liso de bandeirinhas + cabeçalho. Sem entrada para calculadora, sem "continuar de onde parou", sem favoritos, sem selo de cobertura por país, sem busca/filtro.

**5. MÉDIO — Página /hub/$pais é plana.** Documentos em lista única sem agrupamento por categoria. Trecho sem botão "copiar com citação". Órgãos sem `tel:` clicável. Sem indicador de "atualizado em". Estado locked mostra só 1 preview — fraco como argumento de venda.

**6. MÉDIO — Calculadora sem indexação no produto.** Sem histórico de cálculos (laudo some ao fechar aba), sem export PDF nativo (só impressão do browser), sem associação ao processo do cliente.

---

## Princípio de produto

O Hub vende **três coisas distintas** que hoje aparecem misturadas:
1. **Referência confiável** (textos legais, decretos, órgãos) — biblioteca consultada.
2. **Material operacional** (formulários, modelos, fluxogramas) — usado para protocolar.
3. **Ferramentas** (calculadora, futuro: minutas geradas) — produzem entregável.

A UI atual trata tudo como "lista de arquivos". O redesenho separa esses três níveis e dá a cada um o peso visual certo.

---

## ONDA 1 — Destravar o produto (esta semana)

Sem isso, quem pagar Fundadores agora tem experiência ruim. Prioridade máxima.

### 1.1 Sincronizar 192 docs do GitHub para o bucket `hub-docs`
- Criar `scripts/sync-hub-docs.ts`: baixa cada PDF/DOC do repo `marcosespinola1379/Mapa-de-Acordos` via `raw.githubusercontent.com` e faz upload para `hub-docs/{slug}/{arquivo}` via service role.
- **Mapa de slugs** (GitHub → nosso): `coreia` → `coreia-do-sul`; PDFs da raiz (`Acordo Brasil - Bélgica`, `…Israel`, `…CPLP`) → mover para `belgica/`, `israel/`, `cplp/`.
- **Suíça**: não importar nesta onda (não está no dataset). Registrar em ROADMAP como Onda 4.
- **Regenerar** `acordos.generated.ts` com nomes reais dos arquivos (rodar `scripts/import-acordos.ts` adaptado para ler a árvore real do bucket, OU complementar o gerador atual cruzando com a listagem de PDFs).
- Validação: bater listagem `acordos.generated.ts` vs `storage.objects` — todo `arquivo:` deve ter objeto correspondente. Testar download de 3 arquivos via signed URL.

### 1.2 Calculadora visível no /hub
- Card destacado no topo do dashboard `/hub`, acima do grid de países: título "Calculadora RMI Pro-rata", subtítulo "laudo técnico com tabela e fórmulas", CTA "Abrir calculadora →".
- Visual diferenciado dos cards de país (não é "mais um item"): bloco `bg-secondary` largo, ícone à esquerda, CTA à direita.
- Sem acesso: mesmo card vira preview com selo "Incluso no plano" + CTA `/precos`.

### 1.3 Selo de cobertura nos cards de país
- Linha discreta sob o nome do país no grid: "13 docs · trecho · órgãos" ou "Em curadoria".
- Calculado client-side a partir de `acordosImportados` (sem nova query).
- 4 países sem trecho: badge "Em curadoria — em breve" em vez de mostrar página vazia.

**Entregável da Onda 1**: assinante consegue baixar TODOS os documentos e acessar a calculadora a partir do dashboard. Sinal visual antes de clicar.

---

## ONDA 2 — UI à altura do preço (próxima semana)

### 2.1 Dashboard /hub redesenhado
```
[ Saudação + assinatura ativa até dd/mm ]

[ ━━━ ATALHOS ━━━ ]
[ Calculadora RMI · gerar laudo → ]
[ Continuar onde parou: últimos países abertos ]
[ Buscar acordo… (⌘K) ]

[ ━━━ ACORDOS (24) ━━━ ]
[ Filtro por região: Europa · Américas · Ásia · Multilateral ]
[ Grid 4 cols com selo de cobertura, flag, contagem de docs ]

[ ━━━ ATIVIDADE ━━━ ]
[ Últimos países que você abriu · Últimos cálculos salvos ]
```
- "Continuar onde parou" lê de `downloads_log` agregado por país, top 3.
- Filtro por região: client-side (24 itens cabem sem paginação).
- Busca: client-side fuzzy em nome do país e nome do documento.

### 2.2 Página /hub/$pais redesenhada (camadas, não lista)
```
Hero compacto: bandeira · título · selo cobertura · instrumento/decreto/vigor

[ Tabs sticky: Visão · Documentos · Órgãos · Trecho ]

Visão     → resumo curado, benefícios BR vs parceiro lado a lado
Documentos→ agrupado por categoria (Decreto · Acordo · Formulários · Modelos · Outros)
            cada item: ícone PDF, tamanho, "Baixar" e "Abrir em nova aba"
Órgãos    → 2 cards lado a lado, tel: clicável, mailto:, endereço
Trecho    → blockquote tipográfico + botão "Copiar com citação"
```
- Mantém o serverFn atual; só reorganiza o client.
- Estado locked: 3 documentos preview (nome + categoria, sem URL) + screenshot borrado de exemplo + CTA — não "1 item travado".

### 2.3 CTAMarcos contextual (sutil)
- Faixa no rodapé de cada `/hub/$pais`: "Caso complexo neste acordo? → Conversar com o Dr. Marcos". Discreta, não pop-up.

**Entregável da Onda 2**: Hub vira um produto navegável, com hierarquia, em vez de "diretório de arquivos".

---

## ONDA 3 — Diferenciais que justificam renovar (2–3 semanas)

### 3.1 Histórico da calculadora
- Tabela `calc_history` (`id`, `user_id`, `country`, `inputs jsonb`, `resultado jsonb`, `created_at`).
- Botão "Salvar este laudo" na calculadora (manual, não auto — evita lixo).
- Tela "Meus cálculos" listando últimos 20, botão "reabrir" repopula o form.
- Export PDF: rota `/api/public/calc/:id/pdf` (autenticada) renderiza HTML printável server-side. **Sem puppeteer** (não roda no Worker). Usa template HTML + `print-color-adjust: exact` e instrução de "salvar como PDF" no print dialog do browser, OU bibliotecas pure-JS tipo `pdf-lib`/`@react-pdf/renderer` se viável no edge.

### 3.2 Favoritar acordos
- Tabela `hub_favoritos` (`user_id`, `pais`, `created_at`, unique).
- Estrela no card; aba "Favoritos" no topo do dashboard.

### 3.3 Busca global (⌘K)
- Command palette com `cmdk` (já no projeto via shadcn). Busca client-side em nome do país, nome de documento e termos do trecho do acordo. Tudo cabe em memória (24 países, ~190 docs).

### 3.4 Notas privadas por acordo (B2B)
- Tabela `hub_notas` (`user_id`, `pais`, `conteudo`, `updated_at`, unique).
- Textarea com autosave na aba "Visão" do país. O advogado anota interpretação interna — vira motivo para voltar.

**Entregável da Onda 3**: assinante usa o Hub semanalmente, não consulta uma vez e esquece.

---

## ONDA 4 — Expansão (futuro)

- **Suíça**: importar HTML do `Mapa-de-Acordos/suica/` (10 docs já disponíveis), adicionar ao dataset → 25 países.
- **Jurisprudência por país**: aba "Decisões" alimentada manualmente pelo escritório.
- **Alertas**: novo decreto/portaria publicado → email para assinantes.

---

## Resumo da decisão

| Onda | Esforço | Ganho percebido |
|------|---------|-----------------|
| 1 — destravar | 1–2 dias (sync) + 0,5 dia (UI) | "quebrado" → "funcional" |
| 2 — redesign  | 3–5 dias | "funcional" → "vale R$ 797" |
| 3 — diferenciais | 1–2 semanas | "consulta única" → "ferramenta diária" |
| 4 — expansão | quando fizer sentido | mais países, mais profundidade |

---

## Decisões necessárias antes de iniciar Onda 1

- (a) **Suíça (10 docs no repo)**: importar já junto da Onda 1 (vira 25 países), ou deixar para Onda 4? — Sugestão: deixar para Onda 4, foco em destravar o que já existe.
- (b) **Renomear arquivos no upload?** O repo do Marcos tem nomes humanos ("Acordo de Previdência Social Brasil-Alemanha (2009).pdf"). Sugestão: manter nome original (melhor UX no `Content-Disposition` do download) e regenerar o `arquivo:` no dataset a partir da listagem real.
- (c) **Países sem material no repo do Marcos** (Cabo Verde, Iberoamericano): manter visíveis com badge "Em curadoria" ou ocultar? — Sugestão: manter com badge (mostra escopo do produto).
