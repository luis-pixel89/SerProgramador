import type { CalendarMonth, Reservation } from '../types'
import { useReservationCalendar } from '../hooks'
import { CalendarMonthGrid } from './CalendarMonthGrid'

export interface ReservationCalendarProps {
  reservations: Reservation[]
  months: CalendarMonth[]
  maxSlotsPerDay: number
  onSelectDate: (date: Date) => void
}

export function ReservationCalendar({
  reservations,
  months,
  maxSlotsPerDay,
  onSelectDate,
}: ReservationCalendarProps) {
  const calendarMonths = useReservationCalendar({
    reservations,
    months,
    maxSlotsPerDay,
  })

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {calendarMonths.map((month) => (
        <CalendarMonthGrid
          key={`${month.year}-${month.month}`}
          month={month}
          onSelectDate={onSelectDate}
        />
      ))}
    </div>
  )
}
