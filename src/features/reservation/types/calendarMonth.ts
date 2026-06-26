import type { CalendarDay } from './calendarDay'

export interface CalendarMonth {
  year: number
  month: number
  label: string
}

export interface CalendarMonthView extends CalendarMonth {
  days: CalendarDay[]
}
