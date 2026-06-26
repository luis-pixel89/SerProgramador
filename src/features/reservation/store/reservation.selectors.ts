import type { Participant } from '../types'
import { DEFAULT_RESERVATION_RULES } from '../domain/reservationConfig'
import type { ReservationState } from './reservation.types'
import { ReservationStep } from '../types'

export const initialReservationState: ReservationState = {
  hasEnteredWizard: false,
  step: ReservationStep.Campaign,
  selectedDate: null,
  participant: null,
  ticket: null,
}

export function isParticipantComplete(participant: Participant | null): boolean {
  if (!participant) {
    return false
  }

  const { fullName, email, phone, age } = participant

  return (
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    age >= DEFAULT_RESERVATION_RULES.minAge
  )
}

export function canAdvanceToForm(state: ReservationState): boolean {
  return state.selectedDate !== null
}

export function canAdvanceToConfirmation(state: ReservationState): boolean {
  return isParticipantComplete(state.participant)
}

export function canGoToStep(state: ReservationState, step: ReservationStep): boolean {
  switch (step) {
    case ReservationStep.Campaign:
    case ReservationStep.Calendar:
      return true
    case ReservationStep.Form:
      return canAdvanceToForm(state)
    case ReservationStep.Confirmation:
      return canAdvanceToConfirmation(state)
    default:
      return false
  }
}
