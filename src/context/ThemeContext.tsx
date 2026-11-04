import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePortfolio } from './PortfolioContext'
import { isThemeMode, resolveTheme } from '../lib/theme'
import type { Theme, ThemeMode } from '../types/portfolio'

interface ThemeContextValue {
  mode: ThemeMode
  theme: Theme
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data } = usePortfolio()
  const settings = data.appearance
  // The server and first client render match; the head script already applies
  // the real palette before hydration, preventing a flash of the other theme.
  const [mode, updateMode] = useState<ThemeMode>(settings.defaultMode)
  const [systemDark, setSystemDark] = useState(true)
  const [ready, setReady] = useState(false)
  const theme = resolveTheme(mode, systemDark)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const readPreference = () => {
      try {
        const saved = window.localStorage.getItem(settings.storageKey)
        return isThemeMode(saved) ? saved : settings.defaultMode
      } catch {
        return settings.defaultMode
      }
    }
    updateMode(readPreference())
    setSystemDark(media.matches)
    setReady(true)
    const onSystemChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    const onStorage = (event: StorageEvent) => {
      if (event.key === settings.storageKey || event.key === null) updateMode(readPreference())
    }
    media.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorage)
    return () => {
      media.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [settings])

  useEffect(() => {
    if (!ready) return
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.browserColors[theme])
  }, [ready, settings, theme])

  const setMode = (next: ThemeMode) => {
    updateMode(next)
    try {
      window.localStorage.setItem(settings.storageKey, next)
    } catch {
      /* In-memory selection still works. */
    }
  }

  return <ThemeContext.Provider value={{ mode, theme, setMode }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
