import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './common/SectionHeading'
import Tags from './common/Tags'
import Icon from './common/Icon'
import { useEffect, useRef } from 'react'

export default function Experience() {
  const { data, t, language } = usePortfolio()
  const timelineRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const entries = timelineRef.current?.querySelectorAll('li.experience-step')
    if (!entries || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      changes => {
        changes.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-reached')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    )
    entries.forEach(entry => observer.observe(entry))
    return () => observer.disconnect()
  }, [])
  return (
    <section id="experience" className="content-section experience">
      <SectionHeading
        eyebrow={t.experienceLabel}
        title={t.experienceTitle}
        marker={data.sections.experience.marker}
      />
      <p className="section-description">{t.experienceDescription}</p>
      <ol className="experience-timeline" ref={timelineRef}>
        {data.experience.map(job => {
          const copy = job.content[language]
          return (
            <li key={job.id} className="experience-step">
              <article
                className={`experience-card${!job.endYear ? ' is-current' : ''}`}
                aria-labelledby={`job-${job.id}`}
              >
                <div className="experience-period">
                  <time dateTime={job.startYear}>{job.startYear}</time>
                  <span className="experience-period-separator" aria-hidden="true">
                    —
                  </span>
                  {job.endYear ? (
                    <time dateTime={job.endYear}>{job.endYear}</time>
                  ) : (
                    <span className="experience-current">{t.present}</span>
                  )}
                </div>
                <div className="experience-body">
                  <header className="experience-header">
                    <span className="company-monogram" aria-hidden="true">
                      {job.initials}
                    </span>
                    <div className="experience-identity">
                      <p className="experience-company">{job.company}</p>
                      <h3 id={`job-${job.id}`}>{job.role}</h3>
                      <p className="experience-meta">
                        <Icon name="map-pin" size={13} />
                        {job.location}
                      </p>
                    </div>
                  </header>
                  <p className="experience-summary">{copy.summary}</p>
                  <h4 className="experience-contributions">{t.experienceContributions}</h4>
                  <ul className="experience-highlights">
                    {copy.highlights.slice(0, 2).map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Tags items={job.tags} />
                  <details className="experience-details">
                    <summary>
                      {t.experienceDetails}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <ul className="experience-highlights">
                      {[...copy.highlights.slice(2), ...copy.details].map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <h4>{t.experienceRecognition}</h4>
                    <ul className="experience-highlights">
                      {copy.recognition.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
      <article className="education-card">
        <Icon name="code" size={24} />
        <div>
          <span className="experience-label">{t.educationLabel}</span>
          <h3>{t.educationDegree}</h3>
          <p>{data.education.institution}</p>
          <p className="experience-meta">
            {data.education.startYear} — {data.education.endYear} · {data.education.location}
          </p>
        </div>
      </article>
    </section>
  )
}
