import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container-page py-24">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-6 h-16 w-3/4" />
      <Skeleton className="mt-4 h-5 w-1/2" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
