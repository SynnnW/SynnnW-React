// ─── 26Menfess — Auth Hook ───────────────────────────────────────────────────
// Satu langganan onAuthStateChange, di-share via Context di MenfessApp.
// Semua guard di 26Menfess menunggu ready=true sebelum redirect.

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';
import { checkIsAdmin, checkIsOwner } from './api';

export const MfAuthContext = createContext(null);

export function useMfAuth() {
  const ctx = useContext(MfAuthContext);
  if (!ctx) throw new Error('useMfAuth harus dipakai di dalam MenfessApp');
  return ctx;
}

/** Provider; pasang sekali di MenfessApp. */
export function useMfAuthState() {
  const [user,    setUser]    = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ready,   setReady]   = useState(false);
  const checkRef = useRef(false);

  async function refreshRoles(supaUser) {
    if (!supaUser || supaUser.is_anonymous) {
      setIsAdmin(false); setIsOwner(false); return;
    }
    const [admin, owner] = await Promise.all([checkIsAdmin(), checkIsOwner()]);
    setIsAdmin(admin);
    setIsOwner(owner);
  }

  useEffect(() => {
    // Baca sesi pertama kali
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (!checkRef.current) { checkRef.current = true; refreshRoles(u).finally(() => setReady(true)); }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (event === 'SIGNED_OUT') { setIsAdmin(false); setIsOwner(false); }
      else { refreshRoles(u); }
      if (!checkRef.current) { checkRef.current = true; setReady(true); }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAnon = !!(user && user.is_anonymous);

  return { user, isAnon, isAdmin, isOwner, ready };
}
