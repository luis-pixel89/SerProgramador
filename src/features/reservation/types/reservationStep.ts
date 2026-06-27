export const ReservationStep = {
  Calendar: 'calendar',
  Form: 'form',
  Confirmation: 'confirmation',
} as const

export type ReservationStep = (typeof ReservationStep)[keyof typeof ReservationStep]

export const RESERVATION_STEP_ORDER: ReservationStep[] = [
  ReservationStep.Calendar,
  ReservationStep.Form,
  ReservationStep.Confirmation,
]
