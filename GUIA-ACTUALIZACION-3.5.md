# Dulces Desayunos y Meriendas — actualización 3.5

## Qué cambia

- **Celular:** portada, secciones, tarjetas, botones y espacios más compactos. La computadora conserva el diseño anterior.
- **Personalizar:** buscador, categorías automáticas (Todos, Bebidas, Panificados, Dulces, Salados y Otros), seis componentes iniciales y botón **Ver más componentes**. De manera predeterminada solo se muestran insumos disponibles. Con «Ver agotados» se pueden consultar los otros, pero no agregarlos.
- **Envíos:** «Banfield centro» pasa a **Banfield**, respetando los precios ya configurados. En el administrador podés agregar localidades, cambiar nombre y precio, habilitarlas, deshabilitarlas o eliminarlas.
- **Novedades:** fondos, textos y controles del cartel emergente adaptados al modo oscuro.

## Actualizar el sitio existente (recomendado)

1. Hacé una copia del repositorio por seguridad.
2. Descargá el ZIP **SOLO_ARCHIVOS_MODIFICADOS** y descomprimilo.
3. Subí y reemplazá en GitHub los archivos respetando sus carpetas:
   - `index.html`
   - `admin.html`
   - `assets/site.js`
   - `assets/admin.js`
   - `assets/data.js`
   - `assets/styles.css`
4. **NO borres ni reemplaces tu `config.js`:** contiene la URL y la clave pública de Supabase.
5. Cuando Vercel termine el despliegue, refrescá con `Ctrl + Shift + R` o probá una ventana privada.
6. En `admin.html`, ingresá a **Envíos**. Los nuevos nombres y tarifas se guardan al presionar **Guardar cambios**. Para añadir otra localidad, usá **+ Agregar localidad**. Guardá primero cualquier modificación pendiente antes de agregar una localidad.
7. En la tienda, abrí **Personalizar**. Podrás filtrar y buscar componentes. Su precio y disponibilidad siguen controlándose desde **Materias primas**.

## Notas importantes

- **No requiere un SQL nuevo** si Supabase ya funciona con la versión 3.4.
- No modifica los precios del catálogo ni borra productos, dedicatorias o pedidos.
- La corrección a Banfield se hace al leer los datos anteriores. Se guarda de forma permanente en Supabase la próxima vez que guardes un cambio público, por ejemplo desde **Envíos**.
- Si una localidad se deshabilita, desaparece del selector de compra. Si eliminás una localidad, los pedidos históricos conservan el nombre y precio registrados al momento de la solicitud.
- El filtro de categorías del personalizador clasifica automáticamente por **nombre del componente**. Si cargás uno nuevo en Materias primas y lo habilitás para el personalizador, aparecerá en la lista sin tocar código.
- Los pedidos se continúan confirmando por WhatsApp, sujetos a disponibilidad.
- Las verificaciones realizadas abarcan sintaxis de JS, estructura CSS, carrito/personalizador en pruebas de navegador aisladas a 390 px y 1440 px, alta de localidades y migración del nombre Banfield. La prueba real en tu cuenta de Supabase y Vercel debe hacerse luego del despliegue.
