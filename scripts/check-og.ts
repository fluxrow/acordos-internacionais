#!/usr/bin/env bun
/**
 * CI guard: garante que cada país com bandeira (iso) tem a OG image
 * pré-renderizada em public/og/{slug}.jpg, que países sem iso caem
 * no fallback /og-image.jpg, e que a rota /acordos/$pais aponta os
 * metadados og/twitter para esses arquivos.
 *
 * Uso: bun scripts/check-og.ts
 * Sai com código 1 se houver problema.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { acordos } from "../src/data/acordos";

const ROOT = resolve(import.meta.dir, "..");
const errors: string[] = [];
const warnings: string[] = [];

// 1. Fallback global existe
const FALLBACK = resolve(ROOT, "public/og-image.jpg");
if (!existsSync(FALLBACK)) {
  errors.push("public/og-image.jpg (fallback) não encontrado");
}

// 2. Toda OG image por país existe e tem tamanho razoável
for (const a of acordos) {
  if (!a.iso) continue; // multilaterais usam fallback
  const p = resolve(ROOT, `public/og/${a.slug}.jpg`);
  if (!existsSync(p)) {
    errors.push(`OG image ausente para "${a.slug}" (esperado public/og/${a.slug}.jpg)`);
    continue;
  }
  const size = statSync(p).size;
  if (size < 5_000) {
    errors.push(`OG image suspeita (${size} bytes) em public/og/${a.slug}.jpg`);
  } else if (size > 500_000) {
    warnings.push(`OG image grande (${(size / 1024).toFixed(0)} KB) em public/og/${a.slug}.jpg`);
  }
}

// 3. A rota usa o caminho correto e emite og:image + twitter:image
const route = readFileSync(resolve(ROOT, "src/routes/acordos.$pais.tsx"), "utf8");
const checks: Array<[RegExp, string]> = [
  [/\/og\/\$\{a\.slug\}\.jpg/, "rota não monta og:image como /og/${a.slug}.jpg"],
  [/property:\s*["']og:image["']/, "rota não emite property og:image"],
  [/property:\s*["']og:image:width["']/, "rota não declara og:image:width"],
  [/property:\s*["']og:image:height["']/, "rota não declara og:image:height"],
  [/name:\s*["']twitter:image["']/, "rota não emite name twitter:image"],
  [/rel:\s*["']canonical["']/, "rota não emite link canonical"],
  [/acordo-internacional\.lovable\.app/, "rota não usa o domínio canônico"],
];
for (const [re, msg] of checks) {
  if (!re.test(route)) errors.push(msg);
}

// 4. Relatório
const totalCountries = acordos.filter((a) => a.iso).length;
console.log(`Verificadas ${totalCountries} OG images por país + fallback.`);
for (const w of warnings) console.warn(`⚠  ${w}`);
if (errors.length) {
  console.error(`\n✗ Falhou com ${errors.length} erro(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("✓ Todos os metadados OG/Twitter estão consistentes.");
