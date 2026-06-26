import type { Reservation } from '../types'

const createReservation = (
  id: string,
  date: string,
  fullName: string,
): Reservation => ({
  id,
  fullName,
  email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  phone: '+593 000 000 000',
  age: 18,
  date,
  status: 'confirmed',
  createdAt: '2026-06-01T10:00:00.000Z',
})

export const mockReservations: Reservation[] = [
  createReservation('res-001', '2026-07-03', 'Ana Torres'),
  createReservation('res-002', '2026-07-09', 'Bruno Silva'),
  createReservation('res-003', '2026-07-09', 'Carla Mendez'),
  createReservation('res-004', '2026-07-10', 'Diego Vargas'),
  createReservation('res-005', '2026-07-15', 'Elena Ruiz'),
  createReservation('res-006', '2026-07-15', 'Felipe Castro'),
  createReservation('res-007', '2026-07-17', 'Gabriela Ortiz'),
  createReservation('res-008', '2026-07-17', 'Hugo Paredes'),
  createReservation('res-009', '2026-07-22', 'Isabel Romero'),
  createReservation('res-010', '2026-07-23', 'Jorge Salinas'),
  createReservation('res-011', '2026-07-23', 'Karla Benitez'),
  createReservation('res-012', '2026-07-31', 'Lucas Herrera'),
  createReservation('res-013', '2026-08-04', 'Mariana Duarte'),
  createReservation('res-014', '2026-08-06', 'Nicolas Vega'),
  createReservation('res-015', '2026-08-06', 'Olivia Campos'),
  createReservation('res-016', '2026-08-12', 'Pablo Navarro'),
  createReservation('res-017', '2026-08-14', 'Quinn Morales'),
  createReservation('res-018', '2026-08-14', 'Rosa Delgado'),
  createReservation('res-019', '2026-08-21', 'Sergio Palma'),
  createReservation('res-020', '2026-08-31', 'Teresa Molina'),
]
