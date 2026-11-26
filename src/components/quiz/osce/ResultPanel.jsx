// src/components/quiz/osce/ResultPanel.jsx
import { useMemo, useState } from 'react';
import { Reveal } from '../../BentoKit';
import MarkdownLite from './MarkdownLite';
import { formatTimer } from './timerFormat';

function useChecklistState(items) {
  const [checked, setChecked] = useState(() => new Set());
  const toggle = (i) => setChecked((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  const percent = items.length ? Math.round((checked.size / items.length) * 100) : 0;
  return { checked, toggle, percent };
}

export default function ResultPanel({
  caseData,
  mode,
  role,
  durationSec,
  helpCount,
  phasesCompleted,
  saveState,
  onSaveRetry,
  onRetrySimulation,
  onPickAnother,
  isHost,
  onSwapAndReplay,
  partnerLabel,
  onSendFeedback,
  feedbackSent,
  feedbackReceived,
}) {
  const self = useChecklistState(caseData.checklist || []);
  const peer = useChecklistState(caseData.checklist || []);
  const [note, setNote] = useState('');

  const suggestReplay = useMemo(
    () => helpCount >= 3 || self.percent < 60,
    [helpCount, self.percent],
  );

  return (
    <div className="osce-result">
      <Reveal className="bn-card osce-card osce-result-summary">
        <span className="qz-chip osce-result-role-chip">
          <i className="fa-solid fa-user" aria-hidden="true" /> Peranmu: {role === 'perawat' ? 'Perawat' : 'Klien/lawan'}
        </span>
        <div className="bn-grid">
          <div className="bn-span-2 osce-result-stat">
            <span className="osce-result-stat-label"><i className="fa-solid fa-stopwatch" aria-hidden="true" /> Waktu total</span>
            <span className="osce-result-stat-value">{formatTimer(durationSec)}</span>
          </div>
          <div className="bn-span-2 osce-result-stat">
            <span className="osce-result-stat-label"><i className="fa-solid fa-life-ring" aria-hidden="true" /> Bantuan dipakai</span>
            <span className="osce-result-stat-value">{helpCount} kali</span>
          </div>
          <div className="bn-span-2 osce-result-stat">
            <span className="osce-result-stat-label"><i className="fa-solid fa-route" aria-hidden="true" /> Fase dilalui</span>
            <span className="osce-result-stat-value">{phasesCompleted} / {caseData.phases.length}</span>
          </div>
        </div>
      </Reveal>

      {caseData.checklist?.length > 0 && (
        <Reveal className="bn-card osce-card" delay={0.05}>
          <h2 className="osce-h1">Checklist penilaian mandiri</h2>
          <ul className="osce-checklist" role="list">
            {caseData.checklist.map((item, i) => (
              <li key={i}>
                <label className="osce-checkbox">
                  <input type="checkbox" checked={self.checked.has(i)} onChange={() => self.toggle(i)} />
                  <span><i className="fa-solid fa-check" aria-hidden="true" /> {item}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="osce-result-score">Skor mandiri: <b>{self.percent}%</b></p>
          {suggestReplay && (
            <p className="osce-mode-desc">
              <i className="fa-solid fa-circle-info" aria-hidden="true" /> Bantuan dipakai cukup sering atau skor masih di bawah 60% — coba ulangi kasus ini lagi.
            </p>
          )}
        </Reveal>
      )}

      <Reveal className="bn-card osce-card" delay={0.08}>
        <h2 className="osce-h1">Kartu {caseData.roles.lawan.title}</h2>
        <MarkdownLite text={caseData.roles.lawan.body} />
      </Reveal>

      {caseData.answerKey && (
        <Reveal className="bn-card osce-card" delay={0.1}>
          <h2 className="osce-h1">Kunci jawaban</h2>
          <MarkdownLite text={caseData.answerKey} />
        </Reveal>
      )}

      {caseData.commonMistakes?.length > 0 && (
        <Reveal className="bn-card osce-card" delay={0.12}>
          <h2 className="osce-h1">Kesalahan umum</h2>
          <ul className="osce-md-list">
            {caseData.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </Reveal>
      )}

      {mode === 'multi' && (
        <Reveal className="bn-card osce-card" delay={0.14}>
          <h2 className="osce-h1">Nilai {partnerLabel || 'rekan main'}</h2>
          {feedbackSent ? (
            <p className="osce-mode-desc"><i className="fa-solid fa-circle-check" aria-hidden="true" /> Penilaian terkirim.</p>
          ) : (
            <>
              <ul className="osce-checklist" role="list">
                {(caseData.checklist || []).map((item, i) => (
                  <li key={i}>
                    <label className="osce-checkbox">
                      <input type="checkbox" checked={peer.checked.has(i)} onChange={() => peer.toggle(i)} />
                      <span>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <textarea
                className="osce-feedback-note nm-inset"
                placeholder="Catatan singkat untuk rekan main (opsional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                type="button"
                className="qz-btn qz-btn-primary"
                onClick={() => onSendFeedback({ checklist: [...peer.checked], note })}
              >
                Kirim penilaian
              </button>
            </>
          )}
          {feedbackReceived && (
            <div className="osce-feedback-received">
              <b>Umpan balik dari rekan main:</b>
              <p>{feedbackReceived.note || 'Tidak ada catatan tambahan.'}</p>
            </div>
          )}
        </Reveal>
      )}

      <div className="osce-result-save">
        {saveState === 'saving' && <span className="osce-mode-desc"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Menyimpan hasil…</span>}
        {saveState === 'saved' && <span className="osce-mode-desc"><i className="fa-solid fa-circle-check" aria-hidden="true" /> Hasil tersimpan.</span>}
        {saveState === 'error' && (
          <span className="osce-mode-desc">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> Gagal menyimpan hasil.
            <button type="button" className="qz-btn qz-btn-sm" onClick={onSaveRetry}>Coba simpan lagi</button>
          </span>
        )}
      </div>

      <div className="osce-result-actions">
        {mode === 'solo' && (
          <button type="button" className="qz-btn" onClick={onRetrySimulation}><i className="fa-solid fa-rotate-left" aria-hidden="true" /> Ulangi</button>
        )}
        <button type="button" className="qz-btn" onClick={onPickAnother}><i className="fa-solid fa-list" aria-hidden="true" /> Pilih kasus lain</button>
        {mode === 'multi' && isHost && (
          <button type="button" className="qz-btn qz-btn-primary" onClick={onSwapAndReplay}>
            <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden="true" /> Tukar peran &amp; main lagi
          </button>
        )}
      </div>
    </div>
  );
}
