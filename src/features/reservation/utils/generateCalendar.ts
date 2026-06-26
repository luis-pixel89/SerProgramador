import type {
  CalendarDay,
  CalendarMonth,
  CalendarMonthView,
  Reservation,
  ReservationRules,
} from '../types'
import { calculateAvailability } from './calculateAvailability'
import { getMonthGridOffset } from './calendarRules'
import { createDate, getDaysInMonth } from './dateUtils'

function createEmptyCell(month: CalendarMonth): CalendarDay {
  return {
    date: null,
    day: null,
    month: month.month,
    year: month.year,
    bookedCount: 0,
    maxSlots: 0,
    remainingSlots: 0,
    status: 'empty',
    isSelectable: false,
    isEmpty: true,
  }
}

function createDayCell(
  month: CalendarMonth,
  day: number,
  reservations: Reservation[],
  rules: ReservationRules,
  referenceDate: Date,
): CalendarDay {
  const date = createDate(month.year, month.month, day)
  const availability = calculateAvailability(date, reservations, rules, referenceDate)

  return {
    date,
    day,
    month: month.month,
    year: month.year,
    bookedCount: availability.bookedCount,
    maxSlots: availability.maxSlots,
    remainingSlots: availability.remainingSlots,
    status: availability.status,
    isSelectable: availability.isSelectable,
    isEmpty: false,
  }
}

export function generateCalendar(
  months: CalendarMonth[],
  reservations: Reservation[],
  rules: ReservationRules,
  referenceDate: Date = new Date(),
): CalendarMonthView[] {
  return months.map((month) => {
    const offset = getMonthGridOffset(month.year, month.month)
    const totalDays = getDaysInMonth(month.year, month.month)
    const days: CalendarDay[] = []

    for (let index = 0; index < offset; index += 1) {
      days.push(createEmptyCell(month))
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push(createDayCell(month, day, reservations, rules, referenceDate))
    }

    return {
      ...month,
      days,
    }
  })
}
