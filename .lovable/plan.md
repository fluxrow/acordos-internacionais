# Globo reativo ao tema

## Problema
Hoje `src/components/globe.tsx` usa uma paleta fixa (`PAPER` escura: base marrom-escuro, brilho 1.6) mesmo quando o usuário ativa o modo claro via `ThemeToggle`. No light o globo continua "preto", quebrando o contraste do hero.

## Proposta
Tornar o globo reativo ao tema do `ThemeProvider`, mantendo gold como cor de markers/glow nos dois modos (consistente com a marca).

### Mudanças em `src/components/globe.tsx`
1. Importar `useTheme` de `@/components/theme-provider`.
2. Adicionar uma terceira paleta `PAPER_LIGHT` (modo claro):
   - `base`: bege/areia claro (aprox. `[0.93, 0.90, 0.84]`) — casa com o off-white da marca.
   - `marker`: gold mantido (`[0.78, 0.58, 0.22]`, levemente mais escuro p/ contraste em fundo claro).
   - `glow`: gold suave (`[0.86, 0.72, 0.40]`).
   - `brightness`: ~1.05 e `dark: 0` (sem sombreamento pesado).
3. Selecionar a paleta:
   - `tint="wine"` → segue `WINE` (inalterado).
   - `tint="paper"` (default) → `theme === "light" ? PAPER_LIGHT : PAPER`.
4. Recriar a instância do COBE quando o tema muda — adicionar `theme` ao `useEffect` deps e ao objeto `resolvedConfig` (o COBE não suporta troca de cor em runtime, então destruir + recriar).
5. Aplicar uma transição CSS curta de `opacity` (já existe) para suavizar a troca.

### Não muda
- Marcadores/coords/rotação automática.
- Restrição da Core memory ("Globos nunca mudam — texto fica sempre acima") continua respeitada: o globo segue como fundo decorativo; só a paleta acompanha o tema.
- `tint="wine"` (se usado em alguma seção) permanece com a paleta atual.

## Arquivo tocado
- `src/components/globe.tsx` (único)
