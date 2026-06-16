
Quatro ajustes pedidos no documento, todos na página pública `src/routes/acordos.$pais.tsx` (e arquivos correlatos para CTAs/jornadas).

## 1. Remover o bloco "Texto integral" da página pública do país
No arquivo `src/routes/acordos.$pais.tsx`:
- Remover o `<Bloco id="texto-integral">` (linhas ~373-383) e o componente `<TextoIntegralAcordo>` (import na linha 9).
- Remover a entrada do TOC: `tocBlocos.push({ id: "texto-integral", label: "Texto integral" });` (linhas 144-145).
- Texto integral continua disponível só dentro do Hub (`/hub/$pais` → abas "Acordo" / "Ajuste"), sem mudanças lá.

## 2. Genericizar todas as CTAs "Dr. Marcos Espínola" → "um dos nossos especialistas"
Substituir o tom personalíssimo por "nossos especialistas", mantendo o destino `/contato`:

- `src/components/cta-marcos.tsx`
  - Variant `card` (sidebar de país): trocar a frase padrão `"Fale com o Dr. Marcos Espínola, advogado responsável."` por `"Fale com um dos nossos especialistas."` e o título "Dúvidas no seu caso?" continua, mas o link "Iniciar contato →" vira "Fale com um dos nossos especialistas →".
  - Variant `block`: o lede genérico vira `"Um de nossos especialistas traduz a teoria para a sua situação."` e o botão "Falar com o Dr. Marcos" vira **"Fale com um dos nossos especialistas"**.
  - Variant `result`: botão `"Quero fazer meu planejamento"` mantém (não é "Dr. Marcos"); apenas o item da lista `"Atendimento com o Dr. Marcos"` vira `"Atendimento com nosso especialista"`.

- `src/routes/acordos.$pais.tsx` linha 442: o `contexto` do `<CTAMarcos>` vira `"Fale com um dos nossos especialistas."` (sem citar Dr. Marcos nem o país).

- `src/data/jornadas.ts` (linhas 75, 181, 233, 285): todos os `cta: "... Fale com o Dr. Marcos Espínola."` viram a versão genérica:
  - "Tem dúvidas no seu caso? Fale com um dos nossos especialistas."
  - "Quer revisar seu plano? Fale com um dos nossos especialistas."
  - "Demora ou indeferimento? Fale com um dos nossos especialistas."
  - "Quer simular seu caso? Fale com um dos nossos especialistas."

- `src/routes/acordos.$pais.tsx` linha ~395 (texto fallback "fale com o Dr. Marcos Espínola"): vira "fale com um dos nossos especialistas".

(Mantemos a página `/sobre/dr-marcos` e o nome do Dr. Marcos nela — só não falamos dele em primeira pessoa nas CTAs espalhadas.)

## 3. Restaurar a seção "Órgãos de Ligação" na página pública de TODOS os países
Hoje o componente `OrgaoCard` existe em `src/routes/acordos.$pais.tsx` (linha 590) mas não é renderizado em lugar nenhum — daí o `numOrgaos` calculado e nunca usado. Vou:

- Adicionar um novo `<Bloco id="orgaos">` titulado **"Órgãos de Ligação"**, posicionado logo após "Documentos" e antes do bloco final, exibindo:
  - Para acordos bilaterais: dois cards lado a lado — `orgaoBR` (lado Brasil) e `orgaoParceiro` (lado país parceiro).
  - Para multilaterais (CPLP, Iberoamericano, Mercosul): card único do Brasil + bloco descrito no item 4.
- Inserir o item no `tocBlocos` quando `a.importado?.orgaoBR || a.importado?.orgaoParceiro`.
- Restaurar uso do `numOrgaos` no hero (terceiro StatItem ao lado de "anos em vigor" e "documentos oficiais").

## 4. Iberoamericano e Mercosul — bandeiras + órgãos dos países-membros
Hoje só aparece a logo (OISS / Mercosul) e nenhum órgão dos membros. Vou:

- Criar `src/data/multilaterais-membros.ts` com a lista de países-membros de cada acordo multilateral, com `iso` (para a bandeira via flagcdn) e nome:
  - **Iberoamericano**: Bolívia (`bo`), Equador (`ec`), El Salvador (`sv`), Peru (`pe`) — únicos com órgão próprio. Os demais "seguem os organismos de ligação dos respectivos acordos bilaterais" (frase exata do .docx).
  - **Mercosul**: Argentina (`ar`), Paraguai (`py`), Uruguai (`uy`) — os três sócios fundadores além do Brasil. Sem órgãos próprios documentados → frase "Para os demais países, a referência segue os organismos de ligação dos respectivos acordos bilaterais."
  - Para Iberoamericano, dados completos dos quatro órgãos vêm do .docx (instituição, endereço, telefone, e-mail).

- No hero (linhas 213-240), quando o país for multilateral com membros, exibir abaixo da logo uma fileira compacta de bandeiras dos membros (apenas visual, sem link).

- No novo bloco "Órgãos de Ligação" (item 3), quando o slug for `iberoamericano`: grid com os 4 cards (Bolívia/Equador/El Salvador/Peru) + nota "Para os demais países…". Quando for `mercosul`: cards APSAI Brasil + bandeiras dos 3 membros com a nota de remissão aos bilaterais.

## 5. Arquivos tocados
- `src/routes/acordos.$pais.tsx` (remover texto integral, restaurar bloco órgãos, hero multilateral, ajustar CTA)
- `src/components/cta-marcos.tsx` (genericizar)
- `src/data/jornadas.ts` (4 strings)
- `src/data/multilaterais-membros.ts` (novo)

Nenhuma mudança no Hub, no schema, nem em SEO/metadados. Atualizo `.lovable/prd.md` e `ROADMAP.md` ao final (regra de memória do projeto).

## Fora de escopo (confirmação)
- Iberoamericano/Mercosul **dentro do Hub** (`/hub/$pais`) — o .docx só ilustra a página pública. Posso replicar lá depois se você quiser; me avise.
- Habilitar download dos arquivos "Indisponíveis" da página do Iberoamericano (página 3 do .docx). Hoje o link `arquivo` é só o nome — não há URL pública resolvida. Se quiser que eu publique os PDFs do GitHub do mapa, é outra rodada (preciso decidir hospedagem).
