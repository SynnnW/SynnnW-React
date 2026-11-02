// Dana & pengeluaran Makrab — tampilan kartu-kantong per divisi.
// Hanya presentasi: data, rumus, permission, dan handler tetap dari Makrab.jsx (ctx.actions).
import { useCallback, useEffect, useRef, useState } from 'react';
import { PALETTE } from '@/components/pengeluaran/format';
import MkSheet from './MkSheet';

const nf = new Intl.NumberFormat('id-ID');
const rp = (n) => `${Number(n) < 0 ? '-' : ''}Rp ${nf.format(Math.abs(Math.round(Number(n) || 0)))}`;
const TZ = 'Asia/Jakarta';
const EXP_STATUS = { menunggu: 'Menunggu persetujuan', disetujui: 'Disetujui', ditolak: 'Ditolak' };
const STATUS_ICON = { menunggu: 'clock', disetujui: 'circle-check', ditolak: 'circle-xmark' };
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const I = ({ n }) => <i className={`fa-solid fa-${n}`} aria-hidden="true" />;
const fmtDate = (d) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }).format(new Date(`${d}T12:00:00+07:00`));
const todayWIB = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());

/* Warna kartu deterministik dari ID divisi (tanpa kolom baru). */
const colorFor = (id) => {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length].v;
};

/* Rumus tetap: terpakai = disetujui, menunggu terpisah, sisa = budget − disetujui, ditolak diabaikan. */
function danaStats(expenses, d) {
  const list = expenses.filter((e) => e.division_id === d.id);
  const sum = (st) => list.filter((e) => e.status === st).reduce((n, e) => n + Number(e.jumlah), 0);
  const budget = Number(d.budget) || 0;
  const approved = sum('disetujui');
  const pending = sum('menunggu');
  const pct = (v) => (budget > 0 ? Math.max(0, Math.min(100, (v / budget) * 100)) : 0);
  return { budget, approved, pending, sisa: budget - approved, over: budget - approved < 0, pctApproved: pct(approved), pctAll: pct(approved + pending) };
}

/* ── Tombol: ripple selektif + loading yang mengikuti request sebenarnya ── */
function ripple(e) {
  const b = e.currentTarget;
  const host = b.querySelector('.mk-ripples');
  if (!host || b.disabled || reduced()) return;
  const r = b.getBoundingClientRect();
  const d = Math.max(r.width, r.height) * 2;
  const s = document.createElement('span');
  s.className = 'mk-ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  host.appendChild(s);
  s.addEventListener('animationend', () => s.remove(), { once: true });
}

function Btn({ onClick, className = 'mk-btn', children, withRipple = false, disabled = false, ...rest }) {
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const click = async (e) => {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try { await onClick?.(e); } finally { lock.current = false; setBusy(false); }
  };
  return (
    <button type="button" className={`${className}${busy ? ' is-loading' : ''}`} disabled={disabled || busy} aria-busy={busy || undefined}
      onPointerDown={withRipple ? ripple : undefined} onClick={click} {...rest}>
      {withRipple && <span className="mk-ripples" aria-hidden="true" />}
      {busy && <span className="mk-spin" aria-hidden="true" />}
      <span className="mk-btn-label">{children}</span>
    </button>
  );
}

function Badge({ status }) {
  return <span className={`mk-badge ${status}`}><I n={STATUS_ICON[status] || 'clock'} /> {EXP_STATUS[status] || status}</span>;
}

/* ── Kartu divisi ── */
function Pocket({ d, s, recent, onOpen, index, total }) {
  return (
    <button type="button" className="mk-pocket" style={{ background: colorFor(d.id) }} onClick={() => onOpen(d.id)}
      aria-label={`${d.nama}. Sisa dana ${rp(s.sisa)}. Kartu ${index + 1} dari ${total}. Buka detail.`}>
      <span className="mk-pocket-row"><span className="mk-pocket-name">{d.nama}</span><span className="mk-pocket-lbl">Sisa dana</span></span>
      <span className={`mk-pocket-bal${s.over ? ' neg' : ''}`}>{rp(s.sisa)}</span>
      {s.budget > 0 ? (
        <span className="mk-pocket-bar" role="img" aria-label={`Terpakai ${Math.round(s.pctApproved)}% dari budget`}>
          <i className="p" style={{ width: `${s.pctAll}%` }} /><i className="a" style={{ width: `${s.pctApproved}%` }} />
        </span>
      ) : <span className="mk-pocket-hint">Budget belum diatur</span>}
      <span className="mk-pocket-stats">
        <span><small>Budget</small><b>{rp(s.budget)}</b></span>
        <span><small>Disetujui</small><b>{rp(s.approved)}</b></span>
        <span><small>Menunggu</small><b>{rp(s.pending)}</b></span>
      </span>
      {s.over && <span className="mk-pocket-warn"><I n="triangle-exclamation" /> Melebihi budget</span>}
      <span className="mk-pocket-recent">
        {recent.map((e) => <span key={e.id}><span>{e.keterangan}</span><b>{rp(e.jumlah)}</b></span>)}
        {!recent.length && <span className="muted"><span>Belum ada transaksi</span></span>}
      </span>
    </button>
  );
}

/* ── Deck: scroll-snap native, jadi scroll vertikal dari atas kartu tetap jalan ── */
function Deck({ items, activeId, onChange, onOpen, recentOf }) {
  const sc = useRef(null);
  const raf = useRef(0);
  const first = useRef(true);
  const cur = useRef({ id: activeId, onChange });
  const n = items.length;
  const idx = Math.max(0, items.findIndex((x) => x.d.id === activeId));
  useEffect(() => { cur.current = { id: activeId, onChange }; });

  const goTo = useCallback((i, instant) => {
    const box = sc.current; const el = box?.children[i];
    if (!el) return;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: instant || reduced() ? 'auto' : 'smooth' });
  }, []);
  const nearest = () => {
    const box = sc.current; if (!box) return 0;
    const mid = box.scrollLeft + box.clientWidth / 2; let best = 0; let bd = Infinity;
    Array.from(box.children).forEach((el, i) => { const dd = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = i; } });
    return best;
  };
  useEffect(() => {
    if (nearest() !== idx || first.current) goTo(idx, first.current);
    first.current = false;
  }, [idx, goTo]);
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const i = nearest(); const id = items[i]?.d.id;
      if (id && id !== cur.current.id) cur.current.onChange(id);
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(n - 1, idx + 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, idx - 1)); }
  };

  return (
    <div className="mk-deck-wrap">
      <div ref={sc} className="mk-deck" tabIndex={n > 1 ? 0 : -1} role="region" aria-roledescription="carousel" aria-label="Kartu dana per divisi. Panah kiri atau kanan untuk ganti divisi."
        onScroll={onScroll} onKeyDown={onKeyDown}>
        {items.map((x, i) => <Pocket key={x.d.id} d={x.d} s={x.s} recent={recentOf(x.d.id)} onOpen={onOpen} index={i} total={n} />)}
      </div>
      {n > 1 && (
        <div className="mk-deck-nav">
          <button type="button" className="mk-icon-btn" onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Divisi sebelumnya"><I n="chevron-left" /></button>
          <div className="mk-dots">
            {items.map((x, i) => (
              <button key={x.d.id} type="button" className={i === idx ? 'on' : ''} aria-label={`${x.d.nama}, kartu ${i + 1} dari ${n}`} aria-current={i === idx ? 'true' : undefined} onClick={() => goTo(i)} />
            ))}
          </div>
          <button type="button" className="mk-icon-btn" onClick={() => goTo(Math.min(n - 1, idx + 1))} disabled={idx === n - 1} aria-label="Divisi berikutnya"><I n="chevron-right" /></button>
        </div>
      )}
    </div>
  );
}

function Segmented({ value, onChange, options, label }) {
  const i = Math.max(0, options.findIndex((o) => o.v === value));
  return (
    <div className="mk-seg" role="radiogroup" aria-label={label}>
      <span className="mk-seg-ind" style={{ width: `${100 / options.length}%`, transform: `translateX(${i * 100}%)` }} aria-hidden="true" />
      {options.map((o) => <button key={o.v} type="button" role="radio" aria-checked={o.v === value} className={o.v === value ? 'on' : ''} onClick={() => onChange(o.v)}>{o.l}</button>)}
    </div>
  );
}

function BudgetField({ d, setBudget }) {
  const [v, setV] = useState(String(d.budget || ''));
  const num = Number(v.replace(/\D/g, '')) || 0;
  return (
    <div className="mk-field">
      <label htmlFor={`bud-${d.id}`}>Budget divisi</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input id={`bud-${d.id}`} className="mk-input" inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} placeholder="Budget (Rp)" />
        <Btn className="mk-btn" disabled={num === Number(d.budget)} onClick={() => setBudget(d.id, num)}>Simpan</Btn>
      </div>
    </div>
  );
}

/* ── Riwayat: izin dan handler sama seperti sebelumnya ── */
function ExpenseRow({ e, ctx, showDiv }) {
  const { isAdmin, actions, me } = ctx;
  const own = e.dibuat_oleh === me.id;
  return (
    <div className="mk-exp">
      <div>
        <span className="mk-exp-title">{e.keterangan}</span>
        <p className="mk-hint">{fmtDate(e.tanggal)}{showDiv ? ` · ${ctx.divisionName(e.division_id)}` : ''} · {ctx.nameOf(e.dibuat_oleh)}</p>
        <p className="mk-hint"><Badge status={e.status} /></p>
        {e.catatan && <p className="mk-hint">Catatan: {e.catatan}</p>}
      </div>
      <b>{rp(e.jumlah)}</b>
      <div className="mk-exp-actions">
        <Btn className="mk-btn mk-btn--sm" onClick={() => actions.openNota(e)}><I n="receipt" /> Lihat nota</Btn>
        {e.nota_drive_url && <a className="mk-btn mk-btn--sm" href={e.nota_drive_url} target="_blank" rel="noopener noreferrer"><I n="folder-open" /> Drive</a>}
        {isAdmin && e.status !== 'disetujui' && <Btn className="mk-btn mk-btn--sm mk-btn--primary" withRipple onClick={() => actions.setExpenseStatus(e, { status: 'disetujui', catatan: null })}>Setujui</Btn>}
        {isAdmin && e.status !== 'ditolak' && <Btn className="mk-btn mk-btn--sm" onClick={() => { const c = window.prompt('Alasan ditolak (boleh kosong)'); if (c !== null) return actions.setExpenseStatus(e, { status: 'ditolak', catatan: c.trim() || null }); return undefined; }}>Tolak</Btn>}
        {(isAdmin || (own && e.status === 'menunggu')) && <Btn className="mk-btn mk-btn--sm mk-btn--danger" aria-label={`Hapus ${e.keterangan}`} onClick={() => actions.deleteExpense(e)}><I n="trash" /></Btn>}
      </div>
    </div>
  );
}

/* ── Sheet detail divisi ── */
function DivisionSheet({ d, s, list, ctx, canAdd, onAdd, onClose }) {
  return (
    <MkSheet title={d.nama} onClose={onClose}>
      <p className="mk-pocket-lbl-d">Sisa dana</p>
      <p className={`mk-detail-bal${s.over ? ' neg' : ''}`}>{rp(s.sisa)}</p>
      {s.over && <p className="mk-warn"><I n="triangle-exclamation" /> Pengeluaran disetujui melebihi budget.</p>}
      <div className="mk-detail-grid">
        <div><small>Budget</small><b>{rp(s.budget)}</b></div>
        <div><small>Disetujui</small><b>{rp(s.approved)}</b></div>
        <div><small>Menunggu</small><b>{rp(s.pending)}</b></div>
      </div>
      {canAdd && <Btn className="mk-btn mk-btn--primary mk-block" withRipple onClick={onAdd}><I n="plus" /> Catat pengeluaran</Btn>}
      {ctx.isAdmin && <BudgetField key={`${d.id}-${d.budget}`} d={d} setBudget={ctx.actions.setBudget} />}
      <h3 className="mk-detail-h">Riwayat divisi ({list.length})</h3>
      {list.length === 0 && <p className="mk-empty">Belum ada pengeluaran.</p>}
      {list.map((e) => <ExpenseRow key={e.id} e={e} ctx={ctx} showDiv={false} />)}
    </MkSheet>
  );
}

/* ── Sheet form pengeluaran: nominal → tanggal → keterangan → nota → submit ── */
function ExpenseFormSheet({ divisionName, f, setF, file, setFile, fileKey, jumlah, dirty, onSubmit, onClose, toast }) {
  const [state, setState] = useState('idle'); // idle | busy | done
  const lock = useRef(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const ready = !!file && !!f.keterangan.trim() && jumlah > 0;
  const submit = async (e) => {
    e.preventDefault();
    if (lock.current) return;
    if (!file) { toast('Foto nota wajib diunggah', 'err'); return; }
    if (!ready) return;
    lock.current = true; setState('busy');
    const ok = await onSubmit();
    lock.current = false;
    if (ok) { setState('done'); timer.current = setTimeout(onClose, 700); } else setState('idle');
  };
  return (
    <MkSheet title={`Catat pengeluaran · ${divisionName}`} onClose={onClose} dirty={dirty && state !== 'done'}>
      <form onSubmit={submit} aria-busy={state === 'busy' || undefined} className="mk-form">
        <div className="mk-field">
          <label htmlFor="x-jml">Nominal (Rp)</label>
          <div className="mk-amount"><span aria-hidden="true">Rp</span>
            <input id="x-jml" inputMode="numeric" autoComplete="off" value={f.jumlah} onChange={(e) => setF((v) => ({ ...v, jumlah: e.target.value.replace(/\D/g, '') }))} placeholder="0" required />
          </div>
          <p className="mk-hint mk-money" aria-live="polite">{jumlah > 0 ? rp(jumlah) : ' '}</p>
        </div>
        <div className="mk-field"><label htmlFor="x-tgl">Tanggal</label><input id="x-tgl" className="mk-input" type="date" value={f.tanggal} onChange={(e) => setF((v) => ({ ...v, tanggal: e.target.value }))} required /></div>
        <div className="mk-field"><label htmlFor="x-ket">Untuk apa</label><input id="x-ket" className="mk-input" value={f.keterangan} onChange={(e) => setF((v) => ({ ...v, keterangan: e.target.value }))} maxLength={300} required /></div>
        <div className="mk-field">
          <label htmlFor="x-file">Foto nota (wajib)</label>
          <input key={fileKey} id="x-file" className="mk-input" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file && <p className="mk-file-note">Dipilih: {file.name}</p>}
          <p className="mk-file-note">JPG, PNG, atau PDF. Foto dikecilkan otomatis. Maksimal 5 MB.</p>
        </div>
        <button type="submit" className={`mk-btn mk-btn--primary mk-block${state === 'busy' ? ' is-loading' : ''}${state === 'done' ? ' is-done' : ''}`}
          disabled={!ready || state !== 'idle'} aria-busy={state === 'busy' || undefined} onPointerDown={ripple}>
          <span className="mk-ripples" aria-hidden="true" />
          {state === 'busy' && <span className="mk-spin" aria-hidden="true" />}
          <span className="mk-btn-label">{state === 'done' ? <><I n="check" /> Tersimpan</> : state === 'busy' ? 'Mengunggah…' : 'Simpan pengeluaran'}</span>
        </button>
      </form>
    </MkSheet>
  );
}

/* ── Halaman Dana ── */
export default function DanaView({ ctx, divFilter, setDivFilter }) {
  const { db, isAdmin, actions, me } = ctx;
  const divs = isAdmin ? db.divisions : db.divisions.filter((d) => d.id === me.division_id);
  const [activeId, setActiveId] = useState(() => (divs.some((d) => d.id === divFilter) ? divFilter : divs[0]?.id || ''));
  const active = divs.find((d) => d.id === activeId) || divs[0];
  const selected = active?.id || '';
  const [scope, setScope] = useState('one'); // one | all (khusus admin)
  const [sheet, setSheet] = useState(null); // null | 'detail' | 'form'
  const [f, setF] = useState(() => ({ tanggal: todayWIB(), keterangan: '', jumlah: '' }));
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const jumlah = Number(String(f.jumlah).replace(/\D/g, '')) || 0;
  const dirty = jumlah > 0 || !!f.keterangan.trim() || !!file;
  const canAdd = !!selected && ctx.canManageDivision(selected);

  const sorted = (arr) => arr.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const items = divs.map((d) => ({ d, s: danaStats(db.expenses, d) }));
  const recentOf = (id) => sorted(db.expenses.filter((e) => e.division_id === id)).slice(0, 2);
  const showAll = isAdmin && scope === 'all';
  const list = sorted(db.expenses.filter((e) => showAll || e.division_id === selected));

  const pick = (id) => { setActiveId(id); setDivFilter(id); };
  const resetDraft = () => { setF((v) => ({ ...v, keterangan: '', jumlah: '' })); setFile(null); setFileKey((k) => k + 1); };
  const submit = async () => {
    const ok = await actions.addExpense({ division_id: selected, tanggal: f.tanggal, keterangan: f.keterangan.trim(), jumlah, file });
    if (ok) resetDraft();
    return !!ok;
  };
  const closeForm = () => { resetDraft(); setSheet(null); };

  return (
    <>
      <div className="mk-page-h"><div><h2>Dana & pengeluaran</h2><p className="mk-hint">Setiap pengeluaran wajib disertai foto nota. Admin yang menyetujui dan mengatur budget.</p></div></div>

      {divs.length === 0 && <p className="mk-empty">{isAdmin ? 'Belum ada divisi.' : 'Kamu belum masuk divisi mana pun. Hubungi admin.'}</p>}
      {divs.length > 0 && <Deck items={items} activeId={selected} onChange={pick} onOpen={(id) => { pick(id); setSheet('detail'); }} recentOf={recentOf} />}

      {canAdd && <Btn className="mk-btn mk-btn--primary mk-block mk-cta" withRipple onClick={() => setSheet('form')}><I n="plus" /> Catat pengeluaran{dirty ? ' (draf)' : ''}</Btn>}

      <section className="mk-sec" aria-busy={undefined}>
        <div className="mk-sec-h"><h2>Riwayat</h2><small>{list.length} catatan</small></div>
        {isAdmin && divs.length > 1 && (
          <Segmented label="Cakupan riwayat" value={scope} onChange={setScope} options={[{ v: 'one', l: active?.nama || 'Divisi ini' }, { v: 'all', l: 'Semua divisi' }]} />
        )}
        {list.length === 0 && <p className="mk-empty">Belum ada pengeluaran.</p>}
        {list.map((e) => <ExpenseRow key={e.id} e={e} ctx={ctx} showDiv={showAll} />)}
      </section>

      {sheet === 'detail' && active && (
        <DivisionSheet d={active} s={danaStats(db.expenses, active)} list={sorted(db.expenses.filter((e) => e.division_id === active.id))} ctx={ctx}
          canAdd={canAdd} onAdd={() => setSheet('form')} onClose={() => setSheet(null)} />
      )}
      {sheet === 'form' && active && (
        <ExpenseFormSheet divisionName={active.nama} f={f} setF={setF} file={file} setFile={setFile} fileKey={fileKey} jumlah={jumlah} dirty={dirty}
          onSubmit={submit} onClose={closeForm} toast={actions.toast} />
      )}
    </>
  );
}
