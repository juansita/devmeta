# Feature Spec — Layout and overflow

**Iteration:** 01.3
**Wave:** 3 (runs alone, after theme and all three motion features)
**Final feature of the final iteration of Increment 01-zmf.**

---

## Scope

Two jobs:

1. **Build the overflow check.** Deliver `slides/scripts/verify-layout.mjs` behind
   `npm run layout`. This turns the increment's last eyeball-only exit criterion into an
   exit code.
2. **Balance the deck.** Three motion features animated independently. Judge the result
   as one deck, fix what does not hold together, and confirm every exit criterion.

This is the only feature allowed to touch every file, which is why it runs alone.

---

## Implementation guide

### 1. Write the overflow check

`slides/scripts/verify-diagrams.mjs` is the working reference for headless rendering —
copy its patterns: derive the slide list from source rather than hardcoding, no fallback
selectors, `waitForFunction` rather than a fixed sleep, loud failure.

For every slide: render at 1280×720, compare the content bounding box against the slide
frame, and exit non-zero listing any slide whose content escapes it.

**Then negative-test it.** Force an overflow on one slide — paste a long list in — and
confirm `npm run build` still exits 0 while `npm run layout` exits 1. Revert. A check
nobody has seen fail is not evidence. This project has done exactly this for
`npm run diagrams`; do the same here and record the result in the context log.

### 2. Balance the motion

Read the three motion context logs first. They record which slides were animated and
which were deliberately left alone, and why.

- Is the deck **consistently** animated, or does one section step everything while
  another steps nothing?
- Is anything **over-animated**? A slide whose bullets are one thought reads worse
  stepped. Removing a reveal is a valid fix.
- Does the click order make sense reading front to back?
- At least 5 slides carry reveals — an increment exit criterion.

### 3. Confirm every increment exit criterion

Work `_overview.md` > Exit Criteria top to bottom and record evidence for each. These are
the criteria the increment closes against, so this is the last chance to catch a gap.

---

## Test strategy

```bash
cd slides
npm run build      # exit 0
npm run slides     # 19
npm run diagrams   # all three diagrams render
npm run layout     # no slide overflows — new in this feature
```

## Open questions

None.
