// src/lib/pengeluaranApi.js
// Data layer Pengeluaran (kartu-kantong). Terpisah total dari Makrab.
//   pengeluaran         → transaksi (nama, jumlah, kategori, data{date,month}, pocket_id)
//   pengeluaran_pockets → kartu / kantong
//   pengeluaran_ledger  → top-up & penyesuaian saldo (pocket_id null = kartu "Umum")
//   settings            → budget bulanan lama (hanya dibaca)
// Semua fungsi melempar Error dengan pesan Supabase asli kalau gagal.

import { supabase } from '@/supabaseClient';

const PAGE = 1000;

const isMissing = (e) =>
  !!e &&
  (['42P01', '42703', 'PGRST205', 'PGRST204'].includes(e.code) ||
    /does not exist|schema cache|could not find/i.test(e.message || ''));

const fail = (error) => {
  const err = new Error(error?.message || 'Terjadi kesalahan pada database.');
  err.code = error?.code;
  throw err;
};

async function fetchAll(build) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) return { rows, error };
    rows.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return { rows, error: null };
}

const mapExpense = (r) => {
  const date = r.data?.date || String(r.created_at || '').slice(0, 10);
  return {
    id: r.id,
    pocketId: r.pocket_id ?? null,
    amount: Number(r.jumlah) || 0,
    category: r.kategori || 'lainnya',
    note: r.nama || '',
    date,
    month: r.data?.month || date.slice(0, 7),
    raw: r.data || {},
    createdAt: r.created_at,
  };
};

const mapPocket = (r) => ({
  id: r.id,
  name: r.name,
  color: r.color || '#D7FF3A',
  icon: r.icon || '',
  sortOrder: Number(r.sort_order) || 0,
  archived: !!r.archived,
});

const mapLedger = (r) => ({
  id: r.id,
  pocketId: r.pocket_id ?? null,
  amount: Number(r.amount) || 0,
  note: r.note || '',
  createdAt: r.created_at,
});

/** Muat semua data. Kalau migration belum dijalankan, schemaReady=false dan transaksi lama tetap tampil. */
export async function loadAll() {
  const [pk, lg] = await Promise.all([
    fetchAll(() =>
      supabase.from('pengeluaran_pockets').select('id, name, color, icon, sort_order, archived, created_at')
        .order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    ),
    fetchAll(() =>
      supabase.from('pengeluaran_ledger').select('id, pocket_id, amount, note, created_at')
        .order('created_at', { ascending: false }).order('id')
    ),
  ]);

  let schemaReady = true;
  if (pk.error || lg.error) {
    const bad = pk.error || lg.error;
    if (!isMissing(bad)) fail(bad);
    schemaReady = false;
  }

  const ordered = (cols) => () =>
    supabase.from('pengeluaran').select(cols)
      .order('created_at', { ascending: false }).order('id');

  let ex = schemaReady
    ? await fetchAll(ordered('id, nama, jumlah, kategori, data, created_at, pocket_id'))
    : { rows: [], error: { code: '42703', message: 'skip' } };
  if (ex.error) {
    if (!isMissing(ex.error)) fail(ex.error);
    schemaReady = false;
    ex = await fetchAll(ordered('id, nama, jumlah, kategori, data, created_at'));
    if (ex.error) fail(ex.error);
  }

  return {
    schemaReady,
    pockets: schemaReady ? pk.rows.map(mapPocket) : [],
    ledger: schemaReady ? lg.rows.map(mapLedger) : [],
    expenses: ex.rows.map(mapExpense),
  };
}

/** Budget bulanan lama (read-only). 0 kalau belum di-set. */
export async function loadBudget(month) {
  const { data } = await supabase.from('settings').select('data').eq('id', `pengeluaran-budget-${month}`).maybeSingle();
  return Number(data?.data?.amount) || 0;
}

/* ── Transaksi ─────────────────────────────────────── */
const expensePayload = (v) => ({
  nama: (v.note || '').trim(),
  jumlah: v.amount,
  kategori: v.category || 'lainnya',
  data: { ...(v.raw || {}), date: v.date, month: v.date.slice(0, 7) },
});

export async function insertExpense(v, schemaReady) {
  const row = expensePayload(v);
  if (schemaReady && v.pocketId) row.pocket_id = v.pocketId;
  const { data, error } = await supabase.from('pengeluaran')
    .insert(row).select('id, nama, jumlah, kategori, data, created_at' + (schemaReady ? ', pocket_id' : '')).single();
  if (error) fail(error);
  return mapExpense(data);
}

export async function patchExpense(id, v, schemaReady) {
  const row = expensePayload(v);
  if (schemaReady) row.pocket_id = v.pocketId ?? null;
  const { error } = await supabase.from('pengeluaran').update(row).eq('id', id);
  if (error) fail(error);
}

export async function removeExpense(id) {
  const { error } = await supabase.from('pengeluaran').delete().eq('id', id);
  if (error) fail(error);
}

/* ── Kartu ─────────────────────────────────────────── */
export async function insertPocket({ name, color, icon, sortOrder }) {
  const { data, error } = await supabase.from('pengeluaran_pockets')
    .insert({ name: name.trim(), color, icon: icon || null, sort_order: sortOrder })
    .select('id, name, color, icon, sort_order, archived, created_at').single();
  if (error) fail(error);
  return mapPocket(data);
}

export async function patchPocket(id, patch) {
  const row = {};
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.color !== undefined) row.color = patch.color;
  if (patch.icon !== undefined) row.icon = patch.icon || null;
  if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder;
  if (patch.archived !== undefined) row.archived = patch.archived;
  const { error } = await supabase.from('pengeluaran_pockets').update(row).eq('id', id);
  if (error) fail(error);
}

/* ── Ledger (hanya insert, tidak pernah menimpa) ───── */
export async function insertLedger({ pocketId, amount, note }) {
  const { data, error } = await supabase.from('pengeluaran_ledger')
    .insert({ pocket_id: pocketId ?? null, amount, note: note || null })
    .select('id, pocket_id, amount, note, created_at').single();
  if (error) fail(error);
  return mapLedger(data);
}
