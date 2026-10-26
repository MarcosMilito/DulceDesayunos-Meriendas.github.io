# Dulces Desayunos y Meriendas — actualización 3.8

## Qué cambia

En **Administrador > Materias primas > Editar / Nuevo componente**, configurás:

- **Stock disponible:** número entero de unidades disponibles en este momento (ej.: 8 tazas).
- **Máximo por bandeja:** número entero máximo de unidades de ese ingrediente en **un** desayuno personalizado (ej.: 2 tazas).
- **Disponible para la venta** y **Mostrar en Personalizar** siguen funcionando como antes.

Ejemplo: **8 tazas en stock, máximo 2 por bandeja**. El comprador no puede superar 2 en un desayuno, ni colocar más de 8 sumando sus bandejas personalizadas en un mismo carrito. Si alcanza el límite, el sistema explica por qué.

La sección **Mis productos** también permite estos dos valores para productos completos que el administrador haya habilitado como componentes de «Personalizar».

## Cómo publicarlo sin perder la configuración

1. **Antes de cambiar nada, guardá una copia** del repositorio actual y, si tenés acceso al administrador, una copia desde «Mi negocio».
2. Descomprimí el ZIP de archivos modificados y reemplazá en GitHub, respetando las carpetas, `index.html`, `admin.html`, `assets/site.js`, `assets/admin.js` y `assets/styles.css`.
3. **No reemplaces `config.js`**, no pegues claves secretas y no ejecutes SQL nuevo para esta actualización.
4. Esperá la publicación en Vercel y abrí el sitio recargando sin caché (`Ctrl + Shift + R`).
5. Entrá al administrador, abrí **Materias primas** y cargá ambos números para cada ingrediente que quieras ofrecer en Personalizar. Si un componente ya existía, quedará inhabilitado hasta que le definas sus cantidades; así evitamos anunciar stock inventado.
6. Si ofrecés productos enteros como componentes personalizados, abrilos en **Mis productos > Editar** y configurá también sus dos números.
7. Probá con una taza o una chocotorta: fijá stock 5, máximo por bandeja 2; verificá que al intentar sumar una tercera aparezca un aviso, y que el carrito no pueda superar 5 entre varias bandejas.

## Alcance del stock (importante)

El stock **no se descuenta automáticamente** al recibir solicitudes y **no se reserva globalmente** entre clientes simultáneos. La web compara contra la cantidad que el administrador publica, consulta de nuevo el catálogo antes de continuar el pedido y antes de compartirlo, y limita las cantidades del carrito del comprador. Para garantizar que dos compradores simultáneos nunca soliciten la última unidad, haría falta incorporar una reserva transaccional del inventario en el servidor, adicional a este cambio. El negocio debe confirmar disponibilidad por WhatsApp.

En la información pública solo se publican **precio de venta, stock y máximo por bandeja**. Los costos internos permanecen en la información privada protegida por Supabase.

Si la administradora ve `new row violates row-level security policy`, es un problema de permisos de Supabase independiente de esta mejora: hay que revisar su cuenta y las políticas correspondientes; no desactivar RLS ni publicar una `secret key` en el navegador.
