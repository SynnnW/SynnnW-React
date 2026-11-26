// src/components/quiz/osce/Lobby.jsx
import { useState } from 'react';
import { Reveal } from '../../BentoKit';

function Slot({ name, photo, role, empty }) {
  return (
    <div className="nm-inset osce-lobby-slot">
      {empty ? (
        <>
          <span className="osce-lobby-avatar osce-lobby-avatar--empty"><i className="fa-solid fa-user-plus" aria-hidden="true" /></span>
          <span className="osce-lobby-slot-text">Menunggu pemain 2…</span>
        </>
      ) : (
        <>
          <span className="osce-lobby-avatar">
            {photo ? <img src={photo} alt="" /> : <span>{(name || '?').slice(0, 1).toUpperCase()}</span>}
          </span>
          <span className="osce-lobby-slot-text">
            <b>{name || 'Pemain'}</b>
            <span className="qz-chip">{role === 'perawat' ? 'Perawat' : 'Klien/lawan'}</span>
          </span>
        </>
      )}
    </div>
  );
}

export default function Lobby({ room, isHost, caseTitle, onStart, onSwapRoles, onLeave }) {
  const [copied, setCopied] = useState(false);
  if (!room) return null;

  const guestRole = room.host_role === 'perawat' ? 'lawan' : 'perawat';
  const ready = room.status === 'ready';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // abaikan — browser lama tanpa clipboard API
    }
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Simulasi OSCE', text: `Gabung room OSCE saya: ${room.code}` }); } catch { /* dibatalkan pengguna */ }
    }
  };

  return (
    <div className="osce-lobby">
      <Reveal className="bn-card osce-card osce-lobby-code-card">
        <span className="osce-mode-desc">{caseTitle}</span>
        <div className="nm-inset osce-lobby-code">
          {room.code.split('').map((ch, i) => <span key={i}>{ch}</span>)}
        </div>
        <div className="osce-lobby-code-actions">
          <button type="button" className="qz-btn" onClick={copyCode}>
            <i className="fa-solid fa-copy" aria-hidden="true" /> {copied ? 'Tersalin!' : 'Salin kode'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button type="button" className="qz-btn" onClick={share}>
              <i className="fa-solid fa-share-nodes" aria-hidden="true" /> Bagikan
            </button>
          )}
        </div>
      </Reveal>

      <div className="osce-lobby-slots">
        <Slot name={room.host_name} photo={room.host_photo} role={room.host_role} />
        <Slot name={room.guest_name} photo={room.guest_photo} role={guestRole} empty={!room.guest_id} />
      </div>

      <div className="osce-lobby-actions">
        {isHost && (
          <button type="button" className="qz-btn" onClick={onSwapRoles} disabled={!ready}>
            <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden="true" /> Tukar peran
          </button>
        )}
        <button type="button" className="qz-btn qz-btn-ghost" onClick={onLeave}>Keluar room</button>
        {isHost ? (
          <button type="button" className="qz-btn qz-btn-primary" disabled={!ready} onClick={onStart}>
            <i className="fa-solid fa-play" aria-hidden="true" /> Mulai
          </button>
        ) : (
          <span className="osce-mode-desc">Menunggu host memulai sesi…</span>
        )}
      </div>
    </div>
  );
}
