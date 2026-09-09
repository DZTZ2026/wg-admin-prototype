import fs from 'node:fs'
import path from 'node:path'

const dir = 'src/prd/html'
const out = 'public/prd-content'
fs.mkdirSync(out, { recursive: true })

for (const file of fs.readdirSync(dir)) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8')
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (!main) {
    console.error('no main', file)
    continue
  }
  const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim()
  const sub = (html.match(/<header[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim()
  const wrapped = `<div data-title="${title}" data-sub="${sub}">${main[1]}</div>`
  fs.writeFileSync(path.join(out, file), wrapped)
  console.log('wrote', file)
}
