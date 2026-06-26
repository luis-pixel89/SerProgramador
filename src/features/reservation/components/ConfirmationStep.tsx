import { CalendarDays, CheckCircle2, Clock, Download, MapPin, QrCode, User } from 'lucide-react'
import { Badge, Button, Card, CardContent, SectionTitle } from '@/components'
import {
  CAMPAIGN_ADDRESS,
  CAMPAIGN_SCHEDULE,
} from '../domain/campaignDisplay'
import { useReservation } from '../hooks'
import { formatDisplayDate } from '../utils/displayDate'

export function ConfirmationStep() {
  const { participant, selectedDate } = useReservation()

  const participantName = participant?.fullName || '—'
  const formattedDate = selectedDate ? formatDisplayDate(selectedDate) : '—'

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
                  <p className="text-sm text-slate-600">Presenta este código al ingresar</p>
                </div>
                <div className="flex size-20 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <QrCode className="size-10 text-slate-300" />
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
            <Button size="lg" fullWidth leftIcon={<Download className="size-4" />}>
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
