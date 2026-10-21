-- DULCES 2.5 — PEDIDOS EN SUPABASE
-- Ejecutar DESPUÉS de 01-crear-base.sql en Supabase > SQL Editor.
-- No modifica ni elimina productos, administradores, ventas previas ni precios.
-- ATENCIÓN: el navegador puede registrar una solicitud aunque el cliente no termine
-- de enviar el mensaje por WhatsApp. Los importes son informativos y NO se consideran
-- pagos comprobados hasta que el administrador los marque como pagados.

create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) between 6 and 35),
  delivery_address text not null check (char_length(delivery_address) between 3 and 180),
  locality text not null check (char_length(locality) between 2 and 90),
  items jsonb not null check (jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 100),
  subtotal numeric(12,2) not null check(subtotal>=0 and subtotal<100000000),
  shipping numeric(12,2) check(shipping is null or (shipping>=0 and shipping<100000000)),
  total numeric(12,2) check(total is null or (total>=0 and total<100000000)),
  dedication text not null default '' check(char_length(dedication)<=600),
  dedication_notes text not null default '' check(char_length(dedication_notes)<=450),
  source text not null default 'web' check(source in ('web','manual')),
  payment_status text not null default 'pendiente' check(payment_status in ('pendiente','pagado'))
);

create index if not exists customer_orders_created_at_idx on public.customer_orders(created_at desc);
create index if not exists customer_orders_payment_idx on public.customer_orders(payment_status);

alter table public.customer_orders enable row level security;

-- Permisos explícitos: público solo puede crear solicitudes, no leer ninguna
-- solicitud (incluyendo la propia) ni marcarla pagada.
revoke all on table public.customer_orders from anon, authenticated;
grant insert (id, customer_name, customer_phone, delivery_address, locality,
  items, subtotal, shipping, total, dedication, dedication_notes, source,
  payment_status) on public.customer_orders to anon, authenticated;
grant select on public.customer_orders to authenticated;
grant update (payment_status) on public.customer_orders to authenticated;

-- Pueden existir llamadas anónimas con un payload manipulado; limitamos el alta
-- a estado pendiente y origen web. Los totales y productos requieren verificación
-- humana antes de confirmar/cobrar.
drop policy if exists "customer creates pending request" on public.customer_orders;
create policy "customer creates pending request" on public.customer_orders
for insert to anon with check (source='web' and payment_status='pendiente');

drop policy if exists "admin creates manual request" on public.customer_orders;
create policy "admin creates manual request" on public.customer_orders
for insert to authenticated with check (
  payment_status='pendiente' and
  exists (select 1 from public.admins a where a.user_id=(select auth.uid()))
);

drop policy if exists "admin reads customer orders" on public.customer_orders;
create policy "admin reads customer orders" on public.customer_orders
for select to authenticated using (
  exists (select 1 from public.admins a where a.user_id=(select auth.uid()))
);

drop policy if exists "admin updates payment status" on public.customer_orders;
create policy "admin updates payment status" on public.customer_orders
for update to authenticated
using (exists (select 1 from public.admins a where a.user_id=(select auth.uid())))
with check (exists (select 1 from public.admins a where a.user_id=(select auth.uid())));

-- IMPORTANTE: estos permisos NO protegen contra spam de formularios anónimos.
-- Si el volumen crece, incorporar CAPTCHA y limitación de solicitudes en servidor.
