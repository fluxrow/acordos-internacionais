## Objetivo

Criar `README.md` na raiz do projeto com a documentação oficial para humanos e IAs externas (Claude Code, Cursor, Copilot) que forem trabalhar no repositório conectado.

## Conteúdo do README

Seções, nesta ordem:

1. **Cabeçalho** — Nome (Acordo Internacional by AtlasPrev), tagline, links de produção (`acordosinternacionais.com`), preview Lovable e repo de conteúdo (`marcosespinola1379/Mapa-de-Acordos`).
2. **Sobre o projeto** — Resumo de 1 parágrafo: hub sobre acordos previdenciários internacionais, dois públicos (beneficiário final via SEO, advogado via hub pago).
3. **Stack** — TanStack Start v1, React 19, Vite 7, Tailwind v4 (tokens oklch em `src/styles.css`), Lovable Cloud (Supabase), Cloudflare Workers, Stripe (futuro), GitHub Actions.
4. **Como rodar** — `bun install`, `bun run dev` (porta 8080). Aviso para não rodar build manual em ambiente Lovable.
5. **Estrutura de pastas** — Árvore comentada cobrindo `src/routes`, `src/data`, `src/components`, `src/styles.css`, `scripts/`, `public/og/`, `.lovable/`.
6. **Conteúdo dos acordos** — Explica que dados vêm do repo `Mapa-de-Acordos` via `scripts/import-acordos.ts`, gerando `acordos.generated.ts`. Cobertura: 25 acordos (21 bilaterais + Suíça + 3 multilaterais).
7. **Convenções para contribuição (humanos e IAs)** — Lista numerada com as regras críticas:
   - Não editar `src/routeTree.gen.ts`
   - Cores só via tokens semânticos (`oklch` em `src/styles.css`), nunca hex em componentes
   - Roteamento via `@tanstack/react-router` (nunca `react-router-dom`)
   - Backend: `createServerFn` para lógica interna; `createFileRoute` em `src/routes/api/public/*` para webhooks. **Não usar Supabase Edge Functions**
   - Auth: middleware `requireSupabaseAuth`
   - Roles em tabela `user_roles` separada com `has_role()` SECURITY DEFINER, nunca em `profiles`
   - Schema via migration do Lovable Cloud
   - Runtime Cloudflare Workers — evitar `child_process`, `sharp`, pacotes Node-only
   - Env vars: `import.meta.env.VITE_*` no browser, `process.env.*` dentro de `.handler()`
   - SEO: cada rota com `head()` próprio (title <60, description <160), H1 único, alt em imagens
   - CI: `check-brand` e `check-og` precisam passar; novo país requer OG gerada
8. **Fluxo Git / co-edição com IAs externas** — Sync bidirecional Lovable ↔ GitHub. Recomendação: PRs para mudanças grandes; commits diretos OK para fixes.
9. **Roadmap** — Aponta para `.lovable/prd.md`. Próxima rodada: Hub do Advogado (auth + Stripe).
10. **Marca** — Distinção "Acordo Internacional" (produto) / "AtlasPrev" (empresa) / "Dr. Marcos Espínola" (rosto especialista, não é marca).

## Arquivos

- **Criar:** `README.md` (raiz)

Sem alterações em código, schema ou CI. Documento puro.
