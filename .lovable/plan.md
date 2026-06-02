
# Plano de execução — Relatório Marcos + Tooltips dos acordos

Dois inputs:
1. `relatorio-site-acordos-internacionais-e-briefing-programador.md` — 14 prioridades de conteúdo/UX.
2. `tooltips_acordos.txt` — tooltips revisados para 8 acordos (França, Suíça, Portugal, Bulgária, Canadá, Alemanha, Quebec, Itália).

Para evitar uma rodada gigante, divido em **4 fases**. Cada fase termina em build verde e pode ser publicada isoladamente.

---

## Fase 1 — Fonte única de verdade + status dos acordos (Prioridades 1, 2, 7 do relatório)

**Objetivo:** acabar com números divergentes e separar "vigente" de "em ratificação".

### O que muda
- Novo arquivo `src/data/site-stats.ts` exportando:
  ```ts
  export const siteStats = {
    acordosBilateraisVigentes: <n>,
    acordosMultilateraisVigentes: <n>,
    acordosEmRatificacao: <n>,
    acordosMapeadosTotal: <n>, // soma
    documentosOrganizados: <n>,
    paisesCobertosHub: <n>,
  };
  ```
  Os números serão derivados automaticamente de `src/data/acordos.ts` quando possível; o que não der pra derivar fica como constante validada.
- Adicionar campo `status: "vigente" | "multilateral_vigente" | "em_ratificacao" | "incompleto"` em cada acordo de `src/data/acordos.ts` (e refletir no tipo em `acordos.types.ts`).
- Reclassificar Cabo Verde, Israel, CPLP e qualquer outro caso conforme dados oficiais do MPS/INSS (lista validada antes do commit).
- Substituir hardcodes de número/“vigentes” em: `src/routes/index.tsx`, `src/routes/acordos.index.tsx`, `src/routes/acordos.$pais.tsx`, `src/routes/profissional.tsx`, `src/routes/precos.tsx`, `src/routes/guias.index.tsx`, `src/components/site-footer.tsx`, metadados SEO (`head()` de cada rota).
- Card de acordo (`/acordos`) ganha **badge de status** (`Em vigor`, `Em ratificação`, `Multilateral`, `Incompleto`) usando tokens do tema Premium Dark + Gold. Filtro de status na listagem.
- Página individual do país mostra o status no topo.

### Critério de aceite
Nenhuma página afirma "25 acordos vigentes" se a contagem inclui acordos em ratificação. Todos os números do site batem com `siteStats`.

---

## Fase 2 — Aplicar tooltips revisados dos 8 acordos

**Objetivo:** substituir/inserir os tooltips do arquivo `tooltips_acordos.txt` nos acordos: França, Suíça, Portugal, Bulgária, Canadá, Alemanha, Quebec, Itália.

### O que muda
- Atualizar `src/data/acordos.ts` (ou `acordos.generated.ts`, conforme onde os benefícios estão definidos hoje) adicionando campo `tooltip?: string` em cada item de benefício das listas `beneficios.brasil` / `beneficios.parceiro`.
- Para os 8 acordos listados, aplicar exatamente o texto do arquivo, separando por aba (Brasil vs parceiro). O caso da França tem um tooltip longo com múltiplos itens — preservar a formatação em parágrafos.
- Atualizar `acordos.types.ts` para suportar benefícios como objeto `{ nome: string; tooltip?: string }` mantendo retrocompatibilidade (aceitar string legacy).
- Atualizar o componente que renderiza benefícios em `src/routes/acordos.$pais.tsx` para exibir um ícone de info (`lucide-react` `Info`) ao lado do benefício quando houver tooltip, usando `components/ui/tooltip.tsx` (shadcn). Mobile: tap abre popover.
- Validar visualmente o overflow do tooltip da França (texto longo) — provavelmente vira `Popover` em vez de `Tooltip`.

### Critério de aceite
Nos 8 países, cada benefício listado no arquivo tem o ícone de info clicável com o texto exato. Demais países seguem sem ícone (sem regressão).

---

## Fase 3 — Reestruturação das jornadas + padronização de siglas + prova de vida (Prioridades 3, 4, 5, 6)

**Objetivo:** colocar as jornadas em ordem cronológica real e padronizar terminologia.

### O que muda
- **Jornada `/jornadas/moro-fora`**: dividir em duas trilhas via `tabs` (shadcn `Tabs`):
  - Trilha A — "Já recebo benefício do INSS" (cadastro → prova de vida → conta → bloqueio).
  - Trilha B — "Trabalho fora e quero planejar" (verificar acordo → onde contribuir → documentos → tempo registrado → totalização → simulação → requerimento futuro).
  - Editar dados em `src/data/jornadas.ts` para suportar `trilhas?: Trilha[]`.
- **Outras jornadas** (`vou-me-mudar`, `estou-voltando`, `quero-me-aposentar`): reordenar passos para o padrão diagnóstico → país/acordo → documentos → contribuições → planejamento → simulação → requerimento → acompanhamento.
- **Siglas**: search-and-replace controlado em `src/data/**`, `src/routes/**`, `src/components/**` para padronizar `CDT`, `CSDP`, `DSDP`. Eliminar `CDSP`. Manter expansões nos primeiros usos por página.
- **Prova de vida** (`/guias/prova-de-vida-no-exterior` e bloco dentro de `moro-fora`): adicionar quadro objetivo (quando / como / validade 90 dias / não enviar por e-mail / risco se atrasar). Componente reutilizável `ProvaVidaQuickFacts`.
- Glossário: adicionar entradas para CSDP, DSDP, APSAI, Órgão de ligação, Benefício teórico, Benefício pro-rata, Residência fiscal, Dupla contribuição, Atestado de vida, Formulário de ligação.

### Critério de aceite
Jornada `moro-fora` tem duas trilhas visíveis. Nenhum arquivo do site usa "CDSP". Bloco de prova de vida aparece com os 5 itens. Glossário cobre os 10 termos.

---

## Fase 4 — Limpeza de UI/SEO/contato/calculadora (Prioridades 7→14)

**Objetivo:** polir bordas restantes.

### O que muda
- **Metadados SEO (PT-BR)**: revisar `head()` de todas as rotas (`src/routes/**`) e remover strings em inglês ("International Agreements Hub: Your guide…"). Cada rota com title + description em português, alinhados ao conteúdo.
- **Footer** (`src/components/site-footer.tsx`): link "Jornadas" passa a apontar para `/jornadas` (não `/jornadas/moro-fora`).
- **Header / menu** (`src/components/site-header.tsx`): renomear "Entrar" → "Entrar no Hub" e "Criar conta" → "Criar conta no Hub". Avaliar agrupamento visual (cidadão x advogado) sem refazer o menu inteiro.
- **Blog**: como `/blog` está em construção, remover do header/footer enquanto não houver post; manter rota acessível por URL direta com placeholder "Em breve". (Captura de e-mail fica como melhoria opcional, fora desta fase.)
- **Contador de Fundadores** (`/precos` e Hub): se `get_founder_count` retorna 100/100 sem vendas, substituir por copy estática "Lote fundador — 100 vagas" enquanto o contador real não tem rotatividade. Quando houver venda, o número real volta a ser exibido. (Decisão a confirmar com o Marcos: manter contador real ou texto estático.)
- **Contato** (`/contato`): adicionar bloco abaixo do formulário com (i) prazo estimado de resposta, (ii) aviso de que o envio não cria contrato de honorários, (iii) menção a WhatsApp se aplicável.
- **Calculadora** (`/calculadora` e `hub.calculadora`): adicionar nota próxima ao botão de resultado: *"Resultado estimado. A análise oficial depende dos dados completos do CNIS, documentos estrangeiros, regras do país acordante e decisão do INSS."*

### Critério de aceite
Nenhuma página tem meta em inglês. Footer aponta para `/jornadas`. Menu deixa claro que login é do Hub. Calculadora exibe o aviso de estimativa.

---

## Documentação (toda fase)
Ao final de cada fase, atualizar `.lovable/prd.md` e `ROADMAP.md` na mesma rodada, conforme regra de memória.

---

## Pontos a confirmar antes de começar (rápidos, posso assumir defaults se preferir)

1. **Números oficiais finais** (bilaterais vigentes, multilaterais vigentes, em ratificação, total de documentos). Posso derivar de `src/data/acordos.ts` + auditoria contra o site do MPS, mas se você já tem os números fechados, melhor passar.
2. **Cabo Verde / Israel / CPLP**: confirmar status (`em_ratificacao` para os três?).
3. **Contador de Fundadores**: deixar copy estática "100 vagas" enquanto não vende, ou manter contador dinâmico mesmo zerado?
4. **Ordem de execução**: começar pela Fase 1 (números + status), ok? Ou prefere Fase 2 (tooltips) primeiro porque já tem o texto pronto?

Se você não responder a esses 4, eu começo pela **Fase 1** assumindo: derivo números do `acordos.ts`, classifico Cabo Verde/Israel/CPLP como `em_ratificacao`, e troco o contador por copy estática.
