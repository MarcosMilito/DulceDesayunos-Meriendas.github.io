# Dulces Desayunos y Meriendas — versión 3.2

## Qué se cambió
- Se recuperó el ancho contenido y el diseño de la versión 3.0. No se expande hasta los bordes de los monitores grandes.
- En el menú se conserva **Personalizar** y los enlaces a redes sociales ya no aparecen en la cabecera ni en la portada. Siguen disponibles flotantes y en la sección Contacto.
- Se mantiene la lista moderna de insumos del personalizador 3.1 (foto ilustrativa, disponibilidad, precio, botones +/−), pero se elimina la maqueta/bandeja ilustrada.
- Se corrigió el botón **Agregar** para que su texto no se superponga al contador, incluso con cantidad 0.
- La pantalla de ingreso al administrador recupera una fotografía real de productos y deja de mostrar explicaciones técnicas.
- En la cabecera del administrador se conserva solamente el logo y el selector claro/oscuro; no se muestra el correo.
- Los botones sociales del bloque Contacto tienen más espacio y tamaños legibles.
- Se mantienen los pedidos, su eliminación inmediata con restauración si falla la operación, precios, configuración de insumos, modo claro/oscuro y tipografía ampliada.

## Instalación (sin perder datos)
1. Hacé una copia de seguridad de tu repositorio antes de cambiar archivos.
2. Descomprimí el ZIP **SOLO_ARCHIVOS_MODIFICADOS** y copiá `index.html`, `admin.html`, `assets/site.js`, `assets/admin.js` y `assets/styles.css` en las mismas rutas de GitHub. Reemplazá los existentes.
3. No reemplaces `config.js`, ni ejecutes SQL. No se cambia la estructura de datos.
4. Una vez que Vercel publique, abrí la tienda y `admin.html` y actualizá con Ctrl + Shift + R.
5. Verificá el menú y las redes, agregá un ingrediente en Personalizar, probá el modo oscuro y revisá el ingreso al administrador.

## Aclaración
El código mantiene la conexión existente con Supabase. No incluye una contraseña nueva y no modifica los pedidos guardados. Las ilustraciones pequeñas de los ingredientes siguen disponibles. La maqueta visual se ha quitado.
