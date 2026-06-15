## Objetivo

Substituir o `export const acordo` em `src/data/acordos-textos/grecia.ts` pelo texto integral do Acordo de Previdência Social Brasil–República Helênica conforme o `.docx` enviado, preservando hierarquia (Títulos, Capítulos, Artigos) e cláusulas finais (local de assinatura, signatários).

## Formato (igual aos outros países, ex.: `alemanha.ts`)

- Arquivo continua exportando `export const acordo = "..."` como string única.
- Parágrafos e cabeçalhos separados por `\n\n` (sem markdown, sem `#`, sem `**`).
- Cabeçalhos em CAIXA ALTA na própria linha: `TÍTULO I - DISPOSIÇÕES GERAIS`, `CAPÍTULO I - DOENÇA, MATERNIDADE E PRESTAÇÕES FAMILIAIS`, `ARTIGO I`, `ARTIGO II — Âmbito material` etc.
- Listas com alíneas (`a)`, `b)`, `1.`, `2.`) ficam em blocos separados, exatamente como aparecem no .docx.
- Comentário inicial do arquivo (`// Conteúdo curado…`) é mantido.
- Encerramento com: local/data (Atenas, 12/09/1984), idiomas e signatários (ALARICO SILVEIRA JUNIOR — Embaixador; ROULA KAKLAMANAKI — Vice-Ministro da Segurança Social).

## Escopo

- Editar apenas `src/data/acordos-textos/grecia.ts`.
- Não tocar em `ajuste` (Grécia não tem ajuste administrativo cadastrado e o .docx não traz um — manter como está / vazio).
- Nenhuma alteração em componentes, rotas ou outros países.

## Verificação

- Abrir a página `/acordos/grecia`, expandir "Texto integral do acordo" e conferir que renderiza do Título I ao Artigo XXVIII com os signatários ao final.
