// src/lib/osceApi.js
// Satu-satunya modul yang menyentuh Supabase untuk fitur OSCE. Komponen tidak
// boleh memanggil `supabase` langsung — selalu lewat fungsi-fungsi di sini.
import { supabase } from '@/supabaseClient';

export async function createRoom({ caseId, tipe, role, name, photo }) {
  const { data, error } = await supabase.rpc('osce_create_room', {
    p_case_id: caseId, p_tipe: tipe, p_role: role, p_name: name, p_photo: photo,
  });
  if (error) throw error;
  return data;
}

export async function joinRoom({ code, name, photo }) {
  const { data, error } = await supabase.rpc('osce_join_room', {
    p_code: code, p_name: name, p_photo: photo,
  });
  if (error) throw error;
  return data;
}

export async function leaveRoom(code) {
  const { data, error } = await supabase.rpc('osce_leave_room', { p_code: code });
  if (error) throw error;
  return data;
}

export async function startRoom(code) {
  const { data, error } = await supabase.rpc('osce_start_room', { p_code: code });
  if (error) throw error;
  return data;
}

export async function setPhase(code, idx) {
  const { data, error } = await supabase.rpc('osce_set_phase', { p_code: code, p_idx: idx });
  if (error) throw error;
  return data;
}

export async function logHelp(code) {
  const { data, error } = await supabase.rpc('osce_log_help', { p_code: code });
  if (error) throw error;
  return data;
}

export async function finishRoom(code) {
  const { data, error } = await supabase.rpc('osce_finish_room', { p_code: code });
  if (error) throw error;
  return data;
}

export async function swapRoles(code) {
  const { data, error } = await supabase.rpc('osce_swap_roles', { p_code: code });
  if (error) throw error;
  return data;
}

export async function getRoom(code) {
  const { data, error } = await supabase.from('osce_rooms').select('*').eq('code', code).maybeSingle();
  if (error) throw error;
  return data;
}

/** Langganan perubahan realtime pada satu room. Mengembalikan fungsi unsubscribe. */
export function subscribeRoom(code, onChange, onStatus) {
  const ch = supabase.channel(`osce-room-${code}`);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'osce_rooms', filter: `code=eq.${code}` }, (payload) => {
    onChange?.(payload);
  });
  ch.subscribe((status) => onStatus?.(status));
  return () => supabase.removeChannel(ch);
}

export async function saveAttempt(attempt) {
  const { data, error } = await supabase.from('osce_attempts').insert(attempt).select().single();
  if (error) throw error;
  return data;
}

export async function listMyAttempts(caseId) {
  let q = supabase.from('osce_attempts').select('*').order('created_at', { ascending: false });
  if (caseId) q = q.eq('case_id', caseId);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function sendFeedback({ roomCode, toUser, checklist, note }) {
  const { data, error } = await supabase
    .from('osce_feedback')
    .upsert({ room_code: roomCode, to_user: toUser, checklist, note }, { onConflict: 'room_code,from_user,to_user' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getFeedback(roomCode) {
  const { data, error } = await supabase.from('osce_feedback').select('*').eq('room_code', roomCode);
  if (error) throw error;
  return data || [];
}
