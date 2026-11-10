-- ══════════════════════════════════════════════════════════════════════════════
-- 26Menfess — Patch v3: tambah tema kartu 'picnic' (idempotent)
-- Jalankan di Supabase SQL Editor SEBELUM user memilih tema Piknik.
-- ══════════════════════════════════════════════════════════════════════════════
alter table public.menfess_posts drop constraint if exists menfess_posts_design_check;
alter table public.menfess_posts
  add constraint menfess_posts_design_check check (design in ('pink','green','picnic'));
