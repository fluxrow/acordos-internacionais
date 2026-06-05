#!/usr/bin/env bun
/**
 * Verifica se TODO documento listado em src/data/acordos.generated.ts existe
 * de fato no bucket privado `hub-docs`. Compara pelo nome slugificado e, em
 * caso de divergência, tenta achar por base normalizada (acentos/case).
 *
 * Saída:
 *   - tabela por país com ✓ / ✗
 *   - relatório final com totais
 *   - exit code 1 se houver qualquer arquivo faltando (para usar em CI)
 *
 * Uso:
 *   bun scripts/check-hub-docs.ts                 # checa tudo
 *   bun scripts/check-hub-docs.ts --pais alemanha # só um país
 *   bun scripts/check-hub-docs.ts --json          # saída JSON p/ pipeline
 *
 * Env necessário: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { acordosImportados } from "../src/data/acordos.generated";

const BUCKET = "hub-docs";

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--pais");
const ONLY_PAIS = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const JSON_OUT = args.includes("--json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE) {
  console.error("✗ Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(2);
}
const supabase = createClient(SUPABASE_URL, SERVICE);

function slugify(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const slug = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug + ext;
}

function normalizeKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "");
}

type Resultado = {
  pais: string;
  total: number;
  ok: number;
  missing: Array<{ nome: string; arquivo: string; resolvedAs?: string }>;
};

async function listBucket(pais: string): Promise<string[]> {
  const all: string[] = [];
  let offset = 0;
  const PAGE = 100;
  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(pais, { limit: PAGE, offset });
    if (error) {
      throw new Error(`list(${pais}): ${error.message}`);
    }
    if (!data || data.length === 0) break;
    for (const f of data) if (f.name) all.push(f.name);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

async function checkPais(pais: string): Promise<Resultado> {
  const acordo = acordosImportados[pais];
  const docs = acordo?.documentos ?? [];
  const result: Resultado = { pais, total: docs.length, ok: 0, missing: [] };
  if (docs.length === 0) return result;

  const stored = await listBucket(pais);
  const byExact = new Set(stored);
  const byNormalized = new Map<string, string>();
  for (const s of stored) byNormalized.set(normalizeKey(s), s);

  for (const doc of docs) {
    const arquivo = doc.arquivo ?? "";
    if (!arquivo) continue;
    const slug = slugify(arquivo);
    if (byExact.has(slug)) {
      result.ok += 1;
      continue;
    }
    const fuzzy = byNormalized.get(normalizeKey(arquivo));
    if (fuzzy) {
      result.ok += 1;
      result.missing.push({ nome: doc.nome, arquivo, resolvedAs: fuzzy });
      continue;
    }
    result.missing.push({ nome: doc.nome, arquivo });
  }
  return result;
}

async function main() {
  const paises = ONLY_PAIS ? [ONLY_PAIS] : Object.keys(acordosImportados);
  const results: Resultado[] = [];
  for (const pais of paises) {
    try {
      results.push(await checkPais(pais));
    } catch (err) {
      console.error(`✗ ${pais}: ${(err as Error).message}`);
      results.push({ pais, total: 0, ok: 0, missing: [] });
    }
  }

  const totalDocs = results.reduce((a, r) => a + r.total, 0);
  const totalOk = results.reduce((a, r) => a + r.ok, 0);
  const hardMissing = results.flatMap((r) =>
    r.missing.filter((m) => !m.resolvedAs).map((m) => ({ pais: r.pais, ...m })),
  );
  const fuzzyMatches = results.flatMap((r) =>
    r.missing.filter((m) => m.resolvedAs).map((m) => ({ pais: r.pais, ...m })),
  );

  if (JSON_OUT) {
    console.log(
      JSON.stringify({ totalDocs, totalOk, hardMissing, fuzzyMatches }, null, 2),
    );
  } else {
    for (const r of results) {
      const status = r.missing.filter((m) => !m.resolvedAs).length === 0 ? "✓" : "✗";
      console.log(`${status} ${r.pais.padEnd(22)} ${r.ok}/${r.total}`);
      for (const m of r.missing) {
        if (m.resolvedAs) {
          console.log(`   ~ ${m.nome}\n       esperado: ${slugify(m.arquivo)}\n       no bucket: ${m.resolvedAs}`);
        } else {
          console.log(`   ✗ ${m.nome}\n       arquivo:  ${m.arquivo}\n       esperado: ${slugify(m.arquivo)}`);
        }
      }
    }
    console.log("");
    console.log(`Total: ${totalOk}/${totalDocs} encontrados`);
    if (fuzzyMatches.length) {
      console.log(`⚠ ${fuzzyMatches.length} casados por fallback fuzzy — atualize acordos.generated.ts ou renomeie no bucket`);
    }
    if (hardMissing.length) {
      console.log(`✗ ${hardMissing.length} ausentes — rode \`bun scripts/sync-hub-docs.ts\``);
    }
  }

  process.exit(hardMissing.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
