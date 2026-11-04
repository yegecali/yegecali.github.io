import { useEffect } from 'react'
import particlesScript from 'particles.js/particles.js?url'
import type { ParticleInstance } from '../types/particles'
import type { ParticleConfig, ParticlesSettings } from '../types/portfolio'

let scriptPromise: Promise<void> | undefined

function loadParticlesScript(): Promise<void> {
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

function findInstance(containerId: string): ParticleInstance | undefined {
  return window.pJSDom?.find(entry => entry.pJS.canvas.el.parentElement?.id === containerId)
}

function destroyInstance(instance: ParticleInstance) {
  const { pJS } = instance
  window.cancelRequestAnimFrame?.(pJS.fn.drawAnimFrame)
  window.cancelRequestAnimFrame?.(pJS.tmp.checkAnimFrame)
  pJS.canvas.el.remove()
  // The library's destroy method clears the entire global registry;
  // remove only our instance instead.
  window.pJSDom = window.pJSDom?.filter(entry => entry !== instance) ?? []
}

function buildConfig(settings: ParticlesSettings): ParticleConfig {
  // Clone the config because particles.js mutates its options internally.
  const config: ParticleConfig = structuredClone(settings.config)
  if (window.innerWidth < settings.mobileBreakpoint) config.particles.number.value = settings.mobileCount
  // Own the resize listener so it can be removed on React unmount.
  config.interactivity.events.resize = false
  return config
}

// Bridges the legacy particles.js library into React: loads its classic
// script once, then mounts/unmounts an instance in step with visibility,
// reduced-motion preference and viewport resizes.
export default function useParticlesJS(containerId: string, settings: ParticlesSettings) {
  useEffect(() => {
    let disposed = false
    let instance: ParticleInstance | undefined
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')

    const stop = () => {
      if (!instance) return
      destroyInstance(instance)
      instance = undefined
    }

    const start = () => {
      if (disposed || instance || preference.matches || document.hidden || !window.particlesJS) return
      window.particlesJS(containerId, buildConfig(settings))
      instance = findInstance(containerId)
    }

    const restart = () => {
      stop()
      start()
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(restart, 180)
    }

    const ensureStarted = () => {
      if (preference.matches || document.hidden) {
        stop()
        return
      }
      loadParticlesScript()
        .then(start)
        .catch(error => {
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
  }, [containerId, settings])
}
