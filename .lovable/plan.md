# Bug: calculadora trava mesmo com CNIS carregado

## Diagnóstico

No print, o extrato foi lido com sucesso (banner verde "Extrato carregado — 23 anos e 5 meses de contribuição · Segurado: CYNTHIA…"), mas ao clicar em **Calcular meu benefício** aparece o erro "Envie o extrato do INSS (CNIS) em PDF primeiro".

Em `src/components/calculadora-form.tsx` (linhas 168–176), a validação do modo `cnis` é:

```ts
if (!cnis || cnis.mediaSalarial <= 0) {
  setErroForm("Envie o extrato do INSS (CNIS) em PDF primeiro — ou use o modo sem extrato.");
  return;
}
```

O parser (`src/lib/cnis-parser.ts`) extraiu corretamente **nome, CPF, data de nascimento e totalMeses**, mas o regex de salários (`R\$?\s*([\d.,]+)`) não casou — possivelmente porque o CNIS dessa segurada não tem coluna "R$" no formato esperado (PDFs antigos, layout 2023+, ou somente vínculos sem remunerações detalhadas). Resultado: `mediaSalarial = 0`, e a validação rejeita.

Isso é uma falsa rejeição: o tempo de contribuição (que é o dado essencial para saber se há **direito** ao benefício) foi lido perfeitamente. Apenas o **valor em R$** não pode ser estimado.

## Correção (escopo mínimo, só frontend)

Em `src/components/calculadora-form.tsx`, branch `modo === "cnis"` no `onCalcular`:

1. Exigir apenas que `cnis` exista E que `cnis.totalMeses > 0` (não exigir salário).
2. Se `cnis.mediaSalarial <= 0`, setar `sbFinal = 0` e `estimativaLocal = true` — mesmo tratamento do modo manual, calcula direito mas não estima valor.
3. Atualizar a mensagem de erro para o caso real (CNIS sem nenhum vínculo lido): "Não conseguimos ler períodos de contribuição neste PDF. Use o modo 'Sem extrato' e informe o tempo manualmente."

```ts
if (!cnis || cnis.totalMeses <= 0) {
  setErroForm("Não conseguimos ler períodos de contribuição neste PDF. Use o modo 'Sem extrato' e informe o tempo manualmente.");
  return;
}
sbFinal = cnis.mediaSalarial > 0 ? Math.max(cnis.mediaSalarial, SMmin) : 0;
tempoBrasilMeses = cnis.totalMeses;
estimativaLocal = cnis.mediaSalarial <= 0;
```

O `ResultadoView` já trata `estimativa=true` (não mostra valor em R$), então nada mais muda.

## Fora de escopo

- Melhorar o parser de salários no CNIS (faz sentido como follow-up separado). isso é essencial na calcjulado do HUB para o advogado
- Mexer na calculadora Pro (`calculadora-form-pro.tsx`) — checar se tem o mesmo bug fica como follow-up se você quiser.
- Backend / tipos / validações server-side. verifica e aplique se necessario.

## Arquivos alterados

- `src/components/calculadora-form.tsx` (linhas ~168–176)