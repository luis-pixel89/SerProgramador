import type { CalendarMonth, CalendarMonthView, Reservation } from '../types'
import { useReservationCalendar } from '../hooks'
import { CalendarMonthGrid } from './CalendarMonthGrid'

export interface ReservationCalendarProps {
  reservations: Reservation[]
  months: CalendarMonth[]
  maxSlotsPerDay: number
  onSelectDate: (date: Date) => void
  calendarMonths?: CalendarMonthView[]
  selectedDate?: Date | null
}

export function ReservationCalendar({
  reservations,
  months,
  maxSlotsPerDay,
  onSelectDate,
  calendarMonths: prebuiltMonths,
  selectedDate,
}: ReservationCalendarProps) {
  const computedMonths = useReservationCalendar({
    reservations,
    months,
    maxSlotsPerDay,
  })

  const displayMonths = prebuiltMonths ?? computedMonths

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {displayMonths.map((month) => (
        <CalendarMonthGrid
          key={`${month.year}-${month.month}`}
          month={month}
          onSelectDate={onSelectDate}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  )
}
