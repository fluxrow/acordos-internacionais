## Objetivo

Alinhar nossas duas calculadoras com as referências do Marcos, mantendo a identidade **Premium Dark + Gold** (sem copiar o visual azul/lilás dos HTMLs).

1. Após o cálculo, exibir um bloco com **duas colunas** (Segurado vê / Advogado vê) cujo conteúdo é gerado dinamicamente a partir dos dados do usuário, no padrão das imagens G1–G4.
2. Esse bloco aparece **tanto na calculadora pública** (`/calculadora`) **quanto na do hub** (`/hub/calculadora`).
3. Complementar a calculadora pública com o tutorial CNIS expandido e a numeração 1/2/3 do HTML segurado.

## Cenários a detectar (matriz)

A partir do `ResultadoCalculo` + inputs, classificar em **um ou mais** cenários (podem combinar, ex.: G1+G4):

| ID | Gatilho | Quando | Texto guiado pelas imagens |
|----|---------|--------|----------------------------|
| G1 | `caso === 1` | Brasil já cumpre carência solo | "Carência já cumprida solo" |
| G2 | `caso === 3` e ambos `tempoBrasil` e `tempoPais` ≥ ~96 meses (8 anos) e `tempoBrasil < carencia` | Dupla elegibilidade potencial | "Tempo relevante nos dois países" |
| G3 | `caso === 3` e `(rmiTeorica − rmiProrata) / rmiTeorica > 0.20` | Pro-rata penaliza >20% | "Pro-rata reduz RMI em mais de 20%" |
| G4 | `tempoPais < 180` (independente do caso) e país tem carência conhecida | Tempo no exterior insuficiente para benefício autônomo no país | "Tempo no exterior insuficiente" |

`caso === 2` e `caso === "2B"` ganham variantes específicas (G2-faltam-meses e G2B-aguardar-idade) com mesmo formato dois-cards.

## Componente único

Criar `src/components/calculadora/cenarios-block.tsx`:

```text
<CenariosBlock resultado={...} inputs={{ pais, sexo, tipo, dataNasc, sbFinal }} variant="publico" | "advogado" />
```

- Internamente roda `detectarCenarios(resultado, inputs)` (puro, em `src/lib/calculadora-cenarios.ts`) → array de `Cenario`.
- Para cada cenário renderiza um cartão expansível com header (badge G1/G2/G3/G4 em gold, título, exemplo factual com os números reais do usuário) e dois painéis lado a lado:
  - **Segurado vê** — texto humano, sem jargão, com CTA para Marcos.
  - **Advogado vê** — análise técnica, recomendações em bullets, e chips com citações legais (Dec. 4.729/2003, Art. 35 Dec. 3.048/99, etc.). Os chips usam variantes outline com `--accent-ink`.

Visual: cartões `bg-[var(--card-bg)]`, borda sutil `border-[var(--border)]`, header com ícone gold; nada de azul/lilás das imagens — só a estrutura.

Na pública, `variant="publico"` ainda mostra a coluna do advogado, mas com header "Por que o Dr. Marcos pode ajudar" e CTA reforçado no fim — assim o segurado vê o valor do especialista.

## Pesquisa de citações por país

Adicionar mini-tabela em `src/lib/calculadora-cenarios.ts`:

```text
PAIS_CITACOES = {
  "Espanha": { acordo: "Dec. 4.729/2003", carencia: 180 },
  "Portugal": { acordo: "Dec. 1.457/95", carencia: 180 },
  ...
}
```

Cobrir os 24 países já listados em `PAISES_ACORDO`. Fonte: dados de `src/data/acordos.generated.ts` (reutilizar quando possível).

## Calculadora pública — gaps adicionais

Em `src/components/calculadora-form.tsx`:

1. **Tutorial CNIS expandido** (substitui o `<details>` curto):
   - 3 passos com numeração: meu.inss.gov.br → Extrato de Contribuição → Emitir PDF.
   - Cartão recolhível, ícone gold, mesma estrutura visual de cards do site.
2. **Numeração de etapas**: badges "1", "2", "3" gold antes de cada bloco (Como calcular / Dados do benefício / Tempo no exterior).
3. **Toggle visual CNIS vs Manual** no topo do passo 1 (dois cartões clicáveis), em vez do drop implícito atual. Mantém o upload PDF que já temos.
4. No final, inserir `<CenariosBlock variant="publico" />` antes do `<CTAMarcos>`.

## Calculadora Pro — ajustes

Em `src/components/calculadora-form-pro.tsx`:

1. Inserir `<CenariosBlock variant="advogado" />` no bloco de resultado (antes do CTA / depois da tabela RMI da imagem 1).
2. Garantir que o botão **Imprimir/PDF** já existente também imprima o bloco de cenários (ajustar `print:` classes — esconder controles, mostrar tudo do resultado).
3. Rodapé "Calculadora de RMI Pro-rata — acordosinternacionais.com · Documento gerado em {data}" no modo impressão (já parece existir parcialmente — verificar e padronizar).

## Identidade visual (não negociável)

- Zero hex literal nos componentes — só tokens (`--accent-ink`, `--ink`, `--paper`, `--paper-soft`, `--card-bg`, `--border`, `--shadow-soft`).
- Badge G1/G2/G3/G4 = circular gold com ícone/letra branca.
- Header "SEGURADO VÊ" / "ADVOGADO VÊ" = eyebrow uppercase tracking-wide; "ADVOGADO VÊ" recebe `.text-gold`.
- Chips de citação legal = outline pill `border-[var(--accent-ink)]/40 text-[var(--ink-soft)]`.
- Cards com `rounded-2xl`, `shadow-[var(--shadow-soft)]`, hover-elevation conforme regra Core.

## Governança

- Atualizar `.lovable/prd.md` e `ROADMAP.md` na mesma rodada (regra Core).
- Sem mudanças em backend, schema, server fns ou auth.
- Cálculo financeiro (RMI/pro-rata) **não** muda — só consumimos `ResultadoCalculo` para classificar cenários.

## Arquivos tocados

```text
src/lib/calculadora-cenarios.ts                 (novo — detector + textos)
src/components/calculadora/cenarios-block.tsx   (novo — UI dois-cards)
src/components/calculadora-form.tsx             (insere bloco + tutorial + numeração)
src/components/calculadora-form-pro.tsx         (insere bloco + ajustes print)
.lovable/prd.md                                  (registro)
ROADMAP.md                                       (registro)
```

## Fora de escopo (próxima rodada se quiser)

- Geração de PDF estilizado (hoje usa `window.print()`).
- Persistir snapshot dos cenários no `calc_history` para reabrir depois.
- Tradução dos textos / variantes regionais.
