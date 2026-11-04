import type source from '../data/portfolio.json'

// The JSON only knows generic `string`/`string[]` shapes. Every type below is
// derived from it structurally (so adding a JSON field needs no type edits),
// then narrowed with `Narrow` wherever a field must be one of a closed set of
// values (an icon name, a project tone, a translation key) instead of any string.
type RawPortfolio = typeof source
type Narrow<T, Overrides extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof Overrides> & Overrides

export type Language = keyof RawPortfolio['translations']
export type Translation = RawPortfolio['translations']['es']
// Keys of Translation whose value is a plain string, i.e. excluding `values`
// (an array) — the only translation keys usable as a lookup like `t[key]`.
export type TextKey = {
  [Key in keyof Translation]: Translation[Key] extends string ? Key : never
}[keyof Translation]

export const iconNames = [
  'download',
  'activity',
  'cloud',
  'code',
  'database',
  'github',
  'layers',
  'linkedin',
  'shield',
  'terminal',
  'arrow-right',
  'arrow-up-right',
  'sparkles',
  'map-pin',
  'copy',
  'check',
  'globe',
  'sun',
  'moon',
  'monitor',
  'menu',
  'x',
] as const
export type IconName = (typeof iconNames)[number]
export const projectTones = ['teal', 'purple', 'amber', 'blue'] as const
export type ProjectTone = (typeof projectTones)[number]

export type LanguageOption = Narrow<RawPortfolio['languages'][number], { code: Language }>
export type NavigationItem = { id: string; labelKey: TextKey }
export type Social = Narrow<
  RawPortfolio['socials'][number],
  { icon: IconName; descriptionKey: TextKey; actionKey: TextKey }
>
export type Project = Narrow<RawPortfolio['projects'][number], { icon: IconName; tone: ProjectTone }>
export type Skill = Narrow<RawPortfolio['skills'][number], { icon: IconName }>
export const themeModes = ['system', 'light', 'dark'] as const
export type ThemeMode = (typeof themeModes)[number]
export type Theme = Exclude<ThemeMode, 'system'>
export type Appearance = Narrow<RawPortfolio['appearance'], { defaultMode: ThemeMode }>
export type PortfolioData = Narrow<
  RawPortfolio,
  {
    defaultLanguage: Language
    languages: LanguageOption[]
    navigation: NavigationItem[]
    projectFilters: NavigationItem[]
    socials: Social[]
    projects: Project[]
    skills: Skill[]
    appearance: Appearance
  }
>
export type ParticlesSettings = PortfolioData['effects']['particles']
export type ParticleConfig = ParticlesSettings['config']
export type AosConfig = PortfolioData['effects']['aos']
