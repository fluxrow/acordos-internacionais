## Objetivo
Substituir o placeholder "MULTI" pelos logos oficiais de **CPLP**, **Ibero-Americano (OISS)** e **Mercosul** nos cards do Hub e na lista "Continuar de onde parou".

## Passos

1. **Importar os 3 logos como assets**
   - Copiar os anexos para:
     - `src/assets/logos/cplp.png`
     - `src/assets/logos/oiss.png` (Ibero-Americano)
     - `src/assets/logos/mercosul.png`

2. **Criar mapa slug → logo** em `src/lib/multi-logos.ts`:
   ```ts
   export const MULTI_LOGOS: Record<string, string> = {
     cplp: cplpLogo,
     iberoamericano: oissLogo,
     mercosul: mercosulLogo,
   };
   ```

3. **`src/components/hub/country-card.tsx`**
   - Quando `pais.flag` é `null` e existe `MULTI_LOGOS[pais.slug]`, renderizar `<img>` com o logo (object-contain, fundo branco/secondary, mesmas dimensões 56×42, rounded-lg).
   - Manter fallback "MULTI" para casos futuros sem logo.

4. **`src/components/hub/continue-reading.tsx`**
   - Mesma lógica em tamanho menor (24×18): se sem flag mas com logo, renderiza o logo; senão mantém o "M".

## Escopo
- Apenas frontend/apresentação. Sem mudanças em dados, backend, RLS ou rotas.
- Sem alterações em `acordos.ts` ou `acordos.generated.ts` — o slug continua identificador.

## Arquivos
- novo: `src/assets/logos/cplp.png`, `oiss.png`, `mercosul.png`
- novo: `src/lib/multi-logos.ts`
- editado: `src/components/hub/country-card.tsx`
- editado: `src/components/hub/continue-reading.tsx`