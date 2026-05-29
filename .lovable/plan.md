# Reescrita das duas calculadoras + fixes pendentes

## Objetivo
Separar de vez as duas calculadoras: **segurado = triagem comercial sem valores**, **advogado = laudo técnico completo**. Resolver no mesmo ciclo o drag&drop do Pro e o ícone de calendário invisível no tema dark.

## Mudanças no núcleo — `src/lib/calculadora.ts`

Reescrever para suportar dois modos sem regressão de tipos:

- `SMmin = 1621` (era 1412).
- Nova função `calcularTriagem(params)` → retorna apenas `{ caso, titulo, mensagem, tempoBrasil, tempoPais, tempoTotal, carencia, idadeAtual, idadeMin, mesesFaltantes?, mesesParaIdade? }`. Sem `SB`, sem `rmiTeorica`, sem `rmiProrata`, sem moeda. Mapeia os 4 cenários do brief (Brasil já cumpre / total insuficiente / idade pendente / totalização viável).
- Reescrever `calcularResultado` (usado só pelo Pro) seguindo o brief:
  - `tempoTotal = tempoBrasil + tempoPais`
  - `coeficiente`: aposentadoria por idade → `min(1.00, 0.70 + floor(tempoTotal/12) * 0.01)`; pensão por morte → `1.00`
  - `prestacaoTeoricaSemPiso = SB * coeficiente`
  - `prestacaoTeorica = max(prestacaoTeoricaSemPiso, SMmin)` **antes** do pro-rata (hoje é depois — corrigir)
  - `indiceProrata = tempoBrasil / tempoTotal`
  - `rmiProrata = prestacaoTeorica * indiceProrata` (sem piso pós pro-rata)
  - 4 cenários A/B/C/D conforme brief, incluindo cenário A retornando RMI integral (sem pro-rata) com aviso de que totalização reduziria o valor
- Tipo `ResultadoTriagem` (novo, sem campos monetários) e `ResultadoCalculo` (mantém campos monetários + `prestacaoTeoricaSemPiso`, `coeficiente`, `indiceProrata` expostos para o laudo).

## `src/components/calculadora-form.tsx` (público — segurado)

Reescrita enxuta. Remover qualquer referência a `SMmin`, `mediaSalarial`, `formatarMoeda`, `CenariosBlock`, `estimativa`, `sbFinal`.

**Coleta**:
- CNIS PDF: usar `parsearCNIS` mas consumir apenas `nome`, `cpf`, `dataNasc`, `totalMeses`. Ignorar `mediasSalarial`.
- Manual: tempo Brasil em anos + meses (já existe).
- Tempo exterior: datas ou meses (já existe).
- Tipo de benefício, país acordante, data nascimento, sexo (já existem).

**Resultado**: novo `ResultadoTriagemView` que mostra apenas:
- Título do cenário + badge (gold) com a `mensagem` exata do brief para cada caso.
- Resumo factual de input (tempo BR, tempo exterior, tempo total, carência exigida, idade atual quando relevante).
- Bloco CTA com três botões: "Falar com especialista", "Analisar meu caso", "Quero verificar meu direito" — todos apontando para `/contato` (mesmo destino do `CTAMarcos` atual; manter o `<CTAMarcos>` abaixo como reforço editorial).
- Remover `CenariosBlock` desta tela (era um híbrido que vazava conteúdo técnico para o público).

**Sem**: SB, média, prestação teórica, coeficiente, pro-rata, RMI, valor em R$, fórmula.

## `src/components/calculadora-form-pro.tsx` (Pro — advogado)

**A. Drag & drop do CNIS** (fix pendente, ainda não aplicado):
- Adicionar `dragOver` state. Trocar `<label>` por `<div role="button" tabIndex={0}>` com `onClick`/`onKeyDown` disparando `fileRef.current?.click()`, mantendo `<input type="file" className="sr-only">`.
- `onDragOver`/`onDragLeave`/`onDrop` com `e.preventDefault()`, valida `application/pdf`, chama `lerCnis(file)`. Erro amigável se não for PDF.

**B. Cálculo técnico**:
- Trocar `SMmin = 1412` → `1621` (via `src/lib/calculadora.ts`).
- Expor no laudo: SB, PBC (início efetivo a partir de 07/1994), média, coeficiente, prestação teórica **sem piso**, salário mínimo aplicado, prestação teórica final, tempo BR, tempo exterior, tempo total, índice pro-rata, RMI pro-rata, fórmula renderizada (`RMI pro-rata = Prestação teórica × Tempo Brasil / Tempo total`) e o parágrafo técnico do brief.
- Quando SB vem do CNIS, mostrar tag "estimativa sem correção INPC oficial" abaixo do campo SB; permitir override manual do SB já corrigido (campo `sbManual` que sobrepõe o do CNIS — provavelmente já existe; revisar e rotular).
- No parser CNIS (`src/lib/cnis-parser.ts`): filtrar salários por competência ≥ 07/1994. Hoje o parser captura valores sem janela temporal — adicionar regex/competência por linha e ignorar anteriores. Calcular média dos 80% maiores (descartar o quintil inferior) em vez da média simples.
- Quatro cenários A/B/C/D conforme brief, com mensagens-padrão e blocos visuais distintos (já temos `CenariosBlock` — adaptar/renomear para alimentar com `ResultadoCalculo` enriquecido).

**C. Manter**: identificação do cliente, botão Imprimir/PDF, rodapé identificável, `print:` styles.

## `src/styles.css` — calendário visível no dark
Adicionar regra global:
```css
input[type="date"], input[type="datetime-local"], input[type="time"], input[type="month"] {
  color-scheme: dark;
}
```
Restaura o ícone nativo do picker em todos os campos de data (calculadoras + futuras telas) sem mexer em componente nenhum.

## Detalhes técnicos
- Nenhuma mudança de backend, schema, server fn ou auth.
- `ResultadoCalculo` mantém compatibilidade com `cenarios-block.tsx`; adicionar campos novos (`prestacaoTeoricaSemPiso`, `coeficiente`, `indiceProrata`) opcionais.
- Remover do segurado: import de `SMmin`, `formatarMoeda`, `CenariosBlock`.
- Sem `<input type="date">` será substituído (a regra `color-scheme: dark` resolve sem trocar componente).
- Garantir que `calcularTriagem` e `calcularResultado` compartilhem os mesmos blocos de cálculo de tempo/carência/idade para evitar divergência entre as duas telas.

## Governança
- `ROADMAP.md`: entrada do dia com "Segurado = triagem; Advogado = laudo (SMmin 1621, PBC 07/1994, piso pré pro-rata, parser 80% maiores)".
- `.lovable/prd.md`: atualizar seção das calculadoras descrevendo a nova separação de responsabilidades e o conjunto de outputs permitidos em cada uma.
- README/stack: sem mudança.

## Fora de escopo
- Tabela INPC oficial de correção (mantém override manual; sinalizar como roadmap).
- Persistir resultados de triagem em `calc_history` (Pro continua persistindo).
- Tradução/i18n.
