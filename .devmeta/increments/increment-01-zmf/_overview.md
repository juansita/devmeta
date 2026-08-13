# Increment 01-zmf — Slidev deck explaining how DevMeta works

**Status:** COMPLETE (2026-08-13)
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
| 01.2 | Diagrams | Three Mermaid diagrams replacing the placeholder text slides, plus a project `CLAUDE.md` |
| 01.3 | Theme and motion | Custom theme, click-through reveals, transitions, final polish |

> **Reassessed 2026-08-13 (I&A cycle 01.1R).** Scope and order of 01.2 and 01.3 are
> unchanged and still correct — diagrams must exist before 01.3 can build them up in
> steps. One deliverable added to 01.2: a project `CLAUDE.md`. The docs audit found the
> repo has neither `CLAUDE.md` nor `docs/current/`, so nothing warns a fresh session
> that `devmeta/` is symlinked to `~/.claude/commands/devmeta` and that editing it
> changes the live slash commands everywhere. That is a live hazard, it is cheap to
> close, and 01.2 is the lightest iteration. Scope grew; nothing was cut.

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
- Mermaid diagram: increment → iteration → feature → task hierarchy (slide 4, `pages/02-model.md`)
- Mermaid diagram: the `go` loop, plan → run → reflect → next iteration → close (slide 10, `pages/03-commands.md`)
- Mermaid diagram: the tick structure for one iteration, including the re-ground and PR tasks (slide 14, `pages/04-example.md`)
- All three `DIAGRAM-PLACEHOLDER` comments and their bulleted stand-ins replaced
- A project `CLAUDE.md` (added by I&A cycle 01.1R — see the note under the iteration map)

**Verify on screen:**
- `npm run build` exits 0 and `npm run slides` still reports 19
- All three diagrams render in the browser with no Mermaid parse errors
- Each diagram is legible at presentation size — no more than 8 nodes per diagram
- No `DIAGRAM-PLACEHOLDER` comment remains anywhere in `slides/`

**Note on parallelism:** the three diagrams live in three different page files, so this
iteration supports a three-wide parallel wave with the same one-file-per-feature rule
that worked in 01.1. `CLAUDE.md` is a fourth, independent file.

### Iteration 01.3 — Theme and motion

**Deliverables:**
- A non-default theme chosen, added to `slides/package.json`, set in frontmatter
- Click-through reveals (`v-clicks`) on at least 5 content slides
- Diagrams from 01.2 built up in steps rather than shown all at once
- Slide transitions set
- Layout pass: two-column layouts where they help, consistent heading levels

**Verify on screen:**
- `npm run build` exits 0 after the theme change
- `npm run slides` still reports 19 and `npm run diagrams` still exits 0 — the diagram
  check did not exist when this iteration was written (added in 01.2)
- Clicking through the whole deck in `npm run dev` reveals content in the intended order
- No slide overflows its frame at 16:9

> **Reassessed 2026-08-13 (I&A cycle 01.2R).** Scope unchanged. Two things to carry in:
> **(1)** This iteration is **not** cleanly parallel, unlike 01.1 and 01.2. A theme change
> touches `slides.md` and affects every slide at once, and the layout pass has to judge
> slides against each other. Expect a narrow first wave then per-file work — do not reach
> for the wide fan-out that worked twice. **(2)** Slide 4 is heading-plus-diagram with no
> bullets, and its diagram already fills the frame. A stepped build there must not
> reintroduce the overflow that removed those bullets in the first place.

---

## Exit Criteria

- [x] `cd slides && npm run build` exits 0 — **exit 0**
- [x] Deck contains between 15 and 20 slides — **19**, `npm run slides`
- [x] Every concept in `README.md` appears on at least one slide — **all 15 present**, see the table below
- [x] At least 3 Mermaid diagrams render without errors — **3**, `npm run diagrams` exit 0, live SVG read from each shadow root
- [x] Deck frontmatter names a theme other than `default` — **`seriph`**
- [x] At least 5 slides use click-through reveals — **13** (slides 2, 3, 5, 7, 8, 9, 11, 12, 15, 16, 17, 18, 19)
- [x] No slide overflows the frame at 16:9 — **`npm run layout` exit 0**, all 19 fit at every click state, worst is slide 4 at +1px
- [x] All tests pass — build, slides, diagrams and layout all exit 0
- [x] Living docs updated — `project-history.md`, `lessons-learned.md`, three I&A reports, per-feature context logs, and a project `CLAUDE.md`

### Concept coverage

| Concept | Slides |
|---------|--------|
| increment | 3, 4, 5, 6, 9, 10 |
| iteration | 4, 5, 6, 8, 10, 11 |
| feature | 4, 7, 10, 11, 14, 15 |
| task | 4, 6, 7, 8, 11, 14 |
| I&A cycle | 6, 8, 11, 14, 16, 17 |
| `tk`'s role | 7 |
| `/devmeta:discuss-project` | 9 |
| `/devmeta:start-increment-spec` | 3, 9, 13, 19 |
| `/devmeta:go` | 3, 5, 9, 10, 11, 12 |
| `/devmeta:plan-iteration` | 11, 12 |
| `/devmeta:run` | 11, 12 |
| `/devmeta:reflect` | 11, 12 |
| `/devmeta:status` | 11, 12 |
| `.devmeta/` layout | 3, 8, 17, 18 |
| `devmeta.md` config | 17, 18 |

---

## Blocked Items

None. All tooling is installed and verified: `tk` 0.24.0, Slidev 52.19.0, Node v26.4.0, `gh` authenticated.

---

## Previous Increments

None. This is the first increment in the project.
