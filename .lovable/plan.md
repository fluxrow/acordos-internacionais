## Reposicionamento de marca

Antes só de ícone/metadados, alinhar a hierarquia:

- **Marca principal:** **Acordo Internacional** (= domínio `acordo-internacional.lovable.app`). É o que aparece em título, ícone, og-image, header e footer.
- **Selo institucional:** **"Acordo Internacional by AtlasPrev"** — assinatura que indica a casa por trás do projeto. Aparece em pontos estratégicos discretos (footer principal, og-image como linha secundária).
- **Dr. Marcos:** coadjuvante. Continua como autoridade-rosto dentro do conteúdo (CTA do aside, página `/sobre/dr-marcos`, blog), mas **não é mais a marca**. Sai de título da home, og-image e qualquer lugar que sugira que o site é "do Dr. Marcos".

## O que muda em cada superfície

### 1. Ícone / favicon

- Símbolo: monograma **"AI"** (Acordo Internacional) ou um glifo abstrato representando ponte/acordo bilateral entre dois pontos. Monocromático, sóbrio, alinhado ao design atual (fundo `--foreground`, traço `--background`, sem gradiente).
- Saída: `public/icon.png` (512×512), `public/favicon.ico` (32×32), `public/apple-touch-icon.png` (180×180).

### 2. Imagem de compartilhamento (og:image)

- Formato 1200×630.
- Composição: símbolo à esquerda; à direita, hierarquia tipográfica:
  - **"Acordo Internacional"** (título grande)
  - "Acordos previdenciários bilaterais e totalização para brasileiros no exterior." (subtítulo)
  - Linha-assinatura discreta no rodapé: **"by AtlasPrev"**
- Salvar em `public/og-image.jpg`.

### 3. Metadados (`src/routes/__root.tsx` e `src/routes/index.tsx`)

- `__root.tsx` recebe os `<link rel="icon">`, `apple-touch-icon`, e `og:site_name = "Acordo Internacional"`.
- `index.tsx` (home):
  - `title`: "Acordo Internacional — Acordos previdenciários para brasileiros no exterior"
  - `meta description`: ~150 caracteres descrevendo escopo (acordos bilaterais, totalização, hub profissional pra advogados).
  - `og:title`, `og:description`, `og:image: /og-image.jpg`, `og:type: website`, `twitter:card: summary_large_image`.

### 4. Header (`src/components/site-header.tsx`)

- Logotipo/wordmark passa a ser **"Acordo Internacional"** (texto institucional, sem assinatura AtlasPrev no header — header fica limpo).
- Se hoje cita "Dr. Marcos" como marca, troca por "Acordo Internacional".

### 5. Footer (`src/components/site-footer.tsx`) — **ponto estratégico da assinatura**

- Bloco da marca no topo do footer: **"Acordo Internacional"** + tagline curta ("Acordos previdenciários bilaterais. Totalização e hub profissional.").
- Linha final do footer (créditos, ao lado/abaixo do copyright): **"Acordo Internacional by AtlasPrev"** em tipografia menor, tom `text-muted-foreground`.
- Se houver outra menção a "Dr. Marcos" como dono do site, vira "AtlasPrev". Conteúdo dele como autoridade (página `/sobre/dr-marcos`, CTA do aside) **não é tocado**.

### 6. Home (`src/routes/index.tsx`) — copy

- Conferir hero: se a frase de abertura hoje cita "Dr. Marcos", reescrever pra falar de "Acordo Internacional" como marca/projeto. CTA do Dr. Marcos no aside permanece (é o canal humano).

## QA visual

- Renderizar `og-image.jpg` e abrir como imagem pra checar margens, contraste, legibilidade do título e da assinatura "by AtlasPrev".
- Conferir favicon na aba.
- Confirmar que `head()` da home não duplica tags do `__root.tsx`.
- Reler header e footer no preview pra garantir que "Acordo Internacional" virou a marca dominante e "by AtlasPrev" aparece só no rodapé.

## Fora do escopo desta rodada

- Trocar `og:image` por país em `/acordos/$pais` (próxima rodada).
- Manifest PWA, sitemap, robots.
- Renomear arquivos/rotas (não é necessário — o domínio já é `acordo-internacional`).

## Arquivos afetados

- **Novos:** `public/icon.png`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/og-image.jpg`.
- **Editados:** `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`.

Confirma o conceito do ícone (monograma "AI" sóbrio monocromático) ou prefere um glifo abstrato (ex.: dois pontos ligados por uma linha curva, sugerindo ponte entre países)? Abaixo do AI (maior) escreve Acordo Internacional ( mesmo tamanho do AI, e coloque o glifo abaixo 