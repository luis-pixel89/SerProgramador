import { PageContainer, SectionTitle } from '@/components'
import { AdminReservationsTable, AdminStatsGrid } from '@/features/admin/components'

export default function AdminPage() {
  return (
    <PageContainer size="xl" className="space-y-8 py-8 sm:py-10">
      <SectionTitle
        title="Dashboard Administrador"
        description="Resumen general de reservas y disponibilidad de cupos."
      />
      <AdminStatsGrid />
      <AdminReservationsTable />
    </PageContainer>
  )
}
