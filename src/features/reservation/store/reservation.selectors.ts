import type { Participant } from '../types'
import { DEFAULT_RESERVATION_RULES } from '../domain/reservationConfig'
import type { ReservationState } from './reservation.types'
import { ReservationStep } from '../types'

export const initialReservationState: ReservationState = {
  hasEnteredWizard: false,
  step: ReservationStep.Calendar,
  selectedDate: null,
  participant: null,
  ticket: null,
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

export function isParticipantComplete(participant: Participant | null): boolean {
  if (!participant) {
    return false
  }

  const { fullName, email, phone, age } = participant

  return (
    nameOnlyRegex.test(fullName.trim()) &&
    emailRegex.test(email.trim()) &&
    phone.replace(/\D/g, '').length === 10 &&
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
  if (state.step === ReservationStep.Confirmation && step !== ReservationStep.Confirmation) {
    return false
  }

  switch (step) {
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
