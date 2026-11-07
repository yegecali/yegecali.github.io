import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import ProfileSidebar from './ProfileSidebar'

export default function Intro() {
  const { t } = usePortfolio()
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro-copy">
        <p className="eyebrow">
          <span />
          {t.heroEyebrow}
        </p>
        <h1 id="intro-title">
          {t.title}
          <span>{t.title2}</span>
        </h1>
        <p className="intro-description">{t.intro}</p>
        <div className="intro-actions">
          <SpringLink className="hero-action hero-action-primary" href="#contact-project" external={false}>
            {t.heroProject}
            <Icon name="arrow-up-right" size={18} />
          </SpringLink>
          <SpringLink className="hero-action hero-action-secondary" href="#contact-talent" external={false}>
            {t.heroTalent}
            <Icon name="arrow-right" size={18} />
          </SpringLink>
        </div>
        <div className="intro-links">
          <a href="#projects">
            {t.heroExplore}
            <Icon name="arrow-right" size={15} className="explore-arrow" />
          </a>
          <a href="#about">{t.learnMore}</a>
        </div>
      </div>
      <ProfileSidebar />
    </section>
  )
}
