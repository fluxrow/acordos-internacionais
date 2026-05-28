## Ultrareview — o que encontrei em cada rota

Varri todas as rotas públicas após a migração para Premium Dark + Gold. A estrutura ficou ótima, mas alguns blocos ainda usam combinações ouro-sobre-ouro ou claro-sobre-claro herdadas do tema Paper & Ink — texto fica ilegível. Abaixo o que ajustar, agrupado por tipo, sem mexer em globos, fontes, copy ou layout.

### Pontos críticos (legibilidade)

**1. Banda CTA "Falar com o Dr. Marcos" (rodapé de várias páginas)**
- Sintoma: faixa amarela ocupa a largura toda; título, subtítulo e botão somem (gold-sobre-gold).
- Onde aparece: `/jornadas/$jornada`, `/sobre/dr-marcos`, possivelmente outras que usam `CtaMarcos`.
- Fix: trocar fundo da banda para `--paper-soft` (ou `--card-bg`), título em `--ink` com 1–2 palavras `--accent-ink`, botão pílula dourada com `text-paper`. Mantém o destaque sem o "muro de ouro".

**2. Card "Hub Profissional" / ProContentLock**
- Sintoma: CTA "Acessar o hub" usa `bg-[var(--accent-ink)]` + `text-card-foreground` (que ficou claro) → texto some. Eyebrow "PARA ADVOGADOS" em gold sobre gold.
- Onde: `pro-content-lock.tsx`, `/acordos/$pais`, `/sobre/dr-marcos`, `/profissional`.
- Fix: `text-card-foreground` → `text-[var(--paper)]` no CTA; revisar lista de bullets para usar `bg-[var(--paper-soft)]` em vez de `bg-background/40`.

**3. Lista de documentos em `/acordos/$pais`**
- Sintoma: badges/pílulas de "DOWNLOAD" e códigos (BR/PT 15 etc.) aparecem como retângulos dourados sólidos sem texto visível.
- Fix: badges com `bg-[color-mix(in_oklab,var(--accent-ink)_18%,transparent)]` + borda gold + `text-[var(--accent-ink)]`, ou inverter para `bg-[var(--accent-ink)]` + `text-[var(--paper)]` quando for ação principal.

**4. Bloco "internacional" do `/sobre/dr-marcos` (card amarelo "Brasileiros entre dois sistemas")**
- Sintoma: fundo `--accent-ink-soft` + texto que ficou claro = ilegível.
- Fix: trocar para fundo `--card-bg` com borda `--accent-ink` + eyebrow gold + corpo `--ink`. Mantém o pareamento "card neutro / card destaque" sem perder texto.

**5. Hero da `/calculadora`**
- Sintoma: gradiente dourado por cima do hero apaga eyebrow ("FERRAMENTA GRATUITA") e subtítulo.
- Fix: reduzir intensidade do glow (opacity ~30%) e/ou aplicar `text-shadow` sutil; subtítulo em `text-foreground/85` em vez de muted.

**6. Seção "world map" do `/profissional`**
- Sintoma: dois blocos brancos (mapa + bio do Dr. Marcos) com texto claro = invisível.
- Fix: aplicar fundo `--paper-soft` com overlay escuro sobre o mapa (mesma técnica que usamos para os globos), texto `--ink`, números em `--accent-ink`.

**7. Badges "MAIS POPULAR" / "LANÇAMENTO" em `/precos`**
- Sintoma: badges atuais dark sobre fundo escuro, perdem o status. Plano Fundadores não tem o "halo" gold que o plan dele merece.
- Fix: badge "Mais popular" pill `bg-[var(--accent-ink)] text-[var(--paper)]`; card Fundadores com `border-[var(--accent-ink)]` + `shadow-[var(--shadow-gold-glow)]`; preço em `--accent-ink` com `font-display`.

### Consistência (refinos rápidos)

**8. Header — chip "PREVIDÊNCIA · BR"**
- Está em duas linhas no desktop e parece label órfão ao lado da marca. Sugerir `whitespace-nowrap` + tracking maior, ou mover para baixo do logotipo em coluna.

**9. Regra tipográfica de headings**
- Vários H2/H3 ainda 100% brancos. Aplicar a regra "1–2 palavras em `--accent-ink`" nas seções principais de `/acordos/index`, `/jornadas/index`, `/guias/index`, `/precos`, `/contato`, `/calculadora`, `/profissional`.

**10. Tabelas em `/acordos/$pais` (Benefícios cobertos, Lado Brasil/Portugal)**
- Header de tabela ficou dourado puro com texto invisível. Aplicar `bg-[var(--card-bg)]` no cabeçalho, zebra `--paper-soft`, números/destaques em gold.

**11. Hover/foco em links da sidebar "Nesta página" e "Próximos passos"**
- Já dourados; adicionar `hover:translate-x-0.5` + sublinhado gold para reforçar interatividade conforme regra de hover de elevação.

**12. Globos (preservados)**
- Confirmar que as overlays escuras dos globos seguem suficientes em todas as rotas (`/`, `/acordos/index`, `/jornadas/index`). Sem mexer na estética, só ajustar opacidade do véu quando necessário.

### Páginas auth/internas (varredura rápida)

- `/login`, `/cadastro`, `/reset-password`: revisar inputs (border `--rule`, focus ring `--accent-ink`), CTA primário gold com `text-paper`.
- `/_authenticated/hub.*` e `/_authenticated/conta`: garantir cards `--card-bg` com bordas `--rule`, hover de elevação consistente, métricas em gold.

### Fora de escopo nesta rodada
- Globos (mantidos como estão, só ajuste de overlay se necessário).
- Fontes, copy, planos, checkout, dados, server functions.
- Estrutura/layout das páginas.

### Governança
- `mem://design/color-system`: registrar regras "nunca gold-sobre-gold em CTAs/badges" e "CTAs em ouro sempre com `text-paper`".
- `ROADMAP.md`: entrada "Ultrareview de contraste pós Premium Dark + Gold".
- `.lovable/prd.md`: nota sobre banda CTA reformulada (sem fundo gold full-bleed).

### Como vamos atacar
Tudo em paralelo nesta rodada, em três frentes:
1. **Componentes compartilhados** (`pro-content-lock`, `cta-marcos`, `cta-button`, badges, header chip) — corrige 5+ páginas de uma vez.
2. **Páginas com seções legadas** (`/profissional` mapa, `/sobre/dr-marcos` card amarelo, `/calculadora` hero, `/precos` badges/destaque).
3. **Sweep tipográfico** (gold-keyword em H2/H3 das rotas listadas) + tabelas de `/acordos/$pais`.

Após implementar, faço um segundo passe visual em `/`, `/profissional`, `/sobre/dr-marcos`, `/precos`, `/calculadora`, `/acordos/portugal` e `/jornadas/estou-voltando` para confirmar contraste.
