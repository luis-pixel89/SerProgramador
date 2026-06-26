import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { ROUTES } from '@/constants'
import { cn } from '@/utils'

interface NavbarProps {
  variant?: 'default' | 'admin'
  className?: string
}

export function Navbar({ variant = 'default', className }: NavbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Code2 className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Krakedev</p>
            <p className="text-xs text-slate-500">
              {variant === 'admin' ? 'Panel Admin' : 'Reservas'}
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {variant === 'default' ? (
            <Link
              to={ROUTES.ADMIN}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Admin
            </Link>
          ) : (
            <Link
              to={ROUTES.HOME}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Reservas
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
