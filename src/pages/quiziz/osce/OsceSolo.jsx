// src/pages/quiziz/osce/OsceSolo.jsx — route: /quizizuas/osce/solo/:caseId
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../../../components/quiz/QuizShell';
import ErrorState from '../../../components/quiz/ErrorState';
import useQuizAuth from '../../../components/quiz/useQuizAuth';
import CaseSession from '../../../components/quiz/osce/CaseSession';
import ResultPanel from '../../../components/quiz/osce/ResultPanel';
import { loadCase } from '../../../data/quiziz/osce';
import { osceHub } from '../../../data/quiziz/routes';
import * as osceApi from '../../../lib/osceApi';
import '../../../styles/quizOsce.css';

const SESSION_MAX_AGE_MS = 4 * 60 * 60 * 1000; // 4 jam
const sKey = (caseId) => `osce_solo_${caseId}`;

function loadSession(caseId) {
  try {
    const raw = sessionStorage.getItem(sKey(caseId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.startedAt > SESSION_MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function OsceSolo() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const user = useQuizAuth();

  const [caseData, setCaseData] = useState(undefined); // undefined = loading, null = tidak ditemukan
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [finished, setFinished] = useState(null); // { durationSec, phasesCompleted }
  const [saveState, setSaveState] = useState('idle');

  useEffect(() => {
    document.title = 'Sesi Solo OSCE · Quiziz UAS';
    loadCase(caseId).then((c) => setCaseData(c || null));
  }, [caseId]);

  useEffect(() => {
    const prev = loadSession(caseId);
    if (!prev) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkron satu kali dari sessionStorage (sistem eksternal) saat caseId berganti
    setStarted(true);
    setStartedAt(prev.startedAt);
    setPhaseIdx(prev.phaseIdx || 0);
    setHelpCount(prev.helpCount || 0);
  }, [caseId]);

  useEffect(() => {
    if (!started) return;
    sessionStorage.setItem(sKey(caseId), JSON.stringify({ startedAt, phaseIdx, helpCount }));
  }, [started, startedAt, phaseIdx, helpCount, caseId]);

  const doStart = () => {
    const now = Date.now();
    setStarted(true);
    setStartedAt(now);
    setPhaseIdx(0);
    setHelpCount(0);
  };

  const doFinish = async (phasesCompleted) => {
    const durationSec = (Date.now() - startedAt) / 1000;
    sessionStorage.removeItem(sKey(caseId));
    setFinished({ durationSec, phasesCompleted: Math.min(phasesCompleted, caseData.phases.length) });
    if (!user?.uid) return;
    setSaveState('saving');
    try {
      await osceApi.saveAttempt({
        user_id: user.uid, case_id: caseData.id, tipe: caseData.tipe.id, mode: 'solo', role: 'perawat',
        duration_sec: Math.round(durationSec), help_count: helpCount, phases_completed: Math.min(phasesCompleted, caseData.phases.length),
      });
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  const retrySave = async () => {
    setSaveState('saving');
    try {
      await osceApi.saveAttempt({
        user_id: user.uid, case_id: caseData.id, tipe: caseData.tipe.id, mode: 'solo', role: 'perawat',
        duration_sec: Math.round(finished.durationSec), help_count: helpCount, phases_completed: finished.phasesCompleted,
      });
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  const retrySimulation = () => { setFinished(null); doStart(); };
  const pickAnother = () => navigate(osceHub());

  const caseMeta = useMemo(() => caseData ? {
    title: caseData.title, tipeLabel: caseData.tipe.label, level: caseData.level, durationMin: caseData.durationMin,
  } : null, [caseData]);

  if (caseData === undefined) {
    return <QuizShell variant="focus" maxWidth={860}><div className="qz-state" role="status"><p className="qz-state-text">Memuat kasus…</p></div></QuizShell>;
  }
  if (caseData === null) {
    return <QuizShell variant="focus" maxWidth={860}><ErrorState title="Kasus tidak ditemukan" text="Kasus ini mungkin sudah dihapus atau tautannya salah." /></QuizShell>;
  }

  return (
    <QuizShell maxWidth={860} variant="focus">
      {finished ? (
        <ResultPanel
          caseData={caseData}
          mode="solo"
          role="perawat"
          durationSec={finished.durationSec}
          helpCount={helpCount}
          phasesCompleted={finished.phasesCompleted}
          saveState={saveState}
          onSaveRetry={retrySave}
          onRetrySimulation={retrySimulation}
          onPickAnother={pickAnother}
        />
      ) : (
        <CaseSession
          mode="solo"
          caseMeta={caseMeta}
          caseData={started ? caseData : null}
          myRole="perawat"
          lawanLabel={caseData.roles.lawan.title}
          canStart
          onStart={doStart}
          startedAt={startedAt}
          phaseIdx={phaseIdx}
          onSetPhase={setPhaseIdx}
          onLogHelp={() => setHelpCount((c) => c + 1)}
          onFinish={doFinish}
        />
      )}
    </QuizShell>
  );
}
