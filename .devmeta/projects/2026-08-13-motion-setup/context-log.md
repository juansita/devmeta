# Shared Context Log — motion-setup

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The theme landed in wave 1. Read `slides/slides.md` headmatter to see which one.
- You own your files only. Do not touch another motion feature's page files.
- Motion only. Do not rewrite prose.
- Over-animation is a defect. Leaving a slide alone is a valid, recordable decision.

---

## Motion — setup and title — done

Owns `slides/pages/05-setup.md` (slides 17-19) and the title slide body in `slides.md`.
Motion only: no prose changed, no headmatter touched, no `layout:`, no per-slide
`transition:` (the deck-wide `slide-left` from wave 1 covers it).

### Per-slide decisions

| Slide | Animated | Click steps | Reasoning |
|:-----:|:--------:|:-----------:|-----------|
| 1 — How DevMeta Works | **no** | 0 | Title plus a one-line subtitle. It is one thought, and a title slide is the audience's first orientation — stepping it delays the deck's own name. Deliberately static. |
| 17 — What lives on disk | yes | 4 | `<v-clicks>` on the four bullets. The `.devmeta/` tree stays visible from step 0 so the bullets land against it; each bullet is a separate fact about the tree, not a restatement. |
| 18 — Per-project config | yes | 6 | `<v-clicks>` on all six bullets. Three of them are the three `##` sections of `devmeta.md` — a genuine enumeration, which is the case stepping is for. |
| 19 — Get started | yes | 1 | One `<v-click>` wrapping the whole second half (the "two commands" line, the `/devmeta:*` block, and the closing line). Install first, then what you actually type. Deliberately **one** step, not three — the close should land, not crawl. |

Slide 17 uses `<v-clicks>` (the list wrapper). Slide 19 uses a single `<v-click>` around a
block of mixed content; that yields 3 `slidev-vclick-target` elements sharing one click
index, so all three reveal together — verified in the DOM, not assumed.

Contribution to the increment's "at least 5 slides with reveals": **2 of 3 animated
slides in this feature carry lists, plus slide 19.** Slide 1 left alone on purpose.

### Overflow measurement

The theme feature measured 17 and 19 at **0px**. Both are still **0px**, at *every* click
state.

Rendered the deck headlessly at 1280×720 from an isolated build and compared the union of
each slide's visible descendant bounding boxes against the slide frame, once per click
state (`?clicks=N`):

| Slide | Click states measured | Worst overflow (t/b/l/r) |
|:-----:|:---------------------:|:------------------------:|
| 1  | 0     | 0 / 0 / 0 / 0 |
| 17 | 0–4   | 0 / 0 / 0 / 0 |
| 18 | 0–6   | 0 / 0 / 0 / 0 |
| 19 | 0–1   | 0 / 0 / 0 / 0 |

**Why the reveals cost zero headroom, and it is not luck.** Slidev's default hidden state
is `.slidev-vclick-hidden`, which is opacity-based — the element keeps its box. A
`<v-clicks>` reveal therefore does not reflow anything, so a slide that fit before still
fits at every step. This is the fact that makes it safe to animate a 0px-headroom slide.
It would **not** hold for `v-click.hide` / `:hide`, which do remove the box. **If a later
feature wants a reveal on a tight slide, use the default hide, not `.hide`.**

### Gotchas for the next worker

- **The click-state URL is `/<n>?clicks=<c>`, not `/<n>/<c>`.** The path form 404s in a
  built deck. Cost ten minutes; `verify-diagrams.mjs` only ever loads `/<n>` so it does
  not show you this.
- **Scope DOM queries to `.slidev-page-N`.** Slidev keeps neighbouring slides in the DOM,
  so a document-wide `.slidev-vclick-target` count on slide 17 returns slides 16, 17 and
  18 together. Same trap `verify-diagrams.mjs` documents for `.mermaid`.
- **A measuring script outside `slides/` cannot resolve `playwright-chromium`**, and it is
  CommonJS, so `import { chromium } from '…/index.js'` fails too. Default-import the
  package and destructure.

### Checks

```
npm run slides                                   → 19        exit 0
npx slidev build slides.md --out <own dir>       →           exit 0
overflow measurement, all click states           → 0px       exit 0
```

Built to a private `--out` dir, never the shared `dist`. Did not run `npm run diagrams`:
it would render pages 01-04, which the other two wave-2 workers were mid-edit on, so a
red there would have been their in-flight state and not a signal about this feature.

**Negative-tested the measurement** before trusting it, per the standing rule that a check
nobody has seen fail is not evidence. Appended eight paragraphs to slide 19, rebuilt: the
**build still exited 0** while the measurement went **red at 111px bottom overflow, exit
1**. Reverted from a backup and re-verified the file is byte-identical (59 lines, zero
probe lines). Restating the 01.2 lesson because it held again here: a green Slidev build
says nothing at all about whether content is inside the frame.
