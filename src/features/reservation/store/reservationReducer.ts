import {
  RESERVATION_STEP_ORDER,
  ReservationStep,
} from '../types'
import type { ReservationAction, ReservationState } from './reservation.types'
import {
  canAdvanceToConfirmation,
  canAdvanceToForm,
  canGoToStep,
  initialReservationState,
} from './reservation.selectors'

function getNextStep(current: ReservationStep): ReservationStep | null {
  const currentIndex = RESERVATION_STEP_ORDER.indexOf(current)
  return RESERVATION_STEP_ORDER[currentIndex + 1] ?? null
}

function getPreviousStep(current: ReservationStep): ReservationStep | null {
  const currentIndex = RESERVATION_STEP_ORDER.indexOf(current)
  return RESERVATION_STEP_ORDER[currentIndex - 1] ?? null
}

export function reservationReducer(
  state: ReservationState,
  action: ReservationAction,
): ReservationState {
  switch (action.type) {
    case 'START_WIZARD':
      return {
        ...state,
        hasEnteredWizard: true,
        step: ReservationStep.Calendar,
      }

    case 'NEXT_STEP': {
      const nextStep = getNextStep(state.step)
      if (!nextStep) {
        return state
      }

      if (nextStep === ReservationStep.Form && !canAdvanceToForm(state)) {
        return state
      }

      if (nextStep === ReservationStep.Confirmation && !canAdvanceToConfirmation(state)) {
        return state
      }

      return {
        ...state,
        step: nextStep,
      }
    }

    case 'PREVIOUS_STEP': {
      if (state.step === ReservationStep.Confirmation) {
        return state
      }

      const previousStep = getPreviousStep(state.step)
      if (!previousStep) {
        return state
      }

      return {
        ...state,
        step: previousStep,
      }
    }

    case 'GO_TO_STEP': {
      if (!canGoToStep(state, action.payload)) {
        return state
      }

      return {
        ...state,
        step: action.payload,
      }
    }

    case 'SELECT_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      }

    case 'SET_PARTICIPANT':
      return {
        ...state,
        participant: action.payload,
      }

    case 'SET_TICKET':
      return {
        ...state,
        ticket: action.payload,
      }

    case 'RESET':
      return initialReservationState

    default:
      return state
  }
}
