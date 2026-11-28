// src/components/quiz/osce/useOsceRoom.js
import { useCallback, useEffect, useRef, useState } from 'react';
import * as osceApi from '@/lib/osceApi';

const POLL_MS = 4000;

/**
 * @param {string} code - kode room 6 karakter
 * @param {string} uid - auth.users.id pemain saat ini
 * @param {{name?: string, photo?: string}} [joinInfo] - kalau diisi, hook akan
 *   otomatis mencoba gabung lewat RPC saat baris room tidak terbaca langsung.
 *   Ini WAJIB untuk tamu: sebelum resmi jadi anggota, RLS `osce_rooms` memang
 *   menyembunyikan baris itu dari select langsung (lihat supabase/osce.sql),
 *   jadi satu-satunya cara tamu "menemukan" room adalah lewat RPC osce_join_room
 *   (security definer, bisa lihat row-nya) — bukan dengan membaca tabel dulu.
 */
export default function useOsceRoom(code, uid, joinInfo) {
  const [room, setRoom] = useState(undefined); // undefined = belum selesai dimuat, null = tidak akan dipakai lagi
  const [channelStatus, setChannelStatus] = useState('connecting'); // connecting | live | offline
  const [error, setError] = useState('');
  const refetchTimer = useRef(null);
  const pollId = useRef(null);
  const alive = useRef(true);
  const joinTried = useRef(false);

  const refetch = useCallback(async () => {
    if (!code) return;
    try {
      let row = await osceApi.getRoom(code);
      if (!row && joinInfo && !joinTried.current) {
        // Belum kebaca langsung (biasanya: tamu yang belum resmi gabung, diblokir RLS).
        // Coba gabung lewat RPC — itu yang benar-benar menentukan room ada/penuh/tertutup.
        joinTried.current = true;
        row = await osceApi.joinRoom({ code, name: joinInfo.name, photo: joinInfo.photo });
      }
      if (alive.current) { setRoom(row); setError(''); }
    } catch (e) {
      // cannot_join_own_room = sebenarnya ini host, tapi select tadi entah kenapa kosong duluan.
      // Coba sekali lagi baca langsung (biasanya race kondisi awal saja), tanpa mencoba join lagi.
      if (e?.message === 'cannot_join_own_room') {
        try {
          const row = await osceApi.getRoom(code);
          if (alive.current) { setRoom(row); setError(''); }
          return;
        } catch { /* lanjut ke penanganan error di bawah */ }
      }
      if (alive.current) setError(e?.message || 'gagal memuat room');
    }
  }, [code, joinInfo]);

  const refetchSoon = useCallback(() => {
    clearTimeout(refetchTimer.current);
    refetchTimer.current = setTimeout(refetch, 200);
  }, [refetch]);

  useEffect(() => {
    alive.current = true;
    joinTried.current = false;
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
    retry: () => { joinTried.current = false; setError(''); refetch(); },
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
