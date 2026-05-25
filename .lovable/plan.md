
# Plano — Hub Profissional · Ondas 2 e 3

A Onda 1 (sync de 192 docs, Suíça, selos de cobertura, card da Calculadora, download humanizado) já está em produção. Este plano cobre as **duas ondas restantes** para deixar o Hub à altura de um produto sênior.

---

## Onda 2 — UX/UI Overhaul (foco em conversão e leitura)

Objetivo: transformar o Hub de "lista de países" em **workspace do advogado previdenciarista internacional**.

### 2.1 Dashboard `/hub` — reorganizar por intenção

Hoje: grid plano de 25 países + card da Calculadora no topo.
Proposta:

```text
┌─────────────────────────────────────────────────┐
│  Calculadora RMI Pro-rata  →  [Abrir]           │  ← já existe
├─────────────────────────────────────────────────┤
│  Continuar de onde parou                         │  ← NOVO
│  [Alemanha · 3 docs vistos] [Portugal · 1 doc]   │
├─────────────────────────────────────────────────┤
│  Filtros: [Todos] [Europa] [Américas] [Ásia]    │  ← NOVO
│           [Com material ✓] [Em curadoria]        │
├─────────────────────────────────────────────────┤
│  Países (25)                                     │
│  [card] [card] [card] [card]                     │
└─────────────────────────────────────────────────┘
```

Implementação:
- "Continuar de onde parou": query nos últimos 5 `downloads_log` distintos por `country` do usuário (server fn já existente pode ser estendida).
- Filtros por região: derivar de um mapa estático `regioes = { Europa: [...], Américas: [...] }` em `src/data/regioes.ts` (sem migration).
- Filtros por status: usar `coberturaDoPais()` que já existe.

### 2.2 Página do país `/hub/$pais` — tabs sticky

Hoje: tudo empilhado em uma página longa (visão geral + órgãos + benefícios + trecho + documentos).
Proposta: **sticky tabs** no topo (após o header do país) com 4 abas:

| Aba | Conteúdo |
|---|---|
| **Visão Geral** | instrumento, decreto, vigor, benefícios (BR/parceiro), trecho jurídico |
| **Documentos** | lista completa com busca + filtro por categoria (formulário, instrução, decreto, outro) |
| **Órgãos** | cards lado a lado (BR vs parceiro) com endereço, telefone, site |
| **Trecho legal** | acordoTrecho em tipografia editorial, com botão "copiar citação" |

Implementação:
- Componente `<HubTabs>` usando `@/components/ui/tabs` (já instalado).
- Sticky com `sticky top-16 z-30 bg-background/95 backdrop-blur`.
- URL sincronizada via `?tab=documentos` (search params do TanStack Router).

### 2.3 Card de país no dashboard — visual mais denso

Hoje: card simples com bandeira + nome + selo.
Proposta:
- Bandeira maior, nome em destaque.
- Linha de selos: `13 docs · trecho · 2 órgãos` ou badge `Em curadoria`.
- Hover: leve `translate-y-[-2px]` + shadow.
- Bordas `rounded-2xl` (alinhar com a memória de UI).

### 2.4 Tela de documento — preview antes do download

Quando o advogado clica em um documento, hoje baixa direto. Proposta:
- Sheet lateral (`@/components/ui/sheet`) mostrando: nome, categoria, tamanho, data do acordo, descrição.
- Dois botões: `Baixar PDF` (mantém comportamento atual) e `Marcar como favorito` (Onda 3).

### 2.5 Calculadora — entrada de dados mais clara

Hoje: `src/routes/_authenticated/hub.calculadora.tsx` usa `<CalculadoraForm>`.
Proposta:
- Adicionar **stepper visual** (3 passos: Dados pessoais → Tempo de contribuição → Resultado).
- Resultado em card com gradiente sutil e CTA secundário "Salvar este cálculo" (prepara Onda 3).
- Manter toda lógica de `src/lib/calculadora.ts` intocada (apenas UI).

---

## Onda 3 — Features avançadas (persistência)

Objetivo: tornar o Hub uma ferramenta de trabalho diária, não só consulta.

### 3.1 Histórico de cálculos — `calc_history`

Migration:
```sql
CREATE TABLE public.calc_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pais text NOT NULL,
  tipo text NOT NULL,           -- aposentadoria_idade | pensao_morte
  inputs jsonb NOT NULL,        -- snapshot dos campos
  resultado jsonb NOT NULL,     -- ResultadoCalculo
  rotulo text,                  -- "Cliente João - simulação 1"
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.calc_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY calc_select_own ON public.calc_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY calc_insert_own ON public.calc_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY calc_delete_own ON public.calc_history FOR DELETE USING (auth.uid() = user_id);
```

UI:
- Lista em `/hub/calculadora?tab=historico` com cards (rotulo, país, RMI, data).
- Botão "Recarregar inputs" reabre o form preenchido.

### 3.2 Favoritos de país — `hub_favoritos`

Migration:
```sql
CREATE TABLE public.hub_favoritos (
  user_id uuid NOT NULL,
  pais text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pais)
);
ALTER TABLE public.hub_favoritos ENABLE ROW LEVEL SECURITY;
CREATE POLICY fav_all_own ON public.hub_favoritos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

UI: ícone de estrela no card do país; seção "Seus favoritos" no topo do dashboard (acima de "Continuar de onde parou").

### 3.3 Notas privadas por país — `hub_notas`

Migration:
```sql
CREATE TABLE public.hub_notas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pais text NOT NULL,
  conteudo text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX hub_notas_user_pais ON public.hub_notas(user_id, pais);
ALTER TABLE public.hub_notas ENABLE ROW LEVEL SECURITY;
CREATE POLICY nota_all_own ON public.hub_notas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

UI: nova aba "Minhas notas" na página do país; textarea com autosave (debounce 800ms).

### 3.4 Export PDF do resultado da calculadora

- Lib: `@react-pdf/renderer` (Worker-compatível, pure JS, sem native deps).
- Template com header AtlasPrev, dados de input, resultado, rodapé com aviso "Estimativa não vinculante".
- Server fn `exportCalculoPdf` retornando base64 (ou link assinado se virar grande).

### 3.5 Citações jurídicas — botão "copiar"

Na aba "Trecho legal", botão que copia formatado: `"Trecho do Acordo Brasil–{País}, Decreto nº X, art. Y: '...'"`. Útil para petições.

---

## Ordem de execução proposta

1. **Onda 2.1 + 2.3** — Dashboard reorganizado (filtros + continuar de onde parou + card denso). Sem migration.
2. **Onda 2.2 + 2.5** — Tabs sticky no país + stepper na calculadora. Sem migration.
3. **Onda 2.4** — Sheet de preview de documento.
4. **Onda 3.2** — Favoritos (menor risco, migration simples) + estrela nos cards.
5. **Onda 3.1 + 3.4** — Histórico + export PDF (pacote `@react-pdf/renderer`).
6. **Onda 3.3 + 3.5** — Notas privadas + copiar citação.

---

## Detalhes técnicos (devs)

- **Server fns**: estender `src/lib/hub.functions.ts` com `getHubDashboard()` (junta sub/role + favoritos + últimos downloads) para evitar 3 round-trips do dashboard.
- **Rotas novas**: nenhuma rota nova; apenas search params (`?tab=`, `?filtro=`).
- **RLS**: padrão `auth.uid() = user_id` em todas as 3 novas tabelas — alinhado com `downloads_log`.
- **Componentes novos** em `src/components/hub/`:
  - `dashboard-filters.tsx`
  - `continue-reading.tsx`
  - `country-card.tsx` (extrair do `hub.tsx` atual)
  - `hub-tabs.tsx`
  - `doc-preview-sheet.tsx`
  - `calc-stepper.tsx`
  - `nota-editor.tsx`
- **Memória / docs**: atualizar `.lovable/prd.md`, `ROADMAP.md` e marcar tasks 5–12 conforme conclusão.

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| `@react-pdf/renderer` pesado no bundle | Lazy import dentro da server fn de export |
| Autosave de notas spamar o servidor | Debounce 800ms + comparar com último valor salvo |
| Tabs sticky quebrar em mobile (1021px é o viewport atual) | `flex-wrap` + `overflow-x-auto` nas tabs |
| Filtros + favoritos + continuar = dashboard sobrecarregado | Hierarquia visual: favoritos pequeno, continuar médio, grid principal grande |

---

## O que NÃO entra agora (parking lot)

- Busca global cross-país ("encontrar em qualquer acordo a palavra X").
- Comparador de acordos (BR-DE vs BR-PT lado a lado).
- Compartilhar simulação por link público.
- Versionamento de documentos (quando MTP publicar nova revisão).

Decidir depois de ver tração das Ondas 2 e 3.
