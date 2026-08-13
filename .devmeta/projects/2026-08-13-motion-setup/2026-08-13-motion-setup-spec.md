# Feature Spec — Motion — setup and title

**Iteration:** 01.3
**Wave:** 2 (parallel with the other two motion features)
**Owns:** `slides/pages/05-setup.md` (slides 17-19) and the title slide in `slides/slides.md`

---

## Scope

Add click-through reveals to the close, plus the title slide. Motion only — the prose was written in 01.1 and
reviewed twice, and this feature does not touch it.

You own only the **title slide body** in `slides/slides.md`. The headmatter belongs to the Theme feature from wave 1 — do not change \`theme:\`, \`transition:\`, or any other headmatter key. Slide 19 is the last thing an audience sees; it carries two fenced code blocks, so reveals there must not push them off the frame.

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
