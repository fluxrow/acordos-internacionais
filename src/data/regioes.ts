// Mapeamento de país (slug) → região geopolítica.
// Usado pelos filtros do dashboard /hub.

export type Regiao = "Europa" | "Américas" | "Ásia" | "Multilateral";

export const REGIAO_POR_PAIS: Record<string, Regiao> = {
  alemanha: "Europa",
  austria: "Europa",
  belgica: "Europa",
  bulgaria: "Europa",
  espanha: "Europa",
  franca: "Europa",
  grecia: "Europa",
  italia: "Europa",
  luxemburgo: "Europa",
  portugal: "Europa",
  "republica-tcheca": "Europa",
  suica: "Europa",

  "cabo-verde": "Américas", // CPLP/África, mas agrupado com Lusofonia/Atlântico
  mocambique: "Américas",
  canada: "Américas",
  chile: "Américas",
  "estados-unidos": "Américas",
  quebec: "Américas",

  "coreia-do-sul": "Ásia",
  india: "Ásia",
  israel: "Ásia",
  japao: "Ásia",

  cplp: "Multilateral",
  iberoamericano: "Multilateral",
  mercosul: "Multilateral",
};

export const REGIOES: Regiao[] = ["Europa", "Américas", "Ásia", "Multilateral"];
