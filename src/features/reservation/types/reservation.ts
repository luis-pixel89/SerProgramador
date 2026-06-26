import type { ReservationStatus } from './reservationStatus'

export interface Reservation {
  id: string
  fullName: string
  email: string
  phone: string
  age: number
  date: string
  status: ReservationStatus
  createdAt: string
}

export interface ReservationFormData {
  fullName: string
  email: string
  phone: string
  age: number
}
