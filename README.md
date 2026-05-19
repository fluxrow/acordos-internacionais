# Acordo Internacional — by AtlasPrev

> Hub de referência sobre **acordos previdenciários internacionais** e **totalização** para brasileiros no exterior e advogados previdenciários.

- 🌐 Produção: https://acordosinternacionais.com
- 🧪 Preview Lovable: https://acordosinternacionais.lovable.app
- 📚 Repo de conteúdo (fonte dos dados por país): https://github.com/marcosespinola1379/Mapa-de-Acordos

---

## Sobre o projeto

**Acordo Internacional** é um produto **by AtlasPrev**, com **Dr. Marcos Espínola** como rosto especialista (não é a marca). Atende dois públicos no mesmo site:

- **Beneficiário final** — brasileiro no exterior ou família, chega por busca orgânica. Conteúdo gratuito, SEO-first.
- **Advogado previdenciário** — acessa via **login + assinatura paga** (hub PRO em construção) para baixar formulários oficiais, decretos, modelos de petição e material técnico organizado por país.

Cobertura atual: **25 acordos** (21 bilaterais + Suíça com fonte externa + 3 multilaterais: CPLP, Mercosul, Ibero-Americano).

---

## Stack

- **TanStack Start v1** (React 19 + Vite 7) com SSR
- **Cloudflare Workers** (deploy via `wrangler.jsonc`, runtime `nodejs_compat`)
- **Tailwind v4** via `src/styles.css` com tokens semânticos em `oklch`
- **shadcn/ui** para componentes base
- **Lovable Cloud** (Supabase gerenciado): Auth, Postgres, Storage
- **Stripe** via Lovable Payments — rodada do hub pago (ainda não habilitado)
- **CI**: GitHub Actions (`check-brand`, `check-og`)
- **Bun** como package manager e runtime de scripts

---

## Como rodar

```bash
bun install
bun run dev        # http://localhost:8080
```

> ⚠️ **Não rode `bun run build` manualmente** dentro do ambiente Lovable — o harness já faz build e typecheck automaticamente. Rode build local apenas se estiver desenvolvendo fora da Lovable (Cursor / Claude Code / etc.).

Scripts úteis:

```bash
bun run scripts/import-acordos.ts   # Atualiza dados técnicos a partir do repo Mapa-de-Acordos
bash scripts/build-og.sh            # Gera imagens OpenGraph por país
bun run scripts/check-og.ts         # CI: valida cobertura de OG
bun run scripts/check-brand.ts      # CI: garante que nenhuma marca antiga vazou
```

---

## Estrutura de pastas

```
src/
  routes/                  # File-based routing (TanStack). NÃO editar routeTree.gen.ts
    __root.tsx             # Layout raiz (html/head/body shell, providers)
    index.tsx              # Home
    acordos.index.tsx      # Listagem de acordos
    acordos.$pais.tsx      # Página dinâmica de cada acordo (25 entradas)
    jornadas.$jornada.tsx  # Jornadas editoriais
    guias.$slug.tsx        # Guias práticos
    blog.tsx, glossario.tsx, contato.tsx, profissional.tsx
    sobre.dr-marcos.tsx
    api/public/            # Webhooks e endpoints públicos (auth-free)

  data/
    acordos.ts             # Catálogo curado (storytelling, slugs, rotas)
    acordos.generated.ts   # Dados técnicos importados do repo Mapa-de-Acordos
    acordos.types.ts       # Tipos compartilhados entre os dois acima
    guias.ts, jornadas.ts  # Conteúdo editorial

  components/
    ui/                    # shadcn/ui — preferir variantes em vez de editar
    site-header.tsx, site-footer.tsx
    cta-marcos.tsx         # CTA com Dr. Marcos
    pro-content-lock.tsx   # Gate visual para conteúdo do hub PRO

  styles.css               # ÚNICA fonte de cores e tokens (oklch). Sem hex em componentes.
  router.tsx               # Bootstrap do router
  server.ts, start.ts      # Entry SSR + middleware global

scripts/
  import-acordos.ts        # Baixa HTMLs do Mapa-de-Acordos → acordos.generated.ts
  build-og.sh              # Gera public/og/*.jpg por país
  check-og.ts              # CI: valida OG para os 25 acordos
  check-brand.ts           # CI: garante marca consistente

public/
  og/                      # OG images por slug (multilaterais com selo "MULTI")

.lovable/
  prd.md                   # PRD vivo do produto
  plan.md                  # Plano da rodada em curso

.github/workflows/         # check-brand.yml, check-og.yml
```

---

## Conteúdo dos acordos

Os dados técnicos por país (decretos, vigência, órgãos de ligação, benefícios, formulários) vêm do repositório de conteúdo:

**👉 https://github.com/marcosespinola1379/Mapa-de-Acordos**

Para sincronizar:

```bash
bun run scripts/import-acordos.ts
```

Isso baixa os 24 HTMLs rascunho, parseia com `node-html-parser` e regenera `src/data/acordos.generated.ts`. O catálogo curado em `src/data/acordos.ts` faz **merge** com os dados importados — campos técnicos vêm do generated, narrativa fica no curado.

PDFs e documentos para download (rodada do hub pago) vão para Supabase Storage no bucket privado `hub-docs/{pais}/{tipo}/{arquivo}`, servidos via signed URL apenas para assinantes.

---

## Convenções para contribuição (humanos e IAs externas)

Este repo é editado em paralelo pela Lovable e por IAs externas (Claude Code, Cursor, Copilot). Para manter o projeto saudável:

1. **Nunca editar `src/routeTree.gen.ts`** — é auto-gerado pelo plugin Vite do TanStack a cada build/dev.
2. **Cores SEMPRE via tokens semânticos** definidos em `src/styles.css` (formato `oklch`). Proibido `text-white`, `bg-black`, `#hex` ou cores diretas em componentes.
3. **Roteamento**: usar `@tanstack/react-router` (`Link`, `useNavigate`, `useParams`, `useRouter`). **Nunca** `react-router-dom`.
4. **Backend**:
   - Lógica interna da aplicação → `createServerFn` de `@tanstack/react-start` em arquivos `*.functions.ts` (em `src/lib/` ou próximo da rota).
   - Webhooks e APIs públicas → `createFileRoute` em `src/routes/api/public/*` com verificação de assinatura HMAC obrigatória.
   - **NÃO usar Supabase Edge Functions.**
5. **Auth em server functions privadas**: middleware `requireSupabaseAuth` de `@/integrations/supabase/auth-middleware`. O global `attachSupabaseAuth` já está registrado em `src/start.ts`.
6. **Clients Supabase**:
   - `client.ts` → browser (auth, realtime). Publishable key, RLS aplica.
   - `auth-middleware.ts` → server functions com contexto do usuário. RLS aplica como aquele usuário.
   - `client.server.ts` → **service role, BYPASSA RLS**. Só em server routes verificados (webhooks). Nunca importar em código client.
7. **Roles**: sempre em tabela **`user_roles` separada** (enum `app_role`) + função `has_role(uuid, app_role)` `SECURITY DEFINER`. **Nunca** armazenar role em `profiles` (vulnerabilidade de escalada de privilégio).
8. **Schema/migrations**: usar o fluxo de migration do Lovable Cloud. Não escrever SQL solto em commits.
9. **Server runtime = Cloudflare Workers** (`nodejs_compat`). Evitar `child_process`, `sharp`, `puppeteer`, `canvas`, `fs.watch`, e qualquer pacote Node-only. Preferir libs com build edge/WASM ou APIs Web padrão.
10. **Env vars**:
    - Browser: `import.meta.env.VITE_*` (substituídas em build, públicas)
    - Server: `process.env.*` lido **dentro de `.handler()`** (nunca no escopo do módulo, fica `undefined`)
11. **SEO**: cada rota com `head()` próprio — title <60 chars, description <160 chars, H1 único, `alt` em imagens, `og:image` apenas em leaf routes (não no `__root.tsx`).
12. **CI obrigatório**: `check-brand` e `check-og` precisam passar. Adicionou um país novo? Gere a OG com `scripts/build-og.sh` e rode `scripts/check-og.ts` antes de commitar.
13. **Marca**: "Acordo Internacional" é o **produto**, "AtlasPrev" é a **empresa**, "Dr. Marcos Espínola" é o **rosto especialista**. Não confundir em copy, OG, headers ou metadados.

---

## Fluxo Git e co-edição

- Sync **bidirecional** Lovable ↔ GitHub: mudanças em qualquer lado se propagam.
- **Mudanças grandes** (features, refactors, schema): criar branch + PR com descrição.
- **Fixes pequenos** (copy, ajuste de estilo dentro dos tokens, typo): commit direto na main é aceitável.
- IAs externas: leia este README e `.lovable/prd.md` **antes** de propor mudanças. Respeite as convenções da seção anterior.

---

## Roadmap

PRD completo e vivo em [`.lovable/prd.md`](./.lovable/prd.md).

**Próxima rodada — Hub do Advogado (MVP pago):**

- Auth (e-mail/senha + Google) via Lovable Cloud
- Tabelas: `profiles`, `user_roles`, `subscriptions`, `downloads_log`
- Assinatura Stripe (plano único mensal/anual) via Lovable Payments
- Rotas `/login`, `/cadastro`, `/_authenticated/hub`, `/_authenticated/hub/$pais`, `/_authenticated/conta`, `/precos`
- Webhook `/api/public/stripe-webhook` com verificação HMAC
- Documentos por país em Supabase Storage privado com signed URLs

**Backlog pós-hub:** calculadora de totalização, formulário de contato com e-mail (Lovable Email), CMS leve para blog, JSON-LD/sitemap dinâmico, analytics (PostHog/Plausible), avaliação de EN/ES.

---

## Licença

Proprietário — © AtlasPrev. Todos os direitos reservados.
