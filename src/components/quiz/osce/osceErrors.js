// src/components/quiz/osce/osceErrors.js
// Memetakan pesan error RPC Supabase (lihat supabase/osce.sql) ke teks Indonesia ramah.

const MESSAGES = {
  not_authenticated: 'Sesi login Anda tidak terbaca, coba muat ulang halaman.',
  room_full: 'Room sudah penuh, maksimal 2 pemain.',
  room_not_found: 'Kode room tidak ditemukan. Periksa lagi kodenya.',
  room_closed: 'Room ini sudah ditutup atau selesai.',
  cannot_join_own_room: 'Ini room milik Anda sendiri, bagikan kodenya ke teman untuk bergabung.',
  not_participant: 'Anda bukan anggota room ini.',
  not_host: 'Hanya host yang bisa melakukan ini.',
  not_ready: 'Room belum siap (perlu 2 pemain dan status ready).',
  invalid_role: 'Peran tidak dikenal.',
  invalid_phase: 'Nomor fase tidak valid.',
  code_generation_failed: 'Gagal membuat kode room, coba lagi.',
};

export function describeOsceError(err) {
  const raw = (err?.message || '').trim();
  return MESSAGES[raw] || 'Terjadi masalah, silakan coba lagi.';
}
