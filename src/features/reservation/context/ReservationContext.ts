import { createContext } from 'react'
import type { ReservationContextValue } from '../store'

export const ReservationContext = createContext<ReservationContextValue | null>(null)

ReservationContext.displayName = 'ReservationContext'
