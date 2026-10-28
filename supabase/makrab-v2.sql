-- ════════════════════════════════════════════════════════════════
--  MAKRAB 2026 — v2: banyak divisi, banyak admin, koordinator, pengeluaran
--  ADITIF: tidak ada data yang dihapus. Tugas, anggota, dan to-do yang sudah
--  ada tetap ada; yang baru hanya kolom, tabel, dan aturan akses.
--  Jalankan SETELAH makrab.sql. Aman dijalankan ulang.
-- ════════════════════════════════════════════════════════════════

-- ─── 1. DIVISI ───────────────────────────────────────────────────
create table if not exists public.makrab_divisions (
  id         uuid primary key default gen_random_uuid(),
  kode       text not null unique check (kode ~ '^[a-z0-9-]+$'),
  nama       text not null check (length(nama) between 1 and 80),
  jenis      text not null check (jenis in ('bph', 'sie')),
  urutan     integer not null default 0,
  budget     bigint not null default 0 check (budget >= 0 and budget <= 100000000000),
  created_at timestamptz not null default now()
);

insert into public.makrab_divisions (kode, nama, jenis, urutan) values
  ('bph',    'BPH',       'bph', 0),
  ('acara',  'Sie Acara',  'sie', 1),
  ('perkap', 'Sie Perkap', 'sie', 2),
  ('pdd',    'Sie PDD',    'sie', 3),
  ('humas',  'Sie Humas',  'sie', 4),
  ('konsum', 'Sie Konsum', 'sie', 5),
  ('kamizin','Sie Kamizin','sie', 6)
on conflict (kode) do nothing;

-- ─── 2. KOLOM BARU (anggota & tugas) ─────────────────────────────
alter table public.makrab_members
  add column if not exists division_id   uuid references public.makrab_divisions(id) on delete set null,
  add column if not exists peran         text not null default 'anggota',
  add column if not exists jabatan       text,
  add column if not exists izin_anggota  boolean not null default false;

-- email boleh kosong: slot struktur yang emailnya menyusul (diisi ketupel)
alter table public.makrab_members alter column email drop not null;
drop index if exists public.makrab_members_email_key;
create unique index if not exists makrab_members_email_key on public.makrab_members (email) where email is not null;

update public.makrab_members set peran = 'admin' where is_admin and peran <> 'admin';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'makrab_members_peran_chk') then
    alter table public.makrab_members add constraint makrab_members_peran_chk check (peran in ('admin', 'koordinator', 'anggota'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'makrab_members_jabatan_chk') then
    alter table public.makrab_members add constraint makrab_members_jabatan_chk check (jabatan is null or length(jabatan) <= 80);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'makrab_members_admin_sync') then
    alter table public.makrab_members add constraint makrab_members_admin_sync check (is_admin = (peran = 'admin'));
  end if;
end $$;

alter table public.makrab_tasks
  add column if not exists division_id uuid references public.makrab_divisions(id) on delete set null;
create index if not exists makrab_tasks_division_idx on public.makrab_tasks (division_id);

-- Data lama: semua tugas makrab yang sudah ada adalah milik Sie PDD
update public.makrab_tasks
   set division_id = (select id from public.makrab_divisions where kode = 'pdd')
 where kategori = 'makrab' and division_id is null;

-- To-do admin lama yang belum punya pemilik → milik Aldo
update public.makrab_tasks
   set dibuat_oleh = (select id from public.makrab_members where email = 'aldokraksaan@gmail.com')
 where kategori = 'admin' and dibuat_oleh is null;

-- ─── 3. PENGELUARAN ──────────────────────────────────────────────
create table if not exists public.makrab_expenses (
  id             uuid primary key default gen_random_uuid(),
  division_id    uuid not null references public.makrab_divisions(id) on delete restrict,
  tanggal        date not null default current_date,
  keterangan     text not null check (length(keterangan) between 1 and 300),
  jumlah         bigint not null check (jumlah > 0 and jumlah <= 1000000000),
  nota_path      text not null check (length(nota_path) between 5 and 300),
  nota_drive_url text check (nota_drive_url is null or nota_drive_url ~* '^https://'),
  status         text not null default 'menunggu' check (status in ('menunggu', 'disetujui', 'ditolak')),
  catatan        text check (catatan is null or length(catatan) <= 1000),
  dibuat_oleh    uuid references public.makrab_members(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists makrab_expenses_division_idx on public.makrab_expenses (division_id, tanggal desc);

-- ─── 4. FUNGSI PERAN ─────────────────────────────────────────────
create or replace function public.makrab_my_division()
returns uuid language sql stable security definer set search_path = '' as $$
  select m.division_id from public.makrab_members m where m.id = public.makrab_member_id();
$$;

create or replace function public.makrab_is_koord()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select m.peran = 'koordinator' from public.makrab_members m where m.id = public.makrab_member_id()), false);
$$;

create or replace function public.makrab_can_manage_division(did uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select did is not null and (public.makrab_is_admin() or (public.makrab_is_koord() and public.makrab_my_division() = did));
$$;

create or replace function public.makrab_can_see_division(did uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select did is not null and (public.makrab_is_admin() or (public.makrab_member_id() is not null and public.makrab_my_division() = did));
$$;

-- koordinator boleh mengurus anggota divisinya hanya kalau diberi izin
create or replace function public.makrab_can_manage_members(did uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select did is not null and (
    public.makrab_is_admin()
    or (public.makrab_is_koord() and public.makrab_my_division() = did
        and coalesce((select m.izin_anggota from public.makrab_members m where m.id = public.makrab_member_id()), false))
  );
$$;

-- Boleh lihat tugas? To-do admin = privat (hanya pembuatnya).
create or replace function public.makrab_can_see_task(tid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.makrab_tasks t
    where t.id = tid and (
      case when t.kategori = 'admin' then t.dibuat_oleh = public.makrab_member_id()
      else (
        public.makrab_is_admin()
        or (t.division_id is not null and public.makrab_is_koord() and t.division_id = public.makrab_my_division())
        or (
          public.makrab_member_id() is not null
          and (t.kelas is null or t.kelas = public.makrab_member_kelas())
          and (
            (t.kategori = 'kuliah' and t.dibuat_oleh = public.makrab_member_id())
            or exists (
              select 1 from public.makrab_task_assignees a
              where a.member_id = public.makrab_member_id() and (a.task_id = t.id or a.task_id = t.parent_id)
            )
          )
        )
      ) end
    )
  );
$$;

-- Boleh mengelola tugas (ubah, hapus, tugaskan, review link)?
create or replace function public.makrab_manages_task(tid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.makrab_tasks t
    where t.id = tid and t.kategori <> 'admin'
      and (public.makrab_is_admin() or (t.division_id is not null and public.makrab_is_koord() and t.division_id = public.makrab_my_division()))
  );
$$;

create or replace function public.makrab_manages_submission(sid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.makrab_submissions s where s.id = sid and public.makrab_manages_task(s.task_id));
$$;

-- Penugasan: admin ke siapa saja; koordinator hanya ke anggota divisinya sendiri
create or replace function public.makrab_can_assign(tid uuid, mid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.makrab_tasks t
    where t.id = tid and t.kategori <> 'admin' and (
      public.makrab_is_admin()
      or (t.division_id is not null and public.makrab_is_koord() and t.division_id = public.makrab_my_division()
          and exists (select 1 from public.makrab_members m where m.id = mid and m.division_id = t.division_id))
    )
  );
$$;

-- Daftar nama (tanpa email) untuk menampilkan nama pembuat komentar, dsb.
drop function if exists public.makrab_roster();
create function public.makrab_roster()
returns table (id uuid, nama text, kelas text, is_admin boolean, peran text, jabatan text, division_id uuid)
language sql stable security definer set search_path = '' as $$
  select m.id, m.nama, m.kelas, m.is_admin, m.peran, m.jabatan, m.division_id
  from public.makrab_members m
  where public.makrab_member_id() is not null or public.makrab_is_admin();
$$;

-- ─── 5. TRIGGER ──────────────────────────────────────────────────

create or replace function public.makrab_members_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op in ('INSERT', 'UPDATE') then
    new.is_admin := (new.peran = 'admin');
    new.email := nullif(lower(btrim(new.email)), '');
    if auth.uid() is not null and not public.makrab_is_admin() then
      if tg_op = 'INSERT' then
        new.peran := 'anggota'; new.is_admin := false; new.izin_anggota := false;
      elsif new.peran is distinct from old.peran
         or new.division_id is distinct from old.division_id
         or new.izin_anggota is distinct from old.izin_anggota then
        raise exception 'Hanya admin yang boleh mengubah peran, divisi, atau izin';
      end if;
    end if;
  end if;

  -- jangan sampai tidak ada admin sama sekali
  if (tg_op = 'DELETE' and old.peran = 'admin')
     or (tg_op = 'UPDATE' and old.peran = 'admin' and new.peran <> 'admin') then
    if not exists (select 1 from public.makrab_members m where m.peran = 'admin' and m.id <> old.id) then
      raise exception 'Tidak boleh menghapus atau menurunkan admin terakhir';
    end if;
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists makrab_members_guard_trg on public.makrab_members;
create trigger makrab_members_guard_trg
  before insert or update or delete on public.makrab_members
  for each row execute function public.makrab_members_guard();

create or replace function public.makrab_tasks_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  me    uuid := public.makrab_member_id();
  mydiv uuid := public.makrab_my_division();
begin
  if auth.uid() is null then return new; end if;

  if tg_op = 'INSERT' then
    if new.kategori = 'admin' then          -- to-do privat
      new.dibuat_oleh := me; new.division_id := null; new.parent_id := null; new.kelas := null; new.matkul := null;
      return new;
    end if;
    if public.makrab_is_admin() then
      new.dibuat_oleh := coalesce(new.dibuat_oleh, me);
    elsif public.makrab_is_koord() and new.division_id is not null then
      if new.division_id is distinct from mydiv then
        raise exception 'Hanya boleh menambah tugas untuk divisimu sendiri';
      end if;
      new.dibuat_oleh := me;
    else                                    -- anggota (atau koordinator, tugas pribadi): hanya kuliah milik sendiri
      if new.kategori <> 'kuliah' then
        raise exception 'Hanya boleh menambah tugas kuliah milik sendiri';
      end if;
      new.dibuat_oleh := me; new.division_id := null; new.parent_id := null; new.kelas := null;
      return new;
    end if;
    if new.parent_id is not null and not public.makrab_is_admin() and not exists (
      select 1 from public.makrab_tasks p where p.id = new.parent_id and p.division_id is not distinct from new.division_id
    ) then
      raise exception 'Sub-tugas harus satu divisi dengan tugas induknya';
    end if;
    return new;
  end if;

  -- UPDATE
  if old.kategori = 'admin' then
    if new.kategori <> 'admin' or new.dibuat_oleh is distinct from old.dibuat_oleh then
      raise exception 'To-do privat tidak bisa dipindahkan';
    end if;
    new.division_id := null; new.parent_id := null;
    return new;
  end if;
  if new.kategori = 'admin' then
    raise exception 'Tugas tidak bisa diubah menjadi to-do privat';
  end if;
  if public.makrab_is_admin() then return new; end if;

  if public.makrab_is_koord() and old.division_id is not null and old.division_id = mydiv then
    if new.division_id is distinct from old.division_id or new.dibuat_oleh is distinct from old.dibuat_oleh then
      raise exception 'Tidak boleh memindahkan tugas ke divisi lain';
    end if;
    if new.parent_id is not null and not exists (
      select 1 from public.makrab_tasks p where p.id = new.parent_id and p.division_id is not distinct from new.division_id
    ) then
      raise exception 'Sub-tugas harus satu divisi dengan tugas induknya';
    end if;
    return new;
  end if;

  if old.kategori = 'kuliah' and old.dibuat_oleh = me then
    if new.kategori <> old.kategori
       or new.dibuat_oleh is distinct from old.dibuat_oleh
       or new.division_id is distinct from old.division_id
       or new.parent_id is distinct from old.parent_id
       or new.kelas is distinct from old.kelas then
      raise exception 'Tidak boleh mengubah kategori, pemilik, divisi, atau kelas tugas';
    end if;
    return new;
  end if;

  if new.kategori <> old.kategori
     or new.judul <> old.judul
     or new.deskripsi is distinct from old.deskripsi
     or new.matkul is distinct from old.matkul
     or new.deadline is distinct from old.deadline
     or new.dibuat_oleh is distinct from old.dibuat_oleh
     or new.division_id is distinct from old.division_id
     or new.parent_id is distinct from old.parent_id
     or new.urutan <> old.urutan
     or new.kelas is distinct from old.kelas then
    raise exception 'Kamu hanya boleh mengubah status tugas ini';
  end if;
  return new;
end;
$$;
-- (trigger makrab_tasks_guard_trg & makrab_tasks_updated_trg sudah terpasang dari makrab.sql)

create or replace function public.makrab_expenses_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return new; end if;
  if new.nota_path is null or new.nota_path not like new.division_id::text || '/%' then
    raise exception 'Foto nota wajib diunggah untuk pengeluaran ini';
  end if;
  if tg_op = 'INSERT' then
    new.dibuat_oleh := public.makrab_member_id();
    if not public.makrab_is_admin() then
      new.status := 'menunggu'; new.catatan := null; new.nota_drive_url := null;
    end if;
  elsif not public.makrab_is_admin() then
    if new.status is distinct from old.status
       or new.catatan is distinct from old.catatan
       or new.division_id is distinct from old.division_id
       or new.dibuat_oleh is distinct from old.dibuat_oleh
       or new.nota_drive_url is distinct from old.nota_drive_url then
      raise exception 'Hanya admin yang boleh mengubah status pengeluaran';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists makrab_expenses_guard_trg on public.makrab_expenses;
create trigger makrab_expenses_guard_trg
  before insert or update on public.makrab_expenses
  for each row execute function public.makrab_expenses_guard();
drop trigger if exists makrab_expenses_updated_trg on public.makrab_expenses;
create trigger makrab_expenses_updated_trg
  before update on public.makrab_expenses
  for each row execute function public.set_updated_at();

-- ─── 6. RLS: pasang ulang semua policy makrab ────────────────────
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public' and tablename like 'makrab\_%' loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

alter table public.makrab_divisions enable row level security;
alter table public.makrab_expenses  enable row level security;

-- divisi: semua anggota terdaftar boleh baca (transparansi); hanya admin yang mengubah (termasuk budget)
create policy makrab_divisions_select on public.makrab_divisions
  for select to authenticated using (public.makrab_is_admin() or public.makrab_member_id() is not null);
create policy makrab_divisions_admin on public.makrab_divisions
  for all to authenticated using (public.makrab_is_admin()) with check (public.makrab_is_admin());

-- anggota
create policy makrab_members_select on public.makrab_members
  for select to authenticated using (
    public.makrab_is_admin()
    or id = public.makrab_member_id()
    or (division_id is not null and public.makrab_is_koord() and division_id = public.makrab_my_division())
  );
create policy makrab_members_insert on public.makrab_members
  for insert to authenticated with check (
    public.makrab_is_admin()
    or (public.makrab_can_manage_members(division_id) and peran = 'anggota' and not is_admin and not izin_anggota)
  );
create policy makrab_members_update on public.makrab_members
  for update to authenticated
  using (public.makrab_is_admin() or (public.makrab_can_manage_members(division_id) and peran = 'anggota'))
  with check (public.makrab_is_admin() or (public.makrab_can_manage_members(division_id) and peran = 'anggota' and not is_admin and not izin_anggota));
create policy makrab_members_delete on public.makrab_members
  for delete to authenticated using (public.makrab_is_admin() or (public.makrab_can_manage_members(division_id) and peran = 'anggota'));

-- tugas
create policy makrab_tasks_select on public.makrab_tasks
  for select to authenticated using (
    case when kategori = 'admin' then dibuat_oleh = public.makrab_member_id()
    else (
      public.makrab_is_admin()
      or (division_id is not null and public.makrab_is_koord() and division_id = public.makrab_my_division())
      or (
        public.makrab_member_id() is not null
        and (kelas is null or kelas = public.makrab_member_kelas())
        and (
          (kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id())
          or exists (
            select 1 from public.makrab_task_assignees a
            where a.member_id = public.makrab_member_id() and (a.task_id = makrab_tasks.id or a.task_id = makrab_tasks.parent_id)
          )
        )
      )
    ) end
  );
create policy makrab_tasks_insert on public.makrab_tasks
  for insert to authenticated with check (
    case
      when kategori = 'admin' then dibuat_oleh = public.makrab_member_id() and (public.makrab_is_admin() or public.makrab_is_koord())
      when public.makrab_is_admin() then true
      when public.makrab_is_koord() and division_id is not null then division_id = public.makrab_my_division() and kategori in ('makrab', 'kuliah')
      else kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id()
    end
  );
create policy makrab_tasks_update on public.makrab_tasks
  for update to authenticated
  using (
    case when kategori = 'admin' then dibuat_oleh = public.makrab_member_id()
    else (
      public.makrab_is_admin()
      or (division_id is not null and public.makrab_is_koord() and division_id = public.makrab_my_division())
      or public.makrab_can_see_task(id)
    ) end
  )
  with check (
    case when kategori = 'admin' then dibuat_oleh = public.makrab_member_id()
    else (
      public.makrab_is_admin()
      or (division_id is not null and public.makrab_is_koord() and division_id = public.makrab_my_division())
      or public.makrab_can_see_task(id)
    ) end
  );
create policy makrab_tasks_delete on public.makrab_tasks
  for delete to authenticated using (
    case when kategori = 'admin' then dibuat_oleh = public.makrab_member_id()
    else (
      public.makrab_is_admin()
      or (division_id is not null and public.makrab_is_koord() and division_id = public.makrab_my_division())
      or (kategori = 'kuliah' and dibuat_oleh = public.makrab_member_id())
    ) end
  );

-- penugasan
create policy makrab_assignees_select on public.makrab_task_assignees
  for select to authenticated using (member_id = public.makrab_member_id() or public.makrab_can_see_task(task_id));
create policy makrab_assignees_insert on public.makrab_task_assignees
  for insert to authenticated with check (
    public.makrab_can_assign(task_id, member_id)
    or (member_id = public.makrab_member_id() and public.makrab_owns_kuliah_task(task_id))
  );
create policy makrab_assignees_delete on public.makrab_task_assignees
  for delete to authenticated using (
    public.makrab_can_assign(task_id, member_id)
    or (member_id = public.makrab_member_id() and public.makrab_owns_kuliah_task(task_id))
  );

-- komentar
create policy makrab_comments_select on public.makrab_comments
  for select to authenticated using (public.makrab_can_see_task(task_id));
create policy makrab_comments_insert on public.makrab_comments
  for insert to authenticated with check (author_id = public.makrab_member_id() and public.makrab_can_see_task(task_id));
create policy makrab_comments_delete on public.makrab_comments
  for delete to authenticated using (author_id = public.makrab_member_id() or public.makrab_manages_task(task_id));

-- link & revisi
create policy makrab_submissions_select on public.makrab_submissions
  for select to authenticated using (public.makrab_can_see_task(task_id));
create policy makrab_submissions_insert on public.makrab_submissions
  for insert to authenticated with check (author_id = public.makrab_member_id() and public.makrab_can_submit(task_id));
create policy makrab_submissions_update on public.makrab_submissions
  for update to authenticated using (public.makrab_manages_task(task_id)) with check (public.makrab_manages_task(task_id));
create policy makrab_submissions_delete on public.makrab_submissions
  for delete to authenticated using (public.makrab_manages_task(task_id));

create policy makrab_reviews_select on public.makrab_reviews
  for select to authenticated using (public.makrab_can_see_submission(submission_id));
create policy makrab_reviews_insert on public.makrab_reviews
  for insert to authenticated with check (public.makrab_manages_submission(submission_id));
create policy makrab_reviews_update on public.makrab_reviews
  for update to authenticated using (public.makrab_manages_submission(submission_id)) with check (public.makrab_manages_submission(submission_id));
create policy makrab_reviews_delete on public.makrab_reviews
  for delete to authenticated using (public.makrab_manages_submission(submission_id));

-- pengingat: milik sendiri
create policy makrab_reminders_own on public.makrab_reminders
  for all to authenticated
  using (member_id = public.makrab_member_id())
  with check (member_id = public.makrab_member_id() and public.makrab_can_see_task(task_id));

-- pengeluaran: anggota divisi boleh baca (transparan); koordinator/admin yang mencatat; admin yang menyetujui
create policy makrab_expenses_select on public.makrab_expenses
  for select to authenticated using (public.makrab_can_see_division(division_id));
create policy makrab_expenses_insert on public.makrab_expenses
  for insert to authenticated with check (public.makrab_can_manage_division(division_id));
create policy makrab_expenses_update on public.makrab_expenses
  for update to authenticated
  using (public.makrab_is_admin() or (dibuat_oleh = public.makrab_member_id() and status = 'menunggu' and public.makrab_can_manage_division(division_id)))
  with check (public.makrab_is_admin() or (dibuat_oleh = public.makrab_member_id() and public.makrab_can_manage_division(division_id)));
create policy makrab_expenses_delete on public.makrab_expenses
  for delete to authenticated
  using (public.makrab_is_admin() or (dibuat_oleh = public.makrab_member_id() and status = 'menunggu' and public.makrab_can_manage_division(division_id)));

-- ─── 7. HAK AKSES ────────────────────────────────────────────────
revoke all on public.makrab_divisions, public.makrab_expenses from anon;
grant select, insert, update, delete on public.makrab_divisions, public.makrab_expenses to authenticated;

revoke execute on function
  public.makrab_my_division(), public.makrab_is_koord(), public.makrab_can_manage_division(uuid),
  public.makrab_can_see_division(uuid), public.makrab_can_manage_members(uuid), public.makrab_manages_task(uuid),
  public.makrab_manages_submission(uuid), public.makrab_can_assign(uuid, uuid), public.makrab_roster()
  from public, anon;
grant execute on function
  public.makrab_my_division(), public.makrab_is_koord(), public.makrab_can_manage_division(uuid),
  public.makrab_can_see_division(uuid), public.makrab_can_manage_members(uuid), public.makrab_manages_task(uuid),
  public.makrab_manages_submission(uuid), public.makrab_can_assign(uuid, uuid), public.makrab_roster()
  to authenticated;

-- ─── 8. REALTIME ─────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['makrab_divisions', 'makrab_expenses'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ─── 9. STORAGE: bucket nota (privat) ────────────────────────────
-- Struktur file: <division_id>/<uuid>.<ext>. Foto nota wajib; maks 5 MB; JPG/PNG/WEBP/PDF.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('makrab-nota', 'makrab-nota', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

drop policy if exists makrab_nota_select on storage.objects;
drop policy if exists makrab_nota_insert on storage.objects;
drop policy if exists makrab_nota_delete on storage.objects;

create policy makrab_nota_select on storage.objects
  for select to authenticated using (
    bucket_id = 'makrab-nota'
    and case when (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             then public.makrab_can_see_division(((storage.foldername(name))[1])::uuid) else false end
  );
create policy makrab_nota_insert on storage.objects
  for insert to authenticated with check (
    bucket_id = 'makrab-nota'
    and case when (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             then public.makrab_can_manage_division(((storage.foldername(name))[1])::uuid) else false end
  );
create policy makrab_nota_delete on storage.objects
  for delete to authenticated using (
    bucket_id = 'makrab-nota'
    and case when (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             then public.makrab_can_manage_division(((storage.foldername(name))[1])::uuid) else false end
  );

-- ─── 10. SEED STRUKTUR PANITIA ───────────────────────────────────
-- Email yang belum ada dibiarkan kosong: ketupel (April) yang mengisinya dari halaman Anggota.
-- Mengisi email = "acc"; orangnya langsung bisa masuk.

-- Admin kedua
insert into public.makrab_members (email, nama, peran, jabatan, division_id)
select 'aprilmeijuni1904@gmail.com', 'April', 'admin', 'Ketua Pelaksana', (select id from public.makrab_divisions where kode = 'bph')
where not exists (select 1 from public.makrab_members where email = 'aprilmeijuni1904@gmail.com');

-- Anggota yang sudah ada masuk Sie PDD
update public.makrab_members
   set division_id = (select id from public.makrab_divisions where kode = 'pdd'),
       jabatan = coalesce(jabatan, case when email = 'aldokraksaan@gmail.com' then 'Koordinator Sie PDD' end)
 where division_id is null and (email = 'aldokraksaan@gmail.com' or peran = 'anggota');

-- BPH
insert into public.makrab_members (nama, peran, jabatan, division_id)
select x.nama, 'anggota', x.jabatan, (select id from public.makrab_divisions where kode = 'bph')
from (values
  ('Daffa', 'Wakil Pelaksana'), ('Geri', 'Sekretaris 1'), ('Iren Mega', 'Sekretaris 2'),
  ('Fitri', 'Bendahara 1'), ('Rini', 'Bendahara 2')
) as x(nama, jabatan)
where not exists (select 1 from public.makrab_members m where m.nama = x.nama and m.jabatan = x.jabatan);

-- Koordinator sie
insert into public.makrab_members (nama, peran, jabatan, division_id)
select x.nama, 'koordinator', x.jabatan, (select id from public.makrab_divisions where kode = x.kode)
from (values
  ('Zahra',    'Koordinator Sie Acara',   'acara'),
  ('Rifi',     'Koordinator Sie Perkap',  'perkap'),
  ('Wimba',    'Koordinator Sie Humas',   'humas'),
  ('Menyusul', 'Koordinator Sie Konsum',  'konsum'),
  ('Nopal',    'Koordinator Sie Kamizin', 'kamizin')
) as x(nama, jabatan, kode)
where not exists (select 1 from public.makrab_members m where m.jabatan = x.jabatan);

-- Aldo = koordinator Sie PDD sekaligus admin: tetap peran admin, jabatan sudah terisi di atas.
