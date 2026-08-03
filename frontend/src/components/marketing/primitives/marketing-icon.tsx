import type { LucideIcon } from 'lucide-react'
import {
  Cloud,
  Code2,
  Database,
  Gauge,
  Globe,
  PenTool,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  server: Server,
  database: Database,
  settings: Settings2,
  code: Code2,
  cloud: Cloud,
  design: PenTool,
  mobile: Smartphone,
  security: ShieldCheck,
  performance: Gauge,
  automation: Workflow,
  sparkles: Sparkles,
  frontend: Code2,
  backend: Database,
  devops: Cloud,
  other: Sparkles,
}

export function MarketingIcon({
  icon,
  className,
}: {
  icon?: LucideIcon | string
  className?: string
}) {
  if (typeof icon === 'function' || (icon && typeof icon === 'object' && 'render' in icon)) {
    const Component = icon as LucideIcon
    return <Component className={className} aria-hidden />
  }

  const name = typeof icon === 'string' ? icon.toLowerCase() : ''
  const Component = ICON_MAP[name] ?? Sparkles
  return <Component className={className} aria-hidden />
}
