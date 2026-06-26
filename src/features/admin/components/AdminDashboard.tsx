import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Badge,
  Card,
  CardContent,
  SectionTitle,
} from '@/components'

const statCards = [
  { label: 'Total Reservas', icon: Users, accent: 'bg-indigo-50 text-indigo-600' },
  { label: 'Julio', icon: CalendarDays, accent: 'bg-sky-50 text-sky-600' },
  { label: 'Agosto', icon: CalendarRange, accent: 'bg-violet-50 text-violet-600' },
  { label: 'Fechas Completas', icon: CheckCircle2, accent: 'bg-red-50 text-red-600' },
  { label: 'Cupos Disponibles', icon: TrendingUp, accent: 'bg-emerald-50 text-emerald-600' },
]

const tableColumns = [
  'Nombre',
  'Correo',
  'Edad',
  'Teléfono',
  'Fecha',
  'Estado',
  'Acciones',
]

export function AdminStatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map(({ label, icon: Icon, accent }) => (
        <Card key={label} hover glass>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="size-5" />
              </div>
              <Badge variant="default">—</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AdminReservationsTable() {
  return (
    <Card glass className="overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <SectionTitle
          title="Reservas registradas"
          description="Gestiona las reservas de la campaña Sé Programador por un Día."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {tableColumns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-8 animate-pulse rounded bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
