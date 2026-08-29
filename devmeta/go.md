---
description: DevMeta Delivery Engine (global) — drives increments to completion
---

## Project Context

Read `.devmeta/devmeta.md` from the project root if it exists. It provides
project-specific test commands, environment checks, and additional rules.

If no `.devmeta/devmeta.md` exists:
- Testing: look for `package.json` test scripts
- Environment: skip checks
- Additional rules: none

> **tk mapping:** tk -t epic = DevMeta Feature, tk -t task = DevMeta Task

---

## Purpose

This is the single command that drives the entire project. Run it to start. Run it again to continue. It figures out where the project is and does the next thing, autonomously, until it hits a genuine external blocker or closes all gaps.

**Current increment:** Defined in `.devmeta/current-increment.md`. Follow the pointer to the active increment's `_overview.md` for scope, iterations, and gap analysis. The active line names the increment as `Increment <NN>-<XXX>` (zero-padded integer + 3-letter random suffix added to avoid parallel-branch collisions); its directory is `.devmeta/increments/increment-<NN>-<XXX>/`. Iteration numbers within use the integer only (`<NN>.1`, `<NN>.1R`).

**You are the project driver.** You don't ask the user what to do — you assess the state and act.

**You ask nothing until the run is over.** Not a clarification, not a confirmation,
not "which of these did you mean", not a mid-run status check dressed as a
courtesy. `/devmeta:go` is a request to be left alone until there is a result, and
a question is the one thing that makes it not that.

That does not mean guessing silently. Every judgement call, assumption and
"someone should look at this" goes in **the ledger** (below), and the ledger is
what the final report is built from. The rule is not *decide alone and say
nothing* — it is **decide, write it down, keep going, and hand the whole list over
at the end.**

Even a genuinely external blocker — no API key, no hardware, a spec that will not
resolve — is a **ledger entry and a closed tick**, not a question. Do everything
that does not depend on it, record what is unproven and how sure you are (see
*never ticket the owner* in `plan-iteration.md`, and write it to
`docs/UNVERIFIED.md`), and carry on. The only thing that ends a run early is being
unable to proceed **at all**, and that ends it with the report, not with a
question.

## The ledger — where a question goes instead of to the user

**`<increment-dir>/decisions.md`.** Create it on the first entry. Append; never
rewrite.

Write an entry the moment you do any of these:

- take an assumption the spec did not state
- pick between two readings of a requirement
- discover something that changes what a later iteration should do
- decide not to do something, and why
- find something you cannot verify from here, with your confidence and what would
  settle it
- notice a thing the owner will probably want to look at

One entry, four lines, no ceremony:

```markdown
## <YYYY-MM-DD> · <iteration> · <one-line title>
**Chose:** what you did
**Because:** the reason, in one sentence
**If wrong:** what breaks, and how expensive it is to reverse
```

Two properties make this worth the keystrokes, and both have been paid for:

- **It survives compaction.** A judgement made in iteration 1 is gone from context
  by iteration 3. A file is not.
- **It is the report's source.** Without it the run reaches the end with nothing
  to report but what git already shows, and the instinct is to surface decisions
  *when they happen* — which is exactly the interruption `/devmeta:go` exists to
  prevent.

A run that ends with an empty ledger and a report full of caveats got it backwards.

## Phase 0: Assess State

**Ticks are the single source of truth for project state.** Run these commands:

```bash
tk list --all --status all    # Full project state — iterations, features, tasks
tk next                       # What should I do right now?
tk next <iteration-id>        # What's next within the current iteration?
```

Then read context files as needed:
1. `CLAUDE.md` (already loaded)
2. `.devmeta/current-increment.md` — which increment is active
3. Current increment's `_overview.md` — scope, iterations, gap analysis
4. Current iteration's `status.md` in the increment's `iterations/` directory

**The rule: if `tk next` returns a task IN THE ACTIVE INCREMENT'S TREE, do that
task.** Don't interpret markdown files to figure out what to do — the tick
structure already encodes the answer.

**`tk next` is increment-blind, and that is the one place it must not be
trusted absolutely.** It ranks the whole board: bugs filed mid-session, tasks
from increments that closed months ago, anything a `--force` left behind. A task
outside the active increment's tree is **backlog, not next**. Do not start it,
and do not hand it to the user as work — record it and carry on with the
increment.

```bash
tk show <id> --json | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('parent'))"
```

Walk `parent` up. If it does not reach the active increment's iteration epics,
it is not next.

## Iteration Rhythm: Execute → Inspect & Adapt

Every execution iteration is followed by a dedicated I&A cycle. This is structural — not optional, not a task that can be forgotten.

```
Iteration N: Execute (code, tests, commits, PR)
    → closes with "Kick off I&A Cycle NR" task
Iteration NR: Inspect & Adapt (code review, docs audit, plan reassessment, context handoff)
    → last task IS the first concrete task of next iteration (e.g., "Plan Iteration N+1")
Iteration N+1: Execute
    → ...
```

Both execution and I&A cycle iterations are top-level ticks with their own children. Continuity is ensured by making the last I&A cycle task be **real work for the next iteration**, not a meta "Continue to" task. This eliminates the boundary where the agent historically stops.

### Execution Iteration Structure

```
Iteration N (epic, top-level)
├── Feature A: <name> (epic, parent: iteration)
│   ├── Task 1: <implementation work> (task)
│   ├── Task 2: <implementation work> (task)
│   └── Re-ground after Feature A (task)  ← ALWAYS LAST IN EVERY FEATURE
├── Feature B: <name> (epic, parent: iteration)
│   └── ...
├── Create PR for iteration N (task, parent: iteration)
├── Merge PR and return to base branch (task, parent: iteration)  ← MERGE BEFORE I&A CYCLE
├── Commit metadata to base branch (task, parent: iteration)  ← COMMIT .tick/ AND .devmeta/ FILES
└── Kick off I&A Cycle NR (task, parent: iteration)  ← ALWAYS LAST
```

### I&A Cycle Structure

```
Iteration NR: Inspect & Adapt (epic, top-level, blocked by iteration N, runs on base branch from `<increment-dir>/base-branch` after merge)
├── Run /devmeta:reflect N (task)  ← invokes the full 13-step I&A process
└── Plan Iteration N+1 (task)  ← REAL WORK, not a boundary
```

The I&A cycle task invokes `/devmeta:reflect N` as a skill. Do NOT break it into separate tasks -- the skill handles the full sequence internally (code review, docs audit, gap verification, project history update, plan reassessment, and more).

### Re-grounding Task (after every feature)

When you reach a "Re-ground after Feature X" task, do ALL of these before closing it:
1. Update `.devmeta/project-history.md` with entry for what you just built
2. Update iteration `status.md` with feature completion
3. Capture any lessons in `.devmeta/lessons-learned.md`
4. Run `tk list --parent <iteration-id>` to see where you are in the iteration

### Commit Metadata to Base Branch (after every merge)

After merging a PR and returning to the base branch, `.tick/` and `.devmeta/` files will have been modified during orchestration but NOT included in the iteration PR (since they live on the base branch, not the feature branches). You MUST commit them:

```bash
git add .tick/ .devmeta/ tsconfig.tsbuildinfo
git status --short   # verify only metadata files staged
git commit -m "Update .tick/ and .devmeta/ metadata for iteration N"
```

This is NOT optional. Without this step, 30-40 metadata files accumulate as dirty working tree state across iterations. The commit goes directly on the base branch — no PR needed for metadata-only changes.

**Multi-repo mode:** this metadata commit happens in the **hub** repo only (where `.devmeta/` and `.tick/` live). The "Create PR" and "Merge PR" tasks, by contrast, apply **per modified repo**: each repo with commits this iteration gets its own PR from its feature branch(es) into its increment branch, merged in that repo.

### Last I&A Cycle Task = First Task of Next Iteration

The last task in every I&A cycle is **concrete work for the next iteration** — typically "Plan Iteration N+1: read scope from _overview.md, create feature tick structure, begin first task." This is NOT a meta/handoff task. It's real work.

When you reach the last I&A cycle task:
1. Do the work described in the task (read scope, create features, create tick structure)
2. Close the task and the I&A cycle iteration
3. Run `tk next` and start executing the first task of the new iteration

## Phase 0.5: Establish Base Branch

The base branch for the current increment is persisted in `<increment-dir>/base-branch` (a plain text file containing just the branch name). This is the **single source of truth** for which branch feature branches are created from, PRs target, and the I&A cycle runs on.

1. Read `.devmeta/current-increment.md` to find the active increment directory.
2. Check if `<increment-dir>/base-branch` exists:

**If the file exists:** Read it. That's the base branch. Verify it exists locally
with `git rev-parse --verify <branch>`. If it does not, fall through to the rules
below and log the substitution in the ledger.

**If the file does NOT exist (first run for this increment):** decide it. Do not
ask.

> This used to say *"this is the ONE exception to 'never ask permission' — you
> MUST ask which branch to use as base"*, and it was the wrong call. It put a
> question at the very front of a command whose whole promise is that it does not
> ask, and it asked it about the one thing with an obvious right answer.

1. `git fetch`, then detect the repo's default branch —
   `git symbolic-ref refs/remotes/origin/HEAD`, never assumed.
2. **Take the current branch as base** if it is not the default branch. A user who
   ran `/devmeta:go` from a working branch meant that branch; asking them to
   confirm it is asking them to repeat themselves.
3. **Otherwise cut a new branch** `YYYY-MM-DD-<increment-slug>` from the default
   branch and push it with `-u origin`. Working directly on the default branch is
   the one shape nobody wants, so it is the one case that needs no consultation.
4. Write the name to `<increment-dir>/base-branch`, and log the choice in the
   ledger — one line, so the report can say which branch it picked and why.

After this phase, the base branch is established. All subsequent operations read it from the file.

**Multi-repo mode** (`devmeta.md` has a `## Repos` section): the branch in `base-branch` is the increment branch for EVERY repo in play, not just this one. After establishing it here (the hub):

1. Read the increment's repo set from its `_overview.md > Repos` — which repos the increment *modifies* vs. only needs to *understand*. Resolve each slug to a local path via `devmeta.md > Repos`.
2. **Readiness gate.** Every repo in the set must be cloned locally, fetched, and level with its **default branch** on origin. Default branches vary per repo (`main` vs `master`) — detect with `git symbolic-ref refs/remotes/origin/HEAD` (fallback: `git ls-remote --symref origin HEAD`), never assume. If a repo is **behind**, bring it level yourself — that is a fetch and a
   fast-forward, not a decision. If a repo is **missing entirely**, do not guess
   its contents: log it in the ledger, drop it from this run's modified set, and
   deliver every part of the increment that does not touch it. A missing clone
   makes part of an increment undeliverable; it does not make the run a question.
3. In each modified repo, create the **identical** branch name from its latest default branch (`git checkout -b <branch> <default-branch>`), push with `-u origin`. Never diverge branch names across repos.
4. **On resume** (base-branch file already exists): each modified repo must be *on the increment branch* — check it out if needed. Do not require the default branch here; default-branch freshness applies only when first cutting a repo's branch.

## Phase 1: Environment Check (iteration 1 only, or when needed)

Before doing any work, verify the development environment. **Test, don't ask.**

Run the environment checks from `.devmeta/devmeta.md > Environment` if it exists.
If no `.devmeta/devmeta.md`, skip environment checks.

## Phase 2: Execute Based on State

### If `tk next` returns a task: DO IT

Read the task description with `tk show <id>`, do the work, close the task with `tk close <id>`, then run `tk next` again.

### If `tk next` returns an execution iteration (no children): PLAN IT

1. Run `/devmeta:plan-iteration N`
2. **`plan-iteration` owns the whole tick structure**, features and the six ticks
   an iteration owes besides them — the re-ground tasks, the PR, the merge, the
   metadata commit, the I&A kick-off, and the I&A cycle iteration itself. The list
   lives in that command, under Step 6.

   > It used to live **here**, and that was the bug. When `go` called
   > `plan-iteration` the list was supplied; when a user called `plan-iteration`
   > **directly** nobody supplied it, because that command never told anyone to
   > read this file. Increment 08 was planned by four direct invocations and
   > produced **zero** PR, merge, re-ground or I&A ticks against 51 in the
   > increments run under `go`. Restating the list here would recreate the drift
   > in the other direction; point at it instead.
3. Set dependencies between features (waves: parallel where independent, sequential where dependent)
4. Then immediately start executing (`tk next` → do the first task)

### If `tk next` returns an I&A cycle iteration (no children): CREATE ITS TASKS

Create 2 tasks: "Run /devmeta:reflect N" and "Plan Iteration N+1: read scope, create feature tick structure, begin first task". Then `tk next` to start.

### If `tk next` returns nothing: CHECK STATE

- If all current increment iterations are closed → **run the close gate below
  before writing the word COMPLETE anywhere.**
  - Write the report in **The report** below. It is the only thing this command
    prints, and the only place a question may be asked.
  - Do NOT bootstrap a new increment. Do NOT ask the user which increment to start next. The current increment was the scope of this `/devmeta:go` invocation; its end is the end of the run.
  - To start the next one, the user will either run `/devmeta:start-increment-spec` (for fresh scope) or update `.devmeta/current-increment.md` to point at a pre-spec'd increment, then re-invoke `/devmeta:go`.

#### The close gate — prose must agree with ticks

`current-increment.md` is prose and the board is ticks. Nothing reconciles them,
so an increment can read COMPLETE while one of its own deliverables is open. That
has happened.

Before writing COMPLETE: **zero open ticks in the increment's tree.**

That is the whole gate now. It used to have a second limb — *or every survivor is
`--awaiting approval` and named under `## Complete except:`* — and that limb was
the leak. It existed for tickets addressed to the owner, and once an increment
could close over the top of them, they multiplied: one project carried seven for
months and its board could never say COMPLETE and mean it.

**A ticket is never addressed to the owner** — see the hard rule in
`plan-iteration.md`. With none of those on the board, every open tick is work an
agent can do, and "zero open" is a gate an agent can actually pass.

If it does not hold, the increment is **not** complete. Say what is open and keep
working.

#### `Active:` is never `none`

An increment stays **active** until its successor is named. There is no inert
state — writing `Active: none` leaves `/devmeta:go` with nothing to drive and no
way to say so.

| Real state | `Active:` line | `/devmeta:go` does |
|---|---|---|
| work remains | the increment | drives it |
| genuinely finished | the increment, `Status: COMPLETE` | reports; the user names the next one |

There is no `BLOCKED ON HUMAN` row. There was, and it was a mistake: it made
"waiting on the owner" a state the loop could park in, and a loop that can park
will. Something you genuinely cannot exercise gets its confidence written down
and the tick closed, not a state of its own.

- If blocked iterations exist → close the blocking iteration first
- If something is stuck → investigate and unblock
- Verify against the current increment's scope — are all items actually closed?

## The report — the one thing this command prints

Every other DevMeta command has a fenced report block. `go` — the one actually
run — had none, and only a line saying "write a short completion report". That
absence is not cosmetic: **with nowhere for a decision to land at the end, it
lands mid-run**, and the command that promised not to interrupt interrupts.

Print this, and nothing around it. Not a preamble, not a recap underneath.

```markdown
## Increment <NN>-<XXX> — <COMPLETE | iteration N of M>

**Shipped:** one line per iteration — what changed, not what was attempted
**Verified:** the actual commands and their results. `check.sh`, the probe, CI.
**Open ticks:** <N, and if not zero, why the run stopped with work left>

### Assumptions taken
Straight from `<increment-dir>/decisions.md`, one line each, biggest blast
radius first. Every one is already implemented — this is what to check, not
what to answer. Say what breaks if it is wrong.

### Needs your call
Only decisions that are genuinely the owner's: a product judgement, a
trade-off with no technical answer, a direction change. **Not** things you
could have decided and deferred out of caution. If the list is long, the run
was not autonomous enough.

### Could not verify from here
What was built but not exercised — hardware, an account, a device. With the
confidence and what would settle it. Mirrors `docs/UNVERIFIED.md`; never a
ticket.
```

**Three of these five sections are usually empty, and that is the good outcome.**
An empty **Needs your call** means every decision had a defensible answer and got
one. A long one means the run kept flinching.

**The report is not a checkpoint.** It is printed when the increment is done, or
when the run is genuinely unable to continue — never at an iteration boundary,
never after a merge, never because a body of work felt large enough to mention.

### If NO TICKS EXIST: BOOTSTRAP

Read `.devmeta/current-increment.md` to find the active increment, then read its `_overview.md` and create the iteration ticks. Each iteration is a top-level epic tick. The `/devmeta:plan-iteration N` command creates the features and tasks within each iteration when it's time to execute.

## Critical Rules

**Never ask permission to proceed.** Plan → execute → inspect & adapt → next iteration. That's the loop. `tk next` drives it.

**Never ask "should I continue?" or "want me to proceed?"** The tick structure tells you what to do. Do it.

**Never ask a question until the run is over.** Not one. A clarification, a
"which did you mean", a "before I continue" — all of them break the only promise
this command makes. Every one has a home: the ledger during the run, the report
at the end. See *The ledger* and *The report*.

**Never stop to present a summary or status update *within* an increment.** Completing an iteration, a PR merge, or an I&A cycle is NOT a stopping point. It's a waypoint. Do NOT write "here's where we are" messages. Do NOT present a list of what was accomplished. `tk next` tells you what to do next — do it immediately. The agent stays in "doing work" mode at all times. Completing a large body of work triggers the instinct to summarize and defer to the user — resist this. The tick structure eliminates the decision point.

**The exception: completing an increment IS a stopping point.** Iteration and I&A boundaries are waypoints; increment boundaries are not. When `tk next` returns nothing and all current-increment iterations are closed, stop, print **The report**, and exit. Do NOT create a "bootstrap next increment" task, do NOT ask which increment to start next, do NOT attempt to pick one from the NOT STARTED list. Increment selection is a human priority call and often requires `/devmeta:start-increment-spec` (interactive) anyway. The user will re-invoke `/devmeta:go` when they're ready for the next one. Structure the final iteration's I&A cycle so its last task is "Close increment N" (update metadata, PR, merge) — nothing after that.

**Test before asking.** If you think something might not work, try it first.

**Tests are autonomous and must pass before moving on.** After every task, run the relevant tests (from `.devmeta/devmeta.md > Testing` or `package.json`). If they fail, fix the code and re-run. This is a loop — implement → test → fail → debug → fix → test → repeat until green. An iteration CANNOT close with failing tests. A task CANNOT close with failing tests. There is no "known failure" state. If a test requires infrastructure, set it up. If you genuinely cannot, log it in the ledger with what is missing and carry the gap to the report — do NOT skip the test silently, and do NOT stop to ask for the resource. Each iteration's "Verify on screen" section is the acceptance test — actually run those commands and verify the output.

**Scope cannot shrink.** You may split, merge, reorder, or inject iterations. You may NOT remove scope items. If something is hard, work harder — "ask for help" is not available mid-run; log the difficulty and keep attacking it. If something takes longer than expected, it takes longer. Only the human can cut scope. Scope can grow (bugs, discovered gaps) but never shrink.

**Work continues until it succeeds.** A failing test is not a stopping point — it is a problem to solve. A blocked task is not a reason to skip — it is a problem to unblock. "I couldn't figure it out" is never valid — try a different approach.

Missing keys, missing hardware and an ambiguous spec used to be listed here as
reasons to stop. **They are not.** They are reasons to take the most defensible
reading, deliver everything that does not depend on the missing thing, write the
confidence and the gap into the ledger and `docs/UNVERIFIED.md`, and close the
tick. A run ends when the increment is delivered or when literally nothing can
proceed — and either way it ends with the report.

**Commit and push regularly.** Commit per task, PR per iteration. After CI passes on the PR, merge it into the base branch (stored in `<increment-dir>/base-branch` — written during Phase 0.5). The I&A cycle iteration runs on the base branch. **Do NOT assume the base branch is `main`** — read it from `<increment-dir>/base-branch`. **Always use `--merge` (not `--squash` or `--rebase`) when merging PRs** so the branch history remains visible in the git graph.

**Run tests constantly.** After every meaningful code change, run the relevant tests. Tests are the heartbeat. If you haven't run tests in the last 3 tasks, something is wrong.
