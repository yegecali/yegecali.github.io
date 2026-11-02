import { useEffect } from 'react'
import AOS from 'aos'
import type { RefObject } from 'react'
import type { AosConfig, Language } from '../types/portfolio'

let initialized = false

export default function useAos(rootRef: RefObject<HTMLElement>, filter: string, language: Language, options: AosConfig) {
  useEffect(() => {
    // AOS has global listeners and no destroy API; initialize it once,
    // including when React StrictMode remounts effects in development.
    if (!initialized) {
      AOS.init({ ...options, disableMutationObserver: true })
      initialized = true
    }
    const frame = requestAnimationFrame(() => AOS.refreshHard())
    const root = rootRef.current
    const revealFocused = (event: FocusEvent) => {
      if (event.target instanceof Element) event.target.closest('[data-aos]')?.classList.add('aos-animate')
    }
    root?.addEventListener('focusin', revealFocused)
    return () => {
      cancelAnimationFrame(frame)
      root?.removeEventListener('focusin', revealFocused)
    }
  }, [rootRef, filter, language, options])
}
