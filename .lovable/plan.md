# Unificar UI da página /acordos com a identidade do Home

A página `/acordos` (acessada via "Países" no header) ainda usa um layout antigo: grid sem respiro (`gap-px` com fundo cinza simulando linhas), cards retangulares com hover invertendo para preto sólido, filtros pílula preto-no-branco e busca como input minimalista solto. O Home estabeleceu outra linguagem: cards arredondados translúcidos, hover suave em wine soft, CTAButton consistente, eyebrows, e uso do globo/wine como tinta de marca. Vamos trazer `/acordos` para a mesma família.

## Objetivos

1. Mesma linguagem visual do Home (cards arredondados, hover wine soft, sombras suaves).
2. Hero da listagem alinhado ao Hero do Home (eyebrow + display + lede), com um toque do globo wine como ambientação — sutil, não competindo com a grade.
3. Toolbar (busca + filtros + contador) com hierarquia clara, filtros como chips coerentes com os botões do site.
4. Estado vazio com o mesmo tom dos cards (rounded, border soft) em vez de borda tracejada solta.

## Mudanças propostas

### Hero da listagem
- Manter `eyebrow` ("Mapa") + h1 display + lede.
- Adicionar wash radial wine soft no canto (à direita, espelhando o Home que joga à esquerda) — só wash, sem globo aqui, para não duplicar o efeito do Home.
- Trocar `border-b` por divisor mais leve (`border-border/60`) para acompanhar o resto.

### Toolbar (busca + filtros)
- Encapsular busca + chips + contador num bloco com `rounded-xl border border-border/60 bg-background/70 backdrop-blur-sm p-4` (mesmo material dos cards do Home).
- Input de busca: manter `font-serif`, mas com leve background (`bg-secondary/40`) e `rounded-md` em vez de underline solto, alinhando com a estética dos PathCards.
- Chips de filtro: substituir o preto sólido por **wine** quando ativo (`bg-[var(--accent-ink)] text-background border-[var(--accent-ink)]`); inativos com `border-border/60 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]`. Mesmas dimensões.
- Contador "N resultados" com `eyebrow` minúscula à direita.

### Grade de países
- Sair do padrão `gap-px` com fundo cinza (cria sensação de tabela densa) e adotar `gap-4` com cards individuais, espelhando exatamente a estética dos "Países em destaque" do Home:
  - `rounded-xl border border-border/60 bg-background/70 backdrop-blur-sm`
  - Hover: `-translate-y-0.5`, `hover:border-[var(--accent-ink)]`, `hover:bg-[var(--accent-ink-soft)]`, `hover:shadow-[0_8px_24px_-12px_rgba(122,31,31,0.25)]`
  - Seta `→` em wine no canto, com `translate-x-1` no hover.
- Bandeira mantém `rounded-md border` (já alinhado).
- Badge de status ("Em ratificação" / "Incompleto"): trocar o preto sólido invertido por chip wine outline (`border-[var(--accent-ink)] text-[var(--accent-ink)]`) para se manter coerente mesmo com o card claro (não invertemos mais o card inteiro no hover).
- Manter resumo curto e o "Ver país →" no rodapé do card.

### Estado vazio
- Trocar `border-dashed` por `rounded-xl border border-border/60 bg-background/70` com padding consistente.

## Fora de escopo (próximos passos)

- `/acordos/$pais` (página individual): será o próximo "caminho" da auditoria.
- Header / botão "Países": só o destino vai mudar de cara; o link em si está ok.
- Tokens novos: nenhum — reaproveitamos `--accent-ink` e `--accent-ink-soft` já criados.

## Detalhes técnicos

- Arquivo único: `src/routes/acordos.index.tsx`.
- Sem novas dependências, sem novos tokens em `src/styles.css`.
- Acessibilidade preservada: `aria-label` na busca, `aria-pressed` nos chips de filtro (adicionar — hoje não tem).
- Sem mudança de dados, rotas ou comportamento de filtro/busca.
