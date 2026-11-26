// src/components/quiz/osce/CaseSession.jsx
import { useState } from 'react';
import { Reveal } from '../../BentoKit';
import RoleCard from './RoleCard';
import PhaseStepper from './PhaseStepper';
import PhaseGuide from './PhaseGuide';
import ScriptPanel from './ScriptPanel';
import Timer from './Timer';
import MarkdownLite from './MarkdownLite';

const ROLE_TITLE = { perawat: 'Perawat', lawan: 'Klien/lawan bicara' };

export default function CaseSession({
  mode,
  caseMeta,
  caseData,
  myRole,
  lawanLabel,
  canStart,
  startHint,
  onStart,
  startedAt,
  phaseIdx,
  onSetPhase,
  onLogHelp,
  onFinish,
}) {
  const [scriptOpen, setScriptOpen] = useState(false);
  const [helpedPhases, setHelpedPhases] = useState(() => new Set());
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [completed, setCompleted] = useState(() => new Set());

  // ── Keadaan 1: sebelum mulai — studi kasus TIDAK ADA di DOM ──
  if (!caseData) {
    return (
      <Reveal className="bn-card osce-card osce-session-before">
        <h1 className="osce-h1">{caseMeta.title}</h1>
        <div className="osce-case-chips">
          {caseMeta.tipeLabel && <span className="qz-chip"><i className="fa-solid fa-tag" aria-hidden="true" /> {caseMeta.tipeLabel}</span>}
          {caseMeta.level && <span className="qz-chip">{caseMeta.level}</span>}
          {caseMeta.durationMin && <span className="qz-chip"><i className="fa-solid fa-clock" aria-hidden="true" /> {caseMeta.durationMin} mnt</span>}
          <span className="qz-chip"><i className="fa-solid fa-user" aria-hidden="true" /> Peranmu: {ROLE_TITLE[myRole] || myRole}</span>
        </div>
        <button type="button" className="qz-btn qz-btn-primary osce-start-btn" disabled={!canStart} onClick={onStart}>
          <i className="fa-solid fa-play" aria-hidden="true" /> Mulai
        </button>
        {!canStart && startHint && <p className="osce-mode-desc">{startHint}</p>}
      </Reveal>
    );
  }

  // ── Keadaan 2: studi kasus terbuka ──
  const phase = caseData.phases[phaseIdx] || caseData.phases[0];
  const alreadyCounted = helpedPhases.has(phase.key);

  const goPhase = (idx) => {
    const clamped = Math.max(0, Math.min(caseData.phases.length - 1, idx));
    setCompleted((prev) => new Set(prev).add(phaseIdx));
    onSetPhase(clamped);
  };

  return (
    <div className="osce-session">
      <div className="osce-session-statusbar">
        <Timer startedAt={startedAt} />
        <span className="osce-session-phase-label">Fase {phaseIdx + 1} dari {caseData.phases.length}</span>
        {!confirmFinish ? (
          <button type="button" className="qz-btn qz-btn-sm" onClick={() => setConfirmFinish(true)}>Selesai</button>
        ) : (
          <span className="osce-confirm-finish">
            Akhiri simulasi sekarang?
            <button type="button" className="qz-btn qz-btn-sm" onClick={() => setConfirmFinish(false)}>Batal</button>
            <button type="button" className="qz-btn qz-btn-primary qz-btn-sm" onClick={() => onFinish(completed.size + 1)}>Ya, akhiri</button>
          </span>
        )}
      </div>

      <Reveal className="nm-inset osce-setting-card">
        <b><i className="fa-solid fa-map-location-dot" aria-hidden="true" /> Setting</b>
        <MarkdownLite text={caseData.setting} />
      </Reveal>

      <div className="osce-role-cards">
        <RoleCard
          title={myRole === 'perawat' ? caseData.roles.perawat.title : caseData.roles.lawan.title}
          body={myRole === 'perawat' ? caseData.roles.perawat.body : caseData.roles.lawan.body}
        />
        {mode === 'multi' && (
          <RoleCard
            title={myRole === 'perawat' ? caseData.roles.lawan.title : caseData.roles.perawat.title}
            locked
          />
        )}
        {mode === 'solo' && <RoleCard title={caseData.roles.lawan.title} locked />}
      </div>

      <PhaseStepper phases={caseData.phases} activeIdx={phaseIdx} onPick={goPhase} completedSet={completed} />
      <PhaseGuide phase={phase} phaseNumber={phaseIdx + 1} phaseTotal={caseData.phases.length} />

      <div className="osce-phase-nav">
        <button type="button" className="qz-btn" disabled={phaseIdx === 0} onClick={() => goPhase(phaseIdx - 1)}>
          <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Fase sebelumnya
        </button>
        <button type="button" className="qz-btn" disabled={phaseIdx === caseData.phases.length - 1} onClick={() => goPhase(phaseIdx + 1)}>
          Fase berikutnya <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </div>

      <button type="button" className="qz-btn qz-btn-primary osce-help-fab" onClick={() => setScriptOpen(true)}>
        <i className="fa-solid fa-life-ring" aria-hidden="true" /> Bantuan skrip
      </button>

      {scriptOpen && (
        <ScriptPanel
          key={phase.key}
          onClose={() => setScriptOpen(false)}
          phase={phase}
          mode={mode}
          myRole={myRole}
          lawanLabel={lawanLabel}
          alreadyCounted={alreadyCounted}
          onFirstReveal={() => {
            setHelpedPhases((prev) => new Set(prev).add(phase.key));
            onLogHelp?.();
          }}
        />
      )}
    </div>
  );
}
