import type { ResultadoCalculo, Sexo, TipoBeneficio } from "@/lib/calculadora";
import { decretoDoPais } from "@/lib/calculadora-cenarios";

const STORAGE_KEY = "laudo:pending";

export type LaudoPeriodo = {
  sistema: string;
  inicio: string; // dd/mm/yyyy
  fim: string;    // dd/mm/yyyy
  meses: number;
  computaCarencia: boolean;
  fonte: string;
};

export type LaudoPayload = {
  cliente: {
    nome: string;
    cpf: string;
    dataNasc: string; // ISO
    sexo: Sexo | "";
    especie: TipoBeneficio | "";
  };
  pais: string;
  paisBandeira: string;
  acordo: {
    nome: string;
    decreto: string;
    dispositivoProrata: string;
    carenciaArt: string;
  };
  advogado: { nome: string; oab: string };
  periodos: LaudoPeriodo[];
  tempoBrasil: number;
  tempoPais: number;
  tempoTotal: number;
  carenciaExigida: number;
  resultado: ResultadoCalculo;
  dataAnalise: string; // ISO
  ref: string;
};

const BANDEIRAS: Record<string, string> = {
  Alemanha: "🇩🇪", Argentina: "🇦🇷", Áustria: "🇦🇹", Bélgica: "🇧🇪",
  Bolívia: "🇧🇴", Bulgária: "🇧🇬", "Cabo Verde": "🇨🇻", Canadá: "🇨🇦",
  Chile: "🇨🇱", "Coreia do Sul": "🇰🇷", Espanha: "🇪🇸",
  "Estados Unidos": "🇺🇸", França: "🇫🇷", Grécia: "🇬🇷", Índia: "🇮🇳",
  Israel: "🇮🇱", Itália: "🇮🇹", Japão: "🇯🇵", Luxemburgo: "🇱🇺",
  Moçambique: "🇲🇿", Paraguai: "🇵🇾", Portugal: "🇵🇹",
  "Quebec (Canadá)": "🇨🇦", "República Tcheca": "🇨🇿", Suíça: "🇨🇭",
  Uruguai: "🇺🇾",
};

export function bandeiraDoPais(pais: string): string {
  return BANDEIRAS[pais] ?? "🌐";
}

export function acordoMetaDoPais(pais: string, tipo: TipoBeneficio | ""): LaudoPayload["acordo"] {
  return {
    nome: pais ? `Acordo de Previdência Social Brasil–${pais}` : "Acordo bilateral aplicável",
    decreto: decretoDoPais(pais),
    dispositivoProrata: "Cálculo pró-rata — Art. 5º do Decreto 6.722/2008 c/c acordo bilateral · IN PRES/INSS nº 128/2022",
    carenciaArt: tipo === "pensao_morte"
      ? "Pensão por morte — Art. 26, I, Lei 8.213/91 (sem carência)"
      : "Aposentadoria por idade — 180 meses (Art. 25, II, Lei 8.213/91 — totalização computada)",
  };
}

export function gerarRef(d = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${d.getFullYear()}-${mm}${dd}-${rand}`;
}

export function saveLaudoPayload(payload: LaudoPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage indisponível — ignora
  }
}

export function loadLaudoPayload(): LaudoPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LaudoPayload;
  } catch {
    return null;
  }
}

export function clearLaudoPayload(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}
