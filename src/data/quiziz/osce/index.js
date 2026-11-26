// src/data/quiziz/osce/index.js
import TIPE_MANIFEST, { getTipeMeta } from './tipeManifest.js';
import { parseCaseFile } from './parseCase.js';

// Lazy: hanya .md yang diakses yang diunduh browser.
const modules = import.meta.glob('./kasus/*.md', { query: '?raw', import: 'default' });

let cache = null; // Promise<Map<caseId, caseObj>>
let warnings = [];

function fileTipeId(path) {
  const m = path.match(/\.\/kasus\/([^/]+)\.md$/);
  return m ? m[1] : null;
}

async function buildCache() {
  const map = new Map();
  warnings = [];
  const entries = Object.entries(modules);
  for (const [path, loader] of entries) {
    const tipeId = fileTipeId(path);
    const tipeMeta = getTipeMeta(tipeId);
    if (!tipeMeta) {
      warnings.push(`File "${path}" diabaikan: tidak ada tipe "${tipeId}" di tipeManifest.js.`);
      continue;
    }
    let raw;
    try {
      raw = await loader();
    } catch (err) {
      warnings.push(`Gagal memuat "${path}": ${err?.message || err}`);
      continue;
    }
    const cases = parseCaseFile(raw, tipeMeta, (msg) => warnings.push(`[${path}] ${msg}`));
    for (const c of cases) {
      if (map.has(c.id)) {
        warnings.push(`ID kasus duplikat "${c.id}" di "${path}" — kasus ini dilewati.`);
        continue;
      }
      map.set(c.id, c);
    }
  }
  if (warnings.length && typeof console !== 'undefined' && import.meta.env?.DEV) {
    console.warn('[osce] peringatan konten:\n' + warnings.join('\n'));
  }
  return map;
}

function getCache() {
  if (!cache) cache = buildCache();
  return cache;
}

export async function loadAllCases() {
  const map = await getCache();
  return Array.from(map.values());
}

export async function loadCase(id) {
  const map = await getCache();
  return map.get(id) || null;
}

export async function listTipe() {
  const all = await loadAllCases();
  const counts = new Map();
  for (const c of all) counts.set(c.tipe.id, (counts.get(c.tipe.id) || 0) + 1);
  return TIPE_MANIFEST
    .filter((t) => counts.has(t.id))
    .map((t) => ({ ...t, count: counts.get(t.id) }));
}

export async function loadCasesByTipe(tipeId) {
  const all = await loadAllCases();
  return all.filter((c) => c.tipe.id === tipeId);
}

export function getContentWarnings() {
  return warnings;
}

export { TIPE_MANIFEST, getTipeMeta };
