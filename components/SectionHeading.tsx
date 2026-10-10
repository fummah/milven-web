import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/Reveal"

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  className
}: {
  eyebrow?: string
  title: string
  text?: string
  align?: "left" | "center"
  light?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <div
            className={cn(
              align === "center" ? "flex flex-col items-center" : "flex flex-col"
            )}
          >
            <p
              className={cn(
                align === "center"
                  ? "eyebrow justify-center"
                  : light
                    ? "eyebrow-light"
                    : "eyebrow"
              )}
            >
              {align !== "center" && <span className="h-px w-8 bg-gold-500" />}
              {eyebrow}
            </p>
            {align === "center" && <span className="mt-2.5 h-0.5 w-10 bg-gold-500" />}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "mt-4 text-balance font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]",
            light && "text-white"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-lg leading-8",
              light ? "text-white/70" : "text-slate-500"
            )}
          >
            {text}
          </p>
        </Reveal>
      )}
    </div>
  )
}
