import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const ROOT = process.argv[2]
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.woff2':'font/woff2' }

const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0]
  for (const p of [join(ROOT, url), join(ROOT, url, 'index.html'), join(ROOT, 'index.html')]) {
    try {
      const buf = await readFile(p)
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' })
      return res.end(buf)
    } catch {}
  }
  res.writeHead(404).end()
})
await new Promise(r => server.listen(0, r))
const port = server.address().port

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
let failed = false

for (const n of [4, 10, 14]) {
  await page.goto(`http://localhost:${port}/${n}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const result = await page.evaluate(() => {
    const host = document.querySelector('.slidev-page-' + location.pathname.replace('/','') + ' .mermaid')
                 ?? document.querySelector('.mermaid')
    if (!host) return { found: false }
    const sr = host.shadowRoot
    if (!sr) return { found: true, shadow: false }
    const svg = sr.querySelector('svg')
    const texts = [...sr.querySelectorAll('text, .nodeLabel, .edgeLabel, .cluster-label')]
      .map(e => e.textContent.trim()).filter(Boolean)
    const errorBox = !!sr.querySelector('.error-icon, .error-text') || /Syntax error/i.test(sr.textContent)
    return { found: true, shadow: true, hasSvg: !!svg, viewBox: svg?.getAttribute('viewBox'), texts: [...new Set(texts)], errorBox }
  })
  const ok = result.found && result.shadow && result.hasSvg && !result.errorBox && result.texts.length > 0
  if (!ok) failed = true
  console.log(`slide ${n}: ${ok ? 'RENDERED' : 'FAILED'}`)
  console.log(`  viewBox: ${result.viewBox ?? '-'}  errorBox: ${result.errorBox}`)
  console.log(`  labels: ${JSON.stringify(result.texts ?? [])}`)
}

await browser.close()
server.close()
process.exit(failed ? 1 : 0)
