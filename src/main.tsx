import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { PortfolioProvider } from './context/PortfolioContext'
import './styles/main.scss'

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element')

const app = (
  <React.StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </React.StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
