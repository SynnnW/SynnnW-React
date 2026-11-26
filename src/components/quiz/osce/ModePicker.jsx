// src/components/quiz/osce/ModePicker.jsx
import { Reveal } from '../../BentoKit';

export default function ModePicker({ onPickSolo, onPickCreateRoom, onPickJoinRoom }) {
  return (
    <div className="bn-grid osce-mode-grid">
      <Reveal className="bn-span-3">
        <button type="button" className="qz-subj osce-mode-card" onClick={onPickSolo}>
          <span className="qz-subj-ico"><i className="fa-solid fa-user" aria-hidden="true" /></span>
          <span>
            <span className="qz-subj-name">Solo</span>
            <p className="osce-mode-desc">Bicara sendiri ke klien, yang perannya dimainkan lewat kartu isyarat.</p>
          </span>
          <span className="qz-subj-go"><span>Mulai solo</span><span>→</span></span>
        </button>
      </Reveal>

      <Reveal className="bn-span-3" delay={0.06}>
        <div className="qz-subj osce-mode-card osce-mode-card--multi" role="group" aria-label="Multiplayer">
          <span className="qz-subj-ico"><i className="fa-solid fa-user-group" aria-hidden="true" /></span>
          <span>
            <span className="qz-subj-name">Multiplayer</span>
            <p className="osce-mode-desc">
              <span className="qz-chip"><i className="fa-solid fa-users" aria-hidden="true" /> Maksimal 2 pemain</span>
            </p>
          </span>
          <span className="osce-mode-multi-actions">
            <button type="button" className="qz-btn qz-btn-primary qz-btn-sm" onClick={onPickCreateRoom}>
              <i className="fa-solid fa-plus" aria-hidden="true" /> Buat Room
            </button>
            <button type="button" className="qz-btn qz-btn-sm" onClick={onPickJoinRoom}>
              <i className="fa-solid fa-right-to-bracket" aria-hidden="true" /> Gabung dengan Kode
            </button>
          </span>
        </div>
      </Reveal>
    </div>
  );
}
