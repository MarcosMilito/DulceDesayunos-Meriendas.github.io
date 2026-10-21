# Actualización 2.5 — Dulces Desayunos y Meriendas

## Qué cambió

- Se retiró **totalmente** el selector de fotografías del formulario de compra y del mensaje.
- Se conserva la dedicatoria y sus observaciones opcionales.
- Se reemplazó «Ventas y gastos» por «Pedidos» en el menú del administrador.
- Cada pedido del carrito se registra al pulsar «Compartir pedido», **antes** de ir a WhatsApp. En el panel verás su nombre, teléfono, domicilio, localidad, productos, total estimado, dedicatoria y observaciones; podés marcarlo como «Pagado» o «Pendiente de pago».
- La vista general continúa mostrando ingresos, egresos estimados, resultado estimado y cantidad de pedidos pagados, combinando registros anteriores.
- Podés registrar pedidos recibidos por fuera de la web con «Cargar pedido».

## Cómo instalar sobre 2.4

1. Hacé una copia de seguridad del repositorio de GitHub.
2. Subí el contenido del ZIP **SOLO ARCHIVOS MODIFICADOS** al repositorio, respetando nombres y carpetas.
3. **Conservá tu `config.js` existente**. No copies sobre él ninguna versión de ejemplo.
4. En Supabase: **SQL Editor > New query**. Copiá todo `supabase/02-pedidos.sql`, ejecutalo una vez y comprobá que termine sin errores. Se debe ejecutar después del SQL 01 que ya usa el administrador.
5. Esperá el deploy de Vercel y recargá el sitio. El código usa versión `2.5.0` para evitar archivos JavaScript cacheados.
6. Desde la tienda hacé un pedido de prueba; al pulsar «Compartir pedido» se crea una solicitud, luego se abre WhatsApp. Abrí `tudominio/admin.html` y seleccioná **Pedidos** para verlo. La solicitud debe aparecer **Pendiente de pago**.
7. Confirmá manualmente con el cliente por WhatsApp, cobrá y entonces pulsá **Marcar como pagado**.

## Limitaciones importantes

**El clic no prueba que se haya enviado el mensaje por WhatsApp.** Las solicitudes se registran antes de que se abra la aplicación. Tampoco significa que hayas aceptado el pedido. Comprobá disponibilidad y detalles con el cliente.

En el modo demostración (sin Supabase), los pedidos se guardan en el almacenamiento del navegador y solo aparecen en el administrador **del mismo navegador y dispositivo**. Para centralizarlos desde distintos celulares es necesario Supabase y ejecutar el SQL 02.

Si configuraste Supabase pero todavía no corriste el SQL 02, el cliente recibirá un aviso y podrá elegir enviar el pedido por WhatsApp de todos modos. **Ese pedido no aparecerá automáticamente en el panel**: deberás crearlo a mano con «Cargar pedido».

Los precios de solicitudes enviadas por visitantes no están validados por un servidor contra el catálogo: son **estimativos**, y el administrador debe verificarlos antes de confirmar o aceptar un pago. Los visitantes no pueden consultar los pedidos ajenos ni cambiar su estado de pago por la API pública, gracias a RLS.

### Seguridad

`config.js` debe contener únicamente URL y clave pública de Supabase; nunca agregues la *secret key*. Para un uso de alto volumen se recomienda añadir límites a envíos y un control antispam del lado del servidor.

> Nota: la copia JSON del panel incluye una referencia de los pedidos, pero restaurar esa copia **no** reimporta pedidos a la tabla protegida de Supabase; los pedidos existentes permanecen allí.
