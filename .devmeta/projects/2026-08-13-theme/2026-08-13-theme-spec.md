# Feature Spec — Theme

**Iteration:** 01.3
**Wave:** 1 (nothing else runs until this closes)
**Owns:** `slides/slides.md` headmatter, `slides/package.json`

---

## Scope

Replace the stock `default` theme and add slide transitions. This is global — it changes
how all 19 slides render — which is why it runs alone and first.

No slide content changes. Motion is wave 2.

---

## Implementation guide

1. Read the **Theme choice** section in
   `.devmeta/increments/increment-01-zmf/iterations/iteration-01.3/plan.md`.
2. Pick a theme and **verify it against the deck before committing to it**:
   - installs as an npm package
   - renders all three Mermaid diagrams without clipping (`npm run diagrams` stays green)
   - needs no rewrite of existing slides — no bespoke layout names required
   - readable at presentation size
   `@slidev/theme-seriph` is the recommended default. If you pick something else, put the
   reason in the context log.
3. Add the theme to `slides/package.json` devDependencies and install it.
4. Set `theme:` in the `slides.md` headmatter. Add a `transition:`.
5. Change **nothing else** in `slides.md`. The title slide body belongs to the Motion —
   setup and title feature in wave 2.

## What to check, beyond the exit codes

A theme change is the single most likely cause of overflow in this increment. Render the
deck and look at every slide — especially slide 4 (heading plus a diagram that already
fills the frame), slide 17 (a fenced tree block), and slide 19 (two fenced blocks). If
the theme clips any of them, pick a different theme rather than editing the slides.

Record in the context log: which theme, which transition, and what you observed on slides
4, 17 and 19.

## Test strategy

```bash
cd slides
npm run build      # exit 0
npm run slides     # 19
npm run diagrams   # all three still render
```

## Open questions

None.
