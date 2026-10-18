# Dulce · Desayunos y Meriendas

Primera versión funcional, mobile-first, reconstruida desde cero. Incluye tienda pública, catálogo por categorías, personalización exclusiva para desayunos, carrito local, flujo de pedido, novedad de entrada con cierre automático a los 15 segundos y panel administrativo.

## Ejecutar en local

Requisitos: Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Abrí la URL local indicada por la consola. Rutas principales:

- `/`: tienda pública.
- `/admin-demo`: panel completo con datos de muestra y cambios guardados en `localStorage`.
- `/admin`: acceso protegido por ChatGPT/Sites y lista de correos autorizados.

## Configurar el administrador seguro

En desarrollo, copiá `.env.example` como `.env.local` y completá:

```env
ADMIN_EMAILS=duena@ejemplo.com,socio@ejemplo.com
```

En OpenAI Sites, cargá `ADMIN_EMAILS` como variable de entorno desde la configuración del sitio. `/admin` exige una sesión válida y verifica el correo en el servidor. La ruta no aparece en la navegación pública y, sin una lista configurada, deniega todo acceso.

## Qué funciona en esta primera versión

- Diseño responsive para celular, tablet y escritorio.
- Filtros de catálogo, promociones, desayunos, meriendas, picadas y regalos.
- Los productos originales Clásico, Matero y Chocotorta conservan nombres y precios del archivo anterior.
- Personalizador únicamente para desayunos, con extras, mensaje y total estimado.
- Carrito persistente por dispositivo, cantidades y resumen copiable para coordinar por WhatsApp o Instagram.
- Novedad de apertura durante 15 segundos y sección permanente de novedades.
- Panel administrativo profesional con resumen, ingresos/egresos, insumos, costos, precio editable, márgenes, promociones y novedades.
- Autenticación y autorización reales en `/admin` cuando se publica en Sites y se configura `ADMIN_EMAILS`.

## Alcance demostrativo y siguiente etapa

El catálogo ampliado, movimientos financieros y recetas son datos de demostración. En `/admin-demo`, las ediciones se guardan solo en el navegador. No hay pagos ni pedidos reales.

Para producción comercial se debe agregar:

1. D1 (o backend equivalente) para productos, recetas, insumos, novedades, pedidos y movimientos.
2. Endpoints protegidos que validen la identidad y el rol de administrador en cada escritura.
3. Integración de pago y cálculo de envío.
4. Canal de WhatsApp/Instagram real y consentimiento de datos.
5. Carga de imágenes en almacenamiento persistente y copias de seguridad.

## Compilar y desplegar

```bash
npm run build
```

El proyecto está preparado para OpenAI Sites mediante `.openai/hosting.json`. Para otro proveedor compatible con Next.js/Vinext, configurá `ADMIN_EMAILS` en el entorno y asegurá el mecanismo de identidad equivalente antes de habilitar `/admin`.
