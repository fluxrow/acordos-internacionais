
# PRD — acordosinternacionais.com

Hub de referência sobre Acordos Internacionais de Previdência Social do Brasil. Duas áreas: **Pessoa Física** (informação + lead-gen para Dr. Marcos) e **Advogados** (base profissional, acesso vitalício pago). Reaproveita conteúdo e dados do repo `Mapa-de-Acordos`; **substitui** a identidade dark-navy original por uma identidade editorial clara (Paper & Ink).

## 1. Posicionamento

> "O mapa definitivo dos acordos internacionais de previdência do Brasil — para quem precisa de orientação e para quem advoga na área."

Diferenciais:
- Cobertura completa por país acordante, atualizada
- Linguagem dual: clara para leigos, técnica para advogados
- Funil curto cidadão → atendimento direto com Dr. Marcos
- Base profissional única no mercado brasileiro (vitalícia)

## 2. Personas

### A — Pessoa Física (PF) — brasileiro no exterior
1. Chega via Google (cauda longa: "acordo brasil portugal aposentadoria", "como receber inss morando fora")
2. Lê página-país ou guia da jornada
3. CTA persistente: **"Falar com o Dr. Marcos"** → formulário qualificado → email/WhatsApp

### B — Advogado Previdenciarista
1. Chega via busca técnica ou indicação
2. Vê preview da área profissional
3. Compra acesso vitalício
4. Consulta diariamente: portarias comentadas, modelos, fluxogramas, base por país, calculadoras

## 3. Pesquisa Semrush BR (resumo)

| Termo | Vol/mês | KDI |
|---|---|---|
| acordo internacional inss | 260 | 36 |
| acordo internacional | 320 | — |
| sistemas previdenciários por países | 480 | — |
| acordos previdenciários brasil | 170 | — |
| direito previdenciário internacional | 110 | CPC alto |

Cauda longa por país é a mina de tráfego PF; CPC alto em termos técnicos confirma valor do público advogado.

## 4. Identidade visual — **Paper & Ink** (nova)

**Paleta** (light, editorial Swiss):
- Background: `#f5f3ee` (off-white papel)
- Surface/cards: `#e8e4dd` (cream sutil)
- Foreground: `#0d0d0d` (preto rico)
- Muted: `#2d2d2d` (cinza-tinta)
- Accent (links/CTAs): preto + sublinhado fino, hover em vermelho-tinta `#7a1f1f` (referência sutil às cores da bandeira do INSS sem ser óbvio)

**Tipografia**:
- Display: **Playfair Display** (serifa editorial — herdada do repo) → headlines, títulos de país
- Texto: **Source Serif 4** (texto longo, conforto de leitura) — herdada do repo
- Sans condensado para labels/UI: **Inter** ou **Söhne-like**

**Componentes**:
- Cards: borda 1px sólida, sem sombra forte, hover = inversão (preto sólido, texto cream)
- Bandeiras dos países como elemento gráfico principal nos cards
- Badges de status (Em ratificação / Incompleto): texto pequeno em caps, sem cor — só borda
- Navegação: linha tipográfica fina; sem hambúrguer escondido em desktop
- Layout: grid amplo, muita respiração, justificativa cuidadosa, índice numerado nas listas

**Tema escuro (área profissional, fase 2)**: variante invertida `#0d0d0d` bg + `#f5f3ee` foreground — mantém família visual, sinaliza "modo trabalho".

Tokens em `oklch` em `src/styles.css` (não usar HEX hardcoded em componentes).

## 5. Conteúdo já mapeado no repo (a reaproveitar)

**Lista completa dos 25 acordos** (país, ISO, nº de documentos, status):
- Bilaterais (22): Alemanha, Áustria, Bélgica, Bulgária *(incompleto)*, Cabo Verde *(em ratificação)*, Canadá, Chile, Coreia do Sul, Espanha, Estados Unidos, França, Grécia, Índia, Israel *(em ratificação)*, Itália, Japão, Luxemburgo, Moçambique, Portugal, Quebec, República Tcheca, Suíça
- Multilaterais (3): CPLP, Mercosul, Iberoamericano

**Estatísticas-âncora**: 26 acordos ativos · 220+ documentos · 22 bilaterais · 3 multilaterais

**Estrutura útil**: hero, stats, busca + filtros (todos / bilaterais / multilaterais / em ratificação), grid de cards.

## 6. Arquitetura de rotas

### Área pública (PF + SEO)

```text
/                                       Home dual (PF | Advogados)
/acordos                                Mapa/grid de todos os países
/acordos/portugal                       Página-país (versão pública)
/acordos/japao
/acordos/estados-unidos
/acordos/italia
/acordos/alemanha                       ... 1 por país acordante
/jornadas/vou-me-mudar
/jornadas/moro-fora
/jornadas/estou-voltando
/jornadas/quero-me-aposentar
/guias/totalizacao
/guias/prova-de-vida-no-exterior
/guias/certificado-deslocamento-temporario
/guias/aposentadoria-morando-fora
/glossario
/blog
/sobre/dr-marcos
/contato
```

### Área profissional (paywall — advogados)

```text
/profissional                           Landing pública (preview + checkout)
/profissional/checkout
/app                                    Dashboard
/app/paises/[pais]                      Ficha técnica completa
/app/portarias                          Atos comentados
/app/modelos                            Petições, requerimentos
/app/jurisprudencia
/app/calculadoras
/app/fluxogramas
/app/atualizacoes                       Changelog regulatório
/app/conta
```

## 7. Modelo de negócio

### 7.1 Lead-gen para Dr. Marcos (PF) — gratuito
- Formulário pré-qualificado (país do acordo, situação, urgência) em todas as páginas-país e jornadas
- Encaminhamento por email + WhatsApp para o Marcos

### 7.2 Hub profissional — pagamento único, acesso vitalício
- Preço sugerido: **R$ 1.997** (early bird R$ 1.297, primeiros 100)
- Pagamento via Lovable Payments (Stripe)

## 8. Fases de entrega

### Fase 1 — Fundação pública (MVP SEO + lead-gen)
- Tokens Paper & Ink em `src/styles.css`; importar Playfair Display + Source Serif 4
- Migrar grid dos 25 acordos para componente React + dados versionados (TS)
- Home dual, índice `/acordos`, **5 páginas-país prioritárias**: Portugal, Japão, EUA, Itália, Alemanha
- 4 jornadas, 4 guias temáticos, glossário inicial
- Página do Dr. Marcos
- Formulário de contato qualificado (Lovable Email para Marcos)
- Newsletter
- Sitemap, robots, JSON-LD por página, og:images por rota
- Landing `/profissional` com lista de espera (sem checkout ainda)

### Fase 2 — Área profissional
- Auth + roles (`pf`, `lawyer`, `admin`) — tabela `user_roles` separada + `has_role()` SECURITY DEFINER
- Pagamento único Stripe → grant `lawyer` vitalício
- 5 fichas-país profissionais completas
- Base de portarias comentadas
- 10 modelos de petições/requerimentos
- 2 calculadoras (totalização básica, conversão de tempo)
- Tema escuro do `/app`

### Fase 3 — Cobertura completa
- Restantes países (até 22 bilaterais + 3 multilaterais)
- Jurisprudência por tema, fluxogramas interativos
- Newsletter interna + changelog regulatório
- Dossiê PDF, lembretes prova de vida

### Fase 4 — Expansão
- Mentoria mensal recorrente
- Diretório de advogados parceiros
- Comunidade fechada

## 9. Métricas

| Métrica | 6 meses | 12 meses |
|---|---|---|
| Sessões orgânicas/mês | 5.000 | 25.000 |
| Top-10 keywords-alvo | 10 | 25 |
| Leads PF/mês para Marcos | 30 | 150 |
| Compras hub profissional | 30 | 150 |
| Receita acumulada hub | R$ 40k | R$ 250k |

## 10. Stack técnica

- TanStack Start (atual) + Tailwind v4 + shadcn/ui
- Lovable Cloud (Postgres + Auth + Storage)
- Roles: enum `app_role` + tabela `user_roles` + `has_role()` SECURITY DEFINER
- Conteúdo de países versionado em TS; artigos/portarias em DB para edição via admin
- Stripe via Lovable Payments
- Lovable Email
- SEO: 1 rota por seção, `head()` único, sitemap/robots, JSON-LD `Article`/`FAQPage`/`LegalService`/`Country`

## 11. Domínio

- **acordosinternacionais.com** (exact match com termo de 320/mês) — configurar em Project Settings → Domains
- Recomendado: adquirir `.com.br` para 301

## 12. Próximos passos

1. Aprovar este PRD
2. Confirmar 5 países da Fase 1 (sugestão: Portugal, Japão, EUA, Itália, Alemanha)
3. Confirmar preço (R$ 1.997 / early bird R$ 1.297)
4. Confirmar canal de leads (email + WhatsApp?)
5. Aprovar → iniciar Fase 1
