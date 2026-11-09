// ─── Rules — /26menfess/aturan ───────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { RULES, PROCESS_NOTES } from '@/lib/menfess/rules';

export default function Rules() {
  return (
    <div className="mf" style={{ minHeight: '100dvh' }}>
      <header className="mf-topbar">
        <span style={{ fontFamily: 'var(--mf-font-brand)', fontWeight: 700 }}>📋 Aturan 26Menfess</span>
        <Link to="/26menfess" className="mf-btn mf-btn-ghost" style={{ fontSize: '.82rem' }}>← Kembali</Link>
      </header>

      <main className="mf-page" style={{ paddingTop: 32, maxWidth: 640 }}>
        <h1 style={{ marginBottom: 24 }}>Aturan Lengkap</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {RULES.map(r => (
            <div key={r.id} className="mf-card" style={{ background: r.suggested ? 'white' : 'var(--mf-soft)' }}>
              <h3 style={{ color: 'var(--mf-brick)', marginBottom: 8 }}>
                {r.id}. {r.title}
                {r.suggested && <span style={{ fontSize: '.75rem', background: 'var(--mf-teal)', padding: '2px 6px', borderRadius: 4, marginLeft: 8, fontWeight: 400, verticalAlign: 'middle' }}>tambahan</span>}
              </h3>
              <p style={{ margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>

        <div className="mf-card" style={{ background: 'white', marginBottom: 40 }}>
          <h2 style={{ marginBottom: 12 }}>Ketentuan Proses</h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROCESS_NOTES.map((n, i) => <li key={i} style={{ lineHeight: 1.5 }}>{n}</li>)}
          </ul>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 48 }}>
          <Link to="/26menfess/masuk" className="mf-btn mf-btn-primary">Masuk & Kirim Menfess</Link>
        </div>
      </main>
    </div>
  );
}
