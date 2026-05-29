# Laudo RMI Pro-rata — geração de PDF

## Objetivo
Implementar geração de laudo profissional da Calculadora Pro fiel à referência enviada (Premium Dark + Gold, A4, tipografia Playfair + Source Serif + Inter), pronto para imprimir/salvar como PDF e enviar ao cliente.

## Abordagem
HTML + `window.print()` com `@page A4 margin:0`. Para não poluir o CSS da calculadora (que mistura tela e print), o laudo vive em **rota dedicada** `/hub/laudo` que monta só o documento. Estado entre calculadora e laudo passa por `sessionStorage` (payload é serializável e pequeno).

## Estrutura de arquivos

**Novos:**
- `src/lib/laudo-payload.ts` — tipo `LaudoPayload` + helpers `saveLaudoPayload()` / `loadLaudoPayload()` (sessionStorage, chave `laudo:pending`).
- `src/components/laudo/LaudoPdf.tsx` — documento completo (header, hero, identificação, períodos, parâmetros, memória de cálculo, fundamento legal, nota técnica, rodapé). Recebe `LaudoPayload` por prop.
- `src/components/laudo/laudo-pdf.css` — todo o CSS da referência, escopado por `.laudo-root` para não vazar.
- `src/routes/_authenticated/hub.laudo.tsx` — rota que lê o payload do sessionStorage, monta `<LaudoPdf/>` e injeta botão flutuante "Baixar / Imprimir PDF" (`print:hidden`).

**Editados:**
- `src/components/calculadora-form-pro.tsx` — substituir o atual botão "Imprimir / PDF" por "Gerar laudo PDF" que: serializa estado em `LaudoPayload`, grava no sessionStorage e abre `/hub/laudo` em **nova aba** (`window.open`). Mantém botão "Imprimir tela" como fallback opcional? **Não** — remove para evitar duplicidade.
- `.lovable/prd.md` e `ROADMAP.md` — registrar a feature.

## LaudoPayload (payload mínimo)
```ts
type LaudoPayload = {
  cliente: { nome; cpf; dataNasc; sexo: "F"|"M"|""; especie: TipoBeneficio };
  pais: string;                       // nome (ex. "Canadá")
  paisBandeira?: string;              // emoji (derivado de PAISES_ACORDO)
  acordo: { nome; decreto; dispositivoProrata; carenciaArt };
  advogado: { nome; oab };
  periodos: Array<{ sistema; inicio; fim; meses; computaCarencia: bool; fonte }>;
  tempoBrasil; tempoPais; tempoTotal; carenciaExigida;
  resultado: ResultadoCalculo;        // já existe
  dataAnalise; ref;                   // ref = "2026-MMDD-XXXX"
}
```

Helper `buildLaudoPayload(state)` no `calculadora-form-pro.tsx` monta isso a partir dos inputs/resultado atuais. Períodos: por enquanto o estado da Pro só tem `tempoBrasilMeses` agregado — geramos UMA linha "RGPS — Brasil" + UMA linha "Período no exterior" (declarado), suficientes para o MVP. Quando o parser de CNIS expuser períodos individuais, é só preencher mais linhas.

## Layout (segue a referência)
1. **Header** — marca "Acordos Internacionais" / "Previdência · BR · AtlasPrev" à esquerda; "Documento técnico / Laudo de Cálculo / Ref." à direita; régua dourada degradê.
2. **Hero (3 colunas)** — RMI Pro-rata · Fator Pro-rata · Carência (chip verde/vermelho).
3. **Identificação do segurado** — grid 3 colunas.
4. **Períodos contributivos** — tabela com tfoot totalizando + chip de carência.
5. **Parâmetros do cálculo** — grid 4 colunas (SB, coef, RMI integral, fator pro-rata).
6. **Memória de cálculo** — formula-box com 3 linhas (Fator / RMI Integral / RMI Pro-rata Final).
7. **Fundamento legal** — grid 2 colunas (acordo, decreto, dispositivo, carência) — derivado de `decretoDoPais(pais)` + tabela estática `acordoMeta` no `laudo-payload.ts`.
8. **Nota técnica** — disclaimer.
9. **Footer** — responsável (Dr. X / OAB) à esquerda com linha de assinatura; marca + URL à direita.

## Variações por caso de resultado
- **Caso 1 (BR solo)**: Hero mostra "RMI Integral" no lugar de "Pro-rata"; fator pro-rata vira "não aplicável"; memória mostra só `SB × coef`.
- **Caso 2 (insuficiente)**: Hero mostra chip vermelho "Carência não atingida" + meses faltantes; oculta memória de cálculo; nota destacada.
- **Caso 2B (aguarda idade)**: igual ao caso 3 + chip âmbar "Projeção — aguarda idade mínima".
- **Caso 3**: layout padrão da referência.

## Out of scope (não nessa rodada)
- QR code, disclaimer extra, e-mail direto, upload do PDF (usuário pediu enxuto).
- Extração de períodos individuais do CNIS para a tabela (depende de evolução do parser).
- Correção INPC do SB.
- Persistência do laudo no Supabase (já existe `SalvarCalculoButton` separado).

## Validação
1. Abrir calculadora Pro, preencher cliente + sb + tempo BR + país + tempo país.
2. Calcular → clicar "Gerar laudo PDF" → nova aba abre em `/hub/laudo` com layout idêntico à referência.
3. Botão "Baixar / Imprimir PDF" aciona `window.print()`; conferir A4 sem margens brancas, cores escuras preservadas (`print-color-adjust: exact`).
4. Repetir para os 4 casos (1, 2, 2B, 3) e validar variações.
5. Atualizar `.lovable/prd.md` + `ROADMAP.md`.

## Detalhes técnicos
- Fontes via `<link>` no `<head>` da rota (TanStack `head()`); fallback Georgia/system-ui já no CSS.
- CSS isolado em `.laudo-root` + `@media print { body { background: var(--bg) } }`.
- Sem dependência nova (nada de jsPDF/html2canvas/react-pdf).
- TypeScript estrito; nenhum `any`.
