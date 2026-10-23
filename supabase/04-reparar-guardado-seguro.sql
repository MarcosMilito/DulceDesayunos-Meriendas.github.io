-- DULCES 3.7 | REPARAR PERMISOS DE GUARDADO SIN ABRIR LA BASE AL PÚBLICO
-- Ejecutar UNA VEZ (se puede volver a ejecutar) en Supabase > SQL Editor,
-- dentro del MISMO proyecto que usa config.js.
-- NO borra productos, pedidos ni fotos.
-- Cada cuenta autorizada debe estar registrada en public.admins (ver archivo 05).

begin;

-- Registrar las filas base sin reemplazar datos existentes.
insert into public.public_data(id, payload)
values ('store', '{}'::jsonb)
on conflict (id) do nothing;
insert into public.private_data(id, payload)
values ('store', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.admins enable row level security;
alter table public.public_data enable row level security;
alter table public.private_data enable row level security;

grant usage on schema public to anon, authenticated;

-- La tabla admins es exclusivamente una lista de cuentas autorizadas.
-- Los visitantes no pueden leerla ni asignarse el rol a sí mismos.
revoke all privileges on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;
drop policy if exists "admins can view own role" on public.admins;
create policy "admins can view own role" on public.admins
 for select to authenticated using (user_id = (select auth.uid()));

-- Catálogo público: todo visitante puede leer, solamente administradores guardar.
revoke all privileges on table public.public_data from anon, authenticated;
grant select on table public.public_data to anon, authenticated;
grant insert, update on table public.public_data to authenticated;
drop policy if exists "everyone reads catalog" on public.public_data;
create policy "everyone reads catalog" on public.public_data
 for select to anon, authenticated using (true);
drop policy if exists "admins edit catalog" on public.public_data;
create policy "admins edit catalog" on public.public_data
 for update to authenticated
 using (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
 with check (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
drop policy if exists "admins insert catalog" on public.public_data;
create policy "admins insert catalog" on public.public_data
 for insert to authenticated
 with check (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));

-- Costos y recetas privados: jamás visibles para clientes anónimos.
revoke all privileges on table public.private_data from anon, authenticated;
grant select, insert, update on table public.private_data to authenticated;
drop policy if exists "admins read finances" on public.private_data;
create policy "admins read finances" on public.private_data
 for select to authenticated using (
   exists(select 1 from public.admins a where a.user_id=(select auth.uid()))
 );
drop policy if exists "admins edit finances" on public.private_data;
create policy "admins edit finances" on public.private_data
 for update to authenticated
 using (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
 with check (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
drop policy if exists "admins insert finances" on public.private_data;
create policy "admins insert finances" on public.private_data
 for insert to authenticated
 with check (id='store' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));

-- Fotos. La tienda puede LEER las imágenes del bucket público, pero solamente
-- administradores registrados pueden SUBIR o MODIFICAR archivos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp']::text[])
on conflict (id) do update set public=true, file_size_limit=excluded.file_size_limit,
 allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
 for insert to authenticated with check (
   bucket_id='product-images'
   and exists(select 1 from public.admins a where a.user_id=(select auth.uid()))
 );
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
 for update to authenticated
 using (bucket_id='product-images' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())))
 with check (bucket_id='product-images' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
drop policy if exists "admin read image metadata" on storage.objects;
create policy "admin read image metadata" on storage.objects
 for select to authenticated using (
   bucket_id='product-images'
   and exists(select 1 from public.admins a where a.user_id=(select auth.uid()))
 );

-- No tocamos pedidos existentes ni creamos pedidos nuevos desde administración.
-- Su control de pago/eliminación se sigue manejando con SQL 02 y 03.

commit;
