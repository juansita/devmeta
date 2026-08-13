# Feature Spec — Tick Tree Diagram

**Iteration:** 01.2
**Wave:** 1 (parallel with the other three)
**Owns:** `slides/pages/04-example.md`

---

## Scope

Replace the placeholder on slide 14 with a Mermaid diagram of one iteration's tick structure: the iteration epic, feature epics beneath it, tasks beneath one feature, plus the PR task and the I&A task as siblings. Use this deck's real iteration 01.1 shape, trimmed to 8 nodes.

---

## Architecture

**Modifies:** `slides/pages/04-example.md` — slide 14 only. Touch no other file.

**Creates:** nothing.

---

## Implementation guide

1. Read the **Mermaid contract** and your **diagram brief** in
   `.devmeta/increments/increment-01-zmf/iterations/iteration-01.2/plan.md`. Follow both
   exactly.
2. Read the slide as it stands. The narrative around the placeholder was written and
   reviewed in 01.1 — keep it.
3. Replace the `DIAGRAM-PLACEHOLDER` comment **and** the bulleted stand-in it sat under
   with a ```mermaid fence. The diagram replaces them; it does not join them.
4. At most 8 nodes. At most 4 words per label. No colour, no `style`, no `classDef`.

## Test strategy

```bash
cd slides && npm run build     # exit 0
cd slides && npm run slides    # must still report 19
```

A Mermaid syntax error does **not** fail the build — it renders an error box on the
slide. Verify the diagram actually rendered by grepping the built bundle for your node
labels, or by loading the slide in the dev server.

## Open questions

None.
