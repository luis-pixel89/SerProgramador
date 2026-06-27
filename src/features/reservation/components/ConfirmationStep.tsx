import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Clock, Download, MapPin, User } from 'lucide-react'
import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { Alert, Badge, Button, Card, CardContent, SectionTitle } from '@/components'
import { ROUTES } from '@/constants'
import { createReservation } from '@/services'
import {
  CAMPAIGN_ADDRESS,
  CAMPAIGN_SCHEDULE,
} from '../domain/campaignDisplay'
import { useReservation } from '../hooks'
import { formatDisplayDate } from '../utils/displayDate'

const QR_DATA = 'https://maps.app.goo.gl/y9kpVCUan5joQ8C49'
const PDF_FILENAME = 'pase-krakedev.pdf'

export function ConfirmationStep() {
  const navigate = useNavigate()
  const { participant, selectedDate, resetReservation } = useReservation()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const hasCalledApi = useRef(false)
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
      color: { dark: '#0f172a', light: '#ffffff' },
    })
  }, [])

  useEffect(() => {
    if (!participant || !selectedDate || apiStatus !== 'idle' || hasCalledApi.current) return

    hasCalledApi.current = true
    setApiStatus('saving')
    setErrorMessage('')

    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const sanitizedPhone = participant.phone.replace(/\D/g, '')

    const controller = new AbortController()

    createReservation({
      fullName: participant.fullName,
      email: participant.email,
      phone: sanitizedPhone,
      age: participant.age,
      reservationDate: dateStr,
    })
      .then(() => setApiStatus('done'))
      .catch((error: Error) => {
        setApiStatus('error')
        setErrorMessage(error.message)
      })

    return () => controller.abort()
  }, [participant, selectedDate, apiStatus])

  async function handleDownload() {
    const qrDataUrl = await QRCode.toDataURL(QR_DATA, {
      width: 200,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    })

    const pdf = new jsPDF({ unit: 'mm', format: 'a5' })
    const pageW = pdf.internal.pageSize.getWidth()
    const margin = 15
    let y = margin

    pdf.setFillColor(15, 23, 42)
    pdf.rect(0, 0, pageW, 28, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Krakedev', pageW / 2, 16, { align: 'center' })
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Pase de entrada — Se Programador por un Dia', pageW / 2, 22, { align: 'center' })

    y = 38
    pdf.setTextColor(15, 23, 42)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Datos del Participante', margin, y)
    y += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)

    const fields = [
      ['Nombre', participantName],
      ['Email', participantEmail],
      ['Telefono', participantPhone],
      ['Edad', String(participantAge)],
      ['Fecha', formattedDate],
      ['Horario', CAMPAIGN_SCHEDULE],
      ['Direccion', CAMPAIGN_ADDRESS],
    ]

    for (const [label, value] of fields) {
      pdf.setTextColor(100, 116, 139)
      pdf.text(label, margin, y)
      pdf.setTextColor(15, 23, 42)
      pdf.text(value, margin + 40, y)
      y += 6
    }

    y += 6
    const qrSize = 50
    const qrX = pageW / 2 - qrSize / 2
    pdf.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize)
    y += qrSize + 4
    pdf.setFontSize(7)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Escanea para ver la ubicacion', pageW / 2, y, { align: 'center' })

    y += 10
    if (y > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage()
      y = margin
    }

    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.5)
    pdf.line(margin, y, pageW - margin, y)
    y += 4
    pdf.setFontSize(7)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Krakedev — Escuela de Programacion', pageW / 2, y, { align: 'center' })

    pdf.save(PDF_FILENAME)

    setTimeout(() => {
      resetReservation()
      navigate(ROUTES.HOME)
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-600/20">
          <CheckCircle2 className="size-8 text-emerald-600" />
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
          <p className="mt-2 text-sm text-emerald-600 font-medium">
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
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Vista previa del pase
                  </p>
                  <p className="font-semibold text-slate-900">Krakedev — Pase de entrada</p>
                </div>
                <Badge variant="success">Válido</Badge>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                  KD
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Krakedev</p>
                  <p className="text-sm text-slate-500">Sé Programador por un Día</p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
                <PreviewRow label="Participante" value={participantName} />
                <PreviewRow label="Fecha" value={formattedDate} />
                <PreviewRow label="Horario" value={CAMPAIGN_SCHEDULE} />
                <PreviewRow label="Dirección" value={CAMPAIGN_ADDRESS} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Código QR
                  </p>
                  <p className="text-sm text-slate-600">Escanea para ver la ubicación</p>
                </div>
                <div className="flex size-22 items-center justify-center rounded-xl border border-slate-200 bg-white p-1">
                  <canvas ref={qrCanvasRef} className="size-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass className="h-fit">
          <CardContent className="space-y-4 p-6">
            <h3 className="font-semibold text-slate-900">Instrucciones</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
                Llega 15 minutos antes del horario indicado.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
                Presenta tu pase impreso o en digital.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
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
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  )
}
