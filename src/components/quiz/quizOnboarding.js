// src/components/quiz/quizOnboarding.js
// ─────────────────────────────────────────────────────────────
// Helper status onboarding Quiziz (login Google + baca penjelasan + kuesioner).
// Sumber kebenaran = tabel `quiz_onboarding` di Supabase (lihat supabase/quiziz-onboarding.sql),
// BUKAN localStorage, jadi status ikut akun di device manapun.
//
// Kebijakan kegagalan: kalau tabelnya belum dibuat / query error, gate dibiarkan TERBUKA
// (fail-open) supaya situs tidak terkunci untuk semua orang sebelum SQL dijalankan.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { getAuth, onAuthStateChanged } from '@/lib/authCompat';

const auth = getAuth();

/** Sesi login + penanda "sudah selesai dicek" (beda dari useQuizAuth yang tidak bisa bedakan loading vs logout). */
export function useQuizSession() {
  const [state, setState] = useState({ ready: false, user: null });
  useEffect(() => onAuthStateChanged(auth, (u) => setState({ ready: true, user: u })), []);
  return state;
}

// cache per-user selama sesi tab, supaya pindah antar halaman Quiziz tidak query ulang
const cache = new Map(); // uid -> 'done' | 'open'

/**
 * @returns {Promise<'done'|'todo'|'open'>}
 *  done = sudah onboarding · todo = belum · open = tidak bisa dicek (fail-open)
 */
export async function fetchOnboardingStatus(uid) {
  if (cache.get(uid) === 'done') return 'done';
  try {
    const { data, error } = await supabase
      .from('quiz_onboarding')
      .select('user_id')
      .eq('user_id', uid)
      .maybeSingle();
    if (error) throw error;
    if (data) { cache.set(uid, 'done'); return 'done'; }
    return 'todo';
  } catch (e) {
    console.warn('[quiz-onboarding] gagal cek status, gate dibiarkan terbuka:', e?.message || e);
    return 'open';
  }
}

export async function saveOnboarding(user, answers) {
  const { error } = await supabase.from('quiz_onboarding').upsert(
    { user_id: user.uid, email: user.email || null, answers, completed_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
  if (error) throw error;
  cache.set(user.uid, 'done');
}

/** Hanya terima path internal Quiziz sebagai tujuan setelah onboarding (cegah open-redirect). */
export function safeNext(raw) {
  if (typeof raw !== 'string') return '/quiziz';
  if (!raw.startsWith('/quiziz') && !raw.startsWith('/quizizuas')) return '/quiziz';
  if (raw.startsWith('//')) return '/quiziz';
  if (raw.startsWith('/quiziz/masuk') || raw.startsWith('/quiziz/kuesioner')) return '/quiziz';
  return raw;
}

export const GATE_ACK_KEY = 'qz_gate_ack'; // sessionStorage: penanda "sudah baca penjelasan" selama proses redirect OAuth
