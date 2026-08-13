# Shared Context Log — diagram-ticktree

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- Mermaid renders natively in Slidev 52.19.0. Verified on a throwaway deck before this
  iteration was planned. No imports or plugins needed.
- A Mermaid parse error does not fail the build. Check the rendered output, not just the
  exit code.
- You own ONE file. Do not edit any other page file, `slides/slides.md`, or
  `slides/package.json`.
- Iteration 01.3 owns all styling. No colour, no `v-clicks`, no layouts, no theme.

---

## C — Tick tree diagram (slide 14, `slides/pages/04-example.md`)

**Graph direction:** `graph TD`.

**Node count:** 7 nodes, 6 edges. (Cap is 8; one spare left deliberately.)

**Exact node labels** (id → label, all `["..."]` quoted):

| id | label | words |
|----|-------|-------|
| `I` | `Iteration 01.1` | 2 |
| `F1` | `Feature: Foundation` | 2 |
| `F2` | `Feature: Example` | 2 |
| `P` | `Task: create PR` | 3 |
| `R` | `Task: I&A cycle` | 3 |
| `T1` | `Task: write the slides` | 4 |
| `T2` | `Task: re-ground` | 2 |

**Edges:** `I --> F1`, `I --> F2`, `I --> P`, `I --> R`, `F2 --> T1`, `F2 --> T2`.

**Level convention:** every label is prefixed with its tick kind — `Iteration`, `Feature:`,
`Task:`. Rank 1 is the iteration epic; rank 2 holds both feature epics *and* the PR and
I&A tasks, which is the structural point (they are siblings of the features, children of
the iteration); rank 3 holds the tasks of one feature only.

**What was dropped from the real 01.1 tree** (`iteration-01.1/status.md`, tick `7pv`):

- **Five of seven feature epics.** Real 01.1 had Foundation `glx`, Problem `jo0`, Model
  `vs2`, Commands `nc1`, Example `fbc`, Setup `q19`, Coherence `k5z`. Kept Foundation
  (first wave) and Example (the feature that wrote this very slide, so the audience can
  point at it). Dropped Problem, Model, Commands, Setup, Coherence — pure repetition of
  the Feature level, no new shape.
- **Tasks under every feature but one.** Only `Feature: Example` is expanded. Its two
  real tasks are kept, including the re-grounding task that `go.md` requires as the last
  task of every feature — dropping that would have misrepresented the shape.
- **Two of the four iteration-level tasks.** `go.md` has create PR, merge PR, commit
  metadata, kick off I&A. Kept the first and the last: they bracket the iteration and are
  the two the narrative on slides 15-16 refers to. Dropped merge PR and commit metadata.
- **Tick IDs.** Real ids (`7pv`, `glx`, `fbc`, …) are on slide 14's bullets and in
  `status.md`, but they cost label words and read as noise from the back of a room.
- **The I&A cycle's own children.** In `go.md` the I&A cycle is a separate top-level epic
  with its own two tasks; here it is only the iteration-level task that kicks it off.

**Gotchas found:**

- Slidev compiles ` ```mermaid ` into a `<Mermaid code-lz="...">` component. The graph
  source is **lz-string compressed** in the built bundle, so grepping `dist` for node
  labels finds nothing even when the diagram is perfect. Decode with
  `require('lz-string').decompressFromBase64(<the code-lz value>)` from
  `slides/node_modules`.
- The rendered SVG lives inside a **shadow root** (`<ShadowRoot class="mermaid">` in
  `@slidev/client/builtin/Mermaid.vue`). `document.body.innerText` and plain
  `querySelectorAll('svg')` both return nothing. You must go through
  `document.querySelector('.slidev-page-14 .mermaid').shadowRoot`.
- On a parse error the component renders `<pre border="1 red">` with the message instead
  of the diagram — absence of that `pre` plus a non-empty shadow root is the real
  pass condition.
- `mermaid.parse()` in bare Node fails with `DOMPurify.addHook is not a function`. Not a
  diagram bug — mermaid needs a DOM. Use a browser, not Node, to validate.
- `&` inside a quoted label (`"Task: I&A cycle"`) parses and renders fine. No escaping
  needed.
- `chrome-devtools` MCP refuses to start when another agent already holds the shared
  Chrome profile. `playwright-chromium` is already in `slides/node_modules` (a Slidev
  export dependency) and launches its own browser — use that instead when running in
  parallel with other workers.
- Slidev's built SPA routes on `/<n>`, so `http://host/14` loads slide 14 directly. A
  plain `python3 -m http.server` 301-redirects `/14` → `/14/` and Vue Router still
  matches, so no SPA fallback is needed for numbered routes.

**Verification:** `npx slidev build` to a private `--out` (exit 0), `npm run slides`
reports **19**, exit 0, and a headless Chromium load of slide 14 showed
`nodeCount: 7`, `edgeCount: 6`, all seven labels present in the shadow-root SVG, no error
`pre`, no console warnings.

---
