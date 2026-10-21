# Dulces Desayunos y Meriendas — Versión 2.9 · Tipografía legible

## Qué arreglamos

En la versión anterior seguían viéndose demasiado pequeños textos como:
- La descripción de cada producto (picadas, clásicos, etc.).
- El mensaje de envíos de la tarjeta de Contacto.
- La frase «Sin vueltas ni formularios eternos» de Cómo pedir.

Ahora los **textos corridos de esas secciones miden 18 px en escritorio y 17 px en celular**, y también ajustamos descripciones, ayudas, formularios y panel de administración. No se modificaron fotos, paleta de colores, modo claro/oscuro ni funcionalidades de compra.

## Cómo actualizar (GitHub + Vercel)

1. Descargá el ZIP `Dulces_2_9_SOLO_TIPOGRAFIA.zip`.
2. Descomprimí los archivos y abrí el repositorio de GitHub.
3. **Reemplazá solo estos tres archivos**, respetando las rutas:
   - `index.html`
   - `admin.html`
   - `assets/styles.css`
4. Confirmá los cambios en GitHub y esperá que Vercel termine de publicarlos.
5. Abrí la tienda y el administrador con `Ctrl + Shift + R` para actualizar los estilos.

Los archivos HTML cambian la referencia de `styles.css?v=2.8.0` a `styles.css?v=2.9.0`, de modo que el navegador no conserve la versión anterior.

**No reemplaces `config.js`, los JavaScript ni las tablas de Supabase.** Se mantienen productos, pedidos y configuraciones.
