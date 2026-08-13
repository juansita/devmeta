# Feature Spec — Motion — problem and model

**Iteration:** 01.3
**Wave:** 2 (parallel with the other two motion features)
**Owns:** `slides/pages/01-problem.md` and `slides/pages/02-model.md` (slides 2-8)

---

## Scope

Add click-through reveals to the opening and the conceptual core. Motion only — the prose was written in 01.1 and
reviewed twice, and this feature does not touch it.

**Slide 4 needs care.** It is heading-plus-diagram with no bullets, and the diagram already fills the frame. Its bullets were removed in 01.2 precisely because they caused an overflow. If a stepped build does not fit, leave slide 4 un-animated and record why.

---

## Implementation guide

1. Read the **Motion contract** and the shape section in `.devmeta/increments/increment-01-zmf/iterations/iteration-01.3/plan.md`. Follow both exactly.
2. Read your files as they stand, after the theme change from wave 1.
3. Wrap bullet lists in `<v-clicks>`. Do not annotate bullets individually.
4. **Judge which slides need it.** The increment asks for at least 5 slides with reveals
   across the whole deck, not all 19. A slide whose bullets are one thought reads worse
   stepped. Over-animation is a defect.
5. Record in the context log which slides you animated and which you deliberately left
   alone, with the reason. The layout pass balances the deck as a whole and needs to know
   what was intentional.

## Test strategy

```bash
cd slides && npm run slides    # must still report 19
cd slides && npx slidev build slides.md --out <your own dir>   # exit 0
```

Do not run `npm run build` — two other workers are running and it writes a shared
`dist`. Do not run `npm run dev` — it blocks.

Reveals cannot be verified from a build exit code. Check your click order by reasoning
through each `<v-clicks>` block, and state in the context log how many click steps each
slide you touched now has.

## Open questions

None.
