// Helper format + konstanta Pengeluaran. Tidak ada daftar kartu di sini — kartu hidup di database.

const nf = new Intl.NumberFormat('id-ID');

export const UMUM = 'umum';
export const NEW_CARD = '__new';

export const keyOf = (pocketId) => pocketId ?? UMUM;
export const idOf = (key) => (key === UMUM ? null : key);

export const rp = (n) => `${n < 0 ? '-' : ''}Rp ${nf.format(Math.abs(Math.round(Number(n) || 0)))}`;
export const digits = (v) => String(v ?? '').replace(/\D/g, '');
export const fmtDigits = (v) => { const d = digits(v); return d ? nf.format(Number(d)) : ''; };

export const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export const monthLabel = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS_ID[+m - 1]} ${y}`; };
export const ymOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
export const shiftYM = (ym, n) => { const [y, m] = ym.split('-').map(Number); return ymOf(new Date(y, m - 1 + n, 1)); };
export const todayISO = () => { const d = new Date(); return `${ymOf(d)}-${String(d.getDate()).padStart(2, '0')}`; };
export const dayLabel = (iso) => {
  if (iso === todayISO()) return 'Hari ini';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return iso;
  return `${d} ${MONTHS_ID[m - 1].slice(0, 3)} ${y}`;
};

// Palet kartu (solid, teks gelap kontras tinggi). Ini palet pilihan warna, bukan daftar kartu.
export const PALETTE = [
  { v: '#D7FF3A', n: 'Lime' },
  { v: '#EDE6D3', n: 'Krem' },
  { v: '#D9623B', n: 'Bata' },
  { v: '#AFCBE8', n: 'Biru pucat' },
  { v: '#A9BFA1', n: 'Sage' },
  { v: '#C5BAE4', n: 'Lavender' },
];

// Kategori lama tetap valid di kolom `kategori`.
export const CATEGORIES = [
  { v: 'makanan', l: 'Makanan' },
  { v: 'transport', l: 'Transport' },
  { v: 'belanja', l: 'Belanja' },
  { v: 'digital', l: 'Digital' },
  { v: 'hiburan', l: 'Hiburan' },
  { v: 'kesehatan', l: 'Kesehatan' },
  { v: 'pendidikan', l: 'Pendidikan' },
  { v: 'lainnya', l: 'Lainnya' },
];
export const catLabel = (v) => CATEGORIES.find((c) => c.v === v)?.l || v || 'Lainnya';

/** Hitung saldo per kartu dari data mentah (tidak pernah disimpan sebagai angka). */
export function computeStats(pockets, ledger, expenses) {
  const map = {};
  const ensure = (k) => (map[k] ||= { topped: 0, spent: 0, hasLedger: false, count: 0 });
  ensure(UMUM);
  pockets.forEach((p) => ensure(p.id));
  ledger.forEach((l) => { const s = ensure(keyOf(l.pocketId)); s.topped += l.amount; s.hasLedger = true; });
  expenses.forEach((e) => { const s = ensure(keyOf(e.pocketId)); s.spent += e.amount; s.count += 1; });
  Object.values(map).forEach((s) => { s.balance = s.topped - s.spent; });
  return map;
}

/** Tanggal lokal (YYYY-MM-DD) dari timestamp ISO. */
export const localDay = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso || '').slice(0, 10);
  return `${ymOf(d)}-${String(d.getDate()).padStart(2, '0')}`;
};
