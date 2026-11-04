import {
  LuActivity,
  LuArrowRight,
  LuArrowUpRight,
  LuCheck,
  LuCloud,
  LuCodeXml,
  LuCopy,
  LuDatabase,
  LuDownload,
  LuGlobe,
  LuLayers3,
  LuMapPin,
  LuShieldCheck,
  LuSparkles,
  LuTerminal,
  LuSun,
  LuMoon,
  LuMonitor,
  LuMenu,
  LuX,
} from 'react-icons/lu'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import type { IconBaseProps, IconType } from 'react-icons'
import type { IconName } from '../../types/portfolio'

const icons: Record<IconName, IconType> = {
  download: LuDownload,
  activity: LuActivity,
  cloud: LuCloud,
  code: LuCodeXml,
  database: LuDatabase,
  github: FaGithub,
  layers: LuLayers3,
  linkedin: FaLinkedin,
  shield: LuShieldCheck,
  terminal: LuTerminal,
  'arrow-right': LuArrowRight,
  'arrow-up-right': LuArrowUpRight,
  sparkles: LuSparkles,
  'map-pin': LuMapPin,
  copy: LuCopy,
  check: LuCheck,
  globe: LuGlobe,
  sun: LuSun,
  moon: LuMoon,
  monitor: LuMonitor,
  menu: LuMenu,
  x: LuX,
}

type IconProps = IconBaseProps & { name: IconName }

export default function Icon({ name, ...props }: IconProps) {
  const Component = icons[name]
  const hasAccessibleName = props.title || props['aria-label'] || props['aria-labelledby']
  return <Component aria-hidden={hasAccessibleName ? undefined : true} focusable="false" {...props} />
}
