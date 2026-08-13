# Increment 01-zmf — Slidev deck explaining how DevMeta works

**Status:** NOT STARTED
**Depends on:** None (first increment)
**Goal:** A developer who uses Claude Code but has never seen DevMeta can watch a 15-minute talk from this deck and afterwards run their own increment without reading the README.

---

## What This Increment Produces

### On screen
- A 15-20 slide Slidev deck at `slides/slides.md` that explains DevMeta to a newcomer
- Mermaid diagrams for the command loop, the increment → iteration → feature hierarchy, and the tick tree
- Click-through reveals that build up the diagrams and lists step by step
- A non-default Slidev theme with slide transitions

### Under the hood
- Theme package added to `slides/package.json` and configured in the deck frontmatter
- Content sourced from `README.md` and the seven command files in `devmeta/`
- A worked example thread that runs across the deck — one concrete feature taken from spec to merged PR

### Testing delivered
- `cd slides && npm run build` exits 0 with no Vite or Slidev errors
- Manual read-through against a concept checklist: every DevMeta concept in `README.md` appears on at least one slide

---

## What This Increment Does NOT Include

| Deferred | Why | Which Increment |
|----------|-----|-----------------|
| PDF export | Static site is the agreed deliverable | Future |
| Web hosting / deploy | No target platform chosen yet | Future |
| Speaker notes | Deck must stand on its own first | Future |
| Custom Vue components | Theme plus Markdown covers the visuals needed | Future |
| Recorded narration or video | Out of scope for a slide deck | Future |
| Multi-repo mode explanation | Niche; would cost 5+ slides of a 20-slide budget | Future |

---

## Iteration Map

| # | Title | What Gets Built |
|:--:|-------|-----------------|
| 01.1 | Content spine | All 15-20 slides written, narrative complete, stock theme, builds clean |
| 01.2 | Diagrams | Three Mermaid diagrams replacing the placeholder text slides |
| 01.3 | Theme and motion | Custom theme, click-through reveals, transitions, final polish |

---

## Detailed Iterations

### Iteration 01.1 — Content spine

**Deliverables:**
- Slide outline agreed and written into `slides/slides.md`
- Opening section: why agents lose context between sessions, what DevMeta fixes
- Core model section: increment, iteration, feature, task, I&A cycle — one concept per slide
- Command section: the three commands a user runs, and the four that `go` calls internally
- Worked example: one feature followed from `start-increment-spec` to merged PR
- Closing section: `.devmeta/` layout, `devmeta.md` config, where to start
- Placeholder text slides where diagrams will go in 01.2

**Verify on screen:**
- `npm run build` exits 0
- `npm run dev` shows 15-20 slides in the overview (`o` key)
- Read the deck cold — the increment/iteration/feature distinction is clear without narration

### Iteration 01.2 — Diagrams

**Deliverables:**
- Mermaid diagram: the `go` loop (plan → run → reflect → next iteration → close)
- Mermaid diagram: increment → iteration → feature → task hierarchy
- Mermaid diagram: the tick structure for one iteration, including the re-ground and PR tasks
- Placeholder slides from 01.1 replaced

**Verify on screen:**
- `npm run build` exits 0
- All three diagrams render in the browser with no Mermaid parse errors
- Each diagram is legible at presentation size — no more than 8 nodes per diagram

### Iteration 01.3 — Theme and motion

**Deliverables:**
- A non-default theme chosen, added to `slides/package.json`, set in frontmatter
- Click-through reveals (`v-clicks`) on at least 5 content slides
- Diagrams from 01.2 built up in steps rather than shown all at once
- Slide transitions set
- Layout pass: two-column layouts where they help, consistent heading levels

**Verify on screen:**
- `npm run build` exits 0 after the theme change
- Clicking through the whole deck in `npm run dev` reveals content in the intended order
- No slide overflows its frame at 16:9

---

## Exit Criteria

- [ ] `cd slides && npm run build` exits 0
- [ ] Deck contains between 15 and 20 slides
- [ ] Every concept in `README.md` appears on at least one slide: increment, iteration, feature, task, I&A cycle, the three user commands, the four internal commands, `.devmeta/` layout, `devmeta.md` config, tk's role
- [ ] At least 3 Mermaid diagrams render without errors
- [ ] Deck frontmatter names a theme other than `default`
- [ ] At least 5 slides use click-through reveals
- [ ] No slide overflows the frame at 16:9
- [ ] All tests pass
- [ ] Living docs updated

---

## Blocked Items

None. All tooling is installed and verified: `tk` 0.24.0, Slidev 52.19.0, Node v26.4.0, `gh` authenticated.

---

## Previous Increments

None. This is the first increment in the project.
