# Setup Guide — Ser Programador

Guía paso a paso para instalar, configurar y ejecutar el proyecto **Ser Programador** en un entorno local.

---

## Requisitos

| Herramienta | Versión mínima | Cómo verificar |
|-------------|---------------|----------------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Docker Desktop | 4.x | `docker --version && docker compose version` |
| Git | 2.x | `git --version` |

---

## 1. Clonar el repositorio

```bash
git clone <repository-url>
cd SerProgramador
```

---

## 2. Instalar dependencias

```bash
npm install
```

Esto instala las dependencias del monorepo raíz y de ambos workspaces (`apps/frontend` y `apps/backend`).

---

## 3. Variables de entorno

Copia los archivos de ejemplo:

```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

### Frontend (`apps/frontend/.env`)

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001` | URL base de la API |

### Backend (`apps/backend/.env`)

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/serprogramador` | Conexión PostgreSQL |
| `JWT_SECRET` | *(generar uno)* | Clave secreta para JWT — usar `openssl rand -hex 32` |
| `CORS_ORIGIN` | `http://localhost:5173` | Origen permitido para CORS |

---

## 4. Base de datos

### 4.1 Iniciar PostgreSQL con Docker

```bash
docker compose up -d
# Puerto: 5432
# User: postgres
# Password: postgres
# DB: serprogramador
```

### 4.2 Ejecutar migraciones

```bash
npm run db:migrate
```

Crea las tablas: `Participant`, `Reservation`, `Ticket`, `Admin`, `BlockedDate`.

### 4.3 Poblar datos de prueba

```bash
npm run db:seed
```

Carga datos de ejemplo:
- Admin por defecto: `admin` / `admin123`
- Participantes de prueba
- Reservas en distintas fechas
- Disponibilidad para Julio y Agosto 2026

---

## 5. Ejecutar la aplicación

### Desarrollo (ambos simultáneamente)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- API base: `http://localhost:3001/api/v1`

### Solo frontend

```bash
npm run dev:frontend
```

### Solo backend

```bash
npm run dev:backend
```

---

## 6. Verificar que todo funciona

### Health check

```bash
curl http://localhost:3001/health
# → {"status":"ok","service":"serprogramador-api"}
```

### Obtener disponibilidad

```bash
curl http://localhost:3001/api/v1/availability?month=7
```

### Abrir frontend

Ve a `http://localhost:5173` — deberías ver la landing page de la campaña.

---

## Solución de problemas

### Puerto 5432 ocupado

```bash
# Verificar qué usa el puerto
netstat -ano | findstr :5432
# Cambiar puerto en docker-compose.yml y DATABASE_URL
```

### Prisma Client no encontrado

```bash
npm run db:generate
```

### Error de conexión a BD

1. Verifica que Docker esté corriendo
2. Verifica `docker ps` para confirmar el contenedor
3. Verifica `DATABASE_URL` en `apps/backend/.env`

### Puertos 5173 o 3001 ocupados

```bash
# Verificar proceso en el puerto
netstat -ano | findstr :5173
# Vite usa el siguiente disponible automáticamente
```

### Tests fallan

```bash
npm run quality
# Asegúrate de que la BD esté migrada y seedeada
```

---

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run quality` | Lint + typecheck + tests (todo junto) |
| `npm run db:reset` | Reset completo de BD (drop + migrate + seed) |
| `npm run format` | Formatear código con Prettier |
| `npm run typecheck` | Verificar tipos TypeScript |

---

## Estructura de archivos de configuración

```
SerProgramador/
├── apps/
│   ├── frontend/
│   │   ├── .env.example
│   │   ├── .env              ← crear localmente
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   └── backend/
│       ├── .env.example
│       ├── .env              ← crear localmente
│       ├── prisma/
│       │   └── schema.prisma
│       └── tsconfig.json
├── docker-compose.yml
├── .oxlintrc.json
├── .prettierrc.json
├── commitlint.config.js
└── .gitignore
```
