// CardThumb — render kartu ASLI (drawCard) → blob URL, lazy + antrian + cache.
import { useEffect, useRef, useState } from 'react';
import { drawCard } from '@/lib/menfess/renderCard';

const URL_CACHE = new Map();     // key -> blobUrl
const MAX_CACHE = 80;
const waiters = [];
let running = 0;
const MAX_PAR = 2;

function keyOf(post, scale) {
  return [post.id || 'x', post.updated_at || '', post.body, post.design, post.text_size, post.text_color, post.align, post.title, scale].join('|');
}

function pump() {
  while (running < MAX_PAR && waiters.length) {
    const job = waiters.shift();
    running++;
    job().finally(() => { running--; pump(); });
  }
}
function enqueue(fn) {
  return new Promise((resolve, reject) => {
    waiters.push(() => fn().then(resolve, reject));
    pump();
  });
}

async function renderToUrl(post, scale) {
  try { await document.fonts.load('800 48px Nunito'); } catch { /* lanjut */ }
  const canvas = document.createElement('canvas');
  await drawCard(canvas, post, scale);
  const blob = await new Promise((res, rej) => canvas.toBlob(b => (b ? res(b) : rej(new Error('toBlob'))), 'image/png'));
  return URL.createObjectURL(blob);
}

function remember(key, url) {
  URL_CACHE.set(key, url);
  if (URL_CACHE.size > MAX_CACHE) {
    const first = URL_CACHE.keys().next().value;
    try { URL.revokeObjectURL(URL_CACHE.get(first)); } catch { /* abaikan */ }
    URL_CACHE.delete(first);
  }
}

/** @param {{post:object, scale?:number, onClick?:()=>void, label?:string, className?:string, eager?:boolean}} p */
export default function CardThumb({ post, scale = 0.25, onClick, label, className = '', eager = false }) {
  const ref = useRef(null);
  const key = keyOf(post, scale);
  const [src, setSrc] = useState(() => URL_CACHE.get(key) || null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible || !ref.current) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const io = new IntersectionObserver((es) => { if (es.some(e => e.isIntersecting)) { setVisible(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;
    const hit = URL_CACHE.get(key);
    if (hit) { setSrc(hit); setFailed(false); return undefined; }
    let alive = true;
    setFailed(false);
    enqueue(() => renderToUrl(post, scale))
      .then(url => { remember(key, url); if (alive) setSrc(url); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, key]);

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag ref={ref} type={onClick ? 'button' : undefined} className={`mf-thumb mf-thumb-root${onClick ? '' : ' static'} ${className}`}
      onClick={onClick} aria-label={onClick ? (label || 'Buka kartu') : undefined}>
      {src && <img src={src} alt={`Kartu menfess: ${(post.body || '').slice(0, 80)}`} width="300" height="375" decoding="async" />}
      {!src && !failed && <span className="mf-skeleton mf-thumb-sk" aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
      {failed && <span className={`mf-thumb-fallback ${['green', 'picnic'].includes(post.design) ? post.design : 'pink'}`}>{(post.body || '').slice(0, 120)}</span>}
    </Tag>
  );
}
