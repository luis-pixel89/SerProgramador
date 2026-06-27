import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@/components'
import type { ReservationListItem } from '@/services'
import { reassignReservationDate } from '@/services'
import AvailabilityCalendar from './AvailabilityCalendar'

interface ReassignModalProps {
  reservation: Pick<ReservationListItem, 'id' | 'reservationDate'> & { fullName: string }
  token: string
  open: boolean
  onClose: () => void
  onReassigned: () => void
}

export default function ReassignModal({ reservation, token, open, onClose, onReassigned }: ReassignModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (newDate: string) => reassignReservationDate(token, reservation.id, newDate),
    onSuccess: () => {
      onReassigned()
      onClose()
    },
  })

  function handleConfirm() {
    if (!selectedDate) return
    mutation.mutate(selectedDate)
  }

  return (
    <>
      <ModalOverlay onClick={onClose} />
      <Modal open={open} className="z-50">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Calendar className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Reagendar reserva</h2>
                <p className="text-sm text-slate-500">
                  {reservation.fullName} &mdash; Actual: {new Date(reservation.reservationDate + 'T12:00:00').toLocaleDateString('es-EC')}
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            <AvailabilityCalendar
              currentDate={reservation.reservationDate}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />

            {mutation.isError && (
              <Alert variant="error" title="Error al reagendar">
                No se pudo cambiar la fecha. Intenta de nuevo.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || mutation.isPending}
            >
              {mutation.isPending ? 'Reagendando...' : 'Confirmar cambio de fecha'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
