// Fonte única de verdade para as estatísticas exibidas no site.
// Derivado de src/data/acordos.ts — não duplicar números em componentes.

import {
  totalAcordos,
  totalBilateraisVigentes,
  totalDocs,
  totalIncompletos,
  totalMultilateraisVigentes,
  totalRatificacao,
  totalVigentes,
} from "./acordos";

export const siteStats = {
  // Catálogo
  acordosMapeados: totalAcordos,
  acordosVigentes: totalVigentes,
  acordosBilateraisVigentes: totalBilateraisVigentes,
  acordosMultilateraisVigentes: totalMultilateraisVigentes,
  acordosEmRatificacao: totalRatificacao,
  acordosIncompletos: totalIncompletos,
  // Conteúdo
  documentosOrganizados: totalDocs,
  // Hub: cobre todos os acordos mapeados (mesma base de países)
  paisesCobertosHub: totalAcordos,
} as const;

export type SiteStats = typeof siteStats;
