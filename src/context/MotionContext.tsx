import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@react-spring/web'
import { usePortfolio } from './PortfolioContext'

const MotionContext = createContext({ reducedMotion: true, pageVisible: true })

export function MotionProvider({ children }: { children: ReactNode }) {
  const preference = useReducedMotion()
  const { data } = usePortfolio()
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  return (
    <MotionContext.Provider value={{ reducedMotion: !data.effects.spring.enabled || Boolean(preference), pageVisible }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotion = () => useContext(MotionContext)
