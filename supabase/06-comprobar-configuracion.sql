-- DULCES 3.7 | DIAGNÓSTICO SEGURO. Ejecutar desde Supabase > SQL Editor.
-- No modifica nada. Revisá los resultados desde el panel de Supabase.
select 'Catálogo público' as ubicacion, exists(select 1 from public.public_data where id='store') as fila_lista
union all
select 'Costos privados', exists(select 1 from public.private_data where id='store')
union all
select 'Fotos', exists(select 1 from storage.buckets where id='product-images');

select u.email, (a.user_id is not null) as tiene_permiso_administrador
from auth.users u
left join public.admins a on a.user_id=u.id
order by u.email;
-- Por privacidad, no publiques capturas con correos ajenos o identificadores.
