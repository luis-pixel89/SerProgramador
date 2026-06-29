import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { KrakeLogo } from '@/features/krakedev/components/KrakeLogo'
import { cn } from '@/utils'

interface NavbarProps {
  variant?: 'default' | 'admin'
  className?: string
}

export function Navbar({ variant = 'default', className }: NavbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-[#2d2d2d] bg-[#111111]/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
          <KrakeLogo className="size-9 shrink-0" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Krakedev</p>
            <p className="text-xs text-[#9ca3af]">
              {variant === 'admin' ? 'Panel Admin' : 'Reservas'}
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {variant === 'default' ? (
            <Link
              to={ROUTES.ADMIN}
              className="rounded-xl px-3 py-2 text-sm font-medium text-[#9ca3af] transition-colors hover:bg-[#1e1e1e] hover:text-white"
            >
              Admin
            </Link>
          ) : (
            <Link
              to={ROUTES.HOME}
              className="rounded-xl px-3 py-2 text-sm font-medium text-[#9ca3af] transition-colors hover:bg-[#1e1e1e] hover:text-white"
            >
              Reservas
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
