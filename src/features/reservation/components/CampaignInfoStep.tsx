import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components'

export function CampaignInfoStep() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg sm:p-8">
        <BadgeChip />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Krakedev — Sé Programador por un Día
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Una jornada diseñada para que descubras cómo trabajan los equipos de desarrollo en
          proyectos reales, con acompañamiento y actividades prácticas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoTile
          icon={MapPin}
          label="Ubicación"
          value="Quito, Ecuador"
          detail="Sector empresarial"
        />
        <InfoTile icon={Clock} label="Horario" value="08:00 AM - 02:00 PM" detail="Jornada completa" />
        <InfoTile icon={CalendarDays} label="Disponibilidad" value="Julio y Agosto" detail="Lunes a Viernes" />
      </div>

      <Card glass>
        <CardContent className="space-y-4 p-6">
          <h3 className="font-semibold text-slate-900">¿Qué incluye la experiencia?</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'Tour por las áreas de trabajo',
              'Sesión guiada con el equipo técnico',
              'Reto práctico de programación',
              'Almuerzo y networking',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-1.5 rounded-full bg-indigo-500" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function BadgeChip() {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
      Campaña activa
    </span>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof MapPin
  label: string
  value: string
  detail: string
}) {
  return (
    <Card hover>
      <CardContent className="space-y-3 p-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 font-semibold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{detail}</p>
        </div>
      </CardContent>
    </Card>
  )
}
