# Dulces Desayunos y Meriendas — versión 3.1

## Qué cambió

- Menú principal sin logos de redes (siguen abajo a la derecha, portada y Contacto).
- Menú «Personalizar» en lugar de «Armá tu desayuno».
- Contenido más ancho en escritorio, manteniendo espacio lateral y versión móvil.
- Personalizador con productos disponibles primero, control +/− y vista de bandeja ilustrada en tiempo real. Cada medialuna, taza u otro elemento discreto se muestra por unidad hasta ocho representaciones; mayores cantidades indican cuántas adicionales hay. Los componentes medidos en gramos, litros o paquetes se representan con una pieza y su cantidad escrita.
- Los dibujos son orientativos, no una promesa de la presentación final ni fotos del producto real.
- El administrador permite elegir el dibujo de cada nuevo insumo desde «Materias primas»; sin una selección intenta identificarlo por nombre y, si no encuentra coincidencia, usa un regalo genérico.
- Eliminación de pedidos optimista: desaparecen inmediatamente de la lista tras la confirmación; si Supabase devuelve un error, se restauran con aviso.

## Actualización de GitHub

1. Hacé una copia de seguridad del repositorio antes de reemplazar archivos.
2. Subí los archivos del ZIP a la **raíz** del repositorio, respetando las carpetas `assets/`.
3. Reemplazá `index.html`, `admin.html`, `assets/site.js`, `assets/admin.js` y `assets/styles.css`.
4. **Agregá** la carpeta nueva `assets/illustrations/` con todos sus SVG.
5. **No modifiques `config.js`, `assets/data.js` ni los archivos SQL** de Supabase: no hay migraciones para esta versión.
6. Esperá el despliegue de Vercel y recargá con Ctrl + Shift + R.

## Para empezar a ofrecer personalizados

1. Entrá a `/admin.html` y abrí «Materias primas».
2. Para cada ingrediente, cargá el **precio de venta**, marcá «En stock» y «Mostrar en Personalizar».
3. Elegí su dibujo en «Dibujo de la bandeja». Guardá y publicá.
4. Visitá la sección «Personalizar» en la tienda y comprobá los precios y el carrito.

No se descuenta stock automáticamente. Los costos internos siguen siendo privados. Los pedidos por WhatsApp requieren confirmación del negocio.

**ATENCIÓN**: en el ZIP completo `config.js` es solo la plantilla original; si ya conectaste tu proyecto a Supabase, usá preferentemente el ZIP de archivos modificados y conservá tu `config.js`.
