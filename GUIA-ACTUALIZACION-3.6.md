# Dulces Desayunos y Meriendas — actualización 3.6

## Cambios
- En Administrador → Materias primas → Nuevo componente / Editar: seleccionar **Categoría en Personalizar** (Bebidas, Panificados, Dulces, Salados u Otros).
- Ya no se clasifica automáticamente por nombre. Para materias primas anteriores sin categoría se propone una categoría inicial; podés cambiarla y guardarla cuando quieras.
- En Administrador → Mis productos → Agregar / Editar: se mantiene la categoría principal del catálogo. Además, hay una opción **opcional** para ofrecer un producto como componente dentro de Personalizar y asignarle su grupo y disponibilidad. Si no la activás, el producto sigue comportándose exactamente igual que antes.
- En tienda → Personalizar ya no hay «Ver agotados»: se muestran solo componentes disponibles.
- En Administrador → Vista general → Stock de «Personalizar»: botón **Ver agotados** con acceso a editar su disponibilidad.

## Instalación
1. Conservá tu `config.js` real y no subas claves privadas.
2. Subí los archivos de esta actualización a la **raíz** del repositorio respetando las carpetas y reemplazando los existentes.
3. Verificá que Vercel despliegue el nuevo commit; recargá con Ctrl+Shift+R.
4. Entrá a **Materias primas** y revisá o guardá las categorías de los componentes anteriores para que queden publicadas explícitamente.
5. Probá el buscador y los filtros del personalizador, y **Vista general → Ver agotados**.

No es necesario ejecutar SQL. Los costos internos no se publican en la tienda, solo precio, categoría, nombre, unidad y disponibilidad.

**Atención:** La casilla opcional de ofrecer un producto existente como componente usa el precio de ese producto. Un mismo elemento podría aparecer también en la tienda como producto completo; usala solo si tiene sentido comercial.
