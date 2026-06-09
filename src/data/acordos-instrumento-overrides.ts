// Fonte de verdade do campo "instrumento" exibido nas páginas de país
// (tanto pública /acordos/$pais quanto Hub /hub/$pais).
//
// Regra:
//  - Bilaterais: "Acordo Brasil - <País>" (espaço antes e depois do hífen).
//  - Multilaterais: apenas o nome do bloco.
//
// Sobrescreve o que vem do importador (scripts/import-acordos.ts) para que
// qualquer reimportação futura não desfaça a padronização.
export const INSTRUMENTO_OVERRIDES: Record<string, string> = {
  alemanha: "Acordo Brasil - Alemanha",
  austria: "Acordo Brasil - Áustria",
  belgica: "Acordo Brasil - Bélgica",
  bulgaria: "Acordo Brasil - Bulgária",
  "cabo-verde": "Acordo Brasil - Cabo Verde",
  canada: "Acordo Brasil - Canadá",
  chile: "Acordo Brasil - Chile",
  "coreia-do-sul": "Acordo Brasil - Coreia do Sul",
  espanha: "Acordo Brasil - Espanha",
  "estados-unidos": "Acordo Brasil - Estados Unidos",
  franca: "Acordo Brasil - França",
  grecia: "Acordo Brasil - Grécia",
  india: "Acordo Brasil - Índia",
  israel: "Acordo Brasil - Israel",
  italia: "Acordo Brasil - Itália",
  japao: "Acordo Brasil - Japão",
  luxemburgo: "Acordo Brasil - Luxemburgo",
  mocambique: "Acordo Brasil - Moçambique",
  portugal: "Acordo Brasil - Portugal",
  quebec: "Acordo Brasil - Quebec",
  "republica-tcheca": "Acordo Brasil - República Tcheca",
  suica: "Acordo Brasil - Suíça",
  mercosul: "Mercosul",
  cplp: "CPLP",
  iberoamericano: "Iberoamericano",
};

export function getInstrumento(slug: string, fallback?: string): string {
  return INSTRUMENTO_OVERRIDES[slug] ?? fallback ?? "";
}
