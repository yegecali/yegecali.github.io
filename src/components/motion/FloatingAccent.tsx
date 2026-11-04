import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { animated, easings, useSpring } from '@react-spring/web'
import { usePortfolio } from '../../context/PortfolioContext'
import { useMotion } from '../../context/MotionContext'

export default function FloatingAccent({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className: string
  delay?: number
}) {
  const { data } = usePortfolio()
  const settings = data.effects.spring
  const { reducedMotion, pageVisible } = useMotion()
  const [style, api] = useSpring(() => ({ y: 0, rotateZ: 0 }), [])

  useEffect(() => {
    if (reducedMotion) {
      api.set({ y: 0, rotateZ: 0 })
      return
    }
    void api.start({
      delay,
      config: { duration: settings.floatDuration, easing: easings.easeInOutSine },
      to: async next => {
        for (let cycle = 0; cycle < settings.floatCycles; cycle++) {
          await next({ y: -settings.floatDistance, rotateZ: settings.floatRotation })
          await next({ y: 0, rotateZ: 0 })
        }
      },
    })
    return () => {
      api.stop(true)
    }
  }, [api, delay, reducedMotion, settings])

  useEffect(() => {
    if (pageVisible) api.resume()
    else api.pause()
  }, [api, pageVisible])

  return (
    <animated.span className={`${className} spring-accent`} style={style} aria-hidden="true">
      {children}
    </animated.span>
  )
}
