"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroBackground({
  images,
  interval = 6500
}: {
  images: string[]
  interval?: number
}) {
  const reduce = useReducedMotion()
  const slides = React.useMemo(() => images.filter(Boolean), [images])
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (reduce || slides.length < 2) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval
    )
    return () => clearInterval(id)
  }, [reduce, slides.length, interval])

  if (slides.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              "object-cover object-[60%_center] brightness-110 contrast-[1.02]",
              !reduce && "animate-kenburns"
            )}
          />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && !reduce && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-navy-950/50 px-4 py-2.5 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Show hero image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === index
                  ? "w-8 bg-gold-500"
                  : "w-2 bg-white/50 hover:bg-white/90"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
