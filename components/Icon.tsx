import {
  Compass,
  Workflow,
  GraduationCap,
  TrendingUp,
  FileText,
  BarChart3,
  Network,
  Target,
  Rocket,
  Users,
  Layers,
  Cpu,
  Lightbulb,
  ShieldCheck,
  Briefcase,
  Lock,
  Handshake,
  Globe,
  Calculator,
  Wrench,
  Gauge,
  Boxes,
  Building2,
  UserCheck,
  Presentation,
  RefreshCw,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  ChartPie,
  BadgeCheck,
  Scale,
  ClipboardList,
  BookOpen
} from "lucide-react"

function TikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.6 5.82A4.28 4.28 0 0 0 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.2 0 .5 0 .7.1v-3.2a5.9 5.9 0 0 0-.7-.05A5.8 5.8 0 1 0 15.5 15.5V9.9a7.3 7.3 0 0 0 4.2 1.3V8.05a4.3 4.3 0 0 1-3.1-2.23Z" />
    </svg>
  )
}

const map: Record<string, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  workflow: Workflow,
  "graduation-cap": GraduationCap,
  "trending-up": TrendingUp,
  "file-text": FileText,
  "bar-chart-3": BarChart3,
  network: Network,
  target: Target,
  rocket: Rocket,
  users: Users,
  layers: Layers,
  cpu: Cpu,
  lightbulb: Lightbulb,
  "shield-check": ShieldCheck,
  briefcase: Briefcase,
  lock: Lock,
  handshake: Handshake,
  globe: Globe,
  calculator: Calculator,
  wrench: Wrench,
  gauge: Gauge,
  boxes: Boxes,
  "building-2": Building2,
  "user-check": UserCheck,
  presentation: Presentation,
  "refresh-cw": RefreshCw,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: TikTok,
  mail: Mail,
  "map-pin": MapPin,
  phone: Phone,
  sparkles: Sparkles,
  "chart-pie": ChartPie,
  "badge-check": BadgeCheck,
  scale: Scale,
  "clipboard-list": ClipboardList,
  "book-open": BookOpen
}

export function Icon({
  name,
  className
}: {
  name?: string | null
  className?: string
}) {
  const Cmp = (name && map[name]) || Sparkles
  return <Cmp className={className} aria-hidden="true" />
}
