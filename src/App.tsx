import { useRef } from 'react'
import { usePortfolio } from './context/PortfolioContext'
import useAos from './hooks/useAos'
import Header from './components/Header'
import Intro from './components/Intro'
import ParticlesBackground from './components/ParticlesBackground'
import Connections from './components/Connections'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { MotionProvider } from './context/MotionContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <PortfolioPage />
      </MotionProvider>
    </ThemeProvider>
  )
}

function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { data, t, filter, language } = usePortfolio()
  useAos(rootRef, filter, language, data.effects.aos)

  return (
    <div id="top" className="site-shell" ref={rootRef}>
      <ParticlesBackground />
      <a href="#main" className="skip-link">
        {t.skipLink}
      </a>
      <Header />
      <main id="main" className="layout">
        <Intro />
        <div className="main-content">
          <Connections />
          <Experience />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  )
}
