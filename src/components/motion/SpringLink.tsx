import type { ComponentPropsWithoutRef } from 'react'
import { animated } from '@react-spring/web'
import useInteractiveSpring from '../../hooks/useInteractiveSpring'

type SpringLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'style'> & { external?: boolean }

export default function SpringLink({ children, className = '', external = true, ...props }: SpringLinkProps) {
  const { style, bind } = useInteractiveSpring<HTMLAnchorElement>()
  return (
    <animated.a
      {...props}
      {...bind}
      className={`${className} spring-surface`}
      style={style}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </animated.a>
  )
}
