import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Icon } from "@/components/Icon"
import { cn } from "@/lib/utils"

export function ServiceCard({
  title,
  text,
  href,
  image,
  icon,
  cta = "Learn more",
  className
}: {
  title: string
  text: string
  href: string
  image?: string
  icon?: string
  cta?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover",
        className
      )}
    >
      <div className="relative aspect-[16/10]">
        <div className="absolute inset-0 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-navy-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
        </div>
        {icon && (
          <span className="absolute -bottom-6 left-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-600 shadow-lg ring-1 ring-gold-500/40">
            <Icon name={icon} className="h-6 w-6" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 pt-9">
        <h3 className="font-sans text-xl font-bold leading-snug text-navy-900">{title}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-7 text-slate-500">{text}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-600">
          {cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
