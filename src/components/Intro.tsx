import Icon from './common/Icon'
import { usePortfolio } from '../context/PortfolioContext'
import FloatingAccent from './motion/FloatingAccent'

export default function Intro() {
  const { data, t } = usePortfolio()
  return (
    <section className="intro" aria-label={`${t.hello} ${data.profile.name}`}>
      <p className="eyebrow">
        <span />
        {t.hello} {data.profile.name}
      </p>
      <h2>
        {t.title}
        <br />
        <span>{t.title2}</span>
        <FloatingAccent className="intro-spark">
          <Icon name="sparkles" size={31} />
        </FloatingAccent>
      </h2>
      <p>{t.intro}</p>
    </section>
  )
}
