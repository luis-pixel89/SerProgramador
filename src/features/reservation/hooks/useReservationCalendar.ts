import { useMemo } from 'react'
import type { CalendarMonth, CalendarMonthView, Reservation } from '../types'
import { buildCalendarMonths } from '../domain'
import { DEFAULT_RESERVATION_RULES } from '../domain/reservationConfig'

interface UseReservationCalendarParams {
  reservations: Reservation[]
  months: CalendarMonth[]
  maxSlotsPerDay: number
  referenceDate?: Date
}

export function useReservationCalendar({
  reservations,
  months,
  maxSlotsPerDay,
  referenceDate,
}: UseReservationCalendarParams): CalendarMonthView[] {
  return useMemo(
    () =>
      buildCalendarMonths(
        months,
        reservations,
        {
          ...DEFAULT_RESERVATION_RULES,
          maxSlotsPerDay,
        },
        referenceDate,
      ),
    [reservations, months, maxSlotsPerDay, referenceDate],
  )
}
