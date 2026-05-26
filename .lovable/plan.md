## Objetivo

Remover o campo "Salário médio de contribuição (R$)" do modo "Sem extrato" da calculadora pública, de modo que — quando o usuário não carregar o CNIS — o cálculo seja feito apenas sobre o tempo de contribuição (carência e idade), sem estimar valores monetários.

## Arquivos afetados

- `src/components/calculadora-form.tsx`
- `src/lib/calculadora.ts`

## Mudanças

### 1. UI — Remover campo de salário (modo manual)

Em `calculadora-form.tsx`, no bloco `modo === "manual"`:

- Remover o input de "Salário médio de contribuição (R$)" e seu label/ajuda.
- Manter os campos de tempo no Brasil (anos + meses).
- Ajustar o alerta/info do modo manual para deixar claro que o cálculo será apenas de tempo.

### 2. Validação — Ajustar `onCalcular`

- No modo manual: exigir apenas `tempoBrasilMeses > 0` (remover a exigência do salário).
- Passar `sbFinal = 0` para `calcularResultado` quando estiver no modo manual.
- Manter `estimativa = true` no modo manual para sinalizar que não há CNIS.

### 3. Lógica — Adaptar `calcularResultado`

Em `calculadora.ts`:

- Aceitar `sbFinal = 0`.
- Quando `sbFinal <= 0`:
  - **Caso 1**: não retornar `rmiTeorica` (pois não há base salarial para calcular).
  - **Caso 3**: não retornar `rmiTeorica` nem `rmiProrata`.
- Adaptar a descrição do **Caso 1** quando não há salário: remover a frase sobre "REDUZIRIA o valor do benefício" e focar apenas no tempo.

### 4. UI — Adaptar `ResultadoView`

Em `calculadora-form.tsx`, no componente `ResultadoView`:

- Receber nova prop `semSalario` (ou reaproveitar `estimativa` com novo significado).
- Quando `semSalario`:
  - **Caso 3**: ocultar o bloco de destaque com o valor estimado em R$.
  - **Caso 1**: usar descrição amigável sem referência a valores monetários.
  - Adicionar um aviso educativo: "Para saber o valor exato do benefício, é necessário carregar o extrato do INSS (CNIS)."

## Resultado esperado

A calculadora pública continua funcional em dois modos:

- **Com extrato (CNIS)**: calcula tempo + valores, como hoje.
- **Sem extrato (manual)**: o usuário informa apenas o tempo no Brasil e no exterior; o resultado indica se a carência/idade é atingida, mas **não estima valores em reais**.  
  
e ai temos que ter o ct pra pessoa poder falar com o dr marcos 
- &nbsp;