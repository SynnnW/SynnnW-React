// ─── 26Menfess — API Layer ───────────────────────────────────────────────────
// Satu pintu semua panggilan Supabase. Komponen tidak import supabase langsung.
// Tidak ada select('*') — kolom selalu eksplisit.
// Tidak ada realtime/polling. Gunakan fungsi ini + cache.js.

import { supabase } from '@/supabaseClient';

// ─── PUBLIC (anon + authenticated) ──────────────────────────────────────────

/** Feed publik: hanya status=posted, via RPC aman (tanpa user_id). */
export async function fetchPublicFeed({ limit = 12, before = null } = {}) {
  const { data, error } = await supabase.rpc('menfess_public_feed', {
    p_limit:  limit,
    p_before: before,
  });
  if (error) throw error;
  return data ?? [];
}

/** Pengaturan publik (accepting, closed_message, announcement). */
export async function fetchPublicSettings() {
  const { data, error } = await supabase.rpc('menfess_public_settings');
  if (error) throw error;
  return data ?? { accepting: true, closed_message: null, announcement: null };
}

// ─── CLIENT (authenticated) ──────────────────────────────────────────────────

/**
 * Riwayat menfess milik user yang login.
 * Menggunakan view menfess_my_posts (tanpa kolom admin_note).
 */
export async function fetchMyPosts({ limit = 30, before = null } = {}) {
  let q = supabase
    .from('menfess_my_posts')
    .select('id,to_label,from_alias,category,song,body,design,status,reject_reason,public_note,ig_url,posted_at,created_at,updated_at,rules_version')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (before) q = q.lt('created_at', before);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/** Kirim menfess baru. */
export async function submitPost(payload) {
  const { data, error } = await supabase
    .from('menfess_posts')
    .insert(payload)
    .select('id,status,created_at')
    .single();
  if (error) throw error;
  return data;
}

/** Tarik menfess (hanya pending/hold/approved). */
export async function withdrawPost(id) {
  const { error } = await supabase.rpc('menfess_withdraw', { p_id: id });
  if (error) throw error;
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

/** Cek apakah user saat ini adalah admin. */
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc('menfess_is_admin');
  if (error) return false;
  return !!data;
}

/** Cek apakah user saat ini adalah owner. */
export async function checkIsOwner() {
  const { data, error } = await supabase.rpc('menfess_is_owner');
  if (error) return false;
  return !!data;
}

/** Counter per status (satu RPC, bukan 6 query). */
export async function fetchAdminCounts() {
  const { data, error } = await supabase.rpc('menfess_admin_counts');
  if (error) throw error;
  return data ?? {};
}

/** Daftar menfess untuk admin dengan filter/pagination. */
export async function fetchAdminPosts({
  status   = null,
  design   = null,
  category = null,
  search   = null,
  limit    = 20,
  before   = null,
} = {}) {
  let q = supabase
    .from('menfess_posts')
    .select('id,to_label,from_alias,category,song,song_title,song_artist,song_artwork_url,song_url,body,design,status,reject_reason,public_note,admin_note,ig_url,posted_at,created_at,updated_at,decided_by,decided_at,hold_until,rules_version,user_id')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status)   q = q.eq('status', status);
  if (design)   q = q.eq('design', design);
  if (category) q = q.eq('category', category);
  if (search)   q = q.ilike('body', `%${search}%`);
  if (before)   q = q.lt('created_at', before);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/**
 * Ubah status menfess (satu-satunya cara admin mengubah status).
 * Validasi transisi dilakukan di server (menfess_admin_set_status).
 */
export async function adminSetStatus({
  id,
  action,
  reason      = null,
  publicNote  = null,
  adminNote   = null,
  igUrl       = null,
  holdUntil   = null,
}) {
  const { error } = await supabase.rpc('menfess_admin_set_status', {
    p_id:          id,
    p_action:      action,
    p_reason:      reason,
    p_public_note: publicNote,
    p_admin_note:  adminNote,
    p_ig_url:      igUrl,
    p_hold_until:  holdUntil,
  });
  if (error) throw error;
}

// ─── OWNER — kelola admin ────────────────────────────────────────────────────

export async function fetchAdminList() {
  const { data, error } = await supabase
    .from('menfess_admins')
    .select('email,role,added_by,created_at')
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function upsertAdmin(email, role) {
  const { error } = await supabase.rpc('menfess_admin_upsert', { p_email: email, p_role: role });
  if (error) throw error;
}

export async function removeAdmin(email) {
  const { error } = await supabase.rpc('menfess_admin_remove', { p_email: email });
  if (error) throw error;
}

// ─── OWNER — pengaturan ──────────────────────────────────────────────────────

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('menfess_settings')
    .select('accepting,closed_message,daily_limit,cooldown_seconds,default_hashtags,announcement')
    .single();
  if (error) throw error;
  return data;
}

export async function updateSettings(patch) {
  const { error } = await supabase
    .from('menfess_settings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', true);
  if (error) throw error;
}

// ─── Helper: short sender code (6 hex dari hash user_id) ────────────────────
// Dipakai admin untuk mengenali pola spam tanpa melihat identitas.
export function shortCode(userId) {
  if (!userId) return '??????';
  // Ambil 6 karakter dari uuid (sudah hex)
  return userId.replace(/-/g, '').slice(0, 6).toUpperCase();
}
