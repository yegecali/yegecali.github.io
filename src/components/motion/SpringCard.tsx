import type { ComponentPropsWithoutRef } from 'react'
import { animated } from '@react-spring/web'
import useInteractiveSpring from '../../hooks/useInteractiveSpring'

export default function SpringCard({
  className = '',
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<'article'>, 'style'>) {
  const { style, bind } = useInteractiveSpring<HTMLElement>()
  return (
    <animated.article {...props} {...bind} className={`${className} spring-surface`} style={style}>
      {children}
    </animated.article>
  )
}
