## Objetivo

Refatorar **somente a calculadora pública** (`/calculadora`) para igualar o fluxo e a linguagem do `calculadora-segurado.html` enviado. A versão Pro (`/hub/calculadora`) e a lib `src/lib/calculadora.ts` não mudam — a lib já cobre todos os 4 casos necessários.

## Arquivos afetados

- `src/components/calculadora-form.tsx` — reescrita do bloco `variant="public"` (mantendo `variant="pro"` intocado, OU separando em dois componentes).
- `src/routes/calculadora.tsx` — ajustes mínimos de copy/título do header se necessário.

## Mudanças de UX (espelhando o HTML)

1. **Header amigável**: "🌍 Calcule seu benefício internacional" + subtítulo orientado ao segurado (não-jurídico).
2. **Tutorial colapsável** "📋 Precisa do seu extrato do INSS (CNIS)? Veja como baixar em 3 passos" com os 3 passos do HTML (link para meu.inss.gov.br).
3. **Passo 1️⃣ — Como você quer calcular?**
   - Toggle visual em 2 cards: `📄 Com extrato do INSS (Resultado mais preciso)` × `✏️ Sem extrato (estimativa)`.
   - Modo CNIS: drop-area com clique/drag-and-drop, status de leitura (loading / ok com nome+CPF / erro). Continua usando `extrairTextoPdf` + `parsearCNIS`.
   - Modo manual: alerta amarelo "estimativa" + campo Salário médio (R$) + Tempo no Brasil em **Anos / Meses** (dois inputs, não um total).
4. **Passo 2️⃣ — Tipo de benefício e dados**:
   - Data de nascimento como `<input type="date">` (substitui DD/MM/AAAA). Conversão para o formato `DD/MM/AAAA` exigido por `calcularResultado` ocorre no submit.
   - Sexo, Tipo de benefício, País — selects amigáveis.
5. **Passo 3️⃣ — Tempo no exterior**: Data início + Data fim (`<input type="date">`) **ou** "Total em meses" como alternativa, igual ao HTML.
6. **Botão** "🧮 Calcular meu benefício".
7. **Resultados por caso** (usando `caso` que já vem de `calcularResultado`):
   - **Caso 1** — card amarelo "⚠️ Você já tem direito no Brasil — sem precisar da totalização" (não exibir RMI teórica; texto explicando que a totalização reduziria).
   - **Caso 2** — card vermelho "❌ Ainda não é possível obter este benefício" com lista de detalhes e "Faltam X meses".
   - **Caso 2B** — card roxo "📋 Você tem o tempo — mas ainda não chegou a hora" com destaque para idade mínima e meses restantes.
   - **Caso 3** — card verde "✅ Você tem direito à totalização!" com **valor mensal estimado (R$)** em destaque, percentual de proporção Brasil e explicação "Como funciona". Badge `estimativa` se modo manual.
   - Cada caso fecha com `<CTAMarcos />` (já em uso) — substitui o `cta-box` com WhatsApp do HTML.
8. **Linguagem**: tudo em PT-BR coloquial dirigido ao segurado, sem jargão (sem "RMI teórica", "SBmin", "pro-rata" em destaque — só em pequeno texto explicativo).
9. **Tokens semânticos** de `src/styles.css` (cores oklch, `--state-*`, `--accent-*`). Nada de hex inline.

## O que NÃO muda

- `src/lib/calculadora.ts` — já cobre os 4 casos.
- `src/lib/cnis-parser.ts` / `pdfjs-loader.ts`.
- `CalculadoraFormPro` (versão do Hub).
- Rotas e auth.

## Detalhes técnicos

- Estado do form: `modo: 'cnis'|'manual'`, `salarioManual`, `anosBR`, `mesesBR` (modo manual); `cnisData` (modo CNIS); `dataNascISO`, `sexo`, `tipo`, `pais`, `dataInicExteriorISO`, `dataFimExteriorISO`, `mesesPaisManual`.
- Tempo no exterior: se `mesesPaisManual` preenchido → usa direto; senão calcula via `calcMesesEntreDatas(iniISO, fimISO)` (helper já existente).
- Tempo no Brasil (manual): `anos*12 + meses`.
- Salário base: `Math.max(salario, SMmin)` (igual ao HTML).
- Conversão de `dataNascISO` → `DD/MM/AAAA` antes de chamar `calcularResultado`.
- Toggle do tutorial via `useState`.
- Estados de erro/validação via mensagens inline (sem `alert()`).

## Verificação

- Testar os 4 casos manualmente no preview com dados sintéticos.
- Conferir que CNIS continua sendo lido (modo CNIS).
- Conferir que mobile (viewport ~390px) fica legível — cards e selects empilham.
