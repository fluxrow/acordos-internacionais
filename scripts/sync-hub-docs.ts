#!/usr/bin/env bun
/**
 * Sincroniza PDFs/DOCs do repo público marcosespinola1379/Mapa-de-Acordos
 * para o bucket privado `hub-docs` no Supabase.
 *
 * Idempotente — pode ser rodado quantas vezes precisar.
 *
 * Uso:
 *   bun scripts/sync-hub-docs.ts                  # importa tudo
 *   bun scripts/sync-hub-docs.ts --dry            # só lista o que faria
 *   bun scripts/sync-hub-docs.ts --pais alemanha  # só um país (debug)
 *
 * Env necessário: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

// ──────────────────────────── config ────────────────────────────

const REPO = "marcosespinola1379/Mapa-de-Acordos";
const BRANCH = "main";
const TREE_URL = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const BUCKET = "hub-docs";

// GitHub folder → nosso slug.
const FOLDER_TO_SLUG: Record<string, string> = {
  alemanha: "alemanha",
  austria: "austria",
  belgica: "belgica",
  bulgaria: "bulgaria",
  canada: "canada",
  chile: "chile",
  coreia: "coreia-do-sul",
  espanha: "espanha",
  "estados-unidos": "estados-unidos",
  grecia: "grecia",
  india: "india",
  italia: "italia",
  japao: "japao",
  luxemburgo: "luxemburgo",
  mercosul: "mercosul",
  mocambique: "mocambique",
  portugal: "portugal",
  quebec: "quebec",
  "republica-tcheca": "republica-tcheca",
  suica: "suica",
};

// Arquivos soltos na raiz do repo → mapeamos manualmente para um país.
// Se já houver duplicata na pasta do país, vamos pular (controlado por nome slugificado igual).
const ROOT_FILE_MAP: Record<string, string> = {
  "Acordo Brasil - Bélgica (2009).pdf": "belgica",
  "Acordo de Previdência Social Brasil-Israel.pdf": "israel",
  "Convenção Multilateral de Segurança Social - CPLP.pdf": "cplp",
};

const DOC_EXT = /\.(pdf|doc|docx)$/i;

// ──────────────────────────── flags ────────────────────────────

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const onlyIdx = args.indexOf("--pais");
const ONLY_PAIS = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

// ──────────────────────────── helpers ────────────────────────────

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

function contentTypeFor(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".doc")) return "application/msword";
  return "application/octet-stream";
}

async function fetchTree(): Promise<Array<{ path: string; type: string }>> {
  const res = await fetch(TREE_URL);
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { tree: Array<{ path: string; type: string }> };
  return json.tree;
}

// ──────────────────────────── main ────────────────────────────

type Plan = {
  source: string; // GitHub path
  slug: string; // nosso slug de país
  target: string; // path final no bucket: <slug>/<filename>
  filename: string; // só o filename slugificado
};

async function buildPlan(): Promise<{ plan: Plan[]; skipped: string[]; missing: string[] }> {
  const tree = await fetchTree();
  const docs = tree.filter((t) => t.type === "blob" && DOC_EXT.test(t.path));

  const seen = new Set<string>(); // chave: `${slug}/${filename}`
  const plan: Plan[] = [];
  const skipped: string[] = [];

  for (const t of docs) {
    const parts = t.path.split("/");
    let slug: string | null = null;
    let originalName: string;

    if (parts.length === 1) {
      // arquivo na raiz
      const mapped = ROOT_FILE_MAP[parts[0]];
      if (!mapped) {
        skipped.push(`raiz/${parts[0]} (sem mapeamento)`);
        continue;
      }
      slug = mapped;
      originalName = parts[0];
    } else {
      slug = FOLDER_TO_SLUG[parts[0]] ?? null;
      if (!slug) {
        skipped.push(`${t.path} (pasta sem mapeamento)`);
        continue;
      }
      originalName = parts.slice(1).join("/"); // se tiver subpasta vira parte do nome
    }

    if (ONLY_PAIS && slug !== ONLY_PAIS) continue;

    let filename = slugify(originalName.split("/").pop()!);
    let key = `${slug}/${filename}`;

    // dedup: se já planejado, sufixar -2, -3
    let n = 2;
    while (seen.has(key)) {
      const dot = filename.lastIndexOf(".");
      const base = dot > 0 ? filename.slice(0, dot) : filename;
      const ext = dot > 0 ? filename.slice(dot) : "";
      filename = `${base}-${n}${ext}`;
      key = `${slug}/${filename}`;
      n++;
    }
    seen.add(key);

    plan.push({ source: t.path, slug, target: key, filename });
  }

  // Países do nosso dataset que não aparecem em nenhuma entrada do plano
  const planSlugs = new Set(plan.map((p) => p.slug));
  const ALL_SLUGS = [
    "alemanha", "austria", "belgica", "bulgaria", "cabo-verde", "canada",
    "chile", "coreia-do-sul", "cplp", "espanha", "estados-unidos", "franca",
    "grecia", "iberoamericano", "india", "israel", "italia", "japao",
    "luxemburgo", "mercosul", "mocambique", "portugal", "quebec",
    "republica-tcheca", "suica",
  ];
  const missing = ALL_SLUGS.filter((s) => !planSlugs.has(s));

  return { plan, skipped, missing };
}

async function uploadOne(
  supabase: ReturnType<typeof createClient>,
  p: Plan,
): Promise<{ ok: boolean; error?: string }> {
  const url = `${RAW_BASE}/${p.source.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url);
  if (!res.ok) return { ok: false, error: `download ${res.status}` };
  const buf = new Uint8Array(await res.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(p.target, buf, {
    upsert: true,
    contentType: contentTypeFor(p.filename),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function main() {
  console.log(`→ Listando árvore do repo ${REPO}@${BRANCH}…`);
  const { plan, skipped, missing } = await buildPlan();

  console.log("");
  console.log(`Plano: ${plan.length} uploads`);

  // resumo por país
  const byPais = new Map<string, number>();
  for (const p of plan) byPais.set(p.slug, (byPais.get(p.slug) ?? 0) + 1);
  for (const [slug, count] of [...byPais.entries()].sort()) {
    console.log(`  ${count.toString().padStart(3)}  ${slug}`);
  }

  if (skipped.length) {
    console.log("");
    console.log(`Pulados: ${skipped.length}`);
    for (const s of skipped) console.log(`  ${s}`);
  }
  if (missing.length) {
    console.log("");
    console.log(`Sem material no repo (badge "Em curadoria"): ${missing.length}`);
    for (const s of missing) console.log(`  ${s}`);
  }

  if (DRY) {
    console.log("\n--dry: nada foi enviado.");
    writeFileSync(
      "scripts/sync-hub-docs.report.json",
      JSON.stringify({ dry: true, planSize: plan.length, byPais: Object.fromEntries(byPais), skipped, missing }, null, 2),
    );
    return;
  }

  // upload real, paralelo em batches de 10
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`\n→ Subindo ${plan.length} arquivos para bucket ${BUCKET}…\n`);
  const uploaded: string[] = [];
  const errors: Array<{ target: string; error: string }> = [];

  const BATCH = 10;
  for (let i = 0; i < plan.length; i += BATCH) {
    const slice = plan.slice(i, i + BATCH);
    const results = await Promise.all(slice.map((p) => uploadOne(supabase, p).then((r) => ({ p, r }))));
    for (const { p, r } of results) {
      if (r.ok) {
        uploaded.push(p.target);
        process.stdout.write(".");
      } else {
        errors.push({ target: p.target, error: r.error ?? "?" });
        process.stdout.write("x");
      }
    }
  }
  process.stdout.write("\n");

  console.log(`\nResumo:`);
  console.log(`  uploaded: ${uploaded.length}`);
  console.log(`  errors:   ${errors.length}`);
  if (errors.length) {
    for (const e of errors.slice(0, 20)) console.log(`    ✗ ${e.target} — ${e.error}`);
  }

  writeFileSync(
    "scripts/sync-hub-docs.report.json",
    JSON.stringify(
      { dry: false, planSize: plan.length, uploaded: uploaded.length, errors, skipped, missing, byPais: Object.fromEntries(byPais) },
      null,
      2,
    ),
  );
  console.log("\nRelatório: scripts/sync-hub-docs.report.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
