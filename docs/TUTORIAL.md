# Tutorial — Ser Programador

Recorrido completo por el código del proyecto **Ser Programador** para entender cómo está construido y cómo extenderlo.

---

## ¿Qué hace esta aplicación?

Es un sistema de **reserva de cupos** para la campaña *Sé Programador por un Día* de Krakedev. Los participantes pueden:

1. Ver disponibilidad en un calendario (Julio-Agosto 2026)
2. Registrarse con sus datos personales
3. Confirmar la reserva
4. Obtener un ticket con número único y QR

Los administradores pueden gestionar reservas y bloquear fechas desde un panel protegido con JWT.

---

## Recorrido del flujo completo

### 1. El usuario llega a la landing page

**Archivo:** `apps/frontend/src/pages/HomePage.tsx`

```tsx
// HomePage carga el ReservationFlow de forma lazy
const ReservationFlow = lazy(() => import('@/features/reservation/components/ReservationFlow'))
```

El flujo de reserva está envuelto en `ReservationProvider` (Context + useReducer) que maneja el estado del wizard paso a paso.

### 2. Selección de fecha

**Componente:** `apps/frontend/src/features/reservation/components/CalendarStep.tsx`

- Llama al hook `useAvailability()` que usa TanStack React Query
- La query llama al caso de uso `getReservationAvailabilityUseCase`
- El caso de uso consulta al `ReservationRepository` (en desarrollo: `MockReservationRepository`)
- Renderiza un calendario con colores por estado (`available`, `last-spot`, `full`, etc.)

```typescript
// Ejemplo: caso de uso de disponibilidad
const availability = await getReservationAvailabilityUseCase.execute(month, year)
// → { maxSlotsPerDay: 2, days: [...] }
```

### 3. Formulario de registro

**Componente:** `apps/frontend/src/features/reservation/components/FormStep.tsx`

- Usa `react-hook-form` con `zod` para validación
- El schema `participantSchema` vive en `apps/frontend/src/features/reservation/schemas/`
- Validación: nombre (3-80 chars), email (formato válido), teléfono (10+ dígitos), edad (≥ 15)

```typescript
const participantSchema = z.object({
  fullName: z.string().min(3).max(80),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10,}$/),
  age: z.number().min(15),
  reservationDate: z.string(),
})
```

### 4. Confirmación y generación de ticket

**Componente:** `apps/frontend/src/features/reservation/components/ConfirmationStep.tsx`

- Muestra resumen de datos
- Al confirmar, ejecuta `createReservationUseCase.execute(participantData)`
- El caso de uso:
  1. Valida los datos con Zod
  2. Llama al repositorio para guardar
  3. Genera número de reserva y ticket
  4. Devuelve `ReservationSummary`

```typescript
const summary = await createReservationUseCase.execute({
  fullName: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '1234567890',
  age: 25,
  reservationDate: '2026-07-15',
})
// → { reservationNumber: 'RES-00001', ticketNumber: 'TCK-00001', ... }
```

### 5. Ticket con QR

**Componente:** `apps/frontend/src/features/ticket/index.ts`

- Muestra el ticket generado con:
  - Número de reserva y ticket
  - Datos del participante
  - Código QR generado con librería `qrcode`
  - Botón para descargar PDF (jsPDF)

---

## Arquitectura del backend

### Capa de rutas → controladores

**Archivo:** `apps/backend/src/routes/index.ts`

Define las rutas y las conecta con controladores:

```typescript
router.get('/availability', availabilityController.getAvailability)
router.post('/reservations', reservationController.create)
```

### Capa de controladores

**Archivo:** `apps/backend/src/controllers/reservation.controller.ts`

Recibe el request, delega al caso de uso y devuelve la respuesta:

```typescript
export const createReservation = async (req, res, next) => {
  const result = await createReservationUseCase.execute(req.body)
  res.status(201).json(result)
}
```

### Capa de casos de uso

**Archivo:** `apps/backend/src/use-cases/public.use-cases.ts`

Contiene la lógica de negocio:

```typescript
export class CreateReservationUseCase {
  constructor(private repo: ReservationRepository) {}

  async execute(data: CreateReservationDTO) {
    const validated = reservationSchema.parse(data)
    const isAvailable = await this.repo.checkAvailability(validated.reservationDate)
    if (!isAvailable) throw new ConflictError('Day is full')
    return this.repo.create(validated)
  }
}
```

### Capa de repositorios

**Archivo:** `apps/backend/src/repositories/reservation.repository.ts`

Acceso a datos con Prisma:

```typescript
export class PrismaReservationRepository implements ReservationRepository {
  async create(data: CreateReservationDTO) {
    return prisma.reservation.create({
      data: {
        participant: { create: { ...data } },
        reservationDate: data.reservationDate,
        status: 'confirmed',
        ticket: { create: { ticketNumber: generateTicketNumber() } },
      },
      include: { participant: true, ticket: true },
    })
  }
}
```

---

## Cómo agregar una nueva feature (ejemplo práctico)

Imaginemos que queremos agregar un campo **"city"** (ciudad) al formulario.

### Backend

1. **Prisma schema** — agregar campo en `Participant`:
   ```prisma
   model Participant {
     city String?
   }
   ```
   ```bash
   npm run db:migrate
   ```

2. **Schema Zod** — agregar validación:
   ```typescript
   // apps/backend/src/schemas/reservation.schema.ts
   city: z.string().min(2).max(50).optional(),
   ```

3. **Controlador** — el campo se pasa automáticamente (validado por Zod)

### Frontend

1. **Schema compartido** — agregar al schema:
   ```typescript
   // apps/frontend/src/features/reservation/schemas/participantSchema.ts
   city: z.string().min(2).max(50).optional(),
   ```

2. **Formulario** — agregar input en `FormStep.tsx`:
   ```tsx
   <Input label="Ciudad" {...register('city')} error={errors.city?.message} />
   ```

3. **Ticket** — mostrar ciudad en `TicketView.tsx`

4. **API** — el backend ya acepta el campo extra (tipado dinámico)

---

## Ejercicios prácticos sugeridos

1. **Agregar un campo "DNI"** al formulario siguiendo el ejemplo de "city"
2. **Crear un nuevo endpoint** `GET /admin/stats` que devuelva estadísticas semanales
3. **Agregar filtro por ciudad** en el panel admin (`GET /admin/reservations?city=...`)
4. **Implementar expiración de sesión** con refresh token
5. **Agregar test** para `CreateReservationUseCase` cubriendo el caso "día lleno"

---

## Recursos

| Archivo | Propósito |
|---------|-----------|
| `Architecture.md` | Arquitectura por capas (Clean Architecture) |
| `FolderStructure.md` | Estructura de carpetas |
| `docs/API.md` | Documentación de endpoints |
| `docs/TECHNICAL_REFERENCE.md` | Referencia técnica completa |
| `openapi/openapi.yaml` | Especificación OpenAPI 3.1 |
| `apps/backend/prisma/schema.prisma` | Modelos de base de datos |
