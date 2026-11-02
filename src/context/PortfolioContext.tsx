import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { isLanguage, portfolioData } from '../data/portfolio'
import type { Language, LanguageOption, PortfolioData, Project, Social, Translation } from '../types/portfolio'

interface PortfolioContextValue {
  data: PortfolioData
  language: Language
  t: Translation
  setLanguage: (code: Language) => void
  nextLanguage: LanguageOption
  toggleLanguage: () => void
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
  visibleProjects: Project[]
  socials: Record<string, Social>
  primarySocial: Social
  contactSocial: Social
}

interface PortfolioProviderProps {
  children: ReactNode
  data?: PortfolioData
  initialLanguage?: Language
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

// Load the JSON before rendering so every section has the full data immediately.
export function PortfolioProvider({ children, data = portfolioData, initialLanguage = data.defaultLanguage }: PortfolioProviderProps) {
  const [language, setLanguage] = useState<Language>(() => (
    isLanguage(initialLanguage) ? initialLanguage : data.defaultLanguage
  ))
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    document.documentElement.lang = language
    document.title = data.metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.metadata.description[language])
  }, [data, language])

  const value = useMemo<PortfolioContextValue>(() => {
    const activeIndex = data.languages.findIndex(item => item.code === language)
    const nextLanguage = data.languages[(activeIndex + 1) % data.languages.length]
    if (!nextLanguage) throw new Error('The portfolio requires at least one language')
    const socials = Object.fromEntries(data.socials.map(social => [social.id, social]))
    const primarySocial = socials[data.profile.primarySocial]
    const contactSocial = socials[data.profile.contactSocial]
    if (!primarySocial || !contactSocial) throw new Error('Portfolio social references must match an existing social ID')
    return {
      data,
      language,
      t: data.translations[language],
      setLanguage: code => {
        if (data.translations[code]) setLanguage(code)
      },
      nextLanguage,
      toggleLanguage: () => setLanguage(nextLanguage.code),
      filter,
      setFilter,
      visibleProjects: data.projects.filter(project => filter === 'all' || project.category === filter),
      socials,
      primarySocial,
      contactSocial,
    }
  }, [data, language, filter])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return context
}
