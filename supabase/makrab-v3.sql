-- MAKRAB 2026 v3: struktur resmi dari dokumen kepanitiaan (nama lengkap, PIC, sub-sie, target anggota).
-- Sudah dijalankan lewat migration "makrab_v3_struktur_resmi". Aditif, aman diulang.
alter table public.makrab_divisions
  add column if not exists pic_id uuid references public.makrab_members(id) on delete set null,
  add column if not exists sub_sie text[] not null default '{}',
  add column if not exists target_anggota integer check (target_anggota is null or target_anggota between 0 and 200);
alter table public.makrab_members
  add column if not exists nama_lengkap text check (nama_lengkap is null or length(nama_lengkap) <= 120),
  add column if not exists sub_sie text check (sub_sie is null or length(sub_sie) <= 80);
update public.makrab_divisions set nama = 'Sie Konsumsi' where kode = 'konsum';
update public.makrab_divisions d set sub_sie = v.sub, target_anggota = v.tgt
  from (values
    ('acara', array['Tim Kreatif','Stage Manager','Fun Games'], 10), ('perkap', array['Sie Logistik'], 8),
    ('pdd', array['Multimedia','Sosial Media'], 8), ('humas', array['Sie Sponsorship'], 8),
    ('konsum', array['Sie Kesehatan'], 5), ('kamizin', array['Sie Korlap'], 15)
  ) as v(kode, sub, tgt) where d.kode = v.kode;
update public.makrab_members set nama = 'Lailatul Janah' where jabatan = 'Koordinator Sie Konsum' and nama = 'Menyusul';
-- (nama lengkap & PIC: lihat migration; PIC = April: Acara+PDD, Daffa: Perkap+Kamizin, Geri: Humas, Fitri: Konsumsi)
