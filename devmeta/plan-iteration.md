---
description: Plan an iteration (global) — refine scope into feature specs, graph-partition for independence
argument-hint: [iteration-number]
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

## Context

- Today's date: !`date +%Y-%m-%d`
- Target iteration: $ARGUMENTS
- Ticks initialized: !`test -d .tick && echo "yes" || echo "no"`

## Design Philosophy

**The feature is the unit of context.** Each feature runs in one subagent session (~200k tokens). Tasks within a feature are sequential steps — not independent workers.

**Your primary job is finding feature boundaries that maximize independence.** More independence = more parallelism = faster wall-clock time.

**Workers are smart.** They have the project's own orientation docs (`CLAUDE.md` / `AGENTS.md`, and `docs/current/` if the repo keeps one), the spec, and the codebase. Task descriptions guide — they don't micromanage.

**This project uses AI-agentic development.** All code is written by agents. Prioritize consistency, mainstream patterns, and well-known libraries — per the repo's own recorded decisions, wherever it keeps them.

## Your Task

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

### Step 0: Initialize

```bash
tk list 2>/dev/null || tk init
```

### Step 1: Read the Iteration Plan

Read the increment overview and the specific iteration plan:

```
Current increment's _overview.md (find via .devmeta/current-increment.md)
Current increment's iterations/iteration-<N>/plan.md  (if exists)
```

If no detailed plan exists yet for this iteration, read the overview's rough scope and create the iteration's `plan.md` with refined scope.

Also read:
- `CLAUDE.md` — project orientation
- the repo's architectural decisions — `docs/current/principles-and-choices.md` **if it exists**; otherwise `AGENTS.md`, `.devmeta/devmeta.md`, or the equivalent this repo actually keeps
- `.devmeta/lessons-learned.md` — don't repeat past mistakes
- Any relevant spec or architecture docs referenced in the increment overview

> **`docs/current/` is optional and often absent.** Several DevMeta commands name
> it as though it always exists; many repos never adopt it and keep the same
> knowledge in `AGENTS.md`, `CLAUDE.md`, `.devmeta/devmeta.md`, `.devmeta/lessons-learned.md`
> or a `docs/` tree of their own. **Read what the repo actually has** — check
> before citing, and never fail or stall because the path is missing.
>
> This matters more than it looks: a harness that instructs an agent to read a
> file which does not exist is committing the same defect the increments using it
> spend their time removing. If a repo has no `docs/current/`, that is a choice,
> not a gap to fill.

### Step 1.5: Scope Check — Does This Iteration Still Make Sense?

Before planning in detail, evaluate the iteration's scope against what actually exists:

1. **Is the scope too large for one iteration?** If mapping the work produces 8+ features or the foundation feature alone is massive, **split the iteration.** Update the current increment's `_overview.md` directly. Renumber subsequent iterations.
2. **Has previous work already covered some of this scope?** Remove deliverables that are already done.
3. **Are there new deliverables that belong here?** Cleanup tasks from the previous reflection, discoveries during implementation, or prerequisites that weren't anticipated.
4. **Is the iteration order still right?** If this iteration depends on something from a later iteration, reorder.

If you restructure, update the current increment's `_overview.md` and note the change in `.devmeta/project-history.md`. Then continue planning.

**Check `## Carried` in this increment's `_overview.md`** and in any previous
increment's. Work that became unblocked elsewhere is a candidate for scope here —
but it is a decision to make deliberately at planning time, not a to-do list to
hand the user.

### Step 2: Map the Work

Read the iteration plan thoroughly and explore the codebase. Build a complete picture:

1. **List all deliverables** — every feature, component, service, migration, test
2. **Map file footprints** — for each deliverable, which files will be created or modified
3. **Identify shared code** — files or modules that multiple deliverables depend on
4. **Note the test strategy** — surgical test commands per task (from `.devmeta/devmeta.md > Testing` if available)

**Output a work-to-file matrix** (internal analysis):

```
Deliverable A → creates: file1, file2 | modifies: file3
Deliverable B → creates: file4 | modifies: file3, file5
Shared files: file3 (A, B)
```

**Multi-repo mode** (`devmeta.md` has a `## Repos` section): map footprints **per repo** — every deliverable names the repo it lands in (from the increment's `_overview.md > Repos`). Prefer feature boundaries that keep each feature within ONE repo; a cross-repo feature is allowed only when the change is genuinely atomic across repos, and must name all its repos.

### Step 3: Find the Cuts (THE CRITICAL STEP)

Graph partitioning — group deliverables into features:

1. **Cluster by shared files.** Deliverables modifying the same files belong together.
2. **Extract shared foundations.** Schemas, types, utilities, shared components → foundation feature.
3. **Check independence.** Can each non-foundation feature run without others? If not, move more to foundation or add minimal cross-feature deps.
4. **Check sizing.** Each feature should fit in ~60-70% of context. Split if too large, merge if trivially small.
5. **Maximize the parallel frontier.** How many features run simultaneously after foundation? Optimize for this.

**General dependency ordering heuristics:**
- Shared types, interfaces, and schemas belong in foundation (they must exist before consumers)
- Config and environment loading belongs in foundation
- Storage/persistence layer belongs in foundation (other layers read/write it)
- Service layers that share a persistence layer can be parallel after foundation
- CLI/API/web layers depend on core services being functional

### Step 4: Create Feature Specs

For each feature, create a spec file:

```
.devmeta/projects/YYYY-MM-DD-<feature-name>/YYYY-MM-DD-<feature-name>-spec.md
```

Each spec contains:
- Scope (what this feature delivers)
- Target repo (multi-repo mode: slug + local path from `devmeta.md > Repos`)
- Architecture (files to create/modify)
- Implementation guide (ordered steps)
- Test strategy (surgical commands)
- Open questions (if any)

### Step 5: Create Shared Context Log

```
.devmeta/projects/YYYY-MM-DD-<feature-name>/context-log.md
```

```markdown
# Shared Context Log — <feature-name>

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

---
```

### Step 6: Create Features and Tasks in tk

**Feature format** (multi-repo mode: include the `## Repo` line; omit it otherwise):
```bash
tk create "<iteration>: <phase>" -t epic -d "## Scope
<What this feature delivers>

## Repo
<slug> — \`<local path>\` (all code work happens here; tk and .devmeta/ stay in the hub)

## Spec
\`.devmeta/projects/YYYY-MM-DD-<name>/YYYY-MM-DD-<name>-spec.md\`

## Worker Instructions
- Complete tasks in order
- Read \`.devmeta/projects/YYYY-MM-DD-<name>/context-log.md\` before starting
- Read \`.devmeta/lessons-learned.md\` before starting
- Append learnings to context-log.md when done"
```

**Task format:**
```bash
tk create "<title>" \
  --parent <epic-id> \
  -d "## Objective
<what this step delivers>

## Spec Reference
\`<path>\` — Section: \"<section>\"

## Scope
**Files:** \`path/to/file\` — what changes

## Implementation
1. Step
2. Step

## Tests
Run: \`<surgical test command>\`
Do NOT close until tests pass." \
  --acceptance "<test command> passes"
```

**Cross-feature dependencies (feature level only):**
```bash
tk block <epic-B-first-task-id> <epic-A-last-task-id>
```

### Step 7: Create Iteration Status File

```
Current increment's iterations/iteration-<N>/status.md
```

```markdown
# Iteration <N> Status

**Started:** YYYY-MM-DD
**Status:** In Progress

## Features

| Feature | ID | Tasks | Status | Depends On |
|---------|----|-------|--------|-----------|
| Foundation | <id> | N | Not started | — |
| Feature X | <id> | N | Not started | Foundation |
| Feature Y | <id> | N | Not started | Foundation |

## Feature Independence Map

        [Foundation]
        /          \
  [Feature X]  [Feature Y]   ← parallel

## Notes

<Updated as iteration progresses>
```

### Step 8: Continue Immediately to Execution

**DO NOT pause, summarize, or ask the user anything.** Planning is not a stopping point.

After creating the tick structure, immediately:
1. Run `tk next` to get the first task.
2. Begin executing it.

Do NOT write "here's the plan, shall I proceed?" messages. Do NOT present the feature independence map as a decision point. Do NOT offer options. The tick structure IS the plan; execution starts now.

If the human needs to intervene, they will interrupt. Your job is to keep moving.

#### Where this command ends depends on who called it

This is the only DevMeta command with no defined stopping point, and that
ambiguity has cost a real session: three iterations were planned and executed
back to back, and then execution halted after the fourth *planning* phase for no
reason other than the absence of a rule. The command is named for planning, its
Step 8 mandates execution, and it has no `Report:` block — so a direct invocation
has no turn boundary and one gets invented.

Branch on the caller. You can tell which you are:

- **Called from `/devmeta:go`** — a `go` phase is already running in this
  conversation. You are a waypoint inside its autonomous loop. Execute every
  feature in the iteration, then return to `go` **without a report**. Do not stop
  at the iteration boundary either; `go` decides that.

- **Invoked directly by the user** (`/devmeta:plan-iteration <N>`, nothing else
  running) — plan, **then execute the whole iteration**, then stop and report with
  the block below. Planning alone is never a complete answer to this command: the
  user asked for an iteration, and a tick structure is not one.

  ```markdown
  ## Iteration <N> — <STATUS>

  **Features:** <N> (<ids>) · **Parallel frontier:** <N>
  **Shipped:** <one line per feature — what changed, not what was attempted>
  **Verified:** <the actual command and its result>
  **Filed not done:** <tick ids + one line each, or "none">
  **Next:** <the literal next command>
  **Blocked on you:** <only what the agent cannot do, or "nothing">
  ```

Either way, **finishing the iteration is the deliverable.** If you find yourself
writing a summary while a task in this iteration is unstarted and unblocked, that
is the bug this section exists to prevent — go and do the task.

## Quality Checklist

- [ ] No file modified by two independent features
- [ ] Multi-repo mode: every feature names its target repo; cross-repo features only when atomic
- [ ] Shared code in foundation feature
- [ ] Each feature fits in ~60-70% of context
- [ ] Tasks ordered and building on each other within feature
- [ ] Every task has surgical test commands
- [ ] Cross-feature deps are minimal
- [ ] context-log.md created per feature
- [ ] iteration status.md created
- [ ] Parallel frontier is as wide as possible
