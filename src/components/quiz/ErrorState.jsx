// src/components/quiz/ErrorState.jsx
// State galat yang konsisten untuk area Quiziz: dipakai error boundary shell, dan nanti pemuatan bab/soal.
import { Link } from 'react-router-dom';

export default function ErrorState({
  title = 'Halaman ini gagal dimuat',
  text = 'Terjadi masalah saat menampilkan halaman. Coba lagi, atau kembali ke beranda Quiziz.',
  onRetry,
  retryLabel = 'Coba lagi',
}) {
  return (
    <div className="qz-state" role="alert">
      <span className="qz-state-ico"><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /></span>
      <h2 className="qz-state-title">{title}</h2>
      <p className="qz-state-text">{text}</p>
      <div className="qz-state-actions">
        {onRetry && <button type="button" className="qz-btn qz-btn-primary" onClick={onRetry}>{retryLabel}</button>}
        <Link to="/quiziz" className="qz-btn">Ke beranda Quiziz</Link>
      </div>
    </div>
  );
}
