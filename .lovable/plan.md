# CTAs com animação "circle reveal" (Motion Button)

## Referência

Componente Shatlyk1011/Motion Button (21st.dev): botão pill com círculo de cor contrastante no canto que se expande no hover, ocupando o botão todo, e revela um ícone de seta. Funciona em variante clara (botão escuro com círculo claro) e escura (botão claro com círculo escuro).

Vamos criar um componente `<CTAButton>` reutilizável que substitui os pares de `<Link>` com classes longas do hero (e dos outros CTAs primários/secundários do site).

## Conceito visual

Estado em repouso:
```text
+----------------------------------+
| (o) VER OS 25 PAÍSES             |
+----------------------------------+
```
- Círculo pequeno (~36px) no canto esquerdo do botão, com cor contrastante (no botão `dark`/foreground o círculo é `paper`; no botão `light`/outline o círculo é `foreground`).
- Label centralizado/à direita do círculo.

Estado hover:
```text
+----------------------------------+
| ████████████████████ VER...    → |
+----------------------------------+
```
- O círculo se expande horizontalmente cobrindo todo o botão (transição `0.5s ease-out`).
- A label troca de cor (para o foreground da cor expandida).
- Um ícone `ArrowRight` (lucide) aparece à direita com deslocamento sutil.

## API do componente

`src/components/cta-button.tsx`:

```tsx
interface CTAButtonProps {
  label: string;
  to?: string;          // se router Link
  params?: Record<string,string>;
  href?: string;        // se âncora externa
  onClick?: () => void;
  variant?: "dark" | "light";   // dark = bg-foreground (padrão), light = outline
  size?: "md" | "lg";
  className?: string;
}
```

- `dark` (primário): fundo `foreground` (preto papel), label `background`, círculo `background`/`paper`; no hover o círculo expande virando "preenchimento total" e o label fica `foreground`. Resultado visual: botão escuro que "se ilumina" no hover.
- `light` (secundário): borda `foreground`, fundo transparente, label `foreground`, círculo `foreground`; no hover o círculo expande, o botão inteiro fica preto e a label fica `background`. Inversão limpa.

Internamente: `Link` se `to`, `a` se `href`, `button` caso contrário (Slot pattern simples ou condicional direto — Slot é overkill aqui).

## Estilo

- Pill: `rounded-full` (não `rounded-sm` como hoje — a animação circular pede borda redonda).
- Padding: `pl-2 pr-6 py-2` (md) / `pl-2.5 pr-7 py-2.5` (lg).
- Círculo: `h-9 w-9 lg:h-10 lg:w-10`, posicionado `absolute left-1.5 top-1/2 -translate-y-1/2`, com `rounded-full`.
- Expansão: `transition-transform duration-500 ease-out` + `group-hover:scale-x-[20] group-hover:scale-y-[5]` (ou via `width`/`right` animado). Para manter performance, usar `transform: scale()` num pseudo-elemento que parte do círculo.
- Label: `text-sm font-medium uppercase tracking-[0.14em] relative z-10 transition-colors duration-300`.
- ArrowRight: `absolute right-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0`.

Tokens: tudo via `bg-foreground`, `text-background`, `border-foreground`, `bg-background`, `text-foreground`. Nada de hex.

## Acessibilidade

- Botão respeita `focus-visible:ring-2 ring-foreground ring-offset-2 ring-offset-background`.
- `prefers-reduced-motion`: anular as transições do círculo e da seta (cair pro estado hover instantâneo ou só `bg-foreground/85`).
- A seta tem `aria-hidden`.

## Onde aplicar agora

Escopo desta rodada: **apenas os 2 CTAs do hero da home** (`src/routes/index.tsx`).
- "Ver os {totalAcordos} países" → `variant="dark"`
- "Hub para advogados" → `variant="light"`

Em rodadas futuras, podemos propagar para os outros CTAs do site (jornadas, precos, profissional, etc.) — não fazer agora pra evitar regressão em telas que não consigo verificar todas de uma vez.

## Mudanças concretas

### Novos arquivos
- `src/components/cta-button.tsx` — o componente.

### Editados
- `src/routes/index.tsx` — trocar os 2 `<Link>` longos do hero por `<CTAButton ... variant="dark"|"light" />`. Remover classes inline.

## Fora de escopo

- Demais botões do site (header, footer, outras rotas).
- Variantes destrutivas, ghost, ícone-only.
- Substituir o `Button` do shadcn no projeto inteiro — esse continua pra dialogs/forms.

## Arquivos afetados

- `src/components/cta-button.tsx` (novo)
- `src/routes/index.tsx`
