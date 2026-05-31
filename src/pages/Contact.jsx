import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const CSS = `
/* ── Variables (augment globals) ── */
:root {
  --glass3 : rgba(255,255,255,0.10);
  --gborder : rgba(255,255,255,0.09);
  --gborder2: rgba(255,255,255,0.16);
  --blur    : blur(18px) saturate(160%);
  --accent-g: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  --accent-g2: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  --green   : #4ade80;
  --yellow  : rgba(251,191,36,0.85);
  --red     : rgba(239,68,68,0.85);
}
[data-theme="light"] {
  --gborder : rgba(0,0,0,0.10);
  --gborder2: rgba(0,0,0,0.18);
  --glass3  : rgba(0,0,0,0.06);
}

/* ── Page shell ── */
.cq-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 64px;
}

/* ════════════════════════════════════
   WARNING SCREEN (empty cart)
════════════════════════════════════ */
.cq-warn-page {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center; justify-content: center;
  padding: 48px 24px;
  position: relative; overflow: hidden;
}
.cq-warn-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(90px);
}
.cq-wo1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 65%);
  top: -100px; left: -80px;
}
.cq-wo2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%);
  bottom: -80px; right: -60px;
}
.cq-warn-card {
  position: relative; z-index: 1;
  max-width: 540px; width: 100%;
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  padding: 56px 48px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 0;
}
.cq-warn-icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; color: var(--yellow);
  margin-bottom: 24px;
  box-shadow: 0 0 40px rgba(251,191,36,0.12);
}
.cq-warn-eyebrow {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--yellow);
  margin-bottom: 14px; display: block;
}
.cq-warn-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400; line-height: 1.1;
  color: var(--text); margin-bottom: 20px;
}
.cq-warn-title em { font-style: italic; color: var(--yellow); }
.cq-warn-sub {
  font-size: 0.88rem; color: var(--text-dim); line-height: 1.75;
  margin-bottom: 32px; max-width: 420px;
}
.cq-warn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 32px;
  background: var(--accent-g); color: #fff;
  border-radius: 99px; font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 8px 28px rgba(139,92,246,0.4);
  margin-bottom: 24px;
}
.cq-warn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(139,92,246,0.5);
}
.cq-warn-hint {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 0.72rem; color: var(--text-dim); line-height: 1.65;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 12px 16px; text-align: left;
}
.cq-warn-hint i { color: var(--accent3); flex-shrink: 0; margin-top: 1px; }
@media (max-width: 600px) {
  .cq-warn-card { padding: 40px 28px; border-radius: 22px; }
}

/* ════════════════════════════════════
   HERO
════════════════════════════════════ */
.cq-hero {
  position: relative;
  min-height: 54vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 80px 72px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.cq-hero-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(80px);
}
.cq-ho1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%);
  top: -140px; left: -100px;
}
.cq-ho2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%);
  bottom: -60px; right: 8%;
}
.cq-ho3 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%);
  top: 35%; left: 45%;
}
.cq-hero-inner { position: relative; z-index: 1; max-width: 660px; }
.cq-hero-eyebrow {
  display: inline-block;
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 22px;
}
.cq-hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.2rem, 6.5vw, 6rem);
  font-weight: 300; line-height: 1.06;
  color: var(--text); margin: 0 0 22px;
  letter-spacing: -0.025em;
}
.cq-hero-title em { font-style: italic; color: var(--accent3); }
.cq-hero-sub {
  font-size: 1rem; color: var(--text-dim);
  line-height: 1.78; max-width: 500px; margin: 0;
}
.cq-hero-cart-badge {
  position: absolute; bottom: 32px; right: 80px;
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(139,92,246,0.10);
  border: 1px solid rgba(139,92,246,0.28);
  border-radius: 99px; padding: 10px 18px;
  font-size: 0.72rem; font-weight: 600; color: var(--accent3);
}
.cq-hero-cart-badge i { font-size: 0.9rem; }
@media (max-width: 1024px) { .cq-hero { padding: 60px 40px 64px; } .cq-hero-cart-badge { right: 40px; } }
@media (max-width: 768px)  { .cq-hero { padding: 50px 24px 56px; min-height: auto; } .cq-hero-cart-badge { position: static; margin-top: 28px; width: fit-content; } }

/* ════════════════════════════════════
   BODY LAYOUT
════════════════════════════════════ */
.cq-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 64px);
  border-bottom: 1px solid var(--border);
}

/* ════════════════════════════════════
   LEFT: STEP TRACKER
════════════════════════════════════ */
.cq-left {
  padding: 52px 32px;
  border-right: 1px solid var(--border);
  position: sticky; top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto; scrollbar-width: thin;
  display: flex; flex-direction: column; gap: 28px;
}
.cq-steps-track { display: flex; flex-direction: column; gap: 2px; }
.cq-step-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px;
  transition: background 0.25s, opacity 0.25s;
  opacity: 0.38;
}
.cq-step-item.cq-step-active,
.cq-step-item.cq-step-done  { opacity: 1; }
.cq-step-item.cq-step-active { background: var(--glass); }
.cq-step-dot {
  width: 28px; height: 28px; flex-shrink: 0;
  border-radius: 50%; border: 1.5px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: var(--text-dim);
  background: var(--bg); transition: all 0.3s;
}
.cq-step-item.cq-step-active .cq-step-dot {
  border-color: var(--accent3); color: var(--accent3);
  background: rgba(139,92,246,0.08);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.14);
}
.cq-step-item.cq-step-done .cq-step-dot {
  border-color: var(--green); color: var(--green);
  background: rgba(74,222,128,0.08);
}
.cq-step-info { display: flex; flex-direction: column; gap: 1px; }
.cq-step-num  { font-size: 0.56rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
.cq-step-name { font-size: 0.8rem; font-weight: 500; color: var(--text); }
.cq-left-security {
  display: flex; align-items: flex-start; gap: 9px;
  font-size: 0.7rem; color: var(--text-dim); line-height: 1.6;
  padding: 12px 14px;
  border: 1px solid var(--gborder); border-radius: 12px;
  background: var(--glass);
}
.cq-left-security i { color: var(--accent3); flex-shrink: 0; margin-top: 1px; font-size: 0.72rem; }
.cq-avail-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(74,222,128,0.05);
  border: 1px solid rgba(74,222,128,0.18);
  border-radius: 99px; padding: 8px 14px; width: fit-content;
  font-size: 0.7rem; font-weight: 600; color: rgba(74,222,128,0.88);
  letter-spacing: 0.04em;
}
.cq-avail-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--green); flex-shrink: 0;
  animation: cqPulse 2s ease infinite;
}
@keyframes cqPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
}

/* ════════════════════════════════════
   RIGHT: FORM CARD
════════════════════════════════════ */
.cq-right { padding: 52px 56px 80px; }
.cq-card {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder);
  border-radius: 28px;
  position: relative; overflow: hidden;
  max-width: 700px; margin: 0 auto;
}
.cq-card-glow {
  position: absolute; top: -120px; right: -120px;
  width: 420px; height: 420px; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%);
  pointer-events: none;
}
.cq-card-line {
  position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
  pointer-events: none;
}

/* Progress bar */
.cq-progress-wrap {
  height: 3px; border-radius: 99px 99px 0 0; overflow: hidden;
  background: rgba(255,255,255,0.04);
}
.cq-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent3));
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  border-radius: 99px;
}

/* Step counter */
.cq-step-counter {
  padding: 20px 36px 0;
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-dim);
}
.cq-sc-cur { color: var(--accent3); font-size: 0.78rem; }
.cq-sc-lbl { opacity: 0.75; letter-spacing: 0.1em; }

/* Step body animations */
.cq-step-body { padding: 28px 36px 0; }
@keyframes enterRight {
  from { opacity: 0; transform: translateX(26px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes enterLeft {
  from { opacity: 0; transform: translateX(-26px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes exitAnim {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; }
}
.cq-enter-right { animation: enterRight 0.32s ease forwards; }
.cq-enter-left  { animation: enterLeft  0.32s ease forwards; }
.cq-exit        { animation: exitAnim   0.26s ease forwards; }

/* Step head */
.cq-step-head { margin-bottom: 30px; }
.cq-step-badge {
  display: inline-block;
  font-size: 0.57rem; font-weight: 700; letter-spacing: 0.25em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 12px;
}
.cq-step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.7rem, 3.8vw, 2.6rem);
  font-weight: 400; line-height: 1.13;
  color: var(--text); margin: 0 0 10px;
  letter-spacing: -0.015em;
}
.cq-step-title em { font-style: italic; color: var(--accent3); }
.cq-step-desc {
  font-size: 0.84rem; color: var(--text-dim); line-height: 1.72; margin: 0;
}

/* ── STEP 1: Client type cards ── */
.cq-type-grid {
  display: flex; flex-direction: column; gap: 9px;
}
.cq-type-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.035); border: 1px solid var(--gborder);
  border-radius: 16px; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif; transition: all 0.24s;
  position: relative; overflow: hidden;
}
.cq-type-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.04) 100%);
  opacity: 0; transition: opacity 0.24s;
}
.cq-type-card:hover { border-color: var(--gborder2); }
.cq-type-card:hover::before { opacity: 1; }
.cq-type-active {
  background: rgba(139,92,246,0.09) !important;
  border-color: rgba(139,92,246,0.38) !important;
  box-shadow: 0 0 0 1px rgba(139,92,246,0.15), inset 0 0 30px rgba(139,92,246,0.04);
}
.cq-type-icon-wrap {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--gborder);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: var(--text-dim); transition: all 0.24s;
}
.cq-type-active .cq-type-icon-wrap {
  background: rgba(139,92,246,0.14); border-color: rgba(139,92,246,0.35);
  color: var(--accent3);
}
.cq-type-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.cq-type-label { font-size: 0.88rem; font-weight: 600; color: var(--text); }
.cq-type-desc  { font-size: 0.7rem; color: var(--text-dim); }
.cq-type-active .cq-type-label { color: var(--accent3); }
.cq-type-check {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(139,92,246,0.45);
}

/* ── STEP 2: Order summary ── */
.cq-summary-card {
  background: rgba(139,92,246,0.04);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 20px; padding: 22px 24px;
}
.cq-summary-head {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 18px;
}
.cq-summary-head i { font-size: 1rem; }
.cq-summary-count {
  margin-left: auto; font-size: 0.65rem;
  background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.28);
  border-radius: 99px; padding: 3px 10px; color: var(--accent3);
}
.cq-summary-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.cq-summary-row {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 12px 14px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 12px;
}
.cq-summary-row-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.cq-summary-name  { font-size: 0.84rem; font-weight: 600; color: var(--text); }
.cq-summary-short { font-size: 0.7rem; color: var(--text-dim); }
.cq-summary-row-right {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.cq-summary-qty {
  font-size: 0.68rem; color: var(--text-dim);
  background: var(--glass); border: 1px solid var(--gborder);
  padding: 2px 8px; border-radius: 99px;
}
.cq-summary-price { font-size: 0.84rem; font-weight: 700; color: var(--text); }
.cq-summary-divider {
  height: 1px; background: var(--border);
  margin: 16px 0;
}
.cq-summary-total {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.78rem; color: var(--text-dim); font-weight: 600;
  letter-spacing: 0.06em; margin-bottom: 14px;
}
.cq-summary-total-num {
  font-size: 1.3rem; font-weight: 700; color: var(--text);
}
.cq-summary-notes { display: flex; flex-direction: column; gap: 6px; }
.cq-summary-notes p {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 0.69rem; color: var(--text-dim); line-height: 1.6; margin: 0;
}
.cq-summary-notes i { flex-shrink: 0; margin-top: 1px; }
.cq-summary-notes p:first-child i { color: var(--accent3); }
.cq-summary-notes p:last-child  i { color: var(--yellow); }

/* ── STEP 3: Creative slider ── */
.cq-slider-section { display: flex; flex-direction: column; gap: 22px; }
.cq-slider-main {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 22px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 16px;
}
.cq-slider-pole {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  font-size: 0.66rem; font-weight: 700; color: var(--text-dim);
  letter-spacing: 0.06em; text-transform: uppercase;
  flex-shrink: 0; width: 58px; text-align: center;
}
.cq-slider-pole i { font-size: 1rem; color: var(--accent3); }
.cq-slider {
  -webkit-appearance: none; appearance: none;
  flex: 1; height: 5px; border-radius: 99px;
  background: linear-gradient(
    to right,
    rgba(139,92,246,0.7) 0%,
    rgba(139,92,246,0.7) var(--thumb-pct, 50%),
    rgba(255,255,255,0.08) var(--thumb-pct, 50%)
  );
  outline: none; cursor: pointer;
  border: 1px solid var(--gborder);
}
.cq-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.3), 0 4px 12px rgba(139,92,246,0.45);
  transition: box-shadow 0.22s, transform 0.22s;
}
.cq-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(139,92,246,0.25), 0 4px 20px rgba(139,92,246,0.55);
  transform: scale(1.1);
}
.cq-slider::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.3);
}
.cq-slider-result { position: relative; height: 24px; margin: -6px 90px 0; }
.cq-slider-thumb-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em;
  color: var(--accent3);
  background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.28);
  border-radius: 99px; padding: 2px 10px;
  transition: left 0.1s;
  white-space: nowrap;
}
.cq-slider-bands {
  display: flex; flex-direction: column; gap: 8px;
}
.cq-band {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 16px; border-radius: 14px;
  border: 1px solid var(--gborder);
  background: var(--glass);
  transition: all 0.3s; opacity: 0.4;
}
.cq-band-active {
  opacity: 1;
  background: rgba(139,92,246,0.07) !important;
  border-color: rgba(139,92,246,0.28) !important;
}
.cq-band-emoji { font-size: 1.3rem; flex-shrink: 0; margin-top: 1px; }
.cq-band-label {
  display: block; font-size: 0.82rem; font-weight: 600; color: var(--text);
  margin-bottom: 2px;
}
.cq-band-desc  {
  display: block; font-size: 0.7rem; color: var(--text-dim); line-height: 1.55;
}
.cq-band-active .cq-band-label { color: var(--accent3); }
.cq-slider-chosen {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.76rem; color: var(--text-dim);
  padding: 12px 16px;
  background: var(--glass); border: 1px solid var(--gborder); border-radius: 12px;
}
.cq-slider-chosen i { color: var(--accent3); }
.cq-slider-chosen strong { color: var(--text); }

/* ── STEP 4: Fields ── */
.cq-fields { display: flex; flex-direction: column; gap: 22px; }
.cq-field-group { display: flex; flex-direction: column; gap: 7px; position: relative; }
.cq-field-label {
  font-size: 0.61rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-dim);
}
.cq-required    { color: rgba(239,68,68,0.7); }
.cq-field-optional { font-weight: 400; text-transform: none; letter-spacing: 0; opacity: 0.75; }
.cq-field-input {
  background: rgba(255,255,255,0.04); border: 1px solid var(--gborder);
  border-radius: 12px; padding: 13px 16px;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  color: var(--text); outline: none; width: 100%; box-sizing: border-box;
  transition: border-color 0.28s, background 0.28s;
}
.cq-field-input::placeholder { color: var(--text-dim); opacity: 0.45; }
.cq-field-input:focus { border-color: rgba(139,92,246,0.45); background: rgba(139,92,246,0.04); }
.cq-field-err  { border-color: rgba(239,68,68,0.5) !important; }
.cq-err-msg    { font-size: 0.64rem; color: var(--red); display: block; }
.cq-field-count{
  font-size: 0.62rem; color: var(--text-dim);
  text-align: right; opacity: 0.6;
}
.cq-field-textarea { resize: vertical; min-height: 140px; line-height: 1.68; }

/* ── STEP 5: Review card ── */
.cq-review-card {
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--gborder);
  border-radius: 20px; padding: 22px 24px;
  margin-bottom: 20px;
}
.cq-review-section {
  display: flex; align-items: flex-start; gap: 14px;
  justify-content: space-between;
}
.cq-review-section-col { flex-direction: column; gap: 10px; }
.cq-review-lbl {
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
  display: flex; align-items: center; gap: 7px;
  flex-shrink: 0; white-space: nowrap;
}
.cq-review-lbl i { color: var(--accent3); font-size: 0.75rem; }
.cq-review-val {
  font-size: 0.86rem; font-weight: 500; color: var(--text);
  text-align: right;
}
.cq-review-divider { height: 1px; background: var(--border); margin: 14px 0; }
.cq-review-cart { display: flex; flex-direction: column; gap: 6px; }
.cq-review-item {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.78rem; color: var(--text-dim);
  padding: 6px 10px;
  background: var(--glass); border-radius: 8px;
}
.cq-review-total-row {
  border-top: 1px solid var(--border); margin-top: 4px;
  padding-top: 10px; background: transparent !important;
  font-size: 0.82rem; color: var(--text) !important;
}
.cq-review-desc-val {
  font-size: 0.82rem; color: var(--text-dim);
  line-height: 1.72; margin: 0;
  padding: 12px 14px;
  background: var(--glass); border-radius: 12px;
  border: 1px solid var(--gborder);
  white-space: pre-wrap;
}

/* Submit note */
.cq-submit-note {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 18px; margin-bottom: 16px;
  background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.18);
  border-radius: 14px;
}
.cq-submit-note i { font-size: 1.1rem; color: var(--accent3); flex-shrink: 0; margin-top: 1px; }
.cq-submit-note p { font-size: 0.78rem; color: var(--text-dim); line-height: 1.68; margin: 0; }

/* Global error */
.cq-global-err {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.78rem; color: var(--red);
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 12px; padding: 12px 16px; margin-bottom: 16px;
}

/* ── Navigation ── */
.cq-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 36px 30px;
  margin-top: 10px; border-top: 1px solid var(--border);
}
.cq-btn-back {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px;
  background: var(--glass); border: 1px solid var(--gborder);
  border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.71rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-dim); transition: all 0.24s;
}
.cq-btn-back:hover { color: var(--text); border-color: var(--gborder2); }
.cq-btn-next {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 30px; margin-left: auto;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.71rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.3s;
}
.cq-btn-next:hover {
  background: var(--accent); color: #fff;
  box-shadow: 0 8px 28px rgba(139,92,246,0.4);
  transform: translateY(-1px);
}
.cq-btn-submit {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 32px; margin-left: auto;
  background: var(--accent-g); color: #fff;
  border: none; border-radius: 99px; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.35s;
  box-shadow: 0 8px 28px rgba(139,92,246,0.4);
}
.cq-btn-submit:hover:not(:disabled) {
  background: var(--accent-g2);
  box-shadow: 0 14px 40px rgba(139,92,246,0.55);
  transform: translateY(-2px);
}
.cq-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Spinner */
.cq-spinner {
  display: inline-block; width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: cqSpin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes cqSpin { to { transform: rotate(360deg); } }

/* ════════════════════════════════════
   STEP 6: CHECKOUT PAGE
════════════════════════════════════ */
.cq-checkout-page {
  min-height: calc(100vh - 64px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 60px 24px 80px;
  position: relative; overflow: hidden;
}
.cq-co-orb {
  position: absolute; border-radius: 50%;
  pointer-events: none; filter: blur(90px);
}
.cq-coo1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%);
  top: -150px; left: -120px;
}
.cq-coo2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%);
  bottom: -80px; right: -60px;
}
.cq-coo3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%);
  top: 40%; left: 50%;
}
.cq-co-wrap {
  position: relative; z-index: 1;
  width: 100%; max-width: 860px;
  display: flex; flex-direction: column; gap: 24px;
}

/* Header */
.cq-co-header {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 0; padding-bottom: 8px;
}
.cq-co-success-ring {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.28);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--green);
  margin-bottom: 22px;
  box-shadow: 0 0 60px rgba(74,222,128,0.15);
  animation: successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both;
}
@keyframes successPop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
.cq-co-eyebrow {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--green);
  margin-bottom: 14px; display: block;
}
.cq-co-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 300; line-height: 1.1;
  color: var(--text); letter-spacing: -0.02em; margin: 0;
}
.cq-co-title em { font-style: italic; color: var(--accent3); }

/* Order ID card */
.cq-co-id-card {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 16px 20px;
  background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.22);
  border-radius: 16px;
}
.cq-co-id-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.cq-co-id-left > i { font-size: 1.2rem; color: var(--accent3); flex-shrink: 0; }
.cq-co-id-lbl  { display: block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 3px; }
.cq-co-id-val  {
  font-family: 'Courier New', monospace;
  font-size: 0.84rem; font-weight: 700;
  color: var(--accent3); word-break: break-all;
  background: transparent; border: none;
}
.cq-co-id-copy {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: var(--glass); border: 1px solid var(--gborder);
  cursor: pointer; color: var(--text-dim);
  font-size: 0.88rem; transition: all 0.22s;
}
.cq-co-id-copy:hover { color: var(--accent3); border-color: rgba(139,92,246,0.3); }

/* Nota grid */
.cq-co-grid {
  display: grid; grid-template-columns: 1fr 320px; gap: 20px;
  align-items: start;
}
.cq-co-nota {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder); border-radius: 22px;
  padding: 22px 24px;
}
.cq-co-nota-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent3);
  margin-bottom: 16px;
}
.cq-co-nota-head i { font-size: 1rem; }
.cq-co-nota-items { display: flex; flex-direction: column; gap: 10px; }
.cq-co-nota-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem;
}
.cq-co-nota-name  { flex: 1; color: var(--text); font-weight: 500; }
.cq-co-nota-qty   { font-size: 0.68rem; color: var(--text-dim); background: var(--glass); border: 1px solid var(--gborder); padding: 2px 8px; border-radius: 99px; }
.cq-co-nota-price { font-weight: 700; color: var(--text); min-width: 110px; text-align: right; }
.cq-co-nota-divider { height: 1px; background: var(--border); margin: 16px 0; }
.cq-co-nota-total {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.78rem; color: var(--text-dim); font-weight: 600;
  letter-spacing: 0.06em; margin-bottom: 16px;
}
.cq-co-nota-total-num { font-size: 1.4rem; font-weight: 700; color: var(--text); }
.cq-co-dp-badge {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; margin-bottom: 16px;
  background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.22);
  border-radius: 14px;
}
.cq-co-dp-badge > i { font-size: 1.1rem; color: var(--yellow); flex-shrink: 0; }
.cq-co-dp-label  { font-size: 0.68rem; color: var(--text-dim); margin-bottom: 3px; }
.cq-co-dp-amount { font-size: 1.1rem; font-weight: 700; color: var(--yellow); }
.cq-co-nota-meta { display: flex; flex-direction: column; gap: 8px; }
.cq-co-nota-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.76rem; color: var(--text-dim); padding: 6px 10px;
  background: var(--glass); border-radius: 8px;
}
.cq-co-nota-meta-row span:last-child { color: var(--text); font-weight: 500; text-align: right; }

/* QRIS column */
.cq-co-qris-col {
  background: var(--glass);
  backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--gborder); border-radius: 22px;
  padding: 22px 20px; text-align: center;
  display: flex; flex-direction: column; gap: 14px; align-items: center;
}
.cq-co-qris-title {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent3);
}
.cq-co-qris-frame {
  width: 220px; height: 220px; border-radius: 16px; overflow: hidden;
  border: 2px solid var(--gborder2);
  background: var(--bg2);
  display: flex; align-items: center; justify-content: center;
}
.cq-co-qris-img { width: 100%; height: 100%; object-fit: contain; }
.cq-co-qris-sub {
  font-size: 0.7rem; color: var(--text-dim); line-height: 1.65; text-align: center;
}
.cq-co-qris-amount {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 12px 18px; width: 100%;
  background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.2);
  border-radius: 12px;
}
.cq-co-qris-amount span { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.08em; text-transform: uppercase; }
.cq-co-qris-amount strong { font-size: 1.05rem; font-weight: 700; color: var(--green); }

/* WA button */
.cq-co-wa-btn {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; padding: 18px;
  background: linear-gradient(135deg, #25d366 0%, #1da851 100%);
  color: #fff; border-radius: 16px; text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.35s;
  box-shadow: 0 8px 32px rgba(37,211,102,0.35);
}
.cq-co-wa-btn i:first-child { font-size: 1.4rem; }
.cq-co-wa-ext { font-size: 0.75rem !important; opacity: 0.8; }
.cq-co-wa-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 48px rgba(37,211,102,0.5);
}
.cq-co-footer {
  display: flex; align-items: center; gap: 10px; justify-content: center;
  font-size: 0.76rem; color: var(--text-dim); line-height: 1.65;
  text-align: center;
}
.cq-co-footer i { color: var(--accent3); flex-shrink: 0; }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .cq-body { grid-template-columns: 1fr; }
  .cq-left {
    position: static; height: auto;
    border-right: none; border-bottom: 1px solid var(--border);
    padding: 32px 36px; flex-direction: row; flex-wrap: wrap;
    align-items: flex-start; gap: 16px;
  }
  .cq-steps-track { flex-direction: row; flex-wrap: wrap; gap: 4px; }
  .cq-right { padding: 40px 36px 72px; }
  .cq-co-grid { grid-template-columns: 1fr; }
  .cq-co-qris-col { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .cq-co-qris-frame { width: 180px; height: 180px; }
}
@media (max-width: 768px) {
  .cq-left  { padding: 24px 20px; }
  .cq-right { padding: 30px 16px 60px; }
  .cq-card  { border-radius: 20px; }
  .cq-step-body { padding: 22px 20px 0; }
  .cq-step-counter { padding: 18px 20px 0; }
  .cq-nav   { padding: 18px 20px 24px; }
  .cq-co-wrap { gap: 18px; }
  .cq-checkout-page { padding: 40px 16px 60px; }
}
`;


/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const getClientTypes = (t) => [
  { value: 'individu',   label: t.cqClientIndividu   || 'Pribadi / Individu',        icon: 'fa-user',             desc: t.cqClientIndividuDesc   || 'Proyek personal, portofolio, dll.' },
  { value: 'bisnis',     label: t.cqClientBisnis      || 'Bisnis / Brand / UMKM',     icon: 'fa-briefcase',         desc: t.cqClientBisnisDesc      || 'Branding, konten, pemasaran' },
  { value: 'organisasi', label: t.cqClientOrg         || 'Sekolah / Kampus / Komunitas', icon: 'fa-building-columns', desc: t.cqClientOrgDesc         || 'Event, tugas, kegiatan institusi' },
  { value: 'pasangan',   label: t.cqClientPasangan    || 'Pasangan (Wedding)',         icon: 'fa-heart',             desc: t.cqClientPasanganDesc    || 'Dokumentasi & undangan digital' },
  { value: 'kreator',    label: t.cqClientKreator     || 'Kreator Konten / Influencer', icon: 'fa-video',            desc: t.cqClientKreatorDesc     || 'YouTube, TikTok, Reels, streaming' },
];

const TOTAL_STEPS = 5;
const WA_NUMBER   = '628XXXXXXXXXX'; // ← Ganti dengan nomor WA kamu

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

export default function Contact({ t = {} }) {
  // ✅ FIX #1: Define CLIENT_TYPES dari getClientTypes(t)
  const CLIENT_TYPES = getClientTypes(t);
  /* ── Cart ── */
  const [cartData,   setCartData]   = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedServices');
      if (raw) setCartData(JSON.parse(raw));
    } catch (_) {/* corrupt data — biarkan null */}
    setCartLoaded(true);
  }, []);

  /* ── Step & animation ── */
  const [step,    setStep]    = useState(1);
  const [animDir, setAnimDir] = useState('forward');
  const [visible, setVisible] = useState(true);

  /* ── Form fields ── */
  const [clientType,     setClientType]     = useState('');
  const [creativeSlider, setCreativeSlider] = useState(50);
  const [projectName,    setProjectName]    = useState('');
  const [projectDesc,    setProjectDesc]    = useState('');

  /* ── Errors ── */
  const [errors, setErrors] = useState({});

  /* ── Firebase submit ── */
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState('');
  const [generatedId,  setGeneratedId]  = useState('');
  const navigate = useNavigate();

  const formRef = useRef(null);

  /* ── Safe cart helpers with optional chaining ── */
  const cartItems = cartData?.items ?? [];
  const cartTotal = cartData?.total ?? 0;

  /* ─────── STEP NAVIGATION ─────── */
  const goToStep = (next, dir = 'forward') => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setErrors({});
      setVisible(true);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  };

  const handleNext = () => {
    const e = {};
    if (step === 1 && !clientType)         e.clientType  = 'Pilih salah satu tipe klien.';
    if (step === 4 && !projectName.trim()) e.projectName = 'Nama proyek wajib diisi.';
    if (Object.keys(e).length) { setErrors(e); return; }
    goToStep(step + 1, 'forward');
  };

  const handleBack = () => goToStep(step - 1, 'back');

  /* ─────── FIREBASE SUBMIT (try-catch-finally) ─────── */
  const handleSubmitData = async (e) => {
    // ✅ FIX #2: Add e.preventDefault() di baris pertama
    if (e) {
      e.preventDefault();
    }

    if (!auth.currentUser) {
      setSubmitError('Harap login terlebih dahulu sebelum mengirim brief.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    
    try {
      const payload = {
        userId:             auth.currentUser.uid,
        userEmail:          auth.currentUser.email, // ✅ FIX #3: Tambah email untuk tracking
        clientType,
        creativePreference: creativeSlider,
        creativeLabel:      sliderLabel(creativeSlider),
        projectName:        projectName.trim(),
        projectDesc:        projectDesc.trim(),
        selectedItems:      cartItems,
        cartTotal,
        serviceCategory: (() => {
          if (!cartItems || cartItems.length === 0) return 'general';
          const firstId = cartItems[0]?.id ?? '';
          if (firstId.startsWith('ve') || firstId.startsWith('m'))  return 'video';
          if (firstId.startsWith('dg'))                              return 'design';
          if (firstId.startsWith('ls'))                              return 'livestream';
          if (firstId.startsWith('p') || firstId.startsWith('w'))   return 'website';
          if (firstId.startsWith('d') || firstId.startsWith('h'))   return 'domain';
          return 'general';
        })(),
        serviceNames: cartItems.map(i => i?.name ?? '').filter(Boolean),
        status:             'Pending',
        timestamp:          serverTimestamp(),
      };

      console.log('[Contact] 📤 Submitting payload:', payload);

      // ✅ FIX #3: Wrap dalam try-catch dengan verbose logging
      const docRef = await addDoc(collection(db, 'orders'), payload);
      
      console.log('✅ [Contact] Order berhasil disimpan!');
      console.log(`   📋 Document ID: ${docRef.id}`);
      console.log(`   👤 User ID: ${auth.currentUser.uid}`);
      console.log(`   📦 Service Category: ${payload.serviceCategory}`);
      
      setGeneratedId(docRef.id);
      
      // Navigate ke Dashboard sesuai README_OVERVIEW.md flow
      setTimeout(() => {
        navigate('/Dashboard');
      }, 500);

    } catch (err) {
      console.error('❌ [Contact] Firebase error saat upload order:');
      console.error(`   Error Code: ${err.code || 'UNKNOWN'}`);
      console.error(`   Error Message: ${err.message}`);
      console.error(`   Full Error:`, err);

      // Tentukan pesan error yang lebih spesifik
      let errorMsg = 'Gagal menyimpan data. Periksa koneksi dan coba lagi.';
      
      if (err.code === 'permission-denied') {
        errorMsg = 'Anda tidak memiliki izin untuk menyimpan order. Hubungi admin.';
      } else if (err.code === 'unavailable') {
        errorMsg = 'Firestore sedang tidak tersedia. Coba lagi dalam beberapa saat.';
      } else if (err.message?.includes('network')) {
        errorMsg = 'Masalah koneksi jaringan. Periksa internet Anda.';
      }

      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────── SLIDER LABEL HELPER ─────── */
  const sliderLabel = (val) => {
    if (val < 30)  return 'Minimalis & Bersih';
    if (val < 60)  return 'Seimbang & Fleksibel';
    if (val < 85)  return 'Dinamis & Berkarakter';
    return 'Kompleks & Ekspresif';
  };

  /* ─────── WA MESSAGE ─────── */
  const buildWAMessage = () => {
    const itemLines = cartItems?.length
      ? cartItems.map(i =>
          `  • ${i?.name ?? 'Item'} ×${i?.qty ?? 1} — Rp ${((i?.price ?? 0) * (i?.qty ?? 1)).toLocaleString('id-ID')}`
        ).join('\n')
      : '  (tidak ada item dari Price List)';

    const clientLabel = CLIENT_TYPES.find(c => c.value === clientType)?.label ?? clientType;

    const msg = [
      '🎨 *BRIEF & ORDER BARU — SynnnW*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      `📋 *ORDER ID:* \`${generatedId}\``,
      '',
      '👤 *TIPE KLIEN*',
      `  • ${clientLabel}`,
      '',
      '🎨 *PREFERENSI KREATIF*',
      `  • Skala ${creativeSlider}/100 — ${sliderLabel(creativeSlider)}`,
      '',
      '📁 *DETAIL PROYEK*',
      `  • Nama Proyek : ${projectName}`,
      `  • Deskripsi   : ${projectDesc || '—'}`,
      '',
      '🛒 *ITEM YANG DIPESAN*',
      itemLines,
      '',
      `💰 *TOTAL TAGIHAN : Rp ${cartTotal.toLocaleString('id-ID')}*`,
      `   DP 50% yang harus ditransfer: *Rp ${Math.ceil(cartTotal / 2).toLocaleString('id-ID')}*`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Halo kak, saya ingin konfirmasi pembayaran untuk order di atas! 🙏',
    ].join('\n');

    return encodeURIComponent(msg);
  };

  /* ═══════════════════════════════════════════════════════════
     GUARD: KERANJANG KOSONG
  ══════════════════════════════════════════════════════════ */
  if (cartLoaded && cartItems.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cq-page">
          <div className="cq-warn-page">
            <div className="cq-warn-orb cq-wo1" />
            <div className="cq-warn-orb cq-wo2" />
            <div className="cq-warn-card">
              <div className="cq-warn-icon-ring">
                <i className="fa-solid fa-cart-shopping" />
              </div>
              <span className="cq-warn-eyebrow">{t.cqWarnTitle}</span>
              <h2 className="cq-warn-title">{t.cqWarnCartEmpty}</h2>
              <p className="cq-warn-sub">
                Kamu belum memilih layanan apapun. Kunjungi halaman <strong>Price List</strong> terlebih dahulu, pilih paket yang kamu butuhkan, lalu kembali ke sini untuk melanjutkan proses pesanan.
              </p>
              <a href="/price-list" className="cq-warn-cta">
                <i className="fa-solid fa-arrow-left" />
                <span>{t.cqWarnGoPriceList}</span>
              </a>
              <p className="cq-warn-hint">
                <i className="fa-solid fa-circle-info" />
                Setelah memilih layanan, tekan tombol <strong>&#34;Order&#34;</strong> atau <strong>&#34;Pesan&#34;</strong> untuk membuka halaman ini dengan keranjang terisi.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     STEP 6: CHECKOUT / NOTA PEMBAYARAN
  ══════════════════════════════════════════════════════════ */
  if (step === 6) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cq-page">
          <div className="cq-checkout-page">
            <div className="cq-co-orb cq-coo1" />
            <div className="cq-co-orb cq-coo2" />
            <div className="cq-co-orb cq-coo3" />

            <div className="cq-co-wrap">

              {/* ── Header ── */}
              <div className="cq-co-header">
                <div className="cq-co-success-ring">
                  <i className="fa-solid fa-circle-check" />
                </div>
                <span className="cq-co-eyebrow">{t.cqSuccessEyebrow}</span>
                <h1 className="cq-co-title">{t.cqSuccessTitle}<br /><em>{t.cqSuccessTitleEm}</em></h1>
              </div>

              {/* ── Order ID ── */}
              <div className="cq-co-id-card">
                <div className="cq-co-id-left">
                  <i className="fa-solid fa-fingerprint" />
                  <div>
                    <span className="cq-co-id-lbl">{t.cqOrderID}</span>
                    <code className="cq-co-id-val">{generatedId}</code>
                  </div>
                </div>
                <button
                  type="button"
                  className="cq-co-id-copy"
                  onClick={() => navigator.clipboard?.writeText(generatedId)}
                  title="Salin ID"
                >
                  <i className="fa-regular fa-copy" />
                </button>
              </div>

              {/* ── Nota grid ── */}
              <div className="cq-co-grid">

                {/* LEFT: Order summary */}
                <div className="cq-co-nota">
                  <div className="cq-co-nota-head">
                    <i className="fa-solid fa-receipt" />
                    <span>{t.cqRingkasan}</span>
                  </div>

                  <div className="cq-co-nota-items">
                    {cartItems?.map((item, idx) => (
                      <div key={item?.id ?? idx} className="cq-co-nota-row">
                        <span className="cq-co-nota-name">{item?.name ?? 'Item'}</span>
                        <span className="cq-co-nota-qty">×{item?.qty ?? 1}</span>
                        <span className="cq-co-nota-price">
                          Rp {((item?.price ?? 0) * (item?.qty ?? 1)).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="cq-co-nota-divider" />

                  <div className="cq-co-nota-total">
                    <span>{t.cqTotalTagihan}</span>
                    <span className="cq-co-nota-total-num">
                      Rp {cartTotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="cq-co-dp-badge">
                    <i className="fa-solid fa-coins" />
                    <div>
                      <p className="cq-co-dp-label">{t.cqDP50Label}</p>
                      <p className="cq-co-dp-amount">
                        Rp {Math.ceil(cartTotal / 2).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="cq-co-nota-meta">
                    <div className="cq-co-nota-meta-row">
                      <span>{t.cqProyek}</span>
                      <span>{projectName || '—'}</span>
                    </div>
                    <div className="cq-co-nota-meta-row">
                      <span>{t.cqTipeKlien}</span>
                      <span>{CLIENT_TYPES.find(c => c.value === clientType)?.label ?? clientType}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: QRIS */}
                <div className="cq-co-qris-col">
                  <p className="cq-co-qris-title">{t.cqQRISTitle}</p>
                  <div className="cq-co-qris-frame">
                    <img src="/qris.png" alt="QRIS Pembayaran SynnnW" className="cq-co-qris-img" />
                  </div>
                  <p className="cq-co-qris-sub">
                    {t.cqQRISNote}
                  </p>
                  <div className="cq-co-qris-amount">
                    <span>{t.cqNominalTransfer}</span>
                    <strong>Rp {Math.ceil(cartTotal / 2).toLocaleString('id-ID')}</strong>
                  </div>
                </div>

              </div>

              {/* ── WA Button ── */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${buildWAMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cq-co-wa-btn"
              >
                <i className="fa-brands fa-whatsapp" />
                <span>{t.cqConfirmWA}</span>
                <i className="fa-solid fa-arrow-up-right-from-square cq-co-wa-ext" />
              </a>

              <button
                onClick={async () => { await signOut(auth); navigate('/'); }}
                style={{
                  marginTop: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  padding: '10px 24px',
                  borderRadius: '99px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <i className="fa-solid fa-right-from-bracket" /> Logout
              </button>

              <p className="cq-co-footer">
                <i className="fa-solid fa-clock" />
                {t.cqReplyTime}
              </p>

            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     STEP 1–5: FORM KUESIONER
  ══════════════════════════════════════════════════════════ */
  const STEP_LABELS = [t.cqStepTipeKlien || 'Tipe Klien', t.cqStepRingkasan || 'Ringkasan', t.cqStepPreferensi || 'Preferensi', t.cqStepDetail || 'Detail Proyek', t.cqStepKonfirmasi || 'Konfirmasi'];

  return (
    <>
      <style>{CSS}</style>
      <div className="cq-page">

        {/* ─── HERO ─── */}
        <div className="cq-hero">
          <div className="cq-hero-orb cq-ho1" />
          <div className="cq-hero-orb cq-ho2" />
          <div className="cq-hero-orb cq-ho3" />
          <div className="cq-hero-inner">
            <span className="cq-hero-eyebrow">{t.cqNewProject}</span>
            <h1 className="cq-hero-title">
              {t.cqFormTitle}<br /><em>{t.cqFormTitleEm}</em>
            </h1>
            <p className="cq-hero-sub">
              {t.cqFormSub}
            </p>
          </div>
          {cartItems.length > 0 && (
            <div className="cq-hero-cart-badge">
              <i className="fa-solid fa-bag-shopping" />
              <span>{cartItems.length} layanan dipilih — Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>

        {/* ─── BODY ─── */}
        <div className="cq-body" ref={formRef}>

          {/* LEFT: sticky step tracker */}
          <div className="cq-left">
            <div className="cq-steps-track">
              {STEP_LABELS.map((lbl, i) => {
                const idx    = i + 1;
                const done   = step > idx;
                const active = step === idx;
                return (
                  <div
                    key={idx}
                    className={`cq-step-item ${active ? 'cq-step-active' : ''} ${done ? 'cq-step-done' : ''}`}
                  >
                    <div className="cq-step-dot">
                      {done
                        ? <i className="fa-solid fa-check" style={{ fontSize: '0.58rem' }} />
                        : <span>{idx}</span>
                      }
                    </div>
                    <div className="cq-step-info">
                      <span className="cq-step-num">Step {idx}</span>
                      <span className="cq-step-name">{lbl}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cq-left-security">
              <i className="fa-solid fa-lock" />
              <span>{t.cqDataSafe}</span>
            </div>

            <div className="cq-avail-badge">
              <span className="cq-avail-dot" />
              <span>{t.badgeAvail}</span>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div className="cq-right">
            <div className="cq-card">
              <div className="cq-card-glow" />
              <div className="cq-card-line" />

              {/* Progress bar */}
              <div className="cq-progress-wrap">
                <div className="cq-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>

              {/* Step counter */}
              <div className="cq-step-counter">
                <span className="cq-sc-cur">{step}</span>
                <span className="cq-sc-sep"> / </span>
                <span className="cq-sc-tot">{TOTAL_STEPS}</span>
                <span className="cq-sc-lbl">&nbsp;— {STEP_LABELS[step - 1]}</span>
              </div>

              {/* Animated step content */}
              <div
                className={`cq-step-body ${
                  visible
                    ? animDir === 'forward' ? 'cq-enter-right' : 'cq-enter-left'
                    : 'cq-exit'
                }`}
              >

                {/* ══════ STEP 1: TIPE KLIEN ══════ */}
                {step === 1 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">{t.cqStep1Num}</span>
                      <h2 className="cq-step-title">{t.cqStep1Title} <em>{t.cqStep1TitleEm}</em></h2>
                      <p className="cq-step-desc">
                        Pilih kategori yang paling menggambarkan dirimu. Ini membantu aku menyesuaikan pendekatannya.
                      </p>
                    </div>

                    {errors.clientType && (
                      <div className="cq-global-err">
                        <i className="fa-solid fa-triangle-exclamation" />
                        {errors.clientType}
                      </div>
                    )}

                    <div className="cq-type-grid">
                      {getClientTypes(t).map((ct) => (
                        <button
                          key={ct.value}
                          type="button"
                          className={`cq-type-card ${clientType === ct.value ? 'cq-type-active' : ''}`}
                          onClick={() => setClientType(ct.value)}
                        >
                          <div className="cq-type-icon-wrap">
                            <i className={`fa-solid ${ct.icon}`} />
                          </div>
                          <div className="cq-type-info">
                            <span className="cq-type-label">{ct.label}</span>
                            <span className="cq-type-desc">{ct.desc}</span>
                          </div>
                          {clientType === ct.value && (
                            <div className="cq-type-check">
                              <i className="fa-solid fa-check" style={{ fontSize: '0.55rem' }} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ══════ STEP 2: ORDER SUMMARY ══════ */}
                {step === 2 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">{t.cqStep2Num}</span>
                      <h2 className="cq-step-title">{t.cqStep2Title} <em>{t.cqStep2TitleEm}</em></h2>
                      <p className="cq-step-desc">
                        {t.cqStep2Note}
                      </p>
                    </div>

                    <div className="cq-summary-card">
                      <div className="cq-summary-head">
                        <i className="fa-solid fa-bag-shopping" />
                        <span>{t.cqDaftarItem}</span>
                        <span className="cq-summary-count">{cartItems.length} item</span>
                      </div>

                      <div className="cq-summary-items">
                        {cartItems?.map((item, idx) => (
                          <div key={item?.id ?? idx} className="cq-summary-row">
                            <div className="cq-summary-row-info">
                              <span className="cq-summary-name">{item?.name ?? 'Item'}</span>
                              {item?.short && (
                                <span className="cq-summary-short">{item.short}</span>
                              )}
                            </div>
                            <div className="cq-summary-row-right">
                              <span className="cq-summary-qty">×{item?.qty ?? 1}</span>
                              <span className="cq-summary-price">
                                Rp {((item?.price ?? 0) * (item?.qty ?? 1)).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="cq-summary-divider" />

                      <div className="cq-summary-total">
                        <span>{t.cqEstTotal}</span>
                        <span className="cq-summary-total-num">
                          Rp {cartTotal.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="cq-summary-notes">
                        <p>
                          <i className="fa-solid fa-circle-info" />
                          {t.cqHargaFinal}
                        </p>
                        <p>
                          <i className="fa-solid fa-coins" />
                          {t.cqDPSystem}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════ STEP 3: CREATIVE PREFERENCE ══════ */}
                {step === 3 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">{t.cqStep3Num}</span>
                      <h2 className="cq-step-title">{t.cqStep3Title} <em>{t.cqStep3TitleEm}</em></h2>
                      <p className="cq-step-desc">
                        {t.cqStep3Sub}
                      </p>
                    </div>

                    <div className="cq-slider-section">
                      {/* Slider */}
                      <div className="cq-slider-main">
                        <div className="cq-slider-pole cq-pole-left">
                          <i className="fa-solid fa-feather" />
                          <span>{t.cqMinimalis}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          className="cq-slider"
                          value={creativeSlider}
                          onChange={(e) => setCreativeSlider(Number(e.target.value))}
                        />
                        <div className="cq-slider-pole cq-pole-right">
                          <i className="fa-solid fa-explosion" />
                          <span>{t.cqKompleks}</span>
                        </div>
                      </div>

                      {/* Label berjalan */}
                      <div className="cq-slider-result">
                        <div
                          className="cq-slider-thumb-label"
                          style={{ left: `calc(${creativeSlider}% - ${creativeSlider * 0.6}px)` }}
                        >
                          {creativeSlider}
                        </div>
                      </div>

                      {/* Visual bands */}
                      <div className="cq-slider-bands">
                        {[
                          { range: [0,  29],  emoji: '🪶', label: 'Minimalis & Bersih',      desc: 'Ruang lega, tipografi bersih, elemen sederhana.' },
                          { range: [30, 59],  emoji: '⚡', label: 'Seimbang & Fleksibel',     desc: 'Perpaduan clean dan detail yang pas.' },
                          { range: [60, 84],  emoji: '🎨', label: 'Dinamis & Berkarakter',    desc: 'Bold, bernyawa, banyak detail visual menarik.' },
                          { range: [85, 100], emoji: '💥', label: 'Kompleks & Ekspresif',     desc: 'Penuh ekspresi, tekstur, dan elemen berlapis.' },
                        ].map(({ range, emoji, label, desc }) => {
                          const active = creativeSlider >= range[0] && creativeSlider <= range[1];
                          return (
                            <div key={label} className={`cq-band ${active ? 'cq-band-active' : ''}`}>
                              <span className="cq-band-emoji">{emoji}</span>
                              <div>
                                <span className="cq-band-label">{label}</span>
                                <span className="cq-band-desc">{desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="cq-slider-chosen">
                        <i className="fa-solid fa-wand-magic-sparkles" />
                        <span>{t.cqPilihanKamu} <strong>{sliderLabel(creativeSlider)}</strong> ({creativeSlider}/100)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════ STEP 4: DETAIL PROYEK ══════ */}
                {step === 4 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">{t.cqStep4Num}</span>
                      <h2 className="cq-step-title">{t.cqStep4Title} <em>{t.cqStep4TitleEm}</em></h2>
                      <p className="cq-step-desc">
                        Berikan nama dan cerita singkat proyekmu. Semakin jelas, semakin tepat solusi yang aku siapkan.
                      </p>
                    </div>

                    <div className="cq-fields">
                      <div className="cq-field-group">
                        <label className="cq-field-label">
                          {t.cqNamaProyek} <span className="cq-required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`cq-field-input ${errors.projectName ? 'cq-field-err' : ''}`}
                          placeholder="Contoh: Website Portofolio Budi, Film Pendek OSIS 2025..."
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          maxLength={80}
                        />
                        {errors.projectName && (
                          <span className="cq-err-msg">{errors.projectName}</span>
                        )}
                        <span className="cq-field-count">{projectName.length}/80</span>
                      </div>

                      <div className="cq-field-group">
                        <label className="cq-field-label">
                          {t.cqDescProyek}
                          <span className="cq-field-optional"> {t.cqOptional}</span>
                        </label>
                        <textarea
                          className="cq-field-input cq-field-textarea"
                          placeholder="Ceritakan konteks proyek, target audiens, referensi yang kamu suka, hal penting yang perlu diperhatikan, atau apapun yang menurutmu relevan..."
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          maxLength={1000}
                        />
                        <span className="cq-field-count">{projectDesc.length}/1000</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════ STEP 5: KONFIRMASI AKHIR ══════ */}
                {step === 5 && (
                  <div className="cq-step-content">
                    <div className="cq-step-head">
                      <span className="cq-step-badge">{t.cqStep5Num}</span>
                      <h2 className="cq-step-title">{t.cqStep5Title} <em>{t.cqStep5TitleEm}</em></h2>
                      <p className="cq-step-desc">
                        Periksa ringkasan brief kamu sebelum dikirim. Jika ada yang kurang tepat, kembali dan edit dulu.
                      </p>
                    </div>

                    {/* Review card */}
                    <div className="cq-review-card">

                      <div className="cq-review-section">
                        <span className="cq-review-lbl">
                          <i className="fa-solid fa-user" /> {t.cqTipeKlien}
                        </span>
                        <span className="cq-review-val">
                          {CLIENT_TYPES.find(c => c.value === clientType)?.label ?? '—'}
                        </span>
                      </div>

                      <div className="cq-review-divider" />

                      <div className="cq-review-section">
                        <span className="cq-review-lbl">
                          <i className="fa-solid fa-bag-shopping" /> {t.cqPesanan}
                        </span>
                        <div className="cq-review-cart">
                          {cartItems?.map((item, idx) => (
                            <div key={item?.id ?? idx} className="cq-review-item">
                              <span>{item?.name ?? 'Item'} ×{item?.qty ?? 1}</span>
                              <span>Rp {((item?.price ?? 0) * (item?.qty ?? 1)).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                          <div className="cq-review-item cq-review-total-row">
                            <span>{t.cqTotal}</span>
                            <strong>Rp {cartTotal.toLocaleString('id-ID')}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="cq-review-divider" />

                      <div className="cq-review-section">
                        <span className="cq-review-lbl">
                          <i className="fa-solid fa-palette" /> {t.cqStepPreferensi}
                        </span>
                        <span className="cq-review-val">
                          {sliderLabel(creativeSlider)} ({creativeSlider}/100)
                        </span>
                      </div>

                      <div className="cq-review-divider" />

                      <div className="cq-review-section">
                        <span className="cq-review-lbl">
                          <i className="fa-solid fa-folder" /> {t.cqNamaProyek}
                        </span>
                        <span className="cq-review-val">{projectName || '—'}</span>
                      </div>

                      {projectDesc && (
                        <>
                          <div className="cq-review-divider" />
                          <div className="cq-review-section cq-review-section-col">
                            <span className="cq-review-lbl">
                              <i className="fa-solid fa-align-left" /> Deskripsi
                            </span>
                            <p className="cq-review-desc-val">{projectDesc}</p>
                          </div>
                        </>
                      )}

                    </div>

                    {/* Submit note */}
                    <div className="cq-submit-note">
                      <i className="fa-solid fa-paper-plane" />
                      <p>
                        Brief kamu akan tersimpan ke database kami, lalu kamu langsung diarahkan ke halaman checkout dengan QRIS dan tombol konfirmasi WhatsApp.
                        {t.cqDPNote}
                      </p>
                    </div>

                    {submitError && (
                      <div className="cq-global-err">
                        <i className="fa-solid fa-triangle-exclamation" />
                        {submitError}
                      </div>
                    )}

                  </div>
                )}

              </div>{/* end cq-step-body */}

              {/* ─── Navigation ─── */}
              <div className="cq-nav">
                {step > 1 && (
                  <button type="button" className="cq-btn-back" onClick={handleBack}>
                    <i className="fa-solid fa-arrow-left" />
                    Kembali
                  </button>
                )}

                {step < TOTAL_STEPS && (
                  <button type="button" className="cq-btn-next" onClick={handleNext}>
                    Lanjut
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                )}

                {step === TOTAL_STEPS && (
                  <button
                    type="button"
                    className="cq-btn-submit"
                    onClick={handleSubmitData}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="cq-spinner" />
                    ) : (
                      <i className="fa-solid fa-paper-plane" />
                    )}
                    <span>
                      {submitting ? t.cqSendingBrief : t.cqSendBtn}
                    </span>
                  </button>
                )}
              </div>

            </div>{/* end cq-card */}
          </div>{/* end cq-right */}

        </div>{/* end cq-body */}
      </div>{/* end cq-page */}
    </>
  );
}
