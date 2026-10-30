// Tumpukan kartu ala dompet iOS. Semua posisi = fungsi dari (pos, lift) supaya gerakan drag, tombol, dan keyboard
// memakai satu jalur animasi. Slot di-key per (kartu, posisi) sehingga setelah reorder tiap slot mulai bersih.
import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { EASE_OUT, prefersReduced } from '@/lib/motion';
import AnimatedNumber from './AnimatedNumber';
import { NEW_CARD, rp } from './format';

const Y = [0, -14, -28, -28];
const S = [1, 0.94, 0.88, 0.88];
const OP = [1, 0.92, 0.78, 0];
const SPRING = { type: 'spring', stiffness: 320, damping: 30 };
const buzz = () => { try { navigator.vibrate?.(8); } catch { /* tidak semua browser punya */ } };
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function Face({ card }) {
  if (card.key === NEW_CARD) {
    return (
      <div className="pk-face pk-face-new">
        <span className="pk-plus" aria-hidden="true" />
        <strong>Kartu baru</strong>
        <small>Satu kartu = satu kantong, misalnya Bensin, Makan, atau Tabungan.</small>
      </div>
    );
  }
  const { stat, recent } = card;
  const has = stat.hasLedger;
  const ratio = has && stat.topped > 0 ? clamp01(stat.balance / stat.topped) : 0;
  const level = !has ? '' : stat.balance < 0 ? 'bad' : ratio < 0.15 ? 'warn' : '';
  return (
    <div className="pk-face" style={{ background: card.color }}>
      <div className="pk-face-row">
        <span className="pk-face-name">{card.icon ? <i>{card.icon}</i> : null}{card.name}</span>
        <span className="pk-face-label">{has ? 'Sisa saldo' : 'Terpakai'}</span>
      </div>
      <AnimatedNumber className="pk-face-bal" value={has ? stat.balance : stat.spent} />
      {has ? (
        <div className="pk-bar" aria-hidden="true"><i className={level} style={{ transform: `scaleX(${ratio})` }} /></div>
      ) : (
        <span className="pk-face-hint">Belum ada saldo. Atur saldo di detail kartu.</span>
      )}
      <ul className="pk-face-recent">
        {recent.map((r) => (
          <li key={r.id}><span>{r.note || 'Tanpa catatan'}</span><b>-{rp(r.amount).slice(3)}</b></li>
        ))}
        {!recent.length && <li className="muted"><span>Belum ada transaksi</span></li>}
      </ul>
    </div>
  );
}

function Slot({ card, pos, total, lift, onFront, onDetail, onCreate, onSwipe, detailOpen }) {
  const p0 = Math.min(pos, 3);
  const p1 = Math.min(Math.max(pos - 1, 0), 3);
  const y = useTransform(lift, [0, 1], [Y[p0], pos === 0 ? 0 : Y[p1]]);
  const scale = useTransform(lift, [0, 1], [S[p0], pos === 0 ? 1 : S[p1]]);
  const opacity = useTransform(lift, [0, 1], [OP[p0], pos === 0 ? 0 : OP[p1]]);
  const x = useMotionValue(0);
  const dy = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-8, 0, 8]);
  const rotateY = useTransform(x, [-220, 0, 220], [-6, 0, 6]);
  const reduced = prefersReduced();
  const label = card.key === NEW_CARD ? 'Buat kartu baru' : `${card.name}, ${rp(card.stat.hasLedger ? card.stat.balance : card.stat.spent)}`;

  const snapBack = () => {
    animate(x, 0, SPRING); animate(dy, 0, SPRING); animate(lift, 0, SPRING);
  };
  const onDragEnd = (_, { offset, velocity }) => {
    const vertical = Math.abs(offset.y) > Math.abs(offset.x);
    if (vertical && (offset.y < -90 || velocity.y < -500)) {
      snapBack(); buzz();
      card.key === NEW_CARD ? onCreate() : onDetail(card.key);
      return;
    }
    if (!vertical && (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500)) {
      const dir = (offset.x || velocity.x) < 0 ? -1 : 1;
      onSwipe(dir, x, dy);
      return;
    }
    snapBack(); buzz();
  };

  const style = { y, scale, opacity, zIndex: 20 - pos, pointerEvents: pos > 2 ? 'none' : 'auto' };

  if (pos > 0) {
    return (
      <motion.div className="pk-slot" style={style} aria-hidden={pos > 2 ? true : undefined}>
        <button type="button" className="pk-strip" tabIndex={pos > 2 ? -1 : 0} aria-label={`Bawa ke depan: ${label}`} onClick={() => onFront(card.key)}>
          <Face card={card} />
        </button>
      </motion.div>
    );
  }
  return (
    <motion.div className="pk-slot" style={style}>
      <motion.div animate={{ y: detailOpen ? -10 : 0 }} transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE_OUT }}>
        <motion.div
          className="pk-top" role="group" aria-roledescription="kartu" aria-label={`${label}. Kartu ${1} dari ${total}`}
          style={reduced ? undefined : { x, y: dy, rotate, rotateY, transformPerspective: 900 }}
          drag dragDirectionLock dragMomentum={false} dragElastic={0.7} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDrag={(_, i) => lift.set(clamp01(Math.abs(i.offset.x) / 160))}
          onDragStart={(e) => e.target?.setPointerCapture?.(e.pointerId)}
          onDragEnd={onDragEnd}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <Face card={card} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function PocketDeck({ cards, frontKey, onFront, onDetail, onCreate, detailOpen }) {
  const reduced = prefersReduced();
  const lift = useMotionValue(0);
  const busy = useRef(false);
  const wheelAt = useRef(0);
  const n = cards.length;
  const idx = Math.max(0, cards.findIndex((c) => c.key === frontKey));
  const ordered = [...cards.slice(idx), ...cards.slice(0, idx)];
  const front = ordered[0];

  // Komit perpindahan: reset lift dulu, baru ganti urutan secara sinkron (tidak ada frame yang meleset).
  const commit = (key) => { lift.set(0); flushSync(() => onFront(key)); buzz(); };

  const next = async () => {
    if (n < 2 || busy.current) return;
    busy.current = true;
    if (!reduced) await animate(lift, 1, SPRING);
    commit(ordered[1].key);
    busy.current = false;
  };
  const prev = async () => {
    if (n < 2 || busy.current) return;
    busy.current = true;
    const key = ordered[n - 1].key;
    if (reduced) { commit(key); } else {
      lift.set(1); flushSync(() => onFront(key)); buzz();
      await animate(lift, 0, SPRING);
    }
    busy.current = false;
  };
  const bring = async (key) => {
    if (busy.current) return;
    if (ordered[1]?.key === key) return next();
    commit(key);
    return undefined;
  };
  // Swipe kiri/kanan: kartu terbang keluar lalu masuk ke belakang tumpukan.
  const swipe = async (dir, x, dy) => {
    if (n < 2) { animate(x, 0, SPRING); animate(dy, 0, SPRING); animate(lift, 0, SPRING); return; }
    busy.current = true;
    if (reduced) { commit(ordered[1].key); busy.current = false; return; }
    animate(lift, 1, { duration: 0.2, ease: EASE_OUT });
    animate(dy, 0, SPRING);
    await animate(x, dir * 520, { duration: 0.22, ease: EASE_OUT });
    commit(ordered[1].key);
    busy.current = false;
  };

  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); front?.key === NEW_CARD ? onCreate() : onDetail(front.key); }
  };
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    const t = e.timeStamp;
    if (t - wheelAt.current < 500) return;
    wheelAt.current = t;
    e.deltaX > 0 ? next() : prev();
  };

  return (
    <div className="pk-deck-wrap">
      <div className="pk-deck" tabIndex={0} role="region" aria-roledescription="tumpukan kartu" aria-label="Kartu kantong. Panah kiri atau kanan untuk ganti kartu, panah atas untuk detail."
        onKeyDown={onKeyDown} onWheel={onWheel}>
        {ordered.map((card, pos) => (
          <Slot key={`${card.key}:${pos}`} card={card} pos={pos} total={n} lift={lift}
            onFront={bring} onDetail={onDetail} onCreate={onCreate} onSwipe={swipe} detailOpen={detailOpen && pos === 0} />
        ))}
      </div>
      <div className="pk-deck-nav">
        <button type="button" className="pk-nav-btn" onClick={prev} disabled={n < 2} aria-label="Kartu sebelumnya">&lsaquo;</button>
        <div className="pk-dots" role="tablist" aria-label="Posisi kartu">
          {cards.map((c) => (
            <button key={c.key} type="button" role="tab" aria-selected={c.key === front?.key} aria-label={c.key === NEW_CARD ? 'Kartu baru' : c.name}
              className={c.key === front?.key ? 'on' : ''} onClick={() => bring(c.key)} />
          ))}
        </div>
        <button type="button" className="pk-nav-btn" onClick={next} disabled={n < 2} aria-label="Kartu berikutnya">&rsaquo;</button>
      </div>
    </div>
  );
}
