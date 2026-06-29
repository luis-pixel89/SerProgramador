import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Footer, Navbar } from '@/components'
import { ROUTES } from '@/constants'
import { useAuth } from '@/features/admin/context'

export function AdminLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.ADMIN_LOGIN, { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0a]">
      <Navbar variant="admin" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
