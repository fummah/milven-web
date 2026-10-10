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
  Mail,
  MapPin,
  Phone,
  Sparkles,
  ChartPie,
  BadgeCheck,
  Scale,
  type LucideIcon
} from "lucide-react"

const map: Record<string, LucideIcon> = {
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
  mail: Mail,
  "map-pin": MapPin,
  phone: Phone,
  sparkles: Sparkles,
  "chart-pie": ChartPie,
  "badge-check": BadgeCheck,
  scale: Scale
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
