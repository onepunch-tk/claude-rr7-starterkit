---
name: workflow-interactive
description: |
  Development workflow for implementation tasks. Use when: implementing features, fixing bugs, creating components, writing routes, integrating APIs, or any task that involves writing production code. Provides the standard TDD-first development cycle with code review and validation steps. Do NOT use for research, documentation-only, or planning-only tasks.
---

# Interactive Development Workflow

Standard development workflow for human-in-the-loop implementation tasks.
Follow these steps **sequentially**. Each step MUST complete before proceeding.

---

## Mode Selection (Auto-Detect)

After Phase 1 planning, auto-detect execution mode based on task scope:

| Criteria | Mode | Description |
|----------|------|-------------|
| 1-3 files, single feature | **Sequential** | Main agent handles all phases directly |
| 4-10 files, 2-3 features | **Delegated** | Supervisor pattern with worker agents |
| 10+ files, complex features | **Team** | Use `/workflow-team` instead |

```
Mode Detection Algorithm:
1. Count files to be modified from plan
2. Count distinct features/components
3. IF files <= 3 AND features == 1:
     → Sequential Mode
   ELSE IF files <= 10:
     → Delegated Mode (Supervisor)
   ELSE:
     → Recommend /workflow-team
```

**User Override**: User can explicitly request mode: "use sequential mode" or "use delegated mode"

---

## Phase 1: Plan (Both Modes)

| Step | Action |
|------|--------|
| 1 | Enter `PlanMode` |
| 2 | Analyze current state thoroughly |
| 3 | Create detailed step-by-step plan |
| 4 | **Count files and features** → determine execution mode |
| 5 | Exit `PlanMode` → wait for plan approval |

> After plan approval, create tasks via `TaskCreate` and execute immediately. No separate confirmation needed.

---

## Phase 2: TDD (after user approval)

### Git Setup (Both Modes)

| Step | Action |
|------|--------|
| 6 | Fetch latest and switch to `development` branch: `git fetch origin development && git checkout development && git pull origin development` (create if not exists) |
| 7 | Create feature branch from `development` |

### Sequential Mode (Small Tasks: 1-3 files)

| Step | Action |
|------|--------|
| 8 | Run `unit-test-writer` sub-agent → **verify tests FAIL** (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** |
| 9 | Implement code to pass tests → run the project's test command (see CLAUDE.md Commands) → **verify ALL pass** (Green Phase) |

**Auto-verify (no human wait needed)**:
- After Step 8: If tests pass immediately → review test logic, likely not testing correctly
- After Step 9: If any test fails → fix implementation before proceeding

### Delegated Mode (Medium Tasks: 4-10 files)

| Step | Action |
|------|--------|
| 8 | Spawn `task-executor` worker agent with task context |
| 9 | **Supervisor waits** — do NOT implement yourself |
| 10 | Receive summary from `task-executor` |
| 11 | Verify summary: Status=Success, Coverage>=90% |

```
Supervisor Context During Delegation:
- Store only: task ID, file list, expected outcomes
- Do NOT read test code or implementation details
- Wait for worker summary
```

> 💡 **Context tip**: Consider `/clear` here. Plan context is no longer needed.

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Red/Green phase

---

## Phase 3: Review

### Sequential Mode

| Step | Action |
|------|--------|
| 10 | Run `code-reviewer` sub-agent (unified: quality + security + performance) |
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" |

### Delegated Mode

| Step | Action |
|------|--------|
| 12 | Spawn `quality-gate` worker agent with changed files list |
| 13 | **Supervisor waits** — do NOT review yourself |
| 14 | Receive pass/fail summary from `quality-gate` |
| 15 | IF Status=FAIL: Spawn `task-executor` to fix blocking issues |
| 16 | IF Status=PASS: Proceed to Phase 4 |

```
Quality Gate Loop:
WHILE quality-gate returns FAIL:
  1. Extract blocking issues from summary
  2. Spawn task-executor with fix instructions
  3. Re-run quality-gate
  4. Max 3 iterations, then escalate to user
```

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Review phase

> 💡 **Context tip**: Consider `/clear` here. Review details are no longer needed.

---

## Phase 4: Validate & Finalize

### Sequential Mode

| Step | Action |
|------|--------|
| 12 | Run `e2e-tester` sub-agent |
| 13 | Fix bugs discovered in E2E (skip if all pass) |
| 14 | Run `development-planner` sub-agent |
| 15 | Merge feature branch to `development` |

### Delegated Mode

| Step | Action |
|------|--------|
| 17 | E2E already run by `quality-gate` — check summary |
| 18 | IF E2E failed: Spawn `task-executor` for fixes, re-run `quality-gate` |
| 19 | Run `development-planner` sub-agent (Supervisor handles directly) |
| 20 | Merge feature branch to `development` |

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — E2E fix phase (if needed)

---

## Failure Recovery

```
IF any step fails:
  1. Log failure to docs/reports/failures/{timestamp}-{step}.md
  2. Retry SAME approach (1 attempt)
  3. Retry DIFFERENT approach (1 attempt)
  4. After 3 total failures → STOP, report to user, WAIT for instruction
```

---

## Context Management

- `/clear` after Phase 2 (TDD complete): plan + test exploration no longer needed
- `/clear` after Phase 3 (review complete): review reports no longer needed
- Target: stay under 60k tokens per phase
- If unsure: `/context` to check usage

### Context Limit Warning Protocol

```
IF context exceeds 80k tokens before Phase completion:
  1. Summarize current progress to user (completed steps, pending steps)
  2. Recommend `/clear` with checkpoint description
  3. Provide resume instructions:
     - Current phase and step number
     - Files modified so far
     - Next action to take
  4. After `/clear`, resume from checkpoint
```

### Checkpoint Template

```markdown
## Checkpoint Summary
- **Phase**: [1-4] - [Phase Name]
- **Last Completed Step**: [Step Number]
- **Files Modified**: [List]
- **Next Action**: [Description]
- **Blockers**: [If any]
```

---

## Supervisor Pattern Architecture (Delegated Mode)

```
┌─────────────────────────────────────────────────────────────┐
│                 Supervisor (Main Agent)                      │
│  • Orchestration only — minimal context                     │
│  • Stores: task IDs, file lists, worker summaries           │
│  • Does NOT: read code, write tests, review details         │
└─────────────────────────────────────────────────────────────┘
                    │                           │
         ┌──────────┴──────────┐     ┌──────────┴──────────┐
         ▼                     ▼     ▼                     ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  task-executor  │     │  quality-gate   │     │ development-    │
│    (Sonnet)     │     │    (Sonnet)     │     │    planner      │
├─────────────────┤     ├─────────────────┤     │   (Opus)        │
│ • TDD cycle     │     │ • Code review   │     └─────────────────┘
│ • Red → Green   │     │ • E2E tests     │
│ • Commits       │     │ • Pass/Fail     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ unit-test-writer│     │  code-reviewer  │
│    (Sonnet)     │     │    (Sonnet)     │
└─────────────────┘     ├─────────────────┤
                        │   e2e-tester    │
                        │    (Sonnet)     │
                        └─────────────────┘
```

### Benefits of Delegated Mode

| Aspect | Sequential | Delegated |
|--------|------------|-----------|
| Context usage | All in main | Distributed |
| Cost | Higher (Opus all) | Lower (Sonnet workers) |
| Parallelization | None | Workers can overlap |
| Recovery | Manual | Auto-retry via workers |
| Scalability | Limited | Extensible |

### When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Quick bug fix (1-2 files) | Sequential |
| New component (3-5 files) | Delegated |
| Feature with multiple components | Delegated |
| Cross-cutting refactor (10+ files) | `/workflow-team` |
| Exploration / research | Sequential (no workers) |