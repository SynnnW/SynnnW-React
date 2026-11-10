// ─── 26Menfess — Render Kartu Canvas ─────────────────────────────────────────
// Output: PNG 1200×1500. Font dimuat lewat code (fonts.js), bukan gambar.
// Teks di dalam tanda petik "…" (yang sudah ditutup) otomatis italic + font tulisan tangan.
//
// Ekspor: layoutCard, drawCard(canvas, opts, scale), renderCardBlob(opts), cardFilename

import { CARD, safeAreaPx, templateSrc, DESIGN_BG, resolveTextColor, lineHeightOf } from './templateConfig';
import { getFont, QUOTE_FONT, ensureCardFonts } from './fonts';
import { CATEGORIES } from './rules';

// ─── Tokenisasi: kata → potongan (run) biasa / dalam tanda petik ─────────────
const QUOTE_RE = /"[^"\n]*"|\u201C[^\u201D\n]*\u201D/g;

function splitRuns(para) {
  const runs = [];
  let last = 0;
  for (const m of para.matchAll(QUOTE_RE)) {
    if (m.index > last) runs.push({ t: para.slice(last, m.index), q: false });
    runs.push({ t: m[0], q: true });
    last = m.index + m[0].length;
  }
  if (last < para.length) runs.push({ t: para.slice(last), q: false });
  return runs;
}

/** Pecah paragraf jadi "unit kata" (tiap unit = beberapa run tanpa spasi). */
function toUnits(para) {
  const units = [];
  let cur = [];
  for (const run of splitRuns(para)) {
    const parts = run.t.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { if (cur.length) { units.push(cur); cur = []; } }
      else cur.push({ t: part, q: run.q });
    }
  }
  if (cur.length) units.push(cur);
  return units;
}

function fontStr(q, sz, fam, weight) {
  return q ? `italic ${QUOTE_FONT.weight} ${Math.round(sz * QUOTE_FONT.scale)}px ${QUOTE_FONT.family}, cursive`
           : `${weight} ${sz}px ${fam}, sans-serif`;
}
function runW(ctx, r, sz, fam, weight) { ctx.font = fontStr(r.q, sz, fam, weight); return ctx.measureText(r.t).width; }
function unitW(ctx, u, sz, fam, weight) { return u.reduce((a, r) => a + runW(ctx, r, sz, fam, weight), 0); }

/** Pecah unit yang lebih lebar dari maxW per karakter. */
function breakUnit(ctx, u, maxW, sz, fam, weight) {
  const out = []; let cur = []; let w = 0;
  for (const r of u) {
    for (const ch of r.t) {
      const cw = runW(ctx, { t: ch, q: r.q }, sz, fam, weight);
      if (w + cw > maxW && cur.length) { out.push(cur); cur = []; w = 0; }
      const lastRun = cur[cur.length - 1];
      if (lastRun && lastRun.q === r.q) lastRun.t += ch; else cur.push({ t: ch, q: r.q });
      w += cw;
    }
  }
  if (cur.length) out.push(cur);
  return out;
}

function wrapPara(ctx, para, maxW, sz, fam, weight) {
  if (!para.trim()) return [{ units: [], w: 0, last: true }];
  const spaceW = (ctx.font = fontStr(false, sz, fam, weight), ctx.measureText(' ').width);
  const lines = []; let units = []; let w = 0;
  const flush = (last) => { lines.push({ units, w, last }); units = []; w = 0; };
  for (const u0 of toUnits(para)) {
    const pieces = unitW(ctx, u0, sz, fam, weight) > maxW ? breakUnit(ctx, u0, maxW, sz, fam, weight) : [u0];
    pieces.forEach((u, idx) => {
      const uw = unitW(ctx, u, sz, fam, weight);
      const add = units.length ? spaceW + uw : uw;
      if (units.length && w + add > maxW) flush(false);
      w += units.length ? spaceW + uw : uw;
      units.push(u);
      if (idx < pieces.length - 1) flush(false);
    });
  }
  if (units.length) flush(true);
  if (lines.length) lines[lines.length - 1].last = true;
  return lines.map(l => ({ ...l, spaceW }));
}

/** Layout teks: cari font terbesar yang muat, atau pakai size tetap. */
export function layoutCard(ctx, text, areaW, areaH, fixedSize = null, style = {}) {
  const f = getFont(style.font);
  const fam = f.family; const weight = f.weight;
  const lh = lineHeightOf(style.line_space);
  const trySize = (sz) => {
    const lines = text.split('\n').flatMap(p => wrapPara(ctx, p, areaW, sz, fam, weight));
    return { lines, totalH: lines.length * sz * lh, fits: lines.length * sz * lh <= areaH };
  };
  if (fixedSize) {
    let sz = fixedSize; let r = trySize(sz);
    while (!r.fits && sz > 24) { sz = Math.max(24, sz - 2); r = trySize(sz); }
    return { fontPx: sz, lines: r.lines, lineH: sz * lh, shrunk: sz < fixedSize, fam, weight };
  }
  let lo = 36, hi = 96, best = lo, bestLines = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); const r = trySize(mid);
    if (r.fits) { best = mid; bestLines = r.lines; lo = mid + 1; } else hi = mid - 1;
  }
  if (!bestLines.length) bestLines = trySize(best).lines;
  return { fontPx: best, lines: bestLines, lineH: best * lh, shrunk: false, fam, weight };
}

function drawLine(ctx, line, x0, y, areaW, align, sz, fam, weight, color) {
  const { units, spaceW } = line;
  if (!units.length) return;
  const natural = units.reduce((a, u) => a + unitW(ctx, u, sz, fam, weight), 0) + spaceW * (units.length - 1);
  let gap = spaceW; let x = x0;
  if (align === 'right') x = x0 + areaW - natural;
  else if (align === 'center') x = x0 + (areaW - natural) / 2;
  else if (align === 'justify' && !line.last && units.length > 1) gap = spaceW + (areaW - natural) / (units.length - 1);
  ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  for (const u of units) {
    for (const r of u) {
      ctx.font = fontStr(r.q, sz, fam, weight);
      // tulisan tangan sedikit turun supaya sebaris dengan huruf biasa
      const dy = r.q ? -sz * 0.06 : 0;
      ctx.fillText(r.t, x, y + dy);
      x += ctx.measureText(r.t).width;
    }
    x += gap;
  }
}

// ─── Load template ───────────────────────────────────────────────────────────

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ─── drawCard ────────────────────────────────────────────────────────────────

export async function drawCard(canvas, opts, scale = 1) {
  const { body = '', to = '', from = '', design = 'pink', text_size = 'auto', text_color = 'auto',
          align = 'right', title = '', font = 'nunito', line_space = 'normal' } = opts;

  const W = CARD.W * scale;
  const H = CARD.H * scale;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await ensureCardFonts(font);

  // 1. Latar
  if (DESIGN_BG[design]) { ctx.fillStyle = DESIGN_BG[design]; ctx.fillRect(0, 0, W, H); }
  const tmpl = await loadImage(templateSrc(design, scale));
  if (tmpl) {
    ctx.drawImage(tmpl, 0, 0, W, H);
  } else if (!DESIGN_BG[design]) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    const stops = design === 'green'
      ? [['0','#70B88E'],['0.5','#CEDBA3'],['1','#EFECB6']]
      : design === 'picnic'
        ? [['0','#3F6B1E'],['0.5','#7FA05A'],['1','#C9D8A8']]
        : [['0','#D94C95'],['0.5','#ECC8D7'],['1','#F8E6EE']];
    stops.forEach(([o, c]) => grad.addColorStop(Number(o), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  const area = safeAreaPx(design);
  const ax = area.x * scale, ay = area.y * scale, aw = area.w * scale, ah = area.h * scale;
  const color = resolveTextColor(design, text_color);
  const fnt = getFont(font);
  const al = ['left', 'center', 'right', 'justify'].includes(align) ? align : 'right';
  const titleAlign = al === 'justify' ? 'left' : al;

  const pad = 6 * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax - pad, ay - pad, aw + pad * 2, ah + pad * 2);
  ctx.clip();

  // 2. Judul (opsional)
  let curY = ay;
  const titleSz = (CARD.sizes.sm || 56) * scale;
  if (title) {
    ctx.font = `900 ${titleSz}px ${fnt.family}, sans-serif`;
    ctx.fillStyle = color; ctx.textBaseline = 'top'; ctx.textAlign = titleAlign;
    const tx = titleAlign === 'center' ? ax + aw / 2 : titleAlign === 'right' ? ax + aw : ax;
    ctx.fillText(title, tx, curY);
    curY += titleSz * 1.5;
  }
  const bodyAreaH = ah - (curY - ay);

  // 3. Isi
  const fixedSz = text_size !== 'auto' ? (CARD.sizes[text_size] || null) : null;
  const { fontPx, lines, lineH, shrunk, fam, weight } = layoutCard(ctx, body, aw, bodyAreaH, fixedSz ? fixedSz * scale : null, { font, line_space });
  const totalH = lines.length * lineH;
  const startY = curY + (bodyAreaH - totalH) / 2;
  lines.forEach((line, i) => drawLine(ctx, line, ax, startY + i * lineH, aw, al, fontPx, fam, weight, color));
  ctx.restore();

  // 4. Untuk / Dari — ikut rata teks (default kanan, atas sampai bawah)
  const labelSz = Math.round(28 * scale);
  ctx.font = `700 ${labelSz}px ${fnt.family}, sans-serif`;
  ctx.fillStyle = color;
  const toAlign = al === 'right' ? 'right' : al === 'center' ? 'center' : 'left';
  const fromAlign = al === 'center' ? 'center' : 'right';
  const px = (a) => (a === 'right' ? ax + aw : a === 'center' ? ax + aw / 2 : ax);
  if (to) { ctx.textAlign = toAlign; ctx.textBaseline = 'bottom'; ctx.fillText(`Untuk: ${to}`, px(toAlign), ay - 6 * scale); }
  if (from) { ctx.textAlign = fromAlign; ctx.textBaseline = 'bottom'; ctx.fillText(`Dari: ${from || 'Anonim'}`, px(fromAlign), ay + ah + labelSz + 4 * scale); }

  if (shrunk) {
    const noteSz = Math.max(16, 20 * scale);
    ctx.font = `600 ${noteSz}px sans-serif`;
    ctx.fillStyle = 'rgba(120,120,120,0.7)';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText('Teks diperkecil otomatis', ax + aw, ay + ah);
  }
  return { shrunk };
}

// ─── renderCardBlob ───────────────────────────────────────────────────────────

export async function renderCardBlob(opts) {
  // Muat font kartu + font tulisan tangan sebelum render
  await ensureCardFonts(opts.font);

  const canvas = document.createElement('canvas');
  await drawCard(canvas, opts, 1); // scale 1 = 1200×1500

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob gagal')), 'image/png');
  });
}

export function cardFilename(id, design) {
  return `26menfess-${(id || 'xx').slice(0, 8)}-${design}.png`;
}

export function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value;
}
