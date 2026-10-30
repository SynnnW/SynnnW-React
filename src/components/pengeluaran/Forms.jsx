import { useState } from 'react';
import { CATEGORIES, PALETTE, digits, fmtDigits, rp, todayISO } from './format';

const Field = ({ label, children, hint }) => (
  <label className="pk-field"><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>
);

/** Catat / edit pengeluaran. `pockets` = [{key,name,color,stat}] */
export function ExpenseForm({ pockets, initial, onSave, onDelete, onClose }) {
  const editing = !!initial.id;
  const [amount, setAmount] = useState(initial.amount ? String(initial.amount) : '');
  const [note, setNote] = useState(initial.note || '');
  const [pocketKey, setPocketKey] = useState(initial.pocketKey);
  const [date, setDate] = useState(initial.date || todayISO());
  const [category, setCategory] = useState(initial.category || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState(0);
  const [sure, setSure] = useState(false);

  const num = Number(digits(amount));
  const pk = pockets.find((p) => p.key === pocketKey);
  // Saldo setelah transaksi ini (kalau edit di kartu yang sama, nominal lama dikembalikan dulu).
  const base = pk?.stat.hasLedger ? pk.stat.balance + (editing && initial.pocketKey === pocketKey ? initial.amount : 0) : null;
  const after = base === null ? null : base - num;

  const save = async () => {
    if (!num) { setErr('Isi nominal dulu.'); return; }
    if (after !== null && after < 0 && warn !== num) { setWarn(num); return; }
    setErr(''); setBusy(true);
    try {
      await onSave({ amount: num, note, category: category || initial.category || 'lainnya', date: date || todayISO(), pocketKey });
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <form className="pk-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <div className="pk-amount">
        <span>Rp</span>
        <input autoFocus inputMode="numeric" autoComplete="off" placeholder="0" aria-label="Nominal"
          value={fmtDigits(amount)} onChange={(e) => { setAmount(digits(e.target.value)); setWarn(0); }} />
      </div>
      <Field label="Catatan"><input className="dash-input" value={note} maxLength={80} placeholder="Bensin" onChange={(e) => setNote(e.target.value)} /></Field>
      <div className="pk-field">
        <span>Kantong</span>
        <div className="pk-chips" role="radiogroup" aria-label="Kantong">
          {pockets.map((p) => (
            <button key={p.key} type="button" role="radio" aria-checked={p.key === pocketKey}
              className={`pk-chip ${p.key === pocketKey ? 'on' : ''}`} onClick={() => { setPocketKey(p.key); setWarn(0); }}>
              <i style={{ background: p.color }} />{p.name}
            </button>
          ))}
        </div>
      </div>
      <Field label="Tanggal"><input className="dash-input" type="date" value={date} max="2100-12-31" onChange={(e) => setDate(e.target.value)} /></Field>
      <div className="pk-field">
        <span>Kategori (opsional)</span>
        <div className="pk-chips">
          {CATEGORIES.map((c) => (
            <button key={c.v} type="button" aria-pressed={category === c.v} className={`pk-chip ${category === c.v ? 'on' : ''}`}
              onClick={() => setCategory(category === c.v ? '' : c.v)}>{c.l}</button>
          ))}
        </div>
      </div>
      {after !== null && num > 0 && <p className={`pk-note ${after < 0 ? 'bad' : ''}`}>Saldo kartu jadi {rp(after)}</p>}
      {warn === num && warn > 0 && <p className="pk-note bad" role="alert">Saldo kartu jadi minus {rp(Math.abs(after))}. Tekan Tetap simpan untuk lanjut.</p>}
      {err && <p className="pk-note bad" role="alert">{err}</p>}
      <div className="pk-actions">
        {editing && (sure
          ? <button type="button" className="dash-btn pk-danger" onClick={() => onDelete(initial.id)}>Ya, hapus transaksi</button>
          : <button type="button" className="dash-btn ghost" onClick={() => setSure(true)}>Hapus</button>)}
        <button type="button" className="dash-btn" onClick={onClose}>Batal</button>
        <button type="submit" className="dash-btn primary" disabled={busy}>{warn === num && warn > 0 ? 'Tetap simpan' : 'Simpan'}</button>
      </div>
    </form>
  );
}

/** Top-up atau "Atur saldo". mode: 'topup' | 'set' */
export function AmountForm({ mode, current, hasLedger, onSubmit, onClose }) {
  const [val, setVal] = useState(mode === 'set' && hasLedger ? String(Math.max(current, 0)) : '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const num = Number(digits(val));
  const target = mode === 'set' ? num : current + num;
  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'topup' && !num) { setErr('Isi nominal top-up.'); return; }
    setBusy(true);
    try { await onSubmit(num); } catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <form className="pk-form" onSubmit={submit}>
      <div className="pk-amount">
        <span>Rp</span>
        <input autoFocus inputMode="numeric" autoComplete="off" placeholder="0" aria-label={mode === 'set' ? 'Saldo yang diinginkan' : 'Nominal top-up'}
          value={fmtDigits(val)} onChange={(e) => setVal(digits(e.target.value))} />
      </div>
      <p className="pk-note">
        {mode === 'set'
          ? `Saldo sekarang ${hasLedger ? rp(current) : 'belum diatur'}. Selisihnya dicatat sebagai baris penyesuaian, riwayat lama tidak berubah.`
          : `Saldo setelah top-up: ${rp(target)}`}
      </p>
      {err && <p className="pk-note bad" role="alert">{err}</p>}
      <div className="pk-actions">
        <button type="button" className="dash-btn" onClick={onClose}>Batal</button>
        <button type="submit" className="dash-btn primary" disabled={busy}>{mode === 'set' ? 'Atur saldo' : 'Tambah saldo'}</button>
      </div>
    </form>
  );
}

/** Kartu baru / edit kartu. */
export function PocketForm({ pocket, canMove, onSave, onMove, onArchive, onClose }) {
  const editing = !!pocket;
  const [name, setName] = useState(pocket?.name || '');
  const [icon, setIcon] = useState(pocket?.icon || '');
  const [color, setColor] = useState(pocket?.color || PALETTE[0].v);
  const [opening, setOpening] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [sure, setSure] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Beri nama kartu.'); return; }
    setBusy(true);
    try { await onSave({ name, icon: icon.trim(), color, openingBalance: Number(digits(opening)) }); }
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <form className="pk-form" onSubmit={submit}>
      <Field label="Nama kartu"><input className="dash-input" autoFocus value={name} maxLength={30} placeholder="Bensin" onChange={(e) => setName(e.target.value)} /></Field>
      <div className="pk-field">
        <span>Warna</span>
        <div className="pk-swatches" role="radiogroup" aria-label="Warna kartu">
          {PALETTE.map((c) => (
            <button key={c.v} type="button" role="radio" aria-checked={color === c.v} aria-label={c.n}
              className={color === c.v ? 'on' : ''} style={{ background: c.v }} onClick={() => setColor(c.v)} />
          ))}
        </div>
      </div>
      <Field label="Ikon (opsional)"><input className="dash-input" value={icon} maxLength={4} placeholder="Emoji atau huruf" onChange={(e) => setIcon(e.target.value)} /></Field>
      {!editing && (
        <Field label="Saldo awal (opsional)">
          <input className="dash-input pk-mono" inputMode="numeric" placeholder="0" value={fmtDigits(opening)} onChange={(e) => setOpening(digits(e.target.value))} />
        </Field>
      )}
      {editing && (
        <div className="pk-field">
          <span>Urutan di tumpukan</span>
          <div className="pk-chips">
            <button type="button" className="pk-chip" disabled={!canMove.back} onClick={() => onMove(-1)}>Maju satu</button>
            <button type="button" className="pk-chip" disabled={!canMove.fwd} onClick={() => onMove(1)}>Mundur satu</button>
          </div>
        </div>
      )}
      {err && <p className="pk-note bad" role="alert">{err}</p>}
      <div className="pk-actions">
        {editing && (sure
          ? <button type="button" className="dash-btn pk-danger" onClick={onArchive}>Ya, arsipkan</button>
          : <button type="button" className="dash-btn ghost" onClick={() => setSure(true)}>Arsipkan</button>)}
        <button type="button" className="dash-btn" onClick={onClose}>Batal</button>
        <button type="submit" className="dash-btn primary" disabled={busy}>{editing ? 'Simpan' : 'Buat kartu'}</button>
      </div>
      {editing && sure && <p className="pk-note">Kartu disembunyikan, bukan dihapus. Transaksi dan saldonya tetap tersimpan.</p>}
    </form>
  );
}
