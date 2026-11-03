'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'

type GlassSurfaceProps = Omit<HTMLMotionProps<'section'>, 'style' | 'children'> & {
  children: React.ReactNode
  /** Maximum tilt in degrees; set to 0 to disable pointer tilt. */
  tilt?: number
  /** Shows the rotating crimson-gold energy rim. */
  energized?: boolean
}

const SPRING = { stiffness: 140, damping: 18, mass: 0.7 }

export function GlassSurface({
  tilt = 3.2,
  energized = false,
  className = '',
  children,
  ...props
}: GlassSurfaceProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
    if (!reduce && tilt > 0) {
      rotateY.set((px - 0.5) * 2 * tilt)
      rotateX.set((0.5 - py) * 2 * tilt)
    }
  }

  function handlePointerLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.section
      ref={ref}
      className={`glass ${className}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: 'flat',
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <div className="glass-gloss" aria-hidden="true" />
      <div className="glass-sheen" aria-hidden="true" />
      {energized && <div className="energy-ring" aria-hidden="true" />}
      <div className="relative z-[2]">{children}</div>
    </motion.section>
  )
}
