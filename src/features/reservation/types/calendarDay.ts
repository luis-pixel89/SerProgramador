export type DayAvailabilityStatus =
  | 'available'
  | 'last-spot'
  | 'full'
  | 'disabled'
  | 'weekend'
  | 'past'
  | 'empty'

export interface CalendarDay {
  date: Date | null
  day: number | null
  month: number
  year: number
  bookedCount: number
  maxSlots: number
  remainingSlots: number
  status: DayAvailabilityStatus
  isSelectable: boolean
  isEmpty: boolean
}
