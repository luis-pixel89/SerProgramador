# Technical Reference — Ser Programador

Referencia técnica completa del proyecto **Ser Programador**, una aplicación web para la campaña *Sé Programador por un Día* de Krakedev.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19 |
| Bundler | Vite | 8 |
| Estilos | Tailwind CSS | 4 |
| Routing | React Router | 7 |
| Estado wizard | React Context + useReducer | — |
| Server state | TanStack React Query | 5.101 |
| HTTP Client | Axios | 1.18 |
| PDF | jsPDF | 4 |
| QR | qrcode | 1.5 |
| Iconos | Lucide React | 1.21 |
| Backend | Express | 5 |
| ORM | Prisma | 6 |
| Base de datos | PostgreSQL | 16 |
| Lenguaje | TypeScript | ~6.0 |
| Linter | Oxlint | — |

---

## Decisiones técnicas clave

| Decisión | Alternativas | Motivo |
|----------|-------------|--------|
| React Context + useReducer en vez de Redux/Zustand | Redux, Zustand | Estado acotado al wizard, sin necesidad de librería externa |
| TanStack React Query para datos del servidor | fetch directo, SWR | Caching automático, stale management, re-fetch |
| Tailwind en vez de CSS Modules/Styled | CSS Modules, Styled Components | Velocidad de desarrollo, consistencia, bundle pequeño |
| Axios con interceptores | fetch nativo | Interceptors para errores, tipado, configuración centralizada |
| jsPDF + qrcode para tickets | librerías server-side | Generación 100% en frontend, cero carga del servidor |
| TypeScript estricto | JavaScript | Seguridad de tipos, mejor DX, detección temprana de errores |

---

## Flujo de datos

### Reserva de participante (con backend real)

```
Usuario                    Frontend (React)                 Backend (Express)          PostgreSQL
   │                            │                              │                        │
   │  Abre landing page         │                              │                        │
   │ ────────────────────────> │                              │                        │
   │                            │                              │                        │
   │  Selecciona fecha          │                              │                        │
   │ ────────────────────────> │ ─── GET /api/v1/availability ──> ─── query ──────────> │
   │                            │                              │ <── rows ───────────── │
   │                            │ <── JSON disponibilidad ──── │                        │
   │                            │                              │                        │
   │  Llena formulario          │                              │                        │
   │ ────────────────────────> │  Valida con reglas locales    │                        │
   │                            │                              │                        │
   │  Confirma reserva          │                              │                        │
   │ ────────────────────────> │ ─── POST /api/v1/reservations ──>                        │
   │                            │                              │ ─── validate ────────> │
   │                            │                              │ ─── insert ──────────> │
   │                            │                              │ <── confirmation ───── │
   │                            │ <── 201 + reservation data ── │                        │
   │                            │                              │                        │
   │  Ve QR + descarga PDF     │                              │                        │
   │ <──────────────────────── │                              │                        │
```

### Panel admin

```
Admin                        Frontend (Admin)                Backend (Express)          PostgreSQL
   │                            │                              │                        │
   │  Login                     │                              │                        │
   │ ────────────────────────> │ ─── POST /api/v1/auth/login ──>                        │
   │                            │                              │ ─── verify ──────────> │
   │                            │                              │ <── JWT token ──────── │
   │                            │ <── token (sessionStorage) ── │                        │
   │                            │                              │                        │
   │  Ver dashboard             │                              │                        │
   │ ────────────────────────> │ ─── GET /api/v1/admin/dashboard (JWT)                  │
   │                            │                              │ ─── stats query ─────> │
   │                            │                              │ <── results ────────── │
   │                            │ <── JSON stats ───────────── │                        │
   │                            │                              │                        │
   │  Listar reservas           │                              │                        │
   │ ────────────────────────> │ ─── GET /api/v1/admin/reservations (JWT)               │
   │                            │                              │ ─── query + count ───> │
   │                            │                              │ <── rows + total ───── │
   │                            │ <── JSON paginado ────────── │                        │
   │                            │                              │                        │
   │  Editar / Cancelar         │                              │                        │
   │ ────────────────────────> │ ─── PUT/DELETE /api/v1/admin/reservations/:id (JWT)    │
```

---

## Estructura del frontend (`src/`)

```
src/
├── main.tsx                     ← Entry point
├── App.tsx                      ← Router outlet
│
├── components/ui/               ← UI atómica compartida
│   ├── Alert.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── EmptyState.tsx
│   ├── Footer.tsx
│   ├── Input.tsx
│   ├── Loader.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── PageContainer.tsx
│   └── SectionTitle.tsx
│
├── constants/                   ← Constantes globales
│   ├── api.ts                   ← API_CONFIG, API_ENDPOINTS
│   └── routes.ts                ← ROUTES object
│
├── context/                     ← Providers globales
│   ├── AppProviders.tsx         ← QueryClientProvider wrapper
│   └── queryClient.ts           ← TanStack Query config
│
├── features/                    ← Módulos por dominio
│   ├── admin/                   ← Panel de administración
│   │   ├── components/          ← AdminDashboard (stats + tabla)
│   │   ├── context/             ← AuthContext (JWT, login/logout)
│   │   ├── pages/               ← AdminLoginPage
│   │   └── types.ts
│   │
│   ├── krakedev/                ← Branding KrakeDev
│   │   ├── components/          ← KrakeSplash, KrakeHero, KrakeNavbar,
│   │   │                          KrakeLogo, ParticleField, etc.
│   │   └── pages/               ← KrakeSplashPage, KrakeHomePage
│   │
│   └── reservation/             ← Flujo de reserva wizard
│       ├── components/          ← WizardStepper, CalendarStep, FormStep,
│       │                          ConfirmationStep, LandingModal, etc.
│       ├── context/             ← ReservationProvider
│       ├── domain/              ← Reglas de negocio puras
│       ├── hooks/               ← useReservation, useReservationCalendar
│       ├── mocks/               ← mockReservations
│       ├── schemas/             ← (opcional)
│       ├── store/               ← Reducer + state + selectors
│       ├── types/               ← Participant, Reservation, Calendar, etc.
│       └── utils/               ← dateUtils, calendarRules, availability, etc.
│
├── layouts/                     ← Layouts con Navbar + Footer
│   ├── AdminLayout.tsx          ← AuthGuard + Navbar admin + Outlet
│   └── MainLayout.tsx           ← Navbar default + Outlet
│
├── pages/                       ← Páginas por ruta (lazy loaded)
│   ├── HomePage.tsx             ← Ruta: /
│   └── AdminPage.tsx            ← Ruta: /admin
│
├── routes/                      ← Configuración de rutas
│   └── AppRouter.tsx            ← React Router config
│
└── services/                    ← Capa de servicios API
    ├── api.ts                   ← Instancia Axios con interceptores
    └── reservations.ts          ← loginAdmin, createReservation,
                                   fetchDashboard, fetchReservations,
                                   updateReservation, deleteReservation
```

---

## Arquitectura del backend (`apps/backend/dist/`)

```
dist/
├── server.js                    ← Bootstrap (conectar BD, iniciar server)
├── app.js                       ← Express app (middleware, rutas)
├── config/
│   ├── env.js                   ← Zod-validated env
│   ├── database.js              ← PrismaClient singleton
│   └── container.js             ← DI container
├── controllers/
│   └── reservation.controller.js  ← PublicController, AuthController, AdminController
├── middlewares/
│   ├── auth.middleware.js       ← JWT verification
│   ├── error.middleware.js      ← Error handler + 404
│   └── security.middleware.js   ← Rate limiting, compression
├── routes/
│   └── index.js                 ← publicRoutes, authRoutes, adminRoutes
├── use-cases/
│   ├── public.use-cases.js      ← CreateReservation, GetAvailability, GetTicket
│   └── admin.use-cases.js       ← Dashboard, List/Get/Update/Delete/Reassign, BlockDate, UnblockDate
├── repositories/
│   ├── reservation.repository.js  ← Prisma queries
│   └── blocked-date.repository.js ← BlockedDate CRUD
├── schemas/
│   └── reservation.schema.js    ← Zod validation
├── services/
│   └── LoggerService.js
└── shared/
    ├── errors/                  ← AppError hierarchy
    ├── types/                   ← Shared types
    └── utils/                   ← HTTP utils, reservation utils
```

---

## API Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/availability?month=X&year=Y` | Disponibilidad por mes |
| `POST` | `/api/v1/reservations` | Crear reserva |
| `GET` | `/api/v1/ticket/:id` | Obtener ticket |

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/auth/login` | Login admin (devuelve JWT) |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión |

### Admin (requiere `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/admin/dashboard` | Estadísticas |
| `GET` | `/api/v1/admin/reservations` | Lista paginada |
| `GET` | `/api/v1/admin/reservations/:id` | Detalle |
| `PUT` | `/api/v1/admin/reservations/:id` | Editar |
| `DELETE` | `/api/v1/admin/reservations/:id` | Eliminar |
| `PATCH` | `/api/v1/admin/reservations/:id/date` | Reasignar fecha |
| `POST` | `/api/v1/admin/blocked-dates/:date` | Bloquear fecha |
| `DELETE` | `/api/v1/admin/blocked-dates/:date` | Desbloquear fecha |

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check |

---

## Estado global

### AuthContext

```
AuthContext (AuthProvider)
├── token: string | null          ← JWT en sessionStorage
├── isAuthenticated: boolean
├── login(username, password)     ← POST /api/v1/auth/login
└── logout()                      ← Limpia token y sessionStorage
```

Usado en: `AdminLayout.tsx` (AuthGuard redirige a `/admin/login` si no autenticado).

### ReservationContext (wizard state machine)

```
ReservationProvider (useReducer)
├── state: ReservationState
│   ├── currentStep: number       ← 0-3
│   ├── selectedDate: string|null
│   ├── participant: Participant
│   └── ticket: TicketSummary|null
├── actions:
│   ├── nextStep() / prevStep() / goToStep(n)
│   ├── selectDate(date)
│   ├── setParticipant(data)
│   ├── setTicket(ticket)
│   └── reset()
└── guards:
    ├── canAdvanceToForm()        ← selectedDate != null
    ├── canAdvanceToConfirmation() ← participant completo
    └── canGoToStep(n)            ← Permite navegación condicional
```

### TanStack React Query

| Query | Clave | Uso |
|-------|-------|-----|
| Dashboard stats | `['dashboard', token]` | AdminDashboard |
| Reservations list | `['reservations', { page, filters }, token]` | AdminReservationsTable |
| Availability | `['availability', 'all']` | AvailabilityCalendar, AdminDashboard |

Configuración global: `staleTime: 5min`, `gcTime: 30min`, `retry: 1`.

---

## Convenciones de código

### Nombrado

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos TS/TSX | `kebab-case` | `reservation.service.ts` |
| Componentes | PascalCase | `CalendarStep.tsx` |
| Funciones | camelCase | `getAvailability()` |
| Interfaces | PascalCase | `ReservationData` |
| Types | PascalCase | `ReservationStatus` |
| Variables | camelCase | `maxSlotsPerDay` |
| Constantes | UPPER_SNAKE | `MAX_SLOTS_PER_DAY` |

### Imports

```typescript
// Alias @/ → src/
import { Button } from '@/components/ui'
import { useAuth } from '@/features/admin/context'
import { ROUTES } from '@/constants'
```

---

## Seguridad

| Medida | Implementación |
|--------|---------------|
| Autenticación admin | JWT (8h expiración) en `sessionStorage` |
| Headers HTTP | `helmet` en Express |
| CORS | Origen configurable vía `CORS_ORIGIN` |
| Rate limiting | `express-rate-limit` |
| Validación input | Zod en backend |
| SQL Injection | Prevenido por Prisma ORM |

---

## Performance

| Técnica | Implementación |
|---------|---------------|
| Lazy loading | `React.lazy()` en todas las rutas |
| Code splitting | Cada página es un chunk separado |
| Caching | TanStack React Query para dashboard y reservas |
| Compresión | Vite comprime assets en build |
| Animaciones | CSS `will-change` y `translate3d` para GPU acceleration |

---

## Estilos con Tailwind v4

El tema se define en `src/index.css` usando la directiva `@theme`:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-krake-bg` | `#0a0a0f` | Fondo principal oscuro |
| `--color-krake-red` | `#dc2626` | Rojo de acento |
| `--color-krake-surface` | `#1a1a2e` | Superficie de tarjetas |
| `--animate-float` | flotación 6s | Logo en splash |
| `--animate-pulse-slow` | pulso 3s | Partículas rojas |
| `--animate-scroll-bounce` | rebote 2s | Indicador scroll |
