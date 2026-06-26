import type { CalendarMonth, CalendarMonthView, Reservation, ReservationRules } from '../types'
import { generateCalendar } from '../utils'

export function buildCalendarMonths(
  months: CalendarMonth[],
  reservations: Reservation[],
  rules: ReservationRules,
  referenceDate?: Date,
): CalendarMonthView[] {
  return generateCalendar(months, reservations, rules, referenceDate)
}

export { DEFAULT_RESERVATION_RULES, CAMPAIGN_MONTHS } from './reservationConfig'
