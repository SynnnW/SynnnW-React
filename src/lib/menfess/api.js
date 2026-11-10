// ─── 26Menfess — API Layer ───────────────────────────────────────────────────
// Satu pintu semua panggilan Supabase. Komponen tidak import supabase langsung.
// Tidak ada select('*') — kolom selalu eksplisit.
// Tidak ada realtime/polling. Gunakan fungsi ini + cache.js.

import { supabase } from '@/supabaseClient';

// ─── PUBLIC (anon + authenticated) ──────────────────────────────────────────

const MY_COLS = 'id,to_label,from_alias,category,song,song_title,song_artist,song_artwork_url,song_preview_url,song_url,song_source,body,design,text_size,text_color,align,title,status,reject_reason,public_note,ig_url,posted_at,created_at,updated_at,rules_version';
const ADMIN_COLS = 'id,to_label,from_alias,category,song,song_title,song_artist,song_artwork_url,song_url,body,design,text_size,text_color,align,title,status,reject_reason,public_note,admin_note,ig_url,posted_at,created_at,updated_at,decided_by,decided_at,hold_until,rules_version,user_id';
const isMissingCol = (e) => e?.code === '42703' || /column .* does not exist|font|line_space/i.test(e?.message || '');

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
    .select(MY_COLS + ',font,line_space')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (before) q = q.lt('created_at', before);
  let { data, error } = await q;
  if (error && isMissingCol(error)) { // SQL v4 belum dijalankan
    let q2 = supabase.from('menfess_my_posts').select(MY_COLS).order('created_at', { ascending: false }).limit(limit);
    if (before) q2 = q2.lt('created_at', before);
    ({ data, error } = await q2);
  }
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
  const build = (cols) => {
    let q = supabase.from('menfess_posts').select(cols).order('created_at', { ascending: false }).limit(limit);
    if (status)   q = q.eq('status', status);
    if (design)   q = q.eq('design', design);
    if (category) q = q.eq('category', category);
    if (search)   q = q.ilike('body', `%${search}%`);
    if (before)   q = q.lt('created_at', before);
    return q;
  };
  // Kolom text_color/align/title/dll WAJIB ikut diambil, kalau tidak kartu admin selalu tampil default (teks hitam).
  let { data, error } = await build(ADMIN_COLS + ',font,line_space');
  if (error && isMissingCol(error)) ({ data, error } = await build(ADMIN_COLS)); // SQL v4 belum dijalankan
  if (error) throw error;
  return data ?? [];
}

/** Admin edit isi + gaya kartu (RPC menfess_admin_edit, ada di menfess26-v4.sql). */
export async function adminEditPost(id, f) {
  const { error } = await supabase.rpc('menfess_admin_edit', {
    p_id: id, p_body: f.body, p_design: f.design, p_text_size: f.text_size, p_text_color: f.text_color,
    p_font: f.font, p_align: f.align, p_line_space: f.line_space,
  });
  if (error) throw error;
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
