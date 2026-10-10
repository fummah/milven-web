"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"

export function CountUp({
  value,
  className,
  duration = 1500
}: {
  value: string
  className?: string
  duration?: number
}) {
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLSpanElement>(null)
  const started = React.useRef(false)
  const [display, setDisplay] = React.useState(value)

  React.useEffect(() => {
    const match = value.match(/^(\D*)(\d+)(\D*)$/)
    if (reduce || !match) {
      setDisplay(value)
      return
    }

    const [, prefix, numStr, suffix] = match
    const target = parseInt(numStr, 10)

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(`${prefix}${Math.round(eased * target)}${suffix}`)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
