import { Rocket } from 'lucide-react'

export function KrakeCtaButtons() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <a
        href="#inscribete"
        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-red-600/40"
      >
        <Rocket className="size-4" />
        Inscríbete Ahora
      </a>
      <a
        href="#mas-info"
        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-base font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
      >
        Más Información
      </a>
    </div>
  )
}
