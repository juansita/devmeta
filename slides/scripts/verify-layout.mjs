#!/usr/bin/env node
// Proves no slide overflows its frame at 16:9, at any click state.
//
// Why this exists: "no slide overflows" is an increment exit criterion that can
// otherwise only be checked by looking at 19 slides by hand, every time anything
// changes. A theme change or a new reveal is exactly what breaks it.
//
// Checked at every click index, not just the first. Slidev's default hidden state is
// opacity-based so the box is kept and layout does not reflow — but `v-click.hide`
// removes the box, and a deck using it can fit at click 0 and overflow at click 3.
//
// Usage: node scripts/verify-layout.mjs <built-dir>

import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// A couple of px of subpixel rounding is not an overflow.
const TOLERANCE = 4

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = process.argv[2]
if (!BUILD) {
  console.error('usage: node scripts/verify-layout.mjs <built-dir>')
  process.exit(2)
}

// Derive the slide count from source rather than hardcoding it, so a page added or
// removed later fails loudly instead of being silently skipped.
async function slideCount() {
  const entry = await readFile(join(ROOT, 'slides.md'), 'utf8')
  const imports = [...entry.matchAll(/^src:\s*(\S+)/gm)].map((m) => m[1])
  if (!imports.length) throw new Error('slides.md has no src: imports — deck layout changed')
  let n = 1 // the title slide in slides.md
  for (const rel of imports) {
    const page = await readFile(join(ROOT, rel), 'utf8')
    n += page.split(/^---$/m).length
  }
  return n
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

const total = await slideCount()
console.log(`checking ${total} slides at 1280x720`)

await new Promise((r) => server.listen(0, r))
const port = server.address().port
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
let failed = false

// Measure the worst overflow on a slide, scoped to that slide's own element.
// Slidev keeps neighbouring slides in the DOM, so a document-wide query would
// measure the wrong content.
const measure = (n) =>
  page.evaluate((n) => {
    const slide = document.querySelector(`.slidev-page-${n}`)
    if (!slide) return null
    const frame = slide.getBoundingClientRect()
    let bottom = -Infinity
    let right = -Infinity
    for (const el of slide.querySelectorAll('*')) {
      const b = el.getBoundingClientRect()
      if (b.width === 0 && b.height === 0) continue
      if (getComputedStyle(el).position === 'fixed') continue
      bottom = Math.max(bottom, b.bottom)
      right = Math.max(right, b.right)
    }
    return {
      clicks: Number(document.querySelector('#slide-content')?.dataset?.clicks ?? 0),
      bottom: Math.round(bottom - frame.bottom),
      right: Math.round(right - frame.right),
    }
  }, n)

for (let n = 1; n <= total; n++) {
  // How many click steps does this slide have? Count its reveal targets.
  await page.goto(`http://localhost:${port}/${n}`, { waitUntil: 'networkidle' })
  await page.waitForSelector(`.slidev-page-${n}`, { timeout: 15000 }).catch(() => {})
  const steps = await page.evaluate(
    (n) => document.querySelectorAll(`.slidev-page-${n} [class*="slidev-vclick"]`).length,
    n,
  )

  let worst = null
  // Click state is a query param — the path form /<n>/<c> 404s in a built deck.
  for (let c = 0; c <= steps; c++) {
    if (c > 0) await page.goto(`http://localhost:${port}/${n}?clicks=${c}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
    const m = await measure(n)
    if (!m) continue
    if (!worst || m.bottom > worst.bottom || m.right > worst.right) worst = { ...m, at: c }
  }

  if (!worst) {
    console.log(`slide ${String(n).padStart(2)}: FAILED — slide element not found`)
    failed = true
    continue
  }

  const over = worst.bottom > TOLERANCE || worst.right > TOLERANCE
  if (over) failed = true
  console.log(
    `slide ${String(n).padStart(2)}: ${over ? 'OVERFLOWS' : 'fits'}  ` +
      `bottom ${worst.bottom > 0 ? '+' : ''}${worst.bottom}px  ` +
      `right ${worst.right > 0 ? '+' : ''}${worst.right}px  ` +
      `(worst of ${steps + 1} click states)`,
  )
}

await browser.close()
server.close()

if (failed) console.error(`\nFAIL: at least one slide overflows its frame (tolerance ${TOLERANCE}px).`)
else console.log(`\nOK: all ${total} slides fit, at every click state.`)
process.exit(failed ? 1 : 0)
