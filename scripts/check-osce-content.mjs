#!/usr/bin/env node
// scripts/check-osce-content.mjs
// Node murni (tanpa Vite). Memuat semua src/data/quiziz/osce/kasus/*.md,
// menjalankan parser yang sama dengan runtime (parseCase.js), dan gagal
// (exit 1) bila: ID kasus duplikat, kasus tanpa fase, atau skrip berisi
// peran tak dikenal (selain PERAWAT/LAWAN).

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import TIPE_MANIFEST, { getTipeMeta } from '../src/data/quiziz/osce/tipeManifest.js';
import { parseCaseFile } from '../src/data/quiziz/osce/parseCase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KASUS_DIR = path.join(__dirname, '..', 'src', 'data', 'quiziz', 'osce', 'kasus');

function main() {
  let files = [];
  try {
    files = readdirSync(KASUS_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    console.error(`[check:osce] Folder tidak ditemukan: ${KASUS_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error('[check:osce] Tidak ada file .md di folder kasus. Tidak ada yang diperiksa.');
    process.exit(1);
  }

  const seenIds = new Map(); // id -> file
  const perTipeCount = new Map();
  let hardErrors = [];
  let softWarnings = [];

  for (const file of files) {
    const tipeId = file.replace(/\.md$/, '');
    const tipeMeta = getTipeMeta(tipeId);
    if (!tipeMeta) {
      hardErrors.push(`File "${file}" tidak cocok dengan tipe manapun di tipeManifest.js.`);
      continue;
    }
    const raw = readFileSync(path.join(KASUS_DIR, file), 'utf8');
    const localWarnings = [];
    const cases = parseCaseFile(raw, tipeMeta, (msg) => localWarnings.push(msg));

    for (const msg of localWarnings) {
      if (msg.includes('UNKNOWN_ROLE') || msg.includes('tidak ada fase')) {
        hardErrors.push(`[${file}] ${msg}`);
      } else {
        softWarnings.push(`[${file}] ${msg}`);
      }
    }

    for (const c of cases) {
      if (seenIds.has(c.id)) {
        hardErrors.push(`ID kasus duplikat "${c.id}" (di "${file}", sebelumnya di "${seenIds.get(c.id)}").`);
        continue;
      }
      seenIds.set(c.id, file);
      if (!c.phases || c.phases.length === 0) {
        hardErrors.push(`Kasus "${c.id}" (${file}) tidak punya fase.`);
      }
      perTipeCount.set(tipeMeta.id, (perTipeCount.get(tipeMeta.id) || 0) + 1);
    }
  }

  console.log('[check:osce] Jumlah kasus per tipe:');
  for (const t of TIPE_MANIFEST) {
    console.log(`  - ${t.label} (${t.id}): ${perTipeCount.get(t.id) || 0} kasus`);
  }
  console.log(`[check:osce] Total kasus valid: ${seenIds.size}`);

  if (softWarnings.length) {
    console.log(`\n[check:osce] Peringatan non-fatal (${softWarnings.length}):`);
    for (const w of softWarnings) console.log(`  ! ${w}`);
  }

  if (hardErrors.length) {
    console.error(`\n[check:osce] GAGAL — ${hardErrors.length} error:`);
    for (const e of hardErrors) console.error(`  x ${e}`);
    process.exit(1);
  }

  console.log('\n[check:osce] Lulus.');
}

main();
