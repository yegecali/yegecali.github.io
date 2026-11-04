import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './common/SectionHeading'
import Tags from './common/Tags'
import Icon from './common/Icon'

export default function Experience() {
  const { data, t, language } = usePortfolio()
  return (
    <section id="experience" className="content-section experience">
      <SectionHeading
        eyebrow={t.experienceLabel}
        title={t.experienceTitle}
        marker={data.sections.experience.marker}
      />
      <p className="section-description">{t.experienceDescription}</p>
      <ol className="experience-timeline">
        {data.experience.map(job => {
          const copy = job.content[language]
          return (
            <li key={job.id}>
              <article className="experience-card" aria-labelledby={`job-${job.id}`}>
                <header className="experience-header">
                  <span className="company-monogram" aria-hidden="true">
                    {job.initials}
                  </span>
                  <div>
                    <p className="experience-company">{job.company}</p>
                    <h3 id={`job-${job.id}`}>{job.role}</h3>
                    <p className="experience-meta">
                      <span>
                        <time dateTime={job.startYear}>{job.startYear}</time> —{' '}
                        {job.endYear ? <time dateTime={job.endYear}>{job.endYear}</time> : t.present}
                      </span>
                      <span>
                        <Icon name="map-pin" size={13} />
                        {job.location}
                      </span>
                    </p>
                  </div>
                </header>
                <p className="experience-summary">{copy.summary}</p>
                <ul className="experience-highlights">
                  {copy.highlights.slice(0, 2).map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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
                  <div className="experience-project">
                    <span className="experience-label">{t.experienceProject}</span>
                    <h4>{copy.projectTitle}</h4>
                    <p>{copy.projectDescription}</p>
                  </div>
                  <h4>{t.experienceRecognition}</h4>
                  <ul className="experience-highlights">
                    {copy.recognition.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
                <Tags items={job.tags} />
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
