# Ser Programador — Krakedev

Aplicación web para la campaña **Sé Programador por un Día** de Krakedev. Sistema de reserva de cupos con calendario interactivo, generación de tickets (PDF + QR), y panel de administración protegido con JWT.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript 6 + Vite 8 |
| Estilos | Tailwind CSS 4 |
| Routing | React Router 7 |
| Estado | React Context + useReducer, TanStack React Query 5 |
| HTTP | Axios |
| Backend | Express 5 + Prisma 6 + PostgreSQL 16 |
| PDF | jsPDF |
| QR | qrcode |
| Iconos | Lucide React |
| Linter | Oxlint |

## Funcionalidades

- **Landing page** con temática oscura y llamativo splash animado (KrakeDev)
- **Calendario interactivo** con disponibilidad en tiempo real (cupos: 2/día)
- **Formulario de registro** con validación en frontend
- **Confirmación** con código QR (Google Maps) y descarga de PDF
- **Cancelación vía WhatsApp** con mensaje predefinido
- **Panel admin** con login JWT, dashboard de estadísticas y tabla paginada de reservas
- **Backend API** con Express + Prisma + PostgreSQL

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con flujo de reserva |
| `/admin` | Panel de administración (protegido) |
| `/admin/login` | Login de administrador |
| `/krakedev` | Splash animado de KrakeDev |
| `/krakedev/home` | Hero page de KrakeDev |

## Inicio rápido

```bash
# Instalar dependencias del frontend (raíz)
npm install

# Iniciar frontend en desarrollo
npm run dev            # http://localhost:5173

# El backend debe estar corriendo en puerto 3001
# (compilado previamente en apps/backend/dist/)
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite dev server (frontend solo) |
| `npm run dev:full` | Frontend + backend simultáneamente |
| `npm run build` | Type-check + build de producción |
| `npm run lint` | Oxlint |
| `npm run preview` | Vista previa del build |
