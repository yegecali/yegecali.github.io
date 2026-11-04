import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { data, t } = usePortfolio()
  return (
    <footer>
      <a href="#top" className="footer-brand">
        {data.brand.footerLogo}
      </a>
      <p>
        © {new Date().getFullYear()} {data.profile.name} <span>· {t.footer}</span>
      </p>
      <a href="#top" aria-label={t.go}>
        ↑
      </a>
    </footer>
  )
}
