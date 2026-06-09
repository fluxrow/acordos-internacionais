---
name: HUB chrome
description: Regras de chrome, layout e densidade premium dentro de /hub e /conta
type: design
---
Dentro de `/hub/*` e `/conta`, o site usa **chrome próprio de workstation**: `HubShell` com shadcn `Sidebar` (`collapsible="icon"`) + topbar fina de 48px (breadcrumb + ThemeToggle + sign out). `SiteHeader` e `SiteFooter` públicos NÃO entram nessas rotas (gate por pathname em `__root.tsx`).

Exceção: `/hub/laudo` (visualização/print de PDF) renderiza fora do shell para não vazar chrome dark no PDF — continua forçado em `.light`.

Tokens dedicados em `src/styles.css`:
- `--surface-premium`, `--surface-premium-strong` — fundos de cartões com blur.
- `--rule-gold`, `--rule-gold-strong` — hairlines gold.
- `--shadow-gold-glow` — halo gold em CTAs/estados pagos.

Utilitários: `.hub-surface`, `.hub-surface-strong`, `.hub-rule-gold`, `.hub-scroll`.

Componentes obrigatórios para superfícies do HUB:
- `SectionCard` (src/components/hub/section-card.tsx) — superfície premium reutilizável.
- `StatusBadge` (src/components/hub/status-badge.tsx) — selos unificados (pro/trial/admin/vitalicio/curadoria/bloqueado/favorito).
- `CountryCard` estilo showcase com cover + estados por status.

Densidade: max-w-7xl no dashboard, max-w-6xl nas páginas internas. Tipografia compacta (text-[13px] em metadata, text-sm em corpo). Tabs do `/hub/$pais` são segmented control com indicador gold animado.
