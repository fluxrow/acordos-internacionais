
# Análise geral da UI — estado atual

Varri as principais rotas e cruzei com o que arrumamos no login/cadastro/hub. Abaixo o que está coerente, o que está conflitando e o que recomendo ajustar a seguir. **Esta é só a análise — nada foi alterado.**

## 1) O que está consistente e bem alinhado

- **Identidade visual editorial** (serifa display, fundo creme `#f6f1e8`, vermelho/vinho de acento, tabelas e cards minimalistas) está aplicada de forma coesa em:
  - `/` (home)
  - `/acordos` (lista dos 25 países)
  - `/acordos/$pais` (ex.: `/acordos/alemanha`)
  - `/jornadas/$jornada` (ex.: `moro-fora`)
  - `/sobre/dr-marcos`
  - `/calculadora` (pública)
  - `/contato`, `/glossario`, `/guias/$slug`
  - `/login`, `/cadastro`, `/reset-password` (header + footer corretos)
- **Header novo** (com "Entrar" + "Criar conta") está aparecendo em todas as rotas públicas.
- **Footer** consistente, com "Acordos Internacionais by AtlasPrev" no canto.
- **Rota `/acordos/alemanha`** está exemplar: hero com bandeira, sumário lateral "Nesta página", próximos passos, lista de documentos com cadeado e CTA "Hub Profissional" no rodapé do conteúdo. É o padrão a manter.

## 2) Problemas e inconsistências detectadas

### 2.1 `/profissional` ainda é "lista de espera"
A página continua com `ENTRAR NA LISTA DE ESPERA` e bloco "Disponível em breve · Entre na lista de espera". Isso contradiz o estado atual: cadastro já funciona, `/hub` já existe e o usuário admin já entrou.
- A CTA da home **"HUB PARA ADVOGADOS"** aponta para `/profissional`, então o visitante novo cai numa página que diz "em breve" em vez de seguir para `/cadastro` ou `/precos`.

### 2.2 Conflito de preços entre `/profissional` e `/precos`
- `/profissional`: **R$ 1.297 (early bird)** → depois R$ 1.997, pagamento único vitalício, "primeiros 100".
- `/precos`: **R$ 97/mês**, **R$ 797/ano**, **R$ 797 fundadores** (3 planos com "ASSINAR").
- São duas histórias comerciais diferentes na mesma marca. Precisamos decidir qual é a oferta real e unificar.

### 2.3 `/precos` está fora do design system
A página usa cards simples shadcn com bordas finas, sem o tom editorial do resto (sem eyebrow, sem serifa display nos preços do mesmo jeito, sem o tratamento do "Hub Profissional"). E ela **não está linkada no header nem no footer** — só dá pra chegar digitando a URL.

### 2.4 Header não reflete estado de login
- Mesmo logado, o header mostra "Entrar" + "Criar conta" e não mostra link para `/hub` nem botão "Sair".
- Sem link visível para `/precos`.
- Não há link para `/calculadora` (pública) nem `/blog` no header.

### 2.5 Botões "ASSINAR" sem destino
Em `/precos`, os três botões "ASSINAR" não estão ligados a nada (sem Stripe, sem fluxo de checkout). Idem CTAs comerciais em `/profissional` (a "lista de espera" gravava no Lovable Cloud, então tecnicamente funciona, mas a oferta está incoerente).

### 2.6 Blog vazio
`/blog` mostra "Em construção · Em breve…". Tudo bem como placeholder, mas o link do footer "Blog" leva o leitor a uma página vazia. Vale esconder do footer até ter ao menos 1 post, ou trocar por um "Newsletter".

### 2.7 Hub autenticado (rotas `_authenticated/*`)
Não revisei a UI do hub neste passe (a sessão do browser de teste expirou no `/hub/alemanha` e caiu pro login). Próximo passo: logar de novo e auditar `/hub`, `/hub/$pais`, `/hub/calculadora`, `/conta` com o mesmo critério.

## 3) Plano sugerido (ordem proposta para os próximos passes)

1. **Decidir a oferta comercial única** (1 pergunta pra você): vitalício único R$ 1.297→1.997 **ou** mensal/anual R$ 97 / R$ 797. Eu já trago a recomendação quando você responder.
2. **Unificar `/profissional` e `/precos`**: uma só página de oferta com o design editorial do resto do site. Remover o discurso de "lista de espera". CTA principal → `/cadastro` (ou checkout, quando o Stripe entrar).
3. **Atualizar header**:
   - Quando deslogado: manter "Entrar" + "Criar conta" e incluir "Preços".
   - Quando logado: trocar por "Hub" + menu da conta (e-mail, "Sair").
4. **Atualizar a CTA "HUB PARA ADVOGADOS" da home** para apontar para `/precos` (ou `/cadastro`) em vez de `/profissional` antigo.
5. **Auditar UI do hub logado** (`/hub`, `/hub/$pais`, `/hub/calculadora`, `/conta`) no próximo passe, com o admin logado.
6. **Esconder ou popular `/blog`** (decisão sua) e revisar `/glossario` no mesmo passe.
7. **Checkout (Stripe)** entra só depois que a oferta estiver decidida.

## Detalhe técnico (referência)

- Rotas públicas: `src/routes/{index, acordos.index, acordos.$pais, jornadas.$jornada, guias.$slug, sobre.dr-marcos, profissional, precos, calculadora, contato, glossario, blog, login, cadastro, reset-password}.tsx`.
- Rotas autenticadas (sob `_authenticated.tsx` com guard): `src/routes/_authenticated/{hub, hub.$pais, hub.calculadora, conta}.tsx`.
- Header/footer: `src/components/site-header.tsx`, `src/components/site-footer.tsx`.
- Estado do header não consulta `supabase.auth.getSession()` hoje — daí ele não muda quando logado.

---

Posso seguir e implementar os pontos 1–4 no próximo passe assim que você confirmar a oferta comercial. Quer que eu já te traga 2 opções de oferta unificada para escolher?
