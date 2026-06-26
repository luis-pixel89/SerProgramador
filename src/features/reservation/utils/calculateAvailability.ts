import type { Reservation, ReservationRules, ReservationSummary } from '../types'
import { countReservations, getRemainingSlots } from './availabilityUtils'
import { isAllowedMonth, isPastDate, isWeekend } from './calendarRules'
import { toDateKey } from './dateUtils'
import { getReservationStatus, isDateSelectable } from './statusUtils'

export function calculateAvailability(
  date: Date,
  reservations: Reservation[],
  rules: ReservationRules,
  referenceDate: Date = new Date(),
): ReservationSummary {
  const weekend = isWeekend(date)
  const past = isPastDate(date, referenceDate)
  const allowedMonth = isAllowedMonth(date, rules.allowedMonths)
  const bookedCount = countReservations(reservations, date)
  const remainingSlots = getRemainingSlots(bookedCount, rules.maxSlotsPerDay)

  let status = getReservationStatus(bookedCount, rules.maxSlotsPerDay)

  if (!allowedMonth) {
    status = 'disabled'
  } else if (weekend) {
    status = 'weekend'
  } else if (past) {
    status = 'past'
  }

  const selectable = isDateSelectable(status, weekend || !allowedMonth, past)

  return {
    date: toDateKey(date),
    bookedCount,
    remainingSlots,
    maxSlots: rules.maxSlotsPerDay,
    status,
    isSelectable: selectable,
  }
}
