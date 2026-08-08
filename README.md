# Mini Sistema de Trámites

Sistema para gestionar trámites vehiculares con máquina de estados y historial de seguimiento.

## Requisitos Previos

- Node.js 20.19.x o superior
- pnpm 8.x o superior (o npm 10)
- PostgreSQL 14+ (Neon PostgreSQL)
- Git

## Base de Datos

El proyecto usa Neon PostgreSQL como base de datos.

1. Crear una cuenta en [Neon](https://neon.tech)
2. Crear un nuevo proyecto y obtener la cadena de conexión
3. Ejecutar el script de base de datos:

```bash
# Copiar el contenido de database/schema.sql y ejecutarlo en la consola de Neon
# O usar psql:
psql -h ep-xxxxx.us-east-2.aws.neon.tech -U neondb_owner -d neondb < database/schema.sql

# Variables de Entorno

## Backend (.env)

Crear archivo `.env` en la carpeta `backend/`:

```env
# Configuración de la base de datos
DB_HOST=ep-xxxxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=tu_password
DB_NAME=neondb

# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de CORS
FRONTEND_URL=http://localhost:5173
```

## Frontend (.env)

Crear archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

# Instalación y Ejecución

## Backend

```bash
cd backend
pnpm install
pnpm run dev
```

El servidor correrá en:

`http://localhost:5000`

## Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

La aplicación correrá en:

`http://localhost:5173`

# Endpoints Principales

## Clientes

- `GET /api/clientes` - Listar clientes (con búsqueda)
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Editar cliente
- `GET /api/clientes/:id` - Obtener cliente

## Trámites

- `GET /api/tramites` - Listar trámites (con filtros y paginación)
- `POST /api/tramites` - Crear trámite
- `GET /api/tramites/:id` - Obtener detalle de trámite
- `PUT /api/tramites/:id` - Editar trámite
- `DELETE /api/tramites/:id` - Eliminar trámite
- `POST /api/tramites/:id/cambiar-estado` - Cambiar estado del trámite

# Decisiones Técnicas

## Backend

- **PostgreSQL + Neon**: Uso de base de datos PostgreSQL con Neon para simplicidad y escalabilidad.
- **Sin ORM**: Implementación directa con `pg` para mayor control y rendimiento.
- **Arquitectura por capas**: Router → Controller → Service → Repository.
- **Zod**: Validación de datos en el borde.
- **Transacciones**: Uso de transacciones PostgreSQL para operaciones atómicas.

## Frontend

- **React 19 + Vite**: Stack moderno para desarrollo rápido.
- **TanStack Query**: Manejo de estado del servidor.
- **React Hook Form + Zod**: Manejo de formularios con validación.
- **shadcn/ui**: Componentes UI consistentes.
- **Tailwind CSS**: Estilos utilitarios.

## Base de Datos

- **Tablas**: `clientes`, `tramites`, `tramite_seguimiento`.
- **Índices**: Optimizados para búsquedas frecuentes.
- **Restricciones**: `UNIQUE`, `CHECK`, `FK` con `CASCADE` donde corresponde.

# Lo que Quedó Fuera

- **Tests**: No implementé pruebas unitarias por tiempo, pero las estructuraría con Vitest.
- **Autenticación JWT**: No implementada, se podría agregar como mejora.
- **Docker Compose**: No incluido, pero sería fácil de agregar.
- **TypeScript**: Usé JavaScript por simplicidad, pero migraría a TypeScript en una versión futura.

# Mejoras Futuras

1. Sistema de autenticación con JWT.
2. Tests unitarios e integración.
3. Docker Compose para despliegue fácil.
4. Migración a TypeScript.
5. Mejores animaciones y feedback visual.
6. Sistema de notificaciones en tiempo real.
7. Exportación de datos a Excel/PDF.
8. Dashboard con métricas y estadísticas.

# Estructura del Proyecto

```text
mini-sistema-tramites/
├── backend/
│   └── src/
│       ├── config/           # Configuración (DB, env)
│       ├── domains/          # Dominios de negocio
│       │   ├── cliente/      # Dominio Cliente
│       │   │   ├── cliente.controller.js
│       │   │   ├── cliente.service.js
│       │   │   ├── cliente.repository.js
│       │   │   ├── cliente.routes.js
│       │   │   └── cliente.schema.js
│       │   └── tramite/       # Dominio Trámite
│       │       ├── tramite.controller.js
│       │       ├── tramite.service.js
│       │       ├── tramite.repository.js
│       │       ├── tramite.routes.js
│       │       ├── tramite.schema.js
│       │       └── subdomains/
│       │           └── seguimiento/  # Subdominio Seguimiento
│       │               ├── seguimiento.service.js
│       │               └── seguimiento.repository.js
│       ├── middlewares/      # Middlewares (error, validación)
│       ├── utils/            # Utilidades
│       └── server.js         # Punto de entrada
├── frontend/
│   └── src/
│       ├── components/       # Componentes UI
│       ├── domains/          # Dominios de negocio
│       │   ├── cliente/
│       │   └── tramite/
│       │       └── subdomains/
│       │           └── seguimiento/
│       ├── hooks/            # Custom hooks
│       ├── lib/              # Utilidades y configuración
│       ├── pages/            # Páginas principales
│       ├── services/         # Servicios API
│       └── App.jsx
├── database/
│   └── schema.sql            # Script de base de datos
├── .gitignore
└── README.md
```

# Notas de Ejecución

1. Asegurar que PostgreSQL esté corriendo y accesible.
2. Configurar correctamente las variables de entorno.
3. El backend y frontend deben correr en puertos diferentes.
4. El frontend usa `VITE_API_URL` para apuntar al backend.