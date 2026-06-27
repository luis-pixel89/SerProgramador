import { Navigate, Outlet } from 'react-router-dom'
import { Footer, Navbar } from '@/components'
import { ROUTES } from '@/constants'
import { useAuth } from '@/features/admin/context'

export function AdminLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50/50">
      <Navbar variant="admin" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
