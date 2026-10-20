# Dulce Desayunos y Meriendas — Actualización visual y comercial 2.1

## ¡Importante! Para no perder tu conexión a Supabase

**No reemplaces tu archivo `config.js`** si ya cargaste la URL y la `publishable key` de Supabase. Esta actualización NO necesita volver a crear tablas ni volver a configurar el usuario administrador.

## Método recomendado (solo archivos cambiados)

1. Hacé una copia de seguridad del repositorio antes de actualizarlo. En el administrador, entrá a **Mi negocio → Descargar copia** para guardar tus datos.
2. Descomprimí `Dulce_2_1_SOLO_ARCHIVOS_MODIFICADOS.zip`.
3. En GitHub, reemplazá los archivos conservando exactamente las mismas carpetas y nombres:

   - `index.html` — portada sin foto grande, identidad de marca y tienda.
   - `admin.html` — logos y nombre del negocio en el administrador.
   - `assets/styles.css` — paleta rosa/durazno/crema y animaciones suaves al desplazarse.
   - `assets/site.js` — catálogo, detalles, carrito simplificado, pedido y redes.
   - `assets/admin.js` — datos de contacto editables y ajustes del panel.
   - `assets/data.js` — tarifas, enlaces predeterminados y migración de la versión anterior.
   - `assets/img/logo-dulce.png` — logo de la imagen enviada, reescalado y realzado.
   - `assets/favicon.png` — icono con ese logo.

4. Subí también esta guía si querés conservarla. **No toques `config.js`, `supabase/` ni los archivos de fotos de productos.**
5. Si usás Vercel conectado a GitHub, una vez guardados los cambios se inicia un nuevo despliegue automático. Cuando termine, recargá el sitio con Ctrl+F5 o desde una ventana privada.
6. Verificá: `https://TU-DOMINIO/` y `https://TU-DOMINIO/admin.html`.

## Qué se cambió

- Marca: **Dulce Desayunos y Meriendas** en título, textos, logos, administrador y WhatsApp.
- Logo original con reescalado y enfoque para verse mejor en tamaños comunes. Como se partió de una imagen de solo 88 × 87 píxeles, no se puede recuperar mágicamente el detalle perdido. Si conseguís el logo fuente grande, se puede reemplazar sin tocar el código.
- Estética crema, rosa, durazno y marrón inspirada en el logo.
- Portada sin foto grande, más liviana, y apariciones suaves al hacer scroll; se respetan los ajustes de accesibilidad que reducen las animaciones.
- Las tarjetas muestran **Agregar al pedido** y **Ver detalle** (sin personalización).
- Los productos nuevos se describen desde **Mis productos → Descripción** y **Qué incluye la bandeja**; esto se ve en **Ver detalle**.
- Checkout con nombre, WhatsApp, dirección y localidad únicamente. Fecha, horario, pago y observaciones se acuerdan por WhatsApp con disponibilidad sujeta a confirmación.
- Número de destino para pedidos: **+54 9 11 6574-4539**.
- Enlaces de Instagram y Facebook cargados según los datos proporcionados.
- Costos y lógica de administración existentes se conservan.

## Envíos configurados inicialmente

| Localidades | Envío |
|---|---:|
| Lomas de Zamora; Banfield centro | Gratis |
| Villa Centenario; Temperley; Remedios de Escalada | $2.000 |
| Ingeniero Budge; Villa Fiorito; San José; Turdera; Llavallol | $2.500 |
| Lanús; Adrogué | $3.000 |
| Luis Guillón | $3.500 |
| Burzaco; Gerli | $4.000 |
| Avellaneda; Monte Grande | $4.500 |
| Almirante Brown; El Jagüel | $4.800 |

Cada localidad aparece por separado en el selector de checkout y en **Envíos** del administrador. Se puede cambiar el valor cuando haga falta. Para zonas o direcciones imprecisas, conviene confirmar cobertura por WhatsApp.

## Si tenías datos anteriores en Supabase

`assets/data.js` contiene una pequeña migración automática de la configuración pública anterior. Al leer datos de la versión 2.0, aplica **una sola vez** el nombre, el WhatsApp, las redes y las nuevas tarifas. **No borra productos, promociones, novedades, materias primas, recetas, ventas ni gastos.** Cuando el administrador guarde cambios en la tienda, esa configuración se persistirá con una marca de versión. Después, podrá seguir editando tarifas y contactos sin que se vuelvan a sobrescribir.

**No vuelvas a ejecutar el SQL de instalación ni elimines las tablas.**

## Advertencias operativas

- Los pedidos se envían a WhatsApp: no se registran ni se cobran automáticamente. Mantené el registro manual de ventas para los indicadores de ingresos/egresos.
- En modo local sin Supabase, los cambios se guardan solamente en ese navegador y la entrada a `admin.html` no es un acceso protegido.
- No publiques claves privadas `secret` ni `service_role`; `config.js` utiliza solamente las claves públicas autorizadas.
