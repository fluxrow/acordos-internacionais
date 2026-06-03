
# Plano de ajustes — `alterações_acordos.docx`

Mapeei cada item do documento contra o código atual. Agrupei por seção e marquei o que precisa de input adicional antes de executar.

## 1. Página de país — `/acordos/$pais`

**1.1 Remover o stat "2 órgãos de ligação"**
Em `src/routes/acordos.$pais.tsx` (linhas ~193–198), o `StatItem` de `numOrgaos` sempre mostra "2" (Brasil + parceiro). Vou removê-lo da linha de stats do header. Os cards detalhados de órgãos seguem normalmente na seção "Órgãos de ligação".

**1.2 Bandeira/logo dos 3 multilaterais no header**
Hoje o header só renderiza bandeira quando existe `a.iso` (linha 216). Para `cplp`, `mercosul`, `iberoamericano` (sem ISO) o bloco fica vazio. Vou adicionar fallback usando `MULTI_LOGOS[a.slug]` — mesma lógica já usada em `acordos.index.tsx`.

**1.3 Bloco "Instrumento e vigência"**
O usuário pediu para mostrar como na tabela do docx — uma lista vertical dos nomes oficiais dos acordos no lugar do trio Instrumento/Decreto/Vigor. Preciso confirmar antes de mexer (ver Perguntas abaixo) — o trio atual carrega informação útil (decreto + data de vigência) e a lista do docx tem só os títulos.

## 2. Mercosul — logo escuro no card do índice

Em `/acordos` (`acordos.index.tsx`) o logo do Mercosul é escuro e some no tema dark. Vou trocar `src/assets/logos/mercosul.png` por uma versão clara/branca (ou adicionar filtro CSS `invert` controlado). Mesma checagem para CPLP e OISS.

## 3. Calculadora — texto do aviso

Em `src/routes/calculadora.tsx` (linha 68) trocar o texto atual por:
> "A análise oficial depende dos dados completos do CNIS, documentos nacionais e estrangeiros e regras do país acordante."

## 4. Hub Profissional — botão "Ver planos"

Hoje o CTA do hero (`profissional.tsx`) leva para `#planos` (mesma página). O usuário quer que vá direto para `/precos`. Vou trocar o `href` do `CTAButton` e dos demais "Ver planos" da LP para `/precos`.

Também removo / reescrevo a seção PLANOS interna da LP (já refatorada na rodada anterior) — confirmar se ela some por completo ou se vira só um teaser com link.

## 5. `/precos` — copy do cabeçalho

Atualizar os textos "Anual para quem trabalha. Vitalício para os 100 primeiros" / "Dois caminhos…" para refletir os **três** planos (Mensal R$ 87 · Anual R$ 837 · Vitalício R$ 1.297).

## 6. Meu Hub (logado) — `/_authenticated/hub`

**6.1 Visual igual à home pública**
Trocar a grade compacta de bandeirinhas pequenas por cards no mesmo padrão visual de `/acordos` (cards maiores, com bandeira 56×42, hover gold). O usuário comentou "bandeirolas pequeninas" e quer algo mais próximo do início do site.

**6.2 "Algo diferente para advogados"**
Ele pediu para pensar em algo distinto no Hub interno. Sem direção definida — listo opções na seção de perguntas para escolher.

## 7. Fluxo Laudo (logado)

**7.1 "Abrir" do histórico não carrega**
Verificar o caminho: `hub.laudos.tsx` linka `/hub/laudo?id=…`, `hub.laudo.tsx` chama `carregarLaudoHistorico(id)`. Investigar se o payload está sendo salvo no histórico no momento da geração — provável que a inserção esteja faltando ou a leitura esteja com filtro errado.

**7.2 Menu superior**
"Planos e preços" no menu já leva ao lugar certo — só confirmar.

## 8. Sobre o Dr. Marcos — aspas do manifesto

Em `sobre.dr-marcos.tsx` (linhas 234–246) a aspa decorativa de abertura `"` está sobreposta ao texto e não há aspa de fechamento. Vou:
- ajustar o posicionamento (afastar mais do parágrafo)
- adicionar uma aspa de fechamento `"` no final da citação.

## 9. Áreas de Atuação — cards não-clicáveis

Cards de "Totalização", "Aposentadoria por idade", etc. hoje parecem clicáveis mas não levam a lugar nenhum. Duas opções: (a) remover affordance de clique (cursor default, sem hover de elevação) deixando como vitrine, ou (b) linkar para guias correspondentes. Preciso decidir — ver perguntas.

## 10. Blog — publicar "Saída Definitiva do País"

Tirar o "Em construção / Em breve" de `blog.tsx` e listar o primeiro artigo. **Preciso do arquivo `saída_definitiva_blog.docx` (mencionado no GitHub) anexado aqui** para converter em rota `/blog/saida-definitiva-do-pais` com tipografia consistente. Já existe `src/routes/guias.saida-definitiva-do-pais.tsx` — confirmar se devo reaproveitar conteúdo ou usar o docx novo.

Também vou gerar uma arte de capa estilo "saguão de aeroporto / Receita Federal" conforme referência da página 8.

## 11. Acordo + Ajuste Administrativo — texto integral on-page

O usuário lembra que os HTMLs do GitHub têm o texto completo do acordo e do ajuste administrativo, e a ideia era exibi-los na página de cada país para o advogado consultar/buscar/analisar — download é fallback. Hoje só temos botão de download.

Esse é o item mais pesado e depende de localizar os HTMLs no repositório `acordos-internacionais` do GitHub. **Preciso de uma das duas coisas:**
- link do repo + caminho dos HTMLs, ou
- anexar os HTMLs aqui

Quando tiver, planejo:
- importar os textos como JSON estruturado (por artigo)
- nova aba dentro da página do país: "Texto integral" e "Ajuste administrativo"
- busca/scroll por artigo, tipografia editorial corrigida (fonte e formatação)
- botão "Baixar PDF" continua disponível

## 12. E-mail do formulário de contato não chega

Investigar o fluxo do `/contato`. Listar: (a) se há server function que envia, (b) qual provedor, (c) logs recentes. Em seguida ajustar/configurar para que `marcos@acordosinternacionais.com` receba.

---

## Ordem sugerida de execução

1. Quick wins (1.1, 1.2, 3, 4, 5, 8) — uma rodada
2. Logos claros (item 2) + Meu Hub visual (6.1)
3. Blog + arte (10) — depende de você mandar o docx
4. Texto integral do acordo (11) — depende dos HTMLs
5. Investigação do e-mail (12) e do botão Abrir do laudo (7.1)
6. Definições pendentes (item 1.3, 6.2, 9)

## Perguntas antes de executar

1. **Item 1.3 (bloco Instrumento):** mantenho o trio atual (Instrumento + Decreto + Vigor desde) e só ajusto a aparência, ou substituo pela lista simples de nomes do docx?
2. **Item 4 (planos no Hub LP):** removo completamente a seção PLANOS da LP do Hub, ou deixo um bloco curto "Ver planos →" linkando para `/precos`?
3. **Item 6.2 (algo diferente para advogados):** opções que consigo propor — (a) painel com últimas portarias salvas, (b) "casos do mês" / decisões recentes em destaque, (c) atalho de "calculadora rápida" no topo, (d) checklist de próximos passos por cliente. Posso propor 2–3 visuais.
4. **Item 9 (cards Áreas de Atuação):** transformo em links para guias existentes ou desabilito o hover/clique?
5. **Item 10 (blog):** você anexa o `saída_definitiva_blog.docx`?
6. **Item 11 (texto integral):** me passe o repo/link dos HTMLs ou anexe-os.

Confirme essas decisões e eu já passo para build mode com a primeira leva (quick wins).
