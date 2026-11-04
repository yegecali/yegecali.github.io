import { usePortfolio } from '../context/PortfolioContext'
import useParticlesJS from '../hooks/useParticlesJS'

const containerId = 'portfolio-particles'

export default function ParticlesBackground() {
  const { data } = usePortfolio()
  useParticlesJS(containerId, data.effects.particles)
  return <div id={containerId} className="particles-background" aria-hidden="true" />
}
