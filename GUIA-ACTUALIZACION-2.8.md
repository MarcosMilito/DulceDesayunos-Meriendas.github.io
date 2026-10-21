# Dulces Desayunos y Meriendas — Actualización 2.8

Esta actualización **aumenta un poquito más las letras** de la versión 2.7. La tienda y el administrador conservan estructura, diseño, fotografías, modo claro/oscuro y funcionamiento.

## Solo tenés que reemplazar tres archivos en GitHub

- `index.html`
- `admin.html`
- `assets/styles.css`

Respetá la ruta de cada archivo. Los HTML solo cambian la versión de la hoja de estilos (`styles.css?v=2.8.0`) para que Vercel y los navegadores no sigan usando la versión anterior.

**No modifiques `config.js`, los JavaScript de la tienda/administrador ni los archivos o tablas de Supabase.**

Para publicar: subí los 3 archivos, confirmá los cambios en GitHub, esperá el despliegue automático en Vercel y actualizá la página con `Ctrl + Shift + R`.

Se verificó el aspecto en vistas aisladas de escritorio y móvil, sin desbordamiento horizontal en esas pruebas. Conviene comprobarlo una vez publicado con tus datos reales.
