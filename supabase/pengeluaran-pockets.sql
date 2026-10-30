-- ════════════════════════════════════════════════════════════════════
-- Pengeluaran → kartu-kantong (pockets).  ADDITIVE ONLY, aman dijalankan ulang.
--
-- SEBELUM menjalankan:  select count(*) from public.pengeluaran;   -- catat angkanya
-- SESUDAH menjalankan:  select count(*) from public.pengeluaran;   -- harus SAMA
--
-- Tidak ada DROP / TRUNCATE / DELETE / UPDATE ke baris lama.
-- Baris lama di `pengeluaran` dapat pocket_id = NULL → tampil di kartu "Umum".
-- Tidak menyentuh tabel makrab_* atau `settings`.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.pengeluaran_pockets (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  color       text not null default '#D7FF3A',
  icon        text,
  sort_order  int  not null default 0,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Top-up / penyesuaian saldo. pocket_id NULL = kartu "Umum".
create table if not exists public.pengeluaran_ledger (
  id          uuid primary key default gen_random_uuid(),
  pocket_id   uuid references public.pengeluaran_pockets(id),
  amount      bigint not null,   -- boleh negatif (penyesuaian turun)
  note        text,
  created_at  timestamptz not null default now()
);

-- Kolom baru, nullable, tidak mengubah baris lama.
alter table public.pengeluaran
  add column if not exists pocket_id uuid references public.pengeluaran_pockets(id);

create index if not exists pengeluaran_pocket_id_idx on public.pengeluaran (pocket_id);
create index if not exists pengeluaran_ledger_pocket_id_idx on public.pengeluaran_ledger (pocket_id);

-- RLS: sama seperti tabel `pengeluaran` (hanya admin).
alter table public.pengeluaran_pockets enable row level security;
alter table public.pengeluaran_ledger  enable row level security;

drop policy if exists "pengeluaran_pockets admin all" on public.pengeluaran_pockets;
create policy "pengeluaran_pockets admin all" on public.pengeluaran_pockets
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pengeluaran_ledger admin all" on public.pengeluaran_ledger;
create policy "pengeluaran_ledger admin all" on public.pengeluaran_ledger
  for all using (public.is_admin()) with check (public.is_admin());
