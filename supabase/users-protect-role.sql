-- Tutup celah: user biasa tidak boleh menjadikan dirinya (atau siapa pun) admin.
-- Sudah dijalankan di project synnnw-react lewat migration "users_protect_role".
-- Hanya admin sah (is_admin()) atau akses tanpa sesi login (SQL Editor / service role) yang boleh mengubah role.
create or replace function public.users_protect_role()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role is distinct from 'client' then
      raise exception 'Role tidak boleh ditentukan sendiri';
    end if;
  elsif new.role is distinct from old.role then
    raise exception 'Role tidak boleh diubah';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_users_protect_role on public.users;
create trigger trg_users_protect_role
  before insert or update on public.users
  for each row execute function public.users_protect_role();

-- Update milik sendiri: baris hasil update juga harus tetap milik sendiri (id tidak boleh dipindah)
alter policy "users update own" on public.users
  using (auth.uid() = id)
  with check (auth.uid() = id);
