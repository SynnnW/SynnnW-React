// ─── 26Menfess — MenfessCard ─────────────────────────────────────────────────
// Kartu teks DOM (bukan gambar). Dipakai di feed publik, riwayat client, admin.
// Preview live di composer memakai komponen ini juga.

import { categoryLabel } from '@/lib/menfess/renderCard';
import StatusBadge       from './StatusBadge';
import { formatRelative } from './utils';

/**
 * @param {{
 *   post: object,
 *   showStatus?: boolean,
 *   showActions?: boolean,
 *   onWithdraw?: ()=>void,
 *   onResend?: ()=>void,
 *   compact?: boolean,
 * }} props
 */
export default function MenfessCard({
  post,
  showStatus  = false,
  showActions = false,
  onWithdraw,
  onResend,
  compact     = false,
}) {
  const bgClass = post.design === 'green' ? 'mf-preview-bg-green' : 'mf-preview-bg-pink';
  const canWithdraw = ['pending','hold','approved'].includes(post.status);
  const canResend   = post.status === 'rejected';

  return (
    <article className={`mf-card ${compact ? '' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Kartu visual 4:5 kecil */}
      <div className={`mf-preview ${bgClass}`} style={{ aspectRatio: '4/5', maxWidth: compact ? 120 : 180, flexShrink: 0 }}>
        {post.to_label && <p className="mf-preview-label">Untuk: {post.to_label}</p>}
        <div className="mf-preview-body">{post.body}</div>
        {post.from_alias && <p className="mf-preview-label" style={{ textAlign: 'right' }}>Dari: {post.from_alias}</p>}
        <p className="mf-preview-watermark">@secretmenfess.26</p>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badge kategori */}
        <span className="mf-badge" style={{ background: 'var(--mf-soft)', marginBottom: 6, display: 'inline-flex' }}>
          {categoryLabel(post.category)}
        </span>

        {/* Isi singkat */}
        {!compact && (
          <p style={{ margin: '4px 0', fontSize: '.9rem', wordBreak: 'break-word',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {post.body}
          </p>
        )}

        {/* Songfess */}
        {post.song && (
          <p style={{ fontSize: '.82rem', opacity: .75 }}>♪ {post.song}</p>
        )}

        {/* Status */}
        {showStatus && <StatusBadge status={post.status} />}

        {/* Alasan tolak */}
        {post.status === 'rejected' && post.reject_reason && (
          <p style={{ fontSize: '.82rem', color: 'var(--mf-brick)', marginTop: 4 }}>
            Alasan: {post.reject_reason}{post.public_note ? ` — ${post.public_note}` : ''}
          </p>
        )}

        {/* Hold note */}
        {post.status === 'hold' && post.public_note && (
          <p style={{ fontSize: '.82rem', color: 'var(--mf-ink)', opacity: .7, marginTop: 4 }}>
            {post.public_note}
          </p>
        )}

        {/* Link Instagram */}
        {post.status === 'posted' && post.ig_url && (
          <a
            href={post.ig_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-btn mf-btn-secondary"
            style={{ marginTop: 6, fontSize: '.8rem', padding: '6px 14px' }}
          >
            Lihat di Instagram ↗
          </a>
        )}

        {/* Waktu */}
        <p style={{ fontSize: '.75rem', opacity: .55, marginTop: 4 }}>
          {post.posted_at
            ? `Tayang ${formatRelative(post.posted_at)}`
            : `Dikirim ${formatRelative(post.created_at)}`}
        </p>

        {/* Aksi client */}
        {showActions && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {canWithdraw && onWithdraw && (
              <button className="mf-btn mf-btn-ghost" style={{ fontSize: '.8rem', padding: '6px 12px' }} onClick={onWithdraw}>
                Tarik menfess
              </button>
            )}
            {canResend && onResend && (
              <button className="mf-btn mf-btn-secondary" style={{ fontSize: '.8rem', padding: '6px 12px' }} onClick={onResend}>
                Kirim ulang dengan perbaikan
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
