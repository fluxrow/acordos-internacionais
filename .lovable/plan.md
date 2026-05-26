## Objetivo
Tornar o CTA no final do resultado da calculadora do segurado **mais chamativo** e alinhado à ID do projeto (wine `--accent-ink`, tipografia `font-display`, `eyebrow`, `CTAButton`), com botão principal **"Quero fazer meu planejamento"** e frases-chave em destaque.

## Arquivo afetado
- `src/components/cta-marcos.tsx`

(Nenhuma mudança de chamada — `CalculadoraForm` já passa `contexto` por caso.)

## Mudanças

### Nova variante `result` no `CTAMarcos`
Adicionar `variant: "card" | "block" | "result"` e usar `result` como padrão da calculadora. A variante `card` atual permanece para os outros usos.

Layout da variante `result`:
- Card grande, `rounded-2xl`, fundo `bg-[var(--accent-ink-soft)]`, borda `border-[var(--accent-ink)]/30`.
- Decoração: gradiente radial sutil em `--accent-ink` (mesmo padrão da variante `block`).
- **Eyebrow** wine: "Próximo passo".
- **Headline** `font-display text-2xl md:text-3xl` em `text-[var(--accent-ink)]`: copy por caso, com palavras-chave em `<strong>` destacadas no mesmo tom wine:
  - Caso 1: "Você já tem **direito no Brasil**. Vamos garantir o **melhor valor**."
  - Caso 2: "Ainda não dá hoje — mas **um planejamento muda esse cenário**."
  - Caso 2B: "Falta só a idade. **Cada mês conta** para você se aposentar melhor."
  - Caso 3: "Você tem direito à **totalização internacional**. Vamos protocolar."
- Sub-copy curta (reaproveita o `contexto` passado pelo form, em `text-foreground/80`).
- Bullet row com 3 mini-benefícios (ícones `Check`): "Análise do seu caso", "Estratégia personalizada", "Atendimento com o Dr. Marcos".
- **Botão principal**: `CTAButton` `variant="dark"`, `size="lg"`, label **"Quero fazer meu planejamento"**, leva a `/contato`.
- Link secundário discreto: "Prefiro saber mais antes →" → `/sobre` (ou `/contato`).

### Integração com a calculadora
- `CalculadoraForm` já chama `<CTAMarcos contexto={...} />`. Trocar para `<CTAMarcos variant="result" contexto={...} />` no `ResultadoView`.
- Passar o `caso` para permitir headline contextual: `<CTAMarcos variant="result" caso={resultado.caso} contexto={...} />`. Quando `caso` não vier, usar headline genérica.

### Identidade visual (ID)
- Usar apenas tokens semânticos (`--accent-ink`, `--accent-ink-soft`, `--foreground`, `--background`, `--border`).
- Tipografia: `font-display` na headline, classe utilitária `eyebrow` no rótulo.
- Sem hex, sem cores soltas.

## Fora de escopo
- Variantes `card` e `block` permanecem como estão.
- Sem mudanças em rotas, `calculadora.ts` ou em `prd.md`/`ROADMAP.md` (mudança puramente visual).