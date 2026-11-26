// src/components/quiz/osce/useOsceRoom.js
import { useCallback, useEffect, useRef, useState } from 'react';
import * as osceApi from '@/lib/osceApi';

const POLL_MS = 4000;

/**
 * @param {string} code - kode room 6 karakter
 * @param {string} uid - auth.users.id pemain saat ini
 */
export default function useOsceRoom(code, uid) {
  const [room, setRoom] = useState(null);
  const [channelStatus, setChannelStatus] = useState('connecting'); // connecting | live | offline
  const [error, setError] = useState('');
  const refetchTimer = useRef(null);
  const pollId = useRef(null);
  const alive = useRef(true);

  const refetch = useCallback(async () => {
    if (!code) return;
    try {
      const row = await osceApi.getRoom(code);
      if (alive.current) setRoom(row);
    } catch (e) {
      if (alive.current) setError(e?.message || 'gagal memuat room');
    }
  }, [code]);

  const refetchSoon = useCallback(() => {
    clearTimeout(refetchTimer.current);
    refetchTimer.current = setTimeout(refetch, 200);
  }, [refetch]);

  useEffect(() => {
    alive.current = true;
    if (!code) return undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- muat data room awal dari Supabase (sistem eksternal) saat kode room berganti
    refetch();

    const unsubscribe = osceApi.subscribeRoom(
      code,
      () => refetchSoon(),
      (status) => {
        if (!alive.current) return;
        setChannelStatus(status === 'SUBSCRIBED' ? 'live' : status === 'CLOSED' || status === 'CHANNEL_ERROR' ? 'offline' : 'connecting');
      },
    );

    const onVisible = () => { if (document.visibilityState === 'visible') refetch(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refetch);

    return () => {
      alive.current = false;
      clearTimeout(refetchTimer.current);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refetch);
      unsubscribe();
    };
  }, [code, refetch, refetchSoon]);

  // Polling cadangan: hanya aktif kalau channel realtime tidak sehat.
  useEffect(() => {
    clearInterval(pollId.current);
    if (channelStatus !== 'live' && code) {
      pollId.current = setInterval(refetch, POLL_MS);
    }
    return () => clearInterval(pollId.current);
  }, [channelStatus, code, refetch]);

  const isHost = !!room && room.host_id === uid;
  const isGuest = !!room && room.guest_id === uid;
  const myRole = room ? (isHost ? room.host_role : room.host_role === 'perawat' ? 'lawan' : 'perawat') : null;

  const wrap = useCallback((fn) => async (...args) => {
    try {
      const row = await fn(...args);
      if (alive.current) setRoom(row);
      return row;
    } catch (e) {
      if (alive.current) setError(e?.message || 'gagal');
      throw e;
    }
  }, []);

  const actions = {
    join: wrap((name, photo) => osceApi.joinRoom({ code, name, photo })),
    leave: wrap(() => osceApi.leaveRoom(code)),
    start: wrap(() => osceApi.startRoom(code)),
    setPhase: wrap((idx) => osceApi.setPhase(code, idx)),
    logHelp: wrap(() => osceApi.logHelp(code)),
    finish: wrap(() => osceApi.finishRoom(code)),
    swapRoles: wrap(() => osceApi.swapRoles(code)),
    clearError: () => setError(''),
  };

  return {
    room,
    myRole,
    isHost,
    isGuest,
    status: channelStatus,
    error,
    actions,
  };
}
