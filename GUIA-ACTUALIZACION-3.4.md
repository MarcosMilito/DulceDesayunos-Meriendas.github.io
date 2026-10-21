# Dulces 3.4 — Corrección de diseño y simplificación

## Qué cambió

- **Materias primas:** eliminamos la opción «Dibujo de la bandeja» del formulario de agregar/editar. Cargá únicamente el nombre, la unidad, el costo, el precio de venta y la disponibilidad.
- **Carrito:** «Eliminar» tiene su propio ancho y ya no se corta ni invade otros controles. Ajustamos también los botones + y − para que sean cómodos en celular y escritorio.
- **Tema oscuro:** el botón Eliminar mantiene contraste suficiente.
- **Datos:** no cambiamos Supabase ni los precios, productos, materias primas o pedidos existentes. Las miniaturas automáticas del personalizador continúan según el nombre del componente.

## Actualizar tu proyecto de GitHub/Vercel

1. Hacé una copia de seguridad de tu repositorio actual.
2. Descomprimí `Dulces_3_4_SOLO_ARCHIVOS_MODIFICADOS.zip`.
3. Subí y reemplazá en GitHub respetando sus rutas:
   - `index.html`
   - `admin.html`
   - `assets/admin.js`
   - `assets/styles.css`
4. No reemplaces `config.js` ni toques Supabase. No requiere ejecutar SQL.
5. Comprobá que Vercel publicó los cambios y recargá con **Ctrl + Shift + R**.

## Verificaciones aconsejadas

- Administración → Materias primas → Editar componente: la opción «Dibujo de la bandeja» ya no está.
- Tienda → Personalizar: sumá una taza y jugo; abrí el carrito y verificá «Eliminar», + y −.
- Repetí con el modo oscuro y en un celular.

La actualización parte de la versión 3.3 y no reestructura el sitio.
