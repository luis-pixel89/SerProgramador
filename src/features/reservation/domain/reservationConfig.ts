import type { CalendarMonth, ReservationRules } from '../types'

export const DEFAULT_RESERVATION_RULES: ReservationRules = {
  maxSlotsPerDay: 2,
  allowedMonths: [7, 8],
  minAge: 15,
}

export const CAMPAIGN_MONTHS: CalendarMonth[] = [
  { year: 2026, month: 7, label: 'Julio 2026' },
  { year: 2026, month: 8, label: 'Agosto 2026' },
]
