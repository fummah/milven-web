"use client"

import * as React from "react"

export function SmoothScroll() {
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lenis: import("lenis").default | null = null
    let raf = 0

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6
      })
      const loop = (time: number) => {
        lenis?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])

  return null
}
