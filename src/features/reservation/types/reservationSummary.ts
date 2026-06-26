import type { DayAvailabilityStatus } from './calendarDay'

export interface ReservationSummary {
  date: string
  bookedCount: number
  remainingSlots: number
  maxSlots: number
  status: DayAvailabilityStatus
  isSelectable: boolean
}
