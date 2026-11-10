// Wordmark SVG inline (tanpa aset eksternal → tidak ada 404).
import { Link } from 'react-router-dom';
export default function Logo({ size = 32, text = true, to }) {
  const mark = (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="5" y="7" width="40" height="36" rx="12" fill="var(--mf-ink)" />
      <rect x="2" y="4" width="40" height="36" rx="12" fill="var(--mf-primary)" stroke="var(--mf-ink)" strokeWidth="2.5" />
      <path d="M13 21l14-6v14l-14-4z" fill="var(--mf-cream)" stroke="var(--mf-ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 21v6a3 3 0 0 0 6 1" fill="none" stroke="var(--mf-ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 17c2 2 2 8 0 10" fill="none" stroke="var(--mf-ink)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
  const inner = <>{mark}{text && <span>26Menfess</span>}</>;
  return to ? <Link className="mf-logo" to={to} aria-label="26Menfess">{inner}</Link> : <span className="mf-logo">{inner}</span>;
}
