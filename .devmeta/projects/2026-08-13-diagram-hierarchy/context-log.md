# Shared Context Log — diagram-hierarchy

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

## A — Hierarchy diagram (slide 4, `pages/02-model.md`) — done

**Graph direction:** `graph TD`. No edges at all — containment is carried entirely by
nested `subgraph` boxes, so nothing is implied by arrows.

**Node count: 7** (under the 8 cap). Three are subgraph containers, four are leaf nodes.

**Exact labels, outermost first:**

| Kind | Id | Label |
|---|---|---|
| subgraph | `INC` | `Increment` |
| subgraph | `IT1` | `Iteration 1` |
| subgraph | `FA` | `Feature A` |
| node | `T1` | `Task 1` |
| node | `T2` | `Task 2` |
| node | `FB` | `Feature B` |
| node | `IT2` | `Iteration 2` |

Nesting: `Increment` > (`Iteration 1` > (`Feature A` > (`Task 1`, `Task 2`), `Feature B`), `Iteration 2`).
Longest label is 2 words. No colour, no `style`, no `classDef`, no `v-clicks`, no `layout:`.

### Decisions and gotchas for the other workers / the verify pass

- **The whole bullet list was the stand-in, and it had to go.** First attempt kept the
  five bullets and put the diagram under them. It built and rendered fine, but the
  diagram overflowed the bottom of the slide — `Iteration 2` was cut off below the fold.
  The contract's "the diagram replaces them; it does not join them" is a layout
  constraint, not just an editorial one. Slide 4 is now heading + diagram, nothing else.
  A 3-deep nested `graph TD` is ~469 viewBox units tall and needs the whole slide body.
- **Reported gap, not silently fixed:** the deleted bullets contained the deck's only
  definition of **Task** ("one step inside a feature → one commit"). Slides 5-8 define
  Increment, Iteration, Feature and the I&A cycle, but none defines Task. The diagram
  shows Task nested inside Feature, slide 6 says "Commit per task", and slide 7 says
  "Tasks inside a feature are sequential steps" — so the term is introduced, but never
  defined outright. Only the coherence/verify pass can see the whole deck; the call is
  left to it. I own slide 4 only and did not touch 5-8.
- **`npm run slides` still reports 19, exit 0.** Slide 4 is still titled `The hierarchy`.
- **Grepping the built bundle for node labels does not work.** Slidev compiles a
  ```mermaid fence into `<Mermaid code-lz="…">` — the source is lz-string compressed, so
  `Increment`, `Task 1` etc. appear nowhere in `dist`. The test strategy in the iteration
  plan is wrong on this point.
- **The rendered SVG lives in a shadow root.** `@slidev/client/builtin/Mermaid.vue`
  renders into `<ShadowRoot class="mermaid">`, so `document.querySelectorAll('svg')` and
  `div.mermaid`'s `innerHTML` both come back empty even when the diagram is perfect. Use
  `div.mermaid.shadowRoot.querySelector('svg')`.
- **How to actually prove a diagram rendered.** Build to a private `--out` dir, serve it
  (`python3 -m http.server`), and drive it with the `playwright-chromium` already in
  `slides/node_modules` (import it by absolute path; it will not resolve from a script
  outside the project). A static server has no SPA history fallback, so `/4` 404s —
  intercept that one URL with `page.route(...)` and fulfil it with `index.html`. Then
  read `g.cluster` and `g.node` text out of the shadow root. **The reliable pass/fail
  signal:** `Mermaid.vue` renders a `<pre border="1 red rounded">` *instead of* the
  `.mermaid` div when the parse fails. A `.mermaid` div that exists at all means the
  parse succeeded; the label dump then confirms it is the right diagram.
- Verified this way, all three diagrams (slides 4, 10 and 14) parse and render.
