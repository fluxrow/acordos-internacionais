#!/usr/bin/env bun
/**
 * Importa o conteúdo bruto dos 24 HTMLs do repositório
 * marcosespinola1379/Mapa-de-Acordos e gera src/data/acordos.generated.ts
 * com campos estruturados: órgãos de ligação, benefícios cobertos por país,
 * decreto + ajuste administrativo, e lista de documentos.
 *
 * Uso:
 *   bun scripts/import-acordos.ts            # baixa direto do GitHub
 *   bun scripts/import-acordos.ts /tmp/mapa  # usa cache local
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const RAW_BASE = "https://raw.githubusercontent.com/marcosespinola1379/Mapa-de-Acordos/main";

// Mapa: nome do arquivo no repo (sem .html) → slug usado em src/data/acordos.ts
const SOURCES: Array<{ file: string; slug: string }> = [
  { file: "acordo-alemanha", slug: "alemanha" },
  { file: "acordo-austria", slug: "austria" },
  { file: "acordo-belgica", slug: "belgica" },
  { file: "acordo-bulgaria", slug: "bulgaria" },
  { file: "acordo-cabo-verde", slug: "cabo-verde" },
  { file: "acordo-canada", slug: "canada" },
  { file: "acordo-chile", slug: "chile" },
  { file: "acordo-coreia", slug: "coreia-do-sul" },
  { file: "acordo-cplp", slug: "cplp" },
  { file: "acordo-espanha", slug: "espanha" },
  { file: "acordo-estados-unidos", slug: "estados-unidos" },
  { file: "acordo-franca", slug: "franca" },
  { file: "acordo-grecia", slug: "grecia" },
  { file: "acordo-iberoamericano", slug: "iberoamericano" },
  { file: "acordo-india", slug: "india" },
  { file: "acordo-israel", slug: "israel" },
  { file: "acordo-italia", slug: "italia" },
  { file: "acordo-japao", slug: "japao" },
  { file: "acordo-luxemburgo", slug: "luxemburgo" },
  { file: "acordo-mercosul", slug: "mercosul" },
  { file: "acordo-mocambique", slug: "mocambique" },
  { file: "acordo-portugal", slug: "portugal" },
  { file: "acordo-quebec", slug: "quebec" },
  { file: "acordo-republica-tcheca", slug: "republica-tcheca" },
];

// ───────────────────────────── helpers de parsing ─────────────────────────────

function cleanText(s: string | undefined): string {
  if (!s) return "";
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pickInfoCard(html: string, labelHint: RegExp): string | undefined {
  // info-cards são pares <div class="info-label">...</div><div class="info-value">...</div>
  const re = /<div\s+class="info-label">([\s\S]*?)<\/div>\s*<div\s+class="info-value">([\s\S]*?)<\/div>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const label = cleanText(m[1]);
    if (labelHint.test(label)) return cleanText(m[2]) || undefined;
  }
  return undefined;
}

interface Orgao {
  titulo: string;
  instituicao?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

function parseContactBoxes(html: string): Orgao[] {
  // Localiza cada início de contact-box, slice até o próximo (ou até o fim
  // da contact-section). Evita lidar com balanceamento de <div> aninhados.
  const out: Orgao[] = [];
  const positions: number[] = [];
  const reBox = /<div\s+class="contact-box">/g;
  let m: RegExpExecArray | null;
  while ((m = reBox.exec(html)) !== null) positions.push(m.index);
  // sentinela: tudo depois do último box
  positions.push(html.length);

  for (let i = 0; i < positions.length - 1; i++) {
    const body = html.slice(positions[i], positions[i + 1]);
    const titulo = cleanText(/<div\s+class="contact-title">([\s\S]*?)<\/div>/.exec(body)?.[1]);
    if (!titulo) continue;

    const fields: Record<string, string | undefined> = {};
    // Para cada label, pega o próximo contact-value (em qualquer ordem).
    const labelRe = /<div\s+class="contact-label">([\s\S]*?)<\/div>\s*<div\s+class="contact-value">([\s\S]*?)<\/div>/g;
    let lm: RegExpExecArray | null;
    while ((lm = labelRe.exec(body)) !== null) {
      const label = cleanText(lm[1]);
      const value = cleanText(lm[2]);
      if (!label || !value) continue;
      if (/institui/i.test(label)) fields.instituicao = value;
      else if (/endere/i.test(label)) fields.endereco = value;
      else if (/telefone/i.test(label)) fields.telefone = value;
      else if (/mail/i.test(label)) fields.email = value;
    }
    out.push({ titulo, ...fields });
  }
  return out;
}

function parseBenefitsBlock(html: string, blockId: string): string[] {
  const re = new RegExp(
    `<div\\s+id="${blockId}"[^>]*>([\\s\\S]*?)<\\/div>\\s*<\\/div>\\s*<\\/div>`,
    "i",
  );
  const m = re.exec(html);
  if (!m) return [];
  const block = m[1];
  const out: string[] = [];
  const itemRe = /<span\s+class="benefit-name">([\s\S]*?)<\/span>\s*<\/div>/g;
  let im: RegExpExecArray | null;
  while ((im = itemRe.exec(block)) !== null) {
    const t = cleanText(im[1]);
    if (t) out.push(t);
  }
  return out;
}

function parseAcordoText(html: string, id: string): string | undefined {
  const re = new RegExp(
    `<div\\s+id="${id}"[^>]*>[\\s\\S]*?<div\\s+class="acordo-text">([\\s\\S]*?)<\\/div>\\s*<\\/div>`,
    "i",
  );
  const m = re.exec(html);
  if (!m) return undefined;
  const txt = cleanText(m[1]);
  return txt || undefined;
}

interface Documento {
  nome: string;
  desc?: string;
  cat: string;
  arquivo?: string;
  tamanho?: string;
}

function parseDocumentos(html: string): Documento[] {
  // const documentos = [ { ... }, ... ];
  const m = /const\s+documentos\s*=\s*\[([\s\S]*?)\];/.exec(html);
  if (!m) return [];
  const body = m[1];
  const out: Documento[] = [];
  const objRe = /\{([^{}]*)\}/g;
  let om: RegExpExecArray | null;
  while ((om = objRe.exec(body)) !== null) {
    const obj = om[1];
    const get = (k: string) => {
      const r = new RegExp(`${k}\\s*:\\s*"([^"]*)"`).exec(obj);
      return r ? r[1].trim() : undefined;
    };
    const nome = get("nome");
    if (!nome) continue;
    out.push({
      nome,
      desc: get("desc"),
      cat: get("cat") ?? "outro",
      arquivo: get("arquivo"),
      tamanho: get("tamanho"),
    });
  }
  return out;
}

// ────────────────────────────────── main ──────────────────────────────────────

async function loadHtml(file: string, cacheDir?: string): Promise<string> {
  if (cacheDir) {
    const slug = file.replace(/^acordo[-_]/, "");
    const local = resolve(cacheDir, `${slug}.html`);
    if (existsSync(local)) return readFileSync(local, "utf8");
  }
  const url = `${RAW_BASE}/${file}.html`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`);
  return res.text();
}

async function main() {
  const cacheDir = process.argv[2];
  if (cacheDir && !existsSync(cacheDir)) {
    console.error(`cache dir não existe: ${cacheDir}`);
    process.exit(1);
  }

  const result: Record<string, unknown> = {};
  const warnings: string[] = [];
  const outDir = resolve(import.meta.dir, "..", "src", "data");
  const textosDir = resolve(outDir, "acordos-textos");
  mkdirSync(textosDir, { recursive: true });

  for (const { file, slug } of SOURCES) {
    process.stdout.write(`→ ${slug.padEnd(20)} `);
    const html = await loadHtml(file, cacheDir);

    const titulo = cleanText(/<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1]);
    const decreto = pickInfoCard(html, /decreto/i);
    const instrumento = pickInfoCard(html, /instrumento/i);
    const vigorDesde = pickInfoCard(html, /vigor/i);
    const docsInfo = pickInfoCard(html, /documentos?/i);

    const orgaos = parseContactBoxes(html);
    const orgaoBR = orgaos.find((o) => /brasil|apsai|inss/i.test(o.titulo));
    const orgaoParceiro = orgaos.find((o) => o !== orgaoBR);

    const beneficiosBrasil = parseBenefitsBlock(html, "beneficios-brasil");
    let beneficiosParceiro: string[] = [];
    const blockIds = [...html.matchAll(/id="(beneficios-[a-z0-9-]+)"/g)].map((m) => m[1]);
    for (const id of blockIds) {
      if (id === "beneficios-brasil") continue;
      const items = parseBenefitsBlock(html, id);
      if (items.length) {
        beneficiosParceiro = items;
        break;
      }
    }

    const acordoTexto = parseAcordoText(html, "acordo");
    const ajusteTexto = parseAcordoText(html, "ajuste-administrativo");
    const documentos = parseDocumentos(html);

    if (!orgaoBR) warnings.push(`${slug}: órgão BR não encontrado`);
    if (!orgaoParceiro) warnings.push(`${slug}: órgão parceiro não encontrado`);
    if (!beneficiosBrasil.length) warnings.push(`${slug}: benefícios BR vazios`);
    if (!beneficiosParceiro.length) warnings.push(`${slug}: benefícios parceiro vazios`);
    if (!acordoTexto) warnings.push(`${slug}: texto do acordo não encontrado`);

    result[slug] = {
      titulo,
      instrumento,
      decreto,
      vigorDesde,
      docsInfo,
      orgaoBR,
      orgaoParceiro,
      beneficios: {
        brasil: beneficiosBrasil,
        parceiro: beneficiosParceiro,
      },
      // Preview curto fica no bundle principal; texto integral é lazy-loaded
      // de src/data/acordos-textos/<slug>.ts.
      acordoTrecho: acordoTexto?.slice(0, 480),
      ajusteTrecho: ajusteTexto?.slice(0, 480),
      temTextoIntegral: Boolean(acordoTexto || ajusteTexto),
      documentos,
    };

    // Escreve arquivo por país com o texto integral (code-split via dynamic import).
    const textoFile = resolve(textosDir, `${slug}.ts`);
    const textoBody = `// AUTO-GENERATED por scripts/import-acordos.ts — não editar.
export const acordo = ${JSON.stringify(acordoTexto ?? "")};
export const ajuste = ${JSON.stringify(ajusteTexto ?? "")};
`;
    writeFileSync(textoFile, textoBody, "utf8");

    process.stdout.write(
      `${orgaoBR ? "✓" : "✗"} BR  ${orgaoParceiro ? "✓" : "✗"} parc  ` +
        `ben:${beneficiosBrasil.length}/${beneficiosParceiro.length}  ` +
        `docs:${documentos.length}  ` +
        `txt:${acordoTexto?.length ?? 0}/${ajusteTexto?.length ?? 0}\n`,
    );
  }

  const outFile = resolve(outDir, "acordos.generated.ts");
  const header = `// AUTO-GENERATED por scripts/import-acordos.ts
// Não edite à mão. Rode: bun scripts/import-acordos.ts
// Fonte: github.com/marcosespinola1379/Mapa-de-Acordos
// Texto integral de cada acordo vive em src/data/acordos-textos/<slug>.ts
// (lazy-loaded via dynamic import para não inflar o bundle).

import type { AcordoImportado } from "./acordos.types";

export const acordosImportados: Record<string, AcordoImportado> = `;
  writeFileSync(outFile, header + JSON.stringify(result, null, 2) + ";\n", "utf8");

  console.log(`\n✓ Gerado ${outFile}`);
  console.log(`✓ Gerados ${SOURCES.length} arquivos em ${textosDir}`);
  if (warnings.length) {
    console.warn(`\n⚠  ${warnings.length} avisos:`);
    for (const w of warnings) console.warn(`  - ${w}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
