import { createClient } from '@supabase/supabase-js';
import { hybridStorage } from './lib/menfess/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum di-set. Cek .env atau Environment Variables di Vercel.'
  );
}

// Hybrid storage: tulis ke localStorage + mirror IndexedDB.
// Baca dari localStorage; fallback IndexedDB kalau LS terhapus (ITP Safari, in-app browser).
// Storage key tetap default ('sb-...') agar user situs lain yang sudah login tidak ter-logout.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
    storage:           hybridStorage,
  },
});

// Dipertahankan supaya file lama yang masih `import { auth, db } from '@/supabaseClient'`
// tetap jalan tanpa diubah satu-satu. `db` tidak dipakai langsung lagi (lihat firestoreCompat.js),
// tapi `auth` dipakai sebagai "handle" generik oleh fungsi-fungsi di authCompat.js.
export const auth = { __isSupabaseAuthHandle: true };
export const db = { __isSupabaseDbHandle: true };
export { provider } from './lib/authCompat';
