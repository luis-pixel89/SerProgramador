import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, PageContainer, SectionTitle } from '@/components'
import { ROUTES } from '@/constants'

import { AdminReservationsTable, AdminStatsGrid, AvailabilityCalendar } from '@/features/admin/components'

export default function AdminPage() {
  const navigate = useNavigate()
  

  return (
    <PageContainer size="xl" className="space-y-8 py-8 sm:py-10">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          title="Dashboard Administrador"
          description="Resumen general de reservas y disponibilidad de cupos."
        />
        <Button variant="outline" size="sm" leftIcon={<LogOut className="size-4" />} onClick={() => navigate(ROUTES.HOME)}>
          Cerrar Sesión
        </Button>
      </div>
      <AdminStatsGrid />

      <div className="space-y-2">
        <SectionTitle
          title="Disponibilidad de fechas"
          description="Visualización de todos los cupos disponibles para Julio y Agosto 2026."
        />
        <AvailabilityCalendar />
      </div>

      <AdminReservationsTable />
    </PageContainer>
  )
}
