import { KrakeNavbar } from './KrakeNavbar'
import { GridBackground } from './GridBackground'
import { BenefitBadge } from './BenefitBadge'
import { KrakeCtaButtons } from './KrakeCtaButtons'
import { ScrollIndicator } from './ScrollIndicator'

export function KrakeHero() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-krake-bg">
      <KrakeNavbar />

      <div className="absolute inset-0 z-[1]">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      <GridBackground />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 pt-16">
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl animate-fade-in">
          <BenefitBadge />

          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
            Transforma tu futuro{' '}
            <span className="text-red-600">en tiempo récord</span>
          </h1>

          <p className="max-w-xl text-lg text-white/60 md:text-xl">
            Aprende programación con metodología intensiva, mentores expertos y
            garantía de empleo al finalizar.
          </p>

          <KrakeCtaButtons />
        </div>
      </div>

      <ScrollIndicator />
    </div>
  )
}
