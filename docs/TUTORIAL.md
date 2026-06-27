# Tutorial — Ser Programador

Recorrido completo por el código del proyecto **Ser Programador** para entender cómo está construido y cómo extenderlo.

---

## ¿Qué hace esta aplicación?

Sistema de **reserva de cupos** para la campaña *Sé Programador por un Día* de Krakedev. Los participantes pueden:

1. Ver disponibilidad en un calendario (Julio-Agosto 2026, 2 cupos/día)
2. Registrarse con sus datos personales
3. Confirmar la reserva (persistida en backend PostgreSQL)
4. Obtener un ticket con código QR (Google Maps) y descargar PDF
5. Cancelar vía WhatsApp con mensaje predefinido

Los administradores pueden gestionar reservas desde un panel protegido con JWT.

---

## Recorrido del flujo de reserva

### 1. Landing page y modal de campaña

**Archivo:** `src/pages/HomePage.tsx`

```tsx
const ReservationFlow = lazy(() => import('@/features/reservation/components/ReservationFlow'))

function HomePage() {
  return (
    <ReservationProvider>
      <ReservationFlow />
    </ReservationProvider>
  )
}
```

El flujo está envuelto en `ReservationProvider` (Context + useReducer) que maneja el estado del wizard paso a paso (3 pasos: Calendar → Form → Confirmation).

**Componente:** `src/features/reservation/components/LandingModal.tsx`

Muestra información de la campaña con tarjetas de experiencia. Incluye un botón "Cancelar Reserva" que abre WhatsApp (`wa.me/593982393311`) con mensaje predefinido — implementado como un `<a>` con estilo de botón outline.

```tsx
// Cancelar vía WhatsApp
<a
  href="https://wa.me/593982393311?text=...cancelar mi reserva..."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 ..."
>
  Cancelar Reserva
</a>
```

### 2. Selección de fecha (CalendarStep)

**Archivo:** `src/features/reservation/components/CalendarStep.tsx`

- Renderiza un calendario con colores por estado (`available`, `last-spot`, `full`, `disabled`)
- Usa el hook `useReservationCalendar()` que construye el calendario desde las reglas de dominio
- Los datos de disponibilidad vienen del hook `useReservation()` (Context)

**Reglas de negocio en:** `src/features/reservation/domain/reservationConfig.ts`

```typescript
export const DEFAULT_RESERVATION_RULES = {
  maxSlotsPerDay: 2,
  allowedMonths: [7, 8],  // Julio y Agosto 2026
  minAge: 15,
}
```

### 3. Formulario de registro (FormStep)

**Archivo:** `src/features/reservation/components/FormStep.tsx`

- Usa estado local con `useState` + validación manual
- Campos: nombre completo, email, teléfono (10+ dígitos), edad (≥ 15)
- Al avanzar, llama a `setParticipant()` del contexto

```typescript
// El estado del participante se guarda en el Context
const { state, setParticipant } = useReservation()

const handleSubmit = () => {
  if (fullName && email && phone && age >= 15) {
    setParticipant({ fullName, email, phone, age })
    nextStep()
  }
}
```

### 4. Confirmación con QR y PDF (ConfirmationStep)

**Archivo:** `src/features/reservation/components/ConfirmationStep.tsx`

Este componente tiene tres responsabilidades clave:

#### a) Persistir la reserva en backend

Al montarse, llama a `createReservation()` para guardar los datos en PostgreSQL vía `POST /api/v1/reservations`:

```typescript
useEffect(() => {
  createReservation({ fullName, email, phone, age, reservationDate })
    .then(setTicket)
    .catch(() => setError('No se pudo guardar la reserva'))
}, [])
```

#### b) Generar código QR

Usa la librería `qrcode` para dibujar en un canvas el enlace a Google Maps:

```typescript
useEffect(() => {
  QRCode.toCanvas(canvasRef.current, GOOGLE_MAPS_URL, { width: 160 })
}, [])
```

#### c) Descargar PDF

Usa `jspdf` para generar un PDF con todos los datos del participante, fecha, dirección y el QR renderizado como imagen:

```typescript
const handleDownload = async () => {
  const doc = new jsPDF()
  doc.text(`Reserva: ${ticket.reservationNumber}`, 20, 20)
  doc.text(`Participante: ${fullName}`, 20, 40)
  // ... más datos ...
  const qrDataUrl = canvasRef.current.toDataURL()
  doc.addImage(qrDataUrl, 'PNG', 20, 120, 50, 50)
  doc.save(`ticket-${ticket.reservationNumber}.pdf`)
  resetReservation()
  navigate(ROUTES.HOME)
}
```

---

## Panel de administración

### Login

**Archivo:** `src/features/admin/pages/AdminLoginPage.tsx`
**Contexto:** `src/features/admin/context/AuthContext.tsx`

```typescript
// AuthContext expone:
const { login, isAuthenticated, token, logout } = useAuth()

// login() llama al servicio:
await loginAdmin(username, password)
// → { token, expiresIn, admin }
// El token se guarda en sessionStorage como 'krakedev_admin_token'
```

### Dashboard con datos reales

**Archivo:** `src/features/admin/components/AdminDashboard.tsx`

Usa `@tanstack/react-query` para obtener datos del backend:

```typescript
// Dashboard stats
const { data: stats, isLoading: statsLoading } = useQuery({
  queryKey: ['dashboard', token],
  queryFn: () => fetchDashboard(token),
  enabled: !!token,
})

// Reservas paginadas
const { data: reservations, isLoading: tableLoading } = useQuery({
  queryKey: ['reservations', { page, limit }, token],
  queryFn: () => fetchReservations(token, { page, limit }),
  enabled: !!token,
})
```

**Estados cubiertos:** loading (skeleton), error (Alert), empty (EmptyState), datos (tabla).

### Protección de rutas

**Archivo:** `src/layouts/AdminLayout.tsx`

El `AuthProvider` está a nivel global (`AppProviders.tsx`). `AdminLayout` usa `useAuth()` directamente y un `useEffect` para redirigir a `/admin/login` cuando no hay sesión:

```typescript
export function AdminLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate(ROUTES.ADMIN_LOGIN, { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50/50">
      <Navbar variant="admin" />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
```

---

## Branding KrakeDev

### Splash animado (`/krakedev`)

**Archivo:** `src/features/krakedev/pages/KrakeSplashPage.tsx`

Componentes involucrados:
- `ParticleField` — canvas con 180 estrellas (8% rojas, resto blancas)
- `RedHalo` — glow radial rojo CSS
- `KrakeLogo` — SVG de calavera/tech con ojos rojos
- `KrakeBrandText` — "KRAKEDEV Escuela de Programación"

Auto-redirige a `/krakedev/home` después de 4 segundos.

### Hero page (`/krakedev/home`)

**Archivo:** `src/features/krakedev/pages/KrakeHomePage.tsx`

Componentes:
- `KrakeNavbar` — navegación fija con logo, links, hamburger mobile
- `KrakeHero` — fondo con imagen, gradiente, badges, CTAs
- `GridBackground` — overlay de cuadrícula CSS
- `ScrollIndicator` — chevron animado

---

## Capa de servicios API

**Archivo:** `src/services/api.ts` — instancia Axios con baseURL y timeout:

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  timeout: 10_000,
})
```

**Archivo:** `src/services/reservations.ts` — todos los endpoints:

| Función | Método | Ruta |
|---------|--------|------|
| `loginAdmin()` | POST | `/api/v1/auth/login` |
| `createReservation()` | POST | `/api/v1/reservations` |
| `fetchDashboard()` | GET | `/api/v1/admin/dashboard` |
| `fetchReservations()` | GET | `/api/v1/admin/reservations` |
| `updateReservation()` | PUT | `/api/v1/admin/reservations/:id` |
| `deleteReservation()` | DELETE | `/api/v1/admin/reservations/:id` |

---

## Constantes y rutas

**Archivo:** `src/constants/routes.ts`

```typescript
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  KRAKE: {
    SPLASH: '/krakedev',
    HOME: '/krakedev/home',
  },
} as const
```

**Archivo:** `src/constants/api.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  TIMEOUT: 10_000,
}

export const API_ENDPOINTS = {
  RESERVATIONS: '/api/v1/reservations',
}
```

---

## Cómo agregar una nueva funcionalidad

Ejemplo: agregar un campo **"ciudad" (city)** al formulario.

### 1. Tipo — `src/features/reservation/types/participant.ts`

```typescript
export interface Participant {
  fullName: string
  email: string
  phone: string
  age: number
  city?: string  // ← nuevo campo opcional
}
```

### 2. Formulario — `src/features/reservation/components/FormStep.tsx`

```tsx
<input
  type="text"
  placeholder="Ciudad"
  value={city}
  onChange={(e) => setCity(e.target.value)}
/>
```

### 3. Contexto — actualizar `setParticipant()` donde se usa

```typescript
setParticipant({ ...state.participant, city })
```

### 4. Servicio API — `src/services/reservations.ts`

El campo se envía automáticamente en el payload de `createReservation()`.

### 5. Confirmación — `src/features/reservation/components/ConfirmationStep.tsx`

```tsx
<p>Ciudad: {participant.city}</p>
```

---

## Ejercicios prácticos sugeridos

1. **Agregar un campo "DNI"** al formulario siguiendo el ejemplo de "city"
2. **Agregar filtro por estado** en el panel admin usando `fetchReservations(token, { status })`
3. **Implementar búsqueda** en la tabla de reservas (pasar `search` en los filtros)
4. **Añadir toast de notificación** cuando se crea/cancela una reserva
5. **Agregar skeleton loader** para el QR mientras se genera

---

## Recursos

| Archivo | Propósito |
|---------|-----------|
| `docs/SETUP_GUIDE.md` | Guía de instalación y configuración |
| `docs/TECHNICAL_REFERENCE.md` | Referencia técnica completa |
| `docs/REQUIREMENTS.md` | Especificación de requisitos |
