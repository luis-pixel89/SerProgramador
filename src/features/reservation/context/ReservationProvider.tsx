import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import type { Participant } from '../types'
import { ReservationStep } from '../types'
import type { TicketData } from '@/features/ticket/types'
import {
  canAdvanceToConfirmation,
  canAdvanceToForm,
  canGoToStep,
  initialReservationState,
  reservationReducer,
  type ReservationContextValue,
} from '../store'
import { ReservationContext } from './ReservationContext'

interface ReservationProviderProps {
  children: ReactNode
}

export function ReservationProvider({ children }: ReservationProviderProps) {
  const [state, dispatch] = useReducer(reservationReducer, initialReservationState)

  const startWizard = useCallback(() => {
    dispatch({ type: 'START_WIZARD' })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' })
  }, [])

  const goToStep = useCallback((step: ReservationStep) => {
    dispatch({ type: 'GO_TO_STEP', payload: step })
  }, [])

  const setSelectedDate = useCallback((date: Date) => {
    dispatch({ type: 'SELECT_DATE', payload: date })
  }, [])

  const setParticipant = useCallback((data: Participant) => {
    dispatch({ type: 'SET_PARTICIPANT', payload: data })
  }, [])

  const setTicket = useCallback((ticket: TicketData | null) => {
    dispatch({ type: 'SET_TICKET', payload: ticket })
  }, [])

  const resetReservation = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const canGoToStepFn = useCallback(
    (step: ReservationStep) => canGoToStep(state, step),
    [state],
  )

  const value = useMemo<ReservationContextValue>(
    () => ({
      hasEnteredWizard: state.hasEnteredWizard,
      step: state.step,
      selectedDate: state.selectedDate,
      participant: state.participant,
      ticket: state.ticket,
      startWizard,
      nextStep,
      previousStep,
      goToStep,
      setSelectedDate,
      setParticipant,
      setTicket,
      resetReservation,
      canGoToStep: canGoToStepFn,
      canAdvanceFromCalendar: canAdvanceToForm(state),
      canAdvanceFromForm: canAdvanceToConfirmation(state),
    }),
    [
      state,
      startWizard,
      nextStep,
      previousStep,
      goToStep,
      setSelectedDate,
      setParticipant,
      setTicket,
      resetReservation,
      canGoToStepFn,
    ],
  )

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}
