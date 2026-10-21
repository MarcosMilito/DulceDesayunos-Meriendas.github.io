# Actualización 2.2 → 2.3 | Dulces Desayunos y Meriendas

## Qué cambia

- Corrección de la marca a **Dulces Desayunos y Meriendas**, tanto en la tienda como en la administración y el mensaje de WhatsApp.
- En WhatsApp, cada renglón de producto dice `• Ricota × 1 unidad — $25.000` (o `2 unidades`, etc.), **sin enumeración**.
- En el formulario de compra aparece el campo opcional **«¿Tenés alguna preferencia especial para la dedicatoria?»**, para observaciones de impresión, letras, colores, diseño y ubicación de la foto.
- Las observaciones se añaden al pedido bajo **«OBSERVACIONES DE LA DEDICATORIA»**, solo si fueron escritas.
- La foto elegida aparece en la vista previa. En teléfonos compatibles, el comprador puede usar **«Compartir pedido y foto»**: el dispositivo abre su menú para elegir WhatsApp y seleccionar el chat del negocio. También queda la alternativa de abrir el WhatsApp de atención al **11 6574-4539** y adjuntar la foto manualmente.
- El aviso sobre fecha, horario, pago y disponibilidad **sigue únicamente en la pantalla previa**, nunca dentro del mensaje.

## Archivos para reemplazar en GitHub

Descomprimí el ZIP de «SOLO_ARCHIVOS_MODIFICADOS» y reemplazá exactamente estos archivos dentro del repositorio, respetando las carpetas:

- `index.html`
- `admin.html`
- `assets/site.js`
- `assets/styles.css`
- `assets/data.js`
- `assets/admin.js`

No se cambió `config.js`, ni las fotografías, ni el logo, ni el esquema de Supabase. **No vuelvas a ejecutar la instalación SQL.** El cambio de marca en datos guardados se realiza como migración al leerlos, conservando el resto de los registros.

## Publicación

1. Hacé copia de seguridad de la versión anterior del repositorio.
2. Subí los archivos anteriores a sus rutas originales y confirmá los cambios en GitHub.
3. Esperá el despliegue automático de Vercel.
4. Abrí la tienda con actualización forzada (`Ctrl`+`F5`) y hacé una compra de prueba en un celular.
5. Elegí un producto y completá el pedido con y sin foto para comprobar ambos caminos. **No es necesario enviar una compra real** para comprobar el resumen.

## IMPORTANTE: fotos y WhatsApp

Una página web común **no puede introducir una foto automáticamente en una conversación de WhatsApp elegida por número a través de `wa.me`**, ni forzar el envío de dos mensajes. Esta actualización aprovecha la función de **compartir archivos del propio celular** cuando está disponible. El cliente debe **elegir WhatsApp, elegir al destinatario y confirmar**. Algunos teléfonos pueden compartir el archivo pero no conservar el texto: revisá en WhatsApp que el resumen y la foto estén presentes antes de enviarlos. De lo contrario, usá **«Copiar resumen»**, o **«O enviá el pedido directamente al WhatsApp del negocio»** y adjuntá la foto en el mismo chat.

La foto permanece en el dispositivo del comprador: **no se sube a Supabase ni a otro servidor** desde este formulario. Para enviar adjuntos de forma automática desde el número de una empresa haría falta una integración de servidor con WhatsApp Business Platform y permisos correspondientes; no forma parte de esta versión.
