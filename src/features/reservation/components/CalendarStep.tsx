import { Button, SectionTitle } from '@/components'
import { cn } from '@/utils'
import { CAMPAIGN_MONTHS, DEFAULT_RESERVATION_RULES } from '../domain/reservationConfig'
import { useReservation } from '../hooks'
import { mockReservations } from '../mocks/mockReservations'
import { formatDisplayDate } from '../utils/displayDate'
import { ReservationCalendar } from './ReservationCalendar'

export function CalendarStep() {
  const {
    selectedDate,
    setSelectedDate,
    previousStep,
    nextStep,
    canAdvanceFromCalendar,
  } = useReservation()

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Selecciona tu fecha"
        description="Consulta la disponibilidad de cupos para Julio y Agosto. Solo días hábiles."
      />

      <div className="flex flex-wrap gap-3">
        <LegendItem color="bg-emerald-500" label="Disponible" />
        <LegendItem color="bg-amber-500" label="Último cupo" />
        <LegendItem color="bg-red-500" label="Completo" />
        <LegendItem color="bg-slate-300" label="No disponible" />
      </div>

      {selectedDate && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900">
          Fecha seleccionada:{' '}
          <span className="font-medium">{formatDisplayDate(selectedDate)}</span>
        </div>
      )}

      <ReservationCalendar
        reservations={mockReservations}
        months={CAMPAIGN_MONTHS}
        maxSlotsPerDay={DEFAULT_RESERVATION_RULES.maxSlotsPerDay}
        onSelectDate={setSelectedDate}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Anterior
        </Button>
        <Button size="lg" onClick={nextStep} disabled={!canAdvanceFromCalendar}>
          Continuar
        </Button>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
      <span className={cn('size-2 rounded-full', color)} />
      {label}
    </div>
  )
}
