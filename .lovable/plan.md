## Objetivo

Substituir a calculadora atual em `/hub/calculadora` pela versão profissional do GitHub (`calculadora-advogado.html`), mantendo a estética do Hub (cores via tokens semânticos em oklch, sem hex inline), e preservando o que já funciona (histórico, salvar cálculo, parser CNIS, autenticação).

A versão HTML é mais completa em três pontos: **layout em "laudo" pronto para impressão**, **campos extras de identificação** (Data da análise, Responsável/Advogado, Nome/CPF), e **resultados muito mais ricos** (4 cenários distintos, tabela técnica, fórmula explícita, planej-contador de idade, rodapé identificável).

## O que muda

### 1. Componente novo: `src/components/calculadora-form-pro.tsx`
Componente dedicado para a variante "pro", construído do zero com a UX do HTML. Mantém:
- Upload de CNIS (drag + click) via `extrairTextoPdf` + `parsearCNIS` já existentes
- Modo manual com **Anos + Meses separados** (como no HTML), em vez do campo único de meses atual
- Botão "Salvar cálculo" (via `saveCalc` que já existe)
- Botão "Imprimir / PDF" (`window.print()`)
- Botão "Limpar"

Campos novos no formulário (vindos do HTML):
- Data da análise (date)
- Responsável / Advogado
- Início / Fim de filiação no exterior (com fallback "ou total em meses")
- Sexo com rótulos descritivos ("Feminino — idade mínima 62 anos")

### 2. Lógica: pequenos ajustes em `src/lib/calculadora.ts`
- Adicionar países que faltam para paridade com o HTML: **Áustria, Bolívia, Bulgária, Estados Unidos, Índia, Moçambique, Paraguai, República Tcheca**, mantendo os atuais.
- Adicionar utilitário `calcMesesEntreDatas(iso1, iso2)` para o campo "início/fim" no exterior (datas em `YYYY-MM-DD` do input date).
- Manter `calcularResultado` como está — os 4 cenários (1, 2, 2B, 3) já cobrem o HTML.

### 3. Resultado em formato "laudo"
Nova subseção dentro do componente Pro, renderizando 4 cards distintos por caso, fiel ao HTML:
- **Caso 1**: aviso âmbar "Carência cumprida sem totalização" + tabela técnica
- **Caso 2**: erro vermelho "Carência insuficiente" + déficit em meses
- **Caso 2B**: roxo "Planejamento" + contador (idade atual / mínima / faltam) + tabela + projeção pro-rata
- **Caso 3**: sucesso verde + quadro com RMI Pro-rata em destaque + RMI Teórica + tabela técnica completa + fórmula

Cabeçalho de cliente (Nome, CPF, Data análise, Nascimento, Sexo, Responsável) renderizado acima do resultado e visível na impressão.

Rodapé identificável: "www.acordosinternacionais.com · Documento gerado em DD/MM/AAAA".

### 4. Estilo (CRÍTICO — tokens semânticos)
**Não copiar os hex do HTML** (`#1e3a5f`, `#2563eb`, etc.). Mapear para tokens já existentes em `src/styles.css`:
- gradientes do header → `--accent-ink` / variante já existente
- cores de status (verde/âmbar/vermelho/roxo) → tokens `--state-success`, `--state-warning`, `--state-error` + adicionar `--state-info` (roxo) se ainda não existir
- bordas/fundos suaves → `border-border/60`, `bg-background/70`, etc.

Adicionar tokens novos ao `src/styles.css` apenas se faltarem (ex.: `--state-info` para o roxo do "planejamento").

Print styles: usar utilitários `print:` do Tailwind + uma classe `.print-only` para o rodapé.

### 5. Rota
`src/routes/_authenticated/hub.calculadora.tsx` passa a importar `CalculadoraFormPro` (em vez de `CalculadoraForm variant="pro"`). A página `/calculadora` pública continua usando `CalculadoraForm variant="public"` sem alteração.

### 6. Limpeza
`CalculadoraForm` perde a prop `variant` e fica só "public" (ou mantém a prop ignorando "pro"). Mantemos sem quebrar a rota pública.

## Fora de escopo

- Não mexer no parser de CNIS (`src/lib/cnis-parser.ts`) — já cobre nome/CPF/data nasc/vínculos/salários.
- Não tocar em autenticação, RLS, `hub-personal.functions.ts` (salvar/listar).
- Não copiar o `<script>` do HTML literalmente: a lógica equivalente já existe em TS.

## Atualizações obrigatórias de docs (regra do projeto)

- `.lovable/prd.md`: registrar a nova versão "laudo" da calculadora Pro
- `ROADMAP.md`: marcar entrega
