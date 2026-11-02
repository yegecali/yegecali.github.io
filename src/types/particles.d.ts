import type { ParticleConfig } from './portfolio'

export interface ParticleInstance {
  pJS: {
    canvas: { el: HTMLCanvasElement }
    fn: { drawAnimFrame?: number }
    tmp: { checkAnimFrame?: number }
  }
}

declare global {
  interface Window {
    particlesJS?: (containerId: string, options: ParticleConfig) => void
    pJSDom?: ParticleInstance[]
    cancelRequestAnimFrame?: (handle: number | undefined) => void
  }
}
