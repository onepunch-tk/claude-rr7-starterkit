---
name: review-report
description: "A universal report skill for saving code review and security review results as JSON files. Differentiates review types by directory (reports/code-review/, reports/security-review/). Generates JSON files via automatic script invocation. Used by code-reviewer and security-reviewer agents after review completion."
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# Review Report

A universal skill for saving review results as structured JSON files.

## Core Features

1. **JSON format report generation**: Saves structured issue lists
2. **Directory-based classification**: Automatic classification by review type
3. **Automatic script invocation**: Uses Python script for token efficiency

---

## Report Generation Procedure

Follow these steps to generate a report using this skill:

### Step 1: Organize Issue Data

Organize discovered issues as a JSON array:

```json
[
  {
    "file": "app/components/example.tsx",
    "location": "23:5",
    "severity": "high",
    "category": "type-safety",
    "problem": "Type safety violation due to any type usage",
    "suggestion": "Change to unknown type and apply Type Guard"
  }
]
```

### Step 2: Execute Script

Execute the following command using the Bash tool:

```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output <directory> \
  --issues '<JSON array>'
```

**Output directories:**
- Code review: `reports/code-review`
- Security review: `reports/security-review`

**Example (code review):**
```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output reports/code-review \
  --issues '[{"file":"app/components/Button.tsx","location":"15:3","severity":"high","category":"type-safety","problem":"any type usage","suggestion":"Use unknown instead"}]'
```

**If no issues found:**
```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output reports/code-review \
  --issues '[]'
```

### Step 3: Verify Results

After execution, confirm the "Report generated successfully" message and file path.

Additionally, verify file creation:
```bash
ls -la reports/code-review/*.json | tail -1
```

---

## Issue Field Description

| Field | Required | Description |
|-------|----------|-------------|
| file | O | File path |
| location | O | Line:column (e.g., "23:5") |
| severity | O | critical / high / medium / low |
| category | O | Issue classification (type-safety, convention, security, etc.) |
| problem | O | Detailed problem description |
| suggestion | O | Fix suggestion |
| references | X | Array of referenced document paths (optional) |

---

## Severity Criteria

- **critical**: Runtime errors, security vulnerabilities (immediate fix required)
- **high**: Type safety, major convention violations
- **medium**: Code quality, performance improvement recommendations
- **low**: Style, documentation recommendations

---

## Categories by Review Type

### Code Review (reports/code-review/)

- `type-safety`: Type safety (any usage, missing generic constraints, etc.)
- `convention`: Code conventions (function declaration style, naming, etc.)
- `react19`: React 19 optimization rules (unnecessary memoization, etc.)
- `deprecated-api`: Deprecated APIs
- `code-quality`: Code quality (duplication, complexity, etc.)

### Security Review (reports/security-review/)

- `injection`: Injection vulnerabilities (SQL, XSS, Command, etc.)
- `access-control`: Access control issues
- `auth-failure`: Authentication/session management issues
- `crypto-failure`: Cryptography-related issues
- `security-misconfig`: Security configuration errors

---

## Filename Convention

`{8-char_random_hash}_{YYYYMMDD}.json`

Example: `a1b2c3d4_20260119.json`

---

## JSON Escape Notes

- Single quotes (') inside JSON should be escaped as `'\''`
- Double quotes (") are JSON standard, use as-is
- Korean characters can be used directly

---

## References

- JSON schema details: `references/json-schema.md`
- Security review reference: `.claude/skills/owasp-top10-2025/references/`
