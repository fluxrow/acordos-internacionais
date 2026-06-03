# Roadmap — Acordo Internacional

> Visão cronológica do que já foi feito e o que vem. Para qualquer IA (Claude Code, Cursor, Copilot, Lovable) ou humano que abrir o repo saber em que ponto estamos.
> Documento canônico de status. PRD detalhado em [`.lovable/prd.md`](./.lovable/prd.md). Convenções em [`README.md`](./README.md).
> **Regra:** toda mudança significativa atualiza este arquivo + o PRD na mesma rodada.

---

## Legenda

- ✅ Concluído
- 🚧 Em andamento
- 📋 Planejado (próxima rodada)
- 💡 Backlog (sem data)
- ❌ Fora de escopo

---

## Correção factual — Bulgária em vigor ✅ (03/06/2026)

- `src/data/acordos.ts`: Bulgária passa de `status: "incompleto"` → `"vigente"` com `vigencia: "2024"`. Acordo Brasil–Bulgária está em vigor desde 2024.
- Resultado de contadores: **22 vigentes** (era 21) + **3 em ratificação** (Cabo Verde, Israel, CPLP) + **0 incompletos** = **25 mapeados**. Todos os números no site são derivados de `siteStats`, então hero, `/acordos` e `/precos` atualizam automaticamente.
- Linha 194 deste roadmap descrevia Bulgária como `incompleto` por inércia da rodada de sync — corrigido aqui.

---

## Fase 0 — Fundação ✅ (concluída)

- ✅ Bootstrap TanStack Start v1 + React 19 + Vite 7
- ✅ Tailwind v4 com tokens semânticos em `oklch` (`src/styles.css`)
- ✅ Deploy em Cloudflare Workers (`wrangler.jsonc`)
- ✅ Lovable Cloud habilitado (Supabase gerenciado)
- ✅ shadcn/ui como base de componentes

## Fase 1 — Marca e conteúdo público ✅ (concluída)

- ✅ Reposicionamento "Acordo Internacional **by AtlasPrev**" (Dr. Marcos como rosto, não como marca)
- ✅ Favicon, OG-image global, header, footer, metadados
- ✅ Rotas públicas: `/`, `/acordos`, `/acordos/:pais`, `/jornadas`, `/jornadas/:jornada`, `/guias`, `/guias/:slug`, `/blog`, `/glossario`, `/contato`, `/profissional`, `/sobre/dr-marcos`
- ✅ UI editorial aplicada em Jornadas, Guias e Glossário (hero wash wine, numeração display, TOC/índice alfabético, bloco "Relacionado" assimétrico, rodapé com lista editorial, CTA-Marcos final)
- ✅ Conteúdo editorial em `src/data/{acordos,guias,jornadas}.ts`
- ✅ 25 OG images por acordo (`public/og/*.jpg`), multilaterais com selo "MULTI"
- ✅ CI: `check-brand` (impede vazamento de marca antiga) e `check-og` (garante cobertura)
- ✅ Hover/focus/active states consistentes em botões, links e cards (sem texto invisível)
- ✅ **Refino editorial Jornadas**: novo índice `/jornadas` com cards numerados, detalhe com hero wash wine + número fantasma, TOC sticky, bloco "Relacionado" (países + guia + calculadora), `CTAMarcos` block global em wash wine
- ✅ **Refino editorial `/sobre/dr-marcos`**: copy oficial (sócio Pagliuca/Espínola/Lessnau, OAB/PR 49.038), novo componente `InteractiveImageAccordion` (hover-expand horizontal com imagem de fundo + overlay wine) apresentando 7 áreas de atuação internacional (totalização, aposentadoria, pensão por morte, prova de vida, CDT, CSDP, planejamento), 7 imagens editoriais geradas em `src/assets/atuacao/`

## Fase 2 — Migração de dados técnicos ✅ (concluída)

- ✅ Script `scripts/import-acordos.ts` baixa 24 HTMLs do repo `marcosespinola1379/Mapa-de-Acordos`
- ✅ Parser com `node-html-parser` extrai: decreto, vigência, órgãos de ligação BR + parceiro, benefícios cobertos, formulários e documentos
- ✅ Saída estruturada em `src/data/acordos.generated.ts` + tipos em `src/data/acordos.types.ts`
- ✅ Catálogo curado (`src/data/acordos.ts`) faz **merge** com dados importados
- ✅ Página `/acordos/:pais` reformatada: hero, cards de Órgãos de Ligação, colunas de Benefícios, tabs Acordo/Ajuste, Documentos com badge "Hub PRO" (gate visual)
- ✅ **Refino visual `/acordos/:pais`**: wash wine no hero, bandeira com moldura, aside com `backdrop-blur`, fallback gracioso em órgãos sem dados, nav contextual Anterior/Próximo com mini-bandeiras e hover wine
- ✅ **Refino visual v2 `/acordos/:pais`**: duplo radial wine no hero + linha gradiente no bottom, ficha Instrumento/Decreto/Vigência em cards `backdrop-blur` com hover wine, documentos agrupados por categoria (Principal/Complementar/Roteiro/Formulário) com header eyebrow wine + contador, "Hub PRO" promovido a CTA único no topo do bloco, `ProContentLock` redesenhado (radial wine duplo, headline `font-display`, CTA pill `--accent-ink`)
- ✅ **Refino UX editorial v3 `/acordos/:pais`**: stats line no hero (anos em vigor, órgãos, documentos), `<Highlight>` destacando palavras-chave em wine no lede e em "Como funciona", TOC sticky "Nesta página" no aside com numeração mono e scroll suave, blocos com kicker numerado `01 ·` + lede curto, OrgaoCard com ícones Lucide (Building2/MapPin/Phone/Mail) e rótulo "Lado X" em wine, BeneficiosComparativo em tabela 2-col com divisória wine, documentos em flat-list com pill de categoria wine-soft e cadeado Lucide com hover
- ✅ 3 acordos multilaterais (CPLP, Mercosul, Ibero-Americano) reaproveitam a rota dinâmica

## Fase 3 — Documentação e colaboração ✅ (concluída)

- ✅ Repositório GitHub conectado via Lovable (sync bidirecional)
- ✅ `README.md` na raiz com stack, estrutura, convenções para humanos e IAs externas
- ✅ `ROADMAP.md` (este arquivo)
- ✅ `.lovable/prd.md` atualizado com status real

## Fase 3.5 — Provisionamento Cloud + Stripe ✅ (concluída)

- ✅ Lovable Cloud (Supabase) provisionado de verdade — `src/integrations/supabase/*` e `supabase/migrations/` criados
- ✅ Stripe Payments (seamless) habilitado — sandbox + webhook em `/api/public/payments/webhook?env=sandbox`
- ✅ `COLLAB.md` na raiz com divisão Lovable ↔ Claude
- ✅ Copy de `pro-content-lock.tsx` alinhado a assinatura recorrente

## Fase 4 — Hub do Advogado MVP 🚧 (em andamento — Claude faz infra, Lovable faz UI)

### 4.1 Auth e perfis ✅

- ✅ Lovable Auth pronto na plataforma (e-mail/senha + Google sign-in disponíveis)
- ✅ **Claude**: migration com `profiles` (1:1 + trigger), enum `app_role`, `user_roles` separada, `has_role()` `SECURITY DEFINER`, RLS em tudo
- ✅ **Claude**: `src/routes/_authenticated.tsx` (layout com `beforeLoad` + `redirect` + `<Outlet />`)
- ✅ **Lovable**: UI de `/login`, `/cadastro`, `/reset-password` com email+senha e botão "Continuar com Google" via `lovable.auth.signInWithOAuth` (broker Lovable Cloud). Google provider habilitado via `configure_social_auth`. Smoke test validou `/login` → `/hub` com sessão preservada via navegação interna do TanStack Router.

### 4.2 Pagamento Stripe 🚧

- ✅ Stripe Payments (seamless) habilitado, sandbox ativo, webhook registrado
- 🚧 **Claude**: migration com `subscriptions` (`user_id`, `stripe_customer_id`, `status`, `price_id`, `current_period_end`)
- 🚧 **Claude**: `src/routes/api/public/payments/webhook.ts` (caminho fixo) — consome eventos `subscription.*` e `transaction.*`
- 🚧 **Claude**: `src/lib/checkout.functions.ts` — cria Checkout Session
- 📋 **Lovable**: UI de `/precos` (cards de plano) e portal Stripe em `/_authenticated/conta`

### 4.3 Hub privado 🚧

- 📋 Supabase Storage: bucket privado `hub-docs/{pais}/{tipo}/{arquivo}`
- 📋 Upload manual inicial dos PDFs/docx do repo `Mapa-de-Acordos`
- 🚧 **Claude**: `src/lib/hub.functions.ts` — `getCountryHubData(pais)` com `requireSupabaseAuth`, valida assinatura ativa, devolve signed URLs com TTL curto
- 🚧 **Claude**: migration com `downloads_log` (`user_id`, `country`, `file_path`, `downloaded_at`)
- 📋 **Lovable**: UI de `/_authenticated/hub` (dashboard) e `/_authenticated/hub.$pais` (material por país)
- 📋 **Lovable**: bloco "Material técnico para advogados" no fim de `/acordos/:pais` → CTA para `/precos`
- ✅ **Acesso admin de leitura**: role `admin` em `user_roles` libera Hub como vitalício. `getCountryHubData` e `getAccountData` consultam `user_roles`; dashboard mostra chip "Modo admin" em wine e oculta paywall.
- 💡 **Painel admin de assinaturas** (`/_authenticated/admin/*`): listar usuários, conceder `lifetime_access` manual, revogar acesso, ver `downloads_log`. Plano separado quando atacar.

### 4.4 Critérios de aceite do MVP 📋

- 📋 Anônimo vê página pública + CTA visível para hub
- 📋 Cadastro grátis funciona; `/hub/*` mostra paywall até assinar
- 📋 Compra Stripe libera acesso em <30s (webhook)
- 📋 Cancelamento revoga acesso no fim do período pago
- 📋 Downloads logados em `downloads_log`
- 📋 CI continua passando

## Fase 5 — Pós-MVP 💡 (backlog priorizado)

1. 💡 Calculadora de totalização por país (interativa, usa dados estruturados)
2. 💡 Formulário de contato com envio de e-mail (Lovable Email para `contato@`)
3. 💡 Blog com CMS leve (markdown em repo ou editor admin no Supabase)
4. 💡 SEO técnico: JSON-LD `GovernmentService`/`Article`, sitemap dinâmico, hreflang
5. 💡 Analytics: PostHog ou Plausible
6. 💡 Avaliação de idiomas EN/ES para advogados estrangeiros

## Decisões pendentes ❓

- ❓ Preço da assinatura (mensal? anual? trial?)
- ❓ Plano único ou tiers (por país, por volume de downloads)?
- ❓ Nome final do produto pago ("Hub Profissional", "Hub do Advogado", outro)
- ❓ Documentos por país: tudo igual para todo assinante, ou material premium destacado?

## Fora de escopo ❌

- ❌ App mobile nativo
- ❌ Marketplace de advogados (lista pública)
- ❌ IA generativa dentro do hub (chatbot, geração de petições) — reavaliar após MVP pago
- ❌ Multi-idioma (por enquanto)

---

## Como atualizar este roadmap

1. Concluiu uma task? Marque `📋 → ✅` e mova para a fase concluída.
2. Começou uma task grande? Marque `📋 → 🚧`.
3. Adicionou escopo novo? Adicione como `📋` na fase certa, ou `💡` se não tem data.
4. **Sempre** atualize também `.lovable/prd.md` na mesma rodada.
5. Mudou a stack ou convenção? Atualize também o `README.md`.

## Atualização 2026-05-22 — UI sweep & oferta unificada

### ✅ Concluído nesta rodada
- ✅ Oferta comercial unificada: Anual R$ 797/ano + Fundadores R$ 1.297 vitalício (100 vagas). Plano Mensal descartado.
- ✅ `/profissional` reescrito como página de oferta editorial (sem lista de espera) com contador de vagas Fundadores ao vivo.
- ✅ `/precos` reduzido a 2 planos e preço Fundadores corrigido para R$ 1.297.
- ✅ `SiteHeader` reativo à sessão: alterna entre Entrar/Criar conta e Meu Hub/Sair.
- ✅ `SiteFooter`: removido link Blog, adicionado Planos e preços.

### Decisões pendentes ❓ (resolvidas)
- ✅ Preço da assinatura → híbrido (anual + vitalício fundadores)
- ✅ Plano único ou tiers → 2 planos, sem tiers por país
- ✅ Nome final → "Hub Profissional"

### 📋 Próximos passes
- 📋 Auditar UI das rotas autenticadas (`/hub`, `/hub/$pais`, `/hub/calculadora`, `/conta`) com sessão real ponta-a-ponta (já parecem ok no código; falta validar visualmente logado).
- ✅ Produtos Stripe `hub_anual` (BRL 797/ano) e `hub_fundadores` (BRL 1.297 one-time) criados via `payments--batch_create_product` com tax_code SaaS (`txcd_10103001`).
- ✅ Checkout `/precos` ligado a `createCheckoutSession` + Stripe embedded (bug de env var `VITE_PAYMENTS_CLIENT_TOKEN` corrigido).
- ✅ `/conta` com botão "Gerenciar assinatura" → `createPortalSession`.
- 📋 Smoke test end-to-end de checkout sandbox (`4242 4242 4242 4242`) em ambos os planos + validar que webhook grava `subscriptions` corretamente.
- 📋 Popular ou esconder `/blog` (link já saiu do footer).
- ✅ `/sobre/dr-marcos`: bordas arredondadas, accordion com overlay neutro+gradiente, Atuação em 2 cards + stats, Manifesto editorial, "Como falar" como dois caminhos (cidadão / advogado).

## Onda 1 Hub — concluída (22/05/2026)
- 192 documentos importados do repo Mapa-de-Acordos para bucket `hub-docs` via `scripts/sync-hub-docs.ts`.
- Dataset reconciliado (`scripts/reconcile-hub-docs.ts`): 25 países (Suíça adicionada).
- `getCountryHubData` passa `download: <nome humano>` no signed URL — Content-Disposition garante filename humano.
- Dashboard `/hub`: card destacado da Calculadora RMI no topo, selo de cobertura ("N documentos" ou "Em curadoria") em cada país.
- 3 países sem material no repo: Cabo Verde, França, Iberoamericano — exibem badge "Em curadoria".

## Onda 2 Hub — concluída (25/05/2026)
- Dashboard `/hub`: filtros por região (Europa/Américas/Ásia/Multilateral) e status (com material / em curadoria), seção "Continuar de onde parou" (últimos países acessados via `downloads_log`), cards de país mais densos com selos `N docs · trecho · N órgãos`, `rounded-2xl`.
- `getHubDashboard` server fn: junta subscription + role + últimos 5 países do `downloads_log` em uma única chamada.
- `/hub/$pais`: sticky tabs (Visão Geral / Documentos / Órgãos / Trecho legal) com URL search param (`?tab=…`), busca + filtro por categoria nos documentos, botão "Copiar citação" no trecho legal (formatado com fonte e decreto).

## Onda 3 Hub — concluída (25/05/2026)
- Tabelas `calc_history`, `hub_favoritos`, `hub_notas` com RLS por `auth.uid()` e trigger `updated_at` nas notas.
- `src/lib/hub-personal.functions.ts`: `listFavoritos` / `toggleFavorito`, `getNota` / `saveNota` (upsert), `listCalcs` / `saveCalc` / `deleteCalc`.
- `/hub/$pais`: botão Favoritar no header + `NotaEditor` privado (autosave 1.2s) na aba Visão Geral.
- `/hub/calculadora`: botão "Salvar este cálculo" no form + seção "Cálculos recentes" listando últimos 20.
- Export PDF do laudo segue via `window.print()` (rota já tem layout pronto para impressão) — `@react-pdf/renderer` adiado por peso de bundle.

## Próximas ondas Hub
- Onda 4: curadoria de metadados da Suíça, monitorar repo do Marcos para França/Cabo Verde/Iberoamericano.
- Polimento: stepper visual de 3 passos na calculadora, rótulo editável + delete no histórico, seção "Países favoritos" no dashboard.

## Calculadora pública — CTA + descoberta (25/05/2026)
- ✅ CTA pós-resultado da calculadora pública (`/calculadora`, casos 3 e 2B) agora aponta para `/contato` via `<CTAMarcos>` — não mais para o Hub. Hub é produto exclusivo para advogados.
- ✅ Header global: novo item "Calculadora" entre Jornadas e Guias; link mobile (deslogado) prioriza Calculadora.
- ✅ Home: CTA principal da hero passou a ser "Simular meu benefício · grátis" → `/calculadora`, com microcopy "Sem cadastro. Sem pagar."
- ✅ Footer (coluna Cidadão): link "Calculadora gratuita".
- ✅ `/calculadora`: microcopy "Sem cadastro · Sem pagar · Resultado em 2 minutos" abaixo do H1.

## Hub — sync de Cabo Verde, França e Ibero-Americano ✅ (26/05/2026)
- `scripts/sync-hub-docs.ts`: adicionados `cabo-verde`, `franca` e `iberoamericano` ao `FOLDER_TO_SLUG` (estavam fora do mapa, por isso o bucket nunca recebeu os arquivos).
- Subidos **27 documentos** ao bucket `hub-docs`: Cabo Verde (2), França (16), Ibero-Americano (9).
- `bun scripts/reconcile-hub-docs.ts` regenerou `src/data/acordos.generated.ts` — todos os 25 países agora têm `arquivo` resolvido em cada documento listado.
- `src/data/acordos.ts`: contagens `docs:` realinhadas ao bucket real (Áustria 2→3, Bélgica 15→13, Canadá 16→19, Chile 8→13, Coreia 13→14, Espanha 4→8, Itália 8→16, Japão 13→19, Luxemburgo 2→3, Moçambique 7→8, Portugal 15→16, Mercosul 5→9, Ibero 6→9).
- Status preservados — Cabo Verde permanece `ratificacao`, Bulgária permanece `incompleto`, Israel permanece `ratificacao` (repo não tem documentos adicionais para esses três).

## Promoção do sandbox `/preview/*` → produção ✅ (26/05/2026)
- Aprovações do Dr. Marcos aplicadas definitivamente nas rotas reais; sandbox `/preview/*`, `PreviewBanner` e `src/components/preview/` removidos.
- **`/`**: bloco "dois públicos" reescrito (novo H1 do advogado, tagline, CTAs `Ver 25 países` / `Jornadas` / `Blog` / `Sobre o Dr. Marcos`).
- **`/jornadas`**: reordenado (Moro fora → Voltei → Trabalho temporário) + bloco 04 "Atendimento direto com o Dr. Marcos".
- **`/jornadas/moro-fora`** e **`/jornadas/estou-voltando`**: passam a renderizar `ProvaDeVidaBlock` e `PlanejamentoTotalizacaoBlock` (movidos para `src/components/jornadas/`).
- **`/guias`**: novo card 05 "Comunicação de Saída Definitiva do País" (badge NOVO).
- **`/guias/saida-definitiva-do-pais`**: nova rota dedicada com SEO real, FAQ, riscos e fontes oficiais.
- **`/profissional`**: hero, descrição e features reescritos sem "modelos de petição".
- **`SiteHeader`**: item "Guias" virou dropdown hover/focus com a biblioteca completa + Saída Fiscal (badge "Novo").

## Calculadora Pro — modelo "laudo" portado do HTML

- Entrega: nova UX da calculadora do Hub do Advogado em `/hub/calculadora`, fiel ao `calculadora-advogado.html` (cabeçalho/cliente, 4 cenários de resultado, tabela técnica, fórmula, rodapé identificável, contador de idade no caso 2B).
- Componente isolado: `src/components/calculadora-form-pro.tsx`. Rota pública `/calculadora` segue inalterada.
- Tokens semânticos (`--state-*`, `--accent-ink*`) — zero hex inline.
- Países do acordo expandidos para paridade com o HTML (Áustria, Bolívia, Bulgária, EUA, Índia, Moçambique, Paraguai, República Tcheca, Quebec).

## Calculadora pública — UX do segurado

- Refatorada `/calculadora` seguindo o `calculadora-segurado.html` de referência.
- Fluxo guiado em 3 passos com toggle CNIS/manual, tutorial colapsável e datas nativas (`<input type="date">`).
- Resultados em linguagem leiga, com valor em destaque (caso 3), contador de idade (caso 2B), explicações inline e CTA contextual para o Dr. Marcos.
- Componente desacoplou-se do Pro: `CalculadoraForm` (público) e `CalculadoraFormPro` (Hub) agora são totalmente independentes.
- Tokens semânticos oklch — zero hex inline.

## Glassmorphism nos cards de destaque

- Substituídos cards `bg-secondary` por `bg-background/60 backdrop-blur-md` em: `cta-marcos`, `acordos.$pais` (aside curiosidade), `sobre.dr-marcos` (3 artigos), `hub.index` (banner + onboarding), `hub.$pais` (2 cards), `precos` (garantia), `contato` (card lateral).

## Fix: calculadora pública aceita CNIS sem coluna de salários (27/05/2026)

- `CalculadoraForm` (`/calculadora`) deixou de bloquear o cálculo quando o CNIS é lido mas o parser não captura salários — agora calcula o **direito** ao benefício e marca como estimativa (sem valor em R$), mesmo comportamento do modo manual.
- Mensagem de erro reservada para o caso real: CNIS sem nenhum período de contribuição lido.
- Parser `src/lib/cnis-parser.ts`: regex de salários reescrito para aceitar valores no padrão brasileiro `1.234,56` standalone (não só prefixados por `R$`), com 2 casas decimais obrigatórias — melhora extração também na Calculadora Pro (`/hub/calculadora`), que reusa `parsearCNIS`.

## LP /profissional + biblioteca de imagens (28/05/2026)

- `/profissional` reestruturado como LP de conversão (Hero → Problem → Story → Proof → Features → Planos → CTA).
- PROBLEM ganha 4ª dor: informação espalhada nos canais oficiais do Gov.
- Retrato Dr. Marcos adicionado no hero de `/sobre/dr-marcos` e reutilizado na seção STORY de `/profissional`.
- Nova pasta `src/assets/lp/` com 4 imagens editoriais (mesa caótica, mesa organizada, mapa-múndi com pins, livros jurídicos). Estilo: fotográfico-editorial Paper & Ink, sem stock genérico, sem texto sobreposto. Diretriz salva em `mem://design/imagery-direction`.
- Próximos passos (não nesta rodada): estender biblioteca para `/jornadas/*`, hero institucional e blocos da home.

## Rodada — Tema Premium Dark + Gold (2026-05-28)
- Snapshot do tema Paper & Ink salvo em `src/styles/themes/paper-ink.css.bak` + doc `.lovable/themes/paper-ink.snapshot.md` (reversível em 1 passo).
- Nova paleta aplicada em `src/styles.css`: fundo `#0a0a0a`, cards `#121212`, headings `#f5f5f5`, body `#d1d5db`, muted `#a3a3a3`, accent `#d4af37` (gold).
- Tokens de sombra (`--shadow-soft`, `--shadow-soft-hover`, `--shadow-gold-glow`) + hover de elevação padronizado.
- Focus ring global passou a gold. `::selection` em gold/paper.
- Componentes: `cta-button.tsx`, `ui/button.tsx`, `site-header.tsx`, `site-footer.tsx` e rotas públicas (`index`, `profissional`, `precos`, `contato`, `jornadas.*`, `sobre.dr-marcos`, `acordos.*`, `guias.*`) varridos para usar tokens (sem `bg-foreground/text-background` invertidos).
- Regra de destaque tipográfico: 1–2 palavras gold (`.text-gold`) por heading principal.
- Fontes, espaçamentos, layout, globos e copy mantidos. Plano anterior de arredondamentos/sombras/hover preservado.

## Refinos pós-ultrareview (rodada 2)
- Headings em /acordos, /guias, /contato com keyword em gold
- Filtros ativos (/acordos, /contato) com text-[var(--paper)] sobre gold
- BeneficiosComparativo: header dark + linhas zebra; CTA contato em gold premium
- ProContentLock: bullets em --paper-soft para legibilidade

## Calculadoras — bloco Segurado vê / Advogado vê (G1–G4)
- Novo módulo `src/lib/calculadora-cenarios.ts`: detector parametrizado dos cenários G1 (carência já cumprida solo), G2 (dupla elegibilidade), G2F (faltam meses), G2B (aguardar idade), G3 (pro-rata >20%) e G4 (tempo no exterior insuficiente para benefício autônomo local). Inclui mapa país → decreto e carência isolada local.
- Novo componente `src/components/calculadora/cenarios-block.tsx`: cartões expansíveis com painéis lado a lado "Segurado vê" (linguagem leiga) e "Advogado vê" (chamada + bullets técnicos + chips de citação legal). 100% Premium Dark + Gold, tokens semânticos, hover de elevação.
- Injetado em `calculadora-form.tsx` (pública, variant="publico") e em `calculadora-form-pro.tsx` (laudo, variant="advogado"), aparece em ambas e também na impressão do laudo.
- Cálculo financeiro intocado — o bloco apenas consome `ResultadoCalculo`.

## 2026-05-29 — Calculadoras: triagem vs laudo
- Segurado = triagem sem valores (CalcularTriagem; 4 cenários textuais + CTAs).
- Advogado = laudo técnico (SMmin 1621, coef 0,70 + anos·0,01, piso pré pro-rata, parser CNIS 80% maiores ≥ 07/1994).
- Fix: drop-zone do Pro (drag&drop) + color-scheme dark nos <input type="date">.

## 2026-05-29 — Lead gate na calculadora do segurado + e-mail oficial
- Antes de mostrar o resultado da triagem, abre modal pedindo nome, e-mail e telefone (zod + checkbox de consentimento). Sem o lead, o cálculo não é executado. Reenvio dispensado na mesma sessão (`sessionStorage`).
- Nova tabela `public.calc_leads` (RLS: insert público anon/auth, select/update/delete só admin). Grava também país, tipo, tempo Brasil/exterior, data nasc, sexo, caso da triagem, user-agent e referer.
- E-mail comercial unificado: `marcos@acordosinternacionais.com` (substitui `contato@…` no mailto da página /contato).


## 2026-05-29 — Suíte de testes das regras de cálculo
- Vitest configurado (`vitest.config.ts`, scripts `test` e `test:watch`).
- 25 testes em `src/lib/__tests__/` cobrindo: triagem (4 casos + ausência de campos monetários), cálculo técnico (piso ANTES do pro-rata, pro-rata sem re-piso, coeficiente capped em 1.0, pensão por morte = 1.0), parser CNIS (filtro de ano < 1994, range de valores, 80% maiores SC, fallback global, intervalos absurdos).

## 2026-05-29 — Hardening do parser CNIS (variação de layout)
- `src/lib/cnis-parser.ts` refatorado: extrai **competência mm/aaaa** (não apenas ano) aceitando `mm/aaaa`, `aaaa-mm`, `aaaa/mm` e mês por extenso (`jul/1994`, `Julho/1994`). Filtro real `≥ 07/1994`.
- Três estratégias de pareamento competência↔valor em cascata (linha única → tabela colunar → token-stream), cobrindo layouts Meu INSS / Dataprev / OCR.
- Filtro anti-falsos-positivos por palavras-chave (`Total`, `Indicador`, `13º`, `Consolidado`…). Vínculos paralelos: soma SCs na mesma competência (cap 50k).
- Cabeçalho aceita `Nome do Segurado`, `CPF/MF`, `DN`, `Nascido(a) em`.
- Testes atualizados: 31/31 passando (14 cobrindo o parser, incl. layout colunar, mês por extenso, dedup de vínculos, filtro 06/1994 vs 07/1994).

## 2026-05-29 — Laudo PDF Premium Dark + Gold (Calculadora Pro)
- Nova rota `/_authenticated/hub/laudo` (`src/routes/_authenticated/hub.laudo.tsx`) renderiza o laudo profissional em A4 fiel à referência aprovada pelo cliente: header com marca + ref, hero de 3 colunas (RMI / Fator Pro-rata / Carência), identificação do segurado, tabela de períodos contributivos com totalização, parâmetros do cálculo, memória de cálculo (fórmulas), detalhamento do pro-rata, fundamento legal, nota técnica e rodapé com bloco de assinatura.
- Componente `src/components/laudo/LaudoPdf.tsx` + CSS escopado `laudo-pdf.css` (Playfair Display + Source Serif 4 + Inter, tokens próprios isolados em `.laudo-root` para não vazar no app). Variações automáticas por caso (1: integral, 2: oculta cálculo + chip vermelho, 2B: chip âmbar "aguarda idade", 3: padrão pro-rata).
- Botão "Imprimir / PDF" da calculadora Pro substituído por "Gerar laudo PDF": serializa estado em `LaudoPayload`, grava no `sessionStorage` (`laudo:pending`) e abre `/hub/laudo` em nova aba.
- `src/lib/laudo-payload.ts`: tipo + helpers (`saveLaudoPayload`, `loadLaudoPayload`, `clearLaudoPayload`, `gerarRef`, `bandeiraDoPais`, `acordoMetaDoPais`).
- Geração via `window.print()` com `@page A4 margin:0` e `print-color-adjust: exact` — sem dependências novas (jsPDF/html2canvas/react-pdf descartados).

## 2026-05-29 — Histórico de Laudos (Hub Profissional)
- Nova tabela `public.hub_laudos` (RLS por user_id: select/insert/delete próprios; admin não tem visão automática). Campos: ref, cliente_nome, cliente_cpf, pais, tipo, rmi_valor, caso, payload (jsonb), created_at. Índice composto (user_id, created_at desc).
- `src/lib/laudo-historico.ts`: `salvarLaudoHistorico`, `listarLaudosHistorico`, `carregarLaudoHistorico`, `excluirLaudoHistorico` via supabase client.
- Ao clicar **Gerar laudo PDF** na calculadora Pro, o laudo é inserido automaticamente em `hub_laudos` (não bloqueia a abertura do PDF se falhar).
- Rota `/_authenticated/hub/laudo` agora aceita `?id=<uuid>` e carrega o payload do banco, permitindo reabrir e reimprimir laudos antigos.
- Nova rota `/_authenticated/hub/laudos` (`src/routes/_authenticated/hub.laudos.tsx`) lista os laudos do usuário (cliente, ref, país, CPF, data/hora, caso, RMI), com ações **Abrir** (nova aba para reimprimir) e **Excluir** (confirm + delete + invalidate).
- Atalhos adicionados: card "Histórico de laudos" no `/hub` e botão "Meus laudos" na calculadora Pro.

## 2026-05-29 — Plano Mensal reintroduzido em /precos
- ✅ Produto Stripe `hub_mensal_plan` + price `hub_mensal` (BRL 97,00/mês, recurring, tax_code `txcd_10103001`) criados via `payments--create_product`.
- ✅ `/precos` agora tem **toggle Mensal/Anual** no card principal + card Fundadores ao lado (grid 2 colunas). Anual default com badge "Mais popular" e microcopy "Economize ~32% vs. mensal". Mensal mostra "Cancele quando quiser".
- ✅ Nenhuma mudança em `createCheckoutSession` — segue resolvendo por `lookup_key` (`hub_mensal`, `hub_anual`, `hub_fundadores`).
- ✅ PRD §6 atualizado (oferta = mensal + anual + fundadores; "mensal descartado" removido).

## 2026-06-02 — Briefing Marcos: Fase 1 (fonte única de números + status dos acordos)
- ✅ Novo `src/data/site-stats.ts` exporta `siteStats` derivado de `acordos.ts` — fonte única para todas as contagens do site.
- ✅ Novas derivadas em `acordos.ts`: `totalVigentes`, `totalBilateraisVigentes`, `totalMultilateraisVigentes`, `totalIncompletos`.
- ✅ CPLP reclassificada como `status: "ratificacao"` (Cabo Verde e Israel já estavam). Site não conta mais CPLP como "vigente".
- ✅ Stats da home reescritos: "Acordos em vigor" / "Bilaterais em vigor" / "Em ratificação" / "Documentos organizados" (em vez de "Acordos vigentes" + "Bilaterais" + "Multilaterais" misturando ratificação).
- ✅ `/acordos` H1 mostra `{vigentes} em vigor + {ratificação} em ratificação`. Descrição SEO e meta reescritas com contagens corretas.
- ✅ `/guias`, `/profissional`, `/precos` passam a usar `siteStats` em vez de hardcodes ("24 acordos", "25 países", "25 países e três multilaterais").
- ✅ Página `/acordos/:pais` não diz mais "vigente desde X" para acordos em ratificação ou incompletos — passa a indicar o status real no eyebrow.
- 📋 Próximas fases do briefing: jornadas + siglas + prova de vida (Fase 3), SEO/menu/contato/calculadora (Fase 4).

## 2026-06-02 — Briefing Marcos: Fase 2 (tooltips curados em 8 acordos)
- ✅ Novo `src/data/acordo-tooltips.ts` com tooltips revisados por Marcos para 8 acordos: França, Suíça, Portugal, Bulgária, Canadá, Alemanha, Quebec, Itália.
- ✅ Helpers `findTooltipFor` (lookup case/acento-insensitive) e `applyTooltipsToBeneficios` (rename + `insertIfMissing` para benefícios ausentes no dataset gerado, ex.: Suíça inteira, "Pensão de sobreviventes" búlgara, "Seguro de Acidentes" alemão, "Seguro de Deslocamento" do Québec, "Benefícios contra tuberculose" italiano, leis canadenses).
- ✅ `src/data/acordos.ts` aplica o transform sobre `importado.beneficios` ao montar o catálogo — sem mutar o objeto gerado.
- ✅ `BeneficiosComparativo` em `acordos.$pais.tsx` refatorado: nova célula `BeneficioCell` com ícone `Info` (lucide) e Popover shadcn. Tap no mobile, hover/click no desktop. `whitespace-pre-line` preserva os parágrafos do tooltip longo da França.

## 2026-06-02 — Briefing Marcos: Fase 3 (jornadas + siglas + prova de vida + glossário)
- ✅ Jornada `moro-fora` ganha **duas trilhas via Tabs** (`Já recebo benefício do INSS` × `Trabalho fora e quero planejar`). Tipo `Jornada` agora aceita `trilhas?: JornadaTrilha[]` (compat: `passos` consolidado segue alimentando o TOC).
- ✅ Demais jornadas (`vou-me-mudar`, `estou-voltando`, `quero-me-aposentar`) reordenadas para o padrão **diagnóstico → acordo → docs → contribuições → planejamento → simulação → requerimento → acompanhamento**.
- ✅ Bloco `ProvaDeVidaBlock` ganha quadro objetivo de 5 itens (Quando / Como / Validade 90 dias / Nunca enviar por e-mail / Risco do atraso) acima das modalidades.
- ✅ Sigla padronizada: `CDSP` → `CSDP` em `planejamento-totalizacao-block.tsx` (4 ocorrências). Nenhum arquivo do site usa mais `CDSP`.
- ✅ Glossário ampliado para 18 termos: novos verbetes `APSAI`, `Atestado de vida`, `Benefício teórico`, `Benefício pro-rata`, `CSDP`, `DSDP`, `Dupla contribuição`, `Órgão de ligação`, `Residência fiscal` + redefinição de `Carência` mencionando totalização.
- 📋 Próxima fase: Fase 4 — SEO PT-BR / menu Hub / contato / calculadora / blog / contador de fundadores.


## 2026-06-02 — Briefing Marcos: Fase 4 (SEO, menu Hub, contato, calculadora, contador fundadores)
- ✅ `__root.tsx`: removidos 6 metas em inglês duplicados (`International Agreements Hub: Your guide…`). Site fica 100% PT-BR no head global.
- ✅ Footer: link "Jornadas" passa a apontar para `/jornadas` (índice), não mais para `/jornadas/moro-fora`.
- ✅ Header (desktop + mobile): "Entrar" → "Entrar no Hub", "Criar conta" → "Criar conta no Hub" — deixa explícito que o login é do Hub do Advogado.
- ✅ `/contato`: novo bloco "O que esperar" no aside (prazo até 3 dias úteis, aviso de que o envio não cria contrato de honorários, sigilo). E-mail `marcos@acordosinternacionais.com` visível e clicável.
- ✅ `/calculadora`: nota de estimativa abaixo do form ("Resultado estimado. A análise oficial depende dos dados completos do CNIS…").
- ✅ `getFoundersCount` ganha `FOUNDERS_SOCIAL_BASELINE = 23`: vagas exibidas como já preenchidas começam em 23/100 (capped no teto), evitando a sensação de "sou o primeiro a comprar". Não afeta a regra real do webhook (que gateia `lifetime_access` pelo `count` cru do banco).
