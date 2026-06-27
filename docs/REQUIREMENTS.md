# Requirements Specification — Ser Programador

Especificación de requisitos funcionales y no funcionales para la aplicación **Ser Programador** de la campaña *Sé Programador por un Día* de Krakedev.

---

## 1. Propósito del sistema

Sistema web que permite a participantes registrarse en la campaña *Sé Programador por un Día*, seleccionar una fecha disponible, completar su registro y obtener un ticket de confirmación. Incluye un panel de administración para gestionar reservas y monitorear la ocupación.

---

## 2. Requisitos funcionales

### Módulo público (participante)

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-01 | Visualizar landing page | Mostrar información de la campaña con llamado a la acción | Alta |
| RF-02 | Ver disponibilidad | Consultar calendario con fechas disponibles (Julio-Agosto 2026) | Alta |
| RF-03 | Seleccionar fecha | Elegir una fecha con cupos disponibles del calendario | Alta |
| RF-04 | Registrar participante | Completar formulario con nombre, email, teléfono y edad | Alta |
| RF-05 | Validar datos en cliente | Validar formulario en frontend antes de enviar | Alta |
| RF-06 | Confirmar reserva | Enviar datos al backend y recibir confirmación | Alta |
| RF-07 | Visualizar ticket | Mostrar ticket con número único, datos y código QR | Alta |
| RF-08 | Descargar ticket en PDF | Generar y descargar PDF del ticket | Media |
| RF-09 | Prevenir doble reserva | Bloquear fecha si ya alcanzó el máximo de cupos (2/día) | Alta |

### Módulo de administración

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-10 | Autenticación admin | Login con usuario/contraseña (JWT) | Alta |
| RF-11 | Listar reservas | Ver tabla paginada de reservas con filtros (mes, estado, búsqueda) | Alta |
| RF-12 | Ver detalle de reserva | Consultar información completa de una reserva | Alta |
| RF-13 | Editar reserva | Modificar datos del participante o estado | Alta |
| RF-14 | Cancelar reserva | Cambiar estado a "cancelled" | Alta |
| RF-15 | Eliminar reserva | Borrar reserva del sistema | Media |
| RF-16 | Reasignar fecha | Cambiar fecha de una reserva a otra disponible | Alta |
| RF-17 | Bloquear fechas | Marcar fechas específicas como no disponibles | Alta |
| RF-18 | Ver dashboard | Estadísticas: total reservas, cupos disponibles, fechas llenas, tasa de ocupación | Alta |

---

## 3. Requisitos no funcionales

| ID | Nombre | Descripción | Métrica |
|----|--------|-------------|---------|
| RNF-01 | Tiempo de respuesta | API debe responder en menos de 2s para endpoints críticos | < 2s (p95) |
| RNF-02 | Disponibilidad | Sistema disponible en horario de campaña | 99.5% uptime |
| RNF-03 | Seguridad - Autenticación | JWT con expiración de 8h para admin | — |
| RNF-04 | Seguridad - Headers | Uso de helmet para headers HTTP seguros | — |
| RNF-05 | Seguridad - CORS | Restricción de orígenes por variable de entorno | — |
| RNF-06 | Seguridad - Rate limiting | Límite de requests para evitar abusos | 100 req/min por IP |
| RNF-07 | Seguridad - Validación | Validación de toda entrada de usuario con Zod | — |
| RNF-08 | Compatibilidad - Navegadores | Chrome, Firefox, Edge, Safari (últimas 2 versiones) | — |
| RNF-09 | Compatibilidad - Móvil | Diseño responsive para mobile y desktop | — |
| RNF-10 | Accesibilidad | Skip links, ARIA labels, focus trap en modales | Nivel AA |
| RNF-11 | Mantenibilidad | Cobertura de tests > 80% en backend | > 80% |
| RNF-12 | Mantenibilidad | TypeScript estricto en todo el código | strict: true |
| RNF-13 | Rendimiento - Frontend | Lazy loading de rutas y componentes pesados | — |
| RNF-14 | Rendimiento - Bundle | Code splitting manual (vendor, query, forms) | — |
| RNF-15 | Escalabilidad | Arquitectura desacoplada (Repository Pattern) | — |
| RNF-16 | Observabilidad | Logger preparado para Sentry en producción | — |

---

## 4. Casos de uso principales

### UC-01: Reservar cupo

`
Actor: Participante (no autenticado)
Precondición: Hay fechas disponibles
Flujo:
  1. Participante ingresa a la landing page
  2. Sistema muestra información de la campaña
  3. Participante hace clic en "Participar"
  4. Sistema muestra calendario con disponibilidad
  5. Participante selecciona una fecha disponible
  6. Sistema muestra formulario de registro
  7. Participante completa datos y confirma
  8. Sistema valida datos (frontend + backend)
  9. Sistema verifica disponibilidad actualizada
  10. Sistema crea reserva y genera ticket
  11. Sistema muestra ticket con QR
Postcondición: Reserva creada con estado "confirmed"
Excepciones:
  - 7a. Datos inválidos → mostrar error en formulario
  - 9a. Fecha sin cupos → mostrar error "día lleno"
`

### UC-02: Gestionar reservas (admin)

`
Actor: Administrador (autenticado)
Precondición: Admin ha iniciado sesión
Flujo:
  1. Admin navega al panel de administración
  2. Sistema muestra dashboard con estadísticas
  3. Admin navega a lista de reservas
  4. Sistema muestra tabla paginada con filtros
  5. Admin puede: editar, cancelar, eliminar, reasignar fecha
  6. Sistema persiste cambios y actualiza vista
Postcondición: Reserva modificada según acción
Excepciones:
  - 5a. Reasignar a fecha llena → error "sin cupos"
`

---

## 5. Reglas de negocio

| Regla | Descripción |
|-------|-------------|
| RN-01 | Cupos máximos: 2 participantes por día |
| RN-02 | Edad mínima: 15 años |
| RN-03 | Fechas válidas: lunes a viernes en Julio y Agosto 2026 |
| RN-04 | Una persona no puede reservar dos veces con el mismo email |
| RN-05 | Los números de reserva siguen el formato RES-XXXXX |
| RN-06 | Los números de ticket siguen el formato TCK-XXXXX |
| RN-07 | Una reserva solo se puede reasignar a una fecha con cupos |
| RN-08 | Las fechas pasadas no son seleccionables |
| RN-09 | Los administradores se crean solo vía seed (no hay registro público) |
| RN-10 | Las fechas bloqueadas por el admin se muestran como completamente llenas en el calendario público (truco de marketing) |

---

## 6. Modelo de datos

`
Participant
├── id (PK)
├── fullName
├── email (unique)
├── phone
├── age
├── city? (opcional, preparado)
└── createdAt

Reservation
├── id (PK)
├── reservationNumber (unique, formato RES-XXXXX)
├── reservationDate
├── status: confirmed | cancelled | completed
├── participantId (FK → Participant)
├── createdAt
└── updatedAt

Ticket
├── id (PK)
├── ticketNumber (unique, formato TCK-XXXXX)
├── reservationId (FK → Reservation)
├── qrCode
├── pdfUrl
└── createdAt

BlockedDate
├── id (PK)
├── date (unique)
├── reason
└── createdAt
`

---

## 7. Restricciones técnicas

| Restricción | Descripción |
|-------------|-------------|
| RT-01 | Monorepo con npm workspaces |
| RT-02 | Frontend y backend comparten TypeScript |
| RT-03 | API REST versión 1 (/api/v1) |
| RT-04 | Documentación de API en OpenAPI 3.1 |
| RT-05 | Base de datos PostgreSQL (no SQLite) |
| RT-06 | Contenedor Docker para BD local |
| RT-07 | Gestión de husky + commitlint para calidad de commits |
| RT-08 | CI/CD preparado para GitHub Actions |

---

## 8. Glosario

| Término | Definición |
|---------|-----------|
| Cupo | Espacio disponible para un participante en una fecha (máx. 2/día) |
| Ticket | Comprobante digital de reserva confirmada |
| JWT | JSON Web Token para autenticación de administradores |
| Wizard | Flujo multi-paso guiado para completar la reserva |
| Seed | Datos de prueba cargados en la base de datos |
