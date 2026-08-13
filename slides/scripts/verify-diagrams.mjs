#!/usr/bin/env node
// Proves every Mermaid diagram in the deck actually rendered.
//
// Why this exists: a Mermaid parse error renders an error box on the slide and the
// build still exits 0. The two obvious cheaper checks both lie —
//   - grepping the bundle finds nothing, because Slidev lz-string-compresses the
//     source into a `code-lz` prop
//   - querySelectorAll('svg') finds nothing, because the SVG renders into the
//     mermaid component's shadow root
// So: build, serve, render, and read the live SVG through shadowRoot.
//
// Usage: node scripts/verify-diagrams.mjs <built-dir>

import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = process.argv[2]
if (!BUILD) {
  console.error('usage: node scripts/verify-diagrams.mjs <built-dir>')
  process.exit(2)
}

// Which slides should carry a diagram? Derive it from the source rather than
// hardcoding, so a diagram that moves in a later iteration fails loudly instead of
// being silently skipped.
async function slidesWithDiagrams() {
  const entry = await readFile(join(ROOT, 'slides.md'), 'utf8')
  const imports = [...entry.matchAll(/^src:\s*(\S+)/gm)].map((m) => m[1])
  if (!imports.length) throw new Error('slides.md has no src: imports — deck layout changed')

  // Slide 1 is the title slide in slides.md. Imported pages follow, in order.
  let n = 1
  const found = []
  for (const rel of imports) {
    const page = await readFile(join(ROOT, rel), 'utf8')
    for (const slide of page.split(/^---$/m)) {
      n += 1
      if (/^```mermaid\s*$/m.test(slide)) found.push(n)
    }
  }
  return found
}

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0]
  // Last candidate is the SPA fallback.
  for (const p of [join(BUILD, url), join(BUILD, url, 'index.html'), join(BUILD, 'index.html')]) {
    try {
      const buf = await readFile(p)
      res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' })
      return res.end(buf)
    } catch {}
  }
  res.writeHead(404).end()
})

const expected = await slidesWithDiagrams()
if (!expected.length) {
  console.error('FAIL: no ```mermaid blocks found in any page. Expected at least one.')
  process.exit(1)
}
console.log(`checking ${expected.length} diagram slides: ${expected.join(', ')}`)

await new Promise((r) => server.listen(0, r))
const port = server.address().port
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
let failed = false

for (const n of expected) {
  await page.goto(`http://localhost:${port}/${n}`, { waitUntil: 'networkidle' })

  // Wait for the diagram rather than sleeping a fixed interval. No fallback selector:
  // matching "any .mermaid on the page" would let a broken slide pass by reading a
  // different slide's diagram.
  const selector = `.slidev-page-${n} .mermaid`
  let result
  try {
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.shadowRoot?.querySelector('svg') != null,
      selector,
      { timeout: 15000 },
    )
    result = await page.evaluate((sel) => {
      const sr = document.querySelector(sel).shadowRoot
      const svg = sr.querySelector('svg')
      const texts = [...sr.querySelectorAll('text, .nodeLabel, .edgeLabel, .cluster-label')]
        .map((e) => e.textContent.trim())
        .filter(Boolean)
      return {
        viewBox: svg.getAttribute('viewBox'),
        texts: [...new Set(texts)],
        errorBox: !!sr.querySelector('.error-icon, .error-text') || /Syntax error/i.test(sr.textContent),
      }
    }, selector)
  } catch {
    console.log(`slide ${n}: FAILED — no rendered SVG under ${selector} within 15s`)
    failed = true
    continue
  }

  const ok = !result.errorBox && result.texts.length > 0
  if (!ok) failed = true
  console.log(`slide ${n}: ${ok ? 'RENDERED' : 'FAILED'}`)
  console.log(`  viewBox: ${result.viewBox}  errorBox: ${result.errorBox}`)
  console.log(`  labels: ${JSON.stringify(result.texts)}`)
}

await browser.close()
server.close()

if (failed) console.error('\nFAIL: at least one diagram did not render.')
process.exit(failed ? 1 : 0)
