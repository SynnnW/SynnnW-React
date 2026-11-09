// ─── 26Menfess — Render Kartu Canvas ─────────────────────────────────────────
// Output: PNG 1200×1500 (4× preview 300×375).
// Template: SVG vektor same-origin → aman untuk canvas.toBlob.
// Font: Nunito 800 — WAJIB await document.fonts.load sebelum render.
//
// Ekspor utama:
//   layoutCard(ctx, text, areaW, areaH, fontSize?)  → { fontPx, lines, lineH }
//   drawCard(canvas, opts, scale=1)                 → Promise<void>
//   renderCardBlob(opts)                             → Promise<Blob>
//   cardFilename(id, design)                         → string

import { CARD, safeAreaPx, TEMPLATE_PATH, FALLBACK_GRADIENT, CARD_TEXT_COLOR } from './templateConfig';
import { CATEGORIES } from './rules';

// ─── Utility ─────────────────────────────────────────────────────────────────

function wrapLine(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    // Pecah kata yang lebih lebar dari maxWidth
    if (ctx.measureText(word).width > maxWidth) {
      if (cur) { lines.push(cur.trim()); cur = ''; }
      let chunk = '';
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width > maxWidth) {
          if (chunk) lines.push(chunk);
          chunk = ch;
        } else { chunk += ch; }
      }
      cur = chunk + ' ';
    } else {
      const test = cur + word + ' ';
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur.trim()); cur = word + ' ';
      } else { cur = test; }
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function wrapText(ctx, text, maxWidth) {
  return text.split('\n').flatMap(para => {
    if (!para.trim()) return [''];
    return wrapLine(ctx, para, maxWidth);
  });
}

/** Layout teks: cari font terbesar yang muat, atau pakai size tetap. */
export function layoutCard(ctx, text, areaW, areaH, fixedSize = null) {
  const { fontFamily, fontWeight } = CARD;
  const trySize = (sz) => {
    ctx.font = `${fontWeight} ${sz}px ${fontFamily}`;
    const lines = wrapText(ctx, text, areaW);
    const totalH = lines.length * sz * CARD.lineHeight;
    return { lines, totalH, fits: totalH <= areaH };
  };

  if (fixedSize) {
    // Size manual: cari sampai muat, kecil terus kalau tidak
    let sz = fixedSize;
    let result = trySize(sz);
    while (!result.fits && sz > 24) {
      sz = Math.max(24, sz - 2);
      result = trySize(sz);
    }
    return { fontPx: sz, lines: result.lines, lineH: sz * CARD.lineHeight,
             shrunk: sz < fixedSize };
  }

  // Auto: binary search 36–96px
  let lo = 36, hi = 96, best = lo, bestLines = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const r = trySize(mid);
    if (r.fits) { best = mid; bestLines = r.lines; lo = mid + 1; }
    else { hi = mid - 1; }
  }
  if (!bestLines.length) bestLines = trySize(best).lines;
  return { fontPx: best, lines: bestLines, lineH: best * CARD.lineHeight, shrunk: false };
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

/**
 * Gambar kartu ke canvas yang sudah disiapkan.
 * scale: 1 = 1200×1500, 0.25 = 300×375 (preview)
 */
export async function drawCard(canvas, opts, scale = 1) {
  const { body = '', to = '', from = '', category = 'curhat',
          design = 'pink', text_size = 'auto', text_color = 'dark',
          align = 'center', title = '', song_title = '', song_artist = '',
          song_artwork_url = '' } = opts;

  const W = CARD.W * scale;
  const H = CARD.H * scale;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Latar: SVG template atau fallback gradient
  const tmpl = await loadImage(TEMPLATE_PATH[design] || TEMPLATE_PATH.pink);
  if (tmpl) {
    ctx.drawImage(tmpl, 0, 0, W, H);
  } else {
    // Fallback gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    const stops = design === 'green'
      ? [['0','#70B88E'],['0.5','#CEDBA3'],['1','#EFECB6']]
      : [['0','#D94C95'],['0.5','#ECC8D7'],['1','#F8E6EE']];
    stops.forEach(([o, c]) => grad.addColorStop(Number(o), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  const area = safeAreaPx();
  const ax = area.x * scale;
  const ay = area.y * scale;
  const aw = area.w * scale;
  const ah = area.h * scale;

  const color  = CARD_TEXT_COLOR[text_color] || CARD_TEXT_COLOR.dark;
  const isCenter = align === 'center';

  // 2. Judul (opsional, admin Studio)
  let curY = ay;
  if (title) {
    const titleSz = (CARD.sizes.sm || 56) * scale;
    ctx.font      = `900 ${titleSz}px ${CARD.fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = isCenter ? 'center' : 'left';
    ctx.textBaseline = 'top';
    const tx = isCenter ? ax + aw / 2 : ax;
    ctx.fillText(title, tx, curY);
    curY += titleSz * CARD.lineHeight;
  }

  // 3. Hitung apakah ada pil lagu — sisihkan ruang di bawah
  // Pil lagu sengaja dimatikan: gambar kartu hanya berisi saran/pesan.
  // Judul lagu cukup di pencarian & caption (bukan di frame/download).
  const hasSong = false;
  const songPilH = hasSong ? ah * 0.09 : 0;
  const bodyAreaH = ah - (title ? (CARD.sizes.sm || 56) * scale * CARD.lineHeight : 0) - songPilH - (curY - ay > 0 ? 0 : 0);

  // 4. Font size
  const fixedSz = text_size !== 'auto' ? (CARD.sizes[text_size] || null) : null;
  const fixedScaled = fixedSz ? fixedSz * scale : null;
  const { fontPx, lines, lineH, shrunk } = layoutCard(ctx, body, aw, bodyAreaH, fixedScaled);

  // 5. Rata tengah vertikal dalam area body
  const totalH = lines.length * lineH;
  const startY  = curY + (bodyAreaH - totalH) / 2;

  ctx.font      = `${CARD.fontWeight} ${fontPx}px ${CARD.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = isCenter ? 'center' : 'left';
  ctx.textBaseline = 'top';

  lines.forEach((line, i) => {
    const lx = isCenter ? ax + aw / 2 : ax;
    ctx.fillText(line, lx, startY + i * lineH);
  });

  // 6. Label Untuk/Dari (kecil)
  const labelSz = Math.round(28 * scale);
  ctx.font      = `700 ${labelSz}px ${CARD.fontFamily}`;
  ctx.fillStyle = color;
  if (to) {
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Untuk: ${to}`, ax, ay - 6 * scale);
  }
  if (from) {
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Dari: ${from || 'Anonim'}`, ax + aw, ay + ah + labelSz + 4 * scale);
  }

  // 7. Pil lagu
  if (hasSong) {
    await drawSongPill(ctx, { song_title, song_artist, song_artwork_url },
      ax, ay + ah - songPilH, aw, songPilH, scale);
  }

  // 8. Peringatan shrunk (teks diperkecil otomatis)
  if (shrunk) {
    const noteSz = Math.max(16, 20 * scale);
    ctx.font = `600 ${noteSz}px ${CARD.fontFamily}`;
    ctx.fillStyle = 'rgba(100,100,100,0.6)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Teks diperkecil otomatis', ax + aw, ay + ah);
  }

  return { shrunk };
}

async function drawSongPill(ctx, { song_title, song_artist, song_artwork_url },
  x, y, w, h, scale) {
  const r = h / 2;
  // Latar pil
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();

  // Artwork
  const imgSz = h * 0.75;
  const imgX  = x + (h - imgSz) / 2;
  const imgY  = y + (h - imgSz) / 2;
  if (song_artwork_url) {
    try {
      const resp = await fetch(song_artwork_url, { mode: 'cors' });
      const blob = await resp.blob();
      const bmp  = await createImageBitmap(blob);
      ctx.save();
      ctx.beginPath();
      ctx.arc(imgX + imgSz / 2, imgY + imgSz / 2, imgSz / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(bmp, imgX, imgY, imgSz, imgSz);
      ctx.restore();
    } catch {
      drawMusicIcon(ctx, imgX, imgY, imgSz);
    }
  } else {
    drawMusicIcon(ctx, imgX, imgY, imgSz);
  }

  // Teks
  const textX   = imgX + imgSz + 8 * scale;
  const textMaxW = w - imgSz - h * 0.5 - 8 * scale;
  const titleSz  = Math.round(h * 0.38);
  const artistSz = Math.round(h * 0.28);

  ctx.fillStyle = '#1a1a2e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `800 ${titleSz}px ${CARD.fontFamily}`;
  const tTitle = ellipsis(ctx, `♪ ${song_title || ''}`, textMaxW);
  ctx.fillText(tTitle, textX, y + h * 0.1);

  ctx.font = `600 ${artistSz}px ${CARD.fontFamily}`;
  const tArtist = ellipsis(ctx, song_artist || '', textMaxW);
  ctx.fillStyle = '#3a3a5e';
  ctx.fillText(tArtist, textX, y + h * 0.1 + titleSz * 1.2);

  ctx.restore();
}

function drawMusicIcon(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = 'rgba(26,26,46,0.15)';
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `${Math.round(size * 0.5)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(26,26,46,0.5)';
  ctx.fillText('♪', x + size / 2, y + size / 2);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipsis(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

// ─── renderCardBlob ───────────────────────────────────────────────────────────

export async function renderCardBlob(opts) {
  // Muat font Nunito 800 sebelum render
  try {
    await document.fonts.load(`800 48px Nunito`);
  } catch { /* ignore */ }

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
