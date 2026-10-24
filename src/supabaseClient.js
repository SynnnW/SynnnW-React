import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum di-set. Cek .env atau Environment Variables di Vercel.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dipertahankan supaya file lama yang masih `import { auth, db } from '@/supabaseClient'`
// tetap jalan tanpa diubah satu-satu. `db` tidak dipakai langsung lagi (lihat firestoreCompat.js),
// tapi `auth` dipakai sebagai "handle" generik oleh fungsi-fungsi di authCompat.js.
export const auth = { __isSupabaseAuthHandle: true };
export const db = { __isSupabaseDbHandle: true };
export { provider } from './lib/authCompat';
