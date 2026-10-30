// Satu hook untuk seluruh state Pengeluaran. Optimistic update + rollback bila error.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from '@/lib/pengeluaranApi';
import { computeStats, keyOf, todayISO } from './format';

const UNDO_MS = 5000;
const tmpId = () => `tmp-${crypto.randomUUID()}`;

export function usePockets(notify) {
  const [state, setState] = useState({ loading: true, error: '', schemaReady: true, pockets: [], ledger: [], expenses: [] });
  const ref = useRef(state);
  const notifyRef = useRef(notify);
  const pending = useRef(new Map()); // id -> { timer, row }

  useEffect(() => { ref.current = state; }, [state]);
  useEffect(() => { notifyRef.current = notify; }, [notify]);

  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), []);

  const reload = useCallback(async () => {
    try {
      const d = await api.loadAll();
      setState({ loading: false, error: '', ...d });
    } catch (e) {
      console.error('[Pengeluaran] load:', e);
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api.loadAll().then(
      (d) => alive && setState({ loading: false, error: '', ...d }),
      (e) => { console.error('[Pengeluaran] load:', e); if (alive) setState((s) => ({ ...s, loading: false, error: e.message })); },
    );
    return () => { alive = false; };
  }, []);

  // Hapus tertunda yang belum sempat jalan → jalankan saat tab ditutup (user sudah konfirmasi).
  useEffect(() => {
    const map = pending.current;
    return () => { map.forEach(({ timer }, id) => { clearTimeout(timer); api.removeExpense(id).catch(() => {}); }); map.clear(); };
  }, []);

  const stats = useMemo(() => computeStats(state.pockets, state.ledger, state.expenses), [state.pockets, state.ledger, state.expenses]);

  /* ── Transaksi ── */
  const addExpense = useCallback(async (v) => {
    const id = tmpId();
    const row = { id, pocketId: v.pocketId ?? null, amount: v.amount, category: v.category || 'lainnya', note: (v.note || '').trim(), date: v.date, month: v.date.slice(0, 7), raw: {}, createdAt: new Date().toISOString() };
    patch((s) => ({ expenses: [row, ...s.expenses] }));
    try {
      const saved = await api.insertExpense(v, ref.current.schemaReady);
      patch((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? saved : e)) }));
      return saved;
    } catch (e) {
      patch((s) => ({ expenses: s.expenses.filter((x) => x.id !== id) }));
      throw e;
    }
  }, [patch]);

  const updateExpense = useCallback(async (id, v) => {
    const prev = ref.current.expenses.find((e) => e.id === id);
    if (!prev) return;
    const next = { ...prev, pocketId: v.pocketId ?? null, amount: v.amount, category: v.category || 'lainnya', note: (v.note || '').trim(), date: v.date, month: v.date.slice(0, 7) };
    patch((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? next : e)) }));
    try {
      await api.patchExpense(id, { ...v, raw: prev.raw }, ref.current.schemaReady);
    } catch (e) {
      patch((s) => ({ expenses: s.expenses.map((x) => (x.id === id ? prev : x)) }));
      throw e;
    }
  }, [patch]);

  /** Hapus dengan Undo 5 detik. Baris baru benar-benar dihapus di DB setelah jendela undo lewat. */
  const deleteExpense = useCallback((id) => {
    const row = ref.current.expenses.find((e) => e.id === id);
    if (!row) return null;
    patch((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
    const restore = () => patch((s) => (s.expenses.some((e) => e.id === id) ? {} : { expenses: [row, ...s.expenses].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) }));
    const timer = setTimeout(async () => {
      pending.current.delete(id);
      try { await api.removeExpense(id); }
      catch (e) { restore(); notifyRef.current?.(`Gagal menghapus: ${e.message}`, 'error'); }
    }, UNDO_MS);
    pending.current.set(id, { timer });
    return { undo: () => { clearTimeout(timer); pending.current.delete(id); restore(); } };
  }, [patch]);

  /* ── Kartu ── */
  const createPocket = useCallback(async ({ name, color, icon, openingBalance }) => {
    const active = ref.current.pockets;
    const sortOrder = active.length ? Math.max(...active.map((p) => p.sortOrder)) + 1 : 1;
    const pocket = await api.insertPocket({ name, color, icon, sortOrder });
    patch((s) => ({ pockets: [...s.pockets, pocket] }));
    if (openingBalance > 0) {
      try {
        const l = await api.insertLedger({ pocketId: pocket.id, amount: openingBalance, note: 'Saldo awal' });
        patch((s) => ({ ledger: [l, ...s.ledger] }));
      } catch (e) { notifyRef.current?.(`Kartu dibuat, tapi saldo awal gagal: ${e.message}`, 'error'); }
    }
    return pocket;
  }, [patch]);

  const updatePocket = useCallback(async (id, p) => {
    const prev = ref.current.pockets.find((x) => x.id === id);
    patch((s) => ({ pockets: s.pockets.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
    try { await api.patchPocket(id, p); }
    catch (e) { patch((s) => ({ pockets: s.pockets.map((x) => (x.id === id ? prev : x)) })); throw e; }
  }, [patch]);

  const movePocket = useCallback(async (id, dir) => {
    const list = [...ref.current.pockets].filter((p) => !p.archived).sort((a, b) => a.sortOrder - b.sortOrder);
    const i = list.findIndex((p) => p.id === id); const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    const changes = list.map((p, idx) => ({ id: p.id, sortOrder: idx + 1, was: p.sortOrder })).filter((c) => c.sortOrder !== c.was);
    const before = ref.current.pockets;
    patch((s) => ({ pockets: s.pockets.map((p) => { const c = changes.find((x) => x.id === p.id); return c ? { ...p, sortOrder: c.sortOrder } : p; }) }));
    try { await Promise.all(changes.map((c) => api.patchPocket(c.id, { sortOrder: c.sortOrder }))); }
    catch (e) { patch(() => ({ pockets: before })); throw e; }
  }, [patch]);

  /* ── Ledger ── */
  const topUp = useCallback(async (pocketId, amount, note) => {
    const l = await api.insertLedger({ pocketId, amount, note: note || 'Top-up' });
    patch((s) => ({ ledger: [l, ...s.ledger] }));
  }, [patch]);

  /** "Atur saldo": hitung selisih dengan saldo sekarang → 1 baris ledger. Baris lama tidak diubah. */
  const setBalance = useCallback(async (pocketId, target) => {
    const s = ref.current;
    const st = computeStats(s.pockets, s.ledger, s.expenses)[keyOf(pocketId)];
    const diff = target - (st?.balance || 0);
    if (!diff) return 0;
    const l = await api.insertLedger({ pocketId, amount: diff, note: 'Penyesuaian' });
    patch((x) => ({ ledger: [l, ...x.ledger] }));
    return diff;
  }, [patch]);

  return { ...state, stats, reload, addExpense, updateExpense, deleteExpense, createPocket, updatePocket, movePocket, topUp, setBalance, today: todayISO };
}
