import { usePortfolio } from '../context/PortfolioContext'
import Icon from './common/Icon'
import SectionHeading from './common/SectionHeading'
import Tags from './common/Tags'
import SpringCard from './motion/SpringCard'
import { FaJava } from 'react-icons/fa6'
import { SiSpring } from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'
import { LuLayers3 } from 'react-icons/lu'
import type { IconType } from 'react-icons'

const featuredIcons: Record<string, IconType> = {
  java: FaJava,
  spring: SiSpring,
  azure: VscAzure,
  architecture: LuLayers3,
}

export default function Skills() {
  const { data, t } = usePortfolio()
  return (
    <section id="skills" className="content-section">
      <SectionHeading eyebrow={t.stack} title={t.stackTitle} marker={data.sections.skills.marker} />
      <div className="featured-skills">
        {data.featuredSkills.map(skill => {
          const TechnologyIcon = featuredIcons[skill.id] ?? LuLayers3
          return (
            <SpringCard className={`featured-skill featured-skill-${skill.id}`} key={skill.id}>
              <TechnologyIcon size={32} aria-hidden="true" focusable="false" />
              <h3>{skill.id === 'architecture' ? t.architectureName : skill.name}</h3>
              <p>{t[skill.descriptionKey]}</p>
            </SpringCard>
          )
        })}
      </div>
      <details className="skills-details">
        <summary>
          {t.showAllSkills}
          <Icon name="arrow-right" size={18} />
        </summary>
        <div className="skills-grid">
          {data.skills.map(skill => (
            <SpringCard className="skill-card" key={skill.id}>
              <Icon name={skill.icon} size={21} />
              <h3>{skill.title}</h3>
              <Tags items={skill.items} />
            </SpringCard>
          ))}
        </div>
      </details>
    </section>
  )
}
