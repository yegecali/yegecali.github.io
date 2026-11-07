import { readFile, mkdir, writeFile, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdfkit'

const root = fileURLToPath(new URL('../', import.meta.url))
const data = JSON.parse(await readFile(path.join(root, 'src/data/portfolio.json'), 'utf8'))
const language = data.defaultLanguage
const t = data.translations[language]
if (!t) throw new Error(`Unknown CV language: ${language}`)

const publicRoot = path.join(root, 'public')
const cv = data.profile.cv
const content = cv.content[language]
const output = path.resolve(publicRoot, cv.path)
if (path.isAbsolute(cv.path) || !output.startsWith(`${publicRoot}${path.sep}`) || !cv.path.endsWith('.pdf')) {
  throw new Error('profile.cv.path must be a relative PDF path inside public/')
}

// The reference is public/cv/example.pdf: Letter, serif type, centered identity,
// black section rules and employer/role on the left with location/dates on the right.
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 42, bottom: 42, left: 43, right: 43 },
  bufferPages: true,
  lang: language,
  info: {
    Title: `${cv.fullName ?? data.profile.name} | ${t.profile}`,
    Author: cv.fullName ?? data.profile.name,
    Subject: t.profile,
    Creator: 'Portfolio CV generator',
  },
})
const chunks = []
const completed = new Promise((resolve, reject) => {
  doc.on('data', chunk => chunks.push(chunk))
  doc.on('end', () => resolve(Buffer.concat(chunks)))
  doc.on('error', reject)
})
const left = 43
const width = doc.page.width - left * 2
const clean = value => String(value).replace(/[\u2010-\u2015\u2212]/g, '-')
const labels =
  language === 'es'
    ? {
        summary: 'PERFIL PROFESIONAL',
        experience: 'EXPERIENCIA PROFESIONAL',
        strengths: 'HABILIDADES CLAVE',
        skills: 'COMPETENCIAS TÉCNICAS',
        education: 'FORMACIÓN ACADÉMICA',
        recognition: 'LOGROS Y RECONOCIMIENTOS',
      }
    : {
        summary: 'PROFESSIONAL PROFILE',
        experience: 'PROFESSIONAL EXPERIENCE',
        strengths: 'KEY STRENGTHS',
        skills: 'TECHNICAL SKILLS',
        education: 'EDUCATION',
        recognition: 'ACHIEVEMENTS AND RECOGNITION',
      }

function style(size = 10.5, bold = false, italic = false) {
  doc
    .font(italic ? 'Times-Italic' : bold ? 'Times-Bold' : 'Times-Roman')
    .fontSize(size)
    .fillColor('#111111')
}

function height(value, { size = 10.5, bold = false, italic = false, indent = 0 } = {}) {
  style(size, bold, italic)
  return doc.heightOfString(clean(value), { width: width - indent, lineGap: 1.5 })
}

function ensureSpace(points) {
  if (doc.y + points > doc.page.height - 42) {
    doc.addPage()
    return true
  }
  return false
}

function text(
  value,
  { size = 10.5, bold = false, italic = false, indent = 0, gap = 4, link, align = 'left' } = {},
) {
  ensureSpace(height(value, { size, bold, italic, indent }) + gap)
  style(size, bold, italic)
  doc.text(clean(value), left + indent, doc.y, { width: width - indent, lineGap: 1.5, link, align })
  doc.y += gap
}

function section(title, nextHeight = 60) {
  ensureSpace(33 + nextHeight)
  doc.y += 8
  text(title, { size: 11, bold: true, gap: 3 })
  doc
    .moveTo(left, doc.y)
    .lineTo(left + width, doc.y)
    .lineWidth(0.8)
    .strokeColor('#111111')
    .stroke()
  doc.y += 7
}

function row(primary, secondary, { size = 10.5, italic = false, gap = 3 } = {}) {
  style(size, true, italic)
  const rightWidth = Math.min(width * 0.37, doc.widthOfString(clean(secondary)) + 2)
  const primaryWidth = width - rightWidth - 15
  const primaryHeight = doc.heightOfString(clean(primary), { width: primaryWidth, lineGap: 1.5 })
  const secondaryHeight = doc.heightOfString(clean(secondary), { width: rightWidth, lineGap: 1.5 })
  const rowHeight = Math.max(primaryHeight, secondaryHeight)
  ensureSpace(rowHeight + gap)
  const y = doc.y
  doc.text(clean(primary), left, y, { width: primaryWidth, lineGap: 1.5 })
  doc.text(clean(secondary), left + width - rightWidth, y, {
    width: rightWidth,
    align: 'right',
    lineGap: 1.5,
  })
  doc.y = y + rowHeight + gap
}

function bullets(items, { italic = false, continuation } = {}) {
  for (const item of items) {
    // A bullet stays with its complete paragraph; no clipped height boxes.
    if (ensureSpace(height(item, { indent: 20, italic }) + 3) && continuation) continuation()
    const y = doc.y
    style(10.5)
    doc.text('•', left + 7, y, { width: 8, lineBreak: false })
    doc.y = y
    text(item, { indent: 20, italic, gap: 3 })
  }
}

text((cv.fullName ?? data.profile.name).toLocaleUpperCase(language), {
  size: 15,
  bold: true,
  align: 'center',
  gap: 5,
})
text(content.headline ?? t.educationDegree, { size: 14, bold: true, align: 'center', gap: 5 })
text([cv.location ?? t.location, data.profile.email, cv.phone].filter(Boolean).join(' • '), {
  size: 10,
  align: 'center',
  gap: 3,
})
// Keep live professional links on one unobtrusive line under the contact details.
const links = [
  ...data.socials.map(social => ({ label: social.label, url: social.url })),
  { label: 'Portfolio', url: data.metadata.siteUrl },
]
style(9)
const linkGap = 16
const linksWidth =
  links.reduce((total, link) => total + doc.widthOfString(link.label), 0) + linkGap * (links.length - 1)
let linkX = left + (width - linksWidth) / 2
const linkY = doc.y
for (const link of links) {
  const linkWidth = doc.widthOfString(link.label)
  doc.text(link.label, linkX, linkY, {
    width: linkWidth + 1,
    lineBreak: false,
    link: link.url,
    underline: true,
  })
  linkX += linkWidth + linkGap
}
doc.y = linkY + 16

section(labels.summary, height(content.summary))
text(content.summary)
section(labels.strengths, 70)
bullets(content.strengths)
section(labels.experience, 100)
for (const job of data.experience) {
  const copy = content.experience?.[job.id] ?? job.content[language]
  const responsibilities = copy.responsibilities ?? [...copy.highlights, ...copy.details]
  ensureSpace(54 + height(copy.summary) + height(responsibilities[0] ?? '', { indent: 20 }))
  row(job.company.toLocaleUpperCase(language), job.location)
  row(job.role, `${job.startYear} - ${job.endYear ?? t.present}`, { gap: 6 })
  text(copy.summary, { gap: 6 })
  bullets(responsibilities, {
    continuation: () => {
      row(job.company.toLocaleUpperCase(language), language === 'es' ? 'Continuación' : 'Continued')
      text(job.role, { bold: true, gap: 6 })
    },
  })
  doc.y += 6
}

section(labels.recognition, 70)
for (const job of data.experience) {
  const recognition = (content.experience?.[job.id] ?? job.content[language]).recognition
  if (!recognition.length) continue
  ensureSpace(24 + height(recognition[0], { indent: 20 }))
  text(job.company, { bold: true, gap: 4 })
  bullets(recognition)
  doc.y += 2
}

const competenciesHeight = content.competencies.reduce(
  (total, competency) => total + height(`${competency.title}: ${competency.items}`, { bold: true }) + 3,
  96,
)
if (competenciesHeight <= doc.page.height - 84) ensureSpace(competenciesHeight)
section(labels.skills, 70)
for (const competency of content.competencies) {
  const combined = `${competency.title}: ${competency.items}`
  ensureSpace(height(combined, { bold: true }) + 4)
  style(10.5, true)
  doc.text(`${clean(competency.title)}: `, left, doc.y, { width, lineGap: 1.5, continued: true })
  style()
  doc.text(clean(competency.items), { continued: false })
  doc.y += 3
}

section(labels.education, 30)
row(data.education.institution.toLocaleUpperCase(language), data.education.location, { size: 10 })
row(t.educationDegree, `${data.education.startYear} - ${data.education.endYear}`, { italic: true, gap: 4 })

const pages = doc.bufferedPageRange()
for (let index = 0; index < pages.count; index++) {
  doc.switchToPage(index)
  style(8)
  doc
    .fillColor('#555555')
    .text(`${data.profile.name} | ${index + 1} / ${pages.count}`, left, doc.page.height - 24, {
      lineBreak: false,
    })
}
doc.end()
const pdf = await completed
await mkdir(path.dirname(output), { recursive: true })
const temporary = `${output}.${process.pid}.tmp`
try {
  await writeFile(temporary, pdf)
  await rename(temporary, output)
} finally {
  await rm(temporary, { force: true })
}
console.log(`CV generado: ${cv.path} (${pages.count} páginas)`)
