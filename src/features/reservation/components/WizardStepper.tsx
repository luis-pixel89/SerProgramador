import { cn } from '@/utils'
import { useReservation } from '../hooks'
import { ReservationStep } from '../types'

const steps = [
  { step: ReservationStep.Campaign, number: 1, label: 'Campaña' },
  { step: ReservationStep.Calendar, number: 2, label: 'Calendario' },
  { step: ReservationStep.Form, number: 3, label: 'Formulario' },
  { step: ReservationStep.Confirmation, number: 4, label: 'Confirmación' },
]

export function WizardStepper() {
  const { step: currentStep, goToStep, canGoToStep } = useReservation()

  return (
    <nav aria-label="Progreso de reserva" className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {steps.map(({ step, number, label }, index) => {
          const isActive = currentStep === step
          const isEnabled = canGoToStep(step)

          return (
            <li key={step} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => goToStep(step)}
                disabled={!isEnabled}
                className={cn(
                  'group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 transition-colors',
                  isEnabled && 'cursor-pointer hover:bg-slate-100/80',
                  !isEnabled && 'cursor-not-allowed opacity-60',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-1 ring-slate-900'
                      : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
                    isEnabled && !isActive && 'group-hover:bg-white group-hover:ring-indigo-200',
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isActive ? 'text-slate-900' : 'text-slate-500',
                  )}
                >
                  {label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className="mx-1 hidden h-px flex-1 bg-slate-200 sm:block" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
