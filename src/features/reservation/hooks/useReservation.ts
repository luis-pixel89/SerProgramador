import { useContext } from 'react'
import { ReservationContext } from '../context/ReservationContext'
import type { ReservationContextValue } from '../store'

export function useReservation(): ReservationContextValue {
  const context = useContext(ReservationContext)

  if (!context) {
    throw new Error('useReservation debe utilizarse dentro de ReservationProvider')
  }

  return context
}
