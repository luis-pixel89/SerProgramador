import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import krakedevLogo from '@/assets/krakedev-logo.png'
import { cn } from '@/utils'

interface NavbarProps {
  variant?: 'default' | 'admin'
  className?: string
}

export function Navbar({ variant = 'default', className }: NavbarProps) {
  const navigate = useNavigate()
  const [, setLogoClickCount] = useState(0)
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const handleLogoClick = () => {
    setLogoClickCount((count) => {
      const nextCount = count + 1

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }

      if (nextCount >= 7) {
        setLogoClickCount(0)
        navigate(ROUTES.ADMIN_LOGIN)
        return 0
      }

      resetTimerRef.current = window.setTimeout(() => {
        setLogoClickCount(0)
      }, 2000)

      return nextCount
    })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-[#2d2d2d] bg-[#111111]/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleLogoClick}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Krakedev"
        >
          <img
            src={krakedevLogo}
            alt="Krakedev"
            className="h-11 w-auto max-w-[10.5rem] shrink-0 object-contain object-left drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] brightness-110 sm:h-12 sm:max-w-[12.5rem] lg:h-14 lg:max-w-[15rem]"
          />
        </button>

        <nav className="flex items-center gap-1">
          {variant === 'default' ? null : (
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
