import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc, getDocs,
  onSnapshot, orderBy, query, serverTimestamp,
  setDoc, updateDoc, where, getDoc,
} from 'firebase/firestore';

const ADMIN_EMAIL = 'aldokraksaan@gmail.com';

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
  }
  .da-app {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
  }
  .da-sidebar {
    width: 260px;
    min-height: 100vh;
    background: rgba(255,255,255,0.02);
    border-right: 1px solid rgba(255,255,255,0.07);
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
  }
  .da-brand {
    padding: 0 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 16px;
  }
  .da-brand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
    display: flex; align-items: center; gap: 10px;
  }
  .da-brand-title em { color: #a78bfa; font-style: italic; }
  .da-brand-sub {
    font-size: 0.62rem; color: var(--text-dim);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-top: 4px; display: block;
  }
  .da-search-wrap {
    padding: 0 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 12px;
    position: relative;
  }
  .da-search-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 9px 12px 9px 34px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.8rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .da-search-input:focus { border-color: rgba(139,92,246,0.4); }
  .da-search-icon {
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 0.75rem;
    pointer-events: none;
  }
  .da-search-results {
    position: absolute;
    top: calc(100% - 8px);
    left: 16px;
    right: 16px;
    background: #1a1a2e;
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 12px;
    z-index: 100;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .da-search-result-item {
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .da-search-result-item:hover { background: rgba(139,92,246,0.08); }
  .da-search-result-item:last-child { border-bottom: none; }
  .da-search-result-label { font-size: 0.75rem; color: var(--text-dim); margin-bottom: 2px; }
  .da-search-result-val { font-size: 0.85rem; color: #fff; font-weight: 500; }
  .da-nav-section-label {
    padding: 4px 24px;
    font-size: 0.6rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-bottom: 4px; margin-top: 12px;
  }
  .da-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px;
    cursor: pointer;
    font-size: 0.88rem; font-weight: 500;
    color: var(--text-dim);
    border-left: 3px solid transparent;
    transition: all 0.18s;
  }
  .da-nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
  .da-nav-item.active {
    background: rgba(139,92,246,0.08);
    color: #a78bfa;
    border-left-color: #a78bfa;
  }
  .da-nav-item i { width: 18px; text-align: center; font-size: 0.9rem; }
  .da-nav-badge {
    margin-left: auto;
    background: rgba(139,92,246,0.15);
    color: #a78bfa;
    font-size: 0.65rem; font-weight: 700;
    padding: 2px 8px; border-radius: 99px;
  }
  .da-nav-badge-red {
    background: rgba(239,68,68,0.15);
    color: #f87171;
    animation: pulse-badge 2s infinite;
  }
  @keyframes pulse-badge { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
  .da-sidebar-footer {
    margin-top: auto;
    padding: 20px 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .da-btn-logout {
    width: 100%;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer; font-weight: 600;
    font-size: 0.82rem;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .da-btn-logout:hover { background: rgba(239,68,68,0.15); }
  .da-main {
    flex: 1;
    min-height: 100vh;
    overflow-y: auto;
    padding: 40px 48px 80px;
  }
  @media (max-width: 900px) {
    .da-main { padding: 24px 16px 60px; }
    .da-sidebar { display: none; }
  }
  .da-page-header {
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  .da-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 300; color: #fff; margin: 0 0 6px;
  }
  .da-page-title em { color: #a78bfa; font-style: italic; }
  .da-page-sub { font-size: 0.82rem; color: var(--text-dim); margin: 0; }
  .da-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(18px);
    margin-bottom: 24px;
  }
  .da-panel-title {
    font-size: 1rem; font-weight: 700;
    color: #fff; margin: 0 0 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .da-panel-title i { color: #a78bfa; }
  .da-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }
  .da-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 20px 22px;
  }
  .da-stat-label {
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-dim); display: block; margin-bottom: 8px;
  }
  .da-stat-val {
    font-size: 1.7rem; font-weight: 700; color: #fff; line-height: 1;
  }
  .da-stat-accent { color: #a78bfa; }
  /* Revenue Chart */
  .da-chart-wrap {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 140px;
    margin-top: 8px;
  }
  .da-chart-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 6px;
    justify-content: flex-end;
    cursor: default;
    position: relative;
  }
  .da-chart-bar {
    width: 100%;
    background: linear-gradient(180deg, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0.2) 100%);
    border-radius: 6px 6px 0 0;
    transition: all 0.3s;
    min-height: 4px;
    position: relative;
  }
  .da-chart-col:hover .da-chart-bar {
    background: linear-gradient(180deg, rgba(167,139,250,0.9) 0%, rgba(139,92,246,0.4) 100%);
  }
  .da-chart-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.7rem;
    color: #fff;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
  }
  .da-chart-col:hover .da-chart-tooltip { opacity: 1; }
  .da-chart-label { font-size: 0.65rem; color: var(--text-muted); }
  /* Table */
  .da-table-wrap { overflow-x: auto; }
  .da-table { width: 100%; border-collapse: collapse; min-width: 600px; }
  .da-table th {
    text-align: left; padding: 12px 16px;
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-dim);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .da-table td {
    padding: 13px 16px;
    font-size: 0.84rem; color: var(--text);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .da-table tbody tr:hover { background: rgba(255,255,255,0.02); }
  .da-table tbody tr.expanded { background: rgba(139,92,246,0.04); }
  .da-expanded-row td { padding: 0; }
  .da-expanded-content {
    padding: 16px 20px;
    background: rgba(139,92,246,0.03);
    border-top: 1px solid rgba(255,255,255,0.05);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 700px) { .da-expanded-content { grid-template-columns: 1fr; } }
  .da-expand-section-title {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;
  }
  .da-internal-notes {
    background: rgba(251,191,36,0.06);
    border: 1px solid rgba(251,191,36,0.15);
    border-radius: 10px;
    padding: 10px 12px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    width: 100%;
    min-height: 70px;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
  }
  /* Status badge */
  .da-status-badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 99px;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.05em;
  }
  .da-status-pending { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .da-status-editing { background: rgba(96,165,250,0.12); color: #60a5fa; }
  .da-status-review { background: rgba(167,139,250,0.12); color: #a78bfa; }
  .da-status-complete { background: rgba(74,222,128,0.12); color: #4ade80; }
  .da-status-cancelled { background: rgba(248,113,113,0.12); color: #f87171; }
  /* Priority badge */
  .da-priority-high { color: #f87171; }
  .da-priority-medium { color: #fbbf24; }
  .da-priority-low { color: #4ade80; }
  /* Filter pills */
  .da-filter-pills {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
  }
  .da-pill {
    padding: 6px 16px; border-radius: 99px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.02);
    color: var(--text-dim);
    font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .da-pill:hover { border-color: rgba(139,92,246,0.4); color: #fff; }
  .da-pill.active {
    background: rgba(139,92,246,0.12);
    border-color: rgba(139,92,246,0.4);
    color: #a78bfa;
  }
  /* Bulk action bar */
  .da-bulk-bar {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    background: rgba(139,92,246,0.08);
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 12px;
    padding: 10px 16px;
    margin-bottom: 16px;
  }
  .da-bulk-count {
    font-size: 0.85rem; font-weight: 600; color: #a78bfa;
  }
  /* Form fields */
  .da-field { display: grid; gap: 7px; margin-bottom: 16px; }
  .da-field label {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-dim);
  }
  .da-input, .da-textarea, .da-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif; font-size: 0.92rem;
    outline: none; box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .da-input:focus, .da-textarea:focus, .da-select:focus {
    border-color: rgba(139,92,246,0.5);
  }
  .da-textarea { min-height: 100px; resize: vertical; }
  .da-select { appearance: none; cursor: pointer; }
  .da-form-grid { display: grid; gap: 16px; }
  .da-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  /* Video/Poster/Lanyard link grid */
  .da-link-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  @media (max-width: 700px) { .da-link-grid { grid-template-columns: 1fr; } }
  .da-link-row {
    display: flex; align-items: center; gap: 8px;
  }
  .da-link-label {
    font-size: 0.7rem; font-weight: 600; color: var(--text-dim);
    min-width: 70px; white-space: nowrap;
  }
  .da-link-input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #fff;
    padding: 8px 10px;
    font-family: 'Outfit', sans-serif; font-size: 0.8rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .da-link-input:focus { border-color: rgba(139,92,246,0.4); }
  .da-section-divider {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-dim);
    padding: 10px 0 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin-top: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .da-section-divider i { color: #a78bfa; font-size: 0.75rem; }
  /* Buttons */
  .da-btn {
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.3);
    color: #a78bfa;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600; font-size: 0.87rem;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .da-btn:hover { background: rgba(139,92,246,0.18); }
  .da-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .da-btn-green {
    background: rgba(34,197,94,0.1);
    border-color: rgba(34,197,94,0.3);
    color: #86efac;
  }
  .da-btn-green:hover { background: rgba(34,197,94,0.18); }
  .da-btn-red {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.25);
    color: #f87171;
    padding: 6px 12px;
    font-size: 0.77rem;
  }
  .da-btn-red:hover { background: rgba(239,68,68,0.15); }
  .da-btn-yellow {
    background: rgba(251,191,36,0.08);
    border-color: rgba(251,191,36,0.25);
    color: #fbbf24;
  }
  .da-btn-yellow:hover { background: rgba(251,191,36,0.14); }
  .da-btn-sm {
    padding: 6px 12px; font-size: 0.77rem; border-radius: 8px;
  }
  .da-btn-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .da-msg-success { font-size: 0.85rem; color: #86efac; }
  .da-msg-error { font-size: 0.85rem; color: #f87171; }
  .da-checkbox {
    width: 16px; height: 16px; cursor: pointer;
    accent-color: #8b5cf6;
  }
  .da-send-notif-modal {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .da-send-notif-box {
    background: #0f0f1a;
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 20px;
    padding: 28px;
    width: 100%; max-width: 480px;
  }
  .da-send-notif-title {
    font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .da-send-notif-title i { color: #a78bfa; }
  .da-toggle-wrap {
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  }
  .da-toggle {
    position: relative; width: 42px; height: 24px;
    background: rgba(255,255,255,0.1); border-radius: 99px;
    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
  }
  .da-toggle.on { background: rgba(139,92,246,0.7); }
  .da-toggle::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    background: #fff; border-radius: 50%;
    transition: transform 0.2s;
  }
  .da-toggle.on::after { transform: translateX(18px); }
  .da-toggle-label { font-size: 0.88rem; color: var(--text-dim); }
  .da-cat-cols {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px;
  }
  @media (max-width: 700px) { .da-cat-cols { grid-template-columns: 1fr; } }
  .da-cat-col {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 16px;
  }
  .da-cat-col-title {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;
  }
  .da-cat-col-val {
    font-size: 1.5rem; font-weight: 700; color: #fff;
  }
  .da-cat-col-sub { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
  .da-deadline-warn {
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 14px; padding: 14px 18px;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
    color: #f87171; font-size: 0.85rem;
  }
  .da-editor-order-select { display: grid; gap: 8px; margin-bottom: 24px; }
  .da-qris-preview { margin-top: 12px; }
  .da-qris-preview img {
    width: 200px; height: 200px;
    object-fit: contain;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; background: rgba(255,255,255,0.05);
  }
  .da-customer-table-wrap { overflow-x: auto; }
`;

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PRICES = [
  { id_lokal: 've1', name: 'Editing Film Pendek Sekolah', category: 'video', price: 150000, origPrice: 250000, description: 'Editing film pendek untuk tugas sekolah/kampus. Color grading, sound mixing, subtitle.', status: 'active', qty: 99 },
  { id_lokal: 've2', name: 'Editing Video Tugas Sekolah (Individu)', category: 'video', price: 75000, origPrice: 120000, description: 'Video presentasi, tugas PR, vlog sekolah. Individu per project.', status: 'active', qty: 99 },
  { id_lokal: 've_sma2', name: 'Editing Video Tugas SMA (Kelompok)', category: 'video', price: 125000, origPrice: 200000, description: 'Editing video tugas SMA untuk kelompok 2-8 orang. Lebih dari 8 orang ada tambahan biaya.', status: 'active', qty: 99 },
  { id_lokal: 've_kuliah1', name: 'Editing Video Kuliah/Ospek (Individu)', category: 'video', price: 75000, origPrice: 120000, description: 'Editing video project kuliah, ospek, untuk proyek individu.', status: 'active', qty: 99 },
  { id_lokal: 've_kuliah2', name: 'Editing Video Kuliah (Kelompok)', category: 'video', price: 135000, origPrice: 220000, description: 'Editing video kuliah untuk kelompok 2-8 orang. Lebih dari 8 orang ada biaya tambah per orang.', status: 'active', qty: 99 },
  { id_lokal: 've3', name: 'Custom Editing (Tanya Dulu)', category: 'video', price: 0, origPrice: 0, description: 'Iklan, company profile, wedding highlight, dll. Diskusikan dulu.', status: 'active', qty: 99, custom: true },
  { id_lokal: 'm1', name: 'Motion Graphic & Animasi', category: 'motion', price: 0, origPrice: 0, description: 'Animasi logo, intro video, bumper, presentasi. Segera hadir.', status: 'coming_soon', qty: 0 },
  { id_lokal: 'dg1', name: 'Poster Lomba/Kompetisi', category: 'design', price: 150000, origPrice: 250000, description: 'Poster event, lomba, kompetisi. Siap print & digital.', status: 'active', qty: 99 },
  { id_lokal: 'dg2', name: 'Poster Tugas/PR Sekolah', category: 'design', price: 50000, origPrice: 80000, description: 'Poster tugas, PR, keperluan sekolah. Cepat dan rapi.', status: 'active', qty: 99 },
  { id_lokal: 'dg3', name: 'Banner & Spanduk Acara', category: 'design', price: 75000, origPrice: 120000, description: 'Banner, spanduk, backdrop event. Di luar biaya cetak.', status: 'active', qty: 99 },
  { id_lokal: 'dg4', name: 'Desain Lanyard / ID Card', category: 'design', price: 100000, origPrice: 170000, description: 'Lanyard + ID card event/organisasi. Siap cetak. Di luar biaya cetak.', status: 'active', qty: 99 },
  { id_lokal: 'dg5', name: 'Desain Logo & Brand Identity', category: 'design', price: 75000, origPrice: 120000, description: 'Logo bisnis, komunitas, personal brand. PNG, SVG, AI.', status: 'active', qty: 99 },
  { id_lokal: 'dg6', name: 'Thumbnail YouTube / Poster Film', category: 'design', price: 50000, origPrice: 80000, description: 'Thumbnail YouTube, poster film pendek. 1280x720.', status: 'active', qty: 99 },
  { id_lokal: 'ls1', name: 'Paket Live Stream 1 Operator', category: 'livestream', price: 300000, origPrice: 450000, description: '1 operator, overlay custom, OBS/Streamyard setup. YouTube/Zoom/dll.', status: 'active', qty: 5 },
  { id_lokal: 'p0', name: 'Paket 0 — Portofolio Mini', category: 'website', price: 100000, origPrice: 200000, description: 'Website portofolio. Domain + hosting dari SynnnW sudah include.', status: 'active', qty: 99 },
  { id_lokal: 'p1', name: 'Paket 1 — Portofolio Starter', category: 'website', price: 450000, origPrice: 750000, description: 'Domain .com + Hosting Basic + Website Vibe Code.', status: 'active', qty: 99 },
  { id_lokal: 'p2', name: 'Paket 2 — Bisnis Complete', category: 'website', price: 700000, origPrice: 1200000, description: 'Domain + Hosting Pro + Website React + Firebase + Telegram Bot.', status: 'active', qty: 99 },
  { id_lokal: 'p3', name: 'Paket 3 — Aplikasi + QRIS Cafe', category: 'website', price: 0, origPrice: 0, description: 'QR per meja, menu digital, QRIS payment. Coming soon.', status: 'coming_soon', qty: 0 },
  { id_lokal: 'd1', name: 'Domain .com', category: 'domain', price: 190000, origPrice: 190000, description: 'Domain .com 1 tahun.', status: 'active', qty: 99 },
  { id_lokal: 'd2', name: 'Domain .id', category: 'domain', price: 220000, origPrice: 220000, description: 'Domain .id 1 tahun.', status: 'active', qty: 99 },
  { id_lokal: 'd3', name: 'Domain .net', category: 'domain', price: 300000, origPrice: 300000, description: 'Domain .net 1 tahun.', status: 'active', qty: 99 },
  { id_lokal: 'd4', name: 'Domain .co.id', category: 'domain', price: 250000, origPrice: 250000, description: 'Domain .co.id 1 tahun.', status: 'active', qty: 99 },
  { id_lokal: 'h1', name: 'Hosting Basic', category: 'hosting', price: 100000, origPrice: 100000, description: 'Hosting shared basic, cocok untuk portofolio.', status: 'active', qty: 99 },
  { id_lokal: 'h2', name: 'Hosting Pro', category: 'hosting', price: 180000, origPrice: 180000, description: 'Hosting pro, cocok untuk bisnis.', status: 'active', qty: 99 },
  { id_lokal: 'w1', name: 'Landing Page', category: 'webdev', price: 100000, origPrice: 100000, description: 'Landing page 1 halaman.', status: 'active', qty: 99 },
  { id_lokal: 'w2', name: 'Website Portofolio', category: 'webdev', price: 175000, origPrice: 175000, description: 'Website portofolio multi-halaman sederhana.', status: 'active', qty: 99 },
  { id_lokal: 'w3', name: 'Website Multi-Page', category: 'webdev', price: 275000, origPrice: 275000, description: 'Website multi-halaman dengan fitur lengkap.', status: 'active', qty: 99 },
  { id_lokal: 'w4', name: 'Website Custom', category: 'webdev', price: 400000, origPrice: 400000, description: 'Website custom sesuai kebutuhan.', status: 'active', qty: 99 },
  { id_lokal: 'b1', name: 'Firebase Backend', category: 'backend', price: 100000, origPrice: 100000, description: 'Setup Firebase Auth + Firestore + Hosting.', status: 'active', qty: 99 },
  { id_lokal: 'b2', name: 'Telegram Bot', category: 'backend', price: 80000, origPrice: 80000, description: 'Bot Telegram untuk notifikasi atau otomasi.', status: 'active', qty: 99 },
  { id_lokal: 'b3', name: 'WebSocket Realtime', category: 'backend', price: 150000, origPrice: 150000, description: 'Integrasi WebSocket untuk fitur realtime.', status: 'active', qty: 99 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatusClass(status) {
  const map = {
    'Pending': 'da-status-pending',
    'Editing': 'da-status-editing',
    'Review': 'da-status-review',
    'Complete': 'da-status-complete',
    'Cancelled': 'da-status-cancelled',
  };
  return map[status] || 'da-status-pending';
}

function formatRp(n) {
  return 'Rp ' + (n || 0).toLocaleString('id-ID');
}

function relativeTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'baru saja';
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} hari lalu`;
  return d.toLocaleDateString('id-ID');
}

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString('id-ID', { month: 'short' }) });
  }
  return months;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/');
        return;
      }

      const unsubOrders = onSnapshot(
        query(collection(db, 'orders'), orderBy('timestamp', 'desc')),
        (snap) => {
          const orderData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setOrders(orderData);
          // A4: count new orders since lastVisit
          const lastVisit = parseInt(localStorage.getItem('adminLastVisit') || '0');
          const newCount = orderData.filter(o => {
            const ts = o.timestamp?.toDate?.()?.getTime() || 0;
            return ts > lastVisit;
          }).length;
          setNewOrderCount(newCount);
        }
      );

      const unsubPrices = onSnapshot(collection(db, 'prices'), (snap) => {
        setPrices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      setLoading(false);

      return () => { unsubOrders(); unsubPrices(); unsubUsers(); };
    });
    return () => unsubAuth();
  }, [navigate]);

  // Update lastVisit when tab changes to orders
  useEffect(() => {
    if (activeTab === 'orders') {
      localStorage.setItem('adminLastVisit', Date.now().toString());
      setNewOrderCount(0);
    }
  }, [activeTab]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); navigate('/'); } catch (err) { console.error(err); }
  };

  // A2: Search results
  const searchResults = searchQuery.trim().length > 1 ? [
    ...orders.filter(o =>
      o.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4).map(o => ({ type: 'order', label: 'Order', val: o.projectName || 'Order baru', tab: 'orders', id: o.id })),
    ...users.filter(u =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4).map(u => ({ type: 'user', label: 'Klien', val: u.name || u.email, tab: 'customers', id: u.id })),
  ].slice(0, 8) : [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070709', color: '#666', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        LOADING...
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
    { id: 'orders', icon: 'fa-clipboard-list', label: 'Orders', badge: orders.length, badgeNew: newOrderCount > 0 },
    { id: 'customers', icon: 'fa-users', label: 'Customers', badge: users.length },
    { id: 'prices', icon: 'fa-tag', label: 'Prices', badge: prices.length },
    { id: 'dashboardEditor', icon: 'fa-sliders', label: 'Dashboard Editor' },
    { id: 'qris', icon: 'fa-qrcode', label: 'QRIS Settings' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="da-app">
        {/* Sidebar */}
        <div className="da-sidebar">
          <div className="da-brand">
            <h2 className="da-brand-title">
              <i className="fa-solid fa-chart-line" /> Syn<em>nw</em>
            </h2>
            <span className="da-brand-sub">Admin Dashboard</span>
          </div>

          {/* A2: Global Search */}
          <div className="da-search-wrap" ref={searchRef}>
            <i className="fa-solid fa-magnifying-glass da-search-icon" style={{ top: '52%' }} />
            <input
              className="da-search-input"
              placeholder="Cari order, klien, proyek..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              onFocus={() => setShowSearchResults(true)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="da-search-results">
                {searchResults.map((r, i) => (
                  <div key={i} className="da-search-result-item" onClick={() => {
                    setActiveTab(r.tab);
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}>
                    <div className="da-search-result-label">{r.label}</div>
                    <div className="da-search-result-val">{r.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="da-nav-section-label">MAIN</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`da-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
              {item.badge !== undefined && (
                <span className={`da-nav-badge ${item.badgeNew ? 'da-nav-badge-red' : ''}`}>
                  {item.badgeNew ? 'NEW' : item.badge}
                </span>
              )}
            </div>
          ))}

          <div className="da-sidebar-footer">
            <button className="da-btn-logout" onClick={handleLogout}>
              <i className="fa-solid fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="da-main">
          {activeTab === 'overview' && <OverviewTab orders={orders} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} users={users} />}
          {activeTab === 'customers' && <CustomersTab users={users} orders={orders} setActiveTab={setActiveTab} />}
          {activeTab === 'prices' && <PricesTab prices={prices} />}
          {activeTab === 'dashboardEditor' && <DashboardEditorTab orders={orders} />}
          {activeTab === 'qris' && <QrisTab />}
        </div>
      </div>
    </>
  );
}

// ─── A1: Overview Tab ─────────────────────────────────────────────────────────
function OverviewTab({ orders }) {
  const [resetting, setResetting] = useState(false);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.cartTotal || 0), 0);
  const recentOrders = orders.slice(0, 5);

  // A1: Revenue per month
  const months = getLast6Months();
  const maxRev = Math.max(...months.map(m => {
    return orders.filter(o => {
      const d = o.timestamp?.toDate?.();
      return d && d.getFullYear() === m.year && d.getMonth() === m.month;
    }).reduce((s, o) => s + (o.cartTotal || 0), 0);
  }), 1);

  const monthStats = months.map(m => {
    const monthOrders = orders.filter(o => {
      const d = o.timestamp?.toDate?.();
      return d && d.getFullYear() === m.year && d.getMonth() === m.month;
    });
    const rev = monthOrders.reduce((s, o) => s + (o.cartTotal || 0), 0);
    return { ...m, rev, count: monthOrders.length };
  });

  // Extra stats
  const now = new Date();
  const thisMonthRev = orders.filter(o => {
    const d = o.timestamp?.toDate?.();
    return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((s, o) => s + (o.cartTotal || 0), 0);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekOrders = orders.filter(o => {
    const d = o.timestamp?.toDate?.()?.getTime() || 0;
    return d > weekAgo;
  }).length;

  // Category breakdown
  const catStats = ['video', 'design', 'livestream'].map(cat => {
    const catOrders = orders.filter(o => (o.category || o.serviceCategory || '').toLowerCase().includes(cat));
    return { cat, count: catOrders.length, rev: catOrders.reduce((s, o) => s + (o.cartTotal || 0), 0) };
  });

  // A5: Deadline warnings
  const soon = orders.filter(o => {
    if (!o.deadline) return false;
    const dl = new Date(o.deadline);
    const diff = (dl.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  const handleReset = async () => {
    if (!window.confirm('Reset overview? Ini akan menghapus semua data order dari tampilan. Data tidak dapat dikembalikan.')) return;
    setResetting(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'orders', d.id))));
    } catch (err) { console.error(err); }
    setResetting(false);
  };

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">Overview</h1>
          <p className="da-page-sub">Ringkasan dashboard admin SynnnW</p>
        </div>
      </div>

      {/* A5: Deadline warnings */}
      {soon.length > 0 && (
        <div className="da-deadline-warn">
          <i className="fa-solid fa-triangle-exclamation" />
          <span><strong>{soon.length} order</strong> memiliki deadline dalam 3 hari ke depan! Cek tab Orders.</span>
        </div>
      )}

      <div className="da-stats-grid">
        <div className="da-stat-card">
          <span className="da-stat-label">Total Orders</span>
          <div className="da-stat-val"><span className="da-stat-accent">{totalOrders}</span></div>
        </div>
        <div className="da-stat-card">
          <span className="da-stat-label">Total Revenue</span>
          <div className="da-stat-val" style={{ fontSize: '1.3rem' }}>{formatRp(totalRevenue)}</div>
        </div>
        <div className="da-stat-card">
          <span className="da-stat-label">Revenue Bulan Ini</span>
          <div className="da-stat-val" style={{ fontSize: '1.2rem' }}>{formatRp(thisMonthRev)}</div>
        </div>
        <div className="da-stat-card">
          <span className="da-stat-label">Order Minggu Ini</span>
          <div className="da-stat-val"><span className="da-stat-accent">{thisWeekOrders}</span></div>
        </div>
      </div>

      {/* A1: Revenue Chart */}
      <div className="da-panel">
        <h3 className="da-panel-title"><i className="fa-solid fa-chart-bar" /> Revenue per Bulan (6 Bulan Terakhir)</h3>
        <div className="da-chart-wrap">
          {monthStats.map((m, i) => (
            <div key={i} className="da-chart-col">
              <div
                className="da-chart-bar"
                style={{ height: `${Math.max((m.rev / maxRev) * 100, 3)}%` }}
              >
                <div className="da-chart-tooltip">
                  {formatRp(m.rev)} — {m.count} order
                </div>
              </div>
              <span className="da-chart-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="da-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, flexWrap: 'wrap', gap: 12 }}>
          <h3 className="da-panel-title" style={{ margin: 0 }}><i className="fa-solid fa-layer-group" /> Orders per Kategori</h3>
          <button
            className="da-btn da-btn-red"
            onClick={handleReset}
            disabled={resetting}
          >
            {resetting ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-rotate-left" />}
            {resetting ? 'Mereset...' : 'Reset Overview'}
          </button>
        </div>
        <div className="da-cat-cols">
          {catStats.map(c => (
            <div key={c.cat} className="da-cat-col">
              <div className="da-cat-col-title">{c.cat.charAt(0).toUpperCase() + c.cat.slice(1)}</div>
              <div className="da-cat-col-val">{c.count}</div>
              <div className="da-cat-col-sub">{formatRp(c.rev)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="da-panel">
        <h3 className="da-panel-title"><i className="fa-solid fa-list" /> Recent Orders (5 Terbaru)</h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Belum ada order.</p>
        ) : (
          <div className="da-table-wrap">
            <table className="da-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>User</th>
                  <th>Kategori</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.projectName || 'N/A'}</td>
                    <td style={{ fontSize: '0.75rem' }}>{order.userId?.slice(0, 10)}...</td>
                    <td>{order.category || order.serviceCategory || 'general'}</td>
                    <td>{formatRp(order.cartTotal)}</td>
                    <td><span className={`da-status-badge ${getStatusClass(order.status || 'Pending')}`}>{order.status || 'Pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ orders, users }) {
  const [filterCat, setFilterCat] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [notifModal, setNotifModal] = useState(null); // order object
  const [notifForm, setNotifForm] = useState({ type: 'status_changed', title: '', message: '' });
  const [notifSending, setNotifSending] = useState(false);

  const FILTERS = ['all', 'video', 'design', 'lanyard', 'livestream', 'website'];

  const filtered = filterCat === 'all' ? orders : orders.filter(o =>
    (o.category || o.serviceCategory || '').toLowerCase().includes(filterCat)
  );

  const allSelected = filtered.length > 0 && filtered.every(o => selectedIds.includes(o.id));

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(allSelected ? [] : filtered.map(o => o.id));

  const handleStatusChange = async (orderId, newStatus, order) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      // A9: Activity log
      await addDoc(collection(db, 'activities'), {
        userId: order.userId,
        orderId,
        action: 'status_changed',
        detail: `Status diperbarui ke ${newStatus}`,
        createdAt: serverTimestamp(),
        actor: 'admin',
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Yakin ingin hapus order ini?')) return;
    try { await deleteDoc(doc(db, 'orders', orderId)); } catch (err) { console.error(err); }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map(id => {
        const order = orders.find(o => o.id === id);
        return updateDoc(doc(db, 'orders', id), { status: bulkStatus }).then(() =>
          addDoc(collection(db, 'activities'), {
            userId: order?.userId || '',
            orderId: id,
            action: 'status_changed',
            detail: `Status diperbarui ke ${bulkStatus} (bulk action)`,
            createdAt: serverTimestamp(),
            actor: 'admin',
          })
        );
      }));
      setSelectedIds([]);
    } catch (err) { console.error(err); }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Hapus ${selectedIds.length} order terpilih?`)) return;
    try {
      await Promise.all(selectedIds.map(id => deleteDoc(doc(db, 'orders', id))));
      setSelectedIds([]);
    } catch (err) { console.error(err); }
  };

  const handleFieldUpdate = async (orderId, field, value) => {
    try { await updateDoc(doc(db, 'orders', orderId), { [field]: value }); } catch (err) { console.error(err); }
  };

  const handleInternalNotesSave = async (orderId, val) => {
    try { await updateDoc(doc(db, 'orders', orderId), { internalNotes: val }); } catch (err) { console.error(err); }
  };

  // A8: Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Proyek', 'User ID', 'Kategori', 'Total', 'Status', 'Prioritas', 'Deadline', 'Tanggal'];
    const rows = orders.map(o => [
      o.id,
      o.projectName || '',
      o.userId || '',
      o.category || o.serviceCategory || '',
      o.cartTotal || 0,
      o.status || 'Pending',
      o.priority || '',
      o.deadline || '',
      o.timestamp?.toDate?.().toLocaleDateString('id-ID') || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SynnnW_Orders_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // A4: Send notification to client
  const handleSendNotif = async () => {
    if (!notifModal || !notifForm.title || !notifForm.message) return;
    setNotifSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: notifModal.userId,
        title: notifForm.title,
        message: notifForm.message,
        type: notifForm.type,
        read: false,
        createdAt: serverTimestamp(),
        orderId: notifModal.id,
      });
      setNotifModal(null);
      setNotifForm({ type: 'status_changed', title: '', message: '' });
    } catch (err) { console.error(err); }
    setNotifSending(false);
  };

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || userId?.slice(0, 10) + '...';

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">All <em>Orders</em></h1>
          <p className="da-page-sub">Kelola semua order yang masuk</p>
        </div>
        <button className="da-btn" onClick={handleExportCSV}>
          <i className="fa-solid fa-file-csv" /> Export CSV
        </button>
      </div>

      {/* A7: Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="da-bulk-bar">
          <span className="da-bulk-count">{selectedIds.length} order dipilih</span>
          <select className="da-select" style={{ maxWidth: 160, padding: '6px 10px', fontSize: '0.82rem' }}
            value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}>
            <option value="">Ubah Status...</option>
            <option value="Pending">Pending</option>
            <option value="Editing">Editing</option>
            <option value="Review">Review</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="da-btn da-btn-sm" onClick={handleBulkStatus} disabled={!bulkStatus}>
            <i className="fa-solid fa-check" /> Terapkan
          </button>
          <button className="da-btn da-btn-sm da-btn-red" onClick={handleBulkDelete}>
            <i className="fa-solid fa-trash" /> Hapus Semua
          </button>
          <button className="da-btn da-btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setSelectedIds([])}>
            Batal
          </button>
        </div>
      )}

      {/* Filter pills */}
      <div className="da-filter-pills">
        {FILTERS.map(f => (
          <button key={f} className={`da-pill ${filterCat === f ? 'active' : ''}`}
            onClick={() => setFilterCat(f)}>
            {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="da-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="da-table-wrap">
          <table className="da-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" className="da-checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th>Project</th>
                <th>Klien</th>
                <th>Kategori</th>
                <th>Total</th>
                <th>Status</th>
                <th>Prioritas</th>
                <th>Deadline</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '32px' }}>Belum ada order.</td></tr>
              )}
              {filtered.map(order => (
                <>
                  <tr key={order.id} className={expandedId === order.id ? 'expanded' : ''}>
                    <td>
                      <input type="checkbox" className="da-checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)} />
                    </td>
                    <td>
                      <span style={{ cursor: 'pointer', color: '#a78bfa', fontWeight: 600 }}
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                        {order.projectName || 'N/A'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{getUserName(order.userId)}</td>
                    <td style={{ fontSize: '0.8rem' }}>{order.category || order.serviceCategory || 'general'}</td>
                    <td>{formatRp(order.cartTotal)}</td>
                    <td>
                      <select
                        className="da-select"
                        style={{ maxWidth: 130, padding: '5px 8px', fontSize: '0.8rem' }}
                        value={order.status || 'Pending'}
                        onChange={e => handleStatusChange(order.id, e.target.value, order)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Editing">Editing</option>
                        <option value="Review">Review</option>
                        <option value="Complete">Complete</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="da-select"
                        style={{ maxWidth: 110, padding: '5px 8px', fontSize: '0.8rem' }}
                        value={order.priority || ''}
                        onChange={e => handleFieldUpdate(order.id, 'priority', e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="high">🔴 Tinggi</option>
                        <option value="medium">🟡 Sedang</option>
                        <option value="low">🟢 Rendah</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        className="da-input"
                        style={{ padding: '5px 8px', fontSize: '0.8rem', maxWidth: 130 }}
                        value={order.deadline || ''}
                        onChange={e => handleFieldUpdate(order.id, 'deadline', e.target.value)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="da-btn da-btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                          onClick={() => setNotifModal(order)}>
                          <i className="fa-solid fa-bell" />
                        </button>
                        <button className="da-btn da-btn-sm da-btn-red" onClick={() => handleDelete(order.id)}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-exp`} className="da-expanded-row">
                      <td colSpan={9}>
                        <div className="da-expanded-content">
                          <div>
                            <div className="da-expand-section-title">Detail Order</div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 6px' }}>
                              <strong style={{ color: '#fff' }}>WA User:</strong> {order.phone || '—'}
                            </p>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 6px' }}>
                              <strong style={{ color: '#fff' }}>Email:</strong> {order.email || '—'}
                            </p>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 6px' }}>
                              <strong style={{ color: '#fff' }}>Dibuat:</strong> {order.timestamp?.toDate?.().toLocaleString('id-ID') || '—'}
                            </p>
                            {order.cartItems && (
                              <>
                                <div className="da-expand-section-title" style={{ marginTop: 12 }}>Item Cart</div>
                                {order.cartItems.map((item, i) => (
                                  <p key={i} style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0 0 4px' }}>
                                    — {item.name}: {formatRp(item.price)}
                                  </p>
                                ))}
                              </>
                            )}
                          </div>
                          <div>
                            {/* A6: Internal notes */}
                            <div className="da-expand-section-title">Catatan Internal (tidak terlihat klien)</div>
                            <InternalNotesField order={order} onSave={handleInternalNotesSave} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* A4: Send notif modal */}
      {notifModal && (
        <div className="da-send-notif-modal" onClick={e => { if (e.target === e.currentTarget) setNotifModal(null); }}>
          <div className="da-send-notif-box">
            <div className="da-send-notif-title">
              <i className="fa-solid fa-bell" /> Kirim Notifikasi ke Klien
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 16 }}>
              Order: <strong style={{ color: '#fff' }}>{notifModal.projectName}</strong>
            </p>
            <div className="da-field">
              <label>Tipe Notifikasi</label>
              <select className="da-select" value={notifForm.type}
                onChange={e => setNotifForm(prev => ({ ...prev, type: e.target.value }))}>
                <option value="file_ready">File Siap</option>
                <option value="status_changed">Status Berubah</option>
                <option value="admin_message">Pesan Admin</option>
                <option value="payment_confirmed">Pembayaran Dikonfirmasi</option>
                <option value="project_complete">Proyek Selesai</option>
              </select>
            </div>
            <div className="da-field">
              <label>Judul</label>
              <input className="da-input" value={notifForm.title}
                onChange={e => setNotifForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Judul notifikasi..." />
            </div>
            <div className="da-field">
              <label>Pesan</label>
              <textarea className="da-textarea" value={notifForm.message}
                onChange={e => setNotifForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Isi pesan..." style={{ minHeight: 80 }} />
            </div>
            <div className="da-btn-actions">
              <button className="da-btn da-btn-green" onClick={handleSendNotif} disabled={notifSending}>
                {notifSending ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-paper-plane" />}
                {notifSending ? 'Mengirim...' : 'Kirim'}
              </button>
              <button className="da-btn" onClick={() => setNotifModal(null)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// A6: Internal notes with auto-save on blur
function InternalNotesField({ order, onSave }) {
  const [val, setVal] = useState(order.internalNotes || '');
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea
        className="da-internal-notes"
        value={val}
        onChange={e => { setVal(e.target.value); setSaved(false); }}
        onBlur={() => { onSave(order.id, val); setSaved(true); }}
        placeholder="Catatan internal untuk order ini (tidak terlihat klien)..."
      />
      {saved && <span style={{ fontSize: '0.72rem', color: '#4ade80' }}>✓ Tersimpan</span>}
    </div>
  );
}

// ─── A3: Customers Tab ────────────────────────────────────────────────────────
function CustomersTab({ users, orders, setActiveTab }) {
  const [expandedUserId, setExpandedUserId] = useState(null);

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">Customers</h1>
          <p className="da-page-sub">Semua klien yang terdaftar</p>
        </div>
      </div>

      <div className="da-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="da-customer-table-wrap">
          <table className="da-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Auth</th>
                <th>Tgl Daftar</th>
                <th>Total Order</th>
                <th>Total Spend</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '32px' }}>Belum ada user.</td></tr>
              )}
              {users.map(user => {
                const userOrders = orders.filter(o => o.userId === user.id);
                const totalSpend = userOrders.reduce((s, o) => s + (o.cartTotal || 0), 0);
                return (
                  <>
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600 }}>{user.name || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{user.email || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{user.phone || '—'}</td>
                      <td><span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{user.authMethod || 'email'}</span></td>
                      <td style={{ fontSize: '0.78rem' }}>
                        {user.createdAt?.toDate?.().toLocaleDateString('id-ID') || '—'}
                      </td>
                      <td><span className="da-stat-accent" style={{ fontWeight: 700 }}>{userOrders.length}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{formatRp(totalSpend)}</td>
                      <td>
                        <button className="da-btn da-btn-sm"
                          onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}>
                          <i className={`fa-solid fa-chevron-${expandedUserId === user.id ? 'up' : 'down'}`} /> Orders
                        </button>
                      </td>
                    </tr>
                    {expandedUserId === user.id && (
                      <tr key={`${user.id}-orders`} className="da-expanded-row">
                        <td colSpan={8}>
                          <div style={{ padding: '16px 20px', background: 'rgba(139,92,246,0.03)' }}>
                            {userOrders.length === 0 ? (
                              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>Belum ada order.</p>
                            ) : (
                              <table className="da-table" style={{ minWidth: 0 }}>
                                <thead>
                                  <tr>
                                    <th>Project</th>
                                    <th>Kategori</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userOrders.map(o => (
                                    <tr key={o.id}>
                                      <td>{o.projectName || '—'}</td>
                                      <td style={{ fontSize: '0.8rem' }}>{o.category || o.serviceCategory || '—'}</td>
                                      <td>{formatRp(o.cartTotal)}</td>
                                      <td><span className={`da-status-badge ${getStatusClass(o.status || 'Pending')}`}>{o.status || 'Pending'}</span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Prices Tab ───────────────────────────────────────────────────────────────
function PricesTab({ prices }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', origPrice: '', description: '', status: 'active', qty: 99 });
  const [editingId, setEditingId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseInt(formData.price) || 0, origPrice: parseInt(formData.origPrice) || 0, qty: parseInt(formData.qty) || 0 };
      if (editingId) {
        await updateDoc(doc(db, 'prices', editingId), { ...payload, updatedAt: serverTimestamp() });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'prices'), { ...payload, createdAt: serverTimestamp() });
      }
      setFormData({ name: '', category: '', price: '', origPrice: '', description: '', status: 'active', qty: 99 });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin hapus?')) {
      try { await deleteDoc(doc(db, 'prices', id)); } catch (err) { console.error(err); }
    }
  };

  const handleStatusChange = async (priceId, newStatus) => {
    try { await updateDoc(doc(db, 'prices', priceId), { status: newStatus }); } catch (err) { console.error(err); }
  };

  const handleQtyChange = async (priceId, newQty) => {
    try { await updateDoc(doc(db, 'prices', priceId), { qty: parseInt(newQty) || 0 }); } catch (err) { console.error(err); }
  };

  const handleOrigPriceChange = async (priceId, newOrigPrice) => {
    try { await updateDoc(doc(db, 'prices', priceId), { origPrice: parseInt(newOrigPrice) || 0 }); } catch (err) { console.error(err); }
  };

  const handleSeedData = async () => {
    if (!window.confirm('Seed semua data harga ke Firestore? Ini akan menambahkan item baru (tidak menghapus yang ada).')) return;
    setSeeding(true);
    try {
      await Promise.all(SEED_PRICES.map(p => addDoc(collection(db, 'prices'), { ...p, createdAt: serverTimestamp() })));
      setSeedMsg(`✓ ${SEED_PRICES.length} item berhasil ditambahkan!`);
    } catch (err) {
      setSeedMsg('Gagal seed data.');
      console.error(err);
    }
    setSeeding(false);
    setTimeout(() => setSeedMsg(''), 4000);
  };

  const STATUS_COLORS = {
    active: '#4ade80',
    coming_soon: '#fbbf24',
    full_booked: '#f87171',
    inactive: '#64748b',
  };
  const STATUS_LABELS = { active: 'Active', coming_soon: 'Coming Soon', full_booked: 'Full Booked', inactive: 'Inactive' };

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">Price <em>List</em></h1>
          <p className="da-page-sub">Kelola paket harga layanan</p>
        </div>
        <div className="da-btn-actions">
          <button className="da-btn da-btn-yellow" onClick={handleSeedData} disabled={seeding}>
            {seeding ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-database" />}
            {seeding ? 'Seeding...' : 'Seed Data Harga'}
          </button>
          {!showForm && (
            <button className="da-btn da-btn-green" onClick={() => setShowForm(true)}>
              <i className="fa-solid fa-plus" /> Tambah Paket
            </button>
          )}
        </div>
      </div>

      {seedMsg && <p style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: 12 }}>{seedMsg}</p>}

      {showForm && (
        <div className="da-panel">
          <h3 className="da-panel-title"><i className="fa-solid fa-plus" /> {editingId ? 'Edit' : 'Tambah'} Paket</h3>
          <form onSubmit={handleSubmit} className="da-form-grid">
            <div className="da-form-row">
              <div className="da-field">
                <label>Nama Paket</label>
                <input className="da-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nama paket" required />
              </div>
              <div className="da-field">
                <label>Kategori</label>
                <select className="da-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Pilih kategori</option>
                  <option value="video">Video</option>
                  <option value="design">Design</option>
                  <option value="livestream">Livestream</option>
                  <option value="website">Website</option>
                  <option value="domain">Domain</option>
                  <option value="hosting">Hosting</option>
                  <option value="webdev">Web Dev</option>
                  <option value="backend">Backend</option>
                  <option value="motion">Motion</option>
                </select>
              </div>
            </div>
            <div className="da-form-row">
              <div className="da-field">
                <label>Harga (Rp)</label>
                <input className="da-input" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="150000" />
              </div>
              <div className="da-field">
                <label>Harga Asli / Coret (Rp)</label>
                <input className="da-input" type="number" value={formData.origPrice} onChange={e => setFormData({ ...formData, origPrice: e.target.value })} placeholder="250000" />
              </div>
            </div>
            <div className="da-form-row">
              <div className="da-field">
                <label>Status</label>
                <select className="da-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="full_booked">Full Booked</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="da-field">
                <label>QTY (Kuota)</label>
                <input className="da-input" type="number" value={formData.qty} onChange={e => setFormData({ ...formData, qty: e.target.value })} placeholder="99" />
              </div>
            </div>
            <div className="da-field">
              <label>Deskripsi</label>
              <textarea className="da-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi paket..." style={{ minHeight: 80 }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="da-btn da-btn-green"><i className="fa-solid fa-save" /> {editingId ? 'Update' : 'Simpan'}</button>
              <button type="button" className="da-btn" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', category: '', price: '', origPrice: '', description: '', status: 'active', qty: 99 }); }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="da-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="da-table-wrap">
          <table className="da-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Harga Asli</th>
                <th>Status</th>
                <th>QTY</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prices.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '32px' }}>Belum ada data harga. Klik "Seed Data Harga" untuk mengisi.</td></tr>
              )}
              {prices.map(price => (
                <tr key={price.id}>
                  <td><strong>{price.name}</strong></td>
                  <td style={{ fontSize: '0.8rem' }}>{price.category}</td>
                  <td>{formatRp(price.price)}</td>
                  <td>
                    <input
                      type="number"
                      className="da-input"
                      style={{ padding: '5px 8px', fontSize: '0.8rem', maxWidth: 110 }}
                      defaultValue={price.origPrice || 0}
                      onBlur={e => handleOrigPriceChange(price.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="da-select"
                      style={{ maxWidth: 130, padding: '5px 8px', fontSize: '0.8rem', color: STATUS_COLORS[price.status] || '#fff' }}
                      value={price.status || 'active'}
                      onChange={e => handleStatusChange(price.id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="full_booked">Full Booked</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="da-input"
                      style={{ padding: '5px 8px', fontSize: '0.8rem', maxWidth: 70 }}
                      defaultValue={price.qty ?? 99}
                      onBlur={e => handleQtyChange(price.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="da-btn da-btn-sm" onClick={() => {
                        setFormData({ name: price.name, category: price.category, price: price.price, origPrice: price.origPrice || 0, description: price.description, status: price.status || 'active', qty: price.qty ?? 99 });
                        setEditingId(price.id); setShowForm(true);
                      }}>Edit</button>
                      <button className="da-btn da-btn-sm da-btn-red" onClick={() => handleDelete(price.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard Editor Tab ─────────────────────────────────────────────────────
function DashboardEditorTab({ orders }) {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Form state
  const [adminNotes, setAdminNotes] = useState('');
  const [qrisImageUrl, setQrisImageUrl] = useState('');
  const [dpPaid, setDpPaid] = useState(false);
  const [finalPaid, setFinalPaid] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  // Generate slot keys
  const videoSlots = [...Array(10).keys()].map(i => `v${i + 1}`);
  const videoRevSlots = [...Array(10).keys()].map(i => `rev${i + 1}`);
  const posterSlots = [...Array(10).keys()].map(i => `p${i + 1}`);
  const posterRevSlots = [...Array(10).keys()].map(i => `rev${i + 1}`);
  const lanyardSlots = [...Array(10).keys()].map(i => `l${i + 1}`);
  const lanyardRevSlots = [...Array(10).keys()].map(i => `rev${i + 1}`);

  const [videos, setVideos] = useState({});
  const [posters, setPosters] = useState({});
  const [lanyards, setLanyards] = useState({});

  useEffect(() => {
    if (!selectedOrderId) {
      setAdminNotes(''); setQrisImageUrl(''); setDpPaid(false); setFinalPaid(false);
      setDownloadUrl(''); setVideos({}); setPosters({}); setLanyards({});
      return;
    }
    const unsub = onSnapshot(doc(db, 'dashboardContent', selectedOrderId), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setAdminNotes(d.adminNotes || '');
        setQrisImageUrl(d.qrisImageUrl || '');
        setDpPaid(d.dpPaid || false);
        setFinalPaid(d.finalPaid || false);
        setDownloadUrl(d.downloadUrl || '');
        setVideos(d.videos || {});
        setPosters(d.posters || {});
        setLanyards(d.lanyards || {});
      } else {
        setAdminNotes(''); setQrisImageUrl(''); setDpPaid(false); setFinalPaid(false);
        setDownloadUrl(''); setVideos({}); setPosters({}); setLanyards({});
      }
    });
    return () => unsub();
  }, [selectedOrderId]);

  const handleSave = async () => {
    if (!selectedOrderId) return;
    setSaving(true); setMsg(''); setErr('');
    try {
      const selectedOrder = orders.find(o => o.id === selectedOrderId);
      await setDoc(doc(db, 'dashboardContent', selectedOrderId), {
        orderId: selectedOrderId,
        userId: selectedOrder?.userId || '',
        adminNotes: adminNotes.trim(),
        qrisImageUrl: qrisImageUrl.trim(),
        dpPaid,
        finalPaid,
        downloadUrl: downloadUrl.trim(),
        videos,
        posters,
        lanyards,
        updatedAt: serverTimestamp(),
      });
      // A9: Activity log
      await addDoc(collection(db, 'activities'), {
        userId: selectedOrder?.userId || '',
        orderId: selectedOrderId,
        action: 'admin_upload',
        detail: 'Admin memperbarui file project',
        createdAt: serverTimestamp(),
        actor: 'admin',
      });
      setMsg('✓ Dashboard berhasil diperbarui! User akan langsung melihat perubahan.');
    } catch (e) {
      console.error(e);
      setErr('Gagal menyimpan. Coba lagi.');
    }
    setSaving(false);
  };

  const setVideoSlot = (key, val) => setVideos(prev => ({ ...prev, [key]: val }));
  const setPosterSlot = (key, val) => setPosters(prev => ({ ...prev, [key]: val }));
  const setLanyardSlot = (key, val) => setLanyards(prev => ({ ...prev, [key]: val }));

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">Dashboard <em>Editor</em></h1>
          <p className="da-page-sub">Edit konten dashboard untuk setiap user/order</p>
        </div>
      </div>

      {/* Order Select */}
      <div className="da-panel">
        <div className="da-editor-order-select">
          <label style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>Pilih Order / User:</label>
          <select className="da-select" style={{ maxWidth: 360 }} value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}>
            <option value="">-- Pilih order untuk diedit --</option>
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                {order.projectName || 'Order baru'} — {order.userId?.slice(0, 12)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOrderId && (
        <>
          {/* SECTION A: Admin Notes */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-note-sticky" /> A — Catatan untuk Klien</h3>
            <div className="da-field">
              <label>Pesan / Update Admin</label>
              <textarea className="da-textarea" value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Hei, proses sudah sampai tahap cutting. Silakan cek preview di atas..." />
            </div>
          </div>

          {/* SECTION B: Video Links */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-film" /> B — Video Links</h3>
            <div className="da-section-divider"><i className="fa-solid fa-play" /> Video Utama (1–10)</div>
            <div className="da-link-grid">
              {videoSlots.map(key => (
                <div key={key} className="da-link-row">
                  <span className="da-link-label">{key.toUpperCase()}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={videos[key] || ''} onChange={e => setVideoSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="da-section-divider"><i className="fa-solid fa-rotate-left" /> Video Revisi (1–10)</div>
            <div className="da-link-grid">
              {videoRevSlots.map(key => (
                <div key={`vrev-${key}`} className="da-link-row">
                  <span className="da-link-label">Rev {key.replace('rev', '')}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={videos[key] || ''} onChange={e => setVideoSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: Poster Links */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-image" /> C — Poster Links</h3>
            <div className="da-section-divider"><i className="fa-solid fa-star" /> Poster Utama (1–10)</div>
            <div className="da-link-grid">
              {posterSlots.map(key => (
                <div key={key} className="da-link-row">
                  <span className="da-link-label">{key.toUpperCase()}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={posters[key] || ''} onChange={e => setPosterSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="da-section-divider"><i className="fa-solid fa-rotate-left" /> Poster Revisi (1–10)</div>
            <div className="da-link-grid">
              {posterRevSlots.map(key => (
                <div key={`prev-${key}`} className="da-link-row">
                  <span className="da-link-label">Rev {key.replace('rev', '')}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={posters[key] || ''} onChange={e => setPosterSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="da-section-divider"><i className="fa-solid fa-check-double" /> Final</div>
            <div className="da-link-row" style={{ maxWidth: 500 }}>
              <span className="da-link-label">Final</span>
              <input className="da-link-input" placeholder="https://drive.google.com/..."
                value={posters['final'] || ''} onChange={e => setPosterSlot('final', e.target.value)} />
            </div>
          </div>

          {/* SECTION D: Lanyard Links */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-id-card" /> D — Lanyard Links</h3>
            <div className="da-section-divider"><i className="fa-solid fa-star" /> Lanyard Utama (1–10)</div>
            <div className="da-link-grid">
              {lanyardSlots.map(key => (
                <div key={key} className="da-link-row">
                  <span className="da-link-label">{key.toUpperCase()}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={lanyards[key] || ''} onChange={e => setLanyardSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="da-section-divider"><i className="fa-solid fa-rotate-left" /> Lanyard Revisi (1–10)</div>
            <div className="da-link-grid">
              {lanyardRevSlots.map(key => (
                <div key={`lrev-${key}`} className="da-link-row">
                  <span className="da-link-label">Rev {key.replace('rev', '')}</span>
                  <input className="da-link-input" placeholder="https://drive.google.com/..."
                    value={lanyards[key] || ''} onChange={e => setLanyardSlot(key, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="da-section-divider"><i className="fa-solid fa-check-double" /> Final</div>
            <div className="da-link-row" style={{ maxWidth: 500 }}>
              <span className="da-link-label">Final</span>
              <input className="da-link-input" placeholder="https://drive.google.com/..."
                value={lanyards['final'] || ''} onChange={e => setLanyardSlot('final', e.target.value)} />
            </div>
          </div>

          {/* SECTION E: Payment */}
          <div className="da-panel">
            <h3 className="da-panel-title"><i className="fa-solid fa-credit-card" /> E — Pembayaran</h3>
            <div className="da-field">
              <label>URL Gambar QRIS (per order)</label>
              <input className="da-input" value={qrisImageUrl}
                onChange={e => setQrisImageUrl(e.target.value)}
                placeholder="https://drive.google.com/... atau URL gambar langsung" />
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', margin: '8px 0 16px' }}>
              <div className="da-toggle-wrap" style={{ cursor: 'pointer' }} onClick={() => setDpPaid(p => !p)}>
                <div className={`da-toggle ${dpPaid ? 'on' : ''}`} />
                <span className="da-toggle-label">DP Sudah Dibayar?</span>
                {dpPaid && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ YA</span>}
              </div>
              <div className="da-toggle-wrap" style={{ cursor: 'pointer' }} onClick={() => setFinalPaid(p => !p)}>
                <div className={`da-toggle ${finalPaid ? 'on' : ''}`} />
                <span className="da-toggle-label">Pembayaran Final Lunas?</span>
                {finalPaid && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ YA</span>}
              </div>
            </div>
            <div className="da-field">
              <label>URL File Final (Download untuk Klien)</label>
              <input className="da-input" value={downloadUrl}
                onChange={e => setDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/..." />
            </div>
          </div>

          {/* Save */}
          <div className="da-btn-actions" style={{ marginTop: 8 }}>
            <button className="da-btn da-btn-green" onClick={handleSave} disabled={saving}>
              <i className={saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'} />
              {saving ? 'Menyimpan...' : 'Simpan ke Firestore'}
            </button>
            {msg && <span className="da-msg-success">{msg}</span>}
            {err && <span className="da-msg-error">{err}</span>}
          </div>
        </>
      )}
    </>
  );
}

// ─── QRIS Settings Tab ────────────────────────────────────────────────────────
function QrisTab() {
  const [qrisUrl, setQrisUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'qris'), (snap) => {
      if (snap.exists()) setQrisUrl(snap.data().imageUrl || '');
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      await setDoc(doc(db, 'settings', 'qris'), { imageUrl: qrisUrl.trim(), updatedAt: serverTimestamp() });
      setMsg('✓ QRIS global berhasil disimpan!');
    } catch (e) { setMsg('Gagal menyimpan.'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <>
      <div className="da-page-header">
        <div>
          <h1 className="da-page-title">QRIS <em>Settings</em></h1>
          <p className="da-page-sub">Kelola QRIS global untuk halaman checkout</p>
        </div>
      </div>

      <div className="da-panel" style={{ maxWidth: 520 }}>
        <h3 className="da-panel-title"><i className="fa-solid fa-qrcode" /> URL Gambar QRIS Global</h3>
        <div className="da-field">
          <label>URL Gambar QRIS</label>
          <input className="da-input" value={qrisUrl}
            onChange={e => setQrisUrl(e.target.value)}
            placeholder="https://drive.google.com/... atau URL gambar langsung" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            URL ini digunakan di halaman CheckoutQRIS dan Dashboard klien.
          </span>
        </div>

        {qrisUrl && (
          <div className="da-qris-preview">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 8 }}>Preview:</p>
            <img src={qrisUrl} alt="QRIS Preview" onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}

        <div className="da-btn-actions" style={{ marginTop: 16 }}>
          <button className="da-btn da-btn-green" onClick={handleSave} disabled={saving}>
            <i className={saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'} />
            {saving ? 'Menyimpan...' : 'Simpan QRIS'}
          </button>
          {msg && <span className="da-msg-success">{msg}</span>}
        </div>
      </div>
    </>
  );
}
