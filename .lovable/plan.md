## Objetivo

Migrar o site para **Premium Dark + Gold**, mantendo:
- Fontes atuais (Playfair / Source Serif / Inter), espaçamentos e tipo de botão
- Plano anterior de arredondamentos, sombras leves e hover de elevação
- Globos intactos

Antes de aplicar, **arquivar o tema atual (Paper & Ink)** para reversão de 1 passo.

A referência enviada serve apenas para **padrão de aplicação de cor** — não para tipografia, botão ou espaçamento.

---

## 1) Backup do tema atual

Antes de qualquer mudança:

```
src/styles/themes/paper-ink.css.bak     (cópia dos blocos :root e .dark atuais)
.lovable/themes/paper-ink.snapshot.md   (doc: tabela token→valor + como reverter em 1 passo)
```

Reverter = copiar os blocos do `.bak` por cima dos blocos correspondentes em `src/styles.css`. Componentes seguem funcionando porque tudo usa tokens semânticos.

---

## 2) Paleta Premium Dark + Gold (tokens em `src/styles.css`)

| Token | Papel | Hex ref | oklch |
|---|---|---|---|
| `--paper` (background) | fundo da página | `#0a0a0a` | `oklch(0.15 0 0)` |
| `--paper-soft` (section) | bandas / muted | `#0f0f0f` | `oklch(0.18 0 0)` |
| `--card-bg` (card) | cards / elevação | `#121212` | `oklch(0.21 0 0)` |
| `--ink` (foreground / headings) | texto principal e títulos | `#f5f5f5` | `oklch(0.97 0 0)` |
| `--ink-soft` (body) | corpo | `#d1d5db` | `oklch(0.87 0.005 250)` |
| `--ink-muted` (muted) | subtítulos / lede / dicas | `#a3a3a3` | `oklch(0.72 0 0)` |
| `--rule` | hairlines | `#6b7280 @ baixa opac` | `oklch(0.50 0.015 255 / 0.35)` |
| `--accent-ink` (gold) | CTA / destaques tipográficos / bordas hover | `#d4af37` | `oklch(0.78 0.13 86)` |
| `--accent-ink-soft` (gold light) | wash / gradientes / hover | `#e5c158` | `oklch(0.85 0.13 90)` |

Mapas semânticos (resumo):
- `--background` = `--paper`; `--foreground` = `--ink`
- `--card` = `--card-bg`; `--card-foreground` = `--ink`
- `--secondary` / `--muted` = `--paper-soft`; `--muted-foreground` = `--ink-muted`
- `--primary` = `--accent-ink`; `--primary-foreground` = `--paper` (preto sobre gold)
- `--accent` = `--accent-ink-soft`; `--accent-foreground` = `--paper`
- `--border` / `--input` = `--rule`; `--ring` = `--accent-ink`
- `--destructive`, `--state-*` recalibrados para luminosidade alta em dark
- `::selection` invertido (gold + paper)
- O bloco `.dark` espelha `:root` (site passa a ser dark por padrão; consistência se algum componente forçar `.dark`)

---

## 3) Padrão de aplicação de cor em texto (vindo da referência)

Regra editorial nova:

- **Headings (H1/H2/H3)** em `--ink` (branco quase puro `#f5f5f5`).
- **1 ou 2 palavras-chave dentro do heading** ficam em `--accent-ink` (gold). Aplicado seletivamente em hero/section titles importantes, **não em todo título**.
  - Implementação: um span utilitário `.text-gold` ou classe Tailwind `text-[var(--accent-ink)]` envolvendo a palavra a destacar no JSX da rota.
- **Lede / parágrafos** em `--ink-muted` (`#a3a3a3`) — mesma hierarquia da referência.
- **Body text denso** (artigos, fichas-país, glossário) em `--ink-soft` (`#d1d5db`) para legibilidade longa.
- **Eyebrows / labels uppercase** em `--accent-ink` (gold) — substitui o `text-muted-foreground` atual onde o eyebrow precisa puxar atenção.
- **Links inline** (`.ink-link`) em `--ink` com hover `--accent-ink`.
- **Números/destaques (Proof, métricas, preços-âncora)** em `--accent-ink` com `font-display`.
- **Citações / pull-quotes** em `--ink` com barra lateral `--accent-ink`.

Esta regra entra em `mem://design/color-system` e é o guia para o sweep nas rotas.

---

## 4) Sombras + arredondamento + hover (sem mudança)

```css
--shadow-soft:
  0 1px 2px rgba(0,0,0,0.45),
  0 8px 24px -12px rgba(0,0,0,0.55);

--shadow-soft-hover:
  0 2px 4px rgba(0,0,0,0.55),
  0 18px 36px -14px rgba(0,0,0,0.65),
  0 0 0 1px color-mix(in oklab, var(--accent-ink) 30%, transparent);

--shadow-gold-glow:
  0 0 0 1px color-mix(in oklab, var(--accent-ink) 25%, transparent),
  0 12px 32px -16px color-mix(in oklab, var(--accent-ink) 35%, transparent);
```

Hover de elevação em elementos com rota: `transition-all 200ms`, `hover:-translate-y-0.5`, `hover:shadow-[var(--shadow-soft-hover)]`, `hover:border-[var(--accent-ink)]` nos hairlines.

CTA primário: bg `--accent-ink`, text `--paper`. Hover: bg `--accent-ink-soft` + `--shadow-gold-glow`.

Arredondamentos do plano anterior continuam: `rounded-2xl` blocos grandes, `rounded-xl` menores, `rounded-full` apenas CTA/chips.

---

## 5) Globos sobre nova paleta

Globos ficam acima da camada de imagem (plano anterior). Overlay escuro reforçado `bg-[oklch(0.15_0_0)/0.65]` para preto profundo destacar o globo + texto branco. Sem mudança no `Globe` component.

---

## 6) Sweep de visibilidade por arquivo

Em cada arquivo: trocar cores hardcoded por tokens, aplicar regra de destaque tipográfico (§3) onde fizer sentido (1–2 palavras por heading principal).

- `src/components/site-header.tsx` — nav em `--ink`, hover gold; logo em `--ink` (palavra "Internacionais" ou marca em gold se couber).
- `src/components/site-footer.tsx` — fundo `--paper-soft`, hairline `--rule`, links `--ink-muted` / hover gold.
- `src/components/ui/button.tsx` — variant `default` = gold-on-black; revisar `outline` (border gold, text gold, hover bg gold/10), `secondary`, `ghost`.
- `src/components/cta-button.tsx`, `cta-marcos.tsx` — tokens; CTA pill = gold.
- `src/components/pro-content-lock.tsx` — gradiente de lock `--paper`→transparente.
- Rotas: `index`, `profissional`, `acordos.index`, `acordos.$pais`, `jornadas.index`, `jornadas.$jornada`, `sobre.dr-marcos`, `precos`, `contato`, `calculadora`, `guias.index`, `guias.$slug`.
  - Headings principais ganham 1–2 palavras em gold.
  - Eyebrows passam a gold quando precisam puxar atenção.
  - Inputs/forms: bg `--card-bg`, border `--rule`, focus ring gold (atualiza `.calc-form`).
  - Tabelas (acordos.$pais): zebra `--paper-soft`, header `--card-bg`, divisor `--rule`, números em gold.
  - Badges/chips: bg `--paper-soft`, border `--rule`, hover border gold.
  - Cards de planos (`precos`, `profissional`): plano destacado com borda gold + `--shadow-gold-glow`.
- Focus ring global → `outline: 2px solid var(--accent-ink)`.

Para cada rota tocada: snapshot rápido após troca para validar contraste (alvo AA mínimo; AAA para gold sobre preto que já é nativo).

---

## 7) Governança

- Nova memória `mem://design/color-system` com a paleta + regra de destaque tipográfico.
- `mem://index.md` ganha linha Core: "Tema atual: Premium Dark + Gold. Backup Paper & Ink em `src/styles/themes/paper-ink.css.bak`. Destaques tipográficos com 1–2 palavras gold por heading principal."
- `.lovable/prd.md` — seção "Identidade visual" reescrita.
- `ROADMAP.md` — entrada da rodada (troca de paleta + reversibilidade).

---

## 8) Arquivos tocados

```
src/styles/themes/paper-ink.css.bak       (novo — backup)
.lovable/themes/paper-ink.snapshot.md     (novo — doc de reversão)

src/styles.css                            (nova paleta + tokens sombra + focus gold)

src/components/site-header.tsx
src/components/site-footer.tsx
src/components/ui/button.tsx
src/components/cta-button.tsx
src/components/cta-marcos.tsx
src/components/pro-content-lock.tsx

src/routes/index.tsx
src/routes/profissional.tsx
src/routes/acordos.index.tsx
src/routes/acordos.$pais.tsx
src/routes/jornadas.index.tsx
src/routes/jornadas.$jornada.tsx
src/routes/sobre.dr-marcos.tsx
src/routes/precos.tsx
src/routes/contato.tsx
src/routes/calculadora.tsx
src/routes/guias.index.tsx
src/routes/guias.$slug.tsx

mem://design/color-system                 (novo)
mem://index.md                            (Core + referência)
.lovable/prd.md                           (identidade visual)
ROADMAP.md                                (rodada)
```

## Não-objetivos

- Não trocar fontes, tipo de botão, espaçamento.
- Não mexer em globos, layout, copy, planos, checkout, server functions, banco.
- Não adicionar dependências.

## Riscos

- Cards muito escuros podem perder hierarquia — mitigado por sombra + halo gold no hover.
- Excesso de palavras douradas polui — regra de 1–2 por heading principal evita isso.
- Estados de form (erro/sucesso) precisam recalibração — incluído.
