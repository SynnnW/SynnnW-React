// src/components/quiz/osce/RulesPanel.jsx
import { useState } from 'react';
import { Reveal } from '../../BentoKit';

const STEPS = [
  { n: 1, text: 'Pilih mode dan kasus', icon: 'fa-list-check' },
  { n: 2, text: 'Tekan Mulai untuk membuka studi kasus', icon: 'fa-play' },
  { n: 3, text: 'Ikuti panduan tiap fase', icon: 'fa-route' },
  { n: 4, text: 'Tinjau hasil dan kunci jawaban', icon: 'fa-list-ol' },
];

export default function RulesPanel({ onContinue, continueLabel = 'Lanjut', showSkip = false, onSkip }) {
  const [ack, setAck] = useState(false);

  return (
    <div className="osce-rules">
      <Reveal className="bn-card osce-card">
        <h2 className="osce-h1">Apa ini?</h2>
        <p>
          Latihan ujian praktikum komunikasi Komdas gaya OSCE: kamu berperan sebagai perawat dan bicara
          dengan &ldquo;klien&rdquo; mengikuti studi kasus yang sesuai kisi-kisi.
        </p>
      </Reveal>

      <Reveal className="bn-card osce-card" delay={0.04}>
        <h2 className="osce-h1">Alur singkat</h2>
        <ol className="osce-steps" role="list">
          {STEPS.map((s) => (
            <li key={s.n} className="osce-step">
              <span className="osce-step-ico"><i className={`fa-solid ${s.icon}`} aria-hidden="true" /></span>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="bn-card osce-card" delay={0.08}>
        <h2 className="osce-h1">Mode</h2>
        <div className="osce-rules-modes">
          <div>
            <b><i className="fa-solid fa-user" aria-hidden="true" /> Solo</b>
            <p>Kamu bicara sendiri kepada klien. Ucapan klien muncul sebagai kartu isyarat; kamu mengucapkan bagianmu dengan suara keras.</p>
          </div>
          <div>
            <b><i className="fa-solid fa-user-group" aria-hidden="true" /> Multiplayer (tepat 2 pemain)</b>
            <p>Satu jadi perawat, satu jadi klien/lawan bicara. Tidak bisa lebih dari 2 orang. Room dibagikan lewat kode 6 karakter.</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="bn-card osce-card" delay={0.1}>
        <h2 className="osce-h1">Tombol Bantuan</h2>
        <p>
          Membuka skrip contoh untuk fase aktif. Pemakaian bantuan dihitung dan tampil di hasil. Ujian
          sungguhan tidak ada skrip, jadi pakai seperlunya.
        </p>
      </Reveal>

      <Reveal className="bn-card osce-card" delay={0.12}>
        <h2 className="osce-h1">Aturan main</h2>
        <ul className="osce-md-list">
          <li>Baca kartu perananmu saja (di multiplayer jangan mengintip kartu lawan)</li>
          <li>Bicara seperti di ruang praktik nyata, bukan membaca layar</li>
          <li>Hormati lawan mainmu</li>
          <li>Ini latihan, bukan penilaian resmi</li>
        </ul>
      </Reveal>

      <Reveal className="bn-card osce-card qz-note" delay={0.14}>
        <span className="qz-note-ico"><i className="fa-solid fa-robot" aria-hidden="true" /></span>
        <div>
          <b>Catatan</b>
          <p>Studi kasus dan skrip dibuat dengan bantuan AI dan mengikuti kisi-kisi; bukan pengganti arahan dosen.</p>
        </div>
      </Reveal>

      <div className="osce-rules-ack">
        <label className="osce-checkbox">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
          <span>Saya sudah paham aturannya</span>
        </label>
        <div className="osce-rules-actions">
          {showSkip && (
            <button type="button" className="qz-btn" onClick={onSkip}>Tutup</button>
          )}
          <button type="button" className="qz-btn qz-btn-primary" disabled={!ack} onClick={onContinue}>
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
