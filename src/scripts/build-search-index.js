import fs from 'fs'
import path from 'path'
import lunr from 'lunr'
import { glob } from 'glob'
import matter from 'gray-matter'

const projectRoot = process.cwd()
const docsDir = path.join(projectRoot, 'src/content/docs')
const pagesDir = path.join(projectRoot, 'src/pages')
const outputPath = path.join(projectRoot, 'public', 'search-index.json')

const cleanContent = (input = '') =>
  input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--.*?-->/gs, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\#_*`>$~|\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractTitle = (frontmatter = {}, body = '', fallback = 'Untitled') => {
  if (frontmatter.title) return frontmatter.title

  const headingMatch = body.match(/^\s*#\s+(.+)/m) || body.match(/<h1[^>]*>(.*?)<\/h1>/i)
  if (headingMatch && headingMatch[1]) {
    return cleanContent(headingMatch[1]) || fallback
  }

  return fallback
}

const extractDescription = (frontmatter = {}, body = '') => {
  if (frontmatter.description) return frontmatter.description
  const clean = cleanContent(body)
  if (!clean) return ''
  return clean.slice(0, 200)
}

const normaliseUrl = (relativePath) => {
  if (!relativePath) return '/'
  let urlPath = `/${relativePath}`.replace(/\\/g, '/')
  urlPath = urlPath.replace(/\/index$/, '/')
  if (urlPath.length > 1 && urlPath.endsWith('/')) {
    urlPath = urlPath.slice(0, -1)
  }
  return urlPath || '/'
}

const createDocRecord = ({ file, baseDir, type }) => {
  const raw = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)

  const relative = path.relative(baseDir, file).replace(/\.(astro|mdx?|md)$/i, '')
  const urlPath = normaliseUrl(type === 'page' && relative === 'index' ? '' : relative)

  const title = extractTitle(data, content, path.basename(relative))
  const description = extractDescription(data, content)

  let lang = data.lang || 'en-us'
  if (!data.lang && type === 'doc') {
    const segments = relative.split(path.sep)
    if (segments[0]) {
      lang = segments[0]
    }
  }

  return {
    id: `${type}:${relative}`,
    title,
    description,
    content: cleanContent(content),
    url: urlPath,
    lang
  }
}

const docsFiles = glob.sync(`${docsDir}/**/*.{md,mdx}`)
const pagesFiles = glob
  .sync(`${pagesDir}/**/*.{astro,md,mdx}`)
  .filter((file) => !file.endsWith(`${path.sep}search.astro`))
  .filter((file) => !path.basename(file).startsWith('['))

const documents = [
  ...docsFiles.map((file) => createDocRecord({ file, baseDir: docsDir, type: 'doc' })),
  ...pagesFiles.map((file) => createDocRecord({ file, baseDir: pagesDir, type: 'page' }))
]

const idx = lunr(function () {
  this.field('title', { boost: 10 })
  this.field('description', { boost: 5 })
  this.field('content')
  this.ref('id')

  documents.forEach((doc) => {
    this.add(doc)
  })
})

fs.writeFileSync(
  outputPath,
  JSON.stringify({
    index: idx.toJSON(),
    documents: documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      url: doc.url,
      lang: doc.lang
    }))
  })
)

console.log(`Search index built successfully with ${documents.length} documents.`)
