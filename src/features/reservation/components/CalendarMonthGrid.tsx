import { Badge, Card, CardContent } from '@/components'
import type { CalendarMonthView } from '../types'
import { CalendarDay } from './CalendarDay'

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface CalendarMonthGridProps {
  month: CalendarMonthView
  onSelectDate?: (date: Date) => void
  selectedDate?: Date | null
}

export function CalendarMonthGrid({ month, onSelectDate, selectedDate }: CalendarMonthGridProps) {
  return (
    <Card glass>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{month.label}</h3>
          <Badge variant="info">Lun – Vie</Badge>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
          {weekDays.map((day) => (
            <div key={day} className="py-2 text-xs font-medium text-[#6b7280]">
              {day}
            </div>
          ))}
          {month.days.map((day, index) => (
            <CalendarDay
              key={`${month.label}-${index}`}
              day={day}
              onSelect={onSelectDate}
              isSelected={!!(selectedDate && day.date && selectedDate.getTime() === day.date.getTime())}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
