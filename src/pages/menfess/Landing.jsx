// ─── Landing — /26menfess ────────────────────────────────────────────────────
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MfAuthContext } from '@/lib/menfess/useMfAuth';
import { fetchPublicFeed, fetchPublicSettings } from '@/lib/menfess/api';
import { cacheGet, cacheSet, TTL, limitFeedCache } from '@/lib/menfess/cache';
import { WELCOME_TITLE, WELCOME_TEXT, WHAT_IS_TEXT, RULES } from '@/lib/menfess/rules';
import { categoryLabel } from '@/lib/menfess/renderCard';
import { formatRelative } from '@/components/menfess/utils';
import StatusBadge from '@/components/menfess/StatusBadge';
import SongPreviewButton from '@/components/menfess/SongPreviewButton';

export default function Landing() {
  const auth     = useContext(MfAuthContext);
  const navigate = useNavigate();
  const [feed,     setFeed]     = useState(() => cacheGet('feed:public') || []);
  const [loading,  setLoading]  = useState(!cacheGet('feed:public'));
  const [loadMore, setLoadMore] = useState(false);
  const [cursor,   setCursor]   = useState(null);
  const [hasMore,  setHasMore]  = useState(true);
  const [settings, setSettings] = useState(null);

  // Redirect kalau sudah login
  useEffect(() => {
    if (auth?.ready && auth?.user) navigate('/26menfess/app', { replace: true });
  }, [auth?.ready, auth?.user]);

  useEffect(() => {
    loadFeed();
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const s = await fetchPublicSettings();
      setSettings(s);
    } catch { /* ignore */ }
  }

  async function loadFeed(before = null) {
    if (!before) setLoading(true);
    else setLoadMore(true);
    try {
      const items = await fetchPublicFeed({ limit: 12, before });
      if (!before) {
        const limited = limitFeedCache(items);
        setFeed(limited);
        cacheSet('feed:public', limited, TTL.feed);
      } else {
        setFeed(prev => [...prev, ...items]);
      }
      setHasMore(items.length === 12);
      if (items.length) setCursor(items[items.length - 1].posted_at);
    } catch { /* ignore */ }
    finally { setLoading(false); setLoadMore(false); }
  }

  return (
    <div className="mf" style={{ minHeight: '100dvh' }}>

      {/* Topbar ringan */}
      <header className="mf-topbar">
        <span style={{ fontFamily: 'var(--mf-font-brand)', fontWeight: 700, fontSize: '1.1rem' }}>
          📢 26Menfess
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/26menfess/aturan" className="mf-btn mf-btn-ghost" style={{ padding: '8px 12px', fontSize: '.82rem' }}>Aturan</Link>
          <Link to="/26menfess/masuk" className="mf-btn mf-btn-primary" style={{ padding: '8px 16px', fontSize: '.88rem' }}>Masuk</Link>
        </div>
      </header>

      {/* Announcement */}
      {settings?.announcement && (
        <div style={{ background: 'var(--mf-peach)', borderBottom: '2px solid var(--mf-ink)', padding: '10px var(--mf-gap)', textAlign: 'center', fontSize: '.88rem', fontWeight: 600 }}>
          📌 {settings.announcement}
        </div>
      )}

      <main className="mf-page" style={{ paddingTop: 32 }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{ textAlign: 'center', paddingBottom: 48 }}>
          <img
            src="/26menfess/logo-26menfess-web.png"
            alt="26Menfess"
            style={{ maxWidth: 220, width: '100%', margin: '0 auto 24px', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h1>Suarakan, tanpa nama.</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: 420, margin: '12px auto 24px', opacity: .8 }}>
            Ruang ekspresi menfess anonim untuk mahasiswa FKEP 2026.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/26menfess/masuk" className="mf-btn mf-btn-primary">
              📢 Masuk &amp; kirim menfess
            </Link>
            <a
              href="https://www.instagram.com/secretmenfess.26/"
              target="_blank"
              rel="noopener noreferrer"
              className="mf-btn mf-btn-secondary"
            >
              Instagram @secretmenfess.26 ↗
            </a>
          </div>
        </section>

        {/* ── SAMBUTAN ─────────────────────────────────────────────── */}
        <section className="mf-card" style={{ marginBottom: 48, background: 'white' }}>
          <h2 style={{ marginBottom: 16 }}>
            <span style={{
              background: 'var(--mf-peach)',
              padding: '2px 8px',
              borderRadius: 8,
              display: 'inline',
              fontFamily: 'var(--mf-font-brand)',
            }}>
              {WELCOME_TITLE}
            </span>
          </h2>
          {WELCOME_TEXT.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: i === 0 ? 12 : 0 }}>{para}</p>
          ))}
        </section>

        {/* ── APA ITU 26Menfess ─────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ marginBottom: 12 }}>Apa itu 26Menfess?</h2>
          <p style={{ maxWidth: 680, lineHeight: 1.6 }}>{WHAT_IS_TEXT}</p>
        </section>

        {/* ── CARA KERJA ───────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ marginBottom: 20 }}>Cara Kerja</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--mf-gap)' }}>
            {[
              { n: '1', icon: '🔑', t: 'Masuk', d: 'Login dengan Google atau anonim.' },
              { n: '2', icon: '✍️', t: 'Tulis & pilih desain', d: 'Tulis pesan, pilih desain Pink atau Hijau.' },
              { n: '3', icon: '🔍', t: 'Admin meninjau', d: 'Admin memeriksa sebelum diunggah ke IG.' },
              { n: '4', icon: '📸', t: 'Tayang di Instagram', d: 'Menfessmu tayang di @secretmenfess.26.' },
            ].map(s => (
              <div key={s.n} className="mf-card" style={{ background: 'white', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>{s.icon}</p>
                <h3 style={{ marginBottom: 6 }}>{s.n}. {s.t}</h3>
                <p style={{ fontSize: '.88rem', margin: 0, opacity: .75 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ATURAN RINGKAS ───────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ marginBottom: 20 }}>Aturan Utama</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--mf-gap)' }}>
            {RULES.filter(r => !r.suggested).map(r => (
              <div key={r.id} className="mf-card">
                <h3 style={{ color: 'var(--mf-brick)', marginBottom: 8 }}>⛔ {r.title}</h3>
                <p style={{ fontSize: '.88rem', margin: 0 }}>{r.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/26menfess/aturan" className="mf-btn mf-btn-secondary" style={{ fontSize: '.88rem' }}>
              Baca aturan lengkap →
            </Link>
          </div>
        </section>

        {/* ── FEED PUBLIK ──────────────────────────────────────────── */}
        <section>
          <h2 style={{ marginBottom: 20 }}>Sudah tayang di Instagram</h2>

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--mf-gap)' }}>
              {[1,2,3].map(i => <div key={i} className="mf-skeleton" style={{ height: 180 }} />)}
            </div>
          )}

          {!loading && feed.length === 0 && (
            <div className="mf-empty">
              <span className="mf-empty-icon">📭</span>
              <p>Belum ada menfess yang tayang.</p>
            </div>
          )}

          {!loading && feed.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--mf-gap)' }}>
              {feed.map(post => (
                <article key={post.id} className="mf-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="mf-badge" style={{ background: 'var(--mf-soft)' }}>
                      {categoryLabel(post.category)}
                    </span>
                    <StatusBadge status="posted" />
                  </div>
                  {post.to_label && (
                    <p style={{ fontSize: '.82rem', margin: 0, opacity: .7 }}>Untuk: {post.to_label}</p>
                  )}
                  <p style={{ margin: 0, wordBreak: 'break-word', lineHeight: 1.5 }}>{post.body}</p>
                  {post.from_alias && (
                    <p style={{ fontSize: '.82rem', margin: 0, opacity: .7, textAlign: 'right' }}>
                      — {post.from_alias}
                    </p>
                  )}
                  {post.song && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '.82rem', margin: 0, opacity: .75 }}>♪ {post.song}</p>
                      <SongPreviewButton query={post.song} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '.75rem', opacity: .55 }}>{formatRelative(post.posted_at)}</span>
                    {post.ig_url && (
                      <a href={post.ig_url} target="_blank" rel="noopener noreferrer"
                        className="mf-btn mf-btn-secondary" style={{ fontSize: '.75rem', padding: '4px 10px', minHeight: 'auto' }}>
                        Lihat di IG ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {hasMore && feed.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                className="mf-btn mf-btn-secondary"
                onClick={() => loadFeed(cursor)}
                disabled={loadMore}
              >
                {loadMore ? 'Memuat…' : 'Muat lebih banyak'}
              </button>
            </div>
          )}
        </section>

        {/* Footer kecil */}
        <footer style={{ marginTop: 64, textAlign: 'center', opacity: .6, fontSize: '.82rem', paddingBottom: 32 }}>
          <p>
            <a href="https://www.instagram.com/secretmenfess.26/" target="_blank" rel="noopener noreferrer">@secretmenfess.26</a>
            {' · '}
            Dibuat oleh <a href="/" style={{ color: 'inherit' }}>SynnnW</a>
          </p>
        </footer>

      </main>
    </div>
  );
}
