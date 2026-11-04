import { usePortfolio } from '../context/PortfolioContext'
import { useTheme } from '../context/ThemeContext'
import Icon from './common/Icon'

export default function ThemeSelector() {
  const { t } = usePortfolio()
  const { mode, theme, setMode } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="theme-control" role="group" aria-label={t.themeLabel}>
      <button
        type="button"
        className="theme-toggle"
        role="switch"
        aria-checked={dark}
        aria-label={`${t.themeLabel}: ${t.themeDark}`}
        title={dark ? t.themeToLight : t.themeToDark}
        onClick={() => setMode(dark ? 'light' : 'dark')}
      >
        <span className="theme-track" aria-hidden="true">
          <Icon name="sun" size={13} />
          <Icon name="moon" size={13} />
          <span className="theme-thumb" />
        </span>
        <span className="theme-toggle-label">{dark ? t.themeDark : t.themeLight}</span>
      </button>
      <button
        type="button"
        className="theme-system"
        onClick={() => setMode('system')}
        aria-pressed={mode === 'system'}
        aria-label={t.themeUseSystem}
        title={t.themeUseSystem}
      >
        <Icon name="monitor" size={15} />
      </button>
    </div>
  )
}
