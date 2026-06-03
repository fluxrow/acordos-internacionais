## Objetivo

Substituir os textos truncados/resumidos atuais em `src/data/acordos-textos/<slug>.ts` pelos **textos integrais** dos `.txt` que estão em `Mapa-de-Acordos/Acordos Internacionais_ Ajustes Administrativos/` no GitHub do Marcos. Hoje o importador lê só os HTMLs (que trazem resumos curtos); essa pasta tem o conteúdo oficial completo dos 24 acordos + 19 ajustes administrativos.

## O que muda

### 1. `scripts/import-acordos.ts`
- Adicionar um segundo passo no loop por país: baixar `Acordo <Nome>.txt` e (se existir) `Ajuste Administrativo <Nome>.txt` da pasta `Acordos Internacionais_ Ajustes Administrativos/`.
- Mapear slug → nome do arquivo:
  ```
  alemanha → "Alemanha", austria → "Áustria", belgica → "Bélgica",
  bulgaria → "Bulgária", cabo-verde → "Cabo Verde", canada → "Canadá",
  chile → "Chile", coreia-do-sul → "Coreia", cplp → "CPLP",
  espanha → "Espanha", estados-unidos → "Estados Unidos",
  franca → "França", grecia → "Grécia", iberoamericano → "Iberoamericano",
  india → "Índia", israel → "Israel", italia → "Itália",
  japao → "Japão", luxemburgo → "Luxemburgo", mercosul → "Mercosul",
  mocambique → "Moçambique", portugal → "Portugal", quebec → "Quebec",
  republica-tcheca → "República Tcheca"
  ```
- URL base: `https://raw.githubusercontent.com/marcosespinola1379/Mapa-de-Acordos/main/Acordos%20Internacionais_%20Ajustes%20Administrativos/<encodeURIComponent(filename)>`
- Se o `.txt` existir, ele **sobrescreve** o `acordoTexto` / `ajusteTexto` extraído do HTML (os HTMLs continuam sendo a fonte de órgãos, decretos, benefícios, documentos).
- Manter `acordoTrecho`/`ajusteTrecho` como preview (primeiros ~480 chars) no `acordos.generated.ts`.
- Atualizar `temTextoIntegral` baseado no resultado final.
- Não há `Ajuste Administrativo` para Bulgária, CPLP, Espanha, Israel, Moçambique — tratar 404 como ausência silenciosa.

### 2. Rodar o importador
- `bun scripts/import-acordos.ts` → regrava os 24 arquivos `src/data/acordos-textos/<slug>.ts` e o `acordos.generated.ts`.
- Por país agora teremos textos de ~10k–100k+ chars (cada um em arquivo separado, já lazy-loaded via `dynamic import` pelo `TextoIntegralAcordo`).

### 3. Validação
- Conferir tamanho de cada arquivo gerado (espera-se crescimento grande vs. estado atual).
- Sanity-check em 2 países (Portugal e Estados Unidos) abrindo `/acordos/<pais>` e expandindo "Texto integral".
- Build (Vite) deve continuar verde — o conteúdo extra fica fora do bundle inicial porque cada `<slug>.ts` é importado dinamicamente.

## Fora de escopo (não mexo agora)
- **Acordo Suíça** existe no repo mas não está em `SOURCES` nem em `acordos.ts`. Fica pra rodada futura (precisa de página própria + entradas em órgãos/benefícios).
- **Item 6 (Meu Hub)** continua adiado.
- Layout do bloco "Texto integral" no `/acordos/$pais` permanece como está (collapse + `<pre>` com scroll vertical) — só o conteúdo muda.
