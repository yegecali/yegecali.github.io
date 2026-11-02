import { usePortfolio } from '../context/PortfolioContext'
import Icon from './common/Icon'
import SectionHeading from './common/SectionHeading'
import Tags from './common/Tags'
import SpringCard from './motion/SpringCard'

export default function Skills() {
  const { data, t } = usePortfolio()
  return (
    <section id="skills" className="content-section">
      <SectionHeading eyebrow={t.stack} title={t.stackTitle} marker={data.sections.skills.marker} />
      <div className="skills-grid">
        {data.skills.map((skill, index) => (
          <SpringCard className="skill-card" data-aos="portfolio-up" data-aos-delay={(index % 2) * 100} key={skill.id}>
            <Icon name={skill.icon} size={21} />
            <h3>{skill.title}</h3>
            <Tags items={skill.items} />
          </SpringCard>
        ))}
      </div>
    </section>
  )
}
