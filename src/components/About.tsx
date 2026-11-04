import { usePortfolio } from '../context/PortfolioContext'
import SectionHeading from './common/SectionHeading'

export default function About() {
  const { data, t } = usePortfolio()
  return (
    <section id="about" className="content-section">
      <SectionHeading eyebrow={t.aboutLabel} title={t.aboutTitle} marker={data.sections.about.marker} />
      <p className="about-text" data-aos="portfolio-up">
        {t.aboutText}
      </p>
      <div className="values">
        {t.values.map((value, index) => (
          <article key={value.title} data-aos="portfolio-up" data-aos-delay={index * 100}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
