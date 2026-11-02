import { useEffect } from 'react'
import particlesScript from 'particles.js/particles.js?url'
import { usePortfolio } from '../context/PortfolioContext'
import type { ParticleInstance } from '../types/particles'
import type { ParticleConfig } from '../types/portfolio'

let scriptPromise: Promise<void> | undefined
function loadParticles(): Promise<void> {
  if (window.particlesJS) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      // Load the original library as a classic script: its legacy globals
      // and arguments.callee require a non-module execution context.
      const script = document.createElement('script')
      script.src = particlesScript
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        script.remove()
        scriptPromise = undefined
        reject(new Error('Could not load particles.js'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

const containerId = 'portfolio-particles'

export default function ParticlesBackground() {
  const { data } = usePortfolio()
  const settings = data.effects.particles
  useEffect(() => {
    let disposed = false
    let instance: ParticleInstance | undefined
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')

    const stop = () => {
      if (!instance) return
      const { pJS } = instance
      window.cancelRequestAnimFrame?.(pJS.fn.drawAnimFrame)
      window.cancelRequestAnimFrame?.(pJS.tmp.checkAnimFrame)
      pJS.canvas.el.remove()
      // The library's destroy method clears the entire global registry;
      // remove only our instance instead.
      window.pJSDom = window.pJSDom?.filter(entry => entry !== instance) ?? []
      instance = undefined
    }

    const start = () => {
      if (disposed || instance || preference.matches || document.hidden || !window.particlesJS) return
      // Clone the config because particles.js mutates its options internally.
      const config: ParticleConfig = structuredClone(settings.config)
      if (window.innerWidth < settings.mobileBreakpoint) config.particles.number.value = settings.mobileCount
      // Own the resize listener so it can be removed on React unmount.
      config.interactivity.events.resize = false
      window.particlesJS(containerId, config)
      instance = window.pJSDom?.find(entry => entry.pJS.canvas.el.parentElement?.id === containerId)
    }

    const sync = () => { stop(); start() }
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(sync, 180)
    }
    const ensureStarted = () => {
      if (preference.matches || document.hidden) { stop(); return }
      loadParticles().then(start).catch(error => {
        if (!disposed) console.error(error)
      })
    }

    ensureStarted()
    preference.addEventListener('change', ensureStarted)
    document.addEventListener('visibilitychange', ensureStarted)
    window.addEventListener('resize', onResize)
    return () => {
      disposed = true
      clearTimeout(resizeTimer)
      preference.removeEventListener('change', ensureStarted)
      document.removeEventListener('visibilitychange', ensureStarted)
      window.removeEventListener('resize', onResize)
      stop()
    }
  }, [settings])

  return <div id={containerId} className="particles-background" aria-hidden="true" />
}
