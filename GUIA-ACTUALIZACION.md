# Dulces Desayunos y Meriendas — Actualización 2.4

## Qué corregimos

- **Nombre:** Dulces Desayunos y Meriendas en la tienda, el administrador y el texto del pedido.
- **WhatsApp:** los artículos figuran sin numeración, por ejemplo «• Ricota — 1 unidad — $ 25.000».
- **Dedicatoria y observaciones:** se guardan durante el formulario y aparecen en la vista previa y en el mensaje de WhatsApp. Si no se completaron, se indica expresamente que no se solicitó una dedicatoria o que no hay observaciones.
- **Foto opcional:** se puede elegir y ver una vista previa. La pantalla de confirmación tiene **un único botón principal: «Compartir pedido»**. Abre el WhatsApp de atención **11 6574-4539** con el resumen escrito. Si se seleccionó una foto, el cliente debe **adjuntarla manualmente** en ese mismo chat. Los enlaces comunes de WhatsApp no permiten adjuntarla automáticamente.
- **Volver:** hay controles visibles para regresar desde el carrito a la tienda, desde el formulario al carrito y desde la revisión final al formulario sin perder los datos ni la foto. También hay «Volver» en el detalle de productos y la ventana de novedades.
- **Coordinación:** el aviso de disponibilidad, fecha, horario y pago permanece en la web antes de enviar; no se incorpora al mensaje de WhatsApp.
- **Caché:** el HTML utiliza `?v=2.4.0` para los archivos CSS y JS y así evita cargar scripts antiguos.

## Cómo actualizar GitHub y Vercel

1. Descargá **Dulces_2_4_SOLO_ARCHIVOS_MODIFICADOS.zip** y descomprimilo.
2. En tu repositorio **MarcosMilito/DulceDesayunos-Meriendas.github.io**, reemplazá los archivos conservando sus rutas:
   - `index.html`
   - `admin.html`
   - `assets/site.js`
   - `assets/styles.css`
   - `assets/data.js`
   - `assets/admin.js`
3. Confirmá el commit en GitHub y esperá que Vercel termine el nuevo despliegue.
4. Abrí tu sitio en una ventana privada. Verificá que `index.html` cargue `assets/site.js?v=2.4.0` y que el único botón final sea «Compartir pedido».
5. Probá el carrito, la dedicatoria, las observaciones y la vuelta atrás desde el celular. **No hace falta enviar un pedido real** para revisar el mensaje.

**No reemplaces `config.js`.** Contiene tus datos públicos de Supabase. Esta actualización no modifica el esquema de la base de datos ni requiere volver a ejecutar SQL. Tampoco borra los productos, ventas ni cambios de precios registrados.

## Sobre la foto

La foto no se envía automáticamente a WhatsApp: el cliente debe adjuntarla dentro de la conversación. Esta restricción existe porque `https://wa.me/...` solamente admite texto precargado, no archivos binarios. No se almacena ni sube la fotografía a Supabase desde este proceso.

## Si seguís viendo «Dulce» o un formulario anterior

Casi siempre significa que se publicó una versión anterior o que el navegador conservó archivos en caché. Comprobá en Vercel que la rama y el último despliegue sean correctos. Abrí el sitio en una ventana privada o actualizá con Ctrl+F5. Si inspeccionás el código fuente, debería figurar `assets/site.js?v=2.4.0`. Reemplazar **solo** `site.js` pero no `index.html` puede dejar la versión antigua en caché.
