# Feature Spec — Diagram Verification

**Iteration:** 01.2
**Wave:** 2 (runs alone, after all four wave-1 features close)

---

## Scope

Three diagrams were drawn independently. This feature checks they render, that they read
as one set, and that iteration 01.3 still has a clean surface to work on.

It is the only feature allowed to touch every page file, which is why it runs alone.

---

## Implementation guide

### 1. Prove every diagram actually rendered

A Mermaid parse error does not fail the build — it renders an error box on the slide.
The build exit code proves nothing about the diagrams.

Run the dev server and load slides 4, 10 and 14. Confirm each shows a diagram and not an
error box. Then grep the built bundle for each diagram's node labels.

### 2. Check the set reads as one

- Same graph direction convention where the content allows it.
- Node label style consistent: same capitalisation, same length, no trailing
  punctuation.
- No diagram exceeds 8 nodes. No label exceeds 4 words.
- Terminology matches the deck: increment, iteration, feature, task, I&A cycle, tick.

### 3. Verify the mechanical criteria

```bash
cd slides && npm run slides    # must report 19
cd slides && npm run build     # exit 0
grep -rn 'DIAGRAM-PLACEHOLDER' slides/    # must return nothing
grep -rnE 'v-click|^layout:|^transition:|classDef|style ' slides/pages/   # must return nothing
```

### 4. Check the diagrams did not orphan their slides

Each diagram replaced a bulleted stand-in. Re-read slides 4, 10 and 14 in full. The
surrounding narrative was written in 01.1 — confirm it still makes sense now that the
stand-in is gone, and that no slide is left with a diagram and nothing else.

---

## Test strategy

```bash
cd slides && npm run build
cd slides && npm run slides
```

Plus the dev-server render check in step 1, which is the part the build cannot do.

---

## Open questions

None.
