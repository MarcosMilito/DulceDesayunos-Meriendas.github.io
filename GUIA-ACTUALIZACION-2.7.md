# Dulces Desayunos y Meriendas · Actualización 2.7

## ¿Qué cambia?
Solo aumenta suavemente la tipografía para mejorar la lectura en celulares y computadoras.

- Navegación, categorías y filtros un poco más grandes.
- Nombres de productos, precios, descripciones y botones más legibles.
- Carrito, formulario de pedido y dedicatoria: textos y campos de entrada más cómodos.
- Panel administrador: menú lateral, cuadros de indicadores, tablas, pedidos y formularios más claros.
- Mantiene la paleta de colores, fotografías, estructura, animaciones, modo claro/oscuro y comportamiento comercial de la versión 2.6.

## Archivos que tenés que reemplazar en GitHub

1. `index.html` (raíz del repositorio).
2. `admin.html` (raíz del repositorio).
3. `assets/styles.css` (carpeta `assets`).

Los dos HTML solo se modificaron para cargar la nueva versión del CSS (`styles.css?v=2.7.0`), para evitar la caché de versiones anteriores.

**No reemplaces `config.js`, ni los archivos de Supabase, ni los JavaScript de la tienda o administrador.**

## Cómo publicar

1. Hacé una copia de respaldo de los tres archivos actuales del repositorio.
2. Descomprimí el ZIP de «solo archivos modificados».
3. Subí los tres archivos a GitHub respetando exactamente las rutas indicadas.
4. Confirmá los cambios (Commit changes).
5. Esperá el nuevo deployment de Vercel.
6. En la página publicada, recargá con `Ctrl + Shift + R`; en celular, probá en una pestaña nueva o privada si todavía ves estilos antiguos.

No hace falta ejecutar ninguna consulta SQL ni modificar la base de datos.

## Comprobación

Se comprobó sintácticamente la hoja de estilos y se probaron tamaños de letra en vistas HTML aisladas de 390 y 1440 píxeles sin desbordamiento horizontal. La prueba de la página completa con datos reales de Supabase deberá hacerse una vez publicado el cambio.
