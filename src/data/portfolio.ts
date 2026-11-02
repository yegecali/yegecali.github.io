import source from './portfolio.json'
import { iconNames, projectTones } from '../types/portfolio'
import type { Language, PortfolioData, TextKey, Translation } from '../types/portfolio'

export function isLanguage(value: string): value is Language {
  return Object.hasOwn(source.translations, value)
}

function language(value: string): Language {
  if (!isLanguage(value)) throw new Error(`Unknown portfolio language: ${value}`)
  return value
}

function isTextKey(value: string): value is TextKey {
  return value !== 'values' && Object.hasOwn(source.translations.es, value)
}

function textKey(value: string): TextKey {
  if (!isTextKey(value)) throw new Error(`Unknown portfolio translation key: ${value}`)
  return value
}

function oneOf<const Values extends readonly string[]>(values: Values, value: string): Values[number] {
  const match = values.find(option => option === value)
  if (match === undefined) throw new Error(`Invalid portfolio option: ${value}`)
  return match
}

// Narrow JSON strings only after checking them. No unvalidated type assertion
// is needed to turn the editable JSON into the application's typed model.
export const portfolioData: PortfolioData = {
  ...source,
  defaultLanguage: language(source.defaultLanguage),
  translations: source.translations satisfies Record<Language, Translation>,
  languages: source.languages.map(item => ({ ...item, code: language(item.code) })),
  navigation: source.navigation.map(item => ({ ...item, labelKey: textKey(item.labelKey) })),
  projectFilters: source.projectFilters.map(item => ({ ...item, labelKey: textKey(item.labelKey) })),
  socials: source.socials.map(item => ({
    ...item,
    icon: oneOf(iconNames, item.icon),
    descriptionKey: textKey(item.descriptionKey),
    actionKey: textKey(item.actionKey),
  })),
  projects: source.projects.map(item => ({ ...item, icon: oneOf(iconNames, item.icon), tone: oneOf(projectTones, item.tone) })),
  skills: source.skills.map(item => ({ ...item, icon: oneOf(iconNames, item.icon) })),
}
