# Setup Guide — Ser Programador

Guía paso a paso para instalar, configurar y ejecutar el proyecto **Ser Programador** en un entorno local.

---

## Requisitos

| Herramienta | Versión mínima | Cómo verificar |
|-------------|---------------|----------------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| PostgreSQL | 16 | `psql --version` |

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

Las dependencias del frontend se instalan desde la raíz. El backend en `apps/backend/` usa su propio `node_modules` ya compilado.

---

## 3. Variables de entorno

### Frontend (raíz)

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001` | URL base de la API |

### Backend (`apps/backend/.env`)

El archivo ya existe con valores preconfigurados:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:4189@localhost:5432/serprogramador` | Conexión PostgreSQL |
| `PORT` | `3001` | Puerto del servidor |
| `JWT_SECRET` | `dev-secret-key-min-16-chars` | Clave secreta para JWT |
| `JWT_EXPIRES_IN` | `8h` | Expiración del token |
| `CORS_ORIGIN` | `http://localhost:5173` | Origen permitido para CORS |
| `MAX_SLOTS_PER_DAY` | `2` | Cupos máximos por día |
| `CAMPAIGN_YEAR` | `2026` | Año de la campaña |
| `ALLOWED_MONTHS` | `7,8` | Meses habilitados (Julio, Agosto) |
| `MIN_AGE` | `15` | Edad mínima |
| `ADMIN_USERNAME` | `admin` | Usuario admin |
| `ADMIN_PASSWORD` | `admin123` | Contraseña admin |

---

## 4. Base de datos

Necesitas una instancia de PostgreSQL 16 corriendo en `localhost:5432` con:

- **Usuario:** `postgres`
- **Contraseña:** `4189`
- **Base de datos:** `serprogramador`

Puedes crearla con:

```bash
psql -U postgres -c "CREATE DATABASE serprogramador;"
```

> La estructura de tablas y datos de prueba ya están precargados en la base de datos.

---

## 5. Ejecutar la aplicación

### Backend

```bash
cd apps/backend
node dist/server.js
# Servidor en http://localhost:3001
```

### Frontend (desde la raíz, en otra terminal)

```bash
npm run dev
# Servidor en http://localhost:5173
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

### Login admin

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
# → {"token":"eyJ...","expiresIn":"8h","admin":{...}}
```

### Abrir frontend

Ve a `http://localhost:5173` — deberías ver la landing page con el flujo de reserva.

---

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con flujo de reserva wizard |
| `/admin/login` | Login de administrador |
| `/admin` | Panel de administración (requiere login) |
| `/krakedev` | Splash animado de KrakeDev |
| `/krakedev/home` | Hero page de KrakeDev |

---

## Solución de problemas

### Error de conexión a BD

```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres -c "SELECT 1"

# Verificar DATABASE_URL en apps/backend/.env
```

### Puerto 3001 ocupado

```bash
netstat -ano | findstr :3001
```

### Puerto 5173 ocupado

Vite usa el siguiente puerto disponible automáticamente.

### Error CORS

Verifica que `CORS_ORIGIN` en `apps/backend/.env` coincida con la URL del frontend (`http://localhost:5173`).

---

## Estructura de archivos relevante

```
SerProgramador/
├── .env.example
├── src/                     ← Frontend (React)
│   ├── components/ui/       ← Componentes atómicos
│   ├── constants/           ← Rutas, API endpoints
│   ├── contexts/            ← Proveedores globales
│   ├── features/            ← Módulos por dominio
│   │   ├── admin/           ← Panel admin
│   │   ├── krakedev/        ← Branding KrakeDev
│   │   └── reservation/     ← Flujo de reserva
│   ├── layouts/             ← Layouts (Main, Admin)
│   ├── pages/               ← Páginas por ruta
│   ├── routes/              ← Configuración de rutas
│   └── services/            ← Servicios API (Axios)
├── apps/backend/            ← Backend (Express + Prisma)
│   ├── .env
│   ├── package.json
│   └── dist/                ← Código compilado
├── package.json
├── vite.config.ts
└── tsconfig.json
```
