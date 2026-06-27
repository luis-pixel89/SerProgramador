import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { KrakeLogo } from './KrakeLogo'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Metodología', href: '#metodologia' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

export function KrakeNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.KRAKE.HOME}
          className="flex items-center gap-3"
        >
          <KrakeLogo className="h-9 w-9" />
          <span className="text-lg font-bold tracking-wider text-white">
            <span className="text-white">KRAKE</span>
            <span className="text-red-600">DEV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-red-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#inscribete"
          className="hidden rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-red-600/40 md:inline-block"
        >
          Inscríbete
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-krake-surface md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-red-500"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inscribete"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700"
            >
              Inscríbete
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
