import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

export function readingTime(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
