import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Alert, Button, Card, CardContent } from '@/components'
import { cn } from '@/utils'
import { fetchAvailability } from '@/services'
import type { AvailabilityDay } from '@/services'

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Disponible' },
  'last-spot': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Último cupo' },
  full: { bg: 'bg-red-50', text: 'text-red-400', border: 'border-red-100', label: 'Lleno' },
  weekend: { bg: 'bg-slate-50', text: 'text-slate-300', border: 'border-slate-100', label: '' },
  past: { bg: 'bg-slate-50', text: 'text-slate-300', border: 'border-slate-100', label: '' },
  disabled: { bg: 'bg-slate-50', text: 'text-slate-300', border: 'border-slate-100', label: '' },
  empty: { bg: 'bg-transparent', text: 'text-transparent', border: 'border-transparent', label: '' },
}

const LEGEND = [
  { bg: 'bg-emerald-50 border-emerald-200', label: 'Disponible' },
  { bg: 'bg-amber-50 border-amber-200', label: 'Último cupo' },
  { bg: 'bg-red-50 border-red-100', label: 'Completo' },
  { bg: 'bg-slate-50 border-slate-100', label: 'No disponible' },
]

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = [7, 8]
const YEAR = 2026

function formatDay(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').getDate().toString()
}

function monthName(m: number): string {
  return m === 7 ? 'Julio' : 'Agosto'
}

interface AvailabilityCalendarProps {
  selectedDate?: string | null
  currentDate?: string | null
  onSelect?: (date: string) => void
  onCancel?: () => void
  isPending?: boolean
}

function MonthGrid({
  days,
  currentDate,
  selectedDate,
  onSelect,
}: {
  days: AvailabilityDay[]
  currentDate?: string | null
  selectedDate?: string | null
  onSelect?: (date: string) => void
}) {
  const day = days[0]
  if (!day) return null
  const dateObj = new Date(day.date + 'T12:00:00')
  const month = dateObj.getMonth() + 1
  const year = dateObj.getFullYear()

  const firstDay = new Date(year, month - 1, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const emptyCells = Array.from({ length: offset })

  return (
    <div className="space-y-2">
      <h4 className="text-center text-sm font-semibold text-slate-700">
        {monthName(month)} {year}
      </h4>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase text-slate-400">
            {d}
          </div>
        ))}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day: AvailabilityDay) => {
          const isCurrent = currentDate != null && day.date === currentDate
          const isSelected = selectedDate != null && day.date === selectedDate
          const style = STATUS_STYLES[day.status] ?? STATUS_STYLES.disabled
          const canClick = !!onSelect && day.isSelectable && !isCurrent

          return (
            <button
              key={day.date}
              type="button"
              disabled={!canClick}
              title={isCurrent ? 'Fecha actual' : style.label || day.status}
              onClick={() => onSelect?.(day.date)}
              className={cn(
                'relative flex flex-col items-center rounded-md border px-0.5 py-1.5 text-[11px] transition-all',
                isSelected && 'ring-2 ring-violet-500 ring-offset-1',
                isCurrent && 'ring-2 ring-slate-400 ring-offset-1',
                canClick && !isSelected && 'cursor-pointer hover:shadow-sm',
                style.bg,
                style.text,
                style.border,
                !canClick && !isCurrent && 'cursor-default',
              )}
            >
              <span className={cn('font-medium', isCurrent && 'line-through')}>
                {formatDay(day.date)}
              </span>
              {isCurrent && (
                <span className="mt-0.5 leading-none text-[8px] font-medium text-slate-400">Actual</span>
              )}
              {day.status === 'last-spot' && !isCurrent && (
                <span className="mt-0.5 leading-none text-[8px] font-medium text-amber-600">1 cupo</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AvailabilityCalendar({
  selectedDate,
  currentDate,
  onSelect,
  onCancel,
  isPending,
}: AvailabilityCalendarProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['availability', 'all'],
    queryFn: () => fetchAvailability(),
  })

  if (isLoading) {
    return (
      <Card glass>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card glass>
        <CardContent>
          <Alert variant="error" title="Error">
            No se pudieron cargar las fechas disponibles.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const allDays = data?.days ?? []
  if (allDays.length === 0) {
    return null
  }

  const months = MONTHS.map((m) => ({
    month: m,
    days: allDays.filter((d: AvailabilityDay) => {
      const date = new Date(d.date + 'T12:00:00')
      return date.getMonth() + 1 === m && date.getFullYear() === YEAR
    }),
  }))

  return (
    <Card glass>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {months.map(({ month, days }) => (
            <MonthGrid
              key={month}
              days={days}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-4">
            {LEGEND.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn('size-3.5 rounded border', item.bg)} />
                <span className="text-[11px] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
