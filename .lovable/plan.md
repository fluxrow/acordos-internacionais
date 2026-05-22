## Refinamento UI — /sobre/dr-marcos

Foco: bordas arredondadas, repensar a cor do accordion e elevar 3 sessões editoriais (Atuação / Por que este hub existe / Como falar comigo) com lógica de conversão sutil — o conteúdo demonstra capacidade, sem CTA "vendedor".

### 1. Bordas arredondadas (global no escopo da página)

- Accordion: `rounded-2xl` em cada card + `overflow-hidden` (já tem). Container com `gap-3` mantido.
- CTAs e blocos editoriais: `rounded-2xl` em containers, `rounded-xl` em sub-cards.
- Imagens dentro do accordion herdam o raio do container.

### 2. Cor do accordion (corrigir "vermelho demais")

Hoje overlay = `var(--accent-ink)` puro (vinho saturado) em 55–85%. Vai mudar para:

- **Inativo**: overlay neutro escuro `color-mix(in oklab, var(--accent-ink) 35%, #1a1a1a 65%)` a 70% — vira marrom-grafite sóbrio, deixa a imagem respirar.
- **Ativo**: gradiente vertical do transparente (topo, imagem visível) → `var(--accent-ink)/85` (base, onde fica o texto). Imagem aparece nítida no topo, texto legível embaixo.
- Título vertical (estado inativo): cor `var(--paper)` com `opacity-90`, tracking maior.
- Borda fina `border border-[var(--accent-ink)]/15` em cada card.

### 3. Sessão "Atuação" — repensar layout

Hoje: bloco de texto + sidebar com CTAMarcos. Fica plano e a sidebar compete com a leitura.

Nova estrutura editorial em 2 colunas assimétricas:

```
[ Eyebrow + H2 "Atuação" ]
[ Coluna A: Nacional ]   [ Coluna B: Internacional ]
       card rounded-2xl        card rounded-2xl destacado
                               (bg accent-ink-soft + borda accent-ink/30)
[ Faixa horizontal: "Especialização que vira método" ]
   3 pílulas/stats: anos de OAB | foco exclusivo | hub público
```

- Cards lado-a-lado mostram que o trabalho tem duas frentes; o card internacional fica visualmente destacado (é a especialidade do hub) — conversão sem CTA.
- CTAMarcos sidebar **sai daqui** e vira só o bloco final (evita duplicação).
- 3 stats curtos no fim reforçam autoridade (sem números inventados — usar "Atuação exclusiva em previdenciário", "Hub público mantido pelo escritório", "OAB/PR 49.038").

### 4. Sessão "Por que este hub existe" — quote editorial

Vira destaque com tratamento de citação:

- Eyebrow "Manifesto" + H2.
- Parágrafo de abertura em `text-xl font-display italic` com aspas decorativas em `var(--accent-ink)`.
- Texto principal em coluna estreita (`max-w-2xl`).
- No final, micro-grid de 3 itens com ícone (Lucide: `BookOpen`, `Scale`, `Users`) + label curta: "Linguagem clara" / "Profundidade técnica" / "Um único lugar". Cada item `rounded-xl border bg-secondary p-5`.
- Isso mostra o valor entregue ao visitante (visitante = cidadão ou advogado) sem CTA.

### 5. Sessão "Como falar comigo" — dois caminhos visuais

Vira grid de 2 cards `rounded-2xl` lado a lado, cada um um público:

- **Card 1 — "Cidadão"** (claro, `bg-secondary`): texto sobre formulário + link "Formulário de contato →" estilo ink-link.
- **Card 2 — "Advogado"** (escuro/destaque, `bg-[var(--accent-ink)] text-[var(--paper)]`): apresenta o hub profissional como recurso técnico (portarias comentadas, modelos, jurisprudência, calculadoras) + link "Hub profissional →".

Conversão dupla, sem hard sell — cada visitante encontra o caminho dele. O card escuro do hub pro é o gancho de upgrade natural.

### 6. CTAMarcos (variant block) no final

- Já existe. Apenas arredondar (`rounded-2xl` no bloco interno, se houver) e garantir que não conflite visualmente com o card escuro acima — vai ficar logo abaixo da sessão "Como falar comigo".
- Como o último bloco já é dois cards, o CTA final ganha papel de fechamento humano: "Conte sua situação".

### 7. Arquivos a editar

- `src/components/interactive-image-accordion.tsx` — `rounded-2xl`, novo overlay neutro, gradiente no ativo, borda fina.
- `src/routes/sobre.dr-marcos.tsx` — reestrutura Atuação (2 cards + stats), Manifesto com quote + 3 ícones, "Como falar" como 2-card grid.
- `src/components/cta-marcos.tsx` — pequeno ajuste de raio (`rounded-2xl`).
- `.lovable/prd.md` + `ROADMAP.md` — registrar refinamento.

### 8. Princípios aplicados

- Conversão por demonstração: cada sessão exibe uma capacidade (especialização dual, manifesto editorial, hub técnico) em vez de pedir contato.
- Hierarquia visual leva o olho: hero → atuação dual → áreas (accordion) → manifesto → dois caminhos → CTA humano final.
- Cor vinho usada com economia: dominante no accordion ativo e no card "advogado", suporte (soft) no resto.
- Sem `text-white`/`bg-black` — só tokens.
