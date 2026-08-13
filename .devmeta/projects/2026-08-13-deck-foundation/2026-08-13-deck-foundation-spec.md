# Feature Spec — Deck Foundation

**Iteration:** 01.1
**Wave:** 1 (nothing else runs until this closes)

---

## Scope

Turn `slides/` into a multi-file Slidev deck so five content features can write in
parallel without touching the same file. Deliver the deck skeleton, stub pages, and an
exact slide counter.

This feature writes **no slide content** beyond the title slide. Content is B-F.

---

## Architecture

**Creates:**

| File | Purpose |
|------|---------|
| `slides/pages/01-problem.md` | Stub, owned by feature B |
| `slides/pages/02-model.md` | Stub, owned by feature C |
| `slides/pages/03-commands.md` | Stub, owned by feature D |
| `slides/pages/04-example.md` | Stub, owned by feature E |
| `slides/pages/05-setup.md` | Stub, owned by feature F |
| `slides/scripts/count-slides.mjs` | Exact slide count across `src:` imports |

**Modifies:**

| File | Change |
|------|--------|
| `slides/slides.md` | Replace scaffold content with headmatter, title slide, five `src:` imports |
| `slides/package.json` | Add `"slides": "node scripts/count-slides.mjs"` |

---

## Implementation guide

### 1. Rewrite `slides/slides.md`

Keep it thin. Headmatter, one title slide, five imports, nothing else.

```markdown
---
theme: default
title: How DevMeta Works
info: How DevMeta turns a Claude Code session into a repeatable delivery loop.
mdc: true
---

# How DevMeta Works

<one-line subtitle>

---
src: ./pages/01-problem.md
---

---
src: ./pages/02-model.md
---
```

...and so on through `05-setup.md`.

Gotcha, verified during planning: a `src:` block is a slide whose frontmatter carries
the import. Leave its body empty. The imported file's slides are inlined in its place.

Do **not** set a non-default theme, transitions, or `v-clicks`. Those belong to 01.3.

### 2. Write the stub pages

Each stub must contain the exact number of slides the outline assigns it, so the count
is right from the first build. One `##` heading per slide, matching the outline title,
plus a `TODO` line.

Slide counts: `01-problem` 2, `02-model` 5, `03-commands` 4, `04-example` 4,
`05-setup` 3.

### 3. Write `slides/scripts/count-slides.mjs`

```js
import { load } from '@slidev/parser/fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const data = await load({ roots: [root], userRoot: root }, resolve(root, 'slides.md'))
```

Then print the count and each slide's title, and exit non-zero if the count falls
outside 15-20. Read the title from `slide.title`, falling back to the first line of
`slide.content`.

The `load` signature is `load(rootsInfo, filepath)` — verified on this version. Calling
`load(filepath)` throws `ERR_INVALID_ARG_TYPE`.

### 4. Add the script to `package.json`

```json
"slides": "node scripts/count-slides.mjs"
```

---

## Test strategy

```bash
cd slides && npm run build     # must exit 0
cd slides && npm run slides    # must report 19 slides and exit 0
```

---

## Open questions

None.
