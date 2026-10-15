// src/components/quiz/QuizShell.jsx
// ─────────────────────────────────────────────────────────────
// Pembungkus bersama untuk layar-layar "pemilihan" di Quiziz
// (landing matkul, TM picker, chapter picker, landing UAS):
// ambient glass background + QuizNavbar + container konten.
//
// SENGAJA TIDAK dipakai di layar pengerjaan soal (QuizEngine) atau
// di halaman Materi (MateriBahasaInggris) — keduanya sudah punya
// chrome/navigasi sendiri yang sudah bagus & lengkap, menumpuk
// navbar lagi di atasnya cuma bikin dobel dan berisiko menutupi
// konten (lihat CHANGELOG untuk alasan lengkap).
//
// `maxWidth` opsional kalau suatu halaman butuh lebar beda dari
// default 720px (MateriBahasaInggris & NovelReader tidak pakai Shell
// ini sama sekali karena full-bleed sidebar-nya sendiri).
// ─────────────────────────────────────────────────────────────
import '../../styles/quizGlass.css';
import QuizNavbar from './QuizNavbar';

export default function QuizShell({ children, maxWidth = 720 }) {
  return (
    <div className="qz-app">
      <div className="qz-ambient" aria-hidden="true">
        <span className="qz-orb qz-orb-1" />
        <span className="qz-orb qz-orb-2" />
        <span className="qz-orb qz-orb-3" />
        <span className="qz-grain" />
      </div>

      <QuizNavbar />

      <main className="qz-shell-main">
        <div className="qz-shell-inner" style={{ maxWidth }}>
          {children}
        </div>
      </main>
    </div>
  );
}
