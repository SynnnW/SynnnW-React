-- supabase/osce.sql
-- Jalankan manual di Supabase SQL Editor (pola sama seperti file .sql lain di folder ini).
-- Isi: tabel + RPC untuk Simulasi OSCE Komunikasi (Komdas) di halaman UAS Quiziz.
--
-- Setelah menjalankan file ini, aktifkan realtime untuk osce_rooms:
--   Dashboard -> Database -> Replication -> supabase_realtime -> centang osce_rooms
-- (atau jalankan baris `alter publication supabase_realtime add table ...` di bagian paling bawah).

-- ─────────────────────────────────────────────────────────────
-- 0) Util: kode room 6 karakter, charset sama dengan yang dipakai di UI
--    (tanpa I, O, 0, 1 supaya tidak ambigu dibaca).
-- ─────────────────────────────────────────────────────────────
create or replace function public.osce_generate_code()
returns text
language plpgsql
set search_path = ''
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out_code text := '';
  i int;
begin
  for i in 1..6 loop
    out_code := out_code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return out_code;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 1) osce_rooms — satu baris per room multiplayer (maks. 2 pemain)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.osce_rooms (
  code         text primary key,
  case_id      text not null,
  tipe         text not null,
  host_id      uuid not null references auth.users(id) on delete cascade,
  host_name    text not null default '',
  host_photo   text,
  host_role    text not null check (host_role in ('perawat','lawan')),
  guest_id     uuid references auth.users(id) on delete set null,
  guest_name   text,
  guest_photo  text,
  status       text not null default 'waiting'
               check (status in ('waiting','ready','running','finished','closed')),
  phase_idx    int not null default 0,
  help_count   int not null default 0,
  started_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists osce_rooms_host_idx on public.osce_rooms(host_id);
create index if not exists osce_rooms_guest_idx on public.osce_rooms(guest_id);

alter table public.osce_rooms enable row level security;

-- Hanya baca langsung; semua tulis lewat RPC (security definer) di bawah.
drop policy if exists "osce_rooms select participant" on public.osce_rooms;
create policy "osce_rooms select participant" on public.osce_rooms
  for select using (auth.uid() = host_id or auth.uid() = guest_id);

-- ─────────────────────────────────────────────────────────────
-- 2) osce_attempts — hasil solo & multiplayer
-- ─────────────────────────────────────────────────────────────
create table if not exists public.osce_attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  case_id           text not null,
  tipe              text not null,
  mode              text not null check (mode in ('solo','multi')),
  role              text not null check (role in ('perawat','lawan')),
  duration_sec      int not null default 0,
  help_count        int not null default 0,
  phases_completed  int not null default 0,
  checklist         jsonb not null default '[]'::jsonb,
  score_percent     numeric,
  room_code         text references public.osce_rooms(code) on delete set null,
  created_at        timestamptz not null default now()
);

create index if not exists osce_attempts_user_idx on public.osce_attempts(user_id);
create index if not exists osce_attempts_case_idx on public.osce_attempts(user_id, case_id);

alter table public.osce_attempts enable row level security;

drop policy if exists "osce_attempts select own" on public.osce_attempts;
create policy "osce_attempts select own" on public.osce_attempts
  for select using (auth.uid() = user_id);

drop policy if exists "osce_attempts insert own" on public.osce_attempts;
create policy "osce_attempts insert own" on public.osce_attempts
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 3) osce_feedback — umpan balik antar pemain multiplayer
-- ─────────────────────────────────────────────────────────────
create table if not exists public.osce_feedback (
  id          uuid primary key default gen_random_uuid(),
  room_code   text not null references public.osce_rooms(code) on delete cascade,
  from_user   uuid not null references auth.users(id) on delete cascade,
  to_user     uuid not null references auth.users(id) on delete cascade,
  checklist   jsonb not null default '[]'::jsonb,
  note        text,
  created_at  timestamptz not null default now(),
  unique (room_code, from_user, to_user)
);

alter table public.osce_feedback enable row level security;

drop policy if exists "osce_feedback select mine" on public.osce_feedback;
create policy "osce_feedback select mine" on public.osce_feedback
  for select using (auth.uid() = from_user or auth.uid() = to_user);

drop policy if exists "osce_feedback insert own" on public.osce_feedback;
create policy "osce_feedback insert own" on public.osce_feedback
  for insert with check (
    auth.uid() = from_user
    and exists (
      select 1 from public.osce_rooms r
      where r.code = room_code
        and auth.uid() in (r.host_id, r.guest_id)
        and to_user in (r.host_id, r.guest_id)
        and to_user <> auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 4) RPC — satu-satunya jalan tulis ke osce_rooms
-- ─────────────────────────────────────────────────────────────

create or replace function public.osce_create_room(
  p_case_id text, p_tipe text, p_role text, p_name text, p_photo text
) returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_code text;
  v_row public.osce_rooms;
  v_tries int := 0;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_role not in ('perawat','lawan') then
    raise exception 'invalid_role';
  end if;

  -- Tutup room aktif lain milik user ini (host atau tamu)
  update public.osce_rooms
     set status = 'closed', updated_at = now()
   where status not in ('finished','closed')
     and (host_id = auth.uid() or guest_id = auth.uid());

  loop
    v_code := public.osce_generate_code();
    v_tries := v_tries + 1;
    begin
      insert into public.osce_rooms (
        code, case_id, tipe, host_id, host_name, host_photo, host_role, status
      ) values (
        v_code, p_case_id, p_tipe, auth.uid(), coalesce(p_name, ''), p_photo, p_role, 'waiting'
      )
      returning * into v_row;
      exit;
    exception when unique_violation then
      if v_tries > 10 then
        raise exception 'code_generation_failed';
      end if;
    end;
  end loop;

  return v_row;
end;
$$;

create or replace function public.osce_join_room(
  p_code text, p_name text, p_photo text
) returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if v_row.status in ('closed','finished') then
    raise exception 'room_closed';
  end if;
  if v_row.host_id = auth.uid() then
    raise exception 'cannot_join_own_room';
  end if;
  if v_row.guest_id is not null and v_row.guest_id <> auth.uid() then
    raise exception 'room_full';
  end if;

  -- Satu user = satu room aktif
  update public.osce_rooms
     set status = 'closed', updated_at = now()
   where status not in ('finished','closed')
     and code <> v_row.code
     and (host_id = auth.uid() or guest_id = auth.uid());

  update public.osce_rooms
     set guest_id = auth.uid(),
         guest_name = coalesce(p_name, ''),
         guest_photo = p_photo,
         status = 'ready',
         updated_at = now()
   where code = v_row.code
   returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.osce_leave_room(p_code text)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;

  if v_row.host_id = auth.uid() then
    update public.osce_rooms set status = 'closed', updated_at = now()
      where code = v_row.code returning * into v_row;
  elsif v_row.guest_id = auth.uid() then
    update public.osce_rooms
       set guest_id = null, guest_name = null, guest_photo = null,
           status = 'waiting', updated_at = now()
      where code = v_row.code returning * into v_row;
  else
    raise exception 'not_participant';
  end if;

  return v_row;
end;
$$;

create or replace function public.osce_start_room(p_code text)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if v_row.host_id <> auth.uid() then
    raise exception 'not_host';
  end if;
  if v_row.status <> 'ready' then
    raise exception 'not_ready';
  end if;

  update public.osce_rooms
     set status = 'running', started_at = now(), phase_idx = 0, help_count = 0, updated_at = now()
   where code = v_row.code
   returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.osce_set_phase(p_code text, p_idx int)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if auth.uid() not in (v_row.host_id, v_row.guest_id) then
    raise exception 'not_participant';
  end if;
  if p_idx < 0 then
    raise exception 'invalid_phase';
  end if;

  update public.osce_rooms set phase_idx = p_idx, updated_at = now()
    where code = v_row.code returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.osce_log_help(p_code text)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if auth.uid() not in (v_row.host_id, v_row.guest_id) then
    raise exception 'not_participant';
  end if;

  update public.osce_rooms set help_count = help_count + 1, updated_at = now()
    where code = v_row.code returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.osce_finish_room(p_code text)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if auth.uid() not in (v_row.host_id, v_row.guest_id) then
    raise exception 'not_participant';
  end if;

  update public.osce_rooms set status = 'finished', updated_at = now()
    where code = v_row.code returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.osce_swap_roles(p_code text)
returns public.osce_rooms
language plpgsql security definer set search_path = '' as $$
declare
  v_row public.osce_rooms;
  v_new_role text;
begin
  select * into v_row from public.osce_rooms where code = upper(p_code) for update;
  if not found then
    raise exception 'room_not_found';
  end if;
  if v_row.host_id <> auth.uid() then
    raise exception 'not_host';
  end if;
  if v_row.status not in ('ready','finished') then
    raise exception 'not_ready';
  end if;

  v_new_role := case when v_row.host_role = 'perawat' then 'lawan' else 'perawat' end;

  update public.osce_rooms
     set host_role = v_new_role,
         status = 'ready',
         phase_idx = 0,
         help_count = 0,
         started_at = null,
         updated_at = now()
   where code = v_row.code
   returning * into v_row;

  return v_row;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 5) Realtime: aktifkan broadcast perubahan baris osce_rooms
-- ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'osce_rooms'
  ) then
    alter publication supabase_realtime add table public.osce_rooms;
  end if;
end $$;
