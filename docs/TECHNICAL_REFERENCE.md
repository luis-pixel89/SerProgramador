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
| Formularios | React Hook Form | 7 |
| Validación | Zod | 4 |
| Backend | Express | 5 |
| ORM | Prisma | 6 |
| Base de datos | PostgreSQL | 16 |
| Lenguaje | TypeScript | ~6.0 |
| Testing | Vitest | — |
| Linter | Oxlint | — |
| Hooks | Husky + Commitlint | — |
| Formato | Prettier | — |
| PDF | jsPDF | 4 |
| QR | qrcode | 1.5 |
| Iconos | Lucide React | 1.21 |
| HTTP Client | Axios | 1.18 |
| Query | TanStack React Query | 5.101 |

---

## Decisiones técnicas clave

| Decisión | Alternativas | Motivo |
|----------|-------------|--------|
| Express en vez de Fastify/NestJS | Fastify, NestJS | Simple, suficiente para el alcance, equipo familiarizado |
| TypeScript estricto | JavaScript | Seguridad de tipos, mejor DX, detección temprana de errores |
| Prisma en vez de Drizzle/TypeORM | Drizzle, TypeORM | Madurez, generación de tipos automática, DX superior |
| Vitest en vez de Jest | Jest | Compatibilidad nativa con Vite, más rápido |
| Oxlint en vez de ESLint | ESLint, Biome | Rendimiento 10x-100x más rápido, cero configuración |
| Tailwind en vez de CSS Modules/Styled | CSS Modules, Styled Components | Velocidad de desarrollo, consistencia, bundle pequeño |
| React Context + useReducer en vez de Redux/Zustand | Redux, Zustand | Estado acotado al wizard, sin necesidad de librería externa |
| Repository Pattern | Acceso directo a datos | Desacoplamiento total entre lógica de negocio y persistencia |
| Feature-Sliced Design | Arquitectura plana | Escalabilidad, separación clara de responsabilidades |

---

## Flujo de datos

### Reserva de participante

```
Usuario                    Frontend (React)              Backend (Express)          PostgreSQL
   │                            │                             │                        │
   │   Visita landing page      │                             │                        │
   │ ─────────────────────────> │                             │                        │
   │                            │                             │                        │
   │   Selecciona fecha         │                             │                        │
   │ ─────────────────────────> │                             │                        │
   │                            │ ─── GET /availability ───> │ ─── query ──────────> │
   │                            │                             │ <── rows ───────────── │
   │                            │ <── JSON disponibilidad ─── │                        │
   │                            │                             │                        │
   │   Llena formulario         │                             │                        │
   │ ─────────────────────────> │                             │                        │
   │                            │  Valida con Zod             │                        │
   │                            │                             │                        │
   │   Confirma reserva         │                             │                        │
   │ ─────────────────────────> │ ─── POST /reservations ───> │                        │
   │                            │                             │ ─── validate ────────> │
   │                            │                             │ ─── insert ──────────> │
   │                            │                             │ <── confirmation ───── │
   │                            │ <── 201 + ticket ────────── │                        │
   │ <── Muestra ticket QR ──── │                             │                        │
```

### Panel admin

```
Admin                        Frontend (Admin)               Backend (Express)          PostgreSQL
   │                            │                             │                        │
   │   Login                    │                             │                        │
   │ ────────────────────────> │ ─── POST /auth/login ─────> │ ─── verify ──────────> │
   │                            │                             │ <── JWT token ──────── │
   │                            │ <── token ───────────────── │                        │
   │                            │                             │                        │
   │   Ver reservas             │                             │                        │
   │ ────────────────────────> │ ─── GET /admin/reservations ──> (JWT)              │
   │                            │                             │ ─── query ──────────> │
   │                            │                             │ <── rows ───────────── │
   │                            │ <── JSON ────────────────── │                        │
   │                            │                             │                        │
   │   Modificar/Eliminar       │                             │                        │
   │ ────────────────────────> │ ─── PUT/DELETE ────────────> │ ─── mutate ──────────> │
```

---

## Arquitectura de capas

### Frontend

```
src/
├── pages/              ← Entrada por ruta (lazy loaded)
├── features/           ← Módulos por dominio
│   └── reservation/
│       ├── application/   Casos de uso
│       ├── components/    Componentes UI
│       ├── context/       React Context
│       ├── domain/        Reglas de negocio puras
│       ├── hooks/         Custom hooks
│       ├── mocks/         Datos simulados
│       ├── repositories/  Abstracción de datos
│       ├── schemas/       Validación Zod
│       ├── services/      Integraciones externas
│       ├── store/         Estado del wizard
│       ├── types/         Tipos TypeScript
│       └── utils/         Utilidades
├── components/         ← UI atómica compartida
├── context/            ← Providers globales
├── errors/             ← Jerarquía de errores
├── config/             ← ConfigService
├── hooks/              ← Custom hooks globales
├── layouts/            ← Layouts
├── routes/             ← Configuración de rutas
└── utils/              ← Utilidades globales
```

### Backend

```
src/
├── config/             ← Env, database, DI container
├── controllers/        ← Handlers de rutas
├── middlewares/        ← Auth, error, security
├── repositories/       ← Acceso a datos (Prisma)
├── routes/             ← Definición de rutas
├── schemas/            ← Validación Zod
├── services/           ← Lógica de servicios
├── shared/             ← Tipos, utils, errores compartidos
└── use-cases/          ← Casos de uso
```

---

## Convenciones de código

### Nombrado

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | `kebab-case` | `reservation.repository.ts` |
| Componentes | PascalCase | `CalendarStep.tsx` |
| Funciones | camelCase | `getAvailability()` |
| Interfaces | PascalCase | `ReservationData` |
| Types | PascalCase | `ReservationStatus` |
| Variables | camelCase | `maxSlotsPerDay` |
| Constantes | UPPER_SNAKE | `MAX_SLOTS_PER_DAY` |

### Imports

```typescript
// Alias @/ → apps/frontend/src/
import { Button } from '@/components'
import { createReservationUseCase } from '@/features/reservation/application'
import { handleError } from '@/errors'
```

### Testing

- Archivos: `*.test.ts` junto al archivo fuente
- Framework: Vitest
- Patrón: Arrange → Act → Assert

---

## Manejo de errores

Jerarquía:

```
AppError (base)
├── ApiError        → Errores de HTTP
├── ValidationError → Errores de validación
└── RepositoryError → Errores de persistencia
```

Flujo: `handleError()` normaliza → `LoggerService` registra → toast si aplica.

---

## Seguridad

| Medida | Implementación |
|--------|---------------|
| Autenticación admin | JWT (8h expiración) |
| Headers HTTP | `helmet` |
| CORS | Origen configurable vía `CORS_ORIGIN` |
| Rate limiting | `express-rate-limit` |
| Validación input | Zod en schemas |
| SQL Injection | Prevenido por Prisma ORM |

---

## Performance

- Lazy loading de páginas y `ReservationFlow`
- `React.memo` en componentes de calendario
- Code splitting manual en Vite (`vendor`, `query`, `forms`)
- TanStack React Query para caching de disponibilidad
- Compresión de assets en build

---

## Testing

| Tipo | Herramienta | Ubicación |
|------|-----------|-----------|
| Unitarios | Vitest | `apps/backend/src/**/*.test.ts` |
| Repositorios | Vitest + Mock | `apps/backend/src/repositories/*.test.ts` |
| Casos de uso | Vitest | `apps/backend/src/use-cases/*.test.ts` |
| Utilidades | Vitest | `apps/backend/src/shared/utils/*.test.ts` |

```bash
npm run test            # Tests backend
npm run test:coverage   # Con cobertura
npm run quality         # lint + typecheck + tests
```
