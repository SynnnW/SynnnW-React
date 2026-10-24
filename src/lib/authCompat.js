// Lapisan kompatibilitas untuk firebase/auth, datanya betulan dari Supabase Auth.
import { supabase } from '../supabaseClient';

export class GoogleAuthProvider {}

// Instance generik, dipertahankan buat pola lama `import { provider } from '../firebase'`.
export const provider = new GoogleAuthProvider();

// Dipertahankan supaya pola lama `getAuth(app)` / `getAuth(quizApp)` tetap bisa
// dipanggil — cuma ada satu sesi Supabase Auth, jadi ini cuma handle generik.
export function getAuth() {
  return { __isSupabaseAuthHandle: true };
}

export async function updateProfile(_user, updates = {}) {
  const payload = {};
  if (updates.displayName !== undefined) payload.full_name = updates.displayName;
  if (updates.photoURL !== undefined) payload.avatar_url = updates.photoURL;
  const { error } = await supabase.auth.updateUser({ data: payload });
  if (error) throw error;
}

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return { user: mapUser(data.user) };
}

export async function signInWithEmailAndPassword(_authHandle, email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: mapUser(data.user) };
}

export async function createUserWithEmailAndPassword(_authHandle, email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: mapUser(data.user) };
}

export function setPersistence() {
  // Supabase persist session secara default (localStorage) — no-op di sini,
  // dipertahankan cuma supaya pemanggilan lama `setPersistence(auth, browserLocalPersistence)` tidak error.
  return Promise.resolve();
}
export const browserLocalPersistence = 'LOCAL';

function mapUser(u) {
  if (!u) return null;
  return {
    uid: u.id,
    email: u.email,
    displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email,
    photoURL: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
    emailVerified: !!u.email_confirmed_at,
    raw: u,
  };
}

export async function signInWithPopup() {
  // Supabase OAuth pakai redirect flow, bukan popup window.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthStateChanged(_authHandle, callback) {
  supabase.auth.getSession().then(({ data }) => callback(mapUser(data.session?.user)));
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUser(session?.user));
  });
  return () => sub.subscription.unsubscribe();
}
