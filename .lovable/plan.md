# Refino visual da página individual `/acordos/$pais`

Alinhar a página de país (ex.: `/acordos/austria`) à linguagem visual já estabelecida em Home e Listagem: **wash wine no hero, acentos `--accent-ink`, aside refinado, nav contextual com bandeira**. Sem mexer em conteúdo ou dados — só apresentação.

## Diagnóstico (do que vejo hoje)

- O **hero do país** é frio: fundo plano, sem o radial wine que o Home e a Listagem usam. Quebra continuidade.
- A **bandeira** no hero está solta no canto, sem moldura/aspect-ratio cuidado. Países com bandeira muito horizontal (Áustria) ou muito quadrada ficam desbalanceados.
- O **aside lateral** (CTA Marcos + Próximos passos) usa caixas `border border-border` cruas — perde elegância vs. o toolbar wine de `/acordos`.
- **Zero `--accent-ink`** na página. Toda a paleta wine desaparece aqui, parece outro site.
- A **nav Anterior / Próximo** é texto puro. É o gancho mais óbvio pra reter o leitor e está subutilizada (sem bandeira do próximo país, sem hover wine).
- Quando órgão de ligação tem só título (caso Áustria), o **card fica visivelmente vazio** — precisa de fallback gracioso ou ocultar.

## Escopo

Arquivo único: `src/routes/acordos.$pais.tsx`. Sem mudanças em `acordos.ts`, sem novos componentes globais, sem novas rotas, sem mudanças de dados.

## Mudanças

### 1. Hero com wash wine + bandeira melhor enquadrada
- Adicionar o mesmo `bg-[radial-gradient(...,_var(--accent-ink-soft)_...)]` do hero de `/acordos`, posicionado no lado oposto da bandeira pra criar tensão visual.
- Border-bottom `border-border/60` (consistente com Listagem).
- Bandeira: container com `aspect-[3/2]` fixo, `rounded-lg`, sombra sutil, `object-cover`. Tamanho responsivo coerente.
- Eyebrow ("Acordo bilateral / vigente desde...") com a classe `eyebrow` padrão.

### 2. Acentos wine pontuais
- Breadcrumb "Países / Áustria": link "Países" em `text-[var(--accent-ink)]` no hover.
- Badge de status "em ratificação" / "incompleto": já usa wine — manter.
- Links `ink-link` (já existem, conferir contraste).

### 3. Aside refinado
- Os dois cards (`CTAMarcos` e "Próximos passos") passam a usar o mesmo tratamento da toolbar de `/acordos`: `rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm`.
- Hover dos links "Próximos passos" puxa `--accent-ink`.

### 4. Bloco "Órgãos de ligação" — fallback gracioso
- Se um `OrgaoCard` recebe um órgão **sem nenhum campo preenchido** além de `titulo`, mostrar uma linha discreta "Dados de contato em organização." em vez de só o título flutuando.

### 5. Nav Anterior/Próximo contextual
- Cada lado mostra a **mini-bandeira** do país (se houver `iso`), o eyebrow ("← Anterior" / "Próximo →") e o nome.
- Hover: `bg-[var(--accent-ink-soft)]` + nome em `text-[var(--accent-ink)]` (mesma linguagem dos cards da grade).
- Continua usando `<Link>` do TanStack — sem mudança de roteamento.

### 6. ProContentLock — leve refino opcional
- Não tocar no componente em si. Só revisar o wrapper / espaçamento se ficar grudado no `nav`.

## Fora de escopo

- Reorganizar conteúdo dos blocos (Instrumento, Benefícios, Documentos).
- Mudar o componente `ProContentLock` ou `CTAMarcos` internamente.
- Mudar dados em `src/data/acordos.ts` ou tipos.
- SEO / `head()` — já está bem estruturado, não mexer.
- Calculadora (espera material do Dr. Marcos via Claude).

## Validação

Após implementar, capturar screenshots de `/acordos/austria` (bilateral simples, órgãos quase vazios) e `/acordos/alemanha` (bilateral rico) para confirmar que o wash wine, aside e nav ficaram coerentes em ambos os cenários. Garantir que `Brasileiro no exterior` continua o caminho visual desde o Home.

## Atualizações de memória (regra Core)

- Atualizar `.lovable/prd.md` e `ROADMAP.md` mencionando o refino visual de `/acordos/$pais` na mesma rodada da implementação.
