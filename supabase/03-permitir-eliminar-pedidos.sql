-- DULCES 3.0. Ejecutar DESPUÉS de supabase/02-pedidos.sql.
-- No borra datos ni modifica pedidos previos. Habilita ELIMINAR solamente a administradores autenticados.
grant delete on table public.customer_orders to authenticated;
drop policy if exists "admin deletes customer orders" on public.customer_orders;
create policy "admin deletes customer orders" on public.customer_orders
for delete to authenticated using (
 exists (select 1 from public.admins a where a.user_id=(select auth.uid()))
);
-- Los clientes anónimos NO pueden borrar ni leer pedidos.
revoke delete on table public.customer_orders from anon;
