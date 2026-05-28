## Escopo desta rodada

Três frentes:

1. **Reestruturar `/profissional**` como LP de conversão (Hero → Problem → Story → Proof → Features → Planos → CTA).
2. **Adicionar retrato do Dr. Marcos** no hero de `/sobre/dr-marcos`.
3. **Estabelecer biblioteca de imagens realistas** para reutilizar pelo site (estilo das suas referências de LP).

---

## 1) `/profissional` — nova LP

### Conteúdo por bloco

**HERO** (preto-tinta, hairline)

- Eyebrow: `Hub Profissional · Direito Previdenciário Internacional`
- H1: *"O fundamento técnico dos acordos internacionais, para você fechar o caso hoje."*
- Subhead 1 linha: 40+ países · portarias · jurisprudência · calculadoras · certificados.
- 1 CTA `Ver planos` + microcopy `X de 100 vagas Fundadores restantes`
- Sem o parágrafo italic atual

**PROBLEM** — tom provocador e direto, 4 cards hairline (adicionei o quarto com a dor "informação espalhada no Gov" que você pediu)

- Eyebrow: `Por que isso existe`
- H2: *"Caso internacional cai na sua mesa. E agora?"*
- Card 1 — *"Texto do acordo? PDF velho do MPS, sem índice, sem versão atualizada."*
- Card 2 — *"INSS pede um certificado que você nunca emitiu. Roteiro? Cada hora um."*
- Card 3 — *"Cliente quer resposta hoje. Você precisa de 3 dias só pra mapear a base legal."*
- Card 4 (novo) — *"Gov.br, MPS, INSS, Receita, consulados — a mesma informação repartida em 12 abas, cada uma com um nome diferente para a mesma coisa."*
- Fecho copy "vendável": *"O Hub junta tudo num único lugar coordenado: texto integral comentado, portarias por tema, jurisprudência selecionada, mapas e endereços de órgãos, modelos de documentos prontos para baixar, fluxogramas de procedimento. Você para de garimpar e volta a advogar."*

**STORY** (retrato à esquerda · texto à direita, layout 2 colunas md)

- Eyebrow: `Quem construiu`
- Retrato Dr. Marcos (mesma foto que vou adicionar em `/sobre/dr-marcos`)
- Parágrafo: *"Dr. Marcos Espínola atua há mais de 10 anos exclusivamente em previdência. Cansado de ver advogados refazendo a mesma pesquisa do zero, organizou tudo o que usa no escritório dentro do Hub."*
- Link discreto: `Conhecer o Dr. Marcos →`

**PROOF** (banda `secondary`)

- 4 números grandes em Playfair: `40+ países` · `${totalDocs} docs` · `Texto integral comentado` · `Atualização contínua`
- Linha de credenciais reais (das que você me passou):
  - Sócio · Pagliuca, Espínola & Lessnau
  - Diretor Científico Adjunto · IBDP
  - Membro · Comissão de Direito Previdenciário OAB/PR
  - Professor e autor em obras coletivas de Direito Previdenciário
- **Sem depoimentos** (confirmado — entram quando houver reais).

**FEATURES** — grid 8 itens já existente, com 2 ajustes:

- Cada item começa com verbo de ação ("Consulte fichas-país…", "Acesse portarias…", "Baixe modelos…", "Calcule prorata…")
- Remove o aviso de "Modelos de petição suspenso"

**PLANOS** — intacto (Anual / Fundadores).

**CTA FINAL** — uma ação só

- Eyebrow: `Pronto para entrar?`
- H2: *"100 vagas vitalícias. Depois, só anual."*
- 1 botão `Ver planos` (âncora `#planos`)
- Remove link `Iniciar contato` e link `Conhecer o Dr. Marcos` daqui (foco em conversão)

### Detalhes técnicos

- Arquivo: `src/routes/profissional.tsx` (substituição completa do componente)
- Tokens semânticos apenas (`--foreground`, `--background`, `--secondary`, `--border`, `--rule`, `--accent-ink`)
- `font-display` Playfair em títulos e números; `.eyebrow` e `.lede` já existentes
- Sem emojis, sem `rounded-full` extra
- SEO: title/description novos refletindo "acordos internacionais resolvidos hoje"
- Zero mudança em lógica, planos, checkout

---

## 2) Foto do Dr. Marcos em `/sobre/dr-marcos`

- Copiar `user-uploads://foto_marcos.jpeg` → `src/assets/marcos-espinola.jpg`
- Hero da página passa a ser 2 colunas (md+): coluna esquerda com texto atual (eyebrow + H1 + lede + OAB), coluna direita com retrato em `aspect-[3/4]`, hairline, sutil sombra editorial. Em mobile, retrato fica acima do texto.
- Mesma imagem reaproveitada no bloco STORY de `/profissional` (importada do mesmo asset)

---

## 3) Biblioteca de imagens realistas pelo site (nova diretriz visual)

Suas referências de LP defendem: **toda seção tem uma imagem que reforça o que ela diz**. Vou criar uma biblioteca progressiva para o site reutilizar — não tudo nesta rodada, mas começamos a estrutura.

### Esta rodada (imagens geradas via `imagegen`, estilo fotográfico realista, paleta Paper & Ink, sem texto sobreposto)

Gero 4 imagens essenciais para o `/profissional`:

1. `src/assets/lp/problem-papers.jpg` — mesa de advogado com pilha de PDFs impressos, monitor com 8 abas abertas (ilustra o caos atual). Banner sutil no bloco PROBLEM.
2. `src/assets/lp/hub-organized.jpg` — mesma cena reorganizada: 1 laptop, 1 caderno, café (ilustra o "depois"). Aparece junto ao fecho da seção PROBLEM ou no início de FEATURES.
3. `src/assets/lp/world-map-pins.jpg` — mapa-múndi em papel fosco com pins discretos nos países dos acordos. Aparece como background do PROOF (40+ países).
4. `src/assets/lp/atlasprev-mark.jpg` — cena editorial neutra (livros de previdência, caneta-tinteiro) para o footer-card da AtlasPrev no CTA final.

### Próximas rodadas (não agora — fica documentado como diretriz)

- Cada `/jornadas/*` ganha 1 imagem editorial no hero
- Cada bloco grande de `/index.tsx` ganha apoio visual (hero de mundo, prova social, calculadoras em ação)
- Estilo travado: realista-fotográfico, luz natural, paleta off-white/preto-tinta/borgonha sutil, **nunca** stock genérico de "gente sorrindo apertando mão"

### Salvaguarda

- Cada imagem gerada como `.jpg` em `src/assets/lp/` e importada como ES6 module
- Memória a salvar: regra de "estilo editorial fotográfico realista, paleta Paper & Ink, sem texto sobreposto, sem stock genérico"

---

## Arquivos tocados

```
src/routes/profissional.tsx          (reescrito)
src/routes/sobre.dr-marcos.tsx       (hero ganha 2 colunas + retrato)
src/assets/marcos-espinola.jpg       (novo — copiado do upload)
src/assets/lp/problem-papers.jpg     (novo — gerado)
src/assets/lp/hub-organized.jpg      (novo — gerado)
src/assets/lp/world-map-pins.jpg     (novo — gerado)
src/assets/lp/atlasprev-mark.jpg     (novo — gerado)
.lovable/prd.md                      (registra a diretriz visual)
ROADMAP.md                           (registra próximas imagens da biblioteca)
mem://design/imagery-direction       (regra de estilo de imagens)
mem://index.md                       (referência à nova memory)
```

Sem mudança em servidor, banco, lógica, planos ou checkout.

Pronto para construir.