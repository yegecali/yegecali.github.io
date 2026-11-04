import { useEffect, useRef, useState } from 'react'
import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import ThemeSelector from './ThemeSelector'

export default function Header() {
  const { data, t, nextLanguage, toggleLanguage, contactSocial } = usePortfolio()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="header" ref={headerRef}>
      <a href="#top" className="wordmark" aria-label={data.profile.name}>
        <span className="logo">
          {data.brand.logo}
          <span aria-hidden="true">↗</span>
        </span>
        <span>
          {data.brand.name}
          <span className="muted">{data.brand.suffix}</span>
        </span>
      </a>
      <nav
        id="primary-navigation"
        className={menuOpen ? 'is-open' : undefined}
        aria-label={t.navigationLabel}
      >
        {data.navigation.map(item => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
            {t[item.labelKey]}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <ThemeSelector />
        <button className="language" onClick={toggleLanguage} aria-label={nextLanguage.switchLabel}>
          <Icon name="globe" size={14} />
          {nextLanguage.label}
        </button>
        <SpringLink href={contactSocial.url} className="connect" aria-label={t.connect} title={t.connect}>
          <span className="connect-label">{t.connect}</span>
          <Icon name="arrow-up-right" size={16} />
        </SpringLink>
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(open => !open)}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
        </button>
      </div>
    </header>
  )
}
