# Por que o texto continua "do mesmo jeito"

A formatação que eu fiz na rodada anterior está no componente `src/components/texto-integral-acordo.tsx`, usado em `/acordos/:pais`.

Mas a tela que você está olhando é **/hub/grecia?tab=acordo**, que usa OUTRO renderizador dentro de `src/routes/_authenticated/hub.$pais.tsx` (linhas 458–464):

```tsx
<pre className="... whitespace-pre-wrap p-6 font-sans text-[13px] ...">
  {estado.texto}
</pre>
```

Um `<pre>` simples — sem detectar título, sem centralizar, sem negrito, sem justificar. Por isso aparece tudo alinhado à esquerda, mesma espessura, igual à imagem que você mandou. A correção anterior nunca passou por esse caminho.

# Plano

1. Extrair a lógica de formatação (`TextoFormatado`, `classificar`, regex `RE_TITULO/CAPITULO/ARTIGO/SECAO`, tipos `Bloco`) de `src/components/texto-integral-acordo.tsx` para um módulo compartilhado `src/components/texto-formatado.tsx`, exportando `<TextoFormatado />`.
2. Atualizar `src/components/texto-integral-acordo.tsx` para consumir o componente compartilhado (sem mudança visual em `/acordos/:pais`).
3. Em `src/routes/_authenticated/hub.$pais.tsx`, substituir o bloco `<pre>` (linhas 458–464) por:
   ```tsx
   <div className="hub-surface overflow-hidden">
     <div className="hub-scroll max-h-[calc(100vh-260px)] min-h-[400px] overflow-y-auto overscroll-contain p-6">
       <TextoFormatado raw={estado.texto} />
     </div>
   </div>
   ```
   Mantém o card, scroll e altura do HUB; só troca o renderizador.
4. Ajustes finos no `TextoFormatado` para casar com a referência do .docx:
   - Título de abertura ("ACORDO DE PREVIDÊNCIA SOCIAL ENTRE…") detectado mesmo com >160 chars: novo regex `RE_ACORDO = /^ACORDO\s+(DE|ENTRE)/i` → trata como `h1`.
   - "TÍTULO I", "CAPÍTULO …", "ARTIGO …" continuam centralizados, em caixa-alta e negrito.
   - "DISPOSIÇÕES GERAIS" e demais blocos curtos all-caps continuam como subtítulo centralizado.
   - Parágrafos justificados, espaçamento confortável, sem indent forçado.
5. Verificação: abrir `/hub/grecia?tab=acordo` (cabeçalho centralizado em negrito, parágrafos justificados) e `/acordos/grecia` (sem regressão). Conferir também `/hub/canada` e `/hub/alemanha` para garantir que `---` e títulos longos seguem corretos.

# Escopo

- Sem alterar arquivos em `src/data/acordos-textos/*`.
- Sem mexer em outras abas do HUB.
- Mudança vale automaticamente para todos os países, já que o HUB usa o mesmo renderizador.
