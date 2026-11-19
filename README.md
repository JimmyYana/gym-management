# Gym Management

Aplicación web universitaria de gestión de gimnasio con interfaz móvil basada en la captura de referencia. Usa Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide React y Fetch API.

## Instalación local

Requiere Node.js 20.9 o superior y npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. En producción ejecuta `npm run build` y `npm start`.

Las variables `MOCKAPI_PLANES_URL` y `MOCKAPI_MIEMBROS_URL` definen las URL completas de las dos colecciones. El archivo `.env.example` contiene las URL del proyecto. Los servicios las leen en el servidor y el navegador usa rutas relativas de la aplicación. `.env.local` queda ignorado por Git.

## Uso

- **Planes** – en `/planes` puedes consultar los planes de MockAPI y pulsar uno activo para preseleccionarlo en el registro.
- **Miembros** – en `/miembros` puedes buscar por nombre o celular y filtrar por estado, plan y horario. Cada tarjeta muestra el plan actual, incluso si cambió de nombre. La papelera solicita confirmación.
- **Registro y edición** – usa el botón rojo **+** o el lápiz de una tarjeta. Introduce una URL HTTP(S) en **Agregar foto** para ver una vista previa. Guarda los datos para volver al listado. Los importes pendientes se calculan a partir del precio del plan y el monto pagado.
- **Administración** – en `/planes/admin` puedes crear, editar y eliminar planes. La duración se introduce en días y los beneficios se escriben uno por línea. Un plan con miembros asociados debe reasignarse antes de poder eliminarlo.

## Arquitectura

```text
src/
  app/          Páginas, estilos globales, manifest y rutas internas
  components/
    atoms/      Controles, logo y avatar
    molecules/  Tarjetas, filtros, campos y estados de recursos
    organisms/  Cabecera, navegación, cuadrículas y formularios
    templates/  Composición de las pantallas
  services/     Servicios independientes de planes y miembros
  types/        Modelos internos
  schemas/      Validación Zod de formularios y respuestas
  hooks/        Estado de solicitudes y reintentos
  lib/          Clientes HTTP y respuestas de rutas
  utils/        Filtros, fechas y cálculo de saldo
  constants/    Opciones de horario y pago
tests/          Pruebas Playwright y servidor MockAPI simulado
```

Las colecciones internas `/api/planes` y `/api/miembros` ofrecen GET y POST. Sus rutas `/[id]` ofrecen GET, PUT y DELETE. El servidor normaliza `name` o `nombre` a `nombre`, valida los beneficios y relaciona miembros con planes por IDs de cadena. Comprueba números de miembro duplicados, planes inexistentes y dependencias antes de eliminar un plan. MockAPI no ofrece transacciones entre sus dos proyectos. Las escrituras iniciadas por una misma instancia de la aplicación se serializan.

## Verificación

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright inicia la compilación de producción y un servidor MockAPI simulado en puertos locales. Las pruebas de escritura se ejecutan exclusivamente en ese servidor. Para comprobar las dos conexiones reales sin modificar datos, inicia la aplicación con `.env.local` y consulta ambas rutas mediante GET.

## PWA

En un navegador compatible en Android, abre la aplicación mediante HTTPS y usa **Instalar aplicación** o **Añadir a pantalla de inicio**. El manifest define los iconos, el tema y el modo standalone. El CRUD requiere conexión y las rutas internas se devuelven con `Cache-Control: private, no-store`.

Los nombres, beneficios y estados que se muestran dependen del contenido de MockAPI. Si todos los planes están inactivos, activa uno desde `/planes/admin` para habilitar el registro.

La configuración corresponde a una demo universitaria sin autenticación. Usa datos de prueba y restringe el acceso a la aplicación y a las colecciones antes de utilizar datos personales reales.
