# Dulces Desayunos y Meriendas — actualización 3.0

## Publicación

1. Descargá el ZIP **SOLO_ARCHIVOS_MODIFICADOS** y subí sus archivos al repositorio conservando las carpetas. No reemplaces `config.js`, que contiene tus datos de conexión a Supabase.
2. En Supabase → SQL Editor, ejecutá el contenido de `supabase/03-permitir-eliminar-pedidos.sql` **después de haber ejecutado 02-pedidos.sql**. Es un cambio de permisos: **no borra ningún pedido**.
3. Dejá que Vercel despliegue y recargá con `Ctrl+Shift+R` o abrí en una ventana privada.

## Nueva sección "Armá tu desayuno"

En **admin.html → Materias primas → Editar** cada componente:
- **Costo interno ($):** lo que pagás al proveedor; NO se hace público.
- **Precio de venta ($):** lo que se suma a la bandeja por unidad o medida elegida.
- **Mostrar en Armá tu desayuno:** habilita que se muestre en la tienda.
- **En stock:** habilita que el cliente pueda seleccionarlo. Sin stock se ve deshabilitado.

Al guardar se actualiza una lista pública **sin incluir costos internos**, así el cliente puede elegir cantidades y ver un total. Inicialmente la lista aparece vacía hasta que publiques componentes y sus precios reales. Cada producto personalizado se agrega al carrito y al mensaje de WhatsApp con todos sus componentes; la confirmación de disponibilidad y precio sigue siendo manual.

**Importante:** "En stock" es manual; NO descuenta inventario al recibir pedidos. Las solicitudes entran como pendientes, antes de comprobar que el cliente envió el WhatsApp. La tienda estática no puede garantizar stock ni precio si hubo una actualización mientras el cliente cargaba su carrito, por eso se deben confirmar por WhatsApp. Los pedidos de clientes deben verificarse porque sus importes pueden modificarse desde el navegador.

## Pedidos

Ya no existe el botón de crear pedidos desde el administrador. Se agregó **Eliminar** en la lista y en los detalles con confirmación. Requiere el SQL 03 para funcionar en Supabase; el borrado es definitivo y no puede deshacerse desde el sistema. Descargá una copia de seguridad si necesitás conservar el historial.

## Correcciones

- Redes sociales horizontales.
- Contraste de categorías en administrador oscuro y sección "Tres pasos".
- Pantalla de inicio de sesión sin texto superpuesto sobre fotografías.
- Diseño claro y oscuro con tarjetas, textos y controles legibles en móvil.
