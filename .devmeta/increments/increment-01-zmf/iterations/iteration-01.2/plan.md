# Iteration 01.2 Plan — Diagrams

**Increment:** 01-zmf — Slidev deck explaining how DevMeta works
**Base branch:** `2026-08-13-devmeta-deck`
**Iteration tick:** `7uy`

---

## Goal

Replace the three `DIAGRAM-PLACEHOLDER` stand-ins with real Mermaid diagrams, and close
the `CLAUDE.md` gap the I&A cycle found. Still stock theme — motion is 01.3.

---

## Scope check (Step 1.5)

Scope is unchanged from `_overview.md` except for the `CLAUDE.md` deliverable added by
I&A cycle 01.1R. The placeholders sit exactly where 01.1 put them, on slides 4, 10 and
14, one per page file. Nothing from 01.1 covered any of this. The order is still right:
diagrams must exist before 01.3 can build them up in steps.

---

## Work-to-file matrix

```
A Hierarchy diagram → modifies: slides/pages/02-model.md    (slide 4)
B Loop diagram      → modifies: slides/pages/03-commands.md (slide 10)
C Tick tree diagram → modifies: slides/pages/04-example.md  (slide 14)
D Project CLAUDE.md → creates:  CLAUDE.md

Shared files: none. All four features are independent.
```

## Feature independence map

```
  [A]   [B]   [C]   [D]      ← wave 1, four in parallel
   └─────┴─────┴─────┘
        [E Verify]           ← wave 2, alone
```

No foundation wave is needed. Mermaid ships with Slidev and was proven working in the
01.1 scaffold deck before it was overwritten. Every feature owns one file.

---

## Mermaid contract (every diagram feature must follow)

- **Fence it as ` ```mermaid `.** Slidev renders it natively; no imports, no plugins.
- **At most 8 nodes.** This is an increment exit criterion, not a guideline. A diagram
  that needs more nodes is the wrong diagram.
- **Node labels: at most 4 words.** They are read from the back of a room.
- **No colour, no `style`, no `classDef`.** Iteration 01.3 owns all styling, and a
  hand-set colour would fight the theme it picks.
- **Delete the `DIAGRAM-PLACEHOLDER` comment** and the bulleted stand-in the placeholder
  sat under. The diagram replaces them; it does not join them.
- **Keep the slide's `##` heading and any bullets that are not the stand-in.** The
  narrative around the diagram was written in 01.1 and reviewed. Do not rewrite it.
- **No `v-clicks`, no `layout:`, no theme change.** 01.3 needs a clean surface.
- Slide count must stay 19. A diagram is part of a slide, not a new one.

---

## Diagram briefs

### A — The hierarchy (slide 4, `pages/02-model.md`)

Nested containment: Increment contains Iterations, an Iteration contains Features, a
Feature contains Tasks. A `graph TD` with subgraphs reads better here than a flowchart.
Show one increment, two iterations, two features, two tasks — enough to show nesting,
few enough to stay under 8 nodes.

### B — The `/devmeta:go` loop (slide 10, `pages/03-commands.md`)

The cycle: plan → execute → inspect and adapt → back to plan, with an exit edge when the
increment closes. A `graph LR` with one back-edge and one exit edge. The back-edge is
the point of the diagram — make it obvious.

### C — The tick tree (slide 14, `pages/04-example.md`)

One iteration's tick structure: the iteration epic, two feature epics under it, tasks
under one of them, plus the PR task and the I&A task as siblings of the features. Use
this deck's real iteration 01.1 shape, trimmed to fit 8 nodes.

### D — Project `CLAUDE.md`

Not a diagram. A short orientation file for a fresh session in this repo. It must cover:

- **The hazard first:** `devmeta/` is symlinked to `~/.claude/commands/devmeta`. Editing
  it changes the live slash commands in every project on this machine.
- This repo is a fork of `mkelk/devmeta`. `upstream` is the original; never push there.
  `gh` commands need `--repo juansita/devmeta` or they target upstream.
- `slides/` is a self-contained npm project. `npm run dev|build|slides|export`. The
  global `slidev` binary cannot resolve the theme.
- `npm run slides` is the deck's acceptance test: exact count across `src:` imports,
  fails outside 15-20.
- Where DevMeta state lives, and that `.devmeta/devmeta.md` is read before every command.

Keep it under 60 lines. It is read at session start, so every line must earn its place.

---

## Test strategy

Every task closes only when both pass:

```bash
cd slides && npm run build     # exit 0
cd slides && npm run slides    # must still report 19
```

Diagram features must additionally confirm their diagram renders without a Mermaid parse
error. A Mermaid syntax error does **not** fail the build — it renders an error box on
the slide. So checking the build alone is not enough. Verify by grepping the built
bundle for the diagram's node labels, or by loading the slide in the dev server.

---

## Open questions

None.
