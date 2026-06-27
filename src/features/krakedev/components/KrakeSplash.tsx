import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { ParticleField } from './ParticleField'
import { RedHalo } from './RedHalo'
import { KrakeLogo } from './KrakeLogo'
import { KrakeBrandText } from './KrakeBrandText'

interface KrakeSplashProps {
  duration?: number
}

export function KrakeSplash({ duration = 4000 }: KrakeSplashProps) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(true), 100)
    const redirectTimer = setTimeout(() => {
      navigate(ROUTES.KRAKE.HOME)
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(redirectTimer)
    }
  }, [navigate, duration])

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-krake-bg overflow-hidden">
      <ParticleField />
      <RedHalo />

      <div
        className={`relative z-10 flex flex-col items-center gap-8 transition-all duration-1000 ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
        }`}
      >
        <KrakeLogo className="h-40 w-40 md:h-52 md:w-52 animate-float" />
        <KrakeBrandText />
      </div>
    </div>
  )
}
