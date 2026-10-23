-- DULCES 3.7 | DAR PERMISO A UNA PERSONA RESPONSABLE
-- 1. Supabase > Authentication > Users: verificá que exista su propia cuenta.
-- 2. Reemplazá el correo de EJEMPLO por el correo exacto de esa persona.
-- 3. Ejecutá el bloque en SQL Editor, como propietario del proyecto.
-- Nunca pongas una contraseña ni una secret/service_role key aquí.
-- Esta operación NO desactiva RLS, ni cambia datos de la tienda.

do $$
declare
  correo_responsable text := 'REEMPLAZAR-POR-EL-CORREO@EJEMPLO.COM';
  uuid_responsable uuid;
begin
  if correo_responsable = 'REEMPLAZAR-POR-EL-CORREO@EJEMPLO.COM' then
    raise exception 'Reemplazá correo_responsable por el correo real de la persona responsable.';
  end if;
  select id into uuid_responsable
  from auth.users
  where lower(email) = lower(trim(correo_responsable))
  limit 1;
  if uuid_responsable is null then
    raise exception 'Ese correo aún no existe en Authentication > Users. Creá la cuenta primero.';
  end if;
  insert into public.admins(user_id) values (uuid_responsable)
  on conflict (user_id) do nothing;
  raise notice 'Cuenta administradora autorizada. La persona debe iniciar sesión con su propio correo.';
end $$;
