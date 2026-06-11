#!/usr/bin/env bun
/**
 * Baixa os .docx da pasta "Acordos e Ajustes Revisados" do repositório
 * github.com/marcosespinola1379/Mapa-de-Acordos e reescreve cada
 * src/data/acordos-textos/<slug>.ts com os exports `acordo` e `ajuste`.
 *
 * Mantém o texto em uma única string com separadores "---" (mesmo padrão
 * do canada.ts que foi curado manualmente na rodada anterior).
 *
 * Uso:
 *   bun scripts/import-acordos-revisados.ts                  # importa tudo
 *   bun scripts/import-acordos-revisados.ts --pais alemanha  # só um país
 *   bun scripts/import-acordos-revisados.ts --dry            # só lista
 */
import mammoth from "mammoth";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const REPO = "marcosespinola1379/Mapa-de-Acordos";
const BRANCH = "main";
const FOLDER = "Acordos e Ajustes Revisados";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURIComponent(FOLDER)}`;

// nome do arquivo no GitHub (sem prefixo "Acordo "/"Ajuste Administrativo ") → slug
const NAME_TO_SLUG: Record<string, string> = {
  Alemanha: "alemanha",
  Áustria: "austria",
  Bélgica: "belgica",
  Bulgária: "bulgaria",
  "Cabo Verde": "cabo-verde",
  Canadá: "canada",
  Chile: "chile",
  Coreia: "coreia-do-sul",
  CPLP: "cplp",
  Espanha: "espanha",
  "Estados Unidos": "estados-unidos",
  França: "franca",
  Grécia: "grecia",
  Iberoamericano: "iberoamericano",
  Índia: "india",
  Israel: "israel",
  Itália: "italia",
  Japão: "japao",
  Luxemburgo: "luxemburgo",
  Mercosul: "mercosul",
  Moçambique: "mocambique",
  Portugal: "portugal",
  Quebec: "quebec",
  "República Tcheca": "republica-tcheca",
  Suíça: "suica",
};

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const onlyIdx = args.indexOf("--pais");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

function tsStringLiteral(s: string): string {
  // Usa JSON.stringify para escapar com segurança e mantém quebras como \r\n
  return JSON.stringify(s.replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
}

async function fetchDocxText(filename: string): Promise<string | null> {
  const url = `${RAW_BASE}/${encodeURIComponent(filename)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`download ${filename}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const { value } = await mammoth.extractRawText({ buffer: buf });
  // normaliza espaços, remove linhas duplicadas em branco
  const cleaned = value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned;
}

async function importOne(displayName: string, slug: string) {
  if (ONLY && slug !== ONLY) return;
  const targetPath = join("src", "data", "acordos-textos", `${slug}.ts`);
  if (!existsSync(targetPath)) {
    console.log(`! ${slug}: arquivo destino não existe (${targetPath}) — pulando`);
    return;
  }

  const acordoFile = `Acordo ${displayName}.docx`;
  const ajusteFile = `Ajuste Administrativo ${displayName}.docx`;

  console.log(`→ ${slug}`);
  const acordoTexto = await fetchDocxText(acordoFile);
  if (!acordoTexto) {
    console.log(`  ! sem ${acordoFile} no repo — pulando`);
    return;
  }
  const ajusteTexto = await fetchDocxText(ajusteFile);
  if (!ajusteTexto) {
    console.log(`  · sem Ajuste Administrativo no repo — mantendo ajuste atual`);
  }

  // Preserva o ajuste atual quando o repo não tem ajuste novo.
  let ajusteFinal: string | null = ajusteTexto;
  if (!ajusteFinal) {
    const current = readFileSync(targetPath, "utf8");
    const match = current.match(/export const ajuste\s*=\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`);/s);
    if (match) {
      ajusteFinal = null; // sinal de "manter como está"
    }
  }

  if (DRY) {
    console.log(`  (dry) acordo: ${acordoTexto.length} chars; ajuste: ${ajusteTexto ? ajusteTexto.length : "mantido"}`);
    return;
  }

  const header = `// Conteúdo curado a partir dos .docx revisados pelo Dr. Marcos Espínola
// no repositório Mapa-de-Acordos (pasta "Acordos e Ajustes Revisados").
// Gerado por scripts/import-acordos-revisados.ts. Preservado em
// scripts/import-acordos.ts (PRESERVE_TEXTO_INTEGRAL) para não ser
// sobrescrito em reimportações do dataset base.
`;

  let acordoLine = `export const acordo = ${tsStringLiteral(acordoTexto)};`;
  let ajusteLine: string;
  if (ajusteFinal !== null) {
    ajusteLine = `export const ajuste = ${tsStringLiteral(ajusteFinal)};`;
  } else {
    // mantém o ajuste atual lendo do arquivo existente
    const current = readFileSync(targetPath, "utf8");
    const m = current.match(/export const ajuste[\s\S]*?;\s*$/m);
    ajusteLine = m ? m[0].trim() : `export const ajuste = "";`;
  }

  const out = `${header}\n${acordoLine}\n\n${ajusteLine}\n`;
  writeFileSync(targetPath, out, "utf8");
  console.log(`  ✓ escrito ${targetPath} (acordo ${acordoTexto.length} chars${ajusteTexto ? `, ajuste ${ajusteTexto.length} chars` : ", ajuste mantido"})`);
}

async function main() {
  console.log(`→ Importando .docx de ${REPO}/${FOLDER}`);
  console.log("");
  for (const [name, slug] of Object.entries(NAME_TO_SLUG)) {
    try {
      await importOne(name, slug);
    } catch (e) {
      console.error(`✗ ${slug}: ${(e as Error).message}`);
    }
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
