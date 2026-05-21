// Lógica de cálculo da totalização internacional (RGPS + acordos bilaterais)
// 100% client-side, sem dependências externas. Usada pelas duas calculadoras
// (segurado público em /calculadora e advogado em /_authenticated/calculadora).

export type TipoBeneficio = "aposentadoria_idade" | "pensao_morte";
export type Sexo = "F" | "M";

export interface Vinculo {
  ini: string;
  fim: string;
  meses: number;
}

export interface CnisData {
  vinculos: Vinculo[];
  salarios: number[];
  totalMeses: number;
  somaSalarios: number;
  qtdSalarios: number;
  nome: string | null;
  cpf: string | null;
  dataNasc: string | null; // DD/MM/YYYY
}

export const PAISES_ACORDO = [
  "Alemanha", "Argentina", "Áustria", "Bélgica", "Bolívia", "Bulgária",
  "Cabo Verde", "Canadá", "Chile", "Coreia do Sul", "Espanha",
  "Estados Unidos", "França", "Grécia", "Índia", "Itália", "Japão",
  "Luxemburgo", "Moçambique", "Paraguai", "Portugal", "República Tcheca",
  "Suíça", "Uruguai", "Quebec (Canadá)",
] as const;

export function isDataValida(d: string): boolean {
  const p = d.split("/");
  if (p.length !== 3) return false;
  const dia = +p[0], mes = +p[1], ano = +p[2];
  return dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano >= 1960 && ano <= 2030;
}

export function calcMeses(d1: string, d2: string): number {
  const parse = (s: string) => { const [d, m, a] = s.split("/"); return new Date(`${a}-${m}-${d}`); };
  return Math.round((parse(d2).getTime() - parse(d1).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
}

export function calcIdade(nascInput: string): number {
  const nasc = new Date(nascInput + "T12:00:00");
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return anos;
}

export function mesesParaIdade(nascInput: string, idadeAlvo: number): number {
  const nasc = new Date(nascInput + "T12:00:00");
  const alvo = new Date(nasc);
  alvo.setFullYear(nasc.getFullYear() + idadeAlvo);
  const hoje = new Date();
  if (alvo <= hoje) return 0;
  return Math.ceil((alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
}

export function formatarTempo(meses: number): string {
  if (meses <= 0) return "0 meses";
  const a = Math.floor(meses / 12), m = meses % 12;
  if (a > 0 && m > 0) return `${a} ano${a > 1 ? "s" : ""} e ${m} mês${m > 1 ? "es" : ""}`;
  if (a > 0) return `${a} ano${a > 1 ? "s" : ""}`;
  return `${m} mês${m > 1 ? "es" : ""}`;
}

export function formatarMoeda(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseadorCNIS(texto: string): CnisData {
  const cnisData: CnisData = {
    vinculos: [], salarios: [], totalMeses: 0, somaSalarios: 0,
    qtdSalarios: 0, nome: null, cpf: null, dataNasc: null,
  };

  const nomeMatch = texto.match(/Nome[:\s]+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ ]{2,49}?)(?=\s{2,}|\s*(?:CPF|NIT|Data\b|Nasc|\d{3}\.))/i);
  if (nomeMatch) cnisData.nome = nomeMatch[1].trim().replace(/\s+/g, " ");

  const cpfMatch = texto.match(/CPF[:\s]+(\d{3}[\.\s]?\d{3}[\.\s]?\d{3}[-\s]?\d{2})/i);
  if (cpfMatch) {
    const cpf = cpfMatch[1].replace(/\D/g, "");
    cnisData.cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const nascMatch = texto.match(/(?:Nascimento|Nasc\.?)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
  if (nascMatch) cnisData.dataNasc = nascMatch[1];

  const regexVinculos = /(\d{2}\/\d{2}\/\d{4})\s+.*?(\d{2}\/\d{2}\/\d{4})/g;
  let match;
  while ((match = regexVinculos.exec(texto)) !== null) {
    if (isDataValida(match[1]) && isDataValida(match[2])) {
      const meses = calcMeses(match[1], match[2]);
      if (meses > 0) cnisData.vinculos.push({ ini: match[1], fim: match[2], meses });
    }
  }
  const candidatos = texto.match(/\d{1,3}[\.,]\d{3}([\.,]\d{2})?/g) || [];
  cnisData.salarios = candidatos
    .map((s: string) => parseFloat(s.replace(/\./g, "").replace(",", ".")))
    .filter((v: number) => v > 100 && v < 50000 && !isNaN(v))
    .slice(0, 360);
  cnisData.qtdSalarios = cnisData.salarios.length;
  cnisData.somaSalarios = cnisData.salarios.reduce((a, b) => a + b, 0);
  cnisData.totalMeses = cnisData.vinculos.reduce((a, b) => a + b.meses, 0);
  return cnisData;
}

// ============== RESULTADO ==============

export type ResultadoCalculo =
  | { caso: 1; rmiIntegral: number; carencia: number; tempoBrasilMeses: number; tempoPaisMeses: number; tempoTotal: number }
  | { caso: 2; faltam: number; carencia: number; tempoBrasilMeses: number; tempoPaisMeses: number; tempoTotal: number }
  | {
      caso: "2b"; idadeAtual: number; idadeMin: number; mesesRestantes: number;
      rmiProrataProjetada: number; indiceProrrata: number; rmiTeorica: number;
      carencia: number; tempoBrasilMeses: number; tempoPaisMeses: number; tempoTotal: number;
    }
  | {
      caso: 3; rmiProrrata: number; rmiTeorica: number; indiceProrrata: number;
      sbFinal: number; coef: number; carencia: number;
      tempoBrasilMeses: number; tempoPaisMeses: number; tempoTotal: number;
    };

export interface ParamsCalculo {
  tempoBrasilMeses: number;
  tempoPaisMeses: number;
  sbFinal: number;
  tipo: TipoBeneficio;
  nascInput: string; // YYYY-MM-DD
  sexo: Sexo;
  nomePais: string;
}

export function calcularResultado(params: ParamsCalculo): ResultadoCalculo {
  const { tempoBrasilMeses, tempoPaisMeses, sbFinal, tipo, nascInput, sexo } = params;
  const tempoTotal = tempoBrasilMeses + tempoPaisMeses;
  const carencia = tipo === "pensao_morte" ? 18 : 180;
  const coef = tipo === "pensao_morte" ? 1.0 : 0.70;
  const rmiTeorica = sbFinal * coef;

  if (tempoBrasilMeses >= carencia) {
    return { caso: 1, rmiIntegral: rmiTeorica, carencia, tempoBrasilMeses, tempoPaisMeses, tempoTotal };
  }

  if (tempoTotal < carencia) {
    return { caso: 2, faltam: carencia - tempoTotal, carencia, tempoBrasilMeses, tempoPaisMeses, tempoTotal };
  }

  if (tipo === "aposentadoria_idade" && nascInput && sexo) {
    const idadeMin = sexo === "F" ? 62 : 65;
    const idadeAtual = calcIdade(nascInput);
    if (idadeAtual < idadeMin) {
      const mesesRestantes = mesesParaIdade(nascInput, idadeMin);
      const indiceProrrata = tempoBrasilMeses / tempoTotal;
      return {
        caso: "2b",
        idadeAtual, idadeMin, mesesRestantes,
        rmiProrataProjetada: rmiTeorica * indiceProrrata,
        indiceProrrata, rmiTeorica, carencia, tempoBrasilMeses, tempoPaisMeses, tempoTotal,
      };
    }
  }

  const indiceProrrata = tempoBrasilMeses / tempoTotal;
  const rmiProrrata = rmiTeorica * indiceProrrata;
  return {
    caso: 3, rmiProrrata, rmiTeorica, indiceProrrata, sbFinal, coef,
    carencia, tempoBrasilMeses, tempoPaisMeses, tempoTotal,
  };
}

// ============== PDF.js loader (via CDN — Workers-compatible) ==============

let pdfjsPromise: Promise<unknown> | null = null;

export function carregarPdfJs(): Promise<unknown> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  const w = window as unknown as { pdfjsLib?: { GlobalWorkerOptions: { workerSrc: string } } };
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      const lib = (window as unknown as { pdfjsLib: { GlobalWorkerOptions: { workerSrc: string } } }).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    script.onerror = () => reject(new Error("Falha ao carregar PDF.js"));
    document.head.appendChild(script);
  });
  return pdfjsPromise;
}

export async function lerTextoPDF(file: File): Promise<string> {
  const pdfjsLib = (await carregarPdfJs()) as {
    getDocument: (data: ArrayBuffer) => { promise: Promise<{ numPages: number; getPage: (i: number) => Promise<{ getTextContent: () => Promise<{ items: Array<{ str: string }> }> }> }> };
  };
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let texto = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    texto += tc.items.map((x) => x.str).join(" ") + "\n";
  }
  return texto;
}
