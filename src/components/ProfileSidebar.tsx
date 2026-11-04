import { usePortfolio } from '../context/PortfolioContext'
import ExternalLink from './common/ExternalLink'
import Icon from './common/Icon'

export default function ProfileSidebar() {
  const { data, t, primarySocial } = usePortfolio()
  const { profile } = data
  return (
    <aside className="hero-profile" aria-label={profile.name}>
      <div className="hero-portrait">
        <img
          src={`${import.meta.env.BASE_URL}${profile.avatar.path}`}
          alt={t.portraitLabel.replace('{name}', profile.name)}
          width={profile.avatar.width}
          height={profile.avatar.height}
          loading="eager"
          decoding="async"
        />
        <span className="hero-portrait-label" aria-hidden="true">
          {profile.specialty}
        </span>
      </div>
      <div className="hero-profile-details">
        <p className="hero-profile-name">
          {profile.name}
          <span>{profile.monogram.punctuation}</span>
        </p>
        <p className="hero-profile-role">{t.profile}</p>
        <div className="hero-profile-links">
          <a
            className="hero-cv"
            href={`${import.meta.env.BASE_URL}${profile.cv.path}`}
            download={profile.cv.filename}
          >
            <Icon name="download" size={16} />
            {t.downloadCv}
          </a>
          <ExternalLink href={primarySocial.url} className="hero-github" aria-label={primarySocial.label}>
            <Icon name="github" size={19} />
          </ExternalLink>
        </div>
      </div>
    </aside>
  )
}
