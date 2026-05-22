#!/usr/bin/env bun
/**
 * Reconcilia src/data/acordos.generated.ts com o conteúdo real do bucket hub-docs.
 *
 * - Para cada país: lista arquivos do bucket, casa com entradas existentes (fuzzy
 *   por tokens do nome) e atualiza `arquivo` + `tamanho`. Arquivos sem match
 *   viram entradas novas com cat="outro" e nome humanizado.
 * - Adiciona Suíça (que não existia no dataset).
 * - Reescreve o arquivo gerado.
 *
 * Uso: bun scripts/reconcile-hub-docs.ts
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { acordosImportados } from "../src/data/acordos.generated";
import type { AcordoImportado, DocumentoImportado } from "../src/data/acordos.types";

const BUCKET = "hub-docs";

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(s: string): Set<string> {
  return new Set(
    norm(s)
      .split(" ")
      .filter((t) => t.length >= 4),
  );
}

function score(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common++;
  return common / Math.max(ta.size, tb.size);
}

function humanize(filenameNoExt: string): string {
  return filenameNoExt
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bDe\b|\bDo\b|\bDa\b|\bE\b/g, (m) => m.toLowerCase());
}

function categorize(name: string): string {
  const n = norm(name);
  if (/\bdecreto\b/.test(n)) return "principal";
  if (/\bacordo\b|\bconvenc/.test(n)) return "principal";
  if (/\bajuste\b|\bconvenio\b|\bcomplementar\b/.test(n)) return "complementar";
  if (/\bformulario\b|\brequerimento\b|\bsolicitacao\b|\brecurso\b|\bpedido\b/.test(n))
    return "formulario";
  if (/\broteiro\b|\bguia\b|\bcartilha\b|\binstrucao\b/.test(n)) return "roteiro";
  if (/\bcertificado\b|\bdeslocamento\b|\bcobertura\b|\blegislacao aplicavel\b/.test(n))
    return "outro";
  return "outro";
}

function bytesToHuman(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ──────────────────────────── main ────────────────────────────

async function main() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // 1. Listar arquivos do bucket por país
  const { data: pastas, error: e1 } = await supabase.storage.from(BUCKET).list("", { limit: 1000 });
  if (e1) throw e1;
  const slugsNoBucket = (pastas ?? [])
    .filter((f) => f.id === null) // pastas em supabase storage têm id null
    .map((f) => f.name);

  const arquivosPorPais = new Map<string, Array<{ name: string; size: number }>>();
  for (const slug of slugsNoBucket) {
    const { data: files, error } = await supabase.storage.from(BUCKET).list(slug, { limit: 1000 });
    if (error) throw error;
    arquivosPorPais.set(
      slug,
      (files ?? [])
        .filter((f) => f.id !== null)
        .map((f) => ({ name: f.name, size: (f.metadata as any)?.size ?? 0 })),
    );
  }

  // 2. Reconciliar cada país do dataset
  const novoDataset: Record<string, AcordoImportado> = {};
  const log: string[] = [];

  for (const [slug, acordo] of Object.entries(acordosImportados)) {
    const arquivosBucket = arquivosPorPais.get(slug) ?? [];
    const usados = new Set<string>();
    const novosDocs: DocumentoImportado[] = [];

    // 2a. Tentar casar cada entrada do dataset com um arquivo do bucket
    for (const doc of acordo.documentos) {
      let melhor: { name: string; size: number; score: number } | null = null;
      for (const f of arquivosBucket) {
        if (usados.has(f.name)) continue;
        const fnNoExt = f.name.replace(/\.[^.]+$/, "");
        const s = score(doc.nome, fnNoExt);
        if (!melhor || s > melhor.score) melhor = { ...f, score: s };
      }
      if (melhor && melhor.score >= 0.3) {
        usados.add(melhor.name);
        novosDocs.push({
          nome: doc.nome,
          desc: doc.desc,
          cat: doc.cat,
          arquivo: melhor.name,
          tamanho: bytesToHuman(melhor.size),
        });
      } else {
        // Sem match no bucket — preserva entrada mas sem arquivo (UI mostra "Indisponível")
        novosDocs.push({ nome: doc.nome, desc: doc.desc, cat: doc.cat });
      }
    }

    // 2b. Arquivos do bucket não consumidos → entradas novas
    for (const f of arquivosBucket) {
      if (usados.has(f.name)) continue;
      const fnNoExt = f.name.replace(/\.[^.]+$/, "");
      novosDocs.push({
        nome: humanize(fnNoExt),
        cat: categorize(fnNoExt),
        arquivo: f.name,
        tamanho: bytesToHuman(f.size),
      });
    }

    novoDataset[slug] = { ...acordo, documentos: novosDocs };
    const comArquivo = novosDocs.filter((d) => d.arquivo).length;
    log.push(`  ${slug.padEnd(20)} ${comArquivo.toString().padStart(2)}/${novosDocs.length} docs com arquivo`);
  }

  // 3. Adicionar Suíça (não existia no dataset)
  if (arquivosPorPais.has("suica") && !novoDataset["suica"]) {
    const arquivos = arquivosPorPais.get("suica")!;
    novoDataset["suica"] = {
      titulo: "Acordo Brasil-Suíça",
      instrumento: "Acordo de Previdência Social Brasil-Suíça",
      decreto: "Em curadoria",
      vigorDesde: "Em curadoria",
      orgaoBR: {
        titulo: "APSAI / INSS (Brasil)",
        instituicao: "Agência da Previdência Social de Atendimento Acordos Internacionais",
      },
      orgaoParceiro: {
        titulo: "Órgão de Ligação (Suíça)",
        instituicao: "Em curadoria",
      },
      beneficios: { brasil: [], parceiro: [] },
      documentos: arquivos.map((f) => {
        const fnNoExt = f.name.replace(/\.[^.]+$/, "");
        return {
          nome: humanize(fnNoExt),
          cat: categorize(fnNoExt),
          arquivo: f.name,
          tamanho: bytesToHuman(f.size),
        };
      }),
    };
    log.push(`  ${"suica".padEnd(20)} ${arquivos.length.toString().padStart(2)}/${arquivos.length} docs (NOVO)`);
  }

  // 4. Reescrever o arquivo
  const header = `// AUTO-GENERATED por scripts/reconcile-hub-docs.ts
// Não edite à mão. Rode: bun scripts/reconcile-hub-docs.ts
// Fonte: bucket hub-docs (referências) + curadoria manual (metadados).

import type { AcordoImportado } from "./acordos.types";

export const acordosImportados: Record<string, AcordoImportado> = `;

  // Ordenar países alfabeticamente
  const sortedKeys = Object.keys(novoDataset).sort();
  const ordered: Record<string, AcordoImportado> = {};
  for (const k of sortedKeys) ordered[k] = novoDataset[k];

  const body = JSON.stringify(ordered, null, 2);
  writeFileSync("src/data/acordos.generated.ts", header + body + ";\n");

  console.log("Reconciliação concluída:\n");
  for (const line of log) console.log(line);
  console.log(`\nTotal: ${sortedKeys.length} países, arquivo regravado.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
