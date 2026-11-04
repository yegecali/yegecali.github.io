import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import FloatingAccent from './motion/FloatingAccent'

export default function Contact() {
  const { t, contactSocial } = usePortfolio()
  return (
    <section className="contact" data-aos="portfolio-up">
      <FloatingAccent className="contact-orbit" delay={350}>
        ✳
      </FloatingAccent>
      <div>
        <span className="eyebrow">{t.contactLabel}</span>
        <h2>{t.connection}</h2>
        <SpringLink href={contactSocial.url}>
          {t.talk}
          <Icon name="arrow-up-right" size={18} />
        </SpringLink>
      </div>
    </section>
  )
}
