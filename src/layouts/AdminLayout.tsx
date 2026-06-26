import { Outlet } from 'react-router-dom'
import { Footer, Navbar } from '@/components'

export function AdminLayout() {
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
