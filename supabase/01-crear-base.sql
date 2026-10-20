-- DULCE 2.0: Ejecutar una sola vez en Supabase > SQL Editor.
-- No pongas contraseñas ni claves secretas en el sitio web.
-- Las ventas y costos se guardan en una tabla privada con RLS.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.public_data (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.private_data (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.public_data(id,payload) values ('store','{}'::jsonb) on conflict(id) do nothing;
insert into public.private_data(id,payload) values ('store','{}'::jsonb) on conflict(id) do nothing;

alter table public.admins enable row level security;
alter table public.public_data enable row level security;
alter table public.private_data enable row level security;

-- Volver a ejecutar el archivo no duplica políticas.
drop policy if exists "admins can view own role" on public.admins;
create policy "admins can view own role" on public.admins for select to authenticated using(user_id = (select auth.uid()));

drop policy if exists "everyone reads catalog" on public.public_data;
create policy "everyone reads catalog" on public.public_data for select to anon, authenticated using(true);
drop policy if exists "admins edit catalog" on public.public_data;
create policy "admins edit catalog" on public.public_data for update to authenticated
using(exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
with check(exists(select 1 from public.admins a where a.user_id=(select auth.uid())));

drop policy if exists "admins read finances" on public.private_data;
create policy "admins read finances" on public.private_data for select to authenticated
using(exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
drop policy if exists "admins edit finances" on public.private_data;
create policy "admins edit finances" on public.private_data for update to authenticated
using(exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
with check(exists(select 1 from public.admins a where a.user_id=(select auth.uid())));

-- Imágenes que suba el administrador.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp']::text[])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects for insert to authenticated
with check(bucket_id='product-images' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects for update to authenticated
using(bucket_id='product-images' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
with check(bucket_id='product-images' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));

-- IMPORTANTE: Luego de crear el usuario en Authentication > Users, ejecutá:
-- insert into public.admins(user_id) values ('AQUI_EL_UUID_DEL_USUARIO');
-- No hay política de inserción para usuarios: solo el dueño lo hace desde SQL Editor.
