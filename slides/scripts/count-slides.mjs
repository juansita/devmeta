#!/usr/bin/env node
// Exact slide count for a multi-file Slidev deck.
// Loads slides.md through @slidev/parser, follows every `src:` import, and prints
// the total plus each slide title. Exits 1 outside the increment's 15-20 range.
//
// Note: load() takes (rootsInfo, filepath). The one-argument form throws
// ERR_INVALID_ARG_TYPE on @slidev/parser 52.x.

import { load } from '@slidev/parser/fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIN = 15
const MAX = 20

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entry = resolve(root, 'slides.md')

const data = await load({ roots: [root], userRoot: root }, entry)
const slides = data.slides

const titleOf = (slide) =>
  slide.title || slide.content.trim().split('\n')[0].replace(/^#+\s*/, '') || '(untitled)'

console.log(`slides: ${slides.length}`)
slides.forEach((slide, i) => {
  const n = String(i + 1).padStart(2, ' ')
  console.log(`  ${n}. ${titleOf(slide)}`)
})

if (slides.length < MIN || slides.length > MAX) {
  console.error(
    `\nFAIL: ${slides.length} slides is outside the required range ${MIN}-${MAX}.`,
  )
  process.exit(1)
}
