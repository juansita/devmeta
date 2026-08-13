# Iteration 01.3 Plan — Theme and motion

**Increment:** 01-zmf — Slidev deck explaining how DevMeta works
**Base branch:** `2026-08-13-devmeta-deck`
**Iteration tick:** `etg`
**Final iteration of the increment.**

---

## Goal

Turn a correct deck into one worth watching. A theme, click-through reveals, stepped
diagram builds, transitions, and a layout pass. When this closes, the increment closes.

---

## Scope check (Step 1.5)

Scope is unchanged from `_overview.md`. Nothing from 01.1 or 01.2 covered any of it, and
the surface is confirmed clean: no `v-clicks`, no `layout:`, no `transition:`, no
`classDef` anywhere in `slides/pages/`, and the only `theme:` is `default`.

One deliverable is **added**: an automated overflow check. See "Why overflow needs a
tool" below. Scope grew; nothing was cut.

---

## Shape: this iteration is not the wide fan-out

I&A cycle 01.2R called this explicitly and it is worth restating. Iterations 01.1 and
01.2 were wide because every feature owned a different file. That does not hold here:

- **A theme change is global.** It touches `slides.md` and changes how all 19 slides
  render. It cannot run beside anything.
- **The layout pass judges slides against each other.** Whether a deck is over-animated
  is not a per-file question.

So the shape is **narrow → wide → narrow**, not a five-wide fan-out.

```
              [A Theme]
        ┌─────────┼─────────┐
      [B]       [C]       [D]          ← wave 2, three in parallel
        └─────────┼─────────┘
           [E Layout & overflow]        ← wave 3, alone
```

## Work-to-file matrix

```
A Theme     → modifies: slides/slides.md (headmatter), slides/package.json (theme dep)
B Motion 1  → modifies: slides/pages/01-problem.md, slides/pages/02-model.md
C Motion 2  → modifies: slides/pages/03-commands.md, slides/pages/04-example.md
D Motion 3  → modifies: slides/pages/05-setup.md, slides/slides.md (title slide only)
E Layout    → modifies: any of the above; creates slides/scripts/verify-layout.mjs

Shared files: slides.md is touched by A (headmatter, wave 1) and D (title slide body,
wave 2). Different regions, different waves — no conflict.
```

---

## Theme choice

The theme is A's call, but it must satisfy all of these, and A must verify each before
committing to one:

- Installs as an npm package into `slides/package.json`
- Renders the three Mermaid diagrams without clipping them
- Does not require rewriting existing slides — no bespoke layout names
- Readable at presentation size, dark or light

`@slidev/theme-seriph` is the recommended default: it is maintained by the Slidev team,
serif-titled, plain enough for a technical talk. If A picks something else, the reason
goes in the context log.

---

## Motion contract (every motion feature must follow)

- **`<v-clicks>` around lists.** Wrap the bullet list, do not annotate bullets one by one.
- **Not every slide.** The increment requires at least 5 slides with reveals, not all 19.
  A slide whose bullets are one thought does not need stepping. **Over-animation is a
  defect, not a bonus.**
- **Diagram slides get stepped builds** via `<v-click>` on the surrounding content, not by
  splitting the Mermaid source. Never edit a diagram's graph to animate it.
- **Slide 4 is heading-plus-diagram with no bullets, and its diagram already fills the
  frame.** Anything added there risks reintroducing the overflow that removed its bullets
  in 01.2. If a stepped build does not fit, leave slide 4 un-animated and say so in the
  context log.
- **Do not rewrite prose.** The words were written in 01.1 and reviewed twice. This
  iteration adds motion, not copy.
- Slide count must stay 19. `npm run diagrams` must stay green.

---

## Why overflow needs a tool

"No slide overflows its frame at 16:9" is an increment exit criterion, and it is the last
one that can only be checked by looking. That is exactly the class of criterion this
project has twice turned into an exit code — `npm run slides` in 01.1, `npm run diagrams`
in 01.2 — and both caught real defects.

Adding motion and a theme is precisely the change most likely to cause overflow, so
feature E delivers `slides/scripts/verify-layout.mjs` behind `npm run layout`:

- render every slide headlessly at 1280×720
- compare each slide's content bounding box against the slide frame
- exit non-zero listing any slide whose content escapes it

**Negative-test it before trusting it**, the way `npm run diagrams` was: force an overflow,
confirm the build stays green and the check goes red, then revert. A check nobody has
seen fail is not evidence. `slides/scripts/verify-diagrams.mjs` is the working reference
for headless rendering, including the shadow-root and derive-from-source patterns.

---

## Test strategy

Every task closes only when all of these pass:

```bash
cd slides
npm run build      # exit 0
npm run slides     # 19
npm run diagrams   # all three diagrams still render
```

Plus, once feature E has delivered it:

```bash
npm run layout     # no slide overflows
```

Parallel workers in wave 2 must build to their own `--out` directory, not the shared
`dist`.

---

## Open questions

None.
