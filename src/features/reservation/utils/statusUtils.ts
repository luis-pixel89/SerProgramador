import type { DayAvailabilityStatus } from '../types'
import { getRemainingSlots } from './availabilityUtils'

export function getReservationStatus(
  bookedCount: number,
  maxSlotsPerDay: number,
): DayAvailabilityStatus {
  const remainingSlots = getRemainingSlots(bookedCount, maxSlotsPerDay)

  if (remainingSlots <= 0) {
    return 'full'
  }

  if (remainingSlots === 1) {
    return 'last-spot'
  }

  return 'available'
}

export function isDateSelectable(
  status: DayAvailabilityStatus,
  isWeekendDay: boolean,
  isPast: boolean,
): boolean {
  if (isWeekendDay || isPast) {
    return false
  }

  return status === 'available' || status === 'last-spot'
}
