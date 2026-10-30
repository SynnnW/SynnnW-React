import { useMemo, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';
import { catLabel, dayLabel, keyOf, localDay, rp } from './format';

/** Isi bottom sheet detail kartu: ringkasan, aksi, riwayat per hari. */
export default function DetailSheet({ card, expenses, ledger, onAction }) {
  const [limit, setLimit] = useState(40);
  const { stat } = card;
  const has = stat.hasLedger;

  const groups = useMemo(() => {
    const rows = [
      ...expenses.filter((e) => keyOf(e.pocketId) === card.key).map((e) => ({ kind: 'out', id: e.id, day: e.date, at: e.createdAt, title: e.note || catLabel(e.category), sub: catLabel(e.category), amount: -e.amount, ref: e })),
      ...ledger.filter((l) => keyOf(l.pocketId) === card.key).map((l) => ({ kind: 'in', id: l.id, day: localDay(l.createdAt), at: l.createdAt, title: l.note || 'Saldo', sub: l.amount < 0 ? 'Penyesuaian turun' : 'Saldo masuk', amount: l.amount })),
    ].sort((a, b) => b.day.localeCompare(a.day) || String(b.at).localeCompare(String(a.at)));
    const shown = rows.slice(0, limit);
    const map = new Map();
    shown.forEach((r) => map.set(r.day, [...(map.get(r.day) || []), r]));
    return { list: [...map.entries()], total: rows.length };
  }, [expenses, ledger, card.key, limit]);

  return (
    <div className="pk-detail">
      <div className="pk-detail-head" style={{ '--pk-c': card.color }}>
        <div>
          <span className="pk-detail-name"><i style={{ background: card.color }} />{card.icon} {card.name}</span>
          <AnimatedNumber className="pk-detail-bal" value={has ? stat.balance : stat.spent} />
          <small>{has ? `Sisa dari ${rp(stat.topped)} yang pernah masuk` : 'Terpakai. Saldo belum diatur.'}</small>
        </div>
      </div>
      <div className="pk-actions pk-actions-grid">
        <button type="button" className="dash-btn primary" onClick={() => onAction('expense')}>Catat</button>
        <button type="button" className="dash-btn" onClick={() => onAction('topup')}>Tambah saldo</button>
        <button type="button" className="dash-btn" onClick={() => onAction('set')}>Atur saldo</button>
        {card.key !== 'umum' && <button type="button" className="dash-btn" onClick={() => onAction('edit')}>Edit kartu</button>}
      </div>
      <div className="pk-history">
        {groups.list.map(([day, rows]) => (
          <section key={day}>
            <h4>{dayLabel(day)}</h4>
            {rows.map((r) => {
              const body = (
                <>
                  <span className="pk-row-main"><b>{r.title}</b><small>{r.sub}</small></span>
                  <span className={`pk-row-amt ${r.amount > 0 ? 'in' : ''}`}>{r.amount > 0 ? '+' : '-'}{rp(r.amount).replace('-', '').slice(3)}</span>
                </>
              );
              return r.kind === 'out'
                ? <button key={r.id} type="button" className="pk-row" onClick={() => onAction('editExpense', r.ref)}>{body}</button>
                : <div key={r.id} className="pk-row static">{body}</div>;
            })}
          </section>
        ))}
        {!groups.total && <p className="dash-empty">Belum ada riwayat di kartu ini.</p>}
        {groups.total > limit && <button type="button" className="dash-btn ghost" onClick={() => setLimit(limit + 40)}>Tampilkan lebih banyak</button>}
      </div>
    </div>
  );
}
