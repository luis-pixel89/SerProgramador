import { Calendar, Mail, Phone, User } from 'lucide-react'
import { Alert, Button, Card, CardContent, Input, SectionTitle } from '@/components'
import { DEFAULT_RESERVATION_RULES } from '../domain/reservationConfig'
import { useReservation } from '../hooks'
import { EMPTY_PARTICIPANT, type Participant } from '../types'
import { formatDisplayDate } from '../utils/displayDate'

export function FormStep() {
  const {
    participant,
    selectedDate,
    setParticipant,
    previousStep,
    nextStep,
    canAdvanceFromForm,
  } = useReservation()

  const formData: Participant = participant ?? EMPTY_PARTICIPANT

  const updateField = <K extends keyof Participant>(field: K, value: Participant[K]) => {
    setParticipant({
      ...formData,
      [field]: value,
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const nameOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

  const nameError =
    formData.fullName.length > 0 && !nameOnlyRegex.test(formData.fullName.trim())
      ? 'El nombre solo debe contener letras.'
      : undefined

  const emailError =
    formData.email.length > 0 && !emailRegex.test(formData.email.trim())
      ? 'Ingresa un correo electrónico válido.'
      : undefined

  const digitsOnly = formData.phone.replace(/\D/g, '')
  const phoneError =
    formData.phone.length > 0 && digitsOnly.length !== 10
      ? 'El teléfono debe tener exactamente 10 dígitos.'
      : undefined

  const ageError =
    formData.age === 0
      ? 'Ingresa tu edad para continuar.'
      : formData.age < DEFAULT_RESERVATION_RULES.minAge
        ? `Debes tener al menos ${DEFAULT_RESERVATION_RULES.minAge} años para participar.`
        : undefined

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Completa tu reserva"
        description="Ingresa tus datos para confirmar tu cupo en la experiencia."
      />

      <Alert variant="info" title="Cupos limitados">
        Solo hay 2 cupos por día. Completa el formulario para asegurar tu lugar.
      </Alert>

      <Card glass>
        <CardContent className="space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Nombre Completo"
                placeholder="Tu nombre completo"
                leftIcon={<User className="size-4" />}
                value={formData.fullName}
                onChange={(event) =>
                  updateField('fullName', event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ''))
                }
                error={nameError}
              />
            </div>
            <Input
              label="Correo"
              placeholder="correo@ejemplo.com"
              type="email"
              leftIcon={<Mail className="size-4" />}
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              error={emailError}
            />
            <Input
              label="Teléfono"
              placeholder="0999999999"
              type="tel"
              leftIcon={<Phone className="size-4" />}
              value={formData.phone}
              onChange={(event) =>
                updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))
              }
              error={phoneError}
            />
            <div className="sm:col-span-2">
              <Input
                label="Edad"
                placeholder="15"
                type="number"
                min={DEFAULT_RESERVATION_RULES.minAge}
                leftIcon={<Calendar className="size-4" />}
                value={formData.age || ''}
                onChange={(event) => updateField('age', Number(event.target.value) || 0)}
                error={ageError}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-700 bg-emerald-950/40 p-4">
            <p className="text-sm font-medium text-emerald-400">Fecha seleccionada</p>
            <p className="mt-1 text-sm text-emerald-300">
              {selectedDate ? formatDisplayDate(selectedDate) : 'Selecciona una fecha en el calendario'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Anterior
        </Button>
        <Button size="lg" onClick={nextStep} disabled={!canAdvanceFromForm} className="w-full sm:w-auto">
          Reservar Cupo
        </Button>
      </div>
    </div>
  )
}
