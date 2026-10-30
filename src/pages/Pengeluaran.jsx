// src/pages/Pengeluaran.jsx
// Pengeluaran pribadi admin — sistem KARTU-KANTONG (swipe). Tab di Admin Dashboard, terpisah total dari Makrab.
// Data: tabel pengeluaran, pengeluaran_pockets, pengeluaran_ledger (lihat supabase/pengeluaran-pockets.sql).
// Saldo selalu dihitung dari data (ledger − transaksi), tidak pernah disimpan sebagai angka.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@/styles/pengeluaran.css';
import { loadBudget } from '@/lib/pengeluaranApi';
import PocketDeck from '@/components/pengeluaran/PocketDeck';
import DetailSheet from '@/components/pengeluaran/DetailSheet';
import { Sheet, Toasts } from '@/components/pengeluaran/Sheet';
import { AmountForm, ExpenseForm, PocketForm } from '@/components/pengeluaran/Forms';
import { usePockets } from '@/components/pengeluaran/usePockets';
import { NEW_CARD, UMUM, catLabel, idOf, keyOf, monthLabel, rp, shiftYM, todayISO, ymOf } from '@/components/pengeluaran/format';

const UMUM_COLOR = '#EDE6D3';

export default function Pengeluaran() {
  const [host, setHost] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((msg, kind, action) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg, kind, action }]);
    setTimeout(() => dismiss(id), action ? 5000 : 3500);
  }, [dismiss]);

  const P = usePockets(toast);
  const { loading, error, schemaReady, pockets, ledger, expenses, stats } = P;

  const [frontKey, setFrontKey] = useState(null);
  const [sheet, setSheet] = useState(null); // { type, key?, expense?, back? }
  const [month, setMonth] = useState(() => ymOf(new Date()));
  const [budget, setBudget] = useState({ month: '', v: 0 });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let alive = true;
    loadBudget(month).then((v) => alive && setBudget({ month, v }), () => {});
    return () => { alive = false; };
  }, [month]);

  const sorted = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date) || String(b.createdAt).localeCompare(String(a.createdAt))),
    [expenses],
  );
  const active = useMemo(() => pockets.filter((p) => !p.archived).sort((a, b) => a.sortOrder - b.sortOrder), [pockets]);
  const archived = pockets.filter((p) => p.archived);

  const cards = useMemo(() => {
    const mk = (key, name, color, icon) => ({
      key, name, color, icon,
      stat: stats[key] || { topped: 0, spent: 0, balance: 0, hasLedger: false, count: 0 },
      recent: sorted.filter((e) => keyOf(e.pocketId) === key).slice(0, 3),
    });
    const list = [];
    const u = stats[UMUM];
    if (u && (u.count > 0 || u.hasLedger)) list.push(mk(UMUM, 'Umum', UMUM_COLOR, ''));
    active.forEach((p) => list.push(mk(p.id, p.name, p.color, p.icon)));
    if (schemaReady) list.push({ key: NEW_CARD, name: 'Kartu baru' });
    return list;
  }, [stats, sorted, active, schemaReady]);

  const front = cards.find((c) => c.key === frontKey) || cards[0];
  const realCards = cards.filter((c) => c.key !== NEW_CARD);
  const byKey = (k) => cards.find((c) => c.key === k);

  const open = (s, back) => setSheet({ ...s, back });
  const close = useCallback(() => setSheet((s) => (s?.back ? { type: 'detail', key: s.back } : null)), []);
  const closeAll = () => setSheet(null);

  const guard = async (fn, ok) => {
    try { const r = await fn(); if (ok) toast(ok); return r; }
    catch (e) { console.error('[Pengeluaran]', e); toast(e.message || 'Gagal menyimpan.', 'error'); throw e; }
  };

  /* ── Aksi ── */
  const saveExpense = (edit) => async (v) => {
    const payload = { ...v, pocketId: idOf(v.pocketKey) };
    if (edit) await P.updateExpense(edit.id, payload); else await P.addExpense(payload);
    toast(edit ? 'Transaksi diperbarui' : `Tercatat ${rp(v.amount)}`);
    setFrontKey(v.pocketKey);
    close();
  };
  const removeExpense = (id) => {
    const r = P.deleteExpense(id);
    close();
    if (r) toast('Transaksi dihapus', '', { label: 'Urungkan', run: r.undo });
  };
  const quick = (q) => {
    if (!front || front.key === NEW_CARD) return;
    const after = front.stat.hasLedger ? front.stat.balance - q.amount : null;
    P.addExpense({ note: q.note, amount: q.amount, category: q.category, date: todayISO(), pocketId: idOf(front.key) })
      .then(() => toast(`${q.note} ${rp(q.amount)} tercatat${after !== null && after < 0 ? `, saldo jadi ${rp(after)}` : ''}`, after !== null && after < 0 ? 'warning' : ''))
      .catch((e) => toast(e.message, 'error'));
  };

  const frequent = useMemo(() => {
    const m = new Map();
    expenses.forEach((e) => {
      const n = e.note.trim();
      if (!n) return;
      const k = `${n.toLowerCase()}|${e.amount}`;
      const cur = m.get(k) || { note: n, amount: e.amount, category: e.category, count: 0 };
      cur.count += 1; m.set(k, cur);
    });
    return [...m.values()].filter((x) => x.count >= 2).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [expenses]);

  /* ── Ringkasan ── */
  const monthRows = sorted.filter((e) => e.month === month);
  const spentMonth = monthRows.reduce((s, e) => s + e.amount, 0);
  const totalBalance = realCards.filter((c) => c.stat.hasLedger).reduce((s, c) => s + c.stat.balance, 0);
  const anyBalance = realCards.some((c) => c.stat.hasLedger);
  const nameOf = (pid) => (pid ? pockets.find((p) => p.id === pid)?.name || 'Kartu' : 'Umum');
  const colorOf = (pid) => (pid ? pockets.find((p) => p.id === pid)?.color || UMUM_COLOR : UMUM_COLOR);
  const thisMonth = ymOf(new Date());

  /* ── Sheet aktif ── */
  const sc = sheet?.key ? byKey(sheet.key) : null;
  const pocketChoices = realCards.map((c) => ({ key: c.key, name: c.name, color: c.color, stat: c.stat }));
  const defaultKey = sc?.key && sc.key !== NEW_CARD ? sc.key : front && front.key !== NEW_CARD ? front.key : realCards[0]?.key;

  const onDetailAction = (key) => (what, arg) => {
    if (what === 'expense') open({ type: 'expense', key, pocketKey: key }, key);
    else if (what === 'editExpense') open({ type: 'expense', key, expense: arg, pocketKey: keyOf(arg.pocketId) }, key);
    else if (what === 'topup') open({ type: 'topup', key }, key);
    else if (what === 'set') open({ type: 'set', key }, key);
    else if (what === 'edit') open({ type: 'pocket', key }, key);
  };

  let sheetTitle = ''; let body = null;
  if (sheet?.type === 'detail' && sc) {
    body = <DetailSheet card={sc} expenses={expenses} ledger={ledger} onAction={onDetailAction(sc.key)} />;
  } else if (sheet?.type === 'expense') {
    const e = sheet.expense;
    sheetTitle = e ? 'Edit transaksi' : 'Catat pengeluaran';
    body = (
      <ExpenseForm key={e?.id || 'new'} pockets={pocketChoices} onClose={close} onDelete={removeExpense} onSave={saveExpense(e)}
        initial={e ? { id: e.id, amount: e.amount, note: e.note, category: e.category, date: e.date, pocketKey: keyOf(e.pocketId) } : { pocketKey: sheet.pocketKey || defaultKey }} />
    );
  } else if (sheet?.type === 'topup' && sc) {
    sheetTitle = `Tambah saldo, ${sc.name}`;
    body = <AmountForm mode="topup" current={sc.stat.balance} hasLedger={sc.stat.hasLedger} onClose={close}
      onSubmit={async (n) => { await guard(() => P.topUp(idOf(sc.key), n, 'Top-up'), `Saldo ${sc.name} bertambah ${rp(n)}`); close(); }} />;
  } else if (sheet?.type === 'set' && sc) {
    sheetTitle = `Atur saldo, ${sc.name}`;
    body = <AmountForm mode="set" current={sc.stat.balance} hasLedger={sc.stat.hasLedger} onClose={close}
      onSubmit={async (n) => { const d = await guard(() => P.setBalance(idOf(sc.key), n), ''); toast(d ? `Saldo ${sc.name} jadi ${rp(n)}` : 'Saldo sudah sama'); close(); }} />;
  } else if (sheet?.type === 'pocket') {
    const p = sheet.key ? pockets.find((x) => x.id === sheet.key) : null;
    const i = p ? active.findIndex((x) => x.id === p.id) : -1;
    sheetTitle = p ? 'Edit kartu' : 'Kartu baru';
    body = (
      <PocketForm key={p?.id || 'new'} pocket={p} onClose={sheet.back ? close : closeAll}
        canMove={{ back: i > 0, fwd: i >= 0 && i < active.length - 1 }}
        onMove={(d) => guard(() => P.movePocket(p.id, d)).catch(() => {})}
        onArchive={async () => { await guard(() => P.updatePocket(p.id, { archived: true }), `${p.name} diarsipkan`); setFrontKey(null); closeAll(); }}
        onSave={async (v) => {
          if (p) { await guard(() => P.updatePocket(p.id, { name: v.name, icon: v.icon, color: v.color }), 'Kartu diperbarui'); close(); return; }
          const created = await guard(() => P.createPocket(v), `Kartu ${v.name} dibuat`);
          setFrontKey(created.id); closeAll();
        }} />
    );
  }

  return (
    <div className="pk-page" ref={setHost}>
      <header className="pk-head">
        <h2>Pengeluaran</h2>
        <p>Satu kartu satu kantong. Geser untuk ganti kartu, geser ke atas untuk detail.</p>
      </header>

      {!schemaReady && !loading && !error && (
        <div className="pk-banner" role="status">
          <b>Fitur kartu belum aktif di database.</b>
          <span>Jalankan <code>supabase/pengeluaran-pockets.sql</code> di SQL Editor Supabase, lalu muat ulang. Sementara itu semua transaksi lama tampil di kartu Umum.</span>
        </div>
      )}
      {error && (
        <div className="pk-banner bad" role="alert">
          <b>Gagal memuat data.</b><span>{error}</span>
          <button type="button" className="dash-btn" onClick={() => { P.reload(); }}>Coba lagi</button>
        </div>
      )}

      {loading ? (
        <div className="pk-skel" aria-busy="true" aria-label="Memuat kartu"><span className="dash-skeleton" /><span className="dash-skeleton" /></div>
      ) : (
        <>
          {cards.length > 0 && (
            <PocketDeck cards={cards} frontKey={front?.key} onFront={setFrontKey} detailOpen={sheet?.type === 'detail'}
              onDetail={(k) => open({ type: 'detail', key: k })} onCreate={() => open({ type: 'pocket' })} />
          )}
          {!cards.length && <div className="dash-empty">Belum ada data pengeluaran.</div>}

          {front && front.key !== NEW_CARD ? (
            <div className="pk-cta">
              <button type="button" className="pk-big" onClick={() => open({ type: 'expense', pocketKey: front.key })}>+ Catat pengeluaran</button>
              {frequent.length > 0 && (
                <div className="pk-chips pk-quick" aria-label="Catat cepat">
                  {frequent.map((q) => (
                    <button key={`${q.note}${q.amount}`} type="button" className="pk-chip" onClick={() => quick(q)}>{q.note} {rp(q.amount).slice(3)}</button>
                  ))}
                </div>
              )}
            </div>
          ) : front ? (
            <div className="pk-cta"><button type="button" className="pk-big" onClick={() => open({ type: 'pocket' })}>Buat kartu pertama</button></div>
          ) : null}

          <section className="pk-summary" aria-label="Ringkasan">
            <div className="pk-sum-row">
              <div><small>Total saldo semua kartu</small><b>{anyBalance ? rp(totalBalance) : 'Belum diatur'}</b></div>
              <div className="pk-month">
                <button type="button" className="pk-nav-btn" aria-label="Bulan sebelumnya" onClick={() => setMonth(shiftYM(month, -1))}>&lsaquo;</button>
                <span>{monthLabel(month)}</span>
                <button type="button" className="pk-nav-btn" aria-label="Bulan berikutnya" disabled={month >= thisMonth} onClick={() => setMonth(shiftYM(month, 1))}>&rsaquo;</button>
              </div>
            </div>
            <div className="pk-sum-row">
              <div><small>Terpakai bulan ini</small><b>{rp(spentMonth)}</b></div>
              {budget.month === month && budget.v > 0 && <div className="pk-budget"><small>Budget bulan ini</small><b>{rp(budget.v)}</b></div>}
            </div>
          </section>

          <section className="pk-recent" aria-label="Transaksi terbaru">
            <h3>Transaksi {monthLabel(month)}</h3>
            {monthRows.length === 0 && <p className="dash-empty">Belum ada transaksi di bulan ini.</p>}
            {monthRows.slice(0, showAll ? monthRows.length : 10).map((e) => (
              <button key={e.id} type="button" className="pk-row" onClick={() => open({ type: 'expense', expense: e, pocketKey: keyOf(e.pocketId) })}>
                <i className="pk-dot" style={{ background: colorOf(e.pocketId) }} />
                <span className="pk-row-main"><b>{e.note || catLabel(e.category)}</b><small>{nameOf(e.pocketId)} · {catLabel(e.category)} · {e.date.slice(8)}/{e.date.slice(5, 7)}</small></span>
                <span className="pk-row-amt">-{rp(e.amount).slice(3)}</span>
              </button>
            ))}
            {monthRows.length > 10 && !showAll && <button type="button" className="dash-btn ghost" onClick={() => setShowAll(true)}>Tampilkan semua ({monthRows.length})</button>}
          </section>

          {archived.length > 0 && (
            <details className="pk-archive">
              <summary>Kartu diarsipkan ({archived.length})</summary>
              {archived.map((p) => (
                <div key={p.id} className="pk-row static">
                  <i className="pk-dot" style={{ background: p.color }} /><span className="pk-row-main"><b>{p.name}</b></span>
                  <button type="button" className="dash-btn" onClick={() => guard(() => P.updatePocket(p.id, { archived: false }), `${p.name} dipulihkan`).catch(() => {})}>Pulihkan</button>
                </div>
              ))}
            </details>
          )}
        </>
      )}

      <Sheet host={host} open={!!body} onClose={close} title={sheetTitle} label={sheetTitle || 'Detail kartu'}>{body}</Sheet>
      <Toasts items={toasts} onDismiss={dismiss} />
    </div>
  );
}
