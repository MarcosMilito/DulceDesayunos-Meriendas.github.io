# DULCE 2.0 — Reconstrucción total

Tienda responsive de Dulce Desayunos y Meriendas + panel administrativo.

- `index.html`: la tienda visible para los clientes.
- `admin.html`: administrador (no aparece enlazado desde la tienda).
- `assets/styles.css`: diseño de ambas interfaces.
- `assets/site.js`: catálogo, carrito, personalización y pedido por WhatsApp.
- `assets/admin.js`: gestión de productos, costos, ingredientes, promociones, novedades, ventas, envíos y negocio.
- `assets/data.js`: datos iniciales y sincronización.
- `assets/img/`: seis fotografías originales aportadas por el negocio.
- `config.js`: credenciales PÚBLICAS de Supabase (vacío = modo local de demostración).
- `supabase/01-crear-base.sql`: esquema y seguridad RLS para sincronización real.
- `GUIA-INSTALACION.md`: instrucciones sencillas y completas para uso y publicación.

**Precios:** Picada $26.000; Ricota $25.000; Clásico $22.000; Matero $20.000; Chocotorta $24.000; Premium $30.000.

**Empezar:** subí la carpeta al hosting estático o probá con `python -m http.server 8000`. Consultá `GUIA-INSTALACION.md` antes de poner el sitio en producción.
