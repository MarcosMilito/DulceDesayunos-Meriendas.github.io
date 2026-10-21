# Actualización Dulce 2.1 → 2.2

Esta actualización cambia **solo 3 archivos del sitio público**; el administrador y Supabase siguen igual.

## Qué reemplazar en tu repositorio de GitHub

Descomprimí **Dulce_2_2_SOLO_ARCHIVOS_MODIFICADOS.zip** y reemplazá estos archivos, conservando las carpetas:

1. `index.html` — coloca los espacios para los iconos visibles de redes sociales.
2. `assets/site.js` — pinta los enlaces y adapta la dedicatoria, la foto y el mensaje de WhatsApp.
3. `assets/styles.css` — incorpora los diseños de redes y los nuevos pasos del pedido.

**NO cambies `config.js`. NO vuelvas a ejecutar SQL ni borres registros de Supabase.** No hace falta cambiar `assets/admin.js` o `assets/data.js`: el sitio sigue leyendo desde el administrador los enlaces a redes, precios, productos y tarifas de envío.

## Cómo publicar

1. Guardá una copia del repositorio, si todavía no tenés una.
2. Abrí tu repositorio de GitHub y subí los tres archivos respetando las rutas originales. Confirmá que se sustituyan los anteriores.
3. Guardá los cambios (commit). Si Vercel está conectado al repositorio, empezará un despliegue automático.
4. Entrá a tu sitio con `Ctrl + F5` o desde una ventana privada para ver la versión nueva.
5. Probá desde el celular y una computadora: redes, agregar al carrito, datos de entrega, dedicatoria, foto opcional y envío a WhatsApp.

## ¿Qué ve el comprador?

- Al abrir la página y mientras navega: botones con los símbolos reconocibles de WhatsApp, Instagram y Facebook.
- En el checkout: puede escribir una dedicatoria y elegir una foto (ambos opcionales).
- En la confirmación previa al WhatsApp aparece el aviso: fecha, horario de entrega, medio de pago y observaciones se coordinan directamente con el negocio; sujeto a disponibilidad y confirmación.
- El texto prearmado para WhatsApp **no incluye ese aviso**; solo incluye productos, importes, entrega y dedicatoria. Si adjuntó una foto, avisa que llegará por separado.

## Limitación técnica de WhatsApp y las fotos

Por seguridad, `https://wa.me` no admite adjuntar automáticamente fotos desde una página web. El comprador selecciona una foto y ve una vista previa. Al final, puede usar el botón «Compartir mi foto» si el dispositivo ofrece compartir archivos o adjuntarla manualmente desde la conversación del negocio. **El archivo no se sube a ningún servidor ni se envía automáticamente.** No asumimos que un pedido quedó confirmado solo por abrir WhatsApp.

## Qué se conserva

Administrador, login y `config.js` actual; productos, fotos y precios; materias primas, promociones, novedades, ingresos/gastos; envíos por localidad; diseño y paleta del logo.
