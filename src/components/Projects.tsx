import { animated, useTransition } from '@react-spring/web'
import { usePortfolio } from '../context/PortfolioContext'
import { useMotion } from '../context/MotionContext'
import SpringLink from './motion/SpringLink'
import FilterButton from './motion/FilterButton'
import Icon from './common/Icon'
import SectionHeading from './common/SectionHeading'
import Tags from './common/Tags'
import type { Language, Project, Translation } from '../types/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
  categoryLabel: string
  language: Language
  t: Translation
  leaving: boolean
}

function ProjectCard({ project, index, categoryLabel, language, t, leaving }: ProjectCardProps) {
  return (
    <SpringLink href={project.url} className={`project-card project-${project.tone}`} tabIndex={leaving ? -1 : 0}>
      <div className="project-visual">
        <span className="project-number">{String(index + 1).padStart(2, '0')} / {categoryLabel}</span>
        <div className="project-art"><span /><Icon name={project.icon} size={43} strokeWidth={1.2} /><span /></div>
        <span className="visual-caption">{project.displayName}</span>
        <Icon name="arrow-up-right" size={18} />
      </div>
      <div className="project-copy">
        <h3>{project.name}</h3>
        <p>{project.description[language]}</p>
        <Tags items={project.tags} />
        <span className="repo-link">{t.repo}<Icon name="arrow-up-right" size={13} /></span>
      </div>
    </SpringLink>
  )
}

export default function Projects() {
  const { data, t, language, filter, setFilter, visibleProjects } = usePortfolio()
  const categoryLabels = Object.fromEntries(data.projectFilters.map(item => [item.id, t[item.labelKey]]))
  const { reducedMotion, pageVisible } = useMotion()
  const settings = data.effects.spring
  const transitions = useTransition(visibleProjects, {
    keys: project => project.id,
    // Keep the first server/client render visible for SEO and hydration.
    initial: { opacity: 1, y: 0, scale: 1 },
    from: { opacity: 0, y: settings.transitionOffset, scale: 0.97 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: -settings.transitionOffset / 2, scale: 0.97 },
    trail: reducedMotion ? 0 : settings.trail,
    config: settings.config,
    immediate: reducedMotion,
    pause: !pageVisible,
    exitBeforeEnter: true,
  })
  return (
    <section id="projects" className="content-section">
      <SectionHeading eyebrow={t.work} title={t.workTitle} marker={data.sections.projects.marker} />
      <div className="filters" role="group" aria-label={t.filterLabel}>
        {data.projectFilters.map(item => (
          <FilterButton key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {t[item.labelKey]}{item.id === 'all' && <span>{String(data.projects.length).padStart(2, '0')}</span>}
          </FilterButton>
        ))}
      </div>
      <div className="project-grid">
        {transitions((style, project, _state, index) => {
          const leaving = !visibleProjects.some(item => item.id === project.id)
          return (
            <animated.div className="project-motion" style={{ ...style, pointerEvents: leaving ? 'none' : 'auto' }} aria-hidden={leaving ? true : undefined}>
              <ProjectCard project={project} index={index} categoryLabel={categoryLabels[project.category] ?? project.category} language={language} t={t} leaving={leaving} />
            </animated.div>
          )
        })}
      </div>
    </section>
  )
}
