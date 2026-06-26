import type { TicketData } from '@/features/ticket/types'
import type { Participant } from '../types'
import { ReservationStep } from '../types'

export interface ReservationState {
  hasEnteredWizard: boolean
  step: ReservationStep
  selectedDate: Date | null
  participant: Participant | null
  ticket: TicketData | null
}

export type ReservationAction =
  | { type: 'START_WIZARD' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: ReservationStep }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SET_PARTICIPANT'; payload: Participant }
  | { type: 'SET_TICKET'; payload: TicketData | null }
  | { type: 'RESET' }

export interface ReservationContextValue {
  hasEnteredWizard: boolean
  step: ReservationStep
  selectedDate: Date | null
  participant: Participant | null
  ticket: TicketData | null
  startWizard: () => void
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: ReservationStep) => void
  setSelectedDate: (date: Date) => void
  setParticipant: (data: Participant) => void
  setTicket: (ticket: TicketData | null) => void
  resetReservation: () => void
  canGoToStep: (step: ReservationStep) => boolean
  canAdvanceFromCalendar: boolean
  canAdvanceFromForm: boolean
}
