import type source from '../data/portfolio.json'

type RawPortfolio = typeof source
export type Language = keyof RawPortfolio['translations']
export type Translation = RawPortfolio['translations']['es']
export type TextKey = {
  [Key in keyof Translation]: Translation[Key] extends string ? Key : never
}[keyof Translation]

export const iconNames = [
  'download', 'activity', 'cloud', 'code', 'database', 'github', 'layers', 'linkedin', 'shield', 'terminal',
  'arrow-right', 'arrow-up-right', 'sparkles', 'map-pin', 'copy', 'check', 'globe',
] as const
export type IconName = typeof iconNames[number]
export const projectTones = ['teal', 'purple', 'amber', 'blue'] as const
export type ProjectTone = typeof projectTones[number]

export type LanguageOption = Omit<RawPortfolio['languages'][number], 'code'> & { code: Language }
export type NavigationItem = { id: string; labelKey: TextKey }
export type Social = Omit<RawPortfolio['socials'][number], 'icon' | 'descriptionKey' | 'actionKey'> & {
  icon: IconName
  descriptionKey: TextKey
  actionKey: TextKey
}
export type Project = Omit<RawPortfolio['projects'][number], 'icon' | 'tone'> & {
  icon: IconName
  tone: ProjectTone
}
export type Skill = Omit<RawPortfolio['skills'][number], 'icon'> & { icon: IconName }
export type PortfolioData = Omit<RawPortfolio, 'defaultLanguage' | 'languages' | 'navigation' | 'projectFilters' | 'socials' | 'projects' | 'skills'> & {
  defaultLanguage: Language
  languages: LanguageOption[]
  navigation: NavigationItem[]
  projectFilters: NavigationItem[]
  socials: Social[]
  projects: Project[]
  skills: Skill[]
}
export type ParticleConfig = PortfolioData['effects']['particles']['config']
export type AosConfig = PortfolioData['effects']['aos']
