# Dulces Desayunos y Meriendas — Actualización 4.0

## ¿Qué se modificó?

**Mi pedido** ahora permite elegir la localidad de entrega *antes* de continuar. Debajo de los productos se muestra:

- Subtotal de productos
- Envío según la localidad elegida
- Total estimado, sumando ambos valores

Si el envío está configurado como gratuito, se lee «Sin cargo». Si falta una tarifa, el importe figura «A confirmar». La localidad es obligatoria para habilitar **Continuar con el pedido**. Solo se ofrecen localidades que el administrador haya marcado como disponibles.

El formulario siguiente ya **no pide la localidad**: conserva la selección del carrito y solicita nombre completo, WhatsApp, dirección de entrega, dedicatoria opcional y observaciones. El resumen de revisión, el mensaje de WhatsApp y el pedido enviado al administrador conservan la localidad, el envío y el total estimado.

La fecha, el horario, el pago y las observaciones generales siguen coordinándose por WhatsApp.

## Instalación en GitHub / Vercel

1. Guardá una copia de la versión que ya está publicada.
2. Abrí el ZIP de **archivos modificados**.
3. Copiá `index.html` en la raíz de tu repositorio, reemplazando el anterior.
4. Reemplazá `assets/site.js` y `assets/styles.css` respetando la carpeta `assets`.
5. Guardá los cambios y esperá a que Vercel finalice la publicación.
6. Abrí la tienda en una pestaña privada, agregá un producto a «Mi pedido» y elegí una localidad. Verificá subtotal, envío y total. Después tocá «Continuar con el pedido» y comprobá que no vuelva a preguntar la localidad.

**No reemplaces `config.js`. No modifiques Supabase. No hay SQL nuevo para ejecutar.** Las localidades y sus tarifas se siguen gestionando desde Administración → Envíos.

## Ejemplo (valores ilustrativos del catálogo)

- Picada: $26.000
- Envío a Banfield: sin cargo
- Total estimado: $26.000

Si el mismo pedido se envía a Villa Fiorito ($2.500), el total estimado es $28.500.

## Verificaciones

Se probaron los flujos mediante una sesión de navegador aislada (390 y 1440 píxeles), con envío gratis y con cargo, regreso al carrito, dedicatoria, generación de texto para WhatsApp y ausencia de errores de JavaScript. La prueba contra Supabase real y el Vercel publicado queda para después de la instalación.
