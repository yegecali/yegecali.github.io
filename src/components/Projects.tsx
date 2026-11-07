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
  categoryLabel: string
  language: Language
  t: Translation
  leaving: boolean
}

function ProjectCard({ project, categoryLabel, language, t, leaving }: ProjectCardProps) {
  return (
    <article
      className={`project-card${project.featured ? ' project-featured' : ''}`}
      aria-labelledby={`project-${project.id}`}
    >
      <div className="project-copy">
        <div className="project-heading">
          <span className="project-status">{categoryLabel}</span>
          {project.featured && <span className="project-featured-label">{t.projectFeatured}</span>}
        </div>
        <h3 id={`project-${project.id}`}>{project.name}</h3>
        <p>{project.description[language]}</p>
        <ul className="project-highlights">
          {project.highlights[language].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="project-stack">
          <span className="project-stack-label">{t.projectStack}</span>
          <Tags items={project.tags} />
        </div>
        {project.url && (
          <div className="project-footer">
            <span className="project-availability">{t.projectPublic}</span>
            <SpringLink
              href={project.url}
              className="repo-link"
              tabIndex={leaving ? -1 : 0}
              aria-label={`${t.repo}: ${project.name}`}
            >
              {t.repo}
              <Icon name="arrow-up-right" size={14} />
            </SpringLink>
          </div>
        )}
      </div>
    </article>
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
      <p className="section-description">{t.workDescription}</p>
      <div className="filters" role="group" aria-label={t.filterLabel}>
        {data.projectFilters.map(item => (
          <FilterButton key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {t[item.labelKey]}
            {item.id === 'all' && <span>{String(data.projects.length).padStart(2, '0')}</span>}
          </FilterButton>
        ))}
      </div>
      <div className="project-grid">
        {transitions((style, project) => {
          const leaving = !visibleProjects.some(item => item.id === project.id)
          return (
            <animated.div
              className="project-motion"
              style={{ ...style, pointerEvents: leaving ? 'none' : 'auto' }}
              aria-hidden={leaving ? true : undefined}
            >
              <ProjectCard
                project={project}
                categoryLabel={categoryLabels[project.category] ?? project.category}
                language={language}
                t={t}
                leaving={leaving}
              />
            </animated.div>
          )
        })}
      </div>
    </section>
  )
}
