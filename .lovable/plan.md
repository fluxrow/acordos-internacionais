## Objetivo

Trazer `CalculadoraForm` (pública, `/calculadora`) e `CalculadoraFormPro` (`/hub/calculadora`) para a mesma identidade editorial Paper & Ink do resto do site — sem mudar uma linha de lógica, validações ou cálculos.

## Diagnóstico

Vícios visuais herdados do HTML original que não combinam com o site:

1. **Emojis decorativos** — 1️⃣ 2️⃣ 3️⃣ 🧮 📋 ⚠️ ❌ ✅ ⏳ ℹ️ ✓ ✗ espalhados em títulos, botões e resultados. Nenhuma outra página do site usa.
2. **Cantos arredondados demais** — `rounded-xl`, `rounded-2xl`, botão `rounded-full`. O site inteiro roda com `--radius: 0.25rem` (quase quadrado).
3. **Headers de seção em estilo "form moderno"** — `text-sm uppercase tracking-wider text-muted-foreground` em vez da classe `.eyebrow` editorial (que tem `tracking: 0.18em` e font Inter).
4. **Tipografia dos números/destaques** — `text-3xl font-bold` sans-serif. No resto do site, números de destaque vêm em Playfair Display.
5. **Botões CTA** — `rounded-full` preto com emoji. Header e cards do site usam botões quadrados (`CRIAR CONTA`).
6. **Mode cards e banners de tutorial** — borda dupla `border-2` arredondada e bg wine-soft chapado, em vez do tratamento sóbrio com hairline (`--rule`) usado em country-cards / continue-reading.
7. **Estado "carregado/sucesso"** — depende de cor verde forte (`--state-success`) com bg saturado. Editorial pede tratamento mais discreto (✓ minúsculo + texto, sem flood color).

## Mudanças propostas (apenas presentação)

### `src/components/calculadora-form.tsx`
- Remover todos os emojis de títulos, botões, descrições e textos de resultado (`tituloAmigavel`, `descricaoAmigavel`, badges).
- Trocar headers `h2` das seções por `<p className="eyebrow">` + título Playfair (`font-display`) ou só eyebrow, padrão editorial.
- Substituir `rounded-xl`/`rounded-2xl` por `rounded-sm` (alinha com `--radius`); manter `rounded-md` só em campos.
- Tutorial collapsible: trocar bg `accent-ink-soft` chapado por borda hairline (`border-border`) + bg `paper-soft`, chevron sem emoji.
- Mode cards: simplificar para card retangular com hairline, ícone pequeno à esquerda, sem `border-2`. Estado ativo = borda `--accent-ink` + bg `paper-soft`, sem flood wine.
- Dropzone CNIS: borda dashed `--rule`, ícone neutro, estado sucesso = ✓ + texto serif (sem bg verde).
- CTA principal: `rounded-sm`, sem emoji, label "Calcular benefício".
- `ResultadoView`:
  - Cabeçalho com eyebrow + título em `font-display`.
  - Valor pro-rata em Playfair (`font-display text-4xl`) em vez de sans bold.
  - Bloco de destaque sem `border-2` colorido; usar borda hairline + faixa fina superior na cor do `tone`.
  - `<dl>` em formato lista editorial (label small caps + valor à direita), sem fundo cinza.
  - Fórmula em mono cinza claro com hairline em cima.

### `src/components/calculadora-form-pro.tsx`
Mesma família de ajustes, preservando o tom "laudo técnico":
- `Secao`: já usa eyebrow-ish; padronizar com `.eyebrow` real + filete `<hr className="rule">`.
- Cartão de identificação: remover bg `accent-ink-soft` chapado, usar `bg-paper-soft` + borda hairline.
- Dropzone CNIS: igual à pública.
- `Destaque`: número em `font-display`, borda hairline com filete colorido no topo apenas no `highlight`.
- `PlanejContador`: trocar `border-2` + bg `state-info-soft` saturado por 3 colunas com filete hairline entre, números em Playfair.
- Tabela técnica: já está boa; só remover ✓/⏳ e usar palavras ("atingida" / "faltam X meses").
- Botões: `rounded-sm`, sem emojis; ícones lucide já estão ok.
- Laudo (`<section>` envolvente): remover `border-2` colorido global; usar borda hairline + barra superior de 2 px na cor do tone (mais sóbrio para impressão).

### `src/styles.css`
- Pequeno ajuste em `.calc-form input` para `border-radius: 0.375rem` (mantém leve respiro nos campos sem destoar do `--radius` global).
- Sem novos tokens — todo o trabalho usa o que já existe (`--ink`, `--paper-soft`, `--rule`, `--accent-ink`, `--state-*`).

## Fora de escopo

- Lógica de cálculo, parser CNIS, fluxo de upload, validações, salvar histórico, impressão — tudo permanece igual.
- Não mexo em `calculadora-form-pro.tsx` `SalvarCalculoButton` (lógica), só visual.
- Não toco nas rotas (`/calculadora`, `/_authenticated/hub.calculadora.tsx`) — só nos componentes.

## Verificação após implementar

Screenshot das duas calculadoras (pública e pro) lado a lado com a home/`/precos` para confirmar a mesma identidade.
