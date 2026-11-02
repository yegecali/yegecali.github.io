import { animated, useSpring } from '@react-spring/web'
import type { ReactNode } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useMotion } from '../../context/MotionContext'

export default function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  const { data } = usePortfolio()
  const { reducedMotion, pageVisible } = useMotion()
  const indicator = useSpring({ opacity: active ? 1 : 0, scaleX: active ? 1 : 0.65, config: data.effects.spring.config, immediate: reducedMotion, pause: !pageVisible })
  return (
    <button aria-pressed={active} onClick={onClick} className={`spring-filter${active ? ' active' : ''}`}>
      <animated.span className="filter-indicator" aria-hidden="true" style={indicator} />
      {children}
    </button>
  )
}
