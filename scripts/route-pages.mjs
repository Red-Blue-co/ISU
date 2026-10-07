// GitHub Pages has no server routing, so /about and /community would be served by 404.html
// with a 404 status, and search engines would skip them. Write a real page for each route,
// with its own title, description and canonical link, so each one is served with status 200.
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://isu.sherin.fun'
const ROUTES = {
  about: {
    title: 'About ISU · A community made of the people it helps',
    description: 'ISU is run by students for students. What we believe, why we exist and how you can help build it.',
  },
  community: {
    title: 'Community and groups · ISU Student Community',
    description: 'Join ISU groups for newcomers, housing, study circles, jobs, sports, food and more. Ask, offer and find something to do on the ISU board.',
  },
  login: {
    title: 'Sign in · ISU Student Community',
    description: 'Sign in to your ISU account or create one.',
    noindex: true,
  },
}

const html = readFileSync('dist/index.html', 'utf8')
const setAttr = (s, re, value) => {
  if (!re.test(s)) throw new Error(`route-pages: tag not found: ${re}`)
  return s.replace(re, `$1${value}$2`)
}

for (const [route, page] of Object.entries(ROUTES)) {
  const url = `${SITE}/${route}`
  let s = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
  s = setAttr(s, /(<meta name="description"\s+content=")[^"]*(")/, page.description)
  s = setAttr(s, /(<meta property="og:description"\s+content=")[^"]*(")/, page.description)
  s = setAttr(s, /(<meta property="twitter:description"\s+content=")[^"]*(")/, page.description)
  s = setAttr(s, /(<meta property="og:title" content=")[^"]*(")/, page.title)
  s = setAttr(s, /(<meta property="twitter:title" content=")[^"]*(")/, page.title)
  s = setAttr(s, /(<meta property="og:url" content=")[^"]*(")/, url)
  s = setAttr(s, /(<link rel="canonical" href=")[^"]*(")/, url)
  s = s.replace(/(<link rel="alternate" hreflang="[^"]+" href=")[^"]*(")/g, `$1${url}$2`)
  if (page.noindex) {
    s = /<meta name="robots"/.test(s)
      ? s.replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, follow$2')
      : s.replace('</title>', '</title>\n  <meta name="robots" content="noindex, follow" />')
  }
  writeFileSync(`dist/${route}.html`, s)
}
console.log('route pages:', Object.keys(ROUTES).map((r) => `${r}.html`).join(', '))
