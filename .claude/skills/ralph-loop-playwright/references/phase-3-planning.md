# PHASE 3: Fix Plan Creation

## Pre-execution Required Instructions

> **[Important]** In this Phase, the following procedure must be followed:
> 1. Create a thorough fix plan
> 2. Present plan to user in detail
> 3. Proceed with code modification only after user approval

Questions to review during deep plan creation:
1. What are all the files that need modification?
2. What are the potential side effects of each change?
3. What is the optimal execution order?
4. What is the rollback strategy if it fails?
5. How will success be verified?

---

## Plan Creation Process

### STEP 1: Define Modification Scope

- List all files that need modification
- Determine priority of each file modification
- Identify dependency order between files

### STEP 2: Design Detailed Changes

- Specific code changes for each file
- Specify before/after code
- Explain exact reason for each change

### STEP 3: Risk Assessment

- Review potential side effects of each change
- Evaluate regression bug possibilities
- Review type safety

### STEP 4: Optimize Execution Order

- Determine execution order based on dependencies
- Identify rollback-capable stages
- Set verification points

### STEP 5: Simulate Expected Results

- Expected behavior after fix
- Clarify success criteria
- Plan response to failures

---

## Output Format

```
═══════════════════════════════════════
📋 Fix Plan (LOOP #N)
═══════════════════════════════════════

## Problem Summary
- Goal: <goal>
- Error: <error_type>
- Root Cause: <root_cause>
- Impact Scope: <impact_scope>

## Fix Plan

### Step 1: <task_name>
- File: `<path>`
- Before:
  ```
  <before_code>
  ```
- After:
  ```
  <after_code>
  ```
- Reason: <reason>
- Risk: <potential_risk>

### Step 2: ...

## Execution Order
1. <first file to modify> (reason: <why_first>)
2. <second file to modify> (reason: <why_second>)
...

## Expected Results
- <expected behavior after fix>

## Success Criteria
- [ ] <verification item 1>
- [ ] <verification item 2>

## Risks and Mitigation
- Risk: <potential_issue>
- Mitigation: <mitigation_plan>
═══════════════════════════════════════
```

---

## User Confirmation Request

After presenting the plan, user approval is required:

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
