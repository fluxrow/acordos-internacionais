#!/usr/bin/env bun
/**
 * CI guard: falha o build se restarem referências ao nome antigo
 * da marca ("Acordo Internacional" no singular ou o domínio antigo
 * "acordo-internacional.lovable.app") em rotas, componentes, dados,
 * JSON-LD ou arquivos públicos.
 *
 * O nome correto é "Acordos Internacionais" (plural) e o domínio
 * canônico é "acordosinternacionais.lovable.app".
 *
 * Uso: bun scripts/check-brand.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dir, "..");

// Diretórios varridos
const SCAN_DIRS = ["src", "public", "scripts", ".github"];

// Arquivos/dirs ignorados
const IGNORE_SEGMENTS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".output",
  ".vinxi",
  ".tanstack",
  ".wrangler",
  ".cache",
]);

// Extensões de texto que devem ser inspecionadas
const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".html", ".md", ".mdx",
  ".css", ".scss",
  ".yml", ".yaml",
  ".txt", ".xml", ".svg",
  ".sh",
]);

// Não escanear o próprio script (contém os padrões por definição)
const SELF = resolve(import.meta.path);

type Hit = { file: string; line: number; text: string; pattern: string };

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  {
    name: 'domínio antigo "acordo-internacional.lovable.app"',
    re: /acordo-internacional\.lovable\.app/i,
  },
  {
    // Qualquer slug/caminho/parâmetro contendo "acordo-internacional"
    // (singular, com hífen) — ex.: /acordo-internacional, og/acordo-internacional.jpg,
    // ?ref=acordo-internacional, "slug": "acordo-internacional", etc.
    name: 'slug/caminho antigo "acordo-internacional"',
    re: /acordo-internacional/i,
  },
  {
    // Variações comuns por erro de digitação ou colagem antiga
    // ("acorde-internacional", "acordo_internacional", "acordointernacional").
    name: 'variação antiga do slug (acorde-/acordo_/acordointernacional)',
    re: /\b(?:acorde[-_]internacional|acordo_internacional|acordointernacional)\b/i,
  },
  {
    // Captura "Acordo Internacional" no singular como nome próprio
    // (com inicial maiúscula em ambas as palavras), evitando frases
    // técnicas como "um acordo internacional bilateral".
    name: 'marca antiga "Acordo Internacional" (singular)',
    re: /\bAcordo\s+Internacional\b(?!is)/,
  },
];


function* walk(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (IGNORE_SEGMENTS.has(name)) continue;
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      yield* walk(p);
    } else if (st.isFile()) {
      yield p;
    }
  }
}

const hits: Hit[] = [];

for (const base of SCAN_DIRS) {
  const abs = resolve(ROOT, base);
  for (const file of walk(abs)) {
    if (file === SELF) continue;
    const ext = file.slice(file.lastIndexOf("."));
    if (!TEXT_EXT.has(ext)) continue;

    let content: string;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { name, re } of PATTERNS) {
        if (re.test(line)) {
          hits.push({
            file: relative(ROOT, file).split(sep).join("/"),
            line: i + 1,
            text: line.trim().slice(0, 200),
            pattern: name,
          });
        }
      }
    }
  }
}

if (hits.length) {
  console.error(`\n✗ Brand guard: ${hits.length} ocorrência(s) de marca antiga encontrada(s):\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.pattern}]`);
    console.error(`    ${h.text}`);
  }
  console.error(
    `\nUse "Acordos Internacionais" (plural) e o domínio "acordosinternacionais.lovable.app".`,
  );
  process.exit(1);
}

console.log("✓ Brand guard: nenhuma referência à marca antiga encontrada.");
