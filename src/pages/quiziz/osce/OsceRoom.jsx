// src/pages/quiziz/osce/OsceRoom.jsx — route: /quizizuas/osce/room/:code
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../../../components/quiz/QuizShell';
import ErrorState from '../../../components/quiz/ErrorState';
import useQuizAuth from '../../../components/quiz/useQuizAuth';
import useOsceRoom from '../../../components/quiz/osce/useOsceRoom';
import { describeOsceError } from '../../../components/quiz/osce/osceErrors';
import Lobby from '../../../components/quiz/osce/Lobby';
import CaseSession from '../../../components/quiz/osce/CaseSession';
import ResultPanel from '../../../components/quiz/osce/ResultPanel';
import { loadCase } from '../../../data/quiziz/osce';
import { osceHub } from '../../../data/quiziz/routes';
import * as osceApi from '../../../lib/osceApi';
import '../../../styles/quizOsce.css';

export default function OsceRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const user = useQuizAuth();
  const { room, myRole, isHost, status: liveStatus, error, actions } = useOsceRoom(code, user?.uid);

  const [caseData, setCaseData] = useState(undefined);
  const [completedPhases, setCompletedPhases] = useState(0);
  const [finishedAt, setFinishedAt] = useState(null);
  const [saveState, setSaveState] = useState('idle');
  const savedRef = useRef(false);
  const joinAttemptedRef = useRef(false);
  const [feedback, setFeedback] = useState([]);
  const [partnerLeftAck, setPartnerLeftAck] = useState(false);
  const [guestLeftMidSession, setGuestLeftMidSession] = useState(false);
  const prevGuest = useRef(undefined);

  useEffect(() => { document.title = 'Sesi Multiplayer OSCE · Quiziz UAS'; }, []);

  const isParticipant = !!room && !!user?.uid && (room.host_id === user.uid || room.guest_id === user.uid);

  // Auto-join kalau belum anggota dan slot masih kosong. joinAttemptedRef hanya
  // untuk mencegah dobel panggilan RPC, tidak perlu memicu render.
  useEffect(() => {
    if (!room || !user?.uid || isParticipant || joinAttemptedRef.current) return;
    if (room.guest_id || room.status === 'closed' || room.status === 'finished') return;
    joinAttemptedRef.current = true;
    actions.join(user.displayName || '', user.photoURL || null).catch(() => { joinAttemptedRef.current = false; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, user, isParticipant]);

  useEffect(() => {
    if (!room?.case_id) return;
    loadCase(room.case_id).then(setCaseData).catch(() => setCaseData(null));
  }, [room?.case_id]);

  useEffect(() => {
    if (!room) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkron satu kali saat room beralih status ke finished (dipakai sebagai timestamp selesai)
    if (room.status === 'finished') setFinishedAt((prev) => prev ?? Date.now());
    else setFinishedAt(null);
  }, [room]);

  // Deteksi lawan keluar saat sesi berjalan
  useEffect(() => {
    if (!room) return;
    const left = !!prevGuest.current && !room.guest_id && room.status !== 'finished' && room.status !== 'closed';
    prevGuest.current = room.guest_id;
    setGuestLeftMidSession(left);
    if (left) setPartnerLeftAck(false);
  }, [room]);

  useEffect(() => {
    if (room?.status === 'finished' && room.code) {
      osceApi.getFeedback(room.code).then(setFeedback).catch(() => {});
    }
  }, [room?.status, room?.code]);

  useEffect(() => {
    if (room?.status !== 'finished' || !user?.uid || !caseData || savedRef.current || !finishedAt) return;
    savedRef.current = true;
    setSaveState('saving');
    const durationSec = (finishedAt - new Date(room.started_at).getTime()) / 1000;
    osceApi.saveAttempt({
      user_id: user.uid, case_id: caseData.id, tipe: caseData.tipe.id, mode: 'multi', role: myRole,
      duration_sec: Math.round(Math.max(0, durationSec)), help_count: room.help_count || 0,
      phases_completed: Math.min(completedPhases || caseData.phases.length, caseData.phases.length),
      room_code: room.code,
    }).then(() => setSaveState('saved')).catch(() => setSaveState('error'));
  }, [room?.status, user?.uid, caseData, finishedAt, myRole, completedPhases, room]);

  const retrySave = () => { savedRef.current = false; setSaveState('idle'); };

  const partnerUid = isHost ? room?.guest_id : room?.host_id;
  const myFeedbackToPartner = feedback.find((f) => f.from_user === user?.uid);
  const feedbackForMe = feedback.find((f) => f.to_user === user?.uid && f.from_user === partnerUid);

  const sendFeedback = async ({ checklist, note }) => {
    if (!partnerUid) return;
    await osceApi.sendFeedback({ roomCode: room.code, toUser: partnerUid, checklist, note });
    setFeedback((prev) => [...prev.filter((f) => f.from_user !== user.uid), { from_user: user.uid, to_user: partnerUid, checklist, note }]);
  };

  if (error) {
    return <QuizShell variant="focus" maxWidth={860}><ErrorState title="Terjadi masalah" text={describeOsceError({ message: error })} onRetry={actions.clearError} /></QuizShell>;
  }
  if (room === null) {
    return <QuizShell variant="focus" maxWidth={860}><ErrorState title="Room tidak ditemukan" text="Kode room salah, atau room sudah dihapus." /></QuizShell>;
  }
  if (!room) {
    return <QuizShell variant="focus" maxWidth={860}><div className="qz-state" role="status"><p className="qz-state-text">Memuat room…</p></div></QuizShell>;
  }
  if (room.status === 'closed') {
    return <QuizShell variant="focus" maxWidth={860}><ErrorState title="Room sudah ditutup" text="Room ini sudah tidak aktif. Buat atau gabung room lain dari hub OSCE." /></QuizShell>;
  }

  const showPartnerLeftBanner = guestLeftMidSession && isHost && !partnerLeftAck;

  return (
    <QuizShell maxWidth={860} variant="focus">
      <div className="osce-conn-banner" role="status">
        <i className={`fa-solid ${liveStatus === 'live' ? 'fa-wifi' : 'fa-triangle-exclamation'}`} aria-hidden="true" />
        {liveStatus === 'live' ? 'Tersambung' : liveStatus === 'offline' ? 'Koneksi terputus, mencoba lagi…' : 'Menyambungkan…'}
      </div>

      {showPartnerLeftBanner && (
        <div className="bn-card osce-card osce-partner-left">
          <p>Lawan mainmu keluar dari room.</p>
          <div className="osce-role-pick-actions">
            <button type="button" className="qz-btn qz-btn-primary" onClick={() => setPartnerLeftAck(true)}>Lanjut solo</button>
            <button type="button" className="qz-btn" onClick={() => navigate(osceHub())}>Kembali</button>
          </div>
        </div>
      )}

      {!showPartnerLeftBanner && (room.status === 'waiting' || room.status === 'ready') && (
        <Lobby
          room={room}
          isHost={isHost}
          caseTitle={caseData?.title}
          onStart={() => actions.start()}
          onSwapRoles={() => actions.swapRoles()}
          onLeave={() => actions.leave().then(() => navigate(osceHub()))}
        />
      )}

      {!showPartnerLeftBanner && room.status === 'running' && caseData && (
        <CaseSession
          mode="multi"
          caseMeta={{ title: caseData.title, tipeLabel: caseData.tipe.label, level: caseData.level, durationMin: caseData.durationMin }}
          caseData={caseData}
          myRole={myRole}
          lawanLabel={caseData.roles.lawan.title}
          canStart
          onStart={() => {}}
          startedAt={room.started_at}
          phaseIdx={room.phase_idx}
          onSetPhase={(idx) => { setCompletedPhases((c) => Math.max(c, idx + 1)); actions.setPhase(idx); }}
          onLogHelp={() => actions.logHelp()}
          onFinish={(phasesDone) => { setCompletedPhases((c) => Math.max(c, phasesDone)); actions.finish(); }}
        />
      )}

      {room.status === 'finished' && caseData && (
        <ResultPanel
          caseData={caseData}
          mode="multi"
          role={myRole}
          durationSec={finishedAt ? (finishedAt - new Date(room.started_at).getTime()) / 1000 : 0}
          helpCount={room.help_count || 0}
          phasesCompleted={Math.min(completedPhases || caseData.phases.length, caseData.phases.length)}
          saveState={saveState}
          onSaveRetry={retrySave}
          onPickAnother={() => navigate(osceHub())}
          isHost={isHost}
          onSwapAndReplay={() => actions.swapRoles()}
          partnerLabel={isHost ? room.guest_name : room.host_name}
          onSendFeedback={sendFeedback}
          feedbackSent={!!myFeedbackToPartner}
          feedbackReceived={feedbackForMe}
        />
      )}
    </QuizShell>
  );
}
