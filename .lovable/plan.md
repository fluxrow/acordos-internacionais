## Objetivo

Adicionar um modo claro opcional ao site inteiro (público + hub). O dark continua sendo o padrão. O usuário troca por um botão no header e a escolha persiste entre sessões.

Como todos os componentes já consomem tokens semânticos (`bg-background`, `text-foreground`, `border-border`, etc.), a troca acontece só por CSS variables — nenhum componente precisa ser reescrito.

---

## 1. Tokens do tema claro em `src/styles.css`

Adicionar um bloco `.light { ... }` que sobrescreve as mesmas variáveis hoje definidas em `:root` (dark). Vou portar a paleta Paper & Ink do backup `src/styles/themes/paper-ink.css.bak`, mas mantendo o **gold** como `--accent-ink` (a marca Premium Dark + Gold permanece). Resultado:

- `--paper` claro (off-white editorial), `--ink` quase preto, `--rule` hairline cinza.
- `--accent-ink` continua dourado, ajustado para contraste em fundo claro (oklch um pouco mais escuro: `oklch(0.62 0.14 86)`).
- Sombras `--shadow-soft` / `--shadow-soft-hover` recalibradas para fundo claro (preto com alpha menor, halo gold no hover mantido).
- `color-scheme` dos inputs de data passa a depender do tema (`.light input[type="date"] { color-scheme: light; }`).

Não toco nos nomes dos tokens semânticos — só os valores mudam dentro de `.light`. O backup Paper & Ink continua existindo.

## 2. Provider de tema + persistência

Criar `src/components/theme-provider.tsx`:

- Hook `useTheme()` retorna `{ theme: "dark" | "light", setTheme, toggle }`.
- Estado lido de `localStorage.getItem("ai-theme")` (chave `ai-theme`), default `"dark"`.
- Aplica/remova classe `light` em `document.documentElement` (dark é a ausência de classe — bate com o CSS atual).
- Script inline pequeno no `<head>` (via `src/routes/__root.tsx` `scripts`) que aplica a classe **antes do paint**, evitando flash branco/escuro no carregamento.

Montar o provider dentro do `RootComponent` em `src/routes/__root.tsx` (envolvendo o `<Outlet />`).

## 3. Botão de toggle no header

Criar `src/components/theme-toggle.tsx` — ícone `Sun`/`Moon` da lucide-react, botão `rounded-full` com `border-border` e hover gold (mesmo padrão dos outros chips do header). Acessível: `aria-label="Alternar tema claro/escuro"`, `aria-pressed`.

Inserir em dois lugares:
- `src/components/site-header.tsx` (header público), ao lado do CTA.
- Header do hub autenticado em `src/routes/_authenticated.tsx` (ou onde estiver a barra superior do hub), para que o usuário logado também tenha o controle.

## 4. Ajustes pontuais de contraste

Após o switch, fazer uma passada visual nas seções com gradiente/glow gold para garantir legibilidade no claro:
- `src/components/pro-content-lock.tsx` — `bg-[radial-gradient(... var(--accent-ink-soft) ...)]`: o `--accent-ink-soft` no tema claro vira um gold lavado quente, então funciona.
- `globe.tsx` (overlays sobre o globo) — verificar se o gradiente de máscara permanece legível.
- `LaudoPdf` — o PDF deve **sempre** ser renderizado em claro (ele já é light por design). Forçar `.light` no wrapper de impressão para isolar do tema do app.

Nenhum desses ajustes muda lógica — só classes utilitárias / variáveis.

## 5. Fora de escopo (não fazer agora)

- Diferenciação visual público vs pago no hub (próximo round, segundo o pedido).
- Refactor de componentes que usem cores hard-coded (não há — já é tudo via tokens).
- Mudar a paleta da marca.

---

## Arquivos tocados

- `src/styles.css` — adicionar bloco `.light { ... }` + ajuste de `color-scheme` por tema.
- `src/routes/__root.tsx` — script inline anti-flash + montar `ThemeProvider`.
- `src/components/theme-provider.tsx` — novo.
- `src/components/theme-toggle.tsx` — novo.
- `src/components/site-header.tsx` — inserir toggle.
- `src/routes/_authenticated.tsx` — inserir toggle no hub.
- `src/components/laudo/LaudoPdf.tsx` — forçar `.light` no wrapper (apenas no PDF).

Critério de pronto: alternar o botão muda o site inteiro sem recarregar, sem flash no F5, e a preferência persiste. Dark continua sendo o que abre por padrão para quem nunca clicou.
