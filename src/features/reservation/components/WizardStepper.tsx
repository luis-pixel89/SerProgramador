import { cn } from '@/utils'
import { useReservation } from '../hooks'
import { ReservationStep } from '../types'

const steps = [
  { step: ReservationStep.Calendar, number: 1, label: 'Calendario' },
  { step: ReservationStep.Form, number: 2, label: 'Formulario' },
  { step: ReservationStep.Confirmation, number: 3, label: 'Confirmación' },
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
                    isEnabled && 'cursor-pointer hover:bg-[#1e1e1e]/80',
                    !isEnabled && 'cursor-not-allowed opacity-60',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-[#ef0a10] text-white shadow-md shadow-[#ef0a10]/20 ring-1 ring-[#ef0a10]'
                      : 'bg-[#1e1e1e] text-[#9ca3af] ring-1 ring-[#2d2d2d]',
                    isEnabled && !isActive && 'group-hover:bg-[#111111] group-hover:ring-[#ef0a10]/50',
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isActive ? 'text-white' : 'text-[#9ca3af]',
                  )}
                >
                  {label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className="mx-1 hidden h-px flex-1 bg-[#2d2d2d] sm:block" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
