"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroBackground({
  images,
  index = 0,
  onSelect,
  showDots = true,
  imgClassName,
  priority
}: {
  images: string[]
  index?: number
  onSelect?: (i: number) => void
  showDots?: boolean
  imgClassName?: string
  priority?: boolean
}) {
  const reduce = useReducedMotion()
  const slides = images.filter(Boolean)
  const current = reduce ? 0 : index % slides.length

  if (slides.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current]}
            alt="Milven Consulting Services — advisory and transformation"
            fill
            priority={priority ?? current === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn(
              "object-cover object-[60%_center] brightness-110 contrast-[1.02]",
              !reduce && "animate-kenburns",
              imgClassName
            )}
          />
        </motion.div>
      </AnimatePresence>

      {showDots && slides.length > 1 && !reduce && onSelect && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-navy-950/50 px-4 py-2.5 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Show hero image ${i + 1}`}
              onClick={() => onSelect(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === current ? "w-8 bg-gold-500" : "w-2 bg-white/50 hover:bg-white/90"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
