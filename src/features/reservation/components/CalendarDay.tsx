import type { CalendarDay as CalendarDayModel, DayAvailabilityStatus } from '../types'
import { cn } from '@/utils'

type VisualState = 'available' | 'last-spot' | 'full' | 'disabled' | 'empty'

interface CalendarDayProps {
  day: CalendarDayModel
  onSelect?: (date: Date) => void
  isSelected?: boolean
}

const stateStyles: Record<Exclude<VisualState, 'empty'>, string> = {
  available:
    'border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:border-emerald-500 hover:bg-emerald-950/60',
  'last-spot':
    'border-amber-700 bg-amber-950/40 text-amber-300 hover:border-amber-500 hover:bg-amber-950/60',
  full: 'border-red-800 bg-red-950/30 text-red-500 line-through opacity-70',
  disabled: 'border-transparent bg-[#111111] text-[#6b7280]',
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

export function CalendarDay({ day, onSelect, isSelected }: CalendarDayProps) {
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
        isSelected && 'ring-2 ring-[#ef0a10] ring-offset-2 ring-offset-[#1e1e1e]',
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
