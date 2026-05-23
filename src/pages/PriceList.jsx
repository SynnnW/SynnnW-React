import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CSS = `
/* ── Reveal ── */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s ease, transform 0.65s ease; }
.reveal.visible { opacity: 1; transform: none; }
.rv-d1 { transition-delay: 0.08s; }
.rv-d2 { transition-delay: 0.16s; }
.rv-d3 { transition-delay: 0.24s; }
.rv-d4 { transition-delay: 0.32s; }

/* ── Page ── */
.pl-page { min-height: 100vh; background: var(--bg); padding-top: 64px; }

/* ── Orbs ── */
.pl-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); }
.pl-orb1 { width: 520px; height: 520px; background: radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%); top: -140px; left: -120px; }
.pl-orb2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%); bottom: -80px; right: 5%; }
.pl-orb3 { width: 220px; height: 220px; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%); top: 45%; left: 45%; }

/* ── Hero ── */
.pl-hero {
  position: relative; overflow: hidden;
  min-height: 58vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 90px 80px 80px;
  border-bottom: 1px solid var(--border);
}
.pl-hero-inner { position: relative; z-index: 1; max-width: 700px; }
.pl-page-label { display: inline-block; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent3); margin-bottom: 18px; }
.pl-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6.5vw, 5.8rem);
  font-weight: 300; line-height: 1.08; color: var(--text);
  margin: 0 0 20px; letter-spacing: -0.02em;
}
.pl-hero-title em { font-style: italic; color: var(--accent3); }
.pl-hero-sub { font-size: 1rem; color: var(--text-dim); line-height: 1.8; max-width: 520px; margin: 0 0 28px; }
.pl-hero-pills { display: flex; flex-wrap: wrap; gap: 10px; }
.pl-hero-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; font-size: 0.72rem; font-weight: 600;
  color: var(--text-dim); letter-spacing: 0.04em;
}
.pl-hero-pill i { color: var(--accent3); font-size: 0.68rem; }
.pl-scroll-hint {
  position: absolute; bottom: 28px; right: 80px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.66rem; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-dim);
}
.pl-scroll-hint i { animation: plBounce 1.8s ease-in-out infinite; }
@keyframes plBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }

/* ── Floating Cart FAB ── */
.pl-cart-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 200;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 22px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em;
  box-shadow: 0 8px 40px rgba(139,92,246,0.45);
  transition: all 0.3s;
  animation: fabIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes fabIn { from{opacity:0;transform:scale(0.7) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
.pl-cart-fab:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 14px 50px rgba(139,92,246,0.55); }
.pl-cart-count {
  background: var(--bg2); color: var(--accent);
  border-radius: 50%; width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.66rem; font-weight: 800; flex-shrink: 0;
}
.pl-cart-fab-label { font-size: 0.78rem; }

/* ── Body ── */
.pl-body { padding: 72px 80px 120px; display: flex; flex-direction: column; gap: 80px; }

/* ── Section ── */
.pl-section { display: flex; flex-direction: column; gap: 28px; }
.pl-section-head { display: flex; align-items: center; gap: 18px; }
.pl-section-icon {
  width: 50px; height: 50px; border-radius: 16px; flex-shrink: 0;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; color: var(--accent3);
}
.pl-section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 400; color: var(--text); margin: 0 0 4px; letter-spacing: -0.01em; }
.pl-section-sub { font-size: 0.8rem; color: var(--text-dim); margin: 0; }

/* ── Grid ── */
.pl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

/* ── Card ── */
.pl-card {
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 20px; overflow: hidden; position: relative;
  display: flex; flex-direction: column;
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  transition: border-color 0.28s, transform 0.28s, box-shadow 0.28s;
}
.pl-card:hover { border-color: var(--gborder2); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.pl-card-soon { opacity: 0.72; }
.pl-card-soon:hover { transform: none; }

/* Badges */
.pl-card-badges { display: flex; flex-wrap: wrap; gap: 6px; padding: 14px 14px 0; min-height: 28px; }
.pl-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.pl-badge-hot { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: var(--accent3); }
.pl-badge-disc { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: rgba(239,68,68,0.9); }
.pl-badge-soon { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3); color: rgba(251,191,36,0.9); }
.pl-badge-custom { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: rgba(74,222,128,0.9); }

/* Wishlist btn */
.pl-wish-btn {
  position: absolute; top: 12px; right: 12px; z-index: 2;
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; color: var(--text-dim);
  cursor: pointer; transition: all 0.25s;
}
.pl-wish-btn:hover { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.08); }
.pl-wish-btn.pl-wished { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.1); }

/* Card body */
.pl-card-body {
  display: flex; gap: 14px; padding: 14px 16px;
  cursor: pointer; flex: 1; align-items: flex-start;
  transition: background 0.22s;
}
.pl-card-body:hover { background: var(--glass2); }
.pl-card-icon-wrap {
  width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: var(--text-dim);
  transition: all 0.25s; margin-top: 2px;
}
.pl-card-body:hover .pl-card-icon-wrap { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.25); color: var(--accent3); }
.pl-card-info { flex: 1; }
.pl-card-name { font-size: 0.9rem; font-weight: 600; color: var(--text); margin: 0 0 4px; line-height: 1.3; }
.pl-card-short { font-size: 0.72rem; color: var(--text-dim); margin: 0 0 10px; line-height: 1.5; }
.pl-card-price-row { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-bottom: 5px; }
.pl-card-price { font-size: 1.05rem; font-weight: 700; color: var(--text); }
.pl-card-unit { font-size: 0.66rem; color: var(--text-dim); font-weight: 500; }
.pl-card-orig { font-size: 0.72rem; color: var(--text-dim); text-decoration: line-through; opacity: 0.6; }
.pl-card-price-custom { font-size: 0.8rem; font-weight: 600; color: rgba(74,222,128,0.85); }
.pl-card-price-soon { font-size: 0.8rem; font-weight: 600; color: rgba(251,191,36,0.8); }
.pl-card-syarat { font-size: 0.58rem; color: var(--text-dim); opacity: 0.6; font-style: italic; }
.pl-card-detail-hint { color: var(--text-dim); font-size: 0.7rem; opacity: 0.4; align-self: center; flex-shrink: 0; }

/* Card actions */
.pl-card-actions {
  padding: 0 16px 16px;
  border-top: 1px solid var(--border);
  padding-top: 12px; margin-top: 2px;
}
.pl-btn-add {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px;
  background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3);
  border-radius: 12px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em;
  color: var(--accent3); transition: all 0.25s;
}
.pl-btn-add:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); }
.pl-btn-notify {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px;
  background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25);
  border-radius: 12px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em;
  color: rgba(251,191,36,0.85); transition: all 0.25s;
}
.pl-btn-notify:hover { background: rgba(251,191,36,0.14); }
.pl-btn-discuss {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px;
  background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.25);
  border-radius: 12px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em;
  color: rgba(74,222,128,0.85); transition: all 0.25s;
}
.pl-btn-discuss:hover { background: rgba(74,222,128,0.14); }

/* ── Qty control ── */
.pl-qty-control {
  display: flex; align-items: center; justify-content: center; gap: 0;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 12px; overflow: hidden; width: 100%;
}
.pl-qty-mini { width: auto; }
.pl-qty-btn {
  width: 40px; height: 40px;
  background: transparent; border: none; cursor: pointer;
  font-size: 0.72rem; color: var(--text-dim);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.22s; flex-shrink: 0;
}
.pl-qty-btn:hover { background: var(--glass3); color: var(--text); }
.pl-qty-btn.pl-qty-plus:hover { color: var(--accent3); }
.pl-qty-num {
  flex: 1; text-align: center;
  font-size: 0.9rem; font-weight: 700; color: var(--text);
  min-width: 32px;
}
.pl-qty-lg { width: 52px; height: 52px; font-size: 0.9rem; }
.pl-qty-lg-num { font-size: 1.2rem; }

/* ── Bottom Sheet ── */
.pl-sheet-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: flex-end;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
  backdrop-filter: blur(4px);
}
.pl-sheet-overlay.pl-sheet-open { opacity: 1; pointer-events: all; }

.pl-sheet {
  width: 100%; max-width: 620px; margin: 0 auto;
  background: var(--bg);
  border: 1px solid var(--gborder);
  border-radius: 28px 28px 0 0;
  max-height: 88vh; overflow: hidden;
  display: flex; flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.pl-sheet-overlay.pl-sheet-open .pl-sheet { transform: translateY(0); }
.pl-cart-sheet { max-width: 500px; }

.pl-sheet-handle {
  width: 40px; height: 4px; border-radius: 99px;
  background: var(--gborder2);
  margin: 14px auto 0; flex-shrink: 0;
}
.pl-sheet-scroll { overflow-y: auto; padding: 20px 28px 40px; flex: 1; scrollbar-width: thin; }

.pl-sheet-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 4px; }
.pl-sheet-icon-wrap {
  width: 56px; height: 56px; border-radius: 18px; flex-shrink: 0;
  background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: var(--accent3);
}
.pl-sheet-hinfo { flex: 1; }
.pl-sheet-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.pl-sheet-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 400; color: var(--text); margin: 0 0 10px; line-height: 1.2; }
.pl-sheet-price-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.pl-sheet-price { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.pl-sheet-unit { font-size: 0.78rem; color: var(--text-dim); }
.pl-sheet-orig { font-size: 0.9rem; color: var(--text-dim); text-decoration: line-through; opacity: 0.55; }
.pl-sheet-price-soon { font-size: 1.1rem; font-weight: 700; color: rgba(251,191,36,0.8); }

.pl-sheet-close {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--glass2); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; color: var(--text-dim);
  cursor: pointer; flex-shrink: 0; transition: all 0.22s;
}
.pl-sheet-close:hover { background: var(--glass3); color: var(--text); }

.pl-sheet-divider { height: 1px; background: var(--border); margin: 18px 0; }

.pl-sheet-desc { display: flex; flex-direction: column; gap: 4px; margin-bottom: 18px; }
.pl-sheet-desc p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.75; margin: 0; }
.pl-sheet-feat { color: var(--text) !important; font-size: 0.82rem !important; }
.pl-sheet-warn { color: rgba(251,191,36,0.85) !important; font-style: italic; }
.pl-sheet-tip { color: var(--accent3) !important; font-size: 0.8rem !important; }
.pl-sheet-soon-note { color: rgba(251,191,36,0.75) !important; font-size: 0.8rem !important; }

.pl-sheet-syarat {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 12px; margin-bottom: 20px;
  font-size: 0.72rem; color: var(--text-dim); line-height: 1.6;
}
.pl-sheet-syarat i { color: var(--accent3); font-size: 0.75rem; flex-shrink: 0; margin-top: 1px; }

.pl-sheet-cta { display: flex; gap: 12px; }
.pl-sheet-btn-add {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 14px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  box-shadow: 0 8px 30px rgba(139,92,246,0.35); transition: all 0.3s;
}
.pl-sheet-btn-add:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 12px 40px rgba(139,92,246,0.45); }

.pl-sheet-qty { flex: 1; display: flex; align-items: center; gap: 0; background: var(--glass2); border: 1px solid var(--gborder); border-radius: 14px; overflow: hidden; }

.pl-sheet-btn-wish {
  width: 54px; height: 54px;
  background: var(--glass2); border: 1px solid var(--gborder);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--text-dim);
  cursor: pointer; transition: all 0.25s; flex-shrink: 0;
}
.pl-sheet-btn-wish:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }
.pl-sheet-btn-wish.pl-wished { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.08); }

/* ── Cart items ── */
.pl-cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.pl-cart-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; color: var(--text); margin: 0; display: flex; align-items: center; gap: 12px; }
.pl-cart-title i { color: var(--accent3); }
.pl-cart-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.pl-cart-item:last-of-type { border-bottom: none; }
.pl-cart-item-icon {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--accent3);
}
.pl-cart-item-info { flex: 1; }
.pl-cart-item-name { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.pl-cart-item-price { display: block; font-size: 0.72rem; color: var(--text-dim); }
.pl-cart-total { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; font-size: 0.82rem; color: var(--text-dim); font-weight: 600; letter-spacing: 0.06em; }
.pl-cart-total-num { font-size: 1.3rem; font-weight: 700; color: var(--text); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .pl-hero { padding: 70px 40px 70px; }
  .pl-scroll-hint { right: 40px; }
  .pl-body { padding: 60px 40px 100px; gap: 64px; }
}
@media (max-width: 768px) {
  .pl-hero { padding: 56px 24px 60px; min-height: auto; }
  .pl-scroll-hint { right: 24px; bottom: 20px; }
  .pl-body { padding: 48px 18px 90px; gap: 52px; }
  .pl-grid { grid-template-columns: 1fr; }
  .pl-section-head { gap: 14px; }
  .pl-cart-fab { bottom: 20px; right: 16px; padding: 12px 18px; }
  .pl-sheet-scroll { padding: 18px 20px 36px; }
  .pl-cart-fab-label { display: none; }
}
@media (max-width: 480px) {
  .pl-hero-pills { gap: 6px; }
  .pl-hero-pill { font-size: 0.65rem; padding: 6px 12px; }
}
`;


/* ─────────────────────────────────────────────────────────────
   DATA — SEMUA ITEM HARGA
───────────────────────────────────────────────────────────── */

const CATEGORIES = [

  // ── 1. VIDEO EDITING (paling atas) ───────────────────────
  {
    id: 'video',
    icon: 'fa-clapperboard',
    label: 'Video Editing',
    desc: 'Edit video tugas, film pendek, dan konten',
    items: [
      {
        id: 've1', name: 'Editing Film Pendek Sekolah', icon: 'fa-film',
        price: 150000, origPrice: 250000, unit: '/ project',
        badge: null,
        short: 'Film pendek tugas sekolah / kampus',
        desc: 'Editing film pendek untuk keperluan tugas sekolah atau kampus. Termasuk color grading, sound mixing, dan subtitle jika diperlukan.\n\n✦ Editing full film pendek\n✦ Color grading\n✦ Sound mixing\n✦ Subtitle opsional\n✦ Export HD (1080p)\n✦ Harga: Rp 100.000 – 200.000',
        syarat: true,
      },
      {
        id: 've2', name: 'Editing Video Tugas Sekolah', icon: 'fa-video',
        price: 75000, origPrice: 120000, unit: '/ project',
        badge: null,
        short: 'Video presentasi, tugas PR, atau vlog sekolah',
        desc: 'Editing video sederhana untuk tugas PR, presentasi, atau konten sekolah. Cepat dan rapi.\n\n✦ Cutting & trimming\n✦ Tambah musik/efek suara\n✦ Teks / subtitle\n✦ Export sesuai platform\n✦ Harga: Rp 50.000 – 100.000',
        syarat: true,
      },
      {
        id: 've3', name: 'Custom Editing (Tanya Dulu)', icon: 'fa-star',
        price: 0, origPrice: 0, unit: '',
        badge: 'Harga Custom',
        short: 'Kebutuhan editing unik? Diskusikan dulu!',
        desc: 'Untuk kebutuhan editing yang tidak masuk paket standar — konten iklan, video company profile, wedding highlight, YouTube series, dll. Harga menyesuaikan kompleksitas.\n\n✦ Konsultasi terlebih dahulu\n✦ Timeline & revisi sesuai brief\n✦ Semua jenis konten\n✦ Harga: tergantung durasi & kompleksitas\n\n💬 Hubungi via WhatsApp / form kontak',
        custom: true,
        syarat: false,
      },
    ],
  },

  // ── 2. MOTION GRAPHIC ────────────────────────────────────
  {
    id: 'motion',
    icon: 'fa-film',
    label: 'Motion Graphic',
    desc: 'Animasi logo, intro, dan grafis bergerak',
    items: [
      {
        id: 'm1', name: 'Motion Graphic & Animasi', icon: 'fa-wand-magic-sparkles',
        price: 0, origPrice: 0, unit: '',
        badge: 'Coming Soon',
        short: 'Animasi logo, intro video, animasi PT',
        desc: 'Layanan motion graphic profesional menggunakan Adobe After Effects. Bisa membuat animasi logo, intro video YouTube, bumper, animasi presentasi PT, dan lainnya.\n\n✦ Animasi logo (logo reveal)\n✦ Intro / outro video\n✦ Lower third & overlay\n✦ Animasi profil PT / instansi\n✦ Tool: Adobe After Effects\n\n🚧 Segera hadir — hubungi untuk pre-order!',
        comingSoon: true,
        syarat: false,
      },
    ],
  },

  // ── 3. DESAIN GRAFIS ─────────────────────────────────────
  {
    id: 'design',
    icon: 'fa-palette',
    label: 'Desain Grafis',
    desc: 'Poster, logo, banner, dan semua yang visual',
    items: [
      {
        id: 'dg1', name: 'Poster Lomba / Kompetisi', icon: 'fa-trophy',
        price: 150000, origPrice: 250000, unit: '/ poster',
        badge: null,
        short: 'Poster event, lomba, dan kompetisi',
        desc: 'Desain poster untuk event lomba atau kompetisi. Profesional, menarik, dan siap print maupun digital.\n\n✦ 1 konsep desain\n✦ Revisi 2x\n✦ File: PNG + PDF siap cetak\n✦ Resolusi tinggi (300 DPI)\n✦ Tool: Adobe PS / Illustrator / Affinity',
        syarat: true,
      },
      {
        id: 'dg2', name: 'Poster Tugas / PR Sekolah', icon: 'fa-book',
        price: 50000, origPrice: 80000, unit: '/ poster',
        badge: null,
        short: 'Poster tugas, PR, dan keperluan sekolah',
        desc: 'Desain poster untuk kebutuhan tugas sekolah atau kampus. Cepat, rapi, dan informatif.\n\n✦ 1 konsep desain\n✦ Revisi 1x\n✦ File PNG / JPG\n✦ Harga: Rp 50.000 – 100.000\n✦ Pengerjaan 1 hari',
        syarat: true,
      },
      {
        id: 'dg3', name: 'Banner & Spanduk Acara', icon: 'fa-flag',
        price: 75000, origPrice: 120000, unit: '/ desain',
        badge: null,
        short: 'Banner, spanduk, backdrop event — diluar cetak',
        desc: 'Desain banner atau spanduk untuk acara, event, seminar, dan lainnya. File diberikan siap kirim ke percetakan.\n\n✦ Banner horizontal / vertikal\n✦ Backdrop / photobooth\n✦ File PDF resolusi tinggi\n✦ Ukuran sesuai kebutuhan\n✦ ⚠️ Di luar biaya cetak',
        syarat: true,
      },
      {
        id: 'dg4', name: 'Desain Lanyard / ID Card', icon: 'fa-id-badge',
        price: 100000, origPrice: 170000, unit: '/ desain',
        badge: null,
        short: 'Lanyard event, ID card panitia/peserta',
        desc: 'Desain lanyard dan ID card untuk keperluan event, organisasi, atau perusahaan. Profesional dan siap cetak.\n\n✦ Lanyard + ID card (1 set)\n✦ Template front & back\n✦ File PDF siap cetak\n✦ Ukuran standar atau custom\n✦ ⚠️ Di luar biaya cetak',
        syarat: true,
      },
      {
        id: 'dg5', name: 'Desain Logo & Brand Identity', icon: 'fa-star',
        price: 75000, origPrice: 120000, unit: '/ logo',
        badge: null,
        short: 'Logo bisnis, komunitas, atau personal brand',
        desc: 'Pembuatan logo untuk bisnis, komunitas, atau personal brand kamu. Diberikan dalam berbagai format dan ukuran.\n\n✦ 2 konsep logo awal\n✦ Revisi hingga approved\n✦ File: PNG, SVG, PDF, AI\n✦ Transparan background\n✦ Harga: Rp 50.000 – 100.000',
        syarat: true,
      },
      {
        id: 'dg6', name: 'Thumbnail YouTube / Poster Film', icon: 'fa-youtube',
        price: 50000, origPrice: 80000, unit: '/ desain',
        badge: null,
        short: 'Thumbnail menarik untuk konten YouTube',
        desc: 'Desain thumbnail YouTube atau poster film pendek yang eye-catching dan meningkatkan CTR. Pakai Affinity, Adobe, atau Canva sesuai gaya.\n\n✦ 1 desain thumbnail/poster\n✦ Ukuran optimal YouTube (1280x720)\n✦ File PNG resolusi tinggi\n✦ File project (opsional)\n✦ Tool: Adobe PS / Affinity / Canva',
        syarat: true,
      },
    ],
  },

  // ── 4. WO & LIVE STREAMING ───────────────────────────────
  {
    id: 'livestream',
    icon: 'fa-tower-broadcast',
    label: 'WO & Live Streaming',
    desc: 'Siaran langsung event, olahraga, dan lomba',
    items: [
      {
        id: 'ls1', name: 'Paket Live Stream 1 Orang', icon: 'fa-video',
        price: 300000, origPrice: 450000, unit: '/ hari',
        badge: 'Spesial',
        short: '1 operator, desain overlay, siaran live',
        desc: 'Paket live streaming untuk event olahraga, lomba, acara sekolah/kampus, atau event lainnya. Termasuk 1 operator plus desain overlay streaming.\n\n✦ 1 operator dedicated\n✦ Overlay + lower third custom\n✦ Setup OBS/Streamyard\n✦ Platform: YouTube / Zoom / dll\n✦ Harga: Rp 300.000 / hari\n\n⚠️ Untuk event kompleks (5 orang+), harga menyesuaikan. Hubungi dulu ya!',
        syarat: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // WEBSITE GROUP (paling bawah) — Paket dulu, baru perintilan
  // ═══════════════════════════════════════════════════════════

  // ── 5. PAKET WEBSITE (bundel, paling atas di grup website) ─
  {
    id: 'paket',
    icon: 'fa-box-open',
    label: 'Paket Website',
    desc: 'Bundel hemat, ga perlu pusing milih',
    items: [
      {
        id: 'p0', name: 'Paket 0 — Portofolio Mini', icon: 'fa-rocket',
        price: 100000, origPrice: 200000, unit: '/ paket',
        badge: 'Paling Terjangkau',
        short: 'Website portofolio — domain & hosting dari SynnnW',
        desc: 'Paket paling hemat buat kamu yang mau langsung punya website portofolio tanpa ribet urus domain & hosting sendiri. Domain dan hosting sudah termasuk dari SynnnW — kamu tinggal siapkan konten!\n\n✦ Website portofolio (vibe code, clean & modern)\n✦ Domain subdomain atau domain pilihan SynnnW\n✦ Hosting sudah include — dari server SynnnW\n✦ Design responsif mobile-first\n✦ SSL gratis\n✦ Revisi 2x\n\n💡 Cocok untuk: pelajar, mahasiswa, atau siapa saja yang mau coba punya website pertama kali.\n⚠️ Domain & hosting dikelola oleh SynnnW. Jika ingin domain/hosting sendiri, pilih Paket 1.',
        syarat: true,
      },
      {
        id: 'p1', name: 'Paket 1 — Portofolio Starter', icon: 'fa-user-tie',
        price: 450000, origPrice: 750000, unit: '/ paket',
        badge: 'Hemat 40%',
        short: 'Domain + Hosting + Website Vibe Code Portofolio',
        desc: 'Paket lengkap untuk kamu yang mau punya website portofolio atau personal branding. Semuanya diurus, kamu tinggal siapkan konten! Dibuat dengan metode vibe code (AI-assisted) — cepat & tetap profesional.\n\n✦ Domain .com (1 tahun)\n✦ Hosting Basic (1 bulan)\n✦ Website Vibe Code — clean & modern\n✦ Design responsif mobile-first\n✦ SSL gratis\n✦ Revisi 3x\n\n💡 Cocok untuk: mahasiswa, freelancer, kreator',
        syarat: true,
      },
      {
        id: 'p2', name: 'Paket 2 — Bisnis Complete', icon: 'fa-briefcase',
        price: 700000, origPrice: 1200000, unit: '/ paket',
        badge: 'Best Value',
        short: 'Domain + Hosting + Website Vibe Code + Backend',
        desc: 'Paket paling lengkap untuk bisnis yang serius. Website Vibe Code custom dengan backend Firebase dan notifikasi Telegram. Cepat tapi tetap powerful!\n\n✦ Domain .id atau .com (1 tahun)\n✦ Hosting Pro (1 bulan)\n✦ Website Vibe Code (React/Next.js)\n✦ Firebase database\n✦ Telegram bot notifikasi\n✦ SSL + email domain\n✦ Revisi 5x + support 1 bulan\n\n💡 Cocok untuk: UMKM, brand, komunitas',
        syarat: true,
      },
      {
        id: 'p3', name: 'Paket 3 — Aplikasi + QRIS Cafe', icon: 'fa-qrcode',
        price: 0, origPrice: 0, unit: '',
        badge: 'Coming Soon',
        short: 'QRIS per meja + websocket + kasir digital',
        desc: 'Paket aplikasi kafe super keren! Customer scan QR per meja, pesan langsung dari HP, dan kasir terima notifikasi real-time. Payment via QRIS/M-Banking (Midtrans).\n\n✦ QR code unik per meja\n✦ Menu digital interaktif\n✦ Sistem order real-time (WebSocket)\n✦ Payment QRIS / M-Banking (Midtrans)\n✦ Dashboard kasir tablet-friendly\n✦ Notifikasi nama + nomer meja otomatis\n✦ Laporan transaksi harian\n\n🚧 Dalam pengembangan — coming soon!',
        comingSoon: true,
        syarat: false,
      },
    ],
  },

  // ── 6. DOMAIN ────────────────────────────────────────────
  {
    id: 'domain',
    icon: 'fa-globe',
    label: 'Domain',
    desc: 'Alamat website kamu di internet',
    items: [
      {
        id: 'd1', name: 'Domain .com', icon: 'fa-globe',
        price: 190000, origPrice: 280000, unit: '/ tahun',
        badge: 'Paling Populer',
        short: 'Domain internasional paling dikenal',
        desc: 'Domain .com adalah ekstensi paling universal dan dipercaya di seluruh dunia. Cocok untuk bisnis, portofolio, maupun personal branding. Harga sudah termasuk 1 tahun registrasi dan manajemen DNS dasar.\n\n✦ Perpanjangan tahunan\n✦ Privasi WHOIS tersedia\n✦ Transfer mudah ke registrar lain\n✦ Cocok untuk: bisnis, portofolio, startup',
        syarat: true,
      },
      {
        id: 'd2', name: 'Domain .id', icon: 'fa-flag',
        price: 220000, origPrice: 350000, unit: '/ tahun',
        badge: null,
        short: 'Domain resmi Indonesia',
        desc: 'Domain .id adalah identitas resmi Indonesia yang meningkatkan kepercayaan lokal. Wajib menyertakan dokumen identitas (KTP/NPWP) untuk registrasi. Sangat direkomendasikan untuk bisnis yang menargetkan pasar Indonesia.\n\n✦ Verifikasi identitas diperlukan\n✦ Cocok untuk bisnis lokal\n✦ Meningkatkan SEO lokal\n✦ Diakui resmi oleh PANDI',
        syarat: true,
      },
      {
        id: 'd3', name: 'Domain .co.id', icon: 'fa-building',
        price: 300000, origPrice: 450000, unit: '/ tahun',
        badge: null,
        short: 'Domain korporat Indonesia',
        desc: 'Domain .co.id dikhususkan untuk perusahaan dan badan usaha di Indonesia. Memberikan kesan profesional dan resmi. Memerlukan dokumen legalitas usaha (SIUP/NIB).\n\n✦ Khusus badan usaha terdaftar\n✦ Butuh dokumen SIUP/NIB\n✦ Cocok untuk: PT, CV, koperasi\n✦ Sangat dipercaya pasar B2B',
        syarat: true,
      },
      {
        id: 'd4', name: 'Domain .net / .org / .dev', icon: 'fa-code',
        price: 250000, origPrice: 400000, unit: '/ tahun',
        badge: null,
        short: 'Domain alternatif internasional',
        desc: 'Berbagai pilihan ekstensi internasional seperti .net untuk jaringan, .org untuk organisasi, atau .dev untuk developer. Harga dapat bervariasi sesuai ekstensi yang dipilih. Diskusikan kebutuhan kamu dulu!\n\n✦ .net — jaringan & teknologi\n✦ .org — organisasi & komunitas\n✦ .dev — developer & tech\n✦ Harga 190rb – 700rb sesuai ekstensi',
        syarat: true,
      },
    ],
  },

  // ── 7. HOSTING ───────────────────────────────────────────
  {
    id: 'hosting',
    icon: 'fa-server',
    label: 'Hosting',
    desc: 'Tempat file website kamu hidup 24/7',
    items: [
      {
        id: 'h1', name: 'Hosting Basic', icon: 'fa-box',
        price: 100000, origPrice: 150000, unit: '/ bulan',
        badge: 'Pemula',
        short: 'Cocok untuk website statis & portofolio',
        desc: 'Paket hosting entry-level untuk website statis, portofolio, atau landing page sederhana. Bandwidth cukup untuk traffic ringan hingga menengah. Sudah termasuk SSL gratis dan panel kontrol.\n\n✦ Storage hingga 5GB SSD\n✦ Bandwidth unlimited (FUP)\n✦ Free SSL (HTTPS)\n✦ cPanel / hPanel\n✦ Uptime 99.5%',
        syarat: true,
      },
      {
        id: 'h2', name: 'Hosting Pro', icon: 'fa-server',
        price: 180000, origPrice: 280000, unit: '/ bulan',
        badge: 'Recommended',
        short: 'Untuk website dengan database & traffic tinggi',
        desc: 'Paket hosting profesional dengan resource lebih besar. Mendukung MySQL, PHP, Node.js, dan framework modern. Cocok untuk website dengan backend, toko online, atau aplikasi web.\n\n✦ Storage hingga 20GB NVMe SSD\n✦ Bandwidth unlimited (FUP tinggi)\n✦ MySQL + PHP + Node.js\n✦ Free SSL + domain email\n✦ Backup otomatis harian\n✦ Uptime 99.9%',
        syarat: true,
      },
    ],
  },

  // ── 8. DESAIN & DEV WEBSITE — semua pakai Vibe Code ─────
  {
    id: 'webdev',
    icon: 'fa-laptop-code',
    label: 'Desain & Dev Website',
    desc: 'Website Vibe Code (AI-assisted) — cepat & profesional',
    items: [
      {
        id: 'w1', name: 'Vibe Code — Landing Page', icon: 'fa-wand-magic-sparkles',
        price: 100000, origPrice: 200000, unit: '/ project',
        badge: 'Paling Cepat',
        short: 'Landing page / undangan digital, 1-3 hari jadi',
        desc: 'Website satu halaman menggunakan AI-assisted tools (vibe coding). Cocok untuk landing page promosi, undangan digital, atau teaser produk. Hasil tetap profesional dan responsif!\n\n✦ Proses super cepat (1-3 hari)\n✦ React / Next.js modern\n✦ Design responsif mobile-first\n✦ Revisi 2x\n✦ File project diberikan\n✦ Tool: Bolt.new / Lovable / v0',
        syarat: true,
      },
      {
        id: 'w2', name: 'Vibe Code — Portofolio & Profil', icon: 'fa-user-tie',
        price: 175000, origPrice: 300000, unit: '/ project',
        badge: 'Populer',
        short: 'Website portofolio personal / profil bisnis',
        desc: 'Website multi-section untuk portofolio personal atau profil bisnis. Dibangun dengan vibe code — cepat, rapi, dan bisa dikembangkan lebih lanjut.\n\n✦ Multi-section (hero, about, portfolio, kontak)\n✦ Animasi & transisi smooth\n✦ React / Next.js\n✦ Responsif semua perangkat\n✦ Revisi 3x\n✦ Tool: Bolt.new / Lovable / v0',
        syarat: true,
      },
      {
        id: 'w3', name: 'Vibe Code — Web Bisnis Multi-page', icon: 'fa-briefcase',
        price: 275000, origPrice: 450000, unit: '/ project',
        badge: null,
        short: 'Website bisnis lengkap dengan banyak halaman',
        desc: 'Website bisnis multi-halaman dengan navigasi, konten lengkap, dan fitur dasar. Cocok untuk UMKM, brand, atau komunitas yang butuh presence online profesional.\n\n✦ 4-6 halaman (Home, About, Services, Blog, Kontak, dll)\n✦ SEO-ready\n✦ React / Next.js modern\n✦ Integrasi form kontak\n✦ Revisi 3x\n✦ Tool: Bolt.new / Lovable / v0',
        syarat: true,
      },
      {
        id: 'w4', name: 'Vibe Code — Full Custom & App', icon: 'fa-gem',
        price: 400000, origPrice: 650000, unit: '/ project',
        badge: 'Premium',
        short: 'Aplikasi web / website custom fitur lengkap',
        desc: 'Paket premium untuk website atau aplikasi web dengan kebutuhan khusus — dashboard, sistem login, integrasi database, dll. Dikerjakan dengan vibe code + sentuhan manual untuk hasil optimal.\n\n✦ Konsultasi & brief mendalam\n✦ Fitur custom sesuai kebutuhan\n✦ Integrasi Firebase / backend opsional\n✦ Dashboard admin opsional\n✦ Dokumentasi\n✦ Revisi 5x + support 2 minggu\n✦ Tool: Bolt.new / Lovable / v0 + manual refinement',
        syarat: true,
      },
    ],
  },

  // ── 9. BACKEND & INTEGRASI (paling bawah di grup website) ─
  {
    id: 'backend',
    icon: 'fa-database',
    label: 'Backend & Integrasi',
    desc: 'Database, bot, dan notifikasi real-time',
    items: [
      {
        id: 'b1', name: 'Firebase Setup & Control', icon: 'fa-fire',
        price: 100000, origPrice: 180000, unit: '/ setup',
        badge: null,
        short: 'Database real-time + autentikasi Google',
        desc: 'Setup Firebase lengkap untuk website kamu. Termasuk Firestore database, Firebase Auth (Google Login), dan Firebase Hosting opsional.\n\n✦ Firestore real-time database\n✦ Firebase Authentication\n✦ Storage untuk file/foto\n✦ Security rules konfigurasi\n✦ Dashboard admin sederhana',
        syarat: true,
      },
      {
        id: 'b2', name: 'Telegram Bot Notification', icon: 'fa-paper-plane',
        price: 80000, origPrice: 130000, unit: '/ setup',
        badge: null,
        short: 'Notifikasi otomatis ke Telegram kamu',
        desc: 'Integrasi Telegram Bot untuk menerima notifikasi otomatis dari website kamu — form submissions, order masuk, pesan kontak, dll. Kamu cukup cek HP!\n\n✦ Bot Telegram custom\n✦ Notif form/order/kontak\n✦ Format pesan rapi & informatif\n✦ Bisa kirim ke grup atau channel\n✦ Setup + dokumentasi lengkap',
        syarat: true,
      },
      {
        id: 'b3', name: 'WebSocket Real-time', icon: 'fa-bolt',
        price: 150000, origPrice: 250000, unit: '/ setup',
        badge: null,
        short: 'Update data real-time tanpa refresh',
        desc: 'Implementasi WebSocket untuk update data secara real-time. Cocok untuk dashboard live, chat, order tracking, atau scoreboard pertandingan.\n\n✦ Socket.io atau native WS\n✦ Real-time tanpa refresh\n✦ Sinkronisasi multi-user\n✦ Cocok untuk: dashboard, chat, scoreboard\n✦ Deploy + dokumentasi',
        syarat: true,
      },
    ],
  },

];

const formatRp = (n) => {
  if (!n) return null;
  return 'Rp ' + n.toLocaleString('id-ID');
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function PriceList({ t = {} }) {
  const navigate = useNavigate();
  const revealEls = useRef([]);
  const [cart, setCart]         = useState({});           // { itemId: qty }
  const [wishlist, setWishlist] = useState(new Set());    // Set of itemId
  const [selected, setSelected] = useState(null);         // item for detail sheet
  const [sheetVisible, setSheetVisible] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  /* ── Reveal observer ── */
  const r = (el) => { if (el && !revealEls.current.includes(el)) revealEls.current.push(el); };
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    const id = setTimeout(() => { revealEls.current.forEach((el) => { if (el) obs.observe(el); }); }, 50);
    return () => { clearTimeout(id); obs.disconnect(); };
  }, []);

  /* ── Cart helpers ── */
  const addToCart   = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeCart  = (id) => setCart((prev) => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });
  const toggleWish = (id) => setWishlist((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  /* ── Checkout: simpan ke localStorage → navigate ke /contact ── */
  const handleCheckout = () => {
    const selectedServices = Object.entries(cart).map(([id, qty]) => {
      const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === id);
      return item ? { id: item.id, name: item.name, price: item.price, unit: item.unit, qty } : null;
    }).filter(Boolean);
    localStorage.setItem('selectedServices', JSON.stringify({ items: selectedServices, total: cartTotal }));
    setCartOpen(false);
    navigate('/contact');
  };

  /* ── Open detail sheet ── */
  const openSheet = (item) => {
    setSelected(item);
    setSheetVisible(true);
  };
  const closeSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setSelected(null), 320);
  };

  /* ─── RENDER ─── */
  return (
    <>
      <style>{CSS}</style>

      <div className="pl-page">

        {/* ══════ FLOATING CART BUTTON ══════ */}
        {cartCount > 0 && (
          <button className="pl-cart-fab" onClick={() => setCartOpen(true)}>
            <i className="fa-solid fa-bag-shopping" />
            <span className="pl-cart-count">{cartCount}</span>
            <span className="pl-cart-fab-label">{t.plCartFabLabel} · {formatRp(cartTotal)}</span>
          </button>
        )}

        {/* ══════ HERO ══════ */}
        <div className="pl-hero">
          <div className="pl-orb pl-orb1" /><div className="pl-orb pl-orb2" /><div className="pl-orb pl-orb3" />
          <div className="pl-hero-inner">
            <span ref={r} className="pl-page-label reveal">{t.plPageLabel}</span>
            <h1 ref={r} className="pl-hero-title reveal rv-d1">
              <span>{t.plHeroTitle}</span><br />
              <em>{t.plHeroTitleEm}</em>
            </h1>
            <p ref={r} className="pl-hero-sub reveal rv-d2">
              Pilih layanan, tap buat lihat detail, tambah ke wishlist atau langsung pesan.<br />
              {t.plHeroSub}
            </p>
            <div ref={r} className="pl-hero-pills reveal rv-d3">
              <span className="pl-hero-pill"><i className="fa-solid fa-tag" /> {t.plPillTransparent}</span>
              <span className="pl-hero-pill"><i className="fa-solid fa-rotate" /> {t.plPillRevisi}</span>
              <span className="pl-hero-pill"><i className="fa-solid fa-shield-halved" /> {t.plPillFile}</span>
            </div>
          </div>
          <div ref={r} className="pl-scroll-hint reveal rv-d4">
            <span>{t.plScrollHint}</span>
            <i className="fa-solid fa-arrow-down" />
          </div>
        </div>

        {/* ══════ BODY ══════ */}
        <div className="pl-body">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} className="pl-section">
              <div ref={r} className="pl-section-head reveal">
                <div className="pl-section-icon"><i className={`fa-solid ${cat.icon}`} /></div>
                <div>
                  <h2 className="pl-section-title">{cat.label}</h2>
                  <p className="pl-section-sub">{cat.desc}</p>
                </div>
              </div>

              <div className="pl-grid">
                {cat.items.map((item, idx) => {
                  const qty       = cart[item.id] || 0;
                  const wished    = wishlist.has(item.id);
                  const discount  = item.origPrice && item.price
                    ? Math.round((1 - item.price / item.origPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      ref={r}
                      className={`pl-card reveal rv-d${Math.min(idx + 1, 4)} ${item.comingSoon ? 'pl-card-soon' : ''}`}
                    >
                      {/* Badges */}
                      <div className="pl-card-badges">
                        {item.comingSoon && <span className="pl-badge pl-badge-soon">{t.portoBadgeSoon}</span>}
                        {item.badge && !item.comingSoon && <span className="pl-badge pl-badge-hot">{item.badge}</span>}
                        {discount > 0 && <span className="pl-badge pl-badge-disc">-{discount}%</span>}
                        {item.custom && <span className="pl-badge pl-badge-custom">Custom</span>}
                      </div>

                      {/* Wish button */}
                      <button
                        className={`pl-wish-btn ${wished ? 'pl-wished' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWish(item.id); }}
                        title={wished ? t.plWishlistRemove : t.plWishlistAdd}
                      >
                        <i className={`fa-${wished ? 'solid' : 'regular'} fa-heart`} />
                      </button>

                      {/* Card body — click to open detail */}
                      <div className="pl-card-body" onClick={() => openSheet(item)}>
                        <div className="pl-card-icon-wrap">
                          <i className={`fa-solid ${item.icon}`} />
                        </div>
                        <div className="pl-card-info">
                          <h3 className="pl-card-name">{item.name}</h3>
                          <p className="pl-card-short">{item.short}</p>
                          <div className="pl-card-price-row">
                            {item.price > 0 ? (
                              <>
                                <span className="pl-card-price">{formatRp(item.price)}</span>
                                {item.unit && <span className="pl-card-unit">{item.unit}</span>}
                                {item.origPrice > 0 && (
                                  <span className="pl-card-orig">{formatRp(item.origPrice)}</span>
                                )}
                              </>
                            ) : item.custom ? (
                              <span className="pl-card-price-custom">{t.plPriceRequest}</span>
                            ) : (
                              <span className="pl-card-price-soon">{t.plComingSoon}</span>
                            )}
                          </div>
                          {item.syarat && (
                            <span className="pl-card-syarat">{t.plSyarat}</span>
                          )}
                        </div>
                        <div className="pl-card-detail-hint">
                          <i className="fa-solid fa-chevron-right" />
                        </div>
                      </div>

                      {/* QTY controls */}
                      {!item.comingSoon && !item.custom && item.price > 0 && (
                        <div className="pl-card-actions">
                          {qty === 0 ? (
                            <button className="pl-btn-add" onClick={() => addToCart(item.id)}>
                              <i className="fa-solid fa-plus" />
                              <span>{t.plBtnTambah}</span>
                            </button>
                          ) : (
                            <div className="pl-qty-control">
                              <button className="pl-qty-btn" onClick={() => removeCart(item.id)}>
                                <i className="fa-solid fa-minus" />
                              </button>
                              <span className="pl-qty-num">{qty}</span>
                              <button className="pl-qty-btn pl-qty-plus" onClick={() => addToCart(item.id)}>
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {item.comingSoon && (
                        <div className="pl-card-actions">
                          <button className="pl-btn-notify">
                            <i className="fa-solid fa-bell" />
                            <span>{t.plBtnNotify}</span>
                          </button>
                        </div>
                      )}
                      {item.custom && (
                        <div className="pl-card-actions">
                          <button className="pl-btn-discuss" onClick={() => openSheet(item)}>
                            <i className="fa-solid fa-comments" />
                            <span>{t.plBtnDiskusi}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ══════ DETAIL BOTTOM SHEET ══════ */}
        {selected && (
          <div className={`pl-sheet-overlay ${sheetVisible ? 'pl-sheet-open' : ''}`} onClick={closeSheet}>
            <div className="pl-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="pl-sheet-handle" />
              <div className="pl-sheet-scroll">

                {/* Header */}
                <div className="pl-sheet-header">
                  <div className="pl-sheet-icon-wrap">
                    <i className={`fa-solid ${selected.icon}`} />
                  </div>
                  <div className="pl-sheet-hinfo">
                    <div className="pl-sheet-badges">
                      {selected.comingSoon && <span className="pl-badge pl-badge-soon">{t.portoBadgeSoon}</span>}
                      {selected.badge && !selected.comingSoon && <span className="pl-badge pl-badge-hot">{selected.badge}</span>}
                      {selected.price > 0 && selected.origPrice > 0 && (
                        <span className="pl-badge pl-badge-disc">
                          -{Math.round((1 - selected.price / selected.origPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <h2 className="pl-sheet-title">{selected.name}</h2>
                    <div className="pl-sheet-price-row">
                      {selected.price > 0 ? (
                        <>
                          <span className="pl-sheet-price">{formatRp(selected.price)}</span>
                          {selected.unit && <span className="pl-sheet-unit">{selected.unit}</span>}
                          {selected.origPrice > 0 && (
                            <span className="pl-sheet-orig">{formatRp(selected.origPrice)}</span>
                          )}
                        </>
                      ) : selected.custom ? (
                        <span className="pl-sheet-price">{t.plPriceRequest}</span>
                      ) : (
                        <span className="pl-sheet-price-soon">{t.plComingSoon}</span>
                      )}
                    </div>
                  </div>
                  <button className="pl-sheet-close" onClick={closeSheet}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>

                {/* Divider */}
                <div className="pl-sheet-divider" />

                {/* Description */}
                <div className="pl-sheet-desc">
                  {selected.desc.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('✦') ? 'pl-sheet-feat' : line.startsWith('⚠️') ? 'pl-sheet-warn' : line.startsWith('💡') ? 'pl-sheet-tip' : line.startsWith('💬') ? 'pl-sheet-tip' : line.startsWith('🚧') ? 'pl-sheet-soon-note' : ''}>
                      {line || <br />}
                    </p>
                  ))}
                </div>

                {/* Syarat */}
                {selected.syarat && (
                  <div className="pl-sheet-syarat">
                    <i className="fa-solid fa-circle-info" />
                    <span>{t.plSyaratFull}</span>
                  </div>
                )}

                {/* CTA */}
                <div className="pl-sheet-cta">
                  {!selected.comingSoon && !selected.custom && selected.price > 0 && (() => {
                    const qty = cart[selected.id] || 0;
                    return qty === 0 ? (
                      <button className="pl-sheet-btn-add" onClick={() => { addToCart(selected.id); }}>
                        <i className="fa-solid fa-bag-shopping" />
                        <span>{t.plBtnAddCart}</span>
                      </button>
                    ) : (
                      <div className="pl-sheet-qty">
                        <button className="pl-qty-btn pl-qty-lg" onClick={() => removeCart(selected.id)}>
                          <i className="fa-solid fa-minus" />
                        </button>
                        <span className="pl-qty-num pl-qty-lg-num">{qty}</span>
                        <button className="pl-qty-btn pl-qty-plus pl-qty-lg" onClick={() => addToCart(selected.id)}>
                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>
                    );
                  })()}
                  <button
                    className={`pl-sheet-btn-wish ${wishlist.has(selected.id) ? 'pl-wished' : ''}`}
                    onClick={() => toggleWish(selected.id)}
                  >
                    <i className={`fa-${wishlist.has(selected.id) ? 'solid' : 'regular'} fa-heart`} />
                    <span>{wishlist.has(selected.id) ? 'Disimpan' : 'Simpan'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ CART MODAL ══════ */}
        {cartOpen && (
          <div className="pl-sheet-overlay pl-sheet-open" onClick={() => setCartOpen(false)}>
            <div className="pl-sheet pl-cart-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="pl-sheet-handle" />
              <div className="pl-sheet-scroll">
                <div className="pl-cart-header">
                  <h2 className="pl-cart-title"><i className="fa-solid fa-bag-shopping" /> {t.plCartTitle}</h2>
                  <button className="pl-sheet-close" onClick={() => setCartOpen(false)}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <div className="pl-sheet-divider" />
                {Object.entries(cart).map(([id, qty]) => {
                  const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="pl-cart-item">
                      <div className="pl-cart-item-icon"><i className={`fa-solid ${item.icon}`} /></div>
                      <div className="pl-cart-item-info">
                        <span className="pl-cart-item-name">{item.name}</span>
                        <span className="pl-cart-item-price">{formatRp(item.price)} {item.unit}</span>
                      </div>
                      <div className="pl-qty-control pl-qty-mini">
                        <button className="pl-qty-btn" onClick={() => removeCart(id)}>
                          <i className="fa-solid fa-minus" />
                        </button>
                        <span className="pl-qty-num">{qty}</span>
                        <button className="pl-qty-btn pl-qty-plus" onClick={() => addToCart(id)}>
                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="pl-sheet-divider" />
                <div className="pl-cart-total">
                  <span>{t.plCartEstTotal}</span>
                  <span className="pl-cart-total-num">{formatRp(cartTotal)}</span>
                </div>
                <div className="pl-sheet-syarat">
                  <i className="fa-solid fa-circle-info" />
                  <span>{t.plCartNote}</span>
                </div>
                <button onClick={handleCheckout} className="pl-sheet-btn-add" style={{ border: 'none', cursor: 'pointer', width: '100%' }}>
                  <i className="fa-solid fa-bag-shopping" />
                  <span>{t.plBtnCheckout}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}