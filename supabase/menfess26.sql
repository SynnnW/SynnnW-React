-- ══════════════════════════════════════════════════════════════════════════════
-- 26Menfess — Database Schema v1
-- Jalankan di Supabase SQL Editor. Idempotent: aman dijalankan ulang.
-- Semua objek pakai prefix menfess_ agar tidak bentrok dengan tabel lain.
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Tabel admin ────────────────────────────────────────────────────────────
create table if not exists public.menfess_admins (
  email      text primary key check (email = lower(btrim(email))),
  role       text not null default 'admin' check (role in ('owner','admin')),
  added_by   text,
  created_at timestamptz default now()
);

-- ─── 2. Tabel pengaturan (selalu 1 baris: id = true) ─────────────────────────
create table if not exists public.menfess_settings (
  id                  boolean primary key default true check (id),
  accepting           boolean not null default true,
  closed_message      text,
  daily_limit         int not null default 5,
  cooldown_seconds    int not null default 30,
  default_hashtags    text default '#26menfess #FKEP2026',
  announcement        text,
  song_preview_enabled boolean not null default true,
  updated_at          timestamptz default now()
);

insert into public.menfess_settings (id) values (true) on conflict do nothing;

-- ─── 3. Tabel utama menfess ───────────────────────────────────────────────────
create table if not exists public.menfess_posts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  to_label        text check (to_label is null or length(to_label) <= 30),
  from_alias      text check (from_alias is null or length(from_alias) <= 30),
  category        text not null default 'curhat'
    check (category in ('curhat','cerita','songfess','request_lagu','titip_pesan','kritik_saran','tanya','info','fun','lainnya')),
  song            text check (song is null or length(song) <= 80),     -- legacy
  song_title      text check (song_title  is null or length(song_title)  <= 100),
  song_artist     text check (song_artist is null or length(song_artist) <= 100),
  song_artwork_url text check (song_artwork_url is null or song_artwork_url ~ '^https://'),
  song_preview_url text check (song_preview_url is null or song_preview_url ~ '^https://'),
  song_url        text check (song_url is null or song_url ~ '^https://'),
  song_source     text check (song_source in ('itunes','manual')),
  body            text not null check (length(btrim(body)) between 1 and 400),
  design          text not null check (design in ('pink','green')),
  text_size       text not null default 'auto' check (text_size  in ('auto','xs','sm','md','lg')),
  text_color      text not null default 'dark'  check (text_color in ('dark','white')),
  align           text not null default 'center' check (align in ('center','left')),
  title           text check (title is null or length(title) <= 80),
  source          text not null default 'user'   check (source in ('user','admin')),
  status          text not null default 'pending'
    check (status in ('pending','hold','approved','posted','rejected','withdrawn','removed')),
  reject_reason   text,
  public_note     text,
  admin_note      text,
  hold_until      date,
  ig_url          text check (ig_url is null or ig_url ~ '^https://(www\.)?instagram\.com/'),
  rules_version   int not null default 1,
  decided_by      text,
  decided_at      timestamptz,
  posted_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index
create index if not exists menfess_posts_status_created on public.menfess_posts (status, created_at);
create index if not exists menfess_posts_user_created   on public.menfess_posts (user_id, created_at desc);
create index if not exists menfess_posts_posted_at      on public.menfess_posts (posted_at desc) where status = 'posted';

-- ─── 4. View client (tanpa admin_note, tanpa user_id orang lain) ─────────────
create or replace view public.menfess_my_posts as
  select id, user_id, to_label, from_alias, category, song, song_title, song_artist,
         song_artwork_url, song_preview_url, song_url, song_source,
         body, design, text_size, text_color, align, title, source, status,
         reject_reason, public_note, ig_url, posted_at, rules_version,
         decided_at, created_at, updated_at
  from public.menfess_posts
  where user_id = auth.uid();

-- ─── 5. Audit log ────────────────────────────────────────────────────────────
create table if not exists public.menfess_events (
  id          bigint generated always as identity primary key,
  post_id     uuid references public.menfess_posts(id) on delete cascade,
  actor_email text,
  action      text not null,
  from_status text,
  to_status   text,
  note        text,
  created_at  timestamptz default now()
);

-- ─── 6. Fungsi helper ─────────────────────────────────────────────────────────

-- Cek apakah user saat ini adalah admin
create or replace function public.menfess_is_admin()
returns boolean language sql security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.menfess_admins
    where email = lower(coalesce(auth.jwt()->>'email',''))
      and coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
  );
$$;

-- Cek apakah user saat ini adalah owner
create or replace function public.menfess_is_owner()
returns boolean language sql security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.menfess_admins
    where email = lower(coalesce(auth.jwt()->>'email',''))
      and role = 'owner'
      and coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
  );
$$;

-- Feed publik (hanya kolom aman, hanya status=posted)
create or replace function public.menfess_public_feed(
  p_limit int default 12,
  p_before timestamptz default null
)
returns table (
  id uuid, to_label text, from_alias text, category text,
  body text, design text, text_size text, text_color text, align text,
  title text, song_title text, song_artist text, song_artwork_url text,
  song_preview_url text, song_url text,
  ig_url text, posted_at timestamptz
)
language sql security definer
set search_path = ''
as $$
  select id, to_label, from_alias, category,
         body, design, text_size, text_color, align,
         title, song_title, song_artist, song_artwork_url, song_preview_url, song_url,
         ig_url, posted_at
  from public.menfess_posts
  where status = 'posted'
    and (p_before is null or posted_at < p_before)
  order by posted_at desc
  limit least(p_limit, 30);
$$;
grant execute on function public.menfess_public_feed to anon, authenticated;

-- Pengaturan publik
create or replace function public.menfess_public_settings()
returns json language sql security definer
set search_path = ''
as $$
  select row_to_json(r) from (
    select accepting, closed_message, announcement
    from public.menfess_settings limit 1
  ) r;
$$;
grant execute on function public.menfess_public_settings to anon, authenticated;

-- Counter per status untuk admin
create or replace function public.menfess_admin_counts()
returns json language plpgsql security definer
set search_path = ''
as $$
begin
  if not public.menfess_is_admin() then
    raise exception 'Unauthorized';
  end if;
  return (
    select json_object_agg(status, cnt) from (
      select status, count(*) as cnt
      from public.menfess_posts
      where status in ('pending','hold','approved','posted','rejected','withdrawn','removed')
      group by status
    ) x
  );
end;
$$;

-- Tarik menfess (client)
create or replace function public.menfess_withdraw(p_id uuid)
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  v_status text;
begin
  select status into v_status from public.menfess_posts
  where id = p_id and user_id = auth.uid();
  if not found then raise exception 'Not found'; end if;
  if v_status not in ('pending','hold','approved') then
    raise exception 'Tidak bisa menarik menfess dengan status %', v_status;
  end if;
  update public.menfess_posts set status='withdrawn', updated_at=now() where id=p_id;
  insert into public.menfess_events(post_id, actor_email, action, from_status, to_status)
  values (p_id, auth.jwt()->>'email', 'withdraw', v_status, 'withdrawn');
end;
$$;
grant execute on function public.menfess_withdraw to authenticated;

-- Ubah status oleh admin (satu-satunya cara)
create or replace function public.menfess_admin_set_status(
  p_id          uuid,
  p_action      text,
  p_reason      text default null,
  p_public_note text default null,
  p_admin_note  text default null,
  p_ig_url      text default null,
  p_hold_until  date default null
)
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  v_cur text;
  v_new text;
  v_actor text := lower(coalesce(auth.jwt()->>'email',''));
begin
  if not public.menfess_is_admin() then raise exception 'Unauthorized'; end if;
  select status into v_cur from public.menfess_posts where id = p_id;
  if not found then raise exception 'Post not found'; end if;

  v_new := case p_action
    when 'approve'   then 'approved'
    when 'hold'      then 'hold'
    when 'reject'    then 'rejected'
    when 'post'      then 'posted'
    when 'takedown'  then 'removed'
    when 'reopen'    then 'pending'
    else null
  end;
  if v_new is null then raise exception 'Unknown action %', p_action; end if;

  -- Validasi transisi
  if not (
    (p_action = 'approve'  and v_cur in ('pending','hold'))  or
    (p_action = 'hold'     and v_cur in ('pending','approved')) or
    (p_action = 'reject'   and v_cur in ('pending','hold','approved')) or
    (p_action = 'post'     and v_cur = 'approved') or
    (p_action = 'takedown' and v_cur = 'posted') or
    (p_action = 'reopen'   and v_cur in ('rejected','hold','removed'))
  ) then
    raise exception 'Transisi tidak valid: % → %', v_cur, v_new;
  end if;

  update public.menfess_posts set
    status       = v_new,
    reject_reason = coalesce(p_reason,      reject_reason),
    public_note  = coalesce(p_public_note,  public_note),
    admin_note   = coalesce(p_admin_note,   admin_note),
    ig_url       = coalesce(p_ig_url,       ig_url),
    hold_until   = coalesce(p_hold_until,   hold_until),
    decided_by   = case when p_action in ('approve','reject','hold') then v_actor else decided_by end,
    decided_at   = case when p_action in ('approve','reject','hold') then now() else decided_at end,
    posted_at    = case when p_action = 'post' then now() else posted_at end,
    updated_at   = now()
  where id = p_id;

  insert into public.menfess_events(post_id, actor_email, action, from_status, to_status, note)
  values (p_id, v_actor, p_action, v_cur, v_new, coalesce(p_admin_note, p_reason, p_public_note));
end;
$$;

-- Set style oleh admin
create or replace function public.menfess_admin_set_style(
  p_id         uuid,
  p_text_size  text,
  p_text_color text,
  p_design     text
)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if not public.menfess_is_admin() then raise exception 'Unauthorized'; end if;
  update public.menfess_posts set
    text_size  = coalesce(p_text_size,  text_size),
    text_color = coalesce(p_text_color, text_color),
    design     = coalesce(p_design,     design),
    updated_at = now()
  where id = p_id;
  insert into public.menfess_events(post_id, actor_email, action, note)
  values (p_id, lower(coalesce(auth.jwt()->>'email','')), 'set_style',
    format('size=%s color=%s design=%s', p_text_size, p_text_color, p_design));
end;
$$;

-- Tambah/update admin (owner only)
create or replace function public.menfess_admin_upsert(p_email text, p_role text)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if not public.menfess_is_owner() then raise exception 'Owner only'; end if;
  if p_role not in ('admin','owner') then raise exception 'Role tidak valid'; end if;
  insert into public.menfess_admins(email, role, added_by)
  values (lower(btrim(p_email)), p_role, lower(coalesce(auth.jwt()->>'email','')))
  on conflict (email) do update set role = p_role;
end;
$$;

-- Hapus admin (owner only)
create or replace function public.menfess_admin_remove(p_email text)
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  v_owner_count int;
begin
  if not public.menfess_is_owner() then raise exception 'Owner only'; end if;
  if lower(btrim(p_email)) = lower(coalesce(auth.jwt()->>'email','')) then
    raise exception 'Tidak bisa menghapus dirimu sendiri';
  end if;
  -- Cegah hapus owner terakhir
  select count(*) into v_owner_count from public.menfess_admins where role = 'owner';
  if v_owner_count <= 1 and exists (
    select 1 from public.menfess_admins where email = lower(btrim(p_email)) and role = 'owner'
  ) then
    raise exception 'Tidak bisa menghapus owner terakhir';
  end if;
  delete from public.menfess_admins where email = lower(btrim(p_email));
end;
$$;

-- ─── 7. Trigger updated_at ────────────────────────────────────────────────────
create or replace function public.menfess_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists menfess_posts_updated_at on public.menfess_posts;
create trigger menfess_posts_updated_at
  before update on public.menfess_posts
  for each row execute function public.menfess_set_updated_at();

-- ─── 8. Trigger before insert: validasi & paksa nilai ──────────────────────
create or replace function public.menfess_before_insert()
returns trigger language plpgsql security definer
set search_path = ''
as $$
declare
  v_settings record;
  v_count    int;
  v_last     timestamptz;
begin
  select * into v_settings from public.menfess_settings limit 1;

  -- Hanya berlaku untuk kiriman user biasa
  if new.source = 'user' then
    -- Paksa nilai
    new.status    := 'pending';
    new.source    := 'user';
    new.admin_note := null;
    new.decided_by := null;
    new.decided_at := null;
    new.posted_at  := null;
    new.align      := 'center';  -- user tidak bisa set align
    new.title      := null;      -- user tidak bisa set title

    -- Cek apakah menerima
    if not v_settings.accepting then
      raise exception 'Pengiriman menfess sedang ditutup. %',
        coalesce(v_settings.closed_message,'');
    end if;

    -- Trim body
    new.body := btrim(new.body);
    if new.body = '' then raise exception 'Isi menfess tidak boleh kosong'; end if;

    -- Batas harian
    select count(*) into v_count
    from public.menfess_posts
    where user_id = new.user_id
      and created_at > now() - interval '24 hours'
      and status not in ('withdrawn');
    if v_count >= v_settings.daily_limit then
      raise exception 'Batas harian % menfess tercapai.', v_settings.daily_limit;
    end if;

    -- Jeda
    select max(created_at) into v_last
    from public.menfess_posts
    where user_id = new.user_id;
    if v_last is not null and extract(epoch from (now() - v_last)) < v_settings.cooldown_seconds then
      raise exception 'Tunggu % detik sebelum kirim lagi.', v_settings.cooldown_seconds;
    end if;
  end if;

  -- Paksa user_id = auth.uid() untuk semua
  if new.source = 'user' then
    new.user_id := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists menfess_before_insert_trigger on public.menfess_posts;
create trigger menfess_before_insert_trigger
  before insert on public.menfess_posts
  for each row execute function public.menfess_before_insert();

-- ─── 9. RLS ───────────────────────────────────────────────────────────────────
alter table public.menfess_admins   enable row level security;
alter table public.menfess_settings enable row level security;
alter table public.menfess_posts    enable row level security;
alter table public.menfess_events   enable row level security;

-- menfess_admins
drop policy if exists "admin select admins"  on public.menfess_admins;
drop policy if exists "anon no access admins" on public.menfess_admins;
create policy "admin select admins" on public.menfess_admins for select using (public.menfess_is_admin());

-- menfess_settings (read untuk semua via RPC; update owner)
drop policy if exists "all read settings"    on public.menfess_settings;
drop policy if exists "owner update settings" on public.menfess_settings;
create policy "all read settings"    on public.menfess_settings for select using (true);
create policy "owner update settings" on public.menfess_settings for update using (public.menfess_is_owner());

-- menfess_posts
drop policy if exists "user insert own"    on public.menfess_posts;
drop policy if exists "user select own"    on public.menfess_posts;
drop policy if exists "admin select all"   on public.menfess_posts;
drop policy if exists "admin insert admin" on public.menfess_posts;

create policy "user insert own" on public.menfess_posts
  for insert with check (source = 'user' and user_id = auth.uid());
create policy "user select own" on public.menfess_posts
  for select using (user_id = auth.uid() and not public.menfess_is_admin());
create policy "admin select all" on public.menfess_posts
  for select using (public.menfess_is_admin());
create policy "admin insert admin" on public.menfess_posts
  for insert with check (source = 'admin' and public.menfess_is_admin());

-- menfess_events (admin only)
drop policy if exists "admin select events" on public.menfess_events;
create policy "admin select events" on public.menfess_events for select using (public.menfess_is_admin());

-- ─── 10. Seed owner ───────────────────────────────────────────────────────────
insert into public.menfess_admins (email, role)
values ('aldokraksaan@gmail.com', 'owner')
on conflict do nothing;

-- ─── 11. Migrasi kolom song lama ke song_title ───────────────────────────────
update public.menfess_posts
set song_title = song
where song is not null and song_title is null;

-- ══════════════════════════════════════════════════════════════════════════════
-- SELESAI. Langkah manual setelah ini:
-- 1. Supabase Auth → Providers: aktifkan Google & Anonymous
-- 2. Supabase Auth → URL Configuration tambahkan Redirect URLs:
--    https://DOMAIN-KAMU/26menfess/**  dan  http://localhost:5173/**
-- 3. Supabase Auth → Sessions: pastikan time-box & inactivity NONAKTIF
-- 4. Supabase Auth → Sign In → Allow manual linking: ON
-- ══════════════════════════════════════════════════════════════════════════════
