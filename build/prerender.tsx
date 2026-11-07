import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import App from '../src/App'
import { PortfolioProvider } from '../src/context/PortfolioContext'
import { portfolioData as data } from '../src/data/portfolio'
import { escapeHtml, siteUrl } from './seo'

const filename = resolve('dist/index.html')
const template = readFileSync(filename, 'utf8')
const placeholder = '<div id="root"></div>'
assert.ok(template.includes(placeholder), 'Missing HTML prerender placeholder')
const markup = renderToString(
  <PortfolioProvider>
    <App />
  </PortfolioProvider>,
)
// A callback keeps dollar signs in editable JSON content literal.
const html = template.replace(placeholder, () => `<div id="root">${markup}</div>`)

// Fail the existing GitHub Action if the searchable HTML or metadata regresses.
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Exactly one main heading is required')
assert.ok(html.includes(escapeHtml(data.profile.name)), 'Missing rendered identity')
assert.ok(
  html.includes(escapeHtml(data.translations[data.defaultLanguage].aboutText)),
  'Missing rendered bio',
)
for (const project of data.projects)
  assert.ok(html.includes(escapeHtml(project.name)), `Missing rendered project ${project.id}`)
for (const job of data.experience) {
  assert.ok(html.includes(escapeHtml(job.company)), `Missing rendered employer ${job.id}`)
  assert.ok(
    html.includes(escapeHtml(job.content[data.defaultLanguage].summary)),
    `Missing rendered experience ${job.id}`,
  )
}
assert.ok(html.includes(escapeHtml(data.education.institution)), 'Missing rendered education')
assert.ok(html.includes(`rel="canonical" href="${siteUrl}"`), 'Missing canonical URL')
assert.ok(html.includes('name="robots" content="index, follow'), 'Missing index directive')
assert.ok(!html.includes('__PORTFOLIO_'), 'Unresolved metadata placeholders')
const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
assert.ok(jsonLd, 'Missing structured data')
assert.equal(JSON.parse(jsonLd)['@context'], 'https://schema.org')
assert.ok(
  readFileSync(resolve('dist/sitemap.xml'), 'utf8').includes(`<loc>${siteUrl}</loc>`),
  'Missing sitemap URL',
)

writeFileSync(filename, html)
console.log(
  'SEO checks passed: prerendered identity, bio, projects, heading, canonical, index directive, JSON-LD and sitemap.',
)
