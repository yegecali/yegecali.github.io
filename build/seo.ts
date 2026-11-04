import type { HtmlTagDescriptor, Plugin } from 'vite'
import { portfolioData as data } from '../src/data/portfolio'
import { createThemeBootstrap } from '../src/lib/theme'

const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, character => entities[character] ?? character)

const url = new URL(data.metadata.siteUrl)
if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) {
  throw new Error('metadata.siteUrl must be an absolute HTTPS URL without query, hash or credentials')
}
url.pathname = url.pathname.replace(/\/?$/, '/')
export const siteUrl = url.href
export const siteBase = url.pathname

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}#profile`,
      url: siteUrl,
      name: data.metadata.title,
      description: data.metadata.description[data.defaultLanguage],
      inLanguage: data.defaultLanguage,
      mainEntity: { '@id': `${siteUrl}#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: data.profile.name,
      alternateName: data.profile.handle,
      url: siteUrl,
      jobTitle: data.translations[data.defaultLanguage].profile,
      description: data.translations[data.defaultLanguage].aboutText,
      sameAs: data.socials.map(social => social.url),
      knowsAbout: [...new Set(data.skills.flatMap(skill => skill.items))],
    },
  ],
}

export function seoPlugin(): Plugin {
  let ssr = false
  const description = data.metadata.description[data.defaultLanguage]
  const meta = (name: string, content: string): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs: { name, content },
  })
  const og = (property: string, content: string): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs: { property, content },
  })

  return {
    name: 'portfolio-seo',
    configResolved(config) {
      ssr = Boolean(config.build.ssr)
    },
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [
        { tag: 'link', attrs: { rel: 'canonical', href: siteUrl } },
        { tag: 'link', attrs: { rel: 'sitemap', type: 'application/xml', href: `${siteUrl}sitemap.xml` } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: `${siteBase}favicon.svg` } },
        meta('robots', 'index, follow, max-image-preview:large'),
        meta('author', data.profile.name),
        { ...meta('theme-color', data.metadata.themeColor), injectTo: 'head-prepend' },
        {
          tag: 'script',
          attrs: { id: 'portfolio-theme-init' },
          children: createThemeBootstrap(data.appearance),
          injectTo: 'head-prepend',
        },
        og('og:type', 'website'),
        og('og:title', data.metadata.title),
        og('og:description', description),
        og('og:url', siteUrl),
        og('og:site_name', data.metadata.siteName),
        og('og:locale', data.metadata.openGraphLocale),
        meta('twitter:card', 'summary'),
        meta('twitter:title', data.metadata.title),
        meta('twitter:description', description),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        },
      ]
      if (data.metadata.searchConsoleVerification)
        tags.push(meta('google-site-verification', data.metadata.searchConsoleVerification))

      return {
        html: html
          .replace('__PORTFOLIO_LANGUAGE__', escapeHtml(data.defaultLanguage))
          .replace('__PORTFOLIO_TITLE__', escapeHtml(data.metadata.title))
          .replace('__PORTFOLIO_DESCRIPTION__', escapeHtml(description)),
        tags,
      }
    },
    generateBundle() {
      if (ssr) return
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(siteUrl)}</loc></url></urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'favicon.svg',
        source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#f6b66c"/><text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="32" fill="#14101c">${escapeHtml(data.brand.logo)}</text></svg>`,
      })
      // robots.txt is meaningful only at the origin root, not in a project subdirectory.
      if (siteBase === '/')
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
        })
    },
  }
}
