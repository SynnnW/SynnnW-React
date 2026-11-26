// src/data/quiziz/osce/parseCase.js
//
// Parser murni (tanpa dependency) untuk file .md studi kasus OSCE.
// Dipakai dari browser (index.js, lewat import.meta.glob) MAUPUN dari Node
// (scripts/check-osce-content.mjs) — jadi file ini TIDAK boleh menyentuh
// import.meta.glob, window, atau API browser lain.
//
// Format satu file (boleh berisi banyak kasus, dipisah baris "==="):
//
//   +++
//   id: klien-contoh
//   title: Judul Kasus
//   level: dasar
//   duration: 12
//   tags: individu, edukasi
//   +++
//
//   ## Setting
//   ...
//
//   ## Peran: Perawat
//   ...
//
//   ## Peran: <Label lawan bicara>
//   ...
//
//   ## Fase: <Judul fase>
//   ### Panduan
//   ...
//   ### Hafalkan
//   - butir 1
//   - butir 2
//   ### Skrip
//   PERAWAT: ...
//   LAWAN: ... [teknik: ...]
//
//   ## Checklist
//   - butir
//
//   ## Kunci Jawaban
//   ...
//
//   ## Kesalahan Umum
//   - butir
//
//   ## Konteks
//   ...
//
//   ===
//   (kasus berikutnya)

const CASE_SEPARATOR_RE = /^={3,}\s*$/m;

export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function splitByHeading(md, hashCount) {
  const hashes = '#'.repeat(hashCount);
  const re = new RegExp(`^${hashes}\\s+(.+?)\\s*$`, 'gm');
  const marks = [];
  let m;
  while ((m = re.exec(md))) {
    marks.push({ title: m[1].trim(), start: m.index, contentStart: m.index + m[0].length });
  }
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].contentStart;
    const end = i + 1 < marks.length ? marks[i + 1].start : md.length;
    out.push({ title: marks[i].title, body: md.slice(start, end).trim() });
  }
  return out;
}

function parseFrontmatter(block) {
  const fmMatch = block.match(/^\s*\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n?/);
  if (!fmMatch) return { meta: {}, rest: block };
  const meta = {};
  for (const line of fmMatch[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    meta[key] = value;
  }
  const rest = block.slice(fmMatch[0].length);
  return { meta, rest };
}

function parseBulletList(body) {
  if (!body) return [];
  return body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

const SCRIPT_LINE_RE = /^(PERAWAT|LAWAN)\s*:\s*(.+)$/;
const UNKNOWN_ROLE_LINE_RE = /^([A-ZÀ-Ý][A-ZÀ-Ý\s/]{1,30})\s*:\s*(.+)$/;
const TECHNIQUE_RE = /\[\s*teknik\s*:\s*([^\]]+)\]\s*$/i;

function parseScript(body, onWarn) {
  const warn = onWarn || (() => {});
  if (!body) return [];
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    const m = line.match(SCRIPT_LINE_RE);
    if (!m) {
      const unknown = line.match(UNKNOWN_ROLE_LINE_RE);
      if (unknown) {
        warn(`UNKNOWN_ROLE peran skrip tidak dikenal "${unknown[1].trim()}" (hanya PERAWAT/LAWAN yang didukung): "${line}"`);
      }
      continue;
    }
    const role = m[1] === 'PERAWAT' ? 'perawat' : 'lawan';
    let text = m[2].trim();
    let technique;
    const tMatch = text.match(TECHNIQUE_RE);
    if (tMatch) {
      technique = tMatch[1].trim();
      text = text.slice(0, tMatch.index).trim();
    }
    out.push(technique ? { role, text, technique } : { role, text });
  }
  return out;
}

const TITLE_ABBREV_RE = /\b(Ny|Tn|Sdr|Sdri|Bpk|Dr|Prof|No|Jl|dr)\./gi;

function firstSentence(text) {
  if (!text) return '';
  let plain = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
  // Lindungi gelar/sapaan umum supaya titiknya tidak dianggap akhir kalimat.
  plain = plain.replace(TITLE_ABBREV_RE, (full, word) => `${word}∎`);
  const m = plain.match(/^(.+?[.!?])(\s|$)/);
  const result = (m ? m[1] : plain).slice(0, 180);
  return result.replace(/∎/g, '.');
}

/**
 * Parse satu blok kasus (tanpa separator) menjadi objek ternormalisasi.
 * @param {string} block - teks satu kasus
 * @param {{id: string, label: string}} tipeMeta
 * @param {(msg: string) => void} [onWarn]
 * @returns {object|null}
 */
export function parseCaseBlock(block, tipeMeta, onWarn) {
  const warn = onWarn || (() => {});
  const trimmed = block.trim();
  if (!trimmed) return null;

  const { meta, rest } = parseFrontmatter(trimmed);
  const title = (meta.title || '').trim();
  if (!title) {
    warn(`Kasus dilewati: tidak ada "title" di frontmatter. Cuplikan: ${trimmed.slice(0, 60)}`);
    return null;
  }

  const id = slugify(meta.id || `${tipeMeta.id}-${title}`);
  if (!id) {
    warn(`Kasus "${title}" dilewati: gagal membuat id.`);
    return null;
  }

  const top = splitByHeading(rest, 2);
  const sections = {};
  const phases = [];
  for (const sec of top) {
    const key = sec.title.toLowerCase();
    if (key === 'setting') {
      sections.setting = sec.body;
    } else if (key.startsWith('peran:')) {
      const label = sec.title.slice(sec.title.indexOf(':') + 1).trim();
      if (/^perawat$/i.test(label)) {
        sections.perawat = { title: label, body: sec.body };
      } else {
        sections.lawan = { title: label, body: sec.body };
      }
    } else if (key.startsWith('fase:')) {
      const phaseTitle = sec.title.slice(sec.title.indexOf(':') + 1).trim();
      const sub = splitByHeading(sec.body, 3);
      const phase = { key: slugify(phaseTitle) || `fase-${phases.length + 1}`, title: phaseTitle };
      for (const s of sub) {
        const sk = s.title.toLowerCase();
        if (sk === 'panduan') phase.guide = s.body;
        else if (sk === 'hafalkan') phase.memorize = parseBulletList(s.body);
        else if (sk === 'skrip') {
          phase.script = parseScript(s.body, (msg) => warn(`Kasus "${title}" fase "${phaseTitle}": ${msg}`));
        }
      }
      if (!phase.guide && !phase.script) {
        warn(`Kasus "${title}" fase "${phaseTitle}": tidak ada Panduan maupun Skrip.`);
      }
      phases.push(phase);
    } else if (key === 'checklist') {
      sections.checklist = parseBulletList(sec.body);
    } else if (key === 'kunci jawaban') {
      sections.answerKey = sec.body;
    } else if (key === 'kesalahan umum') {
      sections.commonMistakes = parseBulletList(sec.body);
    } else if (key === 'konteks') {
      sections.context = sec.body;
    } else {
      warn(`Kasus "${title}": heading tidak dikenal "${sec.title}" diabaikan.`);
    }
  }

  if (phases.length === 0) {
    warn(`Kasus "${title}" dilewati: tidak ada fase ("## Fase: ...").`);
    return null;
  }
  if (!sections.perawat) {
    warn(`Kasus "${title}": tidak ada kartu peran Perawat.`);
  }
  if (!sections.lawan) {
    warn(`Kasus "${title}": tidak ada kartu peran lawan bicara.`);
  }

  const durationMin = meta.duration ? Number.parseInt(meta.duration, 10) : undefined;
  const tags = meta.tags
    ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined;

  return {
    id,
    tipe: { id: tipeMeta.id, label: tipeMeta.label },
    title,
    summary: (meta.summary || firstSentence(sections.setting)) || '',
    level: meta.level || undefined,
    durationMin: Number.isFinite(durationMin) ? durationMin : undefined,
    tags,
    setting: sections.setting || '',
    roles: {
      perawat: sections.perawat || { title: 'Perawat', body: '' },
      lawan: sections.lawan || { title: 'Lawan bicara', body: '' },
    },
    phases,
    checklist: sections.checklist || [],
    answerKey: sections.answerKey || '',
    commonMistakes: sections.commonMistakes || [],
    context: sections.context || '',
  };
}

/**
 * Parse seluruh isi satu file .md (bisa berisi banyak kasus).
 * @param {string} raw
 * @param {{id: string, label: string}} tipeMeta
 * @param {(msg: string) => void} [onWarn]
 * @returns {object[]}
 */
export function parseCaseFile(raw, tipeMeta, onWarn) {
  const blocks = String(raw || '').split(CASE_SEPARATOR_RE);
  const out = [];
  for (const block of blocks) {
    const parsed = parseCaseBlock(block, tipeMeta, onWarn);
    if (parsed) out.push(parsed);
  }
  return out;
}
