## Diagnóstico

**Calculadora pública (`/calculadora`)**
- ✅ Aberta a qualquer pessoa: rota fora de `_authenticated`, sem checagem de sessão, sem paywall. Usa `CalculadoraForm variant="public"`.
- ✅ Indexável (canonical + og:* corretos).
- ❌ **CTA pós-resultado errado:** hoje, quando o resultado é "tem direito" (casos 3 e 2B), o bloco final convida a **"Conhecer o Hub do Advogado"** apontando para `/login` (`src/components/calculadora-form.tsx`, linhas 459-473). O Hub é produto para advogados — o cidadão comum não tem nada a fazer lá.

**Calculadora profissional (`/hub/calculadora`)**
- ✅ Corretamente atrás de `_authenticated` + assinatura. `noindex,nofollow`. Não mexer.

**Onde a calculadora pública está hoje (descoberta)**
- Links internos: `/guias`, `/guias/$slug`, `/glossario`, `/jornadas`, `/jornadas/$jornada`.
- ❌ Não aparece no header global (`SiteHeader`).
- ❌ Não aparece no footer.
- ❌ Sem CTA na home (`/`) — só menções textuais.

## Plano de ajustes

### 1. Corrigir CTA pós-resultado da calculadora pública  ⭐ (foco do pedido)
Arquivo: `src/components/calculadora-form.tsx`, bloco `variant === "public"` (linhas 459-473).
- Trocar o CTA "Conhecer o Hub do Advogado" → `/login` por **"Fale com o Dr. Marcos Espínola"** → `/contato`.
- Reaproveitar o componente já existente `<CTAMarcos contexto="..." />` (em `src/components/cta-marcos.tsx`) em vez de markup à mão — garante consistência com as Jornadas e a página `/profissional`.
- Copy sugerida: título "Seu caso parece se encaixar em um acordo internacional." · texto "Cada situação tem nuances (CDT, tempos contributivos, idade-elo). O Dr. Marcos Espínola revisa seu caso pessoalmente." · botão "Falar com o Dr. Marcos".
- Manter o bloco aparecendo só nos casos com direito (3 e 2B), como hoje.
- **Remover** qualquer menção a Hub/assinatura nesse fluxo público.

### 2. Header global (`src/components/site-header.tsx`)
Adicionar item "Calculadora" no nav desktop entre **Jornadas** e **Guias**. No mobile (que hoje mostra um único link), priorizar "Calculadora" para usuários deslogados — é a porta de entrada do público leigo.

### 3. Home (`src/routes/index.tsx`)
CTA secundário na hero apontando para `/calculadora` ("Simular meu benefício · grátis"), ao lado do CTA principal. Mais abaixo, um card "Calculadora gratuita de totalização" com botão.

### 4. Página `/calculadora` (`src/routes/calculadora.tsx`)
Microcopy abaixo do H1: "Sem cadastro. Sem pagar. Resultado em 2 minutos." — reforçando que é aberta.

### 5. Footer (`src/components/site-footer.tsx`)
Incluir "Calculadora" junto dos demais links de navegação pública.

### 6. SEO
Confirmar `/calculadora` no sitemap; se faltar, adicionar.

## Fora do escopo
- `/hub/calculadora` segue restrita a assinantes (comportamento correto).
- Lógica de cálculo e `CalculadoraForm` (lado pro) intocados.
- Sem paywall na calculadora pública.

## Validação
- `/calculadora` em janela anônima: form aparece, calcula, e no resultado positivo aparece **CTA para Dr. Marcos (→ `/contato`)** — não para o Hub.
- Header desktop/mobile mostram "Calculadora".
- Home tem CTA visível para `/calculadora`.
- `/hub/calculadora` continua exigindo login + assinatura.

## Atualizações obrigatórias (memória do projeto)
- `.lovable/prd.md` e `ROADMAP.md` na mesma rodada da implementação.