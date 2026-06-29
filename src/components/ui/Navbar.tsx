import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import krakedevLogo from '@/assets/krakedev-logo.png'
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
        <img
          src={krakedevLogo}
          alt="Krakedev"
          className="h-11 w-auto max-w-[10.5rem] shrink-0 object-contain object-left sm:h-12 sm:max-w-[12.5rem] lg:h-14 lg:max-w-[15rem]"
        />

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
