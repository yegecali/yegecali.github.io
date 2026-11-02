import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import Icon from './common/Icon'
import SectionHeading from './common/SectionHeading'
import type { Social, Translation } from '../types/portfolio'

function SocialCard({ social, t }: { social: Social; t: Translation }) {
  return (
    <SpringLink href={social.url} className={`social-card ${social.id}-card`} data-aos="portfolio-up">
      <div className="card-top"><span className="social-symbol"><Icon name={social.icon} size={social.kicker ? 38 : 34} /></span><Icon name="arrow-up-right" size={20} /></div>
      <div>
        {social.kicker && <span className="mini-label">{social.kicker}</span>}
        <h3>{social.label}</h3>
        <p>{t[social.descriptionKey]}</p>
        <span className="card-link">{t[social.actionKey]}<Icon name="arrow-right" size={14} /></span>
      </div>
      {social.decoration && <span className="ghost-code" aria-hidden="true">{social.decoration}</span>}
    </SpringLink>
  )
}

export default function Connections() {
  const { data, t } = usePortfolio()
  return (
    <section className="connections" aria-labelledby="connections-title">
      <SectionHeading titleId="connections-title" title={t.explore} marker={data.sections.connections.marker} />
      <p className="section-description" data-aos="portfolio-up">{t.exploreSub}</p>
      <div className="bento">
        {data.socials.map(social => <SocialCard key={social.id} social={social} t={t} />)}
        <SpringLink className="focus-card" data-aos="portfolio-up" href="#about" external={false}>
          <div className="focus-icon"><Icon name="layers" size={28} /></div>
          <div><span className="mini-label">{t.focus}</span><h3>{t.focusTitle}</h3><p>{t.focusBody}</p></div>
          <Icon name="arrow-up-right" size={19} />
        </SpringLink>
      </div>
    </section>
  )
}
