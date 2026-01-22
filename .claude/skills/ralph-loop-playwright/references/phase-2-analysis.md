# PHASE 2: Deep Cause Analysis

## Pre-execution Required Instructions

> **[Important]** In this Phase, the following procedure must be followed:
> 1. Systematically review all possibilities
> 2. Clearly present analysis results to the user
> 3. Proceed to next step after user confirmation

Questions to review during deep analysis:
1. What are the patterns of collected errors?
2. What are all possible cause hypotheses?
3. What is the likelihood of each hypothesis?
4. What is the actual cause based on code tracing?
5. Does the hypothesis match the library documentation?

---

## Analysis Process

### STEP 1: Symptom Summary

- List all collected error messages
- Identify timing and conditions of error occurrence
- Analyze correlations between errors

### STEP 2: Hypothesis Formation

- List all possible causes
- Evaluate likelihood of each hypothesis (high/medium/low)
- Select the most probable hypothesis

### STEP 3: Code Tracing

- Extract file paths, line numbers from error stack trace
- Verify source code using Read tool
- Trace call chain (caller → callee)
- Check related imports/exports, dependencies

### STEP 3.5: Library Documentation Learning

Use Context7 MCP to query library documentation:

```
// 1. Confirm library ID
mcp__context7__resolve-library-id({
  libraryName: "<library name>",
  query: "<search query related to error>"
})

// 2. Learn related documentation
mcp__context7__query-docs({
  libraryId: "<confirmed library ID>",
  query: "<specific question for error resolution>"
})
```

Items to verify:
- API usage and best practices related to the error
- Library version compatibility and breaking changes

### STEP 3.7: Hypothesis Cross-validation

Compare STEP 2 hypotheses with documentation learned in STEP 3.5:

| Validation Result | Hypothesis Status | Next Action |
|-------------------|-------------------|-------------|
| Matches documentation | confirmed | Increase confidence, proceed to STEP 4 |
| Contradicts documentation | revised | Revise hypothesis and re-validate |
| Explicitly prohibited in documentation | rejected | Reject hypothesis, form new one |

Additional checks:
- Compare recommended patterns in documentation with current code patterns
- Check for deprecated API usage

### STEP 4: Confirm Root Cause

- Distinguish direct cause vs indirect cause
- Determine exact location to fix
- Evaluate impact scope of fix

### STEP 5: Review Alternatives

- List possible solutions
- Compare pros and cons of each method
- Select optimal fix direction

---

## Output Format

```yaml
analysis:
  error_type: "<TypeError|NetworkError|...>"
  symptoms:
    - "<symptom 1>"
    - "<symptom 2>"
  hypotheses:
    - hypothesis: "<hypothesis 1>"
      likelihood: high|medium|low
    - hypothesis: "<hypothesis 2>"
      likelihood: high|medium|low
  root_cause: "<confirmed root cause>"
  target_files:
    - path: "<file>"
      line: <line>
      reason: "<reason why this file needs modification>"
  impact_scope: "<scope affected by fix>"
  fix_direction: "<selected fix direction>"
  alternatives_considered:
    - "<alternatives reviewed but not selected>"
  libraries_referenced:
    - name: "<library name>"
      version: "<version>"
      docs_consulted: "<documentation section referenced>"
      key_findings: "<key information found in documentation>"
      validation_result: "confirmed|revised|rejected"
```
