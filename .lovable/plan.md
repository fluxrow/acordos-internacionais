# Plano

## 1. Corrigir o campo `instrumento`

**Onde os dados vivem:** `src/data/acordos.generated.ts` (auto-gerado por `scripts/import-acordos.ts`). O valor é consumido em `src/lib/hub.functions.ts` e renderizado em `src/routes/_authenticated/hub.$pais.tsx` (linha 63).

**Problema:** se eu apenas editar o arquivo gerado, a próxima execução do importador desfaz tudo. Solução: criar um override estável **e** corrigir o gerado de uma vez.

### 1.1 Criar override

Novo arquivo `src/data/acordos-instrumento-overrides.ts` exportando um mapa `slug → instrumento` com a tabela canônica:

```
alemanha          → Acordo Brasil - Alemanha
austria           → Acordo Brasil - Áustria
belgica           → Acordo Brasil - Bélgica
bulgaria          → Acordo Brasil - Bulgária
cabo-verde        → Acordo Brasil - Cabo Verde
canada            → Acordo Brasil - Canadá
chile             → Acordo Brasil - Chile
coreia-do-sul     → Acordo Brasil - Coreia do Sul
espanha           → Acordo Brasil - Espanha
estados-unidos    → Acordo Brasil - Estados Unidos
franca            → Acordo Brasil - França
grecia            → Acordo Brasil - Grécia
india             → Acordo Brasil - Índia
israel            → Acordo Brasil - Israel
italia            → Acordo Brasil - Itália
japao             → Acordo Brasil - Japão
luxemburgo        → Acordo Brasil - Luxemburgo
mocambique        → Acordo Brasil - Moçambique
portugal          → Acordo Brasil - Portugal
quebec            → Acordo Brasil - Quebec
republica-tcheca  → Acordo Brasil - República Tcheca
suica             → Acordo Brasil - Suíça
mercosul          → Mercosul
cplp              → CPLP
iberoamericano    → Iberoamericano
```

### 1.2 Aplicar o override em `src/lib/hub.functions.ts`

Onde a função monta o `instrumento` retornado, fazer `INSTRUMENTO_OVERRIDES[slug] ?? generated.instrumento`. Isso garante a regra mesmo se a próxima regeneração trouxer string antiga.

### 1.3 Atualizar `src/data/acordos.generated.ts`

Substituir os 21 valores existentes pelos canônicos e ignorar o cabeçalho "auto-generated" só desta vez (o override em 1.2 segura o futuro). Os 4 slugs sem `instrumento` (luxemburgo, mocambique, quebec, republica-tcheca) recebem o campo nos seus objetos.

### 1.4 Atualizar `scripts/import-acordos.ts`

Adicionar uma const `INSTRUMENTO_CANONICO` (mesmo mapa) e usar `INSTRUMENTO_CANONICO[slug] ?? instrumento` ao montar o objeto gerado. Próximas reimportações já saem corretas.

## 2. Remover abas "Trecho legal" e "Órgãos" do Hub Profissional

Arquivo: `src/routes/_authenticated/hub.$pais.tsx`.

- Linha 13 (`tabSchema`): remover `"orgaos"` e `"trecho"` do enum.
- Linhas 93-94: remover as renderizações `tab === "orgaos"` e `tab === "trecho"`.
- Linhas 104-111 (`TABS`): remover as entradas `orgaos` e `trecho`.
- Linha 83 e 118-128: remover a prop/branch `hasTrecho` (não mais necessária) e a condição que escondia "Trecho legal".
- Remover os componentes `OrgaosTab` e `TrechoTab` (definidos mais abaixo no mesmo arquivo) e qualquer import exclusivo (ex.: `TextoIntegralAcordo` se usado só por TrechoTab — vou verificar antes de remover).

A rota pública `src/routes/acordos.$pais.tsx` (site marketing) **não** é alterada — o pedido é só sobre o Hub Profissional (`/hub/$pais`).  
negativo, altere e mantenha o padrao das informacoes na rota publica tambem.

## 3. Documentação

Atualizar `.lovable/prd.md` e `ROADMAP.md` com nota curta: padronização do `instrumento` e simplificação das abas do Hub.

## Arquivos que serão alterados

- novo: `src/data/acordos-instrumento-overrides.ts`
- `src/data/acordos.generated.ts`
- `src/lib/hub.functions.ts`
- `scripts/import-acordos.ts`
- `src/routes/_authenticated/hub.$pais.tsx`
- `.lovable/prd.md`
- `ROADMAP.md`

## Fora de escopo

- Não regerar `acordos.generated.ts` agora (a edição manual + override cobre).
- Sem mudança de schema do banco nem de RLS.