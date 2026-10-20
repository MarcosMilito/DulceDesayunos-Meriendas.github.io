# Dulce 2.0 — Guía sencilla de uso e instalación

## 1. Ver el nuevo diseño

**Para ver el sitio completo:** subí los archivos a GitHub Pages o utilizá un servidor local. **No lo abras directamente con doble clic en `index.html`**, porque Chrome y Edge suelen bloquear parte del JavaScript cuando se utiliza `file://`. Las fotos y el catálogo de seis productos están incluidos.

**Para abrirlo correctamente en tu PC con Python instalado:** en la carpeta descomprimida, ejecutá `python -m http.server 8000` y abrí `http://localhost:8000`.

No necesitás instalar paquetes ni compilar el proyecto: es HTML, CSS y JavaScript.

## 2. Cómo entrar al administrador

Abrí `http://localhost:8000/admin.html` (o agregá `/admin.html` al final de la dirección de tu sitio publicado). **Este enlace NO aparece en el menú del cliente.**

En la primera apertura el panel funciona en modo prueba, SIN contraseña real. Podés editar los productos, fotos, precios, insumos, promociones, novedades, ventas y zonas de envío. **Los cambios de esta modalidad quedan guardados solo en el navegador donde los hiciste.** No se comparten con los visitantes y cualquier usuario que visite `/admin.html` puede abrir su propio panel local. No la uses para una operación comercial multiusuario.

Para usar el negocio de verdad y editar desde cualquier celular necesitás la configuración de Supabase del paso 4.

## 3. ¿Qué funciones hay?

**En la tienda:** portada impactante, catálogo con fotos, filtros desayunos / meriendas / picadas, promociones, novedades, personalización de desayunos (dedicatoria y extras), carrito, detalle de entrega, selección de localidad y resumen para WhatsApp. Las fotos iniciales son las fotos que nos enviaste y NO están sustituidas por imágenes generadas.

**En el panel privado:**

- *Vista general*: ingresos de ventas cobradas + ingresos adicionales, costos de esas ventas + gastos y resultado estimado del mes.
- *Mis productos*: agregar, editar, ocultar, eliminar productos y asignarles imágenes.
- *Materias primas*: cargar el costo de cada unidad y crear los extras que puede elegir el cliente.
- *Componentes*: en cada producto tocá **Componentes** para indicar las cantidades. Se calcula costo, margen y un precio sugerido con un porcentaje de recargo; **vos elegís si aplicar ese precio**.
- *Promociones*: asociar un producto con un precio promocional.
- *Novedades*: administrar un anuncio que aparece al entrar durante 10–20 segundos y que queda visible abajo en el sitio.
- *Ventas y gastos*: registrar ventas que lleguen por WhatsApp, marcarlas cobradas, y agregar otros ingresos o gastos.
- *Envíos*: tarifas editables por localidad; dejar vacío significa que el costo se confirma por mensaje.
- *Mi negocio*: cargar WhatsApp, Instagram y datos; exportar e importar una copia de seguridad.

**Es importante**: nadie paga en esta web. El cliente arma su pedido y lo envía a WhatsApp; la compra se coordina ahí. El panel **NO** recibe automáticamente las conversaciones de WhatsApp: registrás las ventas manualmente. Los ingresos/egresos NO se vinculan a bancos ni sustituyen a una contabilidad formal. Los costos de ventas sumados al cuadro financiero son una estimación, y registrar de nuevo la compra de esos mismos insumos como gasto podría duplicar costos.

## 4. Activar el administrador seguro y la sincronización real (Supabase)

Sin este paso tenés una DEMO local. Los cambios del administrador no se publicarán a tus clientes.

1. Entrá a https://supabase.com, creá una cuenta y un proyecto.
2. En **SQL Editor**, pegá y ejecutá todo el archivo `supabase/01-crear-base.sql`.
3. En **Authentication → Users**, creá el usuario del administrador (un correo y contraseña que solamente vos conozcas). Confirmá el correo si hace falta.
4. Copiá el **UUID / User ID** del usuario y ejecutá en **SQL Editor** esta instrucción con ese UUID real:

   ```sql
   insert into public.admins(user_id) values ('AQUI-VA-EL-UUID-REAL');
   ```

5. En **Project Settings → API / API Keys** buscá **Project URL** y la **publishable key** (o legacy `anon` key). Nunca uses una clave `service_role` o `secret` en un archivo público.
6. Abrí `config.js` y completá:

   ```javascript
   window.DULCE_CONFIG = {
     supabaseUrl: "https://TU-PROYECTO.supabase.co",
     supabaseAnonKey: "TU_CLAVE_PUBLICA_ANON_O_PUBLISHABLE"
   };
   ```

7. Subí los archivos al hosting. Abrí `admin.html`, ingresá con tu usuario, entrá a **Mi negocio** y configurá el WhatsApp, luego **Mis productos** para guardar/publicar los cambios. La primera vez verás los seis productos de referencia hasta que guardes el catálogo, lo que crea los datos iniciales en Supabase.

Las políticas **Row Level Security (RLS)** del SQL permiten leer el catálogo a cualquiera, pero solo las cuentas que figuran en `admins` pueden modificarlo o acceder a finanzas. El almacenamiento de fotos `product-images` permite subir solo a administradores. Las fotos son públicas para que las vea cualquier visitante. **No compartas el correo y contraseña del administrador.**

## 5. Publicar y reemplazar el sitio existente

### GitHub Pages (ideal para este sitio estático)

1. Hacé una copia del sitio actual por seguridad.
2. Descomprimí este ZIP.
3. Subí el **contenido de esta carpeta** a la raíz del repositorio de GitHub Pages, **NO la carpeta contenedora**. Asegurate de que `index.html`, `admin.html`, `config.js` y `assets/` queden en la raíz del repositorio.
4. En GitHub: **Settings → Pages → Deploy from a branch**, seleccioná `main` y carpeta `/ (root)`.
5. Esperá a que se publique, abrí la URL del sitio y comprobá las seis fotos y precios.
6. Si querés personalización y actualización desde varios dispositivos, antes configurá Supabase según el paso 4.

### Vercel

Importá el repositorio como proyecto estático (Other) y publicá la carpeta raíz. No necesita build ni dependencias. La URL terminará en `vercel.app` salvo que conectes un dominio.

## 6. Comprobaciones antes de vender

- Cargar el WhatsApp real en **Mi negocio** y probar el botón desde un celular.
- Revisar las seis **descripciones**: se redactaron de manera orientativa según las fotos, no como una lista contractual de contenido. Especificar cantidades y presentaciones reales.
- Completar precios reales de ingredientes y recetas, ya que arrancan en $0 a falta de datos.
- Completar los costos de envío a las localidades donde entregan; por defecto dicen “a confirmar”.
- Definir precios de extras y dedicatorias, o mantener “a cotizar”.
- Crear promociones reales cuando existan. No se inventaron descuentos.
- Comprobar si los productos también ofrecidos como meriendas mantienen el mismo armado; en la pestaña **Meriendas** se deshabilita la personalización.
- Guardar una copia de seguridad periódicamente desde el panel.

## 7. Importante sobre el hosting y el archivo de fotos

Las seis imágenes originales están en `assets/img/`. Si subís una imagen desde el panel en **modo local**, esa nueva imagen se guarda comprimida en tu navegador; no se carga en GitHub Pages. Con Supabase activo sí se carga al bucket de fotos, y queda disponible en todos los equipos.

La ventana de novedades se muestra una vez por sesión del navegador para no molestar al cliente cada vez que cambia de sección. El tiempo se configura entre 10 y 20 segundos.

**Esta es una primera versión funcional con pedido por WhatsApp, no una tienda con pago online ni integración automática de mensajes.**

## 8. Recorrido de la novedad de entrada

En la primera visita de cada sesión, se muestra la novedad activa entre 10 y 20 segundos. Al cerrarse, la página lleva al catálogo: arriba de los productos aparece la misma novedad en una franja destacada. Además queda guardada en la sección **Novedades** de la tienda. Si el cliente empieza a interactuar con el carrito antes de que aparezca el anuncio, este no le interrumpe la compra.
