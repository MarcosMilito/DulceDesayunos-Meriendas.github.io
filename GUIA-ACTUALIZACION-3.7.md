# Dulces 3.7 · Guardado seguro desde cualquier computadora

Esta actualización corrige el error `new row violates row-level security policy` y mejora la confirmación de los cambios realizados desde el administrador.

## Importante: dos pasos, uno en Supabase y otro en GitHub

**Primero, en Supabase (solo la persona propietaria del proyecto):**

1. Entrar al mismo proyecto de Supabase configurado en `config.js`.
2. En **SQL Editor → New query**, copiar el contenido de `supabase/04-reparar-guardado-seguro.sql` y ejecutar **Run**. Este archivo crea permisos seguros para edición y subida de fotos. No borra datos.
3. Ir a **Authentication → Users** y comprobar que la persona responsable tenga su propia cuenta y contraseña. Si no está, crearla e indicarle cómo activar el correo.
4. Si esa persona aún no está registrada como administradora, abrir `supabase/05-autorizar-responsable.sql`, reemplazar el correo de ejemplo por el correo real y ejecutarlo en **SQL Editor**. **La persona no debe recibir una clave de Supabase; ingresa con su propio usuario y contraseña.**
5. Opcionalmente, ejecutar `supabase/06-comprobar-configuracion.sql` para verificar que estén las filas iniciales, el bucket y los usuarios autorizados.

**Después, en GitHub:**

1. Hacer una copia del repositorio o crear un commit de respaldo.
2. Subir los cinco archivos incluidos en el paquete **solo modificados**, conservando las carpetas:
   - `index.html`
   - `admin.html`
   - `assets/site.js`
   - `assets/admin.js`
   - `assets/data.js`
3. **No reemplazar el `config.js` actual.** No usar la `secret key` ni `service_role` en la web.
4. Esperar a que Vercel termine el nuevo deploy y volver a cargar el administrador.

## Prueba simple

- La persona responsable abre `https://dulcedesayunosmeriendas.vercel.app/admin.html` desde su computadora e inicia sesión **con su propia cuenta**.
- Cambia una descripción de un producto y pulsa **Guardar**. Debe aparecer una confirmación.
- Abre la tienda desde otro dispositivo o pestaña nueva y recarga: el cambio debe verse.
- Prueba guardar una materia prima, un envío y una promoción, y subir una foto pequeña JPG/PNG.
- En **Pedidos**, cambia el estado de pago de un pedido de prueba; el cambio se comprueba al recargar.

## Si algo todavía falla

- Verificar primero que el SQL 04 se ejecutó **sin errores** en el Supabase correcto.
- Confirmar con SQL 06 que el correo de la persona figura con `tiene_permiso_administrador = true`.
- Si aparece un error al subir fotos, revisar que el bucket de Storage sea `product-images` y que la imagen sea JPG/PNG/WebP de menos de 5 MB.
- Si **Pedidos** sigue teniendo errores, verificar si los SQL `02-pedidos.sql` y `03-permitir-eliminar-pedidos.sql` se ejecutaron correctamente: esas reglas se mantienen separadas.
- Si la sesión se venció, salir del administrador e ingresar nuevamente.

## Seguridad y límites

- No desactivar Row Level Security, no crear una política con `using (true)` para edición y **nunca exponer claves secretas**.
- Cada cuenta autorizada puede entrar desde cualquier computadora con navegador e internet. Los cambios se guardan en Supabase y se ven en otros dispositivos al recargar la página.
- **No se pudo realizar una prueba con tu proyecto real** porque no contamos con acceso administrativo a su Supabase. Se validó el flujo de código localmente, pero el paso SQL debe completarse en el proyecto real.
- El catálogo y los costos usan documentos JSON compartidos. Si dos administradores editan exactamente al mismo tiempo, el último guardado puede reemplazar cambios anteriores; recomendamos coordinar ediciones simultáneas hasta migrar a registros independientes.
