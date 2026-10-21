# Dulces Desayunos y Meriendas — actualización 3.3

## ¿Qué corrige?

- El formulario de ingreso y el menú del panel ya no aparecen juntos. Sólo se habilita el panel tras un inicio de sesión correcto.
- Un collage de seis fotos originales de bandejas ocupa el lado izquierdo en computadoras; en celulares se presenta una galería compacta deslizable.
- La pantalla de acceso no muestra el selector claro/oscuro ni un logo superior. Respeta automáticamente el tema que eligió el visitante en la tienda, o el del dispositivo si no eligió ninguno.
- Dentro del panel se conserva el selector claro/oscuro.

## Cómo actualizar el sitio publicado

1. Guardá una copia de tu versión actual.
2. Abrí el ZIP **SOLO_ARCHIVOS_MODIFICADOS** y subí exactamente sus tres archivos a tu repositorio GitHub, respetando las rutas (`admin.html`, `assets/admin.js`, `assets/styles.css`).
3. **No sobrescribas `config.js`**; ahí está la conexión de Supabase. No es necesario ejecutar SQL.
4. Esperá que Vercel muestre la última implementación como lista y abrí `/admin.html` en una pestaña privada.
5. Comprobá que antes del ingreso no se ve ningún menú lateral. Iniciá sesión con un usuario previamente autorizado en Supabase y verificá que desaparezca el formulario y aparezca solamente el panel.
6. Probá el tema claro/oscuro desde la tienda y actualizá `/admin.html` para comprobar que conserva la apariencia. Cambiá de tema una vez dentro del panel.

Si el ingreso responde "Este correo no tiene permiso de administrador" o "Invalid login credentials", significa que Supabase rechazó las credenciales/permisos. Esta actualización no modifica usuarios ni contraseñas.

**Nota:** si no hay claves Supabase configuradas en el `config.js` local, se muestra un modo demostración sin autenticación: no lo uses como panel de administración público para gestionar pedidos reales.
