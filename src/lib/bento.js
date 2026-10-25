import { useState, useEffect } from 'react';

/* Kontak — satu tempat supaya gampang diganti */
export const WA_NUMBER = '6281252790018';
export const IG_URL = 'https://www.instagram.com/aldosynnn';
export const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* Bahasa: pakai prop dari App kalau ada, kalau tidak ambil dari localStorage */
export function useLang(propLang) {
  const [stored, setStored] = useState(() => localStorage.getItem('synw-lang') || 'id');
  useEffect(() => {
    const on = () => setStored(localStorage.getItem('synw-lang') || 'id');
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  return propLang || stored;
}

/* Thumbnail ringan (960px .webp) dibuat dari nama file gambar asli */
export const thumbOf = src => {
  if (!src) return '';
  const base = src.split('/').pop().replace(/\.[a-z]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `/assets/thumbs/${base}.webp`;
};

/* Pola bento untuk grid 6 kolom: [4,2 / 2,2,2] lalu [2,4 / 2,2,2], baris terakhir selalu penuh */
export function workSpans(n) {
  const A = [4, 2, 2, 2, 2];
  const B = [2, 4, 2, 2, 2];
  const spans = [];
  let row = 0;
  for (let i = 0; i < n; i++) {
    const s = (Math.floor(i / 5) % 2 === 0 ? A : B)[i % 5];
    spans.push(s);
    row += s;
    if (row >= 6) row = 0;
  }
  if (row > 0 && n > 0) spans[n - 1] += 6 - row;
  return spans;
}

/* n kartu, masing-masing `per` kolom dari 6; sisa baris dibagi rata */
export function evenSpans(n, per = 2) {
  const perRow = 6 / per;
  const spans = Array.from({ length: n }, () => per);
  const rest = n % perRow;
  if (rest > 0) {
    const each = 6 / rest;
    for (let i = n - rest; i < n; i++) spans[i] = each;
  }
  return spans;
}
