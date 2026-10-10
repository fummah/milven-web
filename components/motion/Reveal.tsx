"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right" | "none"

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 32 },
  right: { x: -32 },
  none: {}
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  as = "div"
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: Direction
  duration?: number
  once?: boolean
  as?: "div" | "section" | "li" | "article" | "span"
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealStagger({
  children,
  className,
  stagger = 0.08
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const reduce = useReducedMotion()
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } }
  }
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  const item: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
  }
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

export function cnMotion(className?: string) {
  return cn(className)
}
