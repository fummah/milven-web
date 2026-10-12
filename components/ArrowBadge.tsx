import { ArrowRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ArrowBadge({
  icon: Icon = ArrowRight,
  className
}: {
  icon?: LucideIcon
  className?: string
}) {
  return (
    <span
      className={cn(
        "icon-badge inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
        className
      )}
    >
      <Icon className="h-[1.05em] w-[1.05em]" />
    </span>
  )
}
