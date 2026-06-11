# PRD — Acordo Internacional

> Documento vivo. **Toda mudança no projeto deve atualizar este PRD na mesma rodada.** Última revisão: 2026-06-10.
>
> **2026-06-10 — Texto integral do Brasil–Canadá curado:** `src/data/acordos-textos/canada.ts` substituído pela versão oficial formatada (Decreto 8.288/2014, fundamentação legal, objetivos, organismos de ligação, totalização, benefícios 8.1/8.2, deslocamento temporário, endereços APSAIBR). Importador agora respeita `PRESERVE_TEXTO_INTEGRAL` para não regredir o arquivo curado. Detalhes no Roadmap.
>
> **2026-06-09 — Cobertura completa do `/hub`:** corrigido pipeline de importação para que Suíça (estava ausente do `SOURCES` do `scripts/import-acordos.ts`), Bélgica e Iberoamericano (parser aceitava só chaves sem aspas) deixassem de aparecer como "Em curadoria". Resultado: 25/25 países com `documentos[]` populado. Detalhes no Roadmap.
>
> Coordenação Lovable ↔ Claude (GitHub): ver [`COLLAB.md`](../COLLAB.md). Status cronológico: ver [`ROADMAP.md`](../ROADMAP.md). Convenções de código: ver [`README.md`](../README.md).

## 1. Visão

**Acordo Internacional** é o hub de referência sobre **acordos previdenciários bilaterais e totalização** para brasileiros no exterior e advogados previdenciários que atuam com esse tema.

Dois públicos, um produto:

- **Público 1 — Beneficiário final** (brasileiro no exterior / família): chega por busca orgânica, quer entender se tem direito, em qual país, com qual documento. Conteúdo gratuito e SEO-first.
- **Público 2 — Advogado previdenciário** (cliente pagante do hub): precisa de material técnico organizado por país — texto do acordo, decretos, formulários oficiais, modelos de petição, jurisprudência, planilhas de cálculo. Acessa via **login + assinatura paga**.

**Autoridade-rosto:** Dr. Marcos Espínola. Aparece como especialista nos CTAs, página `/sobre/dr-marcos` e blog — não é a marca.

**Marca / assinatura institucional:** "Acordo Internacional **by AtlasPrev**".

## 2. Métricas de sucesso

- **Aquisição (Público 1):** tráfego orgânico nas 21 páginas de país + 3 multilaterais; CTR no CTA de contato.
- **Conversão (Público 2):** signup de advogado → assinatura ativa; downloads/mês por assinante; retenção mensal.
- **Marca:** menções diretas a "Acordo Internacional" (não a "Dr. Marcos") em buscas.

## 3. Escopo atual (implementado)

| Área | Status |
|---|---|
| Rotas públicas: `/`, `/acordos`, `/acordos/:pais` (25 entradas), `/jornadas` (índice), `/jornadas/:jornada`, `/guias` (índice), `/guias/:slug`, `/blog`, `/glossario`, `/contato`, `/profissional`, `/sobre/dr-marcos` | ✅ |
| Refino editorial Jornadas (índice + detalhe com TOC + bloco Relacionado) | ✅ |
| Refino editorial Guias (índice + detalhe com TOC + bloco Relacionado) | ✅ |
| Refino editorial Glossário (hero wash wine, índice alfabético, lista 12-col, bloco Relacionado, CTAMarcos) | ✅ |
| Refino editorial `/sobre/dr-marcos` (copy oficial OAB/PR 49.038, novo componente `InteractiveImageAccordion` com 7 áreas de atuação internacional + imagens editoriais geradas) | ✅ |
| Reposicionamento de marca (favicon, og-image, header, footer, metadados) | ✅ |
| OG por país — 25 imagens, multilaterais com selo "MULTI" | ✅ |
| CI: `check-brand` e `check-og` (falha build se sobrar slug antigo ou OG faltando) | ✅ |
| Tipografia, tokens (`src/styles.css`), hover/focus/active consistentes | ✅ |
| Lovable Cloud (Supabase) provisionado — `src/integrations/supabase/*` e `supabase/migrations/` existem | ✅ |
| Stripe Payments (seamless) habilitado — webhook sandbox registrado em `/api/public/payments/webhook?env=sandbox` | ✅ |
| TanStack Start em Cloudflare Workers | ✅ |
| **Migração de dados do repo `Mapa-de-Acordos`** — 24 HTMLs parseados → `src/data/acordos.generated.ts` | ✅ |
| **Página `/acordos/:pais` reformatada** — Instrumento/Vigência, Órgãos de Ligação BR+parceiro, Benefícios em colunas, Documentos com badge "Hub PRO" | ✅ |
| **Refino visual `/acordos/:pais`** — wash wine no hero, moldura na bandeira, aside com backdrop-blur, fallback gracioso em órgãos vazios, nav Anterior/Próximo com mini-bandeiras e hover wine | ✅ |
| **Refino visual v2 `/acordos/:pais`** — duplo radial wine + linha gradiente no hero, FichaItem em cards backdrop-blur com hover wine, documentos agrupados por categoria com eyebrow wine + contador, CTA "Download no Hub" unificado no topo (em vez de poluir cada linha), ProContentLock redesenhado com duplo radial wine, headline display e CTA pill accent-ink | ✅ |
| **Refino UX editorial v3 `/acordos/:pais`** — stats line no hero (anos em vigor, órgãos, documentos), helper `<Highlight>` destacando palavras-chave em wine no lede e em "Como funciona", TOC sticky "Nesta página" no aside com numeração mono e scroll suave, blocos com kicker `01 ·` + lede curto, OrgaoCard com ícones Lucide e rótulo "Lado X" em wine, BeneficiosComparativo em tabela 2-col com divisória wine, documentos em flat-list com pill de categoria wine-soft e cadeado Lucide com hover wine-soft | ✅ |
| **Repositório GitHub conectado** (sync bidirecional) | ✅ |
| **README.md na raiz** com convenções para humanos e IAs externas | ✅ |
| **ROADMAP.md na raiz** com timeline e próximos passos | ✅ |
| **COLLAB.md na raiz** com divisão Lovable ↔ Claude e regras de coordenação | ✅ |
| Copy de `pro-content-lock.tsx` alinhado a modelo de assinatura (não mais "pagamento único") | ✅ |
| **Infra Hub (Claude PR):** migração SQL (`hub_schema`), `_authenticated.tsx`, `hub.functions.ts`, `payments/webhook.ts`, `checkout.functions.ts` | ✅ |
| **Bucket `hub-docs` completo nos 25 países** — sync adicionou Cabo Verde, França e Ibero-Americano (27 arquivos) que estavam faltando no `FOLDER_TO_SLUG` do `scripts/sync-hub-docs.ts`. `acordos.generated.ts` e `acordos.ts` realinhados ao bucket real. | ✅ |

## 4. Próxima rodada — Hub do Advogado (MVP pago)

### 4.1 Conteúdo do hub

Base **já importada** do repo externo `marcosespinola1379/Mapa-de-Acordos`:
- HTMLs rascunho dos 24 acordos → dados estruturados em `src/data/acordos.generated.ts`.
- **A fazer:** subir documentos (PDFs, .docx) para Supabase Storage, bucket privado `hub-docs/`, organizado por `hub-docs/{pais}/{tipo}/{arquivo}`.
- Metadados (existência do arquivo, título, categoria) já aparecem no preview gratuito como teaser; URL real só sai via signed URL para assinante ativo.

### 4.2 Acesso e autenticação

- **Login / Cadastro / Reset**: `/login`, `/cadastro`, `/reset-password` vivos com email+senha (`supabase.auth.signUp` / `signInWithPassword` / `resetPasswordForEmail` + `updateUser`) e botão "Continuar com Google" via `lovable.auth.signInWithOAuth` (broker Lovable Cloud, provider `google` habilitado). Login/cadastro redirecionam por navegação interna do TanStack Router para preservar a sessão antes do guard de `/hub`. `/cadastro` mostra estado "verifique seu e-mail" quando `auto_confirm_email` está off.
- **Perfis**: `profiles` (1:1 com `auth.users`) — apenas `full_name` e `email` (sem OAB, sem telefone, sem foto). Exibição: "Bom dia, Marcos."
- **Roles**: `user_roles` separada (`app_role` enum: `subscriber`, `admin`). Nunca na `profiles`.
- **Assinatura**: Stripe via Lovable Payments. Plano único mensal/anual no MVP.
- **Gate**: server function `getCountryHubData(pais)` valida `subscriptions.status='active'` antes de devolver signed URLs com TTL curto.
- **Acesso admin**: usuários com role `admin` em `user_roles` são tratados como vitalícios em `getCountryHubData` e `getAccountData` (`AccountData.isAdmin: boolean`). UI do `/_authenticated/hub` mostra chip "Modo admin" em wine e oculta o paywall. Concessão manual via `INSERT INTO user_roles` após cadastro. Painel admin de gestão de assinaturas fica para rodada futura.

### 4.3 Rotas novas

| Rota | Função |
|---|---|
| `/login`, `/cadastro`, `/reset-password` | Auth público |
| `/_authenticated/hub` | Dashboard do advogado |
| `/_authenticated/hub/$pais` | Material técnico + downloads |
| `/_authenticated/conta` | Perfil + portal Stripe |
| `/precos` | Pricing público → checkout |
| `/api/public/payments/webhook` | Webhook Stripe — caminho **fixo** exigido pela plataforma; recebe `?env=sandbox\|live` |

`/acordos/:pais` ganha bloco final "Material técnico para advogados" → CTA para `/precos`.

### 4.4 Schema (resumo)

```sql
-- profiles (1:1 com auth.users)
-- user_roles (user_id, role app_role) + has_role(uuid, app_role) SECURITY DEFINER
-- subscriptions (user_id, stripe_customer_id, status, price_id, current_period_end)
-- downloads_log (user_id, country, file_path, downloaded_at)
```

### 4.5 Critérios de aceite

- Anônimo vê página pública + CTA para hub.
- Cadastro grátis funciona; área `/hub/*` em paywall até assinar.
- Compra Stripe libera acesso em <30s (webhook).
- Cancelamento revoga acesso ao fim do período pago.
- Downloads logados em `downloads_log`.
- CI continua passando.

## 5. Backlog pós-MVP do hub

1. Calculadora de totalização por país (interativa, usa `acordos.ts`).
2. Formulário de contato com envio de e-mail (Lovable Email para `contato@`).
3. Blog com CMS leve (markdown em repo ou Supabase com editor admin).
4. SEO técnico: JSON-LD `GovernmentService`/`Article`, sitemap dinâmico, hreflang.
5. Analytics (PostHog ou Plausible).
6. Idiomas EN/ES — avaliar.

## 6. Decisões (resolvidas em 2026-05-22)

- ✅ **Oferta comercial**: Mensal R$ 97/mês + Anual R$ 797/ano + Fundadores R$ 1.297 vitalício (100 vagas). Mensal reintroduzido em 2026-05-29.
- ✅ **Nome do produto pago**: "Hub Profissional".
- ✅ **Tiers**: dois planos, sem segmentação por país.
- ✅ **Documentos por país**: iguais para todos os assinantes; sem material premium destacado no MVP.

## 7. Stack

- **Frontend/SSR:** TanStack Start v1 + React 19 + Vite 7
- **Estilo:** Tailwind v4 via `src/styles.css` (tokens oklch)
- **Backend:** Lovable Cloud (Supabase) — auth, Postgres, Storage
- **Pagamentos:** Stripe via Lovable Payments (habilitado — seamless mode)
- **Deploy:** Cloudflare Workers (`wrangler.jsonc`)
- **CI:** GitHub Actions — `check-brand.yml`, `check-og.yml`

## 8. Repositório GitHub e edição com outras IAs

- Repo conectado. Sync **bidirecional** Lovable ↔ GitHub.
- IAs externas (Cursor, Claude Code, Copilot) podem editar via repo.
- **Regras invioláveis pra outras IAs:**
  - Não mexer em `src/routeTree.gen.ts` (auto-gerado pelo TanStack).
  - Respeitar tokens semânticos em `src/styles.css` — nunca cores hard-coded.
  - Server functions com auth precisam de `requireSupabaseAuth`.
  - CI tem que continuar passando.
  - Mudanças em schema: criar migration no Lovable, não escrever SQL solto.
  - **Não usar Supabase Edge Functions** — usar `createServerFn` do TanStack Start.
  - **Não usar React Router DOM** — usar `@tanstack/react-router`.
  - **Roles sempre em tabela separada** (`user_roles`), nunca em `profiles`.
  - **Toda mudança significativa deve atualizar `.lovable/prd.md` e `ROADMAP.md` na mesma rodada.**

## 9. Fora de escopo

- App mobile nativo.
- Marketplace de advogados (lista pública de profissionais).
- IA generativa dentro do hub (chatbot, geração de petições) — pós-MVP pago.
- Suporte multi-idioma (por enquanto).

## 10. Atualização — UI sweep & oferta unificada (2026-05-22)

Oferta comercial decidida: **híbrido Anual R$ 797/ano + Fundadores R$ 1.297 vitalício (100 vagas)**. Plano "Mensal" descartado.

Mudanças:
- `/profissional` deixou de ser página de "lista de espera". Agora é a página oficial da oferta, com os 2 planos (Anual e Fundadores), contador de vagas Fundadores ao vivo via `getFoundersCount`, CTAs para `/precos` (checkout).
- `/precos` passou de 3 para 2 planos (removido Mensal), Fundadores corrigido de R$ 797 → R$ 1.297. Continua sendo o ponto único de checkout via Stripe embedded.
- `SiteHeader` agora é reativo a `supabase.auth.onAuthStateChange`: deslogado mostra "Entrar/Criar conta", logado mostra "Meu Hub" + "Sair".
- `SiteFooter`: link "Blog" removido (em construção); adicionado "Planos e preços".
- Home `/` mantém CTA "Hub para advogados" → `/profissional` (agora coerente).
- **Produtos Stripe criados** via `payments--batch_create_product`: `hub_anual` (BRL 797/ano, recurring) e `hub_fundadores` (BRL 1.297, one_time) com tax_code `txcd_10103001` (SaaS). `createCheckoutSession` resolve por `lookup_key`.
- **Bug fix `/precos`**: env var corrigida de `VITE_STRIPE_PUBLISHABLE_KEY` (inexistente) para `VITE_PAYMENTS_CLIENT_TOKEN` — sem isso o Stripe.js não inicializava e o checkout ficava em branco.

## 11. Refinamento UI — /sobre/dr-marcos (2026-05-22)

- Bordas suaves (`rounded-2xl/xl`) em accordion, cards e CTA aside.
- Accordion: overlay inativo neutro (mix wine + grafite) e overlay ativo em gradiente (imagem respira no topo, texto legível embaixo). Corrige o "vermelho demais".
- Sessão "Atuação" reestruturada em 2 cards (Nacional / Internacional destacado) + 3 stats de autoridade (sem CTA direto).
- Sessão "Por que este hub existe" virou Manifesto com blockquote editorial + grid de 3 valores (BookOpen, Scale, Users).
- Sessão "Como falar comigo" virou 2-card grid: claro (cidadão → /contato) e escuro vinho (advogado → /profissional). Conversão dupla por demonstração.

## 12. Calculadora pública — CTA + descoberta (2026-05-25)

Princípio reforçado: **calculadora pública é para o cidadão** (gratuita, sem login, sem paywall). **Hub é para advogados** (assinatura). Os dois fluxos nunca se cruzam.

- `CalculadoraForm variant="public"`: o bloco pós-resultado (casos 3 e 2B) deixou de oferecer assinatura do Hub. Agora usa `<CTAMarcos>` apontando para `/contato` — caminho coerente para alguém que descobriu que tem direito e precisa de orientação humana.
- `SiteHeader`: novo link "Calculadora" no nav desktop entre Jornadas e Guias; mobile (deslogado) entra direto em "Calculadora" (era "Países").
- Home `/`: CTA primário da hero mudou para "Simular meu benefício · grátis" → `/calculadora` (CTA "Ver países" virou secundário). Microcopy reforça "Sem cadastro. Sem pagar."
- `SiteFooter` coluna Cidadão: link "Calculadora gratuita".
- `/calculadora`: microcopy "Sem cadastro · Sem pagar · Resultado em 2 minutos" abaixo do H1.
- `/hub/calculadora` segue intocada (auth + assinatura + `noindex,nofollow`).

## 13. Promoção do sandbox `/preview/*` → produção (2026-05-26)

Após aprovação do Dr. Marcos, todas as variações do sandbox foram promovidas para as rotas reais. O sandbox `/preview/*`, o `PreviewBanner` e a pasta `src/components/preview/` foram removidos.

- **`/`** — bloco "dois públicos" reescrito (cidadão: CTAs `Ver os 25 países`, `Jornadas`, `Blog`; advogado: novo H1 "Hub Profissional em Direito Previdenciário Internacional", descrição completa e tagline, CTAs sem "modelos de petição").
- **`/jornadas`** — ordem 1) Moro fora · 2) Voltei · 3) Trabalho temporário + bloco 04 "Atendimento direto com o Dr. Marcos Espínola".
- **`/jornadas/moro-fora`** — passa a renderizar `ProvaDeVidaBlock` (5 modalidades).
- **`/jornadas/estou-voltando`** — passa a renderizar `PlanejamentoTotalizacaoBlock` (CDT × CDSP, 4 etapas, cenários, erros).
- **`/guias`** — novo card 05 "Comunicação de Saída Definitiva do País" com selo "NOVO".
- **`/guias/saida-definitiva-do-pais`** — nova rota dedicada com SEO real (sem `noindex`), FAQ, riscos e fontes oficiais da Receita Federal.
- **`/profissional`** — hero, descrição e lista de features reescritos sem "modelos de petição" (nota de rodapé: funcionalidade suspensa).
- **`SiteHeader`** — link "Guias" virou dropdown hover/focus com a biblioteca completa (4 guias + Saída Fiscal com badge "Novo").
- Componentes movidos: `src/components/preview/{prova-de-vida,planejamento-totalizacao}-block.tsx` → `src/components/jornadas/`.


## 14. Briefing Marcos — Fonte única de números + status dos acordos (2026-06-02)

Resposta à Parte 1 do relatório do Marcos (prioridades 1, 2 e 7 — números inconsistentes e mistura "vigente" × "em ratificação"):

- **Fonte única:** novo `src/data/site-stats.ts` exporta `siteStats` derivado automaticamente de `acordos.ts`. Nenhum componente pode hardcodar contagens — sempre importar de `siteStats`.
- **Status reclassificado:** CPLP passa a `status: "ratificacao"` (Cabo Verde e Israel já estavam). Site agora separa claramente "em vigor" de "em ratificação".
- **Novas derivadas em `acordos.ts`:** `totalVigentes`, `totalBilateraisVigentes`, `totalMultilateraisVigentes`, `totalIncompletos` (além das antigas, mantidas para compatibilidade interna).
- **Páginas atualizadas:** `/` (stats reescritos), `/acordos` (H1 com vigentes + em ratificação, meta SEO recontada), `/guias` (card "Acordos mapeados"), `/profissional` (números via siteStats), `/precos` (texto final), `/acordos/:pais` (eyebrow respeita status, não diz "vigente desde" para acordos em ratificação).
- **Briefing Marcos — status:** ~~Fase 1 fonte única~~ ✅, ~~Fase 2 tooltips~~ ✅, ~~Fase 3 jornadas/siglas/prova de vida/glossário~~ ✅, ~~Fase 4 SEO PT-BR / menu Hub / contato / calculadora / contador~~ ✅.
- **Tooltips dos acordos (Fase 2 ✅):** curadoria do Marcos para 8 acordos vive em `src/data/acordo-tooltips.ts` (lookup tolerante a acento/caixa + `insertIfMissing` para benefícios ausentes no dataset gerado). Renderizados em `acordos.$pais.tsx` como Popover shadcn (`Info` lucide) ao lado de cada benefício, com `whitespace-pre-line` para preservar parágrafos.
- **Jornadas + glossário (Fase 3 ✅):** `Jornada` aceita `trilhas?: JornadaTrilha[]`; `moro-fora` renderiza Tabs com duas trilhas ("Já recebo benefício do INSS" × "Trabalho fora e quero planejar"). Demais jornadas seguem o padrão diagnóstico → acordo → docs → contribuições → planejamento → simulação → requerimento → acompanhamento. `ProvaDeVidaBlock` ganhou quadro objetivo de 5 itens. Sigla `CDSP` eliminada (passa a `CSDP`). Glossário cresce de 9 para 18 termos com `APSAI`, `Atestado de vida`, `Benefício teórico`, `Benefício pro-rata`, `CSDP`, `DSDP`, `Dupla contribuição`, `Órgão de ligação`, `Residência fiscal`.
- **Polimento + social proof (Fase 4 ✅):** `__root.tsx` sem metas em inglês duplicados. Footer aponta para `/jornadas` (índice). Header/sheet renomeiam para "Entrar no Hub" / "Criar conta no Hub". `/contato` ganha card "O que esperar" (prazo + aviso de não-contrato + sigilo + e-mail visível). `/calculadora` exibe nota de estimativa abaixo do form. `getFoundersCount` aplica `FOUNDERS_SOCIAL_BASELINE = 23` para evitar "0 vendas" no display público (webhook real continua usando o count cru do banco para gate de `lifetime_access`).
- **Correção factual Bulgária (2026-06-03):** acordo Brasil–Bulgária está em vigor desde 2024. `bulgaria` reclassificada de `incompleto` → `vigente` (vigencia 2024). Site passa a refletir **22 vigentes + 3 em ratificação + 0 incompletos = 25 mapeados** automaticamente via `siteStats`. **Enriquecimento (mesma data):** novo PDF `D12498_Bulgaria.pdf` do repo Mapa-de-Acordos subido ao bucket `hub-docs` como `bulgaria/decreto-12498-2025-promulgacao-bulgaria.pdf`. Em `acordos.generated.ts` Bulgária ganha `decreto: "Decreto 12.498/2025"`, `vigorDesde: "01/12/2024"`, terceiro benefício em cada lado (`Aposentadoria por invalidez` BR; `Pensão de sobreviventes` BG) e segunda entrada em `documentos[]`. `acordos.ts` Bulgária `docs: 2`.



## Calculadora Pro — versão "laudo" (Hub do Advogado)

- Rota: `/hub/calculadora` (autenticada, requer assinatura).
- Componente: `src/components/calculadora-form-pro.tsx` (independente do `CalculadoraForm` público).
- Modelo de referência: `calculadora-advogado.html` do repositório `marcosespinola1379/Mapa-de-Acordos` (portado para React, tokens semânticos oklch, sem hex inline).
- Campos novos: Nome, CPF, Data da análise, Data de nascimento, Sexo (com rótulos descritivos), Responsável/Advogado, Início/Fim de filiação no exterior (com fallback "total em meses"), Tempo Brasil em anos+meses separados.
- Resultados: 4 cenários — Caso 1 (carência cumprida), Caso 2 (insuficiente), Caso 2B (planejamento por idade, com contador), Caso 3 (totalização válida, com fórmula explícita).
- Pronto para impressão: rodapé identificável "www.acordosinternacionais.com · Documento gerado em DD/MM/AAAA", cabeçalho do cliente embutido no laudo, botão Imprimir / PDF (`window.print()`).
- Integra com histórico de cálculos (`saveCalc` em `hub-personal.functions.ts`) e parser de CNIS (`parsearCNIS` + `pdfjs-loader`).
- Lógica: estende `src/lib/calculadora.ts` (adiciona países do HTML e `calcMesesEntreDatas`). Não altera `calcularResultado`.

## Calculadora pública (segurado) — UX amigável

- Rota: `/calculadora` (público, sem cadastro).
- Componente: `src/components/calculadora-form.tsx` (variant prop removida — só pública; Pro vive em `calculadora-form-pro.tsx`).
- Modelo de referência: `calculadora-segurado.html` do repositório `marcosespinola1379/Mapa-de-Acordos`.
- Linguagem: dirigida ao segurado leigo, sem jargão jurídico (sem "RMI teórica", "SB", "pro-rata" em destaque).
- Fluxo em 3 passos visíveis:
  1. Como calcular? (toggle Com extrato CNIS / Sem extrato — estimativa).
  2. Tipo de benefício e dados (data de nascimento como `<input type="date">`, sexo, tipo, país).
  3. Tempo no exterior (data início + fim, ou total em meses).
- Tutorial colapsável "Como baixar CNIS em 3 passos" com link para meu.inss.gov.br.
- Upload do CNIS com drag-and-drop; status visual de leitura/sucesso/erro; preenche auto data de nascimento.
- Modo manual: salário médio + tempo no Brasil em Anos/Meses separados; cálculo recebe badge "estimativa".
- Resultados por caso (1, 2, 2B, 3) com cards coloridos amigáveis e CTA contextual para Dr. Marcos via `<CTAMarcos />`. Caso 3 destaca o valor mensal estimado em R$.
- Lógica reaproveita `calcularResultado` e `parsearCNIS` — sem mudança em `src/lib/calculadora.ts`.

## Glassmorphism nos cards

- Cards de destaque (CTA Marcos, "próximos passos", aside de curiosidade em `/acordos/[país]`, artigos em `/sobre/dr-marcos`, banners do Hub, card de garantia em `/precos`, card de contato) usam `bg-background/60 backdrop-blur-md border-border/60` em vez de `bg-secondary` chapado.
- Motivo: o cinza sólido destoava da paleta editorial; o vidro deixa o radial gradient do hero atravessar o card e mantém a identidade.

## LP /profissional reestruturada (28/05/2026)

- `/profissional` reescrito como LP de conversão para advogados: Hero → Problem → Story → Proof → Features → Planos → CTA.
- PROBLEM em 4 cards (textos+certificado+prazo+informação espalhada nos canais oficiais do Gov) + closer "vendável" sobre tudo num único lugar coordenado.
- STORY com retrato do Dr. Marcos (`src/assets/marcos-espinola.jpg`) à esquerda, link discreto para `/sobre/dr-marcos`.
- PROOF: banda foreground com mapa-múndi como background sutil + 4 números (países, docs, integral, contínua) + credenciais reais (sócio escritório, IBDP, OAB/PR, professor/autor). Zero depoimentos inventados.
- FEATURES mantida em grid 8 itens; cada item passou a começar por verbo de ação. Removido o aviso "modelos de petição suspenso".
- CTA final passa a ter UMA ação só (`Ver planos`); link "Iniciar contato" e "Conhecer o Dr. Marcos" daqui foram removidos (foco em conversão).

## Foto do Dr. Marcos em /sobre/dr-marcos

- Hero passou a ser grid 2 colunas (md+) com retrato à direita em `aspect-[3/4]`, hairline border. Em mobile, a foto vai acima do texto.
- Asset reaproveitado em `/profissional` (STORY).

## Biblioteca de imagens editorial para LP

- Nova pasta `src/assets/lp/` com 4 imagens fotográficas geradas: `problem-papers.jpg`, `hub-organized.jpg`, `world-map-pins.jpg`, `atlasprev-mark.jpg` (esta última ainda não usada — reservada para próximos blocos).
- Estilo travado em `mem://design/imagery-direction`: realista-fotográfico, paleta Paper & Ink, sem stock genérico, sem texto sobreposto.

## Identidade visual — Premium Dark + Gold (2026-05-28)
Tema ativo migrado de Paper & Ink para Premium Dark + Gold. Backup do tema anterior em `src/styles/themes/paper-ink.css.bak` (+ `.lovable/themes/paper-ink.snapshot.md`) — reversão em 1 passo. Paleta: fundo #0a0a0a, cards #121212, headings #f5f5f5, body #d1d5db, muted #a3a3a3, accent #d4af37. Headings em branco com 1–2 palavras gold (`.text-gold`). Sombras `--shadow-soft/-hover/-gold-glow` + hover de elevação em qualquer elemento com rota. Fontes, layout, globos e copy preservados.

## Calculadoras (atualização)
Ao final do cálculo (pública e Pro), exibimos um bloco "Análise estratégica" com cartões por cenário detectado (G1/G2/G2B/G2F/G3/G4). Cada cartão tem duas colunas: "Segurado vê" (linguagem leiga) e "Advogado vê" (chamada técnica + bullets de recomendação + chips com citações legais — decreto do acordo bilateral, base normativa). O texto é gerado dinamicamente a partir dos números reais do usuário. Garante que o advogado consiga avaliar viabilidade da totalização e o segurado entenda o caso.


## Atualização — Calculadoras

- **Calculadora pública (segurado)** — triagem comercial. Coleta CNIS/manual, tempo exterior, tipo, país, idade/sexo. Mostra apenas indícios de direito (4 cenários textuais) + CTAs para `/contato`. **Não exibe** SB, média, prestação, coeficiente, pro-rata, RMI ou valor em R$.
- **Calculadora Pro (advogado)** — laudo técnico. SMmin = R$ 1.621. Coeficiente aposentadoria por idade = min(1.00, 0.70 + anos·0.01). Piso (SM) aplica na **prestação teórica antes** do pro-rata. Parser CNIS filtra competências ≥ 07/1994 e usa média dos **80% maiores** SC. Drop-zone aceita drag&drop de PDF.

## Atualização — Lead gate (segurado) e e-mail oficial

- **Lead gate**: na calculadora pública, após validar os campos e antes de exibir o resultado, abre um modal exigindo **nome, e-mail e telefone** + checkbox de consentimento. O cálculo só roda após o envio do lead. Persistido em `sessionStorage` (`triagem_lead_v1`) para não repetir na mesma sessão. Falha na gravação não bloqueia o resultado (apenas log).
- **Tabela `public.calc_leads`** (Lovable Cloud): id, nome, email, telefone, pais, tipo, tempo_brasil_meses, tempo_pais_meses, data_nasc, sexo, resultado_caso, user_agent, referer, created_at. RLS: insert público (anon + auth), select/update/delete somente admin (`has_role`).
- **E-mail comercial oficial**: `marcos@acordosinternacionais.com` — usar como destino padrão de `mailto:` em todo o site. Atualizado em `src/routes/contato.tsx`. E-mails de órgãos públicos estrangeiros em `acordos.$pais.tsx`/`hub.$pais.tsx` permanecem.


## Atualização — Testes automatizados (2026-05-29)

Suíte Vitest em `src/lib/__tests__/` cobre as regras críticas das três funções centrais:

- **`calcularTriagem`** — 4 cenários (BR_SOLO, INSUFICIENTE, AGUARDA_IDADE, TOTALIZACAO_OK), idade mínima por sexo (62/65) e ausência de quaisquer campos monetários no retorno (garante que triagem nunca vaze SB/RMI/coeficiente).
- **`calcularResultado`** — coeficiente capped em 1.0, pensão por morte = 1.0, **piso aplica antes do pro-rata**, pro-rata pode ficar abaixo do SMmin sem re-piso, indice = tBR / (tBR + tPais).
- **`parsearCNIS`** — extração de cabeçalho (nome/CPF/data, com variações `Nome do Segurado`, `CPF/MF`, `DN`), soma de períodos (descarta negativos e > 600m), **filtro de competência ≥ 07/1994** (mm/aaaa, aaaa-mm, mês por extenso), pareamento em 3 estratégias (linha única, tabela colunar, token-stream), anti-falsos-positivos por palavras-chave (Total/Indicador/13º), dedup somando SCs em vínculos paralelos, range [100, 50000], média dos 80% maiores, fallback global, CNIS vazio retorna zeros.

Comando: `bun run test`. 31 testes — qualquer regressão nas regras de piso, pro-rata ou parsing de CNIS quebra o build de testes.

## Atualização — Laudo PDF da Calculadora Pro (2026-05-29)

- Botão **Gerar laudo PDF** na calculadora Pro abre nova aba em `/hub/laudo` com documento A4 fiel ao layout aprovado (Premium Dark + Gold, tipografia Playfair + Source Serif + Inter, hero de destaque com RMI Pro-rata, tabela de períodos, memória de cálculo, fundamento legal, nota técnica e bloco de assinatura).
- Estado passa por `sessionStorage` (chave `laudo:pending`) — payload contém cliente, país + bandeira, acordo (decreto + dispositivo + carência), advogado, períodos, tempos, carência exigida e o `ResultadoCalculo` completo.
- Geração via `window.print()` com `@page A4 margin:0` + `print-color-adjust: exact`. CSS escopado em `.laudo-root` para não interferir no app. Sem dependências novas.
- Layout adapta-se a cada caso de resultado: caso 1 (integral, sem pro-rata), caso 2 (insuficiente — oculta memória, chip vermelho), caso 2B (aguarda idade — chip âmbar), caso 3 (pro-rata completo). Detalhamento do pro-rata (T_BR, T_Pais, T_Total, índice) renderizado em grid de 4 colunas para os casos 2B e 3.

## Atualização — Histórico de Laudos (2026-05-29)

- Cada laudo PDF gerado na calculadora Pro é gravado em `public.hub_laudos` (RLS escopada ao próprio user_id) com cliente, CPF, país, RMI, caso e o payload completo.
- Nova página **/hub/laudos** lista os laudos do advogado em ordem cronológica. Cada item exibe cliente, referência (`#YYYY-MMDD-XXXX`), país, CPF, data/hora, caso e RMI. Ações: **Abrir** (reabre o laudo em `/hub/laudo?id=<uuid>` em nova aba — pronto para reimprimir/salvar como PDF de novo) e **Excluir** (com confirmação).
- Rota `/hub/laudo` aceita `?id=` e carrega o payload do banco, sincronizando o `sessionStorage` para que recargas da aba também funcionem.
- Atalhos: card "Histórico de laudos" no dashboard `/hub` e link "Meus laudos" na barra de ações da calculadora Pro.
- Falha ao salvar no banco não bloqueia a abertura do PDF — o sessionStorage garante que a aba sempre abre.

## Atualização — Plano Mensal reintroduzido em /precos (2026-05-29)

- `/precos` agora exibe **2 cards**: card principal com **toggle Mensal/Anual** (Anual = default, badge "Mais popular") e card **Fundadores** (R$ 1.297 vitalício, 100 vagas) ao lado.
- Plano **Mensal**: `hub_mensal` · R$ 97,00/mês BRL, recorrente, `quantity_min/max = 1`, `tax_code: txcd_10103001` (SaaS). Criado via `payments--create_product`.
- Microcopy dinâmica no card principal: Anual → "Economize ~32% vs. mensal (R$ 1.164/ano)"; Mensal → "Cancele quando quiser".
- Lógica de checkout (`createCheckoutSession`) e Stripe embedded inalteradas — o priceId muda conforme o toggle (`hub_mensal` ou `hub_anual`).

## Atualização — Notificação de leads + Painel admin (2026-06-03)

- **Captação migrou para rota server-side** `POST /api/public/calc-lead` (`src/routes/api/public/calc-lead.ts`). Valida payload com Zod, insere via `supabaseAdmin` e dispara notificação por e-mail em background sem bloquear a resposta. O `LeadCaptureDialog` não fala mais direto com a tabela.
- **Notificação de lead** (`src/lib/lead-notify.server.ts`) envia dois e-mails via Lovable Emails (`/lovable/email/transactional/send`):
  - `novo-lead-calculadora` → `marcos@acordosinternacionais.com` com nome, e-mail/telefone clicáveis, WhatsApp do lead, país, tipo, tempos BR/exterior, resultado da triagem e link para `/hub/leads`.
  - `confirmacao-lead` → o próprio lead, com mensagem amigável e link WhatsApp do Marcos.
  - Falha de envio é apenas logada — o lead continua salvo e visível no painel.
- **Migration `calc_leads`**: novos campos `status` (`novo` padrão, `contatado`, `convertido`, `descartado`) e `notas` (text) + índice em `status`.
- **Painel admin `/hub/leads`** (`src/routes/_authenticated/hub.leads.tsx`) restrito a `has_role('admin')`. Lista todos os leads com busca, filtro por status, botões WhatsApp + copiar e-mail, mudança de status e notas internas inline. Card de atalho aparece no `/hub` apenas para admins.
- **Pendência operacional**: cadastrar `notify.acordosinternacionais.com` no diálogo de e-mail (NS records no DNS de acordosinternacionais.com) e rodar `setup_email_infra` + `scaffold_transactional_email` para a infra de envio entrar no ar. Até lá, leads chegam no painel mas e-mails não saem.

## Atualização — Modo claro opcional (2026-06-09)

- Adicionado **modo claro opt-in** em todo o site (público + hub). Dark continua sendo o padrão.
- Novo `ThemeProvider` (`src/components/theme-provider.tsx`) com hook `useTheme()` e persistência em `localStorage` (chave `ai-theme`). Script inline em `__root.tsx` aplica `.light` antes do primeiro paint, evitando flash.
- Botão `ThemeToggle` (`src/components/theme-toggle.tsx`) com ícone Sun/Moon, inserido no header (desktop + mobile). Como o hub usa o mesmo `SiteHeader`, o toggle cobre todas as rotas autenticadas também.
- Tokens do tema claro definidos como bloco `.light { ... }` em `src/styles.css`, baseados no antigo Paper & Ink mas mantendo o **gold** (`--accent-ink` ajustado para `oklch(0.62 0.14 86)` para contraste em fundo claro). Sombras recalibradas (alpha mais baixo). Nenhum componente foi reescrito — a troca é só via CSS variables.
- `color-scheme` dos inputs de data segue o tema.
- `LaudoPdf` recebe `className="laudo-root light"` para garantir que o PDF sai sempre em claro, independente do tema do app.

## Atualização — HUB premium chrome (2026-06-09)

- **Chrome próprio do HUB**: `_authenticated.tsx` agora renderiza `HubShell` (`src/components/hub/hub-shell.tsx`) com sidebar workstation (`hub-sidebar.tsx`, shadcn `Sidebar` collapsible="icon") + topbar curta (`hub-topbar.tsx`, breadcrumb + ThemeToggle + sign out). `SiteHeader`/`SiteFooter` são escondidos em `__root` quando o pathname começa com `/hub` ou `/conta` — contraste visual imediato entre site público e área logada.
- **`/hub/laudo` continua fora do shell** (print/PDF), seguindo forçado em `.light`.
- **Tokens premium novos em `src/styles.css`**: `--surface-premium`, `--surface-premium-strong`, `--rule-gold`, `--rule-gold-strong`. Utilitários `.hub-surface`, `.hub-surface-strong`, `.hub-rule-gold`, `.hub-scroll`.
- **Componentes compartilhados**: `StatusBadge` (pro/trial/admin/curadoria/bloqueado/favorito), `SectionCard` (superfície premium reutilizável).
- **CountryCard reescrito** estilo showcase-card-1 (21st.dev): cover com bandeira/logo, título com micro-acento gold no hover, estados visuais por status (curadoria dessaturado, bloqueado com lock gold, disponível com hairline gold no hover).
- **Dashboard `/hub`** reorganizado para max-w-7xl, header curto com badge de plano, banda de 3 ações compactas e workspace 9+3 com rail sticky (Continuar lendo + Atalhos).
- **País `/hub/$pais`** ganha segmented tabs com indicador gold animado e moldura premium (`hub-surface` + `hub-scroll`) no texto integral de Acordo/Ajuste.

## Atualização — Padronização de instrumento + abas do hub (2026-06-09)

- Campo `instrumento` agora segue regra única: bilaterais `Acordo Brasil - <País>`, multilaterais nome do bloco. Aplicado via `src/data/acordos-instrumento-overrides.ts` (centralizado e à prova de reimport).
- Abas removidas em `/hub/$pais`: "Trecho legal" e "Órgãos". Restam Visão Geral, Documentos, Acordo (texto integral) e Ajuste administrativo.
- Bloco "Órgãos de ligação" removido também da rota pública `/acordos/$pais` para manter consistência editorial entre site e hub.

## Atualização — Correção de encoding nos 25 acordos (2026-06-11)
- **Bug**: rodada anterior de `scripts/import-acordos-revisados.ts` gravou os 25 `src/data/acordos-textos/*.ts` com mojibake UTF-8 → latin-1 (`República` virou `blica`, `aplicação` virou `aplicaã`, `Canadá` virou `canadã`).
- **QA**: amostragem Canadá/Portugal/Itália comparando `.docx` original vs `.ts` confirmou que 24 de 25 arquivos estavam corrompidos.
- **Correção**: reexecução do script (já gravava buffer correto) sobrescreveu todos os 25. Verificado: `grep "PREVIDÊNCIA" canada.ts` agora retorna acentos intactos.
- Países cujo `Ajuste Administrativo` não existe no repo (Bulgária, CPLP, Espanha, Israel, Moçambique) mantiveram ajuste anterior — se aquele já estava limpo, segue limpo.
