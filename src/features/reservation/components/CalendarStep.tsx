import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { Button, SectionTitle } from '@/components'
import { cn, scrollIntoViewIfNeeded } from '@/utils'
import { fetchAvailability } from '@/services'
import { useReservation } from '../hooks'
import { formatDisplayDate } from '../utils/displayDate'
import { buildCalendarFromApi } from '../utils'
import { ReservationCalendar } from './ReservationCalendar'

const CAMPAIGN_MONTHS = [
  { year: 2026, month: 7, label: 'Julio 2026' },
  { year: 2026, month: 8, label: 'Agosto 2026' },
]

export function CalendarStep() {
  const {
    selectedDate,
    setSelectedDate,
    resetReservation,
    nextStep,
    canAdvanceFromCalendar,
  } = useReservation()

  const continueActionsRef = useRef<HTMLDivElement>(null)
  const shouldScrollToContinueRef = useRef(false)

  const handleSelectDate = (date: Date) => {
    shouldScrollToContinueRef.current = true
    setSelectedDate(date)
  }

  useEffect(() => {
    if (!shouldScrollToContinueRef.current || !selectedDate) return

    shouldScrollToContinueRef.current = false
    scrollIntoViewIfNeeded(continueActionsRef.current)
  }, [selectedDate])

  const { data: availability, isLoading, isError, refetch } = useQuery({
    queryKey: ['availability', 'all'],
    queryFn: () => fetchAvailability(),
    staleTime: 30_000,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#6b7280]" />
      </div>
    )
  }

  if (isError || !availability) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <AlertCircle className="size-10 text-red-400" />
        <p className="text-sm text-[#9ca3af]">
          No se pudo cargar la disponibilidad. Verifica que el servidor esté funcionando.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const maxSlotsPerDay = availability.maxSlotsPerDay
  const calendarMonths = buildCalendarFromApi(CAMPAIGN_MONTHS, availability.days)

  const monthList = CAMPAIGN_MONTHS.map((m) => m.label).join(', ')

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Selecciona tu fecha"
        description={`Consulta la disponibilidad de cupos para ${monthList}. Solo días hábiles.`}
      />

      <div className="flex flex-wrap gap-3">
        <LegendItem color="bg-emerald-500" label="Disponible" />
        <LegendItem color="bg-amber-500" label="Último cupo" />
        <LegendItem color="bg-red-500" label="Completo" />
        <LegendItem color="bg-[#4a4a4a]" label="No disponible" />
      </div>

      {selectedDate && (
        <div className="rounded-2xl border border-[#ef0a10]/30 bg-[#ef0a10]/10 px-4 py-3 text-sm text-[#ef0a10]">
          Fecha seleccionada:{' '}
          <span className="font-medium">{formatDisplayDate(selectedDate)}</span>
        </div>
      )}

      <ReservationCalendar
        reservations={[]}
        months={CAMPAIGN_MONTHS}
        maxSlotsPerDay={maxSlotsPerDay}
        onSelectDate={handleSelectDate}
        calendarMonths={calendarMonths}
        selectedDate={selectedDate}
      />

      <div
        ref={continueActionsRef}
        className="flex scroll-mt-20 scroll-mb-6 flex-col-reverse gap-3 sm:flex-row sm:justify-between"
      >
        <Button variant="ghost" onClick={resetReservation}>
          Cancelar
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[#2d2d2d] bg-[#1e1e1e] px-3 py-1.5 text-xs font-medium text-[#9ca3af] shadow-sm">
      <span className={cn('size-2 rounded-full', color)} />
      {label}
    </div>
  )
}
