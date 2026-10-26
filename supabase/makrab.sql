-- ════════════════════════════════════════════════════════════════
--  MAKRAB 2026 — koordinasi divisi PDD (1 admin + 8 anggota)
--  Project Supabase: synnnw-react (fvrnvblrzbsbmhauyvde)
--
--  Cara jalan: Supabase Dashboard → SQL Editor → tempel semua → Run.
--  Aman dijalankan ulang (idempotent): tabel/fungsi/policy dibuat ulang,
--  seed tugas hanya masuk kalau belum ada tugas makrab/admin.
--
--  Peran TIDAK diambil dari users.role. Peran = tabel makrab_members,
--  dicocokkan lewat email akun Supabase yang sudah terverifikasi.
-- ════════════════════════════════════════════════════════════════

-- ─── 1. TABEL ────────────────────────────────────────────────────

create table if not exists public.makrab_members (
  id         uuid primary key default gen_random_uuid(),
  email      text not null check (email = lower(btrim(email)) and length(email) <= 254),
  nama       text not null check (length(nama) between 1 and 80),
  kelas      text check (kelas is null or length(kelas) <= 20),
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists makrab_members_email_key on public.makrab_members (email);

create table if not exists public.makrab_tasks (
  id          uuid primary key default gen_random_uuid(),
  kategori    text not null check (kategori in ('kuliah', 'makrab', 'admin')),
  judul       text not null check (length(judul) between 1 and 200),
  deskripsi   text check (deskripsi is null or length(deskripsi) <= 4000),
  matkul      text check (matkul is null or length(matkul) <= 80),
  deadline    timestamptz,
  dibuat_oleh uuid references public.makrab_members(id) on delete set null,
  status      text not null default 'todo' check (status in ('todo', 'proses', 'review', 'selesai')),
  parent_id   uuid references public.makrab_tasks(id) on delete cascade,
  urutan      integer not null default 0,
  kelas       text check (kelas is null or length(kelas) <= 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists makrab_tasks_parent_idx on public.makrab_tasks (parent_id);
create index if not exists makrab_tasks_kategori_idx on public.makrab_tasks (kategori, urutan);

-- Penugasan banyak orang (menggantikan satu kolom assignee_id)
create table if not exists public.makrab_task_assignees (
  task_id    uuid not null references public.makrab_tasks(id) on delete cascade,
  member_id  uuid not null references public.makrab_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, member_id)
);
create index if not exists makrab_assignees_member_idx on public.makrab_task_assignees (member_id);

create table if not exists public.makrab_comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.makrab_tasks(id) on delete cascade,
  author_id  uuid not null references public.makrab_members(id) on delete cascade,
  isi        text not null check (length(isi) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists makrab_comments_task_idx on public.makrab_comments (task_id, created_at);

create table if not exists public.makrab_submissions (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.makrab_tasks(id) on delete cascade,
  author_id  uuid not null references public.makrab_members(id) on delete cascade,
  url        text not null check (url ~* '^https?://[^[:space:]]+$' and length(url) <= 2000),
  catatan    text check (catatan is null or length(catatan) <= 2000),
  revisi_ke  integer not null default 1,
  status     text not null default 'menunggu' check (status in ('menunggu', 'perlu_revisi', 'disetujui')),
  created_at timestamptz not null default now()
);
create index if not exists makrab_submissions_task_idx on public.makrab_submissions (task_id, created_at);

create table if not exists public.makrab_reviews (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.makrab_submissions(id) on delete cascade,
  isi           text not null check (length(isi) between 1 and 4000),
  created_at    timestamptz not null default now()
);
create index if not exists makrab_reviews_sub_idx on public.makrab_reviews (submission_id, created_at);

create table if not exists public.makrab_reminders (
  id        uuid primary key default gen_random_uuid(),
  task_id   uuid not null references public.makrab_tasks(id) on delete cascade,
  member_id uuid not null references public.makrab_members(id) on delete cascade,
  waktu     timestamptz not null,
  dikirim   boolean not null default false
);
create index if not exists makrab_reminders_member_idx on public.makrab_reminders (member_id, dikirim, waktu);

-- ─── 2. FUNGSI PERAN (security definer, search_path dikunci) ─────

-- id baris makrab_members milik user yang sedang login (null kalau tidak terdaftar).
-- Email akun harus sudah terverifikasi supaya tidak bisa "mendaftar" pakai email orang lain.
create or replace function public.makrab_member_id()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select m.id
  from public.makrab_members m
  join auth.users u on lower(u.email) = m.email
  where u.id = auth.uid() and u.email_confirmed_at is not null
  limit 1;
$$;

create or replace function public.makrab_is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select coalesce((
    select m.is_admin
    from public.makrab_members m
    join auth.users u on lower(u.email) = m.email
    where u.id = auth.uid() and u.email_confirmed_at is not null
    limit 1
  ), false)
  -- cadangan: koordinator tidak bisa terkunci kalau barisnya terhapus
  or exists (
    select 1 from auth.users u
    where u.id = auth.uid() and u.email_confirmed_at is not null
      and lower(u.email) = 'aldokraksaan@gmail.com'
  );
$$;

create or replace function public.makrab_member_kelas()
returns text
language sql stable security definer
set search_path = ''
as $$
  select m.kelas from public.makrab_members m where m.id = public.makrab_member_id();
$$;

-- Boleh lihat tugas ini? (dipakai tabel anak; tabel tugas sendiri pakai ekspresi langsung
-- supaya INSERT ... RETURNING tidak terblokir snapshot)
create or replace function public.makrab_can_see_task(tid uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select public.makrab_is_admin() or exists (
    select 1
    from public.makrab_tasks t
    where t.id = tid
      and public.makrab_member_id() is not null
      and t.kategori <> 'admin'
      and (t.kelas is null or t.kelas = public.makrab_member_kelas())
      and (
        (t.kategori = 'kuliah' and t.dibuat_oleh = public.makrab_member_id())
        or exists (
          select 1 from public.makrab_task_assignees a
          where a.member_id = public.makrab_member_id()
            and (a.task_id = t.id or a.task_id = t.parent_id)
        )
      )
  );
$$;

create or replace function public.makrab_owns_kuliah_task(tid uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.makrab_tasks t
    where t.id = tid and t.kategori = 'kuliah' and t.dibuat_oleh = public.makrab_member_id()
  );
$$;

create or replace function public.makrab_can_submit(tid uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select public.makrab_can_see_task(tid) and exists (
    select 1 from public.makrab_tasks t where t.id = tid and t.kategori = 'makrab'
  );
$$;

create or replace function public.makrab_can_see_submission(sid uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.makrab_submissions s
    where s.id = sid and public.makrab_can_see_task(s.task_id)
  );
$$;

-- Daftar nama anggota (tanpa email) supaya anggota bisa melihat nama pemberi komentar / teman satu tugas.
create or replace function public.makrab_roster()
returns table (id uuid, nama text, kelas text, is_admin boolean)
language sql stable security definer
set search_path = ''
as $$
  select m.id, m.nama, m.kelas, m.is_admin
  from public.makrab_members m
  where public.makrab_member_id() is not null or public.makrab_is_admin();
$$;

-- ─── 3. TRIGGER ──────────────────────────────────────────────────

-- Anggota hanya boleh: menambah tugas KULIAH milik sendiri, dan mengubah status tugas yang dia lihat.
create or replace function public.makrab_tasks_guard()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare me uuid := public.makrab_member_id();
begin
  -- tanpa sesi login (SQL Editor / migration / seed) atau admin: bebas
  if auth.uid() is null or public.makrab_is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.kategori <> 'kuliah' then
      raise exception 'Anggota hanya boleh menambah tugas kuliah';
    end if;
    new.dibuat_oleh := me;
    new.parent_id := null;
    new.kelas := null;
    return new;
  end if;

  -- UPDATE oleh anggota
  if old.kategori = 'kuliah' and old.dibuat_oleh = me then
    if new.kategori <> old.kategori
       or new.dibuat_oleh is distinct from old.dibuat_oleh
       or new.parent_id is distinct from old.parent_id
       or new.kelas is distinct from old.kelas then
      raise exception 'Tidak boleh mengubah kategori, pemilik, atau kelas tugas';
    end if;
    return new;
  end if;

  if new.kategori <> old.kategori
     or new.judul <> old.judul
     or new.deskripsi is distinct from old.deskripsi
     or new.matkul is distinct from old.matkul
     or new.deadline is distinct from old.deadline
     or new.dibuat_oleh is distinct from old.dibuat_oleh
     or new.parent_id is distinct from old.parent_id
     or new.urutan <> old.urutan
     or new.kelas is distinct from old.kelas then
    raise exception 'Anggota hanya boleh mengubah status tugas';
  end if;
  return new;
end;
$$;

drop trigger if exists makrab_tasks_guard_trg on public.makrab_tasks;
create trigger makrab_tasks_guard_trg
  before insert or update on public.makrab_tasks
  for each row execute function public.makrab_tasks_guard();

drop trigger if exists makrab_tasks_updated_trg on public.makrab_tasks;
create trigger makrab_tasks_updated_trg
  before update on public.makrab_tasks
  for each row execute function public.set_updated_at();

-- Link baru: nomor revisi otomatis, status awal selalu 'menunggu' (kecuali admin), tugas masuk 'review'.
create or replace function public.makrab_submissions_before_insert()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not public.makrab_is_admin() then
    new.author_id := public.makrab_member_id();
    new.status := 'menunggu';
  end if;
  new.revisi_ke := coalesce((
    select max(s.revisi_ke) from public.makrab_submissions s
    where s.task_id = new.task_id and s.author_id = new.author_id
  ), 0) + 1;
  return new;
end;
$$;

drop trigger if exists makrab_submissions_bi_trg on public.makrab_submissions;
create trigger makrab_submissions_bi_trg
  before insert on public.makrab_submissions
  for each row execute function public.makrab_submissions_before_insert();

create or replace function public.makrab_submissions_after()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.makrab_tasks set status = 'review'
      where id = new.task_id and status in ('todo', 'proses');
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    if new.status = 'perlu_revisi' then
      update public.makrab_tasks set status = 'proses' where id = new.task_id and status <> 'selesai';
    elsif new.status = 'disetujui' then
      update public.makrab_tasks set status = 'selesai' where id = new.task_id;
    end if;
  end if;
  return null;
end;
$$;

drop trigger if exists makrab_submissions_after_trg on public.makrab_submissions;
create trigger makrab_submissions_after_trg
  after insert or update on public.makrab_submissions
  for each row execute function public.makrab_submissions_after();

-- ─── 4. RLS ──────────────────────────────────────────────────────

alter table public.makrab_members        enable row level security;
alter table public.makrab_tasks          enable row level security;
alter table public.makrab_task_assignees enable row level security;
alter table public.makrab_comments       enable row level security;
alter table public.makrab_submissions    enable row level security;
alter table public.makrab_reviews        enable row level security;
alter table public.makrab_reminders      enable row level security;

-- makrab_members: admin penuh; anggota hanya barisnya sendiri
drop policy if exists makrab_members_admin on public.makrab_members;
create policy makrab_members_admin on public.makrab_members
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_members_self on public.makrab_members;
create policy makrab_members_self on public.makrab_members
  for select to authenticated using (id = public.makrab_member_id());

-- makrab_tasks
drop policy if exists makrab_tasks_admin on public.makrab_tasks;
create policy makrab_tasks_admin on public.makrab_tasks
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());

drop policy if exists makrab_tasks_member_select on public.makrab_tasks;
create policy makrab_tasks_member_select on public.makrab_tasks
  for select to authenticated using (
    public.makrab_member_id() is not null
    and kategori <> 'admin'
    and (kelas is null or kelas = public.makrab_member_kelas())
    and (
      (kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id())
      or exists (
        select 1 from public.makrab_task_assignees a
        where a.member_id = public.makrab_member_id()
          and (a.task_id = makrab_tasks.id or a.task_id = makrab_tasks.parent_id)
      )
    )
  );

drop policy if exists makrab_tasks_member_insert on public.makrab_tasks;
create policy makrab_tasks_member_insert on public.makrab_tasks
  for insert to authenticated with check (
    public.makrab_member_id() is not null and kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id()
  );

drop policy if exists makrab_tasks_member_update on public.makrab_tasks;
create policy makrab_tasks_member_update on public.makrab_tasks
  for update to authenticated
  using (public.makrab_can_see_task(id))
  with check (public.makrab_can_see_task(id));

drop policy if exists makrab_tasks_member_delete on public.makrab_tasks;
create policy makrab_tasks_member_delete on public.makrab_tasks
  for delete to authenticated using (kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id());

-- makrab_task_assignees
drop policy if exists makrab_assignees_admin on public.makrab_task_assignees;
create policy makrab_assignees_admin on public.makrab_task_assignees
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_assignees_select on public.makrab_task_assignees;
create policy makrab_assignees_select on public.makrab_task_assignees
  for select to authenticated using (member_id = public.makrab_member_id() or public.makrab_can_see_task(task_id));
drop policy if exists makrab_assignees_member_insert on public.makrab_task_assignees;
create policy makrab_assignees_member_insert on public.makrab_task_assignees
  for insert to authenticated with check (member_id = public.makrab_member_id() and public.makrab_owns_kuliah_task(task_id));
drop policy if exists makrab_assignees_member_delete on public.makrab_task_assignees;
create policy makrab_assignees_member_delete on public.makrab_task_assignees
  for delete to authenticated using (member_id = public.makrab_member_id() and public.makrab_owns_kuliah_task(task_id));

-- makrab_comments
drop policy if exists makrab_comments_admin on public.makrab_comments;
create policy makrab_comments_admin on public.makrab_comments
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_comments_select on public.makrab_comments;
create policy makrab_comments_select on public.makrab_comments
  for select to authenticated using (public.makrab_can_see_task(task_id));
drop policy if exists makrab_comments_insert on public.makrab_comments;
create policy makrab_comments_insert on public.makrab_comments
  for insert to authenticated with check (author_id = public.makrab_member_id() and public.makrab_can_see_task(task_id));
drop policy if exists makrab_comments_delete on public.makrab_comments;
create policy makrab_comments_delete on public.makrab_comments
  for delete to authenticated using (author_id = public.makrab_member_id());

-- makrab_submissions: anggota boleh lihat + kirim; hanya admin yang mengubah status / menghapus
drop policy if exists makrab_submissions_admin on public.makrab_submissions;
create policy makrab_submissions_admin on public.makrab_submissions
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_submissions_select on public.makrab_submissions;
create policy makrab_submissions_select on public.makrab_submissions
  for select to authenticated using (public.makrab_can_see_task(task_id));
drop policy if exists makrab_submissions_insert on public.makrab_submissions;
create policy makrab_submissions_insert on public.makrab_submissions
  for insert to authenticated with check (author_id = public.makrab_member_id() and public.makrab_can_submit(task_id));

-- makrab_reviews: hanya admin menulis; anggota membaca review di link yang dia lihat
drop policy if exists makrab_reviews_admin on public.makrab_reviews;
create policy makrab_reviews_admin on public.makrab_reviews
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_reviews_select on public.makrab_reviews;
create policy makrab_reviews_select on public.makrab_reviews
  for select to authenticated using (public.makrab_can_see_submission(submission_id));

-- makrab_reminders: tiap orang mengatur pengingat miliknya sendiri
drop policy if exists makrab_reminders_admin on public.makrab_reminders;
create policy makrab_reminders_admin on public.makrab_reminders
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());
drop policy if exists makrab_reminders_own on public.makrab_reminders;
create policy makrab_reminders_own on public.makrab_reminders
  for all to authenticated
  using (member_id = public.makrab_member_id())
  with check (member_id = public.makrab_member_id() and public.makrab_can_see_task(task_id));

-- ─── 5. HAK AKSES ────────────────────────────────────────────────
-- Tamu (anon) tidak boleh menyentuh apa pun. Login (authenticated) dibatasi RLS di atas.
revoke all on public.makrab_members, public.makrab_tasks, public.makrab_task_assignees,
              public.makrab_comments, public.makrab_submissions, public.makrab_reviews,
              public.makrab_reminders from anon;
grant select, insert, update, delete on public.makrab_members, public.makrab_tasks,
              public.makrab_task_assignees, public.makrab_comments, public.makrab_submissions,
              public.makrab_reviews, public.makrab_reminders to authenticated;

revoke execute on function
  public.makrab_member_id(), public.makrab_is_admin(), public.makrab_member_kelas(),
  public.makrab_can_see_task(uuid), public.makrab_owns_kuliah_task(uuid),
  public.makrab_can_submit(uuid), public.makrab_can_see_submission(uuid), public.makrab_roster()
  from public, anon;
grant execute on function
  public.makrab_member_id(), public.makrab_is_admin(), public.makrab_member_kelas(),
  public.makrab_can_see_task(uuid), public.makrab_owns_kuliah_task(uuid),
  public.makrab_can_submit(uuid), public.makrab_can_see_submission(uuid), public.makrab_roster()
  to authenticated;

-- ─── 6. REALTIME ─────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'makrab_members', 'makrab_tasks', 'makrab_task_assignees', 'makrab_comments',
    'makrab_submissions', 'makrab_reviews', 'makrab_reminders'
  ] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ─── 7. SEED ─────────────────────────────────────────────────────
-- Koordinator. Email 8 anggota TIDAK di-hardcode: tambahkan dari halaman /makrab (menu Anggota).
insert into public.makrab_members (email, nama, kelas, is_admin)
values ('aldokraksaan@gmail.com', 'Aldo', null, true)
on conflict (email) do nothing;

do $$
declare
  adm uuid;
  pid uuid;
begin
  select id into adm from public.makrab_members where email = 'aldokraksaan@gmail.com';

  -- sudah pernah di-seed → jangan dobel
  if exists (select 1 from public.makrab_tasks where kategori in ('makrab', 'admin')) then
    return;
  end if;

  -- Tugas Makrab (assignee sengaja kosong; dibagi manual dari dashboard admin)
  insert into public.makrab_tasks (kategori, judul, dibuat_oleh, urutan) values
    ('makrab', 'Logo angkatan (cakravala)', adm, 1),
    ('makrab', 'PDH angkatan maroon',       adm, 2),
    ('makrab', 'Lanyard panitia',           adm, 3);

  insert into public.makrab_tasks (kategori, judul, dibuat_oleh, urutan)
    values ('makrab', 'Instagram angkatan: feed IG (cakravala)', adm, 4) returning id into pid;
  insert into public.makrab_tasks (kategori, judul, parent_id, dibuat_oleh, urutan)
    select 'makrab', x.j, pid, adm, x.o
    from unnest(array[
      'Coming Soon',
      'Nama angkatan',
      'Logo dan filosofi angkatan',
      'Foto angkatan',
      'Foto kelas',
      'Introduce panitia makrab',
      'H- dan D-day',
      'Penutupan dan terima kasih makrab angkatan 2026'
    ]) with ordinality as x(j, o);

  insert into public.makrab_tasks (kategori, judul, deskripsi, dibuat_oleh, urutan)
    values ('makrab', 'Desain sponsor', 'Opsi sponsorship makrab 2026.', adm, 5) returning id into pid;
  insert into public.makrab_tasks (kategori, judul, parent_id, dibuat_oleh, urutan)
    select 'makrab', x.j, pid, adm, x.o
    from unnest(array['Videotron', 'Paid promote', 'Tenant', 'Banner']) with ordinality as x(j, o);

  insert into public.makrab_tasks (kategori, judul, dibuat_oleh, urutan) values
    ('makrab', 'Video H-3 sampai H-1 dan video D-day', adm, 6),
    ('makrab', 'Kaos angkatan',                        adm, 7);

  -- To-do Admin (khusus koordinator, tidak terlihat anggota)
  insert into public.makrab_tasks (kategori, judul, dibuat_oleh, urutan)
    select 'admin', x.j, adm, x.o
    from unnest(array[
      'Kumpulkan brief dari ketua panitia: logo, PDH, lanyard, kaos, sponsor',
      'Bagi tugas ke 8 anggota, lalu cek beban tiap orang',
      'Tetapkan deadline tiap desain, sisakan ruang untuk revisi',
      'Review link yang masuk tiap hari, balas revisi maksimal 1x24 jam',
      'Koordinasi vendor PDH: ukuran, bahan, harga, tenggat produksi',
      'Koordinasi vendor lanyard dan kaos, minta sampel sebelum cetak',
      'Kumpulkan foto angkatan dan foto kelas untuk feed IG',
      'Susun jadwal posting feed IG mulai dari Coming Soon',
      'Cek kelengkapan aset sponsor: videotron, paid promote, tenant, banner',
      'Minta approval akhir ke ketua panitia sebelum naik cetak',
      'Rekap progres mingguan ke ketua panitia',
      'Arsipkan semua file final di satu folder Drive'
    ]) with ordinality as x(j, o);
end $$;
