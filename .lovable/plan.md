
# Premium HUB — redesign de chrome, cards e telas

Objetivo: o HUB deve parecer uma **estação de trabalho profissional**, não uma extensão do site institucional. Mesma marca (Premium Dark + Gold), outra densidade, outro chrome, outra hierarquia. Quem entra no HUB sente que entrou no produto pago, mesmo na trial.

## 1. Princípios de diferenciação (travam todas as telas)

- **Chrome próprio**: dentro de `/hub/*`, `/conta` e qualquer rota autenticada, o `SiteHeader` público dá lugar a uma **sidebar fixa estilo workstation** + topbar curta. Site aberto continua com o header editorial atual — contraste visual imediato ao logar.
- **Densidade workstation**: menos hero, mais informação por dobra. Tipografia base menor (`text-[13px]` em metadata, `text-sm` em corpo), gutters menores (`gap-3`, `px-5`), max-width maior (`max-w-7xl` em vez de `max-w-6xl/4xl`).
- **Textura premium**: superfícies em `bg-background/60` com `backdrop-blur-md`, hairline `border-border/60`, hairlines gold em estados ativos/hover, `--shadow-soft` discreto + brilho `--shadow-glow-gold` apenas em CTAs e estados pagos.
- **Hierarquia por status**: cards mudam de moldura conforme estado real — `Em curadoria` (neutro), `Disponível` (border + caption gold), `Favorito` (selo gold filled), `Bloqueado` (fosco + lock). O HUB conta o estado do trabalho.

## 2. Chrome próprio do HUB (base de tudo)

Novo layout autenticado em `src/routes/_authenticated.tsx` baseado em **shadcn `Sidebar` (`collapsible="icon"`)** + topbar fina:

```text
┌─────────────────────────────────────────────────────┐
│ ☰  Hub Profissional / Países              [tema][u]│  topbar 48px
├──────┬──────────────────────────────────────────────┤
│ 🏠   │                                              │
│ 🌐   │              <Outlet />                      │
│ 🧮   │                                              │
│ 📄   │                                              │
│      │                                              │
│ ⚙    │                                              │
└──────┴──────────────────────────────────────────────┘
```

Itens da sidebar: Dashboard, Países, Calculadora, Laudos, (Leads — só admin), Conta. Collapsed mostra só ícones em mini-strip de 56px. Ativo marcado por hairline gold à esquerda + ícone gold.

Topbar tem: `SidebarTrigger`, breadcrumb derivado da rota atual, `ThemeToggle`, avatar/menu da conta. SiteHeader público **não** entra mais em `__root` quando a rota começa com `/hub` ou `/conta` (gate por `useRouterState`).

## 3. Country Card estilo showcase-card-1 (referência 21st.dev)

Reformatar `CountryCard` mantendo o mesmo footprint do grid, mas com a estética showcase: card mais alto, bandeira ocupando o topo como "cover", título gradiente, métricas em rodapé compacto, micro-animação no hover.

```text
┌──────────────────────────┐
│ ▓▓▓ bandeira/logo cover  │  altura 96px, blur leve, mask gradient para o fundo
│                          │
│ ALEMANHA      ★ favorito │  título em font-display, "ALEMANHA" com .text-gold no hover
│ Europa · Acordo + Ajuste │  eyebrow muted
├──────────────────────────┤
│ 4 docs · trecho · 2 órg. │  caption compacto
└──────────────────────────┘
   borda gold sutil no hover, translate-y -2px
```

Estados visuais:
- **Em curadoria**: cover dessaturado, selo gold "Em curadoria" no canto, métricas escondidas.
- **Bloqueado** (sem acesso e com material): cover com overlay escuro + ícone lock gold, hover não eleva.
- **Favorito**: estrela gold filled persistente no topo direito; hairline gold permanente.
- **Disponível**: estado base, métricas visíveis, hover gold.

## 4. Dashboard `/hub` — workstation, não landing

Reorganizar em 3 zonas, max-w-7xl, grid 12-col:

1. **Header curto** (1 linha): saudação + nome do usuário + badge "Plano Pro" / "Trial" / "Admin" no canto direito (selos com hierarquia: trial neutro, pro gold, admin filled).
2. **Banda de ações** (3 cards 4-col cada): Calculadora (destaque gold, gradiente sutil), Laudos (neutro), Leads (admin only, hairline gold). Cards menores que hoje, alinhados em fileira — não mais blocos empilhados gigantes.
3. **Workspace de países** (8-col + 4-col):
   - Esquerda: grid de country cards (estilo §3), 4 colunas em `lg`, 5 em `xl`.
   - Direita (sticky): painel "Continuar lendo" + "Favoritos" + contagem por região, todos compactos em formato de lista densa estilo VS Code sidebar.

Filtros viram **toolbar fina acima do grid** (chips com hairline gold no ativo) em vez do bloco atual.

## 5. País `/hub/$pais` — page de produto, não artigo

- Max-w sobe pra `max-w-6xl`, layout 12-col: **8-col conteúdo + 4-col rail direito sticky**.
- **Hero compacto**: bandeira 80×60, título em uma linha, metadata em grid 3-col (Instrumento / Decreto / Vigor desde), botão Favoritar gold no canto. Sem mais o `dl flex-wrap` atual.
- **Tabs** (Acordo / Ajuste / Documentos / Órgãos / Trecho / Visão) viram **segmented control** estilo macOS no topo da coluna esquerda, com indicador gold animado.
- O scroll interno das abas Acordo/Ajuste (já implementado) ganha **moldura premium**: container com hairline + shadow-soft, scrollbar custom fina, fade gold no topo/base quando há overflow.
- **Rail direito** sticky: Notas pessoais (editor compacto), Favoritar, Ações rápidas (Abrir calculadora pré-preenchida com este país, Baixar tudo).
- Documentos em **lista densa** com ícone + nome + tamanho + botão download — não cards gigantes.

## 6. Calculadora `/hub/calculadora` + Laudos

- Calculadora: layout 2-col **formulário esquerda (5-col) / preview do laudo direita (7-col)** com card preview já formatado igual ao PDF final. Sensação de IDE: input → output ao vivo.
- Botão "Gerar laudo" vira CTA gold cheio com `--shadow-glow-gold` discreto.
- `/hub/laudos`: tabela densa (data, país, segurado, ações) em vez de cards. Linhas com hover hairline gold. Botão download ganha estado de loading e toast de sucesso.
- `/hub/laudo`: print view continua forçada em `.light` (já está), mas a tela de visualização in-app ganha o mesmo chrome premium dark.

## 7. Conta `/conta` + Leads `/hub/leads`

- `/conta`: cards de Plano, Pagamento, Sessão, Acesso em grid 2-col, todos com hairline. Botão "Gerenciar assinatura" gold.
- `/hub/leads` (admin): tabela densa com filtros por status, hairline gold em linhas pendentes. Modo admin claramente sinalizado por badge gold filled na topbar.

## 8. Detalhes técnicos

- **Novos componentes**:
  - `src/components/hub/hub-shell.tsx` — Sidebar + topbar + Outlet (substitui SiteHeader dentro de rotas autenticadas).
  - `src/components/hub/hub-sidebar.tsx` — shadcn Sidebar com itens fixos + admin gate.
  - `src/components/hub/hub-topbar.tsx` — breadcrumb + theme + menu conta.
  - `src/components/hub/country-card.tsx` — reescrita estilo showcase-card-1.
  - `src/components/hub/status-badge.tsx` — selos unificados (trial / pro / admin / em curadoria / bloqueado / favorito).
  - `src/components/hub/section-card.tsx` — superfície premium reutilizável (hairline + blur + hover gold).
- **Instalar shadcn sidebar** se não estiver no projeto (`npx shadcn add sidebar`).
- **`__root.tsx`**: condicionalmente renderiza `SiteHeader` só fora de `/hub` e `/conta`.
- **`_authenticated.tsx`**: envolve `<Outlet />` em `<HubShell>` com `SidebarProvider`.
- **Tokens novos em `src/styles.css`**: `--shadow-glow-gold`, `--surface-premium` (rgba do background com alpha), `--rule-gold` (hairline gold sutil). Tudo em oklch, nada hex em componente.
- **Memory updates**: ao implementar, atualizar `mem://design/color-system` com `--shadow-glow-gold` e criar `mem://design/hub-chrome` documentando que `/hub` e `/conta` usam sidebar própria.
- **PRD/Roadmap**: atualizar `.lovable/prd.md` e `ROADMAP.md` na mesma rodada (regra Core).

## 9. Fora de escopo desta rodada

- Mudar a estética do site público (continua editorial premium dark + gold como está).
- Refatorar lógica de negócio (RLS, server functions, dados de acordos).
- Mexer no `LaudoPdf` (continua forçado `.light` para impressão).
- Adicionar features novas (busca global, atalhos de teclado, comando-K) — fica para rodada seguinte se quiser.

## 10. Ordem sugerida de execução

1. Tokens + `HubShell` + Sidebar + Topbar + gate no `__root`.
2. `CountryCard` showcase + `StatusBadge`.
3. Dashboard `/hub` reorganizado.
4. País `/hub/$pais` com rail e segmented tabs.
5. Calculadora 2-col + Laudos tabela.
6. Conta + Leads.
7. PRD + Roadmap + memory.

Cada etapa é independente visualmente — dá pra aprovar/ajustar rodada a rodada.
