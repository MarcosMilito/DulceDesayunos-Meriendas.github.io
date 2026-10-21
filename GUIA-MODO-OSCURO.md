# Dulces Desayunos y Meriendas — Versión 2.6 (modo oscuro y claro)

## Actualización recomendada sobre la versión 2.5.1

Subí estos archivos a tu repositorio de GitHub, conservando las rutas y reemplazando los anteriores:

- `index.html`
- `admin.html`
- `assets/styles.css`
- `assets/theme.js` (**archivo nuevo**)

**No reemplaces `config.js`, no ejecutes SQL y no elimines las tablas de Supabase.**

Vercel debería desplegar automáticamente al guardar el commit. Si no aparece el botón, abrí el sitio en una ventana privada o forzá actualización con `Ctrl+Shift+R`.

## Cómo funciona

- En la tienda aparece un botón con una luna o un sol al lado del carrito.
- En el administrador aparece en el inicio de sesión, la cabecera del panel en escritorio y la barra superior en celular.
- Al tocarlo cambia entre los dos modos.
- La elección se guarda en el navegador para ambas páginas.
- Si nunca se eligió un modo, toma el modo que esté configurado en el dispositivo.
- Las fotografías originales, los precios, productos, carrito, pedidos y datos de Supabase no se alteran.

Esta actualización no depende de credenciales ni de nuevas tablas.
