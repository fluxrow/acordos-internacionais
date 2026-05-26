# PRD — Acordo Internacional

> Documento vivo. **Toda mudança no projeto deve atualizar este PRD na mesma rodada.** Última revisão: 2026-05-19.
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

- ✅ **Oferta comercial**: híbrido — Anual R$ 797/ano + Fundadores R$ 1.297 vitalício (100 vagas). Plano mensal descartado.
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
