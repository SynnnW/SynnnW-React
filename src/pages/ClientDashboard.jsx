import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import {
  collection, doc, onSnapshot, orderBy, query, where,
  setDoc, addDoc, updateDoc, getDoc, serverTimestamp, limit,
} from 'firebase/firestore';

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `
:root {
  --bg: #070709;
  --bg2: #0d0d0f;
  --text: #ffffff;
  --text-dim: #94a3b8;
  --text-muted: #64748b;
  --accent: #8b5cf6;
  --accent2: #7c3aed;
  --accent3: #a78bfa;
  --glass: rgba(255,255,255,0.03);
  --glass2: rgba(255,255,255,0.06);
  --gborder: rgba(255,255,255,0.08);
  --gborder2: rgba(255,255,255,0.15);
  --border: rgba(255,255,255,0.07);
  --card-bg: rgba(255,255,255,0.03);
  --card-border: rgba(255,255,255,0.08);
  --accent-glow: rgba(139,92,246,0.15);
  --accent-shadow: rgba(139,92,246,0.35);
}

/* ── Layout ── */
.db-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #070709 0%, #0d0d1a 100%);
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  display: flex;
}

.db-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.02);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 50;
}

.db-sidebar-brand {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border);
}

.db-sidebar-brand-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.db-sidebar-brand-logo i { color: var(--accent3); font-size: 1.3rem; }

.db-sidebar-brand-sub {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.db-sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.db-sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.db-sidebar-nav-item i { width: 16px; text-align: center; font-size: 0.9rem; }

.db-sidebar-nav-item:hover {
  background: var(--glass2);
  color: var(--text-dim);
}

.db-sidebar-nav-item.active {
  background: rgba(139,92,246,0.12);
  color: var(--accent3);
  border: 1px solid rgba(139,92,246,0.2);
}

.db-sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
}

.db-sidebar-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(239,68,68,0.2);
  background: rgba(239,68,68,0.06);
  color: #f87171;
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.db-sidebar-logout:hover {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.35);
}

/* ── Notif Bell ── */
.db-notif-wrapper {
  position: relative;
  display: inline-block;
}

.db-notif-bell {
  background: none;
  border: 1px solid var(--gborder);
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.db-notif-bell:hover { background: var(--glass2); color: var(--accent3); }

.db-notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.db-notif-dropdown {
  position: absolute;
  top: 44px;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: #0d0d1a;
  border: 1px solid var(--gborder2);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  z-index: 200;
}

.db-notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gborder);
}

.db-notif-header-title { font-size: 0.82rem; font-weight: 700; color: var(--text); }

.db-notif-mark-all {
  font-size: 0.72rem;
  color: var(--accent3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.db-notif-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gborder);
  cursor: pointer;
  transition: background 0.15s;
}

.db-notif-item:hover { background: var(--glass); }
.db-notif-item.unread { background: rgba(139,92,246,0.04); }

.db-notif-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.db-notif-body { flex: 1; min-width: 0; }
.db-notif-body-title { font-size: 0.8rem; font-weight: 600; color: var(--text); margin-bottom: 2px; }
.db-notif-body-msg { font-size: 0.75rem; color: var(--text-dim); line-height: 1.4; }
.db-notif-body-time { font-size: 0.68rem; color: var(--text-muted); margin-top: 4px; }

/* ── Main ── */
.db-main {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
}

.db-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0;
  gap: 12px;
  flex-wrap: wrap;
}

.db-main-header-left h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0 0 2px;
}

.db-main-header-left h2 em { color: var(--accent3); font-style: italic; }
.db-main-header-sub { font-size: 0.82rem; color: var(--text-muted); margin: 0; }

.db-content { padding: 24px 32px; }

/* ── Quick Stats Bar ── */
.db-stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.db-stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.db-stat-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
.db-stat-value { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.db-stat-sub { font-size: 0.72rem; color: var(--text-dim); }

/* ── Card ── */
.db-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
}

.db-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.db-card-title i { color: var(--accent3); }

/* ── Button ── */
.db-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid var(--gborder);
  background: var(--glass);
  color: var(--text-dim);
  font-family: 'Outfit', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.db-btn:hover { background: var(--glass2); color: var(--text); }

.db-btn.primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
}

.db-btn.primary:hover { box-shadow: 0 6px 20px var(--accent-shadow); transform: translateY(-1px); }

.db-btn.wa {
  background: rgba(37,211,102,0.1);
  border-color: rgba(37,211,102,0.3);
  color: #25d366;
}

.db-btn.wa:hover { background: rgba(37,211,102,0.18); }

.db-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

/* ── Progress Tracker ── */
.db-progress-track {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin: 16px 0;
  overflow-x: auto;
  padding-bottom: 4px;
}

.db-progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 80px;
  position: relative;
}

.db-progress-step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 1;
  border: 2px solid #334155;
  background: var(--bg);
  color: var(--text-muted);
  transition: all 0.3s;
}

.db-progress-step.done .db-progress-step-dot {
  background: #22c55e;
  border-color: #22c55e;
  color: white;
}

.db-progress-step.active .db-progress-step-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
  box-shadow: 0 0 12px var(--accent-glow);
}

.db-progress-step-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 6px;
  text-align: center;
  line-height: 1.3;
}

.db-progress-step.done .db-progress-step-label,
.db-progress-step.active .db-progress-step-label {
  color: var(--text-dim);
  font-weight: 600;
}

.db-progress-connector {
  flex: 1;
  height: 2px;
  background: #334155;
  margin-top: 15px;
  transition: background 0.3s;
}

.db-progress-connector.done { background: #22c55e; }

/* ── Order Card ── */
.db-order-card {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.db-order-info h4 { font-size: 1rem; font-weight: 700; margin: 0 0 4px; }
.db-order-info p { font-size: 0.82rem; color: var(--text-dim); margin: 0 0 6px; }

.db-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.db-status-pending { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.db-status-editing { background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
.db-status-review  { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }
.db-status-complete { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
.db-status-cancelled { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }

/* ── Admin Notes ── */
.db-admin-note {
  background: rgba(139,92,246,0.06);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 14px;
  padding: 18px;
}

.db-admin-note-header { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent3); margin-bottom: 8px; }
.db-admin-note p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.7; margin: 0; }

/* ── Activity Feed ── */
.db-activity-list { display: flex; flex-direction: column; gap: 0; }

.db-activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--gborder);
  align-items: flex-start;
}

.db-activity-item:last-child { border-bottom: none; }

.db-activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.db-activity-text { font-size: 0.85rem; color: var(--text-dim); flex: 1; }
.db-activity-time { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }

/* ── Sub-tabs (Preview) ── */
.db-sub-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--gborder);
  margin-bottom: 24px;
}

.db-sub-tab {
  padding: 10px 20px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.db-sub-tab.active { color: var(--accent3); border-bottom-color: var(--accent3); }

/* ── Video Grid ── */
.db-video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

.db-video-player-wrap {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--gborder);
}

.db-video-aspect {
  position: relative;
  aspect-ratio: 16/9;
  background: #111;
}

.db-video-aspect iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.db-video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  transition: background 0.2s;
  pointer-events: all;
}

.db-video-overlay.playing { background: transparent; }

.db-video-play-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(139,92,246,0.9);
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.db-video-play-btn:hover { background: var(--accent); transform: scale(1.08); }

.db-video-controls {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgba(0,0,0,0.6);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.db-video-ctrl-btn {
  padding: 5px 10px;
  font-size: 0.72rem;
  border-radius: 6px;
  border: 1px solid var(--gborder);
  background: rgba(0,0,0,0.5);
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.15s;
}

.db-video-ctrl-btn:hover { background: var(--glass2); color: var(--text); }

.db-video-label {
  padding: 8px 12px;
  font-size: 0.78rem;
  color: var(--text-dim);
  font-weight: 600;
}

/* ── Poster / Lanyard Grid ── */
.db-poster-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.db-lanyard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }

.db-img-frame {
  background: var(--glass);
  border: 1px solid var(--gborder);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.db-img-frame iframe, .db-img-frame img {
  width: 100%;
  border: none;
  display: block;
}

.db-img-poster-aspect { aspect-ratio: 1 / 1.4; }
.db-img-lanyard-aspect { aspect-ratio: 1 / 2; }
.db-img-label { font-size: 0.72rem; color: var(--text-dim); padding: 6px 8px; text-align: center; font-weight: 600; }

/* ── Empty State ── */
.db-empty-state {
  background: var(--glass);
  border: 1px dashed var(--gborder2);
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
}

.db-empty-state i { font-size: 2.5rem; color: var(--accent3); opacity: 0.4; display: block; margin-bottom: 14px; }
.db-empty-state h4 { font-size: 1rem; margin: 0 0 8px; }
.db-empty-state p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.7; margin: 0 0 16px; }

/* ── Payment ── */
.db-payment-section { display: flex; flex-direction: column; gap: 20px; }

.db-payment-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 12px 0;
}

.db-locked-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Invoices ── */
.db-invoice-card {
  background: var(--glass);
  border: 1px dashed rgba(139,92,246,0.2);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.db-invoice-left .inv-num { font-size: 0.72rem; color: var(--accent3); font-weight: 700; letter-spacing: 0.1em; margin-bottom: 4px; }
.db-invoice-left .inv-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
.db-invoice-left .inv-date { font-size: 0.78rem; color: var(--text-muted); }
.db-invoice-right { text-align: right; }
.db-invoice-right .inv-total { font-size: 1.1rem; font-weight: 700; color: var(--accent3); }
.db-invoice-right .inv-status { font-size: 0.72rem; color: var(--text-dim); margin-top: 2px; }

/* ── Rating Stars ── */
.db-star-row { display: flex; gap: 6px; margin: 8px 0; }

.db-star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #334155;
  transition: color 0.15s, transform 0.15s;
  padding: 0;
}

.db-star-btn.active { color: #fbbf24; }
.db-star-btn:hover { transform: scale(1.15); }

/* ── Brief ── */
.db-brief-textarea {
  width: 100%;
  min-height: 100px;
  background: var(--glass);
  border: 1px solid var(--gborder2);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.db-brief-textarea:focus { border-color: var(--accent3); }

.db-form-input {
  width: 100%;
  background: var(--glass);
  border: 1px solid var(--gborder2);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.db-form-input:focus { border-color: var(--accent3); }
.db-form-input::placeholder { color: var(--text-muted); }
.db-form-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 6px; }

/* ── Settings Toggle ── */
.db-toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--gborder);
}

.db-toggle-row:last-child { border-bottom: none; }
.db-toggle-label { font-size: 0.88rem; color: var(--text-dim); }

.db-toggle {
  position: relative;
  width: 40px;
  height: 22px;
}

.db-toggle input { opacity: 0; width: 0; height: 0; }

.db-toggle-slider {
  position: absolute;
  inset: 0;
  background: #334155;
  border-radius: 22px;
  cursor: pointer;
  transition: background 0.2s;
}

.db-toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  left: 3px;
  top: 3px;
  transition: transform 0.2s;
}

.db-toggle input:checked + .db-toggle-slider { background: var(--accent); }
.db-toggle input:checked + .db-toggle-slider::before { transform: translateX(18px); }

/* ── Mobile ── */
@media (max-width: 768px) {
  .db-sidebar {
    position: fixed;
    bottom: 0; left: 0; right: 0; top: auto;
    width: 100%;
    height: 64px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0 8px;
    border-top: 1px solid rgba(255,255,255,0.07);
    border-right: none;
    z-index: 100;
    overflow: visible;
  }
  .db-sidebar-brand { display: none; }
  .db-sidebar-nav {
    flex-direction: row;
    gap: 0;
    padding: 0;
    flex: 1;
    justify-content: space-around;
  }
  .db-sidebar-footer { display: none; }
  .db-sidebar-nav-item {
    flex-direction: column;
    gap: 3px;
    padding: 6px 10px;
    font-size: 0.55rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    align-items: center;
    min-width: 48px;
    min-height: 44px;
  }
  .db-sidebar-nav-item i { width: auto; font-size: 1rem; }
  .db-sidebar-logout-mobile {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    background: none;
    border: none;
    color: #f87171;
    font-family: 'Outfit', sans-serif;
    font-size: 0.55rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    min-width: 48px;
    min-height: 44px;
  }
  .db-main { padding-bottom: 80px; }
  .db-content { padding: 16px; }
  .db-main-header { padding: 16px 16px 0; }
  .db-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .db-video-grid { grid-template-columns: 1fr; }
  .db-poster-grid { grid-template-columns: repeat(2, 1fr); }
  .db-lanyard-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 480px) {
  .db-stats-bar { grid-template-columns: 1fr 1fr; gap: 8px; }
}
`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 172800) return 'kemarin';
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function formatRupiah(n) {
  if (!n) return 'Rp 0';
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function extractDriveId(url) {
  if (!url) return null;
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function notifIconStyle(type) {
  const map = {
    file_ready:         { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80', icon: 'fa-file-circle-check' },
    status_changed:     { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', icon: 'fa-arrow-right-arrow-left' },
    admin_message:      { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa', icon: 'fa-message' },
    payment_confirmed:  { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80', icon: 'fa-circle-check' },
    project_complete:   { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', icon: 'fa-trophy' },
  };
  return map[type] || { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', icon: 'fa-bell' };
}

// ─────────────────────────────────────────────
// DRIVE VIDEO PLAYER (PATCH 16-A Fix 1)
// Barrier transparan + Play/Stop button
// ─────────────────────────────────────────────
function DriveVideoPlayer({ url, label }) {
  const iframeRef = useRef(null);

  const extractDriveIdLocal = (u) => {
    if (!u) return null;
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ];
    for (const p of patterns) {
      const m = u.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const fileId  = extractDriveIdLocal(url);
  const embedUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview?rm=minimal`
    : null;

  if (!embedUrl) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Drive iframe - langsung bisa diklik */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="autoplay"
          allowFullScreen
          title={label}
        />
        {/* Label bawah */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
          padding: '28px 16px 12px',
        }}>
          <span style={{ fontFamily: 'Outfit', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [previewSubTab, setPreviewSubTab] = useState('video');

  // WIB Clock
  const [clock, setClock] = useState('');

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Firestore data
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dashContent, setDashContent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [existingBrief, setExistingBrief] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  // UI states
  const [notifOpen, setNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile edit
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifWA, setNotifWA] = useState(false);
  const [lang, setLang] = useState('id');

  // Brief
  const [briefNotes, setBriefNotes] = useState('');
  const [briefLink, setBriefLink] = useState('');
  const [briefSaving, setBriefSaving] = useState(false);
  const [briefSaved, setBriefSaved] = useState(false);
  const [briefEditMode, setBriefEditMode] = useState(false);

  // Rating
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSaving, setRatingSaving] = useState(false);
  const [ratingSaved, setRatingSaved] = useState(false);

  // Inject CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch (_) {} };
  }, []);

  // WIB Clock (update every second)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const wib = new Date(now.getTime() + (7 * 60 * 60 * 1000));
      const h = String(wib.getUTCHours()).padStart(2, '0');
      const m = String(wib.getUTCMinutes()).padStart(2, '0');
      const s = String(wib.getUTCSeconds()).padStart(2, '0');
      setClock(`WIB ${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { navigate('/login'); return; }
      // Admin guard — jangan tampilkan ClientDashboard untuk admin
      if (u.email === 'aldokraksaan@gmail.com') {
        navigate('/admin-dashboard', { replace: true });
        return;
      }
      setUser(u);
      // Onboarding — tampilkan sekali saja untuk user baru
      const seen = localStorage.getItem('onboarding_seen_' + u.uid);
      if (!seen) setShowOnboarding(true);
    });
    return () => unsub();
  }, [navigate]);

  // Firestore listeners — hanya setelah user siap
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    // users/{uid}
    const unsubUser = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUserData(d);
        setEditName(d.name || '');
        setEditPhone(d.phone || '');
        setNotifEmail(d.notifEmail || false);
        setNotifWA(d.notifWA || false);
        setLang(d.lang || 'id');
      }
      setLoading(false);
    });

    // dashboardContent/{uid}
    const unsubDash = onSnapshot(doc(db, 'dashboardContent', uid), (snap) => {
      setDashContent(snap.exists() ? snap.data() : null);
    });

    // orders where userId == uid
    const ordersQ = query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const unsubOrders = onSnapshot(ordersQ, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // notifications
    const notifQ = query(
      collection(db, 'notifications'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsubNotif = onSnapshot(notifQ, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // activities
    const actQ = query(
      collection(db, 'activities'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const unsubAct = onSnapshot(actQ, (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // brief
    const unsubBrief = onSnapshot(doc(db, 'briefs', uid), (snap) => {
      setExistingBrief(snap.exists() ? snap.data() : null);
    });

    // review (cek apakah sudah ada)
    const reviewQ = query(
      collection(db, 'reviews'),
      where('userId', '==', uid),
      limit(1)
    );
    const unsubReview = onSnapshot(reviewQ, (snap) => {
      setExistingReview(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    });

    return () => {
      unsubUser(); unsubDash(); unsubOrders();
      unsubNotif(); unsubAct(); unsubBrief(); unsubReview();
    };
  }, [user]);

  // Onboarding dismiss
  const dismissOnboarding = () => {
    if (user) localStorage.setItem('onboarding_seen_' + user.uid, '1');
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // ── Notif helpers ──
  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotifRead = async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
  };

  // ── Progress step ──
  const latestOrder = orders[0] || null;
  const dpPaid = dashContent?.dpPaid || false;
  const finalPaid = dashContent?.finalPaid || false;

  function getProgressSteps() {
    const status = latestOrder?.status || '';
    const hasBrief = !!existingBrief;
    const steps = [
      { label: 'Brief Dikirim', done: hasBrief, active: !hasBrief },
      { label: 'DP Dibayar',    done: dpPaid,    active: hasBrief && !dpPaid },
      { label: 'Pengerjaan',    done: ['review','complete'].includes(status), active: status === 'editing' },
      { label: 'Review Klien',  done: ['complete'].includes(status), active: status === 'review' },
      { label: 'Pelunasan',     done: finalPaid, active: status === 'complete' && !finalPaid },
      { label: 'Selesai',       done: finalPaid && status === 'complete', active: false },
    ];
    return steps;
  }

  // ── Quick stats ──
  const activeProjects = orders.filter(o => !['complete','cancelled'].includes(o.status)).length;
  const totalSpend = orders.reduce((s, o) => s + (o.cartTotal || 0), 0);
  const dc = dashContent;
  const fileCount = dc
    ? Object.values({ ...dc.videos, ...dc.posters, ...dc.lanyards }).filter(Boolean).length
    : 0;
  const pendingReview = latestOrder?.status === 'complete' && !existingReview ? 1 : 0;

  // ── Profile save ──
  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: editName, phone: editPhone });
      await updateProfile(auth.currentUser, { displayName: editName });
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setProfileSaving(false); }
  };

  // ── Settings save ──
  const saveSettings = async (field, value) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { [field]: value });
  };

  // ── Brief submit ──
  const handleBriefSubmit = async () => {
    if (!user) return;
    setBriefSaving(true);
    try {
      await setDoc(doc(db, 'briefs', user.uid), {
        notes: briefNotes,
        driveLink: briefLink,
        submittedAt: serverTimestamp(),
        userId: user.uid,
        orderId: latestOrder?.id || '',
      });
      setBriefSaved(true);
      setBriefEditMode(false);
      setTimeout(() => setBriefSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setBriefSaving(false); }
  };

  // ── Rating submit ──
  const handleRatingSubmit = async () => {
    if (!user || ratingScore === 0) return;
    setRatingSaving(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        orderId: latestOrder?.id || '',
        rating: ratingScore,
        comment: ratingComment,
        createdAt: serverTimestamp(),
      });
      setRatingSaved(true);
    } catch (e) { console.error(e); }
    finally { setRatingSaving(false); }
  };

  // ── Render video/poster/lanyard slots ──
  function renderVideoSlots() {
    if (!dc?.videos) return null;
    const main = [], rev = [];
    for (let i = 1; i <= 10; i++) { if (dc.videos[`v${i}`]) main.push({ url: dc.videos[`v${i}`], label: `Video ${i}` }); }
    for (let i = 1; i <= 10; i++) { if (dc.videos[`rev${i}`]) rev.push({ url: dc.videos[`rev${i}`], label: `Revisi ${i}` }); }

    if (main.length + rev.length === 0) return null;
    return (
      <>
        {main.length > 0 && (
          <>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '12px' }}>Video Utama</p>
            <div className="db-video-grid" style={{ marginBottom: '24px' }}>
              {main.map((v, i) => <DriveVideoPlayer key={i} url={v.url} label={v.label} />)}
            </div>
          </>
        )}
        {rev.length > 0 && (
          <>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '12px' }}>Video Revisi</p>
            <div className="db-video-grid">
              {rev.map((v, i) => <DriveVideoPlayer key={i} url={v.url} label={v.label} />)}
            </div>
          </>
        )}
      </>
    );
  }

  function renderPosterSlots() {
    if (!dc?.posters) return null;
    const items = [];
    for (let i = 1; i <= 10; i++) { if (dc.posters[`p${i}`]) items.push({ url: dc.posters[`p${i}`], label: `Poster ${i}` }); }
    for (let i = 1; i <= 10; i++) { if (dc.posters[`rev${i}`]) items.push({ url: dc.posters[`rev${i}`], label: `Revisi ${i}` }); }
    if (dc.posters.final) items.push({ url: dc.posters.final, label: 'Final' });
    if (items.length === 0) return null;
    return (
      <div className="db-poster-grid">
        {items.map((p, i) => {
          const driveId = extractDriveId(p.url);
          return (
            <div key={i} className="db-img-frame">
              <div className="db-img-poster-aspect">
                {driveId ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview?rm=minimal`}
                    title={p.label}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <img src={p.url} alt={p.label} style={{ objectFit: 'cover', height: '100%' }} />
                )}
              </div>
              <div className="db-img-label">{p.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderLanyardSlots() {
    if (!dc?.lanyards) return null;
    const items = [];
    for (let i = 1; i <= 10; i++) { if (dc.lanyards[`l${i}`]) items.push({ url: dc.lanyards[`l${i}`], label: `Lanyard ${i}` }); }
    for (let i = 1; i <= 10; i++) { if (dc.lanyards[`rev${i}`]) items.push({ url: dc.lanyards[`rev${i}`], label: `Revisi ${i}` }); }
    if (dc.lanyards.final) items.push({ url: dc.lanyards.final, label: 'Final' });
    if (items.length === 0) return null;
    return (
      <div className="db-lanyard-grid">
        {items.map((l, i) => {
          const driveId = extractDriveId(l.url);
          return (
            <div key={i} className="db-img-frame">
              <div className="db-img-lanyard-aspect">
                {driveId ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview?rm=minimal`}
                    title={l.label}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <img src={l.url} alt={l.label} style={{ objectFit: 'cover', height: '100%' }} />
                )}
              </div>
              <div className="db-img-label">{l.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const displayName = userData?.name || user?.displayName || 'Pengguna';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontFamily: 'Outfit, sans-serif' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER TABS
  // ─────────────────────────────────────────────

  const steps = getProgressSteps();

  return (
    <div className="db-page">
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <div className="db-sidebar-brand-logo">
            <i className="fa-solid fa-sparkles" /> SynnnW
          </div>
          <div className="db-sidebar-brand-sub">Client Dashboard</div>
        </div>

        <nav className="db-sidebar-nav">
          {[
            { id: 'overview',   icon: 'fa-house',        label: 'Overview' },
            { id: 'preview',    icon: 'fa-folder-open',  label: 'Preview File' },
            { id: 'payment',    icon: 'fa-credit-card',  label: 'Pembayaran' },
            { id: 'invoices',   icon: 'fa-file-invoice', label: 'Invoices' },
            { id: 'profile',    icon: 'fa-user',         label: 'Profil' },
          ].map(t => (
            <button
              key={t.id}
              className={`db-sidebar-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <i className={`fa-solid ${t.icon}`} /> {t.label}
            </button>
          ))}
          {/* Mobile-only logout in bottom nav */}
          <button className="db-sidebar-logout-mobile" onClick={handleLogout} style={{ display: 'none' }} id="mobile-logout-btn">
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '1rem' }} />
            Logout
          </button>
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-sidebar-logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="db-main">
        {/* Header */}
        <div className="db-main-header">
          <div className="db-main-header-left">
            <h2>Halo, <em>{displayName}</em></h2>
            <p className="db-main-header-sub">
              {latestOrder?.projectName ? `Proyek: ${latestOrder.projectName}` : 'Selamat datang di dashboard klien SynnnW Studio'}
              {clock && <span style={{ marginLeft: 12, fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent3)', letterSpacing: '0.08em' }}>{clock}</span>}
            </p>
          </div>
          {/* Notification Bell */}
          <div className="db-notif-wrapper">
            <button className="db-notif-bell" onClick={() => setNotifOpen(o => !o)}>
              <i className="fa-solid fa-bell" />
              {unreadCount > 0 && <span className="db-notif-badge">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="db-notif-dropdown">
                <div className="db-notif-header">
                  <span className="db-notif-header-title">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button className="db-notif-mark-all" onClick={markAllRead}>Tandai semua dibaca</button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Belum ada notifikasi
                  </div>
                ) : notifications.map(n => {
                  const s = notifIconStyle(n.type);
                  return (
                    <div
                      key={n.id}
                      className={`db-notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => markNotifRead(n.id)}
                    >
                      <div className="db-notif-icon" style={{ background: s.bg, color: s.color }}>
                        <i className={`fa-solid ${s.icon}`} />
                      </div>
                      <div className="db-notif-body">
                        <div className="db-notif-body-title">{n.title}</div>
                        <div className="db-notif-body-msg">{n.message}</div>
                        <div className="db-notif-body-time">{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="db-content">

          {/* ── QUICK STATS BAR ── */}
          <div className="db-stats-bar">
            <div className="db-stat-card">
              <div className="db-stat-label">Proyek Aktif</div>
              <div className="db-stat-value">{activeProjects}</div>
              <div className="db-stat-sub">sedang berjalan</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Total Dihabiskan</div>
              <div className="db-stat-value" style={{ fontSize: '1rem' }}>{formatRupiah(totalSpend)}</div>
              <div className="db-stat-sub">semua order</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">File Tersedia</div>
              <div className="db-stat-value">{fileCount}</div>
              <div className="db-stat-sub">video / poster / lanyard</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Review Pending</div>
              <div className="db-stat-value" style={{ color: pendingReview ? '#fbbf24' : 'var(--text)' }}>{pendingReview}</div>
              <div className="db-stat-sub">{pendingReview ? 'belum diisi' : 'oke'}</div>
            </div>
          </div>

          {/* ════════════════════════════════
              TAB: OVERVIEW
          ════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div>
              {/* Progress Tracker */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-list-check" /> Progress Proyek</div>
                <div className="db-progress-track">
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                      <div className={`db-progress-step ${step.done ? 'done' : step.active ? 'active' : ''}`} style={{ flex: 1 }}>
                        <div className="db-progress-step-dot">
                          {step.done ? <i className="fa-solid fa-check" /> : i + 1}
                        </div>
                        <div className="db-progress-step-label">{step.label}</div>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`db-progress-connector ${step.done ? 'done' : ''}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order card */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-briefcase" /> Status Order Terbaru</div>
                {latestOrder ? (
                  <div className="db-order-card">
                    <div className="db-order-info">
                      <h4>{latestOrder.projectName || 'Proyek Saya'}</h4>
                      <p>{latestOrder.category} · {formatRupiah(latestOrder.cartTotal)}</p>
                      <span className={`db-status-badge db-status-${latestOrder.status || 'pending'}`}>
                        {latestOrder.status || 'Pending'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button className="db-btn" onClick={() => setActiveTab('preview')}>
                        <i className="fa-solid fa-folder-open" /> Lihat File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="db-empty-state">
                    <i className="fa-solid fa-inbox" />
                    <h4>Belum ada order</h4>
                    <p>Mulai dengan memilih layanan yang sesuai kebutuhan Anda.</p>
                    <button className="db-btn primary" onClick={() => navigate('/price-list')}>
                      Mulai Proyek →
                    </button>
                  </div>
                )}
              </div>

              {/* Pesan dari Admin */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-message" /> Pesan dari Admin</div>
                {dc?.adminNotes ? (
                  <div className="db-admin-note">
                    <div className="db-admin-note-header">Admin · SynnnW Studio</div>
                    <p>{dc.adminNotes}</p>
                  </div>
                ) : (
                  <div className="db-admin-note">
                    <div className="db-admin-note-header">Info Sistem</div>
                    <p>
                      Admin akan segera memperbarui dashboard Anda. Pantau via WhatsApp, notifikasi Gmail,
                      atau halaman ini akan berubah otomatis dalam 24 jam setelah proyek diproses.
                    </p>
                  </div>
                )}
                <div style={{ marginTop: '14px' }}>
                  <a href="https://wa.me/6281252790018" target="_blank" rel="noopener noreferrer">
                    <button className="db-btn wa">
                      <i className="fa-brands fa-whatsapp" /> Hubungi Admin via WhatsApp
                    </button>
                  </a>
                </div>
              </div>

              {/* Live Stream Section */}
              {dc?.streamingLink && (
                <div className="db-card" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="db-card-title"><i className="fa-solid fa-broadcast" style={{ color: '#22c55e' }} /> Live Stream dari Editor</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                    Admin sedang melakukan editing dan screen sharing secara live. Klik play untuk melihat:
                  </p>
                  <div style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(34,197,94,0.2)',
                    background: '#000',
                    marginBottom: '12px'
                  }}>
                    <iframe
                      src={dc.streamingLink}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '12px'
                      }}
                      allowFullScreen
                      allow="fullscreen"
                    />
                  </div>
                </div>
              )}

              {/* Activity Feed */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-clock-rotate-left" /> Aktivitas Terbaru</div>
                {activities.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada aktivitas.</p>
                ) : (
                  <div className="db-activity-list">
                    {activities.map(a => (
                      <div key={a.id} className="db-activity-item">
                        <div className="db-activity-dot" style={{ background: a.actor === 'admin' ? '#a78bfa' : '#60a5fa' }} />
                        <span className="db-activity-text">{a.detail}</span>
                        <span className="db-activity-time">{timeAgo(a.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brief Uploader */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-paper-plane" /> Kirim Brief / Pesan ke Admin</div>
                {existingBrief && !briefEditMode ? (
                  <>
                    <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent3)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Brief terakhir Anda:</p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: '0 0 6px' }}>{existingBrief.notes}</p>
                      {existingBrief.driveLink && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Link: {existingBrief.driveLink}</p>}
                    </div>
                    <button className="db-btn" onClick={() => { setBriefNotes(existingBrief.notes || ''); setBriefLink(existingBrief.driveLink || ''); setBriefEditMode(true); }}>
                      <i className="fa-solid fa-pen" /> Edit Brief
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label className="db-form-label">Catatan atau request untuk proyek Anda</label>
                      <textarea
                        className="db-brief-textarea"
                        placeholder="Tuliskan detail proyek, referensi, atau permintaan khusus..."
                        value={briefNotes}
                        onChange={e => setBriefNotes(e.target.value.slice(0, 500))}
                        maxLength={500}
                      />
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>{briefNotes.length}/500</p>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label className="db-form-label">Link Google Drive (aset, referensi) — opsional</label>
                      <input
                        type="url"
                        className="db-form-input"
                        placeholder="https://drive.google.com/..."
                        value={briefLink}
                        onChange={e => setBriefLink(e.target.value)}
                      />
                    </div>
                    {briefSaved && <p style={{ color: '#4ade80', fontSize: '0.82rem', marginBottom: '10px' }}>✓ Pesan terkirim! Admin akan membaca segera.</p>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="db-btn primary" onClick={handleBriefSubmit} disabled={briefSaving || !briefNotes}>
                        {briefSaving ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-paper-plane" />}
                        {briefSaving ? 'Mengirim...' : 'Kirim'}
                      </button>
                      {briefEditMode && <button className="db-btn" onClick={() => setBriefEditMode(false)}>Batal</button>}
                    </div>
                  </>
                )}
              </div>

              {/* Rating (jika order complete & belum ada review) */}
              {latestOrder?.status === 'complete' && !existingReview && !ratingSaved && (
                <div className="db-card" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
                  <div className="db-card-title"><i className="fa-solid fa-star" style={{ color: '#fbbf24' }} /> Proyek selesai! Bagaimana pengalaman Anda?</div>
                  <div className="db-star-row">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} className={`db-star-btn ${ratingScore >= s ? 'active' : ''}`} onClick={() => setRatingScore(s)}>
                        <i className="fa-solid fa-star" />
                      </button>
                    ))}
                    {ratingScore > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '8px' }}>{ratingScore}/5</span>}
                  </div>
                  <textarea
                    className="db-brief-textarea"
                    placeholder="Komentar opsional (maks. 300 karakter)"
                    value={ratingComment}
                    onChange={e => setRatingComment(e.target.value.slice(0, 300))}
                    style={{ minHeight: '70px', marginTop: '10px' }}
                  />
                  <button className="db-btn primary" style={{ marginTop: '12px' }} onClick={handleRatingSubmit} disabled={ratingSaving || ratingScore === 0}>
                    {ratingSaving ? 'Menyimpan...' : 'Kirim Review'}
                  </button>
                </div>
              )}

              {ratingSaved && (
                <div className="db-card" style={{ textAlign: 'center' }}>
                  <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700 }}>⭐ Terima kasih atas ulasannya!</p>
                </div>
              )}

              {existingReview && (
                <div className="db-card">
                  <div className="db-card-title"><i className="fa-solid fa-star" style={{ color: '#fbbf24' }} /> Review Anda</div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[...Array(existingReview.rating || 0)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star" style={{ color: '#fbbf24', fontSize: '1rem' }} />
                    ))}
                  </div>
                  {existingReview.comment && <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>{existingReview.comment}</p>}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════
              TAB: PREVIEW FILE
          ════════════════════════════════ */}
          {activeTab === 'preview' && (
            <div>
              <div className="db-sub-tabs">
                {['video', 'poster', 'lanyard'].map(t => (
                  <button
                    key={t}
                    className={`db-sub-tab ${previewSubTab === t ? 'active' : ''}`}
                    onClick={() => setPreviewSubTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {previewSubTab === 'video' && (
                <>
                  {renderVideoSlots() || (
                    <div className="db-empty-state">
                      <i className="fa-solid fa-video" />
                      <h4>Video belum tersedia</h4>
                      <p>
                        Admin akan segera menambahkan file Anda.<br />
                        Admin akan membalas melalui WhatsApp atau notifikasi Gmail.<br />
                        Atau halaman ini akan berubah otomatis dalam 24 jam setelah proses selesai.<br />
                        Jika sudah lebih dari 24 jam dan tidak ada perubahan, silakan hubungi:
                      </p>
                      <a href="https://wa.me/6281252790018" target="_blank" rel="noopener noreferrer">
                        <button className="db-btn wa"><i className="fa-brands fa-whatsapp" /> WhatsApp 081252790018</button>
                      </a>
                    </div>
                  )}
                </>
              )}

              {previewSubTab === 'poster' && (
                <>
                  {renderPosterSlots() || (
                    <div className="db-empty-state">
                      <i className="fa-solid fa-image" />
                      <h4>Poster belum tersedia</h4>
                      <p>Admin akan segera menambahkan file poster Anda. Halaman ini otomatis update.</p>
                      <a href="https://wa.me/6281252790018" target="_blank" rel="noopener noreferrer">
                        <button className="db-btn wa"><i className="fa-brands fa-whatsapp" /> WhatsApp 081252790018</button>
                      </a>
                    </div>
                  )}
                </>
              )}

              {previewSubTab === 'lanyard' && (
                <>
                  {renderLanyardSlots() || (
                    <div className="db-empty-state">
                      <i className="fa-solid fa-id-badge" />
                      <h4>Lanyard belum tersedia</h4>
                      <p>Admin akan segera menambahkan file lanyard Anda. Halaman ini otomatis update.</p>
                      <a href="https://wa.me/6281252790018" target="_blank" rel="noopener noreferrer">
                        <button className="db-btn wa"><i className="fa-brands fa-whatsapp" /> WhatsApp 081252790018</button>
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════
              TAB: PEMBAYARAN
          ════════════════════════════════ */}
          {activeTab === 'payment' && (
            <div className="db-payment-section">
              {/* DP */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-coins" /> Tahap Pemberkasan (DP)</div>
                {dpPaid ? (
                  <div className="db-payment-status-row">
                    <i className="fa-solid fa-circle-check" style={{ color: '#4ade80' }} />
                    <span style={{ color: '#4ade80' }}>DP Sudah Dibayar</span>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                      Untuk memulai proyek, silakan lakukan pembayaran DP terlebih dahulu.
                    </p>
                    {dc?.qrisImageUrl && (
                      <img
                        src={dc.qrisImageUrl}
                        alt="QRIS"
                        style={{ width: '250px', borderRadius: '12px', marginBottom: '14px', display: 'block' }}
                      />
                    )}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Halaman QRIS masih dalam tahap pemberkasan — admin akan mengonfirmasi setelah pembayaran.
                    </p>
                    <button className="db-btn primary" onClick={() => navigate('/checkout', { state: { fromDashboard: true } })}>
                      <i className="fa-solid fa-qrcode" /> Lanjut ke Pembayaran →
                    </button>
                  </>
                )}
              </div>

              {/* Final */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-lock-open" /> Pembayaran Final</div>
                {!finalPaid && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                    Selesaikan pembayaran untuk mengunduh file final.
                  </p>
                )}
                {finalPaid && dc?.downloadUrl ? (
                  <a href={dc.downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <button className="db-btn primary">
                      <i className="fa-solid fa-download" /> Unduh File Final
                    </button>
                  </a>
                ) : (
                  <div className="db-locked-btn">
                    <button className="db-btn primary" disabled style={{ cursor: 'not-allowed' }}>
                      <i className="fa-solid fa-lock" /> Unduh File Final
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════
              TAB: INVOICES
          ════════════════════════════════ */}
          {activeTab === 'invoices' && (
            <div>
              <div className="db-card-title" style={{ marginBottom: '20px' }}><i className="fa-solid fa-file-invoice" style={{ color: 'var(--accent3)' }} /> Riwayat Pembayaran</div>
              {orders.length === 0 ? (
                <div className="db-empty-state">
                  <i className="fa-solid fa-file-invoice" />
                  <h4>Belum ada riwayat pembayaran</h4>
                  <p>Order Anda akan muncul di sini setelah checkout.</p>
                </div>
              ) : orders.map(o => (
                <div key={o.id} className="db-invoice-card">
                  <div className="db-invoice-left">
                    <div className="inv-num">#INV-{o.id.slice(0,6).toUpperCase()}</div>
                    <div className="inv-name">{o.projectName || 'Proyek'}</div>
                    <div className="inv-date">{o.timestamp?.toDate().toLocaleDateString('id-ID') || '-'} · {o.category}</div>
                  </div>
                  <div className="db-invoice-right">
                    <div className="inv-total">{formatRupiah(o.cartTotal)}</div>
                    <div className="inv-status">
                      {dashContent?.finalPaid ? '✓ Lunas' : dashContent?.dpPaid ? 'DP Terbayar' : 'Belum Bayar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════════════════════════════════
              TAB: PROFIL
          ════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '560px' }}>
              {/* Info akun */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-user" /> Informasi Akun</div>
                {!isEditingProfile ? (
                  <>
                    {[
                      { label: 'Nama',         val: userData?.name || '-' },
                      { label: 'Email',        val: user?.email || '-' },
                      { label: 'No. Telepon',  val: userData?.phone || '-' },
                      { label: 'Metode Auth',  val: userData?.authMethod || '-' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gborder)' }}>
                        <span style={{ fontSize: '0.83rem', color: 'var(--text-dim)' }}>{row.label}</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{row.val}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <button className="db-btn primary" onClick={() => setIsEditingProfile(true)}>
                        <i className="fa-solid fa-pen" /> Edit Profil
                      </button>
                      {profileSaved && <span style={{ color: '#4ade80', fontSize: '0.82rem', alignSelf: 'center' }}>✓ Tersimpan</span>}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="db-form-label">Nama</label>
                      <input className="db-form-input" value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div>
                      <label className="db-form-label">Email</label>
                      <input className="db-form-input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Email tidak bisa diubah</small>
                    </div>
                    <div>
                      <label className="db-form-label">No. Telepon</label>
                      <input className="db-form-input" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+62 812 3456 7890" />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="db-btn primary" onClick={handleSaveProfile} disabled={profileSaving}>
                        {profileSaving ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-save" />}
                        {profileSaving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button className="db-btn" onClick={() => setIsEditingProfile(false)}>Batal</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences / Settings */}
              <div className="db-card">
                <div className="db-card-title"><i className="fa-solid fa-sliders" /> Preferensi</div>
                <div className="db-toggle-row">
                  <span className="db-toggle-label">Notifikasi Email</span>
                  <label className="db-toggle">
                    <input type="checkbox" checked={notifEmail} onChange={e => { setNotifEmail(e.target.checked); saveSettings('notifEmail', e.target.checked); }} />
                    <span className="db-toggle-slider" />
                  </label>
                </div>
                <div className="db-toggle-row">
                  <span className="db-toggle-label">Notifikasi WhatsApp</span>
                  <label className="db-toggle">
                    <input type="checkbox" checked={notifWA} onChange={e => { setNotifWA(e.target.checked); saveSettings('notifWA', e.target.checked); }} />
                    <span className="db-toggle-slider" />
                  </label>
                </div>
                <div className="db-toggle-row">
                  <span className="db-toggle-label">Bahasa</span>
                  <select
                    value={lang}
                    onChange={e => { setLang(e.target.value); saveSettings('lang', e.target.value); }}
                    style={{ background: 'var(--glass)', border: '1px solid var(--gborder)', borderRadius: '8px', padding: '6px 10px', color: 'var(--text)', fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Logout */}
              <button className="db-sidebar-logout" onClick={handleLogout} style={{ marginTop: '8px' }}>
                <i className="fa-solid fa-right-from-bracket" /> Logout
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ── ONBOARDING TUTORIAL (PATCH 16-A Fix 2) ── */}
      {showOnboarding && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9800,
          background: 'rgba(7,7,9,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '32px 28px',
            maxWidth: 380, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>
              {['👋', '📁', '💳', '🔔'][onboardingStep]}
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', marginBottom: 12, color: '#fff', fontWeight: 300 }}>
              {['Selamat Datang!', 'Tab Preview File', 'Tab Pembayaran', 'Notifikasi'][onboardingStep]}
            </h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              {[
                'Dashboard ini tempat kamu ngikutin progress project yang sedang dikerjakan. Semua update dari admin langsung muncul di sini.',
                'Semua file yang dikirim admin — video, poster, lanyard — bisa dilihat di tab Preview File. Klik Play untuk memutar video.',
                'Pembayaran DP dan pelunasan ada di tab Pembayaran. Setelah lunas, link download file final langsung aktif.',
                'Lonceng di pojok kanan atas akan berdering saat ada update dari admin. Pastikan kamu cek dashboard ini secara rutin.',
              ][onboardingStep]}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '20px 0 12px' }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: i === onboardingStep ? 20 : 6, height: 6,
                  borderRadius: 99, background: i === onboardingStep ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.3s ease',
                }} />
              ))}
            </div>
            <button
              onClick={() => { if (onboardingStep < 3) setOnboardingStep(s => s + 1); else dismissOnboarding(); }}
              style={{
                width: '100%', padding: '12px 0',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none', borderRadius: 99,
                color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {onboardingStep < 3 ? 'Lanjut →' : 'Mulai Pakai Dashboard'}
            </button>
            <button onClick={dismissOnboarding} style={{
              marginTop: 10, background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            }}>
              Lewati
            </button>
          </div>
        </div>
      )}

      {/* Mobile logout visible via CSS */}
      <style>{`@media (max-width: 768px) { #mobile-logout-btn { display: flex !important; } }`}</style>
    </div>
  );
}
