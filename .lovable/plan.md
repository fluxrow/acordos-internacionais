## Resposta às 3 decisões

1. **Domínio `notify.acordosinternacionais.com**` — sim, dá pra criar, mas eu (agente) não consigo provisionar sozinho. O fluxo é:
  - Você clica em **"Configurar domínio de e-mail"** no diálogo abaixo e digita `notify.acordosinternacionais.com`.
  - A Lovable gera registros NS pra você adicionar no seu provedor de DNS (onde `acordosinternacionais.com` está hospedado).
  - Após a verificação DNS, todos os e-mails sairão de `Acordo Internacional <calculadora@notify.acordosinternacionais.com>` — bem mais confiável pra caixa de entrada do Marcos.
  - Enquanto o DNS não verifica, eu já posso codar tudo. Se quiser, posso usar temporariamente o `notify.fluxrow.com` já verificado pra começar a receber leads hoje, e migrar pro novo domínio assim que estiver pronto. **Sem retrabalho** — só muda uma constante.
2. **Painel no Hub agora** — sim, incluído. Restrito a `has_role('admin')` (você + Marcos) via RLS já existente na `calc_leads`. Ninguém mais vê.
3. **Cópia do e-mail pro lead** — sim, incluído como segundo template ("Recebemos seus dados, Marcos entrará em contato"). Conteúdo amigável, sem informação sensível, com link pro WhatsApp do Marcos.

---

## Plano atualizado

### 0. Domínio de e-mail (ação sua)

- Clicar no botão **Configurar domínio de e-mail** abaixo do plano e cadastrar `notify.acordosinternacionais.com`.
- Adicionar os registros NS retornados no DNS de `acordosinternacionais.com`.
- Enquanto verifica: codifico tudo apontando pra `notify.fluxrow.com` (já verificado). Trocar pro domínio definitivo é mudar **uma constante** em `src/lib/email/send.ts`.

### 1. Infra de e-mail

- `setup_email_infra` → cria pgmq, cron, tabelas de log/suppression, vault secret.
- `scaffold_transactional_email` → cria rotas `/lovable/email/transactional/send`, `/preview`, `/email/unsubscribe`, `/lovable/email/suppression`.

### 2. Templates React Email

Em `src/lib/email-templates/`:

- `**novo-lead-calculadora.tsx**` (destinatário: Marcos)
  - Assunto: `Novo lead calculadora — {nome} ({pais})`
  - Corpo: nome, e-mail clicável, telefone (`tel:` + `https://wa.me/...`), país, tipo de benefício, tempo Brasil/exterior, idade aprox., resultado da triagem, data/hora, link direto pro `/hub/leads/{id}`.
- `**confirmacao-lead.tsx**` (destinatário: o próprio lead)
  - Assunto: `Recebemos seus dados — Acordo Internacional`
  - Corpo: confirmação calorosa, próximo passo ("Marcos entrará em contato em até 1 dia útil"), link WhatsApp do Marcos pra contato imediato, assinatura visual da marca.
- Ambos registrados em `src/lib/email-templates/registry.ts`.

### 3. Rota pública de captação (`/api/public/calc-lead`)

- `POST` valida payload com Zod, insere em `calc_leads` via `supabaseAdmin`, devolve `{ id }`.
- Em seguida (não bloqueante), dispara internamente os 2 envios via `/lovable/email/transactional/send`:
  - Marcos → template `novo-lead-calculadora` (idempotencyKey = `lead-marcos-{id}`)
  - Lead → template `confirmacao-lead` (idempotencyKey = `lead-cliente-{id}`)
- Se o envio falhar, lead **continua salvo** — Marcos vê no painel mesmo assim.

### 4. `LeadCaptureDialog`

- Substitui o `supabase.from('calc_leads').insert(...)` por `fetch('/api/public/calc-lead', { POST, JSON })`.
- Mantém UX igual, mas agora dispara os e-mails.

### 5. Painel admin de leads (`/_authenticated/hub/leads`)

- Migration adiciona `status text DEFAULT 'novo'` e `notas text` em `calc_leads`.
- Loader (server fn) protegido por `requireSupabaseAuth` + verificação `has_role('admin')` — só você e Marcos passam. Não-admin recebe `redirect('/hub')`.
- Tabela: data/hora, nome, telefone (com botão WhatsApp), e-mail, país, tipo, resultado da triagem, status (badge).
- Filtros: status, país, busca por nome/e-mail.
- Ações por linha:
  - Abrir conversa no WhatsApp (`https://wa.me/55...`)
  - Copiar e-mail
  - Mudar status (`novo` → `contatado` → `convertido` / `descartado`)
  - Editar campo de notas internas
- Link novo na sidebar do `/hub` visível só pra admin.

### 6. Documentação (regra do projeto)

- Atualizar `.lovable/prd.md` e `ROADMAP.md` com o novo fluxo de leads + painel.

---

## Detalhes técnicos rápidos

- Stack: `createFileRoute` em `src/routes/api/public/calc-lead.ts` + `createServerFn` pro painel + Lovable Emails (sem Edge Function, sem Resend).
- Migration:
  ```sql
  ALTER TABLE public.calc_leads
    ADD COLUMN status text NOT NULL DEFAULT 'novo',
    ADD COLUMN notas  text;
  CREATE INDEX idx_calc_leads_status ON public.calc_leads(status);
  ```
- RLS atual da `calc_leads` já cobre tudo: `insert` público (formulário), `select/update/delete` só admin.

---

## Confirma?

Se você topar, ao aprovar o plano eu:

1. Inicio rodando `setup_email_infra` + `scaffold_transactional_email` (em paralelo com você cadastrando o domínio).
2. Crio templates, rota pública, painel e migration.
3. Aviso quando estiver pronto pra você testar com um lead real.

&nbsp;

&nbsp;

&nbsp;

Configurar domínio de e-mail`notify.acordosinternacionais.com`

&nbsp;

  


&nbsp;

&nbsp;