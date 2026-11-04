import { useEffect } from 'react'
import type { PointerEvent } from 'react'
import { to, useSpring } from '@react-spring/web'
import { usePortfolio } from '../context/PortfolioContext'
import { useMotion } from '../context/MotionContext'

export default function useInteractiveSpring<Element extends HTMLElement>() {
  const { data } = usePortfolio()
  const settings = data.effects.spring
  const { reducedMotion, pageVisible } = useMotion()
  const [spring, api] = useSpring(() => ({ lift: 0, rotateX: 0, rotateY: 0, scale: 1 }), [])

  const reset = () => {
    void api.start({
      lift: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      config: settings.config,
      immediate: reducedMotion,
    })
  }
  useEffect(() => {
    if (reducedMotion || !pageVisible) {
      api.stop(true)
      api.set({ lift: 0, rotateX: 0, rotateY: 0, scale: 1 })
    }
  }, [api, reducedMotion, pageVisible])

  const onPointerMove = (event: PointerEvent<Element>) => {
    if (
      reducedMotion ||
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5))
    const y = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5))
    void api.start({
      lift: -settings.hoverLift,
      rotateX: -y * settings.tiltDegrees,
      rotateY: x * settings.tiltDegrees,
      scale: 1,
      config: settings.config,
    })
  }

  return {
    style: {
      transform: to(
        [spring.lift, spring.rotateX, spring.rotateY, spring.scale],
        (y, x, rotation, scale) =>
          `perspective(850px) translateY(${y}px) rotateX(${x}deg) rotateY(${rotation}deg) scale(${scale})`,
      ),
    },
    bind: {
      onPointerMove,
      onPointerLeave: reset,
      onPointerCancel: reset,
      onPointerDown: () => {
        if (!reducedMotion) void api.start({ scale: settings.pressScale, config: settings.config })
      },
      onPointerUp: reset,
      onFocus: () => {
        if (!reducedMotion) void api.start({ lift: -settings.hoverLift / 2, config: settings.config })
      },
      onBlur: reset,
    },
  }
}
