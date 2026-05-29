## 1. Lead-gate antes do resultado (calculadora do segurado)

Em `src/components/calculadora-form.tsx`:

- Adicionar estado `leadModalAberto` e `lead` (`{ nome, email, telefone }`) e um flag `leadEnviado` (persistido em `sessionStorage` como `triagem_lead_v1` para não pedir de novo na mesma sessão).
- Em `onCalcular`: após toda a validação dos campos, se `!leadEnviado`, guardar o payload de cálculo num ref e abrir o modal — **não** chamar `calcularTriagem` ainda. Só rodar o cálculo e exibir resultado depois do envio do lead.
- Criar componente `LeadCaptureDialog` (usa `Dialog` do shadcn já presente) com:
  - Título: "Falta só um passo para ver seu resultado"
  - Subtítulo curto: "Para liberar a análise preencha os dados abaixo.
  - Campos obrigatórios: Nome, E-mail, Telefone/WhatsApp (com máscara simples BR).
  - Validação zod (nome 2–100, email válido, telefone 10–15 dígitos).
  - Checkbox "Aceito ser contatado pela equipe do Acordo Internacional sobre meu caso" (obrigatório).
  - Botão "Ver meu resultado" → grava em Supabase e, no sucesso, fecha modal, marca `leadEnviado`, roda `calcularTriagem` e exibe.
  - Botão secundário "Cancelar" fecha sem calcular.
- O modal não pode ser fechado clicando fora enquanto o cálculo está pendente (apenas no botão Cancelar) — evita pular o gate.

## 2. Persistência do lead (Supabase via Lovable Cloud)

Nova tabela pública `calc_leads` (migração separada, a ser aprovada):

- Colunas: `id uuid pk`, `nome text`, `email text`, `telefone text`, `pais text`, `tipo text`, `tempo_brasil_meses int`, `tempo_pais_meses int`, `data_nasc date`, `sexo text`, `resultado_caso text`, `user_agent text`, `referer text`, `created_at timestamptz default now()`.
- RLS habilitada. Policies:
  - `INSERT` permitido para `anon` e `authenticated` (formulário público).
  - `SELECT/UPDATE/DELETE` somente para `admin` via `has_role(auth.uid(),'admin')`.
- GRANTs: `INSERT` para `anon`, `INSERT/SELECT/UPDATE/DELETE` para `authenticated`, `ALL` para `service_role`.

O front grava direto via `supabase.from('calc_leads').insert(...)` (sem expor PII via select). Se a inserção falhar, mostra erro mas **permite** seguir com cálculo (não bloquear o usuário por falha de backend) — log no console.

## 3. E-mail comercial unificado: `marcos@acordosinternacionais.com`

Substituir em todos os pontos:

- `src/routes/contato.tsx` linha 41: `mailto:contato@acordosinternacionais.com` → `mailto:marcos@acordosinternacionais.com`.
- Buscar e atualizar quaisquer outras strings `contato@acordosinternacionais.com` / `contato@acordos…` no projeto (footer, página de contato, CTAs, página "Sobre", legais, JSON-LD, head metadata). Rodar `rg "acordosinternacionais\.com"` e revisar cada ocorrência que represente e-mail comercial — manter URLs do domínio (`https://acordosinternacionais.com`) intactas.
- Atualizar JSON-LD/Schema.org (se houver `contactPoint.email`) e Open Graph que cite e-mail.
- `mailto:` de órgãos públicos em `acordos.$pais.tsx` / `hub.$pais.tsx` permanecem (são e-mails de instituições estrangeiras, não da empresa).

## 4. Governança

- Atualizar `.lovable/prd.md` (nova feature: lead-gate na triagem; e-mail oficial) e `ROADMAP.md`.
- Sem mudanças na calculadora Pro (advogado): ela continua sem lead-gate.

## Fora de escopo

- Envio automático de e-mail/notificação para Marcos (fica para fase 2 — pode ser um trigger ou Resend depois).
- Painel admin para listar leads (fase 2). fase 2
- Integração com WhatsApp Business / CRM. fase

## Aprovações necessárias

- Migração SQL da tabela `calc_leads` (vai pedir aprovação ao executar).