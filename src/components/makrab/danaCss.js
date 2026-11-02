// CSS untuk Dana, tombol, dan refresh Makrab. Di-append terakhir pada <style> Makrab; semua selector di bawah .mk.
export const DANA_CSS = `
/* ── Tombol: ukuran, press-down, loading ── */
.mk .mk-btn, .mk .mk-btn--sm, .mk .mk-chips button, .mk .mk-nav-btn, .mk .mk-back { min-height: 44px; }
.mk .mk-btn { position: relative; transition: background-color .15s, border-color .15s, color .15s, transform .18s cubic-bezier(0.22, 1, 0.36, 1); }
.mk .mk-btn:active:not(:disabled), .mk .mk-icon-btn:active:not(:disabled) { transform: scale(0.98); transition-duration: .09s; }
.mk .mk-icon-btn { transition: background-color .15s, transform .18s cubic-bezier(0.22, 1, 0.36, 1); }
.mk .mk-btn:disabled, .mk .mk-icon-btn:disabled { opacity: .45; cursor: not-allowed; }
.mk .mk-block { display: flex; width: 100%; }
.mk .mk-btn.is-loading { cursor: progress; opacity: 1; }
.mk .mk-btn.is-loading .mk-btn-label { visibility: hidden; }
.mk .mk-btn.is-loading .mk-spin { position: absolute; left: 50%; top: 50%; margin: -9px 0 0 -9px; }
.mk .mk-btn.is-done { opacity: 1; }
.mk .mk-spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: mkSpin .7s linear infinite; }
.mk .mk-btn-label { display: inline-flex; align-items: center; gap: 8px; }
.mk .mk-ripples { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
.mk .mk-ripple { position: absolute; border-radius: 50%; background: currentColor; opacity: .22; transform: scale(0); animation: mkRipple .4s cubic-bezier(0.22, 1, 0.36, 1) forwards; pointer-events: none; }
@keyframes mkRipple { to { transform: scale(1); opacity: 0; } }
@keyframes mkSpin { to { transform: rotate(360deg); } }
.mk .mk-icon-btn.is-busy i { animation: mkSpin .8s linear infinite; }

/* ── Tab bawah: indikator bergeser halus ── */
.mk .mk-bottom button::before { content: ''; position: absolute; top: 0; left: 28%; right: 28%; height: 2px; background: var(--mk-accent); transform: scaleX(0); transition: transform .2s cubic-bezier(0.22, 1, 0.36, 1); }
.mk .mk-bottom button.on::before { transform: scaleX(1); }
.mk .mk-tabs button { transition: color .2s, border-color .2s; }

/* ── Scroll & kerangka ── */
html.mk-route { scroll-behavior: auto; overscroll-behavior-y: contain; }
.mk { overflow-x: clip; }
.mk-shell > div { min-width: 0; }
@media (min-width: 900px) { .mk-side { overflow-y: auto; overscroll-behavior: contain; } }

/* ── Sheet: header tetap, isi scroll sendiri ── */
.mk-overlay { transition: background-color .18s ease; }
.mk-overlay.is-closing { background-color: transparent; }
.mk-overlay.is-closing .mk-sheet { transform: translateY(24px); opacity: 0; transition: transform .18s ease, opacity .18s ease; animation: none; }
.mk-grip-area { flex: 0 0 auto; display: grid; place-items: center; height: 28px; touch-action: none; cursor: grab; }
.mk-grip-area .mk-grip { margin: 0; }
@media (min-width: 900px) { .mk-grip-area { display: none; } }
.mk-sheet-h > h2 { min-width: 0; }

/* ── Kartu divisi (mengikuti pk-face Pengeluaran admin) ── */
.mk-deck-wrap { margin-top: 4px; }
.mk-deck { position: relative; display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none; padding: 2px 2px 6px; outline: none; }
.mk-deck::-webkit-scrollbar { display: none; }
.mk-deck:focus-visible { outline: 2px solid var(--mk-accent); outline-offset: 4px; border-radius: 24px; }
.mk-pocket { flex: 0 0 min(88%, 420px); scroll-snap-align: center; display: flex; flex-direction: column; gap: 10px; min-height: 232px; padding: 20px 22px 18px; text-align: left; border: 1px solid rgba(14, 13, 11, .14); border-radius: 22px; color: #0E0D0B; font: inherit; transition: transform .18s cubic-bezier(0.22, 1, 0.36, 1); }
.mk-pocket:only-child { flex-basis: 100%; max-width: 420px; }
.mk-pocket:active { transform: scale(0.985); transition-duration: .09s; }
.mk-pocket-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.mk-pocket-name { font-weight: 600; font-size: 17px; overflow-wrap: anywhere; }
.mk-pocket-lbl { font-size: 12px; opacity: .72; flex-shrink: 0; }
.mk-pocket-bal { font-weight: 600; font-size: clamp(34px, 10vw, 52px); line-height: 1.05; letter-spacing: -.02em; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.mk-pocket-bal.neg { text-decoration: underline wavy rgba(14, 13, 11, .55); text-underline-offset: 6px; }
.mk-pocket-bar { position: relative; display: block; height: 6px; border-radius: 2px; background: #0E0D0B; overflow: hidden; }
.mk-pocket-bar i { position: absolute; left: 0; top: 0; bottom: 0; transition: width .4s cubic-bezier(0.22, 1, 0.36, 1); }
.mk-pocket-bar i.p { background: repeating-linear-gradient(45deg, #F2EFE6 0 3px, transparent 3px 6px); opacity: .6; }
.mk-pocket-bar i.a { background: #F2EFE6; }
.mk-pocket-hint { font-size: 12.5px; opacity: .75; }
.mk-pocket-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.mk-pocket-stats small { display: block; font-size: 11px; opacity: .7; }
.mk-pocket-stats b { display: block; font-weight: 600; font-size: 12.5px; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.mk-pocket-warn { font-size: 12.5px; font-weight: 600; }
.mk-pocket-recent { margin-top: auto; display: grid; gap: 2px; font-family: var(--d-mono); font-size: 11.5px; }
.mk-pocket-recent > span { display: flex; justify-content: space-between; gap: 10px; opacity: .85; }
.mk-pocket-recent > span > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-pocket-recent b { font-weight: 500; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.mk-pocket-recent .muted { opacity: .6; }
.mk-deck-nav { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; }
.mk-dots { display: flex; align-items: center; }
.mk-dots button { position: relative; width: 24px; height: 44px; padding: 0; border: 0; background: none; }
.mk-dots button::after { content: ''; position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; border-radius: 99px; background: var(--mk-ink-3); transform: translate(-50%, -50%); transition: width .2s, background-color .2s; }
.mk-dots button.on::after { width: 18px; background: var(--mk-accent); }
.mk-cta { margin-top: 8px; }

/* ── Segmented ── */
.mk-seg { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin: 6px 0 4px; border: 1px solid var(--mk-line); border-radius: var(--mk-radius-sm); background: var(--mk-surface-2); }
.mk-seg-ind { position: absolute; left: 0; top: 0; bottom: 0; background: var(--mk-surface); border: 1px solid var(--mk-ink-3); border-radius: var(--mk-radius-sm); transition: transform .22s cubic-bezier(0.22, 1, 0.36, 1); }
.mk-seg button { position: relative; min-height: 44px; padding: 0 10px; border: 0; background: none; color: var(--mk-ink-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-seg button.on { color: var(--mk-ink); font-weight: 500; }

/* ── Detail, form, riwayat ── */
.mk-pocket-lbl-d { font-size: 12px; color: var(--mk-ink-3); }
.mk-detail-bal { font-weight: 600; font-size: clamp(34px, 10vw, 44px); line-height: 1.05; letter-spacing: -.02em; font-variant-numeric: tabular-nums; margin-bottom: 8px; overflow-wrap: anywhere; }
.mk-detail-bal.neg { color: var(--mk-bad); }
.mk-detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 12px 0 16px; }
.mk-detail-grid small { display: block; font-size: 12px; color: var(--mk-ink-3); }
.mk-detail-grid b { font-variant-numeric: tabular-nums; font-size: 13px; overflow-wrap: anywhere; }
.mk-detail-h { margin: 18px 0 4px; font-size: 13px; font-weight: 500; color: var(--mk-ink-3); }
.mk-form .mk-amount { display: flex; align-items: baseline; gap: 10px; padding: 6px 0 10px; border-bottom: 1px solid var(--d-border-strong); }
.mk-form .mk-amount span { font-family: var(--d-mono); color: var(--mk-ink-3); font-size: 18px; }
.mk-form .mk-amount input { flex: 1; min-width: 0; border: 0; background: none; outline: none; color: var(--mk-ink); font-weight: 600; font-size: clamp(30px, 9vw, 40px); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.mk-form .mk-amount:focus-within { border-bottom-color: var(--mk-accent); }
.mk-exp-title { font-weight: 500; overflow-wrap: anywhere; }
.mk-exp > div:first-child { min-width: 0; }
.mk-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
.mk-badge.disetujui { color: var(--mk-ok); }
.mk-badge.ditolak { color: var(--mk-bad); }
.mk-badge.menunggu { color: var(--mk-warn); }

/* ── Pull to refresh ── */
.mk-ptr { position: fixed; z-index: 25; left: 50%; top: calc(env(safe-area-inset-top) + 56px); display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1px solid var(--mk-line); border-radius: 99px; background: var(--mk-surface); color: var(--mk-ink); font-size: 13px; pointer-events: none; }
.mk-ptr .mk-spin.on { width: 16px; height: 16px; }
.mk-ptr-arrow { transition: transform .2s cubic-bezier(0.22, 1, 0.36, 1); }
.mk-ptr-arrow.flip { transform: rotate(180deg); }

@media (hover: none) { .mk .mk-btn:hover, .mk .mk-icon-btn:hover { background-color: revert-layer; } }
@media (prefers-reduced-motion: reduce) {
  .mk .mk-btn, .mk .mk-icon-btn, .mk-pocket, .mk-pocket-bar i, .mk-seg-ind, .mk-dots button::after, .mk-ptr-arrow, .mk .mk-bottom button::before { transition: none !important; }
  .mk .mk-ripple { animation: none; opacity: 0; }
  .mk-overlay.is-closing .mk-sheet { transition: none; }
  .mk .mk-icon-btn.is-busy i { animation: none; }
}
`;
