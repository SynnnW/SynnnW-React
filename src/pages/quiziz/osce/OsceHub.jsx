// src/pages/quiziz/osce/OsceHub.jsx — route: /quizizuas/osce
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QuizShell from '../../../components/quiz/QuizShell';
import ErrorState from '../../../components/quiz/ErrorState';
import useQuizAuth from '../../../components/quiz/useQuizAuth';
import RulesPanel from '../../../components/quiz/osce/RulesPanel';
import ModePicker from '../../../components/quiz/osce/ModePicker';
import TipePicker from '../../../components/quiz/osce/TipePicker';
import CasePicker from '../../../components/quiz/osce/CasePicker';
import { osceSoloPath, osceRoomPath } from '../../../data/quiziz/routes';
import { listTipe, loadCasesByTipe } from '../../../data/quiziz/osce';
import * as osceApi from '../../../lib/osceApi';
import { describeOsceError } from '../../../components/quiz/osce/osceErrors';
import '../../../styles/quizOsce.css';

const ACK_KEY = 'osce_rules_ack';

export default function OsceHub() {
  const navigate = useNavigate();
  const user = useQuizAuth();
  const [params, setParams] = useSearchParams();

  const [mode, setMode] = useState(null); // 'solo' | 'create' | 'join'
  const [tipeList, setTipeList] = useState(null);
  const [cases, setCases] = useState([]);
  const [attemptedIds, setAttemptedIds] = useState(new Set());
  const [tipeId, setTipeId] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [pickedCaseId, setPickedCaseId] = useState(null);
  const [busyErr, setBusyErr] = useState('');
  const [creating, setCreating] = useState(false);

  const acked = typeof window !== 'undefined' && sessionStorage.getItem(ACK_KEY) === '1';
  const step = params.get('step') || (acked ? 'mode' : 'rules');

  const goStep = useCallback((next) => {
    const p = new URLSearchParams(params);
    p.set('step', next);
    setParams(p);
  }, [params, setParams]);

  useEffect(() => { document.title = 'Simulasi OSCE Komunikasi · Quiziz UAS'; }, []);

  useEffect(() => {
    if (step !== 'tipe' || tipeList) return;
    listTipe().then(setTipeList).catch(() => setTipeList([]));
  }, [step, tipeList]);

  useEffect(() => {
    if (!tipeId) return;
    loadCasesByTipe(tipeId).then(setCases).catch(() => setCases([]));
    if (user?.uid) {
      osceApi.listMyAttempts().then((rows) => setAttemptedIds(new Set(rows.map((r) => r.case_id)))).catch(() => {});
    }
  }, [tipeId, user?.uid]);

  const handleAckRules = () => {
    sessionStorage.setItem(ACK_KEY, '1');
    goStep('mode');
  };

  const pickTipe = (id) => { setTipeId(id); goStep('kasus'); };

  const pickCase = (caseId) => {
    setPickedCaseId(caseId);
    if (mode === 'solo') { navigate(osceSoloPath(caseId)); return; }
    goStep('role');
  };

  const createRoomAndGo = async (role) => {
    if (!user?.uid) return;
    setCreating(true);
    setBusyErr('');
    try {
      const row = await osceApi.createRoom({
        caseId: pickedCaseId, tipe: tipeId, role, name: user.displayName || '', photo: user.photoURL || null,
      });
      navigate(osceRoomPath(row.code));
    } catch (e) {
      setBusyErr(describeOsceError(e));
    } finally {
      setCreating(false);
    }
  };

  const submitJoin = (e) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length === 6) navigate(osceRoomPath(code));
  };

  const tipeLabel = useMemo(() => tipeList?.find((t) => t.id === tipeId)?.label, [tipeList, tipeId]);

  return (
    <QuizShell maxWidth={step === 'rules' ? 860 : 1180} variant="focus">
      <div className="osce-hub">
        <div className="osce-hub-head">
          <h1 className="bn-title" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>Simulasi OSCE Komunikasi</h1>
          {step !== 'rules' && (
            <button type="button" className="qz-btn qz-btn-sm" onClick={() => goStep('rules')}>
              <i className="fa-solid fa-circle-question" aria-hidden="true" /> Lihat aturan lagi
            </button>
          )}
        </div>

        {step === 'rules' && <RulesPanel onContinue={handleAckRules} />}

        {step === 'mode' && (
          <>
            <ModePicker
              onPickSolo={() => { setMode('solo'); goStep('tipe'); }}
              onPickCreateRoom={() => { setMode('create'); goStep('tipe'); }}
              onPickJoinRoom={() => setMode('join')}
            />
            {mode === 'join' && (
              <form className="osce-join-form nm-inset" onSubmit={submitJoin}>
                <label htmlFor="osce-join-code">Masukkan kode room</label>
                <input
                  id="osce-join-code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g, '').slice(0, 6))}
                  placeholder="CONTOH: 7K2MXP"
                  maxLength={6}
                  autoComplete="off"
                />
                <button type="submit" className="qz-btn qz-btn-primary" disabled={joinCode.length !== 6}>Gabung</button>
              </form>
            )}
          </>
        )}

        {step === 'tipe' && <TipePicker tipeList={tipeList} onPick={pickTipe} />}

        {step === 'kasus' && <CasePicker cases={cases} attemptedIds={attemptedIds} onPick={pickCase} />}

        {step === 'role' && (
          <div className="osce-card bn-card">
            <h2 className="osce-h1">Pilih peranmu sebagai host</h2>
            <p className="osce-mode-desc">Tipe: {tipeLabel}. Peran tamu akan otomatis jadi kebalikannya.</p>
            {busyErr && <ErrorState title="Gagal membuat room" text={busyErr} onRetry={() => setBusyErr('')} />}
            <div className="osce-role-pick-actions">
              <button type="button" className="qz-btn qz-btn-primary" disabled={creating} onClick={() => createRoomAndGo('perawat')}>
                <i className="fa-solid fa-user-nurse" aria-hidden="true" /> Jadi Perawat
              </button>
              <button type="button" className="qz-btn qz-btn-primary" disabled={creating} onClick={() => createRoomAndGo('lawan')}>
                <i className="fa-solid fa-user" aria-hidden="true" /> Jadi Klien/Lawan
              </button>
            </div>
          </div>
        )}
      </div>
    </QuizShell>
  );
}
