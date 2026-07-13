import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Download,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  SectionTitle,
} from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useAuth } from '@/features/admin/context'
import { ReassignModal } from '@/features/admin/components'
import { generatePasePdf } from '@/features/reservation/utils/generatePasePdf'
import * as XLSX from 'xlsx'
import {
  fetchDashboard,
  fetchReservations,
  syncGoogleSheets,
  updateReservation,
} from '@/services'

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return ''
  return `${day}/${month}/${year}`
}

function formatFullDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getStatusBadge(status: string) {
  const map: Record<string, { variant: 'success' | 'warning' | 'default'; label: string }> = {
    confirmed: { variant: 'success', label: 'Confirmada' },
    cancelled: { variant: 'warning', label: 'Cancelada' },
    completed: { variant: 'default', label: 'Completada' },
  }
  return map[status] ?? { variant: 'default' as const, label: status }
}

export function AdminStatsGrid() {
  const { token } = useAuth()

  const { data: dashboard, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.reservations.all,
    queryFn: () => fetchDashboard(token!),
    enabled: !!token,
  })

  const statCards = [
    { label: 'Total Reservas', icon: Users, value: dashboard?.totalReservations, accent: 'bg-[#ef0a10]/10 text-[#ef0a10]' },
    { label: 'Julio', icon: CalendarDays, value: dashboard?.reservationsByMonth?.['2026-07'], accent: 'bg-sky-950/40 text-sky-400' },
    { label: 'Agosto', icon: CalendarRange, value: dashboard?.reservationsByMonth?.['2026-08'], accent: 'bg-violet-950/40 text-violet-400' },
    { label: 'Fechas Completas', icon: CheckCircle2, value: dashboard?.fullDates, accent: 'bg-red-950/40 text-red-400' },
    { label: 'Cupos Disponibles', icon: TrendingUp, value: dashboard?.availableSlots, accent: 'bg-emerald-950/40 text-emerald-400' },
  ]

  if (isLoading) {
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
                <p className="text-sm text-[#9ca3af]">{label}</p>
                <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-[#1e1e1e]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="error" title="Error al cargar estadísticas">
        No se pudieron cargar los datos del dashboard.
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map(({ label, icon: Icon, value, accent }) => (
        <Card key={label} hover glass>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="size-5" />
              </div>
              <Badge variant="default">{value ?? 0}</Badge>
            </div>
            <div>
              <p className="text-sm text-[#9ca3af]">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{value ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AdminReservationsTable() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [reassignTarget, setReassignTarget] = useState<{
    id: string
    fullName: string
    reservationDate: string
  } | null>(null)
  const limit = 10

  const { data, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.reservations.list(), page, limit],
    queryFn: () => fetchReservations(token!, { page, limit, status: 'confirmed' }),
    enabled: !!token,
  })

  function handleReassigned() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all })
    queryClient.invalidateQueries({ queryKey: ['availability', 'all'] })
  }

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      setCancellingId(id)
      await updateReservation(token!, id, { status: 'cancelled' })
    },
    onSuccess: () => {
      setCancellingId(null)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all })
      queryClient.invalidateQueries({ queryKey: ['availability', 'all'] })
    },
    onError: () => setCancellingId(null),
  })

  async function handleExportExcel() {
    if (!token) return
    const allData = await fetchReservations(token!, { limit: 99999, status: 'confirmed' })
    const rows = allData.data.map((r) => ({
      'No. Reserva': r.reservationNumber,
      'Nombre': r.participant.fullName,
      'Correo': r.participant.email,
      'Edad': r.participant.age,
      'Teléfono': r.participant.phone,
      'Asesor': r.participant.advisor ?? '',
      'Fecha': formatDate(r.reservationDate),
      'Estado': getStatusBadge(r.status).label,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas')
    XLSX.writeFile(wb, `reservas-confirmadas-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  async function handleSyncSheets() {
    if (!token || syncing) return
    setSyncing(true)
    try {
      await syncGoogleSheets(token)
    } catch {
      // Error logged by backend; frontend stays silent
    } finally {
      setSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <Card glass className="overflow-hidden">
        <div className="border-b border-[#2d2d2d] px-6 py-5">
          <SectionTitle title="Reservas registradas" description="Cargando reservas..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[#2d2d2d] bg-[#111111]/80">
                {['Nombre', 'Correo', 'Edad', 'Teléfono', 'Fecha', 'Estado', 'Acciones'].map((column) => (
                  <th key={column} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#2d2d2d]">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 w-full max-w-28 animate-pulse rounded bg-[#1e1e1e]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Alert variant="error" title="Error al cargar reservas">
        No se pudieron cargar las reservas. Verifica tu conexión.
      </Alert>
    )
  }

  const reservations = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <Card glass className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#2d2d2d] px-6 py-5">
        <SectionTitle
          title="Reservas registradas"
          description={`${data?.total ?? 0} reserva(s) en total.`}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSyncSheets} disabled={syncing}>
            {syncing ? 'Sincronizando...' : 'Sincronizar Google Sheets'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportExcel} disabled={reservations.length === 0}>
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-[#2d2d2d] bg-[#111111]/80">
              {['Nombre', 'Correo', 'Edad', 'Teléfono', 'Fecha', 'Estado', 'Acciones'].map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#9ca3af]">
                  No hay reservas registradas.
                </td>
              </tr>
            )}
            {reservations.map((reservation) => {
              const { variant, label } = getStatusBadge(reservation.status)
              return (
                <tr
                  key={reservation.id}
                  className="border-b border-[#2d2d2d] transition-colors last:border-b-0 hover:bg-[#111111]/50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {reservation.participant.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9ca3af]">
                    {reservation.participant.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9ca3af]">
                    {reservation.participant.age}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9ca3af]">
                    {reservation.participant.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9ca3af]" title={formatFullDate(reservation.reservationDate)}>
                    {formatDate(reservation.reservationDate)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={variant}>{label}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Download className="size-3.5" />}
                        onClick={() =>
                          generatePasePdf({
                            fullName: reservation.participant.fullName,
                            email: reservation.participant.email,
                            phone: reservation.participant.phone,
                            age: reservation.participant.age,
                            date: formatDate(reservation.reservationDate),
                          })
                        }
                      >
                        DESCARGA QR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Calendar className="size-3.5" />}
                        onClick={() =>
                          setReassignTarget({
                            id: reservation.id,
                            fullName: reservation.participant.fullName,
                            reservationDate: reservation.reservationDate,
                          })
                        }
                      >
                        Reagendar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => cancelMutation.mutate(reservation.id)}
                        disabled={cancellingId === reservation.id}
                      >
                        {cancellingId === reservation.id ? 'Cancelando...' : 'Cancelar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {reassignTarget && token && createPortal(
        <ReassignModal
          reservation={reassignTarget}
          token={token}
          open={!!reassignTarget}
          onClose={() => setReassignTarget(null)}
          onReassigned={handleReassigned}
        />,
        document.body,
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2d2d2d] px-6 py-4">
          <p className="text-sm text-[#9ca3af]">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
