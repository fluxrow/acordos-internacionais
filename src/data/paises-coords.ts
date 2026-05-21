// Coordenadas (lat, lng) das capitais/cidades-âncora dos países e blocos
// com acordo previdenciário com o Brasil. Usado para marcar pontos no globo.

export interface PaisCoord {
  slug: string;
  nome: string;
  lat: number;
  lng: number;
}

export const BRASIL: PaisCoord = {
  slug: "brasil",
  nome: "Brasil",
  lat: -15.7939,
  lng: -47.8828,
};

// 21 países bilaterais (Quebec é província, conta como acordo separado mas
// fica no mesmo ponto do Canadá no globo — omitido para não duplicar).
export const PAISES_ACORDO: PaisCoord[] = [
  { slug: "alemanha", nome: "Alemanha", lat: 52.52, lng: 13.405 },
  { slug: "austria", nome: "Áustria", lat: 48.2082, lng: 16.3738 },
  { slug: "belgica", nome: "Bélgica", lat: 50.8503, lng: 4.3517 },
  { slug: "bulgaria", nome: "Bulgária", lat: 42.6977, lng: 23.3219 },
  { slug: "cabo-verde", nome: "Cabo Verde", lat: 14.933, lng: -23.5133 },
  { slug: "canada", nome: "Canadá", lat: 45.4215, lng: -75.6972 },
  { slug: "chile", nome: "Chile", lat: -33.4489, lng: -70.6693 },
  { slug: "coreia-do-sul", nome: "Coreia do Sul", lat: 37.5665, lng: 126.978 },
  { slug: "espanha", nome: "Espanha", lat: 40.4168, lng: -3.7038 },
  { slug: "estados-unidos", nome: "Estados Unidos", lat: 38.9072, lng: -77.0369 },
  { slug: "franca", nome: "França", lat: 48.8566, lng: 2.3522 },
  { slug: "grecia", nome: "Grécia", lat: 37.9838, lng: 23.7275 },
  { slug: "india", nome: "Índia", lat: 28.6139, lng: 77.209 },
  { slug: "israel", nome: "Israel", lat: 31.7683, lng: 35.2137 },
  { slug: "italia", nome: "Itália", lat: 41.9028, lng: 12.4964 },
  { slug: "japao", nome: "Japão", lat: 35.6762, lng: 139.6503 },
  { slug: "luxemburgo", nome: "Luxemburgo", lat: 49.6116, lng: 6.1319 },
  { slug: "mocambique", nome: "Moçambique", lat: -25.9692, lng: 32.5732 },
  { slug: "portugal", nome: "Portugal", lat: 38.7223, lng: -9.1393 },
  { slug: "republica-tcheca", nome: "República Tcheca", lat: 50.0755, lng: 14.4378 },
  { slug: "suica", nome: "Suíça", lat: 46.948, lng: 7.4474 },
];

// Países "destaques" da home — ganham marcador médio para hierarquia visual
export const DESTAQUES_SLUGS = new Set([
  "portugal",
  "japao",
  "estados-unidos",
  "italia",
  "alemanha",
  "espanha",
]);
