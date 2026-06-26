import type { CalendarDay as CalendarDayModel, DayAvailabilityStatus } from '../types'
import { cn } from '@/utils'

type VisualState = 'available' | 'last-spot' | 'full' | 'disabled' | 'empty'

interface CalendarDayProps {
  day: CalendarDayModel
  onSelect?: (date: Date) => void
}

const stateStyles: Record<Exclude<VisualState, 'empty'>, string> = {
  available:
    'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100',
  'last-spot':
    'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100',
  full: 'border-red-200 bg-red-50 text-red-400 line-through opacity-70',
  disabled: 'border-transparent bg-slate-50 text-slate-300',
}

function mapStatusToVisual(status: DayAvailabilityStatus): VisualState {
  switch (status) {
    case 'available':
      return 'available'
    case 'last-spot':
      return 'last-spot'
    case 'full':
      return 'full'
    case 'empty':
      return 'empty'
    default:
      return 'disabled'
  }
}

export function CalendarDay({ day, onSelect }: CalendarDayProps) {
  const visualState = mapStatusToVisual(day.status)

  if (day.isEmpty || !day.day) {
    return <div className="aspect-square rounded-xl" aria-hidden="true" />
  }

  const handleSelect = () => {
    if (day.isSelectable && day.date && onSelect) {
      onSelect(day.date)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      disabled={!day.isSelectable}
      aria-label={
        day.date
          ? `${day.day} de ${day.month}, ${day.bookedCount} de ${day.maxSlots} cupos`
          : undefined
      }
      className={cn(
        'flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all duration-200',
        stateStyles[visualState as Exclude<VisualState, 'empty'>],
        day.isSelectable && 'cursor-pointer',
        !day.isSelectable && 'cursor-not-allowed',
      )}
    >
      <span>{day.day}</span>
      {visualState === 'available' && (
        <span className="mt-0.5 size-1.5 rounded-full bg-emerald-500" />
      )}
      {visualState === 'last-spot' && (
        <span className="mt-0.5 size-1.5 rounded-full bg-amber-500" />
      )}
      {visualState === 'full' && (
        <span className="mt-0.5 text-[10px] font-normal">Lleno</span>
      )}
    </button>
  )
}
