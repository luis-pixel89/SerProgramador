import type { Reservation } from '../types'
import { isSameDate, parseDateKey } from './dateUtils'

export function countReservations(reservations: Reservation[], date: Date): number {
  return reservations.filter(
    (reservation) =>
      reservation.status === 'confirmed' && isSameDate(parseDateKey(reservation.date), date),
  ).length
}

export function getRemainingSlots(bookedCount: number, maxSlotsPerDay: number): number {
  return Math.max(maxSlotsPerDay - bookedCount, 0)
}
