import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { usePortfolio } from '../context/PortfolioContext'
import useParticlesJS from '../hooks/useParticlesJS'

const containerId = 'portfolio-particles'

export default function ParticlesBackground() {
  const { data } = usePortfolio()
  const { theme } = useTheme()
  const settings = useMemo(() => {
    if (theme === 'dark') return data.effects.particles
    const original = data.effects.particles
    return {
      ...original,
      config: {
        ...original.config,
        particles: {
          ...original.config.particles,
          color: { value: [...data.appearance.lightParticleColors] },
          line_linked: { ...original.config.particles.line_linked, color: data.appearance.lightParticleLine },
        },
      },
    }
  }, [data.effects.particles, data.appearance, theme])
  useParticlesJS(containerId, settings)
  return <div id={containerId} className="particles-background" aria-hidden="true" />
}
