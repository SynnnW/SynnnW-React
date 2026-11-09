-- ══════════════════════════════════════════════════════════════════════════════
-- 26Menfess — Patch v2 (idempotent, jalankan setelah menfess26.sql)
-- Tambah kolom baru, update RPC feed & view, tambah setting song_preview.
-- ══════════════════════════════════════════════════════════════════════════════

alter table public.menfess_posts
  add column if not exists text_size        text not null default 'auto'   check (text_size  in ('auto','xs','sm','md','lg')),
  add column if not exists text_color       text not null default 'dark'   check (text_color in ('dark','white')),
  add column if not exists align            text not null default 'center' check (align in ('center','left')),
  add column if not exists title            text check (title is null or length(title) <= 80),
  add column if not exists source           text not null default 'user'   check (source in ('user','admin')),
  add column if not exists song_title       text check (song_title  is null or length(song_title)  <= 100),
  add column if not exists song_artist      text check (song_artist is null or length(song_artist) <= 100),
  add column if not exists song_artwork_url text check (song_artwork_url is null or song_artwork_url ~ '^https://'),
  add column if not exists song_preview_url text check (song_preview_url is null or song_preview_url ~ '^https://'),
  add column if not exists song_url         text check (song_url is null or song_url ~ '^https://'),
  add column if not exists song_source      text check (song_source in ('itunes','manual'));

alter table public.menfess_settings
  add column if not exists song_preview_enabled boolean not null default true;

-- Migrasi kolom song lama
update public.menfess_posts
set song_title = song
where song is not null and song_title is null;

-- Update kategori check (sinkron dengan daftar terbaru)
alter table public.menfess_posts
  drop constraint if exists menfess_posts_category_check;
alter table public.menfess_posts
  add constraint menfess_posts_category_check
  check (category in ('curhat','cerita','songfess','request_lagu','titip_pesan','kritik_saran','tanya','info','fun','lainnya'));

-- Perbarui view client
create or replace view public.menfess_my_posts as
  select id, user_id, to_label, from_alias, category, song, song_title, song_artist,
         song_artwork_url, song_preview_url, song_url, song_source,
         body, design, text_size, text_color, align, title, source, status,
         reject_reason, public_note, ig_url, posted_at, rules_version,
         decided_at, created_at, updated_at
  from public.menfess_posts
  where user_id = auth.uid();

-- Perbarui RPC public feed (tambah kolom baru)
create or replace function public.menfess_public_feed(
  p_limit int default 12,
  p_before timestamptz default null
)
returns table (
  id uuid, to_label text, from_alias text, category text,
  body text, design text, text_size text, text_color text, align text, title text,
  song_title text, song_artist text, song_artwork_url text, song_preview_url text, song_url text,
  ig_url text, posted_at timestamptz
)
language sql security definer
set search_path = ''
as $$
  select id, to_label, from_alias, category,
         body, design, text_size, text_color, align, title,
         song_title, song_artist, song_artwork_url, song_preview_url, song_url,
         ig_url, posted_at
  from public.menfess_posts
  where status = 'posted'
    and (p_before is null or posted_at < p_before)
  order by posted_at desc
  limit least(p_limit, 30);
$$;
grant execute on function public.menfess_public_feed to anon, authenticated;
