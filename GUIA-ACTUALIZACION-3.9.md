# Dulces Desayunos y Meriendas — actualización 3.9

## Qué corrige

En versiones anteriores, **Personalizar** combinaba dos listas distintas: las materias primas del administrador y algunos desayunos completos cargados en «Mis productos». Por eso podía aparecer «Ricota» por $25.000 como si fuera un ingrediente, aunque la lista privada solo tuviera «Torta de ricota».

Desde esta versión, el único origen de los componentes del personalizador es **Administrador → Materias primas**. Se usan solamente los componentes que tengan la opción «Mostrar en Personalizar» activada y un precio de venta válido. Los sin stock se distinguen de los disponibles, sin inventar cantidades. La categoría, el precio al cliente, el stock y el máximo por bandeja se publican desde esa misma ficha; **los costos internos nunca se publican**.

También se reemplaza el icono de regalo por ilustraciones específicas cuando el nombre es inequívoco (cerveza o lata de gaseosa), o por una ilustración neutra de su categoría cuando no lo es.

## Instalación segura en GitHub / Vercel

1. Guardá una copia del repositorio actual o creá una rama de respaldo.
2. Subí el contenido del ZIP «SOLO ARCHIVOS MODIFICADOS» a la raíz del repositorio **respetando las carpetas** y aceptá reemplazar los archivos existentes.
3. **No reemplaces, borres ni publiques tu archivo `config.js`**. La actualización no necesita nuevas claves ni cambios de tablas SQL.
4. Verificá que Vercel haya publicado el nuevo commit. Abrí la tienda con `Ctrl + Shift + R` o en modo incógnito.
5. Iniciá sesión en `/admin.html` con una cuenta autorizada. Se intentará sincronizar el personalizador automáticamente si se detectan datos anteriores.
6. Entrá a **Materias primas** y tocá **«Sincronizar Personalizar»**. El sistema confirmará que el catálogo ya coincide o publicará la lista corregida. Este paso es importante para depurar el registro antiguo en Supabase.
7. Revisá los campos de cada materia prima que desees ofrecer: `Mostrar en Personalizar`, `Precio al cliente`, `Disponible para la venta`, `Stock disponible` y `Máximo por bandeja`.
8. En la tienda, entrá a **Personalizar**. Verificá que **no** aparezca «Ricota» a $25.000 por ser un desayuno completo. «Torta de ricota» puede aparecer con su precio individual configurado en Materias primas.

## Qué NO cambia

- Los desayunos y picadas del catálogo principal siguen estando en «Productos».
- No se borran los productos, precios, pedidos ni datos internos de Supabase.
- El stock y los máximos por bandeja siguen siendo administrables desde la ficha de Materias primas.
- No hay reserva automática del stock entre compradores diferentes: la confirmación final continúa por WhatsApp.

## ¿Y si al sincronizar aparece un error de permisos?

No uses ninguna clave secreta en el navegador ni desactives RLS. Es necesario que la cuenta que inició sesión sea administradora autorizada en Supabase y que las políticas de guardado de `public_data` y `private_data` estén configuradas. La sincronización informa el fallo si Supabase rechaza guardar; no debe interpretarse como un guardado exitoso. Si sucede, revisá la guía de permisos de la instalación actual antes de volver a intentarlo.

## Archivos modificados

- `index.html`
- `admin.html`
- `assets/site.js`
- `assets/admin.js`
- `assets/styles.css`
- `assets/illustrations/bebida.svg`
- `assets/illustrations/cerveza.svg`
- `assets/illustrations/lata.svg`
- `assets/illustrations/panificados.svg`
- `assets/illustrations/dulces.svg`
- `assets/illustrations/salados.svg`
- `assets/illustrations/otros.svg`

Versión 3.9 — corrección del catálogo personalizado y de sus ilustraciones.
