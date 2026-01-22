---
name: ralph-loop-playwright
description: |
  Automated debugging loop skill. Repeats [test→deep analysis→plan→confirm→fix] cycle until error resolution and goal achievement.
  Automatically collects web errors via Playwright MCP, learns library documentation via Context7 MCP.
  When to use: Web app error debugging, UI test automation, repetitive fix-verify tasks.
argument-hint: [goal] [url] [max] [email] [password]
allowed-tools: [
  "mcp__playwright__*",
  "mcp__context7__*"
]
model: opus
---

# Ralph-Loop Playwright

Repeats the **test → analysis → plan → confirm → fix → verify** cycle until the Goal is reached.
User approval is required before any code modification.

## Prerequisites

Playwright MCP and Context7 MCP are required.
Verify the following settings in `.claude/settings.local.json`:
```json
{
  "enabledMcpjsonServers": ["playwright", "context7"]
}
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `goal` | ✅ | Goal to achieve |
| `url` | ❌ | Target URL for testing |
| `max` | ❌ | Maximum loop count (0 = unlimited) |
| `email` | ❌ | Email for login |
| `password` | ❌ | Password for login |

---

## Workflow

```
LOOP_COUNT = 0
Repeat:
  LOOP_COUNT++

  [PHASE 0] credentials exist AND first loop → authenticate
  [PHASE 1] collect errors → terminate if Goal achieved
  [PHASE 2] deep cause analysis → present results → user confirm
  [PHASE 3] create fix plan → present plan → user confirm
  [PHASE 4] modify code
  [PHASE 5] test verification → PASS=terminate, FAIL=next loop

  terminate if max reached
```

---

## PHASE 0: Authentication (Conditional)

**Execution condition**: `LOOP_COUNT == 1` AND `email`, `password` exist

1. Navigate to login page `browser_navigate`
2. Get form element refs from page snapshot `browser_snapshot`
3. Enter credentials and submit `browser_type`, `browser_click`
4. Verify authentication result `browser_snapshot`

**Success criteria**: URL changed, login form disappeared

---

## PHASE 1: Error Collection

**Purpose**: Collect current page state and errors, determine Goal achievement

1. Navigate to target page (if url exists) `browser_navigate`
2. Wait for page load `browser_wait_for({ time: 2 })`
3. Collect console errors `browser_console_messages({ level: "error" })`
4. Page snapshot `browser_snapshot`
5. Screenshot `browser_take_screenshot({ fullPage: true })`
6. Check network failures `browser_network_requests`

**Goal achievement conditions** (all must be met):
- No console errors
- No network failures
- UI/functionality specified in Goal works correctly

**On Goal achievement**: Output `"✅ GOAL ACHIEVED"` and **terminate immediately**

---

## PHASE 2: Deep Cause Analysis

> **[Required]** In this Phase, the following must be observed:
> 1. Perform systematic and thorough analysis
> 2. Present analysis results to user in detail
> 3. Proceed to next step only after user confirmation
>
> Accurate analysis takes priority over fast response.
> Review all possibilities and derive conclusions based on evidence.

**Detailed process**: See [references/phase-2-analysis.md](references/phase-2-analysis.md)

**Key steps**:
1. Symptom summary - List error messages, identify occurrence conditions
2. Hypothesis formation - List possible causes, evaluate likelihood
3. Code tracing - Extract file/line from stack trace, verify source
4. Library documentation learning - Query related docs via Context7 MCP
5. Hypothesis cross-validation - Validate hypotheses against documentation
6. Root cause confirmation - Determine fix location, evaluate impact scope

**Output**: Analysis report (error_type, root_cause, target_files, fix_direction)

**User confirmation after analysis completion**:
```
AskUserQuestion({
  questions: [{
    question: "Is the above analysis accurate? Proceed to next step (fix plan creation)?",
    header: "Analysis Confirm",
    options: [
      { label: "Confirm", description: "Approve analysis, proceed to planning" },
      { label: "More Analysis", description: "Need deeper analysis" },
      { label: "Terminate", description: "End loop" }
    ],
    multiSelect: false
  }]
})
```

---

## PHASE 3: Fix Plan Creation

> **[Required]** In this Phase, the following must be observed:
> 1. Create thorough and complete plan
> 2. Present plan to user in detail
> 3. Proceed to code modification only after user approval
>
> Consider the impact scope of all modifications deeply.
> Thoroughly review side effects and regression bug possibilities before presenting the plan.

**Detailed process**: See [references/phase-3-planning.md](references/phase-3-planning.md)

**Key steps**:
1. Define modification scope - File list, priority, dependencies
2. Design detailed changes - Before/after code
3. Risk assessment - Side effects, regression bug possibilities
4. Optimize execution order - Order based on dependencies
5. Expected result simulation - Success criteria, failure response

**User confirmation request**:
```
AskUserQuestion({
  questions: [{
    question: "Do you approve the above fix plan?",
    header: "Plan Approval",
    options: [
      { label: "Approve", description: "Proceed with modifications as planned" },
      { label: "Request Changes", description: "Modify plan and review again" },
      { label: "Reject", description: "End loop" }
    ],
    multiSelect: false
  }]
})
```

**Response handling**:
| Response | Next Step |
|----------|-----------|
| Approve | Proceed to PHASE 4 |
| Request Changes | Re-execute PHASE 3 with feedback |
| Reject | Output `"⏸️ User Rejected"` and terminate |

---

## PHASE 4: Code Modification

**Prerequisite**: User approved the plan in PHASE 3

**Principles**:
- Modify only within approved plan scope
- Follow minimal change principle
- Maintain existing code style

**Steps**:
1. Read target files
2. Apply Edits in planned order
3. Type check (if needed) `bun run typecheck`

---

## PHASE 5: Test Verification

**Purpose**: Verify if modifications resolved the issue

1. Page refresh `browser_navigate`
2. Wait for page load `browser_wait_for({ time: 2 })`
3. Recheck errors `browser_console_messages({ level: "error" })`
4. Check status `browser_snapshot`, `browser_take_screenshot`

**PASS conditions** (all must be met):
- Previous errors resolved
- No new errors
- Goal conditions met

**Result handling**:
| Result | Next Step |
|--------|-----------|
| PASS | Output `"✅ GOAL ACHIEVED"` and terminate |
| FAIL + max not reached | Next loop (to PHASE 1) |
| FAIL + max reached | Output `"⚠️ Max Attempts Reached"` and terminate |

---

## Reference Documents

- [Playwright MCP Tools](references/playwright-tools.md) - Navigation, information collection, interaction
- [Error Patterns](references/error-patterns.md) - Common error types and resolution directions

---

## Output Format

**Loop start**:
```
═══════════════════════════════════════
RALPH-LOOP #N
Goal: <goal>
═══════════════════════════════════════
```

**Phase progress**:
```
[1/5] Collecting errors...
[2/5] Deep cause analysis...
[3/5] Creating fix plan...
[4/5] Modifying code...
[5/5] Test verification...
```

**Loop end**:
```
───────────────────────────────────────
Result: PASS/FAIL
Next: Terminate/Proceed to LOOP #N+1
───────────────────────────────────────
```

---

## Exit Codes

| Situation | Message |
|-----------|---------|
| Goal achieved | ✅ GOAL ACHIEVED (N attempts) |
| User rejected | ⏸️ User Rejected |
| Max reached | ⚠️ Max Attempts Reached |
| Fatal error | ❌ Unrecoverable |
