import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import FloatingAccent from './motion/FloatingAccent'
import type { Translation } from '../types/portfolio'

function ContactPath({ path }: { path: Translation['contactPaths'][number] }) {
  const { data, t, contactSocial } = usePortfolio()
  const emailUrl = `mailto:${data.profile.email}?subject=${encodeURIComponent(path.title)}&body=${encodeURIComponent(path.message)}`
  return (
    <article id={path.id} className="contact-path" tabIndex={-1}>
      <h3>{path.title}</h3>
      <p>{path.description}</p>
      <div className="contact-path-actions">
        <a href={emailUrl} className="contact-email-action">
          <Icon name="mail" size={16} />
          {t.contactEmail}
        </a>
        <SpringLink href={contactSocial.url}>
          {contactSocial.label}
          <Icon name="arrow-up-right" size={16} />
        </SpringLink>
      </div>
    </article>
  )
}

export default function Contact() {
  const { data, t } = usePortfolio()
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <FloatingAccent className="contact-orbit" delay={350}>
          ✳
        </FloatingAccent>
        <div>
          <span className="eyebrow">{t.contactLabel}</span>
          <h2 id="contact-title">{t.connection}</h2>
          <a className="contact-email-address" href={`mailto:${data.profile.email}`}>
            {data.profile.email}
          </a>
        </div>
      </div>
      <div className="contact-paths">
        {t.contactPaths.map(path => (
          <ContactPath key={path.id} path={path} />
        ))}
      </div>
    </section>
  )
}
