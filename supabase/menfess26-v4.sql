-- ══════════════════════════════════════════════════════════════════════════════
-- 26Menfess — Patch v4 (idempotent; jalankan SETELAH menfess26.sql, v2, v3)
-- Isi: tema Putih/Hitam/Krem, font kartu, warna teks (hitam/putih/merah/otomatis),
--      rata paragraf (kiri/tengah/kanan/rata), spasi baris, edit kartu oleh admin.
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Tema baru ---------------------------------------------------------------
alter table public.menfess_posts drop constraint if exists menfess_posts_design_check;
alter table public.menfess_posts
  add constraint menfess_posts_design_check
  check (design in ('pink','green','picnic','white','black','cream'));

-- 2. Warna teks: tambah 'auto' (ikut tema) dan 'red' -----------------------------
alter table public.menfess_posts drop constraint if exists menfess_posts_text_color_check;
alter table public.menfess_posts
  add constraint menfess_posts_text_color_check
  check (text_color in ('auto','dark','white','red'));
alter table public.menfess_posts alter column text_color set default 'auto';

-- 3. Rata paragraf: default kanan, tambah right & justify -----------------------
alter table public.menfess_posts drop constraint if exists menfess_posts_align_check;
alter table public.menfess_posts
  add constraint menfess_posts_align_check
  check (align in ('center','left','right','justify'));
alter table public.menfess_posts alter column align set default 'right';

-- 4. Kolom baru: font & spasi baris ---------------------------------------------
alter table public.menfess_posts
  add column if not exists font       text not null default 'nunito',
  add column if not exists line_space text not null default 'normal';
alter table public.menfess_posts drop constraint if exists menfess_posts_font_check;
alter table public.menfess_posts
  add constraint menfess_posts_font_check
  check (font in ('nunito','poppins','playfair','lora','mono','bebas','pacifico','patrick','caveat'));
alter table public.menfess_posts drop constraint if exists menfess_posts_line_space_check;
alter table public.menfess_posts
  add constraint menfess_posts_line_space_check
  check (line_space in ('tight','normal','loose'));

-- 5. Trigger insert: align dari user TIDAK lagi dipaksa 'center' ----------------
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

  if new.source = 'user' then
    new.status     := 'pending';
    new.source     := 'user';
    new.admin_note := null;
    new.decided_by := null;
    new.decided_at := null;
    new.posted_at  := null;
    new.title      := null;      -- user tidak bisa set title

    if not v_settings.accepting then
      raise exception 'Pengiriman menfess sedang ditutup. %', coalesce(v_settings.closed_message,'');
    end if;

    new.body := btrim(new.body);
    if new.body = '' then raise exception 'Isi menfess tidak boleh kosong'; end if;

    select count(*) into v_count
    from public.menfess_posts
    where user_id = new.user_id
      and created_at > now() - interval '24 hours'
      and status not in ('withdrawn');
    if v_count >= v_settings.daily_limit then
      raise exception 'Batas harian % menfess tercapai.', v_settings.daily_limit;
    end if;

    select max(created_at) into v_last
    from public.menfess_posts
    where user_id = new.user_id;
    if v_last is not null and extract(epoch from (now() - v_last)) < v_settings.cooldown_seconds then
      raise exception 'Tunggu % detik sebelum kirim lagi.', v_settings.cooldown_seconds;
    end if;
  end if;

  if new.source = 'user' then
    new.user_id := auth.uid();
  end if;

  return new;
end;
$$;

-- 6. View client (tambah font & line_space di akhir) -----------------------------
create or replace view public.menfess_my_posts as
  select id, user_id, to_label, from_alias, category, song, song_title, song_artist,
         song_artwork_url, song_preview_url, song_url, song_source,
         body, design, text_size, text_color, align, title, source, status,
         reject_reason, public_note, ig_url, posted_at, rules_version,
         decided_at, created_at, updated_at,
         font, line_space
  from public.menfess_posts
  where user_id = auth.uid();

-- 7. Feed publik (return type berubah → drop dulu) --------------------------------
drop function if exists public.menfess_public_feed(int, timestamptz);
create or replace function public.menfess_public_feed(
  p_limit int default 12,
  p_before timestamptz default null
)
returns table (
  id uuid, to_label text, from_alias text, category text,
  body text, design text, text_size text, text_color text, align text, title text,
  song_title text, song_artist text, song_artwork_url text, song_preview_url text, song_url text,
  ig_url text, posted_at timestamptz, font text, line_space text
)
language sql security definer
set search_path = ''
as $$
  select id, to_label, from_alias, category,
         body, design, text_size, text_color, align, title,
         song_title, song_artist, song_artwork_url, song_preview_url, song_url,
         ig_url, posted_at, font, line_space
  from public.menfess_posts
  where status = 'posted'
    and (p_before is null or posted_at < p_before)
  order by posted_at desc
  limit least(p_limit, 30);
$$;
grant execute on function public.menfess_public_feed to anon, authenticated;

-- 8. Admin: edit isi teks + gaya kartu ------------------------------------------
create or replace function public.menfess_admin_edit(
  p_id         uuid,
  p_body       text,
  p_design     text,
  p_text_size  text,
  p_text_color text,
  p_font       text,
  p_align      text,
  p_line_space text
)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if not public.menfess_is_admin() then raise exception 'Unauthorized'; end if;
  if p_body is null or length(btrim(p_body)) not between 1 and 400 then
    raise exception 'Isi harus 1-400 karakter';
  end if;
  update public.menfess_posts set
    body       = btrim(p_body),
    design     = coalesce(p_design,     design),
    text_size  = coalesce(p_text_size,  text_size),
    text_color = coalesce(p_text_color, text_color),
    font       = coalesce(p_font,       font),
    align      = coalesce(p_align,      align),
    line_space = coalesce(p_line_space, line_space),
    updated_at = now()
  where id = p_id;
  insert into public.menfess_events(post_id, actor_email, action, note)
  values (p_id, lower(coalesce(auth.jwt()->>'email','')), 'admin_edit',
    format('design=%s font=%s color=%s align=%s', p_design, p_font, p_text_color, p_align));
end;
$$;
grant execute on function public.menfess_admin_edit to authenticated;
