import { usePortfolio } from '../context/PortfolioContext'
import useClipboard from '../hooks/useClipboard'
import ExternalLink from './common/ExternalLink'
import Icon from './common/Icon'
import FloatingAccent from './motion/FloatingAccent'
import SpringLink from './motion/SpringLink'

export default function ProfileSidebar() {
  const { data, t, primarySocial } = usePortfolio()
  const { profile, socials } = data
  const { monogram } = profile
  const { status, copy } = useClipboard()
  return (
    <aside className="profile-wrap">
      <div className="portrait" aria-label={t.portraitLabel.replace('{name}', profile.name)}>
        <span className="portrait-grid" />
        <span className="portrait-code">{monogram.code}</span>
        <span className="monogram">
          {monogram.primary}
          <span>{monogram.secondary}</span>
          <i>{monogram.punctuation}</i>
        </span>
        <span className="portrait-caption">{monogram.caption}</span>
        <FloatingAccent className="portrait-star" delay={200}>
          ✳
        </FloatingAccent>
      </div>
      <div className="profile-card">
        <span className="profile-status">
          <i />
          {t.tag}
        </span>
        <h1>
          {profile.name}
          <span>{monogram.punctuation}</span>
        </h1>
        <ExternalLink href={primarySocial.url} className="handle">
          {profile.handle}
          <Icon name="arrow-up-right" size={12} />
        </ExternalLink>
        <p className="role">{t.profile}</p>
        <p className="bio">{t.bio}</p>
        <p className="profile-capabilities">{t.capabilities}</p>
        <div className="profile-meta">
          <span>
            <Icon name="map-pin" size={15} />
            {t.location}
          </span>
          <span>
            <Icon name="code" size={15} />
            {profile.specialty}
          </span>
        </div>
        <a
          className="download-cv"
          href={`${import.meta.env.BASE_URL}${profile.cv.path}`}
          download={profile.cv.filename}
        >
          <Icon name="download" size={18} />
          <span>{t.downloadCv}</span>
          <span className="download-cv-format">PDF</span>
        </a>
        <a className="profile-learn-more" href="#about">
          {t.learnMore}
          <Icon name="arrow-right" size={16} />
        </a>
        <div className="profile-divider" />
        <div className="profile-bottom">
          <div className="profile-socials">
            {socials.map(social => (
              <SpringLink href={social.url} aria-label={social.label} key={social.id}>
                <Icon name={social.icon} size={19} />
              </SpringLink>
            ))}
          </div>
          <button
            className="copy-button"
            onClick={() => copy(primarySocial.url)}
            aria-label={t.copy}
            title={t.copy}
          >
            {status === 'success' ? <Icon name="check" size={17} /> : <Icon name="copy" size={17} />}
          </button>
        </div>
        <span className="copy-feedback" role="status">
          {status === 'success' ? t.copied : status === 'error' ? t.copyError : ''}
        </span>
      </div>
      <p className="sidebar-note" data-aos="portfolio-up">
        <span />
        {t.note}
      </p>
    </aside>
  )
}
