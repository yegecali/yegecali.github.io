import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import SpringLink from './motion/SpringLink'
import FloatingAccent from './motion/FloatingAccent'
import useClipboard from '../hooks/useClipboard'
import type { Translation } from '../types/portfolio'

function ContactPath({ path }: { path: Translation['contactPaths'][number] }) {
  const { t, contactSocial } = usePortfolio()
  const { copy, status } = useClipboard()
  return (
    <article id={path.id} className="contact-path" tabIndex={-1}>
      <h3>{path.title}</h3>
      <p>{path.description}</p>
      <blockquote className="contact-message">{path.message}</blockquote>
      <div className="contact-path-actions">
        <button type="button" onClick={() => copy(path.message)}>
          <Icon name={status === 'success' ? 'check' : 'copy'} size={16} />
          {status === 'success' ? t.contactCopied : t.contactCopy}
        </button>
        <SpringLink href={contactSocial.url}>
          {contactSocial.label}
          <Icon name="arrow-up-right" size={16} />
        </SpringLink>
      </div>
      <span className="contact-copy-status" role="status">
        {status === 'success' ? t.contactCopied : status === 'error' ? t.contactCopyError : ''}
      </span>
    </article>
  )
}

export default function Contact() {
  const { t } = usePortfolio()
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <FloatingAccent className="contact-orbit" delay={350}>
          ✳
        </FloatingAccent>
        <div>
          <span className="eyebrow">{t.contactLabel}</span>
          <h2 id="contact-title">{t.connection}</h2>
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
