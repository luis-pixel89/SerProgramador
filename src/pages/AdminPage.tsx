import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, PageContainer, SectionTitle } from '@/components'
import { ROUTES } from '@/constants'
import { useAuth } from '@/features/admin/context'
import { blockDate, unblockDate } from '@/services'
import type { AvailabilityDay } from '@/services'

import { AdminReservationsTable, AdminStatsGrid, AvailabilityCalendar } from '@/features/admin/components'

export default function AdminPage() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function handleLogout() {
    logout()
    setTimeout(() => navigate(ROUTES.HOME, { replace: true }), 0)
  }

  const toggleBlockMutation = useMutation({
    mutationFn: async (date: string) => {
      const days = queryClient.getQueryData<{ days: AvailabilityDay[] }>(['availability', 'all'])?.days ?? []
      const day = days.find((d: AvailabilityDay) => d.date === date)
      if (day?.isBlocked) {
        await unblockDate(token!, date)
      } else {
        await blockDate(token!, date)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'all'] })
    },
  })

  return (
    <PageContainer size="xl" className="space-y-8 py-8 sm:py-10">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          title="Dashboard Administrador"
          description="Resumen general de reservas y disponibilidad de cupos."
        />
        <Button variant="outline" size="sm" leftIcon={<LogOut className="size-4" />} onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
      <AdminStatsGrid />

      <div className="space-y-2">
        <SectionTitle
          title="Disponibilidad de fechas"
          description="Visualización de todos los cupos disponibles para Julio y Agosto 2026."
        />
        <AvailabilityCalendar
          onToggleBlock={(date) => toggleBlockMutation.mutate(date)}
        />
      </div>

      <AdminReservationsTable />
    </PageContainer>
  )
}
