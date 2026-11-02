import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'

export default function Header() {
  const { data, t, nextLanguage, toggleLanguage, contactSocial } = usePortfolio()
  return (
    <header className="header">
      <a href="#top" className="wordmark" aria-label={data.profile.name}>
        <span className="logo">{data.brand.logo}<span aria-hidden="true">↗</span></span>
        <span>{data.brand.name}<span className="muted">{data.brand.suffix}</span></span>
      </a>
      <nav aria-label={t.navigationLabel}>
        {data.navigation.map(item => <a key={item.id} href={`#${item.id}`}>{t[item.labelKey]}</a>)}
      </nav>
      <div className="header-tools">
        <button className="language" onClick={toggleLanguage} aria-label={nextLanguage.switchLabel}>
          <Icon name="globe" size={14} />{nextLanguage.label}
        </button>
        <SpringLink href={contactSocial.url} className="connect">{t.connect}<Icon name="arrow-up-right" size={16} /></SpringLink>
      </div>
    </header>
  )
}
