
# Plano — Refino editorial da página `/sobre/dr-marcos`

Mexer apenas em frontend/conteúdo. Atualizar a copy oficial e introduzir o **Interactive Image Accordion** para apresentar as áreas de atuação do Dr. Marcos.

---

## 1. Novo conteúdo (copy oficial)

Substituir o texto atual pelo enviado:

- **Hero**: nome + bio curta (advogado previdenciarista, sócio Pagliuca, Espínola e Lessnau, fundador do hub) + linha discreta **OAB/PR 49.038**.
- **Bloco "Atuação"** dividido em dois parágrafos: previdenciário nacional / previdenciário internacional (com a frase de planejamento previdenciário internacional).
- **Bloco "Por que este hub existe"** com o texto novo.
- **Bloco "Como falar comigo"** com o texto novo + link para `/profissional`.
- **CTA Marcos** no aside (já existe) — manter.

Sem mudanças em rotas, dados ou backend. Sem novo metadado além de pequeno ajuste do `description`.

---

## 2. Componente novo: Interactive Image Accordion

Criar `src/components/interactive-image-accordion.tsx` inspirado em `21st.dev/minhxthanh/interactive-image-accordion`, mas **adaptado aos nossos tokens semânticos** (sem cores hex em componente; usar `--background`, `--foreground`, `--accent-ink`, `--accent-ink-soft`, `font-display`, etc.).

Comportamento:
- Linha horizontal de cards (responsivo: empilha em mobile como coluna).
- Cada card colapsado mostra **título vertical** + leve gradiente.
- Ao **hover** (desktop) / **tap** (mobile), o card expande com `flex-grow` animado, revela **imagem de fundo** representativa do tema e o **texto descritivo** sobreposto (overlay escuro `bg-[var(--accent-ink)]/70` + texto em `foreground` invertido).
- Transições com `transition-all duration-500 ease-in-out`.
- Acessibilidade: cada card é um `<button>` com `aria-expanded`.

API:
```ts
type AccordionItem = {
  id: string;
  titulo: string;        // ex.: "Totalização de períodos"
  descricao: string;     // bullets/itens da subárea
  imagem: string;        // import de src/assets
  alt: string;
};
<InteractiveImageAccordion items={...} />
```

Sem dependência externa nova — só Tailwind + React state.

---

## 3. Onde encaixar o accordion na página

Logo após o bloco "Atuação" (que descreve nacional + internacional em texto corrido), adicionar uma seção **"Áreas de atuação no previdenciário internacional"** com o accordion contendo os 7 itens:

1. Totalização de períodos contributivos
2. Aposentadoria por idade e por invalidez
3. Pensão por morte
4. Prova de vida
5. Certificado de Deslocamento Temporário (CDT)
6. Comunicação de Saída Definitiva do País (CSDP)
7. Planejamento previdenciário internacional

Cada item ganha 1–2 linhas de descrição (a partir do texto enviado) + uma imagem de fundo.

---

## 4. Imagens de fundo

Gerar 7 imagens com `imagegen` (estilo editorial, paleta neutra/quente alinhada com o site — `oklch` de `--accent-ink-soft` + tons documentais), salvas em `src/assets/atuacao/`:

- `totalizacao.jpg` — carimbos, documentos antigos, mãos sobrepostas em papelada.
- `aposentadoria.jpg` — pessoa sênior em janela com luz natural.
- `pensao-morte.jpg` — flor seca sobre carta/documento.
- `prova-vida.jpg` — mãos segurando passaporte/documento, luz suave.
- `cdt.jpg` — passaporte com carimbos + mapa-mundi.
- `csdp.jpg` — mala/aeroporto silencioso.
- `planejamento.jpg` — escrivaninha com mapa, caderno, caneta.

Tom: editorial, monocromático/desaturado para o overlay e texto ficarem legíveis. Resolução 1024×1280 (formato vertical, casa com cards verticais).

---

## 5. Documentação obrigatória

- `.lovable/prd.md`: adicionar entrada "Refino editorial /sobre/dr-marcos + componente InteractiveImageAccordion".
- `ROADMAP.md`: marcar página `/sobre/dr-marcos` no item de refino editorial.
- `mem://design/...` se necessário (componente novo reutilizável → registrar referência).

---

## 6. Detalhes técnicos

- **Arquivos novos**: `src/components/interactive-image-accordion.tsx`, 7 imagens em `src/assets/atuacao/`.
- **Arquivos editados**: `src/routes/sobre.dr-marcos.tsx`, `.lovable/prd.md`, `ROADMAP.md`, `mem://index.md` (linha de referência).
- **Sem mudanças** em rotas, RLS, server functions, dados.
- **Tokens**: 100% via `src/styles.css` (sem hex inline).
- **Mobile (≤768px)**: accordion vira coluna vertical (cada card mostra imagem + texto direto, sem hover); usa `md:` para o comportamento horizontal expansível.

---

## 7. Validação

1. Acessar `/sobre/dr-marcos` em desktop → ver hero + texto novo + accordion expandindo no hover com imagens de fundo + texto legível.
2. Acessar em mobile (375px) → cards empilhados, imagens visíveis.
3. Conferir contraste (overlay garante AA).
4. Conferir que nenhuma classe `text-white`/`bg-black` foi introduzida.

---

## Pergunta única antes de implementar

As 7 áreas listadas acima estão certas para o accordion, ou prefere agrupar diferente (ex.: 5 cards combinando CDT+CSDP, juntando aposentadoria+pensão)? Se ok como está, sigo com 7.
