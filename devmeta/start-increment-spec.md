---
description: Start a new increment (global) — create directory, overview, interactive scope
argument-hint: [increment-title]
---

## Project Context

Read `.devmeta/devmeta.md` from the project root if it exists. It provides
project-specific test commands, environment checks, and additional rules.

If no `.devmeta/devmeta.md` exists:
- Testing: look for `package.json` test scripts
- Environment: skip checks
- Additional rules: none

---

## Context

- Today's date: !`date +%Y-%m-%d`
- Increment title argument: $ARGUMENTS

## Your Task

Create a new increment directory with a properly structured `_overview.md` and begin defining scope interactively.

### Step 0 (all callers): Ground yourself in a CURRENT tree

**Do this before reading a single project file.** A worktree that has never been
pulled is the normal case, not the exception.

```bash
git fetch -q
git rev-list --left-right --count origin/<default-branch>...HEAD
```

Detect the default branch — `main` and `master` both occur — with
`git symbolic-ref refs/remotes/origin/HEAD`. Never assume.

**If the left number is non-zero, you are behind. Stop and say so**, with the
count, before doing anything else. Offer the fast-forward
(`git merge --ff-only origin/<default>`); do not research, plan or write on a
stale tree.

This is not hygiene. A discussion document was once researched on a worktree
**218 commits behind** and described a hosting provider, a public tunnel and a
model backend that had all been removed months earlier — every load-bearing fact
in it was wrong, and it read as confident and specific because the stale tree was
internally consistent. The project's own `AGENTS.md` already carried the rule
(*fetch before you judge git state*); the commands did not inherit it, and an
agent following the command faithfully never ran the fetch.

Also confirm you are in the checkout you think you are: the project may run in
several worktrees, and at least one is usually stale. `git worktree list`.

### Step 1: Determine Increment Number and Suffix

**The number comes from the directories, not from the active line.**

```bash
ls -d .devmeta/increments/increment-* 2>/dev/null \
  | sed -E 's|.*/increment-([0-9]+).*|\1|' | sort -n | tail -1
```

Take the highest existing increment integer, add 1, and **zero-pad to two digits**
(e.g. `07`, `76`) so increment directories sort lexically — call it `<NN>` for the
rest of this command. If no increments exist, start at `01`.

> **This used to read "parse the active increment line and add 1", and that is
> wrong whenever the active increment is not the newest one.** It happened: the
> active increment was `01-ora` — reactivated because a human gate finally
> unblocked — while `06-rgt` was the highest on disk. The rule produced `02`,
> which already existed. Reactivating an older increment is a normal and correct
> thing to do, so the numbering must not depend on which one is active.

**Check whether the number you picked is already spoken for in prose.** A
completed report or an overview often reserves the *next* integer for planned
work (`"deferred to increment 07"`). Grep for it:

```bash
grep -rn "increment $((10#$NN))\|increment-$NN" docs/ .devmeta/ AGENTS.md 2>/dev/null
```

If something already claims it, you may still take the number — but say so in the
new `_overview.md`, and renumber the other claim in the same increment. Two things
called increment 07 is worse than either being called 08.

Generate a 3-letter random suffix `<XXX>` from `[a-z]` (e.g. `abc`, `xkl`, `qmt`). The suffix exists so parallel branches/worktrees that both pick the same `<NN>` land in different directories and don't merge-conflict on the increment subtree.

Check that `.devmeta/increments/increment-<NN>-<XXX>/` does not already exist; if it does, regenerate the suffix and retry (up to 5 attempts — collisions are practically impossible).

**Throughout this command, `<NN>` is the new increment integer and `<XXX>` is its 3-letter suffix.** The full increment identifier (used in directory names and the title) is `<NN>-<XXX>` (e.g. `76-abc`). Iteration numbers within this increment use `<NN>` only — `<NN>.1`, `<NN>.2`, `<NN>.1R` — never the suffix.

### Step 2: Create Increment Directory

```bash
mkdir -p .devmeta/increments/increment-<NN>-<XXX>/iterations
mkdir -p .devmeta/increments/increment-<NN>-<XXX>/ia-cycles
```

### Step 3: Create `_overview.md` from Template

Write `.devmeta/increments/increment-<NN>-<XXX>/_overview.md` using this template:

```markdown
# Increment <NN>-<XXX> — <Title>

**Status:** NOT STARTED
**Depends on:** Increment <previous-id> (<previous increment title>)
**Goal:** <1-2 sentence goal — what the user can do after this increment that they couldn't before>

---

## What This Increment Produces

### On screen
- <User-visible feature 1>
- <User-visible feature 2>

### Under the hood
- <Technical deliverable 1>
- <Technical deliverable 2>

### Testing delivered
- <Test coverage expectations>

---

## What This Increment Does NOT Include

| Deferred | Why | Which Increment |
|----------|-----|-----------------|
| <Feature> | <Reason> | <Future increment> |

---

## Repos

<!-- Multi-repo mode only (devmeta.md has a `## Repos` section) — delete this section otherwise.
     Role: "modified" = this increment changes it (gets the increment branch and PRs);
     "understanding" = read-only context. Every listed repo must be present, level with its
     default branch (main vs master varies per repo — detect, never assume). -->

| Slug | Role | Local path | Available? |
|------|------|------------|------------|
| <slug> | modified | <path> | yes / MISSING |
| <slug> | understanding | <path> | yes / MISSING |

---

## Iteration Map

| # | Title | What Gets Built |
|:--:|-------|-----------------|
| <NN>.1 | <title> | <deliverables> |
| <NN>.2 | <title> | <deliverables> |

---

## Detailed Iterations

### Iteration <NN>.1 — <Title>

**Deliverables:**
- <deliverable 1>
- <deliverable 2>

**Verify on screen:**
- <acceptance criteria>

### Iteration <NN>.2 — <Title>

**Deliverables:**
- <deliverable 1>

**Verify on screen:**
- <acceptance criteria>

---

## Exit Criteria

- [ ] <Criterion 1>
- [ ] <Criterion 2>
- [ ] All tests pass
- [ ] Living docs updated

---

## Blocked Items

- <Item>: <What's needed and when>

---

## Previous Increments

<List of completed increments with links to their _overview.md>
```

If `$ARGUMENTS` provides an increment title, use it. Otherwise, leave `<Title>` as a placeholder for the interactive dialogue to fill in.

### Step 4: Update `.devmeta/current-increment.md`

Update `.devmeta/current-increment.md` to point to the new increment:
- Set the new increment as active with status NOT STARTED, using the **suffixed identifier** in the line: `**Active:** Increment <NN>-<XXX> — <Title>: ...`
- Keep the previous increment reference with its final status (its identifier stays whatever it was — historic ones may have no suffix)

**If the increment you are displacing is not COMPLETE, say so in the same file and
do not bury it.** An increment can be active because it is blocked on a human —
seven hardware checks on a phone, a disk that has to be plugged in — and making a
new one active is not a claim that the old one finished. Write, explicitly:

> **Increment <old> is still open and is NOT superseded** — <what is outstanding>.
> It carries its own state under `## Carried` in its `_overview.md`. Neither
> increment gates the other; picking it back up means making it active again.

Otherwise the only record that work remains is a status line the next reader
scrolls past.

### Step 5: Interactive Scope Definition

Begin an interactive dialogue to flesh out the overview. Ask about:

1. **Goal:** What should the user be able to do after this increment?
2. **On-screen deliverables:** What will visually change?
3. **Under-the-hood deliverables:** What technical work is needed?
4. **Exclusions:** What is explicitly out of scope?
5. **Repos (multi-repo mode only):** Which repos does this increment modify? Which does it only need to understand? Propose candidates from the project docs/dependency map, confirm with the user, and fill the `## Repos` table. Then check availability: every listed repo must be cloned locally and level with its origin default branch (`main` vs `master` varies per repo — detect, never assume) — if not, ask the user to fix that before finalizing.
6. **Iterations:** How should the work be split? (Aim for 2-5 iterations, each 1-3 days of agent work)
7. **Dependencies:** What must exist before this increment can start?
8. **Blocked items:** Anything that needs human action (API keys, accounts, etc.)?
9. **Exit criteria:** How do we know the increment is done?

Update the `_overview.md` with each answer.

### Step 6: Finalize

1. Review the completed `_overview.md` with the user
2. Ensure all template sections are filled in
3. Verify iteration map is reasonable (not too many iterations, not too few)
4. Confirm exit criteria are testable

Report:
```markdown
## Increment <NN>-<XXX> Created

**Directory:** `.devmeta/increments/increment-<NN>-<XXX>/`
**Overview:** `.devmeta/increments/increment-<NN>-<XXX>/_overview.md`
**Iterations:** <N> planned
**Status:** Ready for `/devmeta:plan-iteration <NN>.1`
```
