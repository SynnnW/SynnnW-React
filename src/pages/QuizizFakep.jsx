// src/pages/QuizizFakep.jsx
// ─────────────────────────────────────────────────────────────
// Halaman Quiz Keperawatan — wrapper tipis di atas QuizEngine.
// Untuk menambah mata pelajaran BARU: buat file halaman baru
// (contoh: BahasaInggrisQuiz.jsx) dan import QuizEngine di sana.
// Jangan otak-atik file ini kecuali untuk mengubah konfigurasi
// mata pelajaran yang sudah ada.
// ─────────────────────────────────────────────────────────────
import QuizEngine from '../components/quiz/QuizEngine';

export default function QuizizFakep() {
  // Semua konfigurasi default (SUBJECTS, QUIZ_TYPES, getQs) sudah ada
  // di QuizEngine. Tidak perlu props apapun untuk quiz keperawatan.
  return <QuizEngine storagePrefix="qfakep" />;
}