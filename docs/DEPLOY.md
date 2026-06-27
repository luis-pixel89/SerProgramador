# Deployment — Ser Programador

## Arquitectura
- **Frontend**: Vite + React → Vercel (estático)
- **Backend**: Express + Prisma → Render (Web Service)
- **Base de datos**: PostgreSQL → Render (PostgreSQL)

---

## 1. Preparación

### Variables de entorno locales
```bash
# apps/backend/.env — backend local
DATABASE_URL="postgresql://postgres:tu-pass@localhost:5432/serprogramador"
JWT_SECRET=dev-secret-key-min-16-chars
CORS_ORIGIN=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
PORT=3001
MAX_SLOTS_PER_DAY=2
CAMPAIGN_YEAR=2026
ALLOWED_MONTHS=7,8
MIN_AGE=15
```

```bash
# .env — frontend local (raíz del proyecto)
VITE_API_BASE_URL=http://localhost:3001
```

---

## 2. Deploy — Frontend (Vercel)

### Archivos necesarios
- `vercel.json` — rewrites para SPA routing
- `.env.production` — referencia de variables (se configuran en dashboard)

### Pasos
1. Ir a [vercel.com](https://vercel.com) → Add New → Project
2. Importar `luis-pixel89/SerProgramador`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment Variables:
   - `VITE_API_BASE_URL` = `https://serprogramador-api.onrender.com`
6. Deploy

### Actualizar frontend
```bash
git add -A
git commit -m "mensaje"
git push origin main
# → Vercel redeployea automáticamente
```

---

## 3. Deploy — Backend (Render)

### Web Service
| Campo | Valor |
|-------|-------|
| Runtime | Node |
| Build Command | `cd apps/backend && npm ci && npx prisma generate && npx prisma db push` |
| Start Command | `node apps/backend/dist/server.js` |

### Environment Variables (Render → Web Service → Environment)
| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Internal Database String de Render PostgreSQL |
| `JWT_SECRET` | 16+ caracteres aleatorios |
| `CORS_ORIGIN` | `https://tu-app.vercel.app` |
| `NODE_ENV` | `production` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` |
| `PORT` | (Render asigna automáticamente) |

### Actualizar backend
Solo pushear a `main` → Render redeployea automáticamente.

---

## 4. Base de datos — Render PostgreSQL

### Creación
1. En Render → New + → PostgreSQL
2. Nombre: `serprogramador-db`
3. Plan: Free
4. Copiar **Internal Database String** → usarla como `DATABASE_URL` en el Web Service

### Migraciones automáticas
El Build Command del Web Service incluye `npx prisma db push`, que sincroniza el schema de Prisma con la base de datos en cada deploy.

---

## 5. Borrar datos

### Desde DBeaver
1. Conectar usando **External Database URL** (Render → PostgreSQL → Connections)
   - Host, Port, Database, Username, Password (no pegar la URL completa)
2. Abrir un **SQL Editor** y ejecutar:

```sql
TRUNCATE "Reservation", "Participant", "Ticket", "ReservationCounter" RESTART IDENTITY CASCADE;
```

Esto vacía todas las tablas y reinicia los contadores.

### Desde pgAdmin
Mismos pasos, usando la External Database URL como conexión.

---

## 6. Comandos útiles

```bash
# Desarrollo local
npm run dev:full                    # frontend + backend

# Sincronizar schema Prisma con DB local
cd apps/backend
npx prisma db push

# Ver datos en DB local
npx prisma studio

# Build frontend
npm run build

# Push a producción
git push origin main
```
