import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Clock, Download, MapPin, User } from 'lucide-react'
import QRCode from 'qrcode'
import { Alert, Badge, Button, Card, CardContent, SectionTitle } from '@/components'
import { ROUTES } from '@/constants'
import { ApiError, createReservation } from '@/services'
import { useReservation } from '../hooks'
import { toDateKey } from '../utils/dateUtils'
import { formatDisplayDate } from '../utils/displayDate'
import {
  CAMPAIGN_ADDRESS,
  CAMPAIGN_SCHEDULE,
} from '../domain/campaignDisplay'
import { generatePasePdf } from '../utils/generatePasePdf'

const QR_DATA = 'https://maps.app.goo.gl/y9kpVCUan5joQ8C49'

export function ConfirmationStep() {
  const navigate = useNavigate()
  const { participant, selectedDate, resetReservation } = useReservation()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const apiCalledRef = useRef(false)
  const [apiStatus, setApiStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const participantName = participant?.fullName || '—'
  const participantEmail = participant?.email || '—'
  const participantPhone = participant?.phone || '—'
  const participantAge = participant?.age ?? '—'
  const formattedDate = selectedDate ? formatDisplayDate(selectedDate) : '—'

  useEffect(() => {
    if (!qrCanvasRef.current) return
    QRCode.toCanvas(qrCanvasRef.current, QR_DATA, {
      width: 80,
      margin: 1,
      color: { dark: '#ffffff', light: '#1e1e1e' },
    })
  }, [])

  useEffect(() => {
    if (!participant || !selectedDate || apiCalledRef.current) return

    apiCalledRef.current = true
    setApiStatus('saving')

    const sanitizedPhone = participant.phone.replace(/\D/g, '')

    createReservation({
      fullName: participant.fullName,
      email: participant.email,
      phone: sanitizedPhone,
      age: participant.age,
      reservationDate: toDateKey(selectedDate),
    })
      .then(() => setApiStatus('done'))
      .catch((error: Error) => {
          if (error instanceof ApiError && error.status === 409) {
            resetReservation()
            navigate(ROUTES.HOME, { state: { duplicateError: true } })
            return
          }
        setApiStatus('error')
        setErrorMessage(error.message)
      })
  }, [participant, selectedDate, resetReservation, navigate])

  async function handleDownload() {
    await generatePasePdf({
      fullName: participantName,
      email: participantEmail,
      phone: participantPhone,
      age: participantAge,
      date: formattedDate,
    })

    setTimeout(() => {
      resetReservation()
      navigate(ROUTES.HOME)
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-950/40 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="size-8 text-emerald-400" />
        </div>
        <SectionTitle
          align="center"
          title="Reserva Confirmada"
          description="Tu cupo ha sido registrado exitosamente. Descarga tu pase de entrada."
          className="mt-6"
        />
        {apiStatus === 'error' && (
          <Alert
            variant="error"
            title="No se pudo guardar la reserva"
            className="mt-4 max-w-md text-left"
          >
            {errorMessage || 'Error inesperado en el servidor.'} Puedes descargar tu pase igualmente.
          </Alert>
        )}
        {apiStatus === 'done' && (
          <p className="mt-2 text-sm text-emerald-400 font-medium">
            Reserva guardada en el sistema
          </p>
        )}
      </div>

      <Card glass>
        <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <DetailItem icon={User} label="Nombre" value={participantName} />
          <DetailItem icon={CalendarDays} label="Fecha" value={formattedDate} />
          <DetailItem icon={Clock} label="Horario" value={CAMPAIGN_SCHEDULE} />
          <DetailItem icon={MapPin} label="Dirección" value={CAMPAIGN_ADDRESS} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-[#2d2d2d] bg-[#111111]/80 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                    Vista previa del pase
                  </p>
                  <p className="font-semibold text-white">Krakedev — Pase de entrada</p>
                </div>
                <Badge variant="success">Válido</Badge>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ef0a10] text-sm font-bold text-white">
                  KD
                </div>
                <div>
                  <p className="font-semibold text-white">Krakedev</p>
                  <p className="text-sm text-[#9ca3af]">Sé Programador por un Día</p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-dashed border-[#2d2d2d] bg-[#111111]/50 p-4">
                <PreviewRow label="Participante" value={participantName} />
                <PreviewRow label="Fecha" value={formattedDate} />
                <PreviewRow label="Horario" value={CAMPAIGN_SCHEDULE} />
                <PreviewRow label="Dirección" value={CAMPAIGN_ADDRESS} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#2d2d2d] p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                    Código QR
                  </p>
                  <p className="text-sm text-[#6b7280]">Escanea para ver la ubicación</p>
                </div>
                <div className="flex size-22 items-center justify-center rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] p-1">
                  <canvas ref={qrCanvasRef} className="size-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass className="h-fit">
          <CardContent className="space-y-4 p-6">
            <h3 className="font-semibold text-white">Instrucciones</h3>
            <ul className="space-y-3 text-sm text-[#9ca3af]">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ef0a10]" />
                Llega 15 minutos antes del horario indicado.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ef0a10]" />
                Presenta tu pase impreso o en digital.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ef0a10]" />
                Recuerda cumplir con la edad mínima requerida.
              </li>
            </ul>
            <Button size="lg" fullWidth leftIcon={<Download className="size-4" />} onClick={handleDownload}>
              Descargar Pase
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1e1e1e] text-[#9ca3af]">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">{label}</p>
          <p className="mt-1 font-medium text-white">{value}</p>
        </div>
      </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#9ca3af]">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}
