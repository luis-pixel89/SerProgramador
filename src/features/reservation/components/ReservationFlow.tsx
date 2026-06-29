import { Card, CardContent, PageContainer } from '@/components'
import { ReservationProvider } from '../context'
import { useReservation } from '../hooks'
import { ReservationStep } from '../types'
import { CalendarStep } from './CalendarStep'
import { ConfirmationStep } from './ConfirmationStep'
import { FormStep } from './FormStep'
import { LandingModal } from './LandingModal'
import { WizardStepper } from './WizardStepper'

export function ReservationFlow() {
  return (
    <ReservationProvider>
      <ReservationFlowContent />
    </ReservationProvider>
  )
}

function ReservationFlowContent() {
  const { hasEnteredWizard, step } = useReservation()

  if (!hasEnteredWizard) {
    return (
      <div className="min-h-dvh bg-[#0a0a0a]">
        <LandingModal />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#0a0a0a]">
      <PageContainer size="md" className="py-10 sm:py-14">
        <WizardStepper />

        <Card glass className="overflow-hidden shadow-lg shadow-black/20">
          <CardContent className="p-4 sm:p-8">
            {step === ReservationStep.Calendar && <CalendarStep />}

            {step === ReservationStep.Form && <FormStep />}

            {step === ReservationStep.Confirmation && <ConfirmationStep />}
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  )
}
