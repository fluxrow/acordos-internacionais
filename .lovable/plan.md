## Problema

No mobile o `SiteHeader` mostra **apenas um link** (Meu Hub se logado, Calculadora se não) — todos os outros itens de navegação (Países, Jornadas, Calculadora, Guias, Hub Profissional, Entrar/Sair) só aparecem em `md:` ou acima. Quem entra pelo celular não tem como descobrir o resto do site sem rolar a home inteira.

## Solução

Adicionar um **botão hambúrguer** ao lado do link já existente (Meu Hub / Calculadora) que abre um **drawer/sheet lateral** com toda a navegação.

### Conteúdo do drawer

Mesmos itens do menu desktop, na mesma ordem:
- Países (`/acordos`)
- Jornadas (`/jornadas`)
- Calculadora (`/calculadora`)
- Guias — seção expandida (lista todos os guias + Saída Definitiva com selo "Novo")
- Hub Profissional (`/profissional`)
- Separador
- Se logado: **Meu Hub** (CTA destacado) + **Sair**
- Se deslogado: **Entrar** + **Criar conta** (CTA destacado)

### Implementação

- Usar `<Sheet>` do shadcn (já instalado em `src/components/ui/sheet.tsx`) com `side="right"`.
- Botão hambúrguer: ícone `Menu` do lucide-react, visível só em `md:hidden`, posicionado **antes** do link rápido existente para virar: `[☰] Meu Hub`.
- Fechar o sheet automaticamente ao clicar em qualquer link (controlar `open` com `useState`).
- Manter o link rápido "Meu Hub"/"Calculadora" como atalho — não removê-lo, só ganhar companhia.
- Tokens semânticos só (`bg-background`, `text-foreground`, `border-border`, `var(--accent-ink*)`).

### Arquivo único afetado

`src/components/site-header.tsx` — adicionar import de `Sheet`/`SheetContent`/`SheetTrigger`, ícone `Menu`, estado `mobileOpen` e o bloco mobile.

## Fora de escopo

- Não mexer no menu desktop (já funciona).
- Não criar componente novo — tudo no `site-header.tsx`.
- Não tocar em `.lovable/prd.md` / `ROADMAP.md` (é ajuste de UX de header, não mudança estrutural).