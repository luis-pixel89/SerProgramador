import { Outlet } from 'react-router-dom'
import { Footer, Navbar } from '@/components'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar variant="default" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
