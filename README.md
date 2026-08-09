# Prueba Técnica — Mini Sistema de Trámites

Sistema web para la gestión de clientes y trámites, con seguimiento del estado de cada trámite.

## Stack Tecnológico

### Backend

- Node.js
- TypeScript
- Express 5
- Sequelize 6
- mysql2
- MySQL / MariaDB
- Zod para validación
- Arquitectura por capas y separación por dominios

### Frontend

- React
- JavaScript / JSX
- Vite 8
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Axios

### Base de Datos

- MySQL / MariaDB
- Script de estructura disponible en `database/schema.sql`
- Relaciones mediante claves foráneas
- Restricciones e índices definidos según los requerimientos del sistema

## Funcionalidades

### Clientes

- Listado de clientes
- Búsqueda de clientes
- Creación de clientes
- Edición de clientes
- Consulta de información de un cliente

### Trámites

- Listado de trámites
- Búsqueda y filtrado
- Paginación
- Creación de trámites
- Edición de trámites
- Consulta del detalle de un trámite
- Eliminación de trámites según las reglas de negocio
- Cambio de estado del trámite

### Seguimiento

- Registro del seguimiento de los trámites
- Consulta del historial de seguimiento
- Validación de transiciones de estado
- Reglas de negocio asociadas al ciclo de vida del trámite

## Endpoints Principales

### Clientes

```
GET    /api/clientes?search=&limit=10&page=1
POST   /api/clientes
PUT    /api/clientes/:id
GET    /api/clientes/:id
```

### Trámites

```
GET    /api/tramites?estado=&search=&limit=10&page=1
POST   /api/tramites
GET    /api/tramites/:id
PUT    /api/tramites/:id
DELETE /api/tramites/:id
POST   /api/tramites/:id/cambiar-estado
```

### Seguimiento

```
GET /api/tramites/:id/seguimientos
```

## Arquitectura

El backend está organizado por dominios y utiliza una arquitectura por capas:

```
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Sequelize
  ↓
MySQL / MariaDB
```

Los servicios contienen las reglas de negocio, mientras que los repositorios encapsulan el acceso a datos.

El dominio de trámites contiene el subdominio de seguimiento:

```
domains/
├── cliente/
└── tramite/
    └── seguimiento/
```

## Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── models/
│   │   │       ├── Cliente.ts
│   │   │       ├── Tramite.ts
│   │   │       ├── TramiteSeguimiento.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── domains/
│   │   │   ├── cliente/
│   │   │   │   ├── cliente.controller.ts
│   │   │   │   ├── cliente.repository.ts
│   │   │   │   ├── cliente.routes.ts
│   │   │   │   ├── cliente.schema.ts
│   │   │   │   ├── cliente.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── tramite/
│   │   │       ├── tramite.controller.ts
│   │   │       ├── tramite.repository.ts
│   │   │       ├── tramite.routes.ts
│   │   │       ├── tramite.schema.ts
│   │   │       ├── tramite.service.ts
│   │   │       ├── index.ts
│   │   │       └── seguimiento/
│   │   │           ├── seguimiento.controller.ts
│   │   │           ├── seguimiento.repository.ts
│   │   │           ├── seguimiento.routes.ts
│   │   │           ├── seguimiento.schema.ts
│   │   │           ├── seguimiento.service.ts
│   │   │           └── index.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── errors.ts
│   │   │   └── estados.ts
│   │   │
│   │   └── server.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── cliente/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   │
│   │   │   └── tramite/
│   │   │       ├── api/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── seguimiento/
│   │   │           ├── api/
│   │   │           ├── components/
│   │   │           └── hooks/
│   │   │
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── backend/.env.example
├── frontend/.env.example
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Configuración

### MySQL / MariaDB

El backend utiliza Sequelize como ORM y mysql2 como driver de conexión.

1. Crear previamente una base de datos MySQL/MariaDB.
2. Ejecutar el script de estructura y seed:

```bash
mysql -u root -p < database/schema.sql
```

### Variables de Entorno

Copiar el archivo `.env.example` a `.env` en cada carpeta y completar con los valores correspondientes.

**Backend** (`backend/.env.example`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tramites_db
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Los nombres de las variables del backend deben coincidir con los definidos en `backend/src/config/env.ts`.

## Instalación

```bash
pnpm install
```

## Ejecución

### Backend

```bash
cd backend
pnpm install
pnpm run dev
```

Servidor:

http://localhost:5000

### Frontend

En otra terminal:

```bash
cd frontend
pnpm install
pnpm run dev
```

Aplicación:

http://localhost:5173

## Validación del Proyecto

### Backend

Verificar tipado de TypeScript:

```bash
cd backend
npx tsc --noEmit
```

### Frontend

Generar build de producción:

```bash
cd frontend
npx vite build
```

El frontend compila correctamente con Vite.

## Base de Datos

Principales entidades:

```
clientes
    │
    └── tramites
          │
          └── tramite_seguimiento
```

Las relaciones, claves foráneas, índices y restricciones correspondientes están definidas en `database/schema.sql`.

## Lo Implementado

- Gestión de clientes.
- Gestión de trámites.
- Gestión del seguimiento de trámites.
- Validación de datos mediante Zod.
- Arquitectura por dominios en el backend.
- Separación Controller / Service / Repository.
- Persistencia mediante Sequelize.
- MySQL / MariaDB.
- Paginación y filtros de trámites.
- Cambio de estados.
- Reglas de negocio para las transiciones de estado.
- Frontend React organizado por módulos y dominios.
- Formularios mediante React Hook Form.
- Manejo del estado del servidor mediante TanStack Query.
- Componentes de interfaz mediante shadcn/ui.

## Fuera del Alcance

Actualmente no se incluyen:

- Tests unitarios.
- Autenticación JWT.
- Docker Compose.

Estas funcionalidades pueden incorporarse posteriormente.

## Contrato de Respuesta

### Respuesta exitosa

```json
{
  "ok": true,
  "data": {}
}
```

### Error de validación

HTTP 422:

```json
{
  "ok": false,
  "mensaje": "Datos inválidos",
  "errores": [
    {
      "campo": "num_doc",
      "detalle": "requerido"
    }
  ]
}
```

### Error de negocio

HTTP 409:

```json
{
  "ok": false,
  "mensaje": "No se puede pasar de CERRADO a EN_FIRMAS"
}
```
