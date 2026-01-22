# Review Report JSON Schema

Structure definition for review report JSON files.



## Field Detailed Definitions

### metadata Object

| Field | Type | Description |
|-------|------|-------------|
| createdAt | string (ISO 8601) | Report creation time |
| totalIssues | number | Total number of issues |
| severityCount | object | Issue count by severity |

### severityCount Object

| Field | Type | Description |
|-------|------|-------------|
| critical | number | Number of critical issues |
| high | number | Number of high severity issues |
| medium | number | Number of medium severity issues |
| low | number | Number of low severity issues |

### issues Array Elements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | string | Yes | File path (relative to project root) |
| location | string | Yes | "line:column" format (e.g., "23:5") |
| severity | string | Yes | "critical" / "high" / "medium" / "low" |
| category | string | Yes | Issue classification category |
| problem | string | Yes | Detailed problem description (specific) |
| suggestion | string | Yes | Fix suggestion (specific code or method) |
| references | string[] | No | Array of referenced skill document paths |

## Category List

### Code Review Categories

- `type-safety`: any type usage, missing generic constraints, unused Type Guards
- `convention`: Function declaration style, naming conventions, comment language
- `react19`: Unnecessary useCallback/useMemo usage
- `deprecated-api`: Usage of deprecated APIs
- `code-quality`: Code duplication, complexity, testability

### Security Review Categories

- `injection`: SQL, XSS, Command, LDAP injection
- `access-control`: Missing authorization checks, IDOR
- `auth-failure`: Authentication bypass, session management issues
- `crypto-failure`: Weak encryption, hardcoded keys
- `security-misconfig`: CORS, headers, error exposure
- `ssrf`: Server-Side Request Forgery
- `data-integrity`: Missing data integrity verification

## Example: No Issues Found

```json
{
  "metadata": {
    "createdAt": "2026-01-19T15:30:00.000Z",
    "totalIssues": 0,
    "severityCount": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    }
  },
  "issues": []
}
```

## Example: Code Quality Review

```json
{
  "metadata": {
    "createdAt": "2026-01-19T15:30:00.000Z",
    "totalIssues": 3,
    "severityCount": {
      "critical": 0,
      "high": 1,
      "medium": 2,
      "low": 0
    }
  },
  "issues": [
    {
      "file": "app/components/UserProfile.tsx",
      "location": "23:5",
      "severity": "high",
      "category": "type-safety",
      "problem": "Type safety violation due to any type usage",
      "suggestion": "Change to unknown type and apply isUser Type Guard",
      "references": [
        "[mcp library name 1]",
        "[mcp library name 2]"
      ]
    },
    {
      "file": "app/utils/helpers.ts",
      "location": "45:1",
      "severity": "medium",
      "category": "convention",
      "problem": "Using regular function declaration (function keyword)",
      "suggestion": "Change to arrow function: export const formatDate = () => { ... }",
      "references": []
    }
  ]
}
```

## Example: Security Review

```json
{
  "metadata": {
    "createdAt": "2026-01-19T16:00:00.000Z",
    "totalIssues": 2,
    "severityCount": {
      "critical": 1,
      "high": 1,
      "medium": 0,
      "low": 0
    }
  },
  "issues": [
    {
      "file": "app/api/users.ts",
      "location": "78:3",
      "severity": "critical",
      "category": "injection",
      "problem": "User input directly inserted into SQL query",
      "suggestion": "Use parameterized queries or ORM",
      "references": [
        ".claude/skills/owasp-top10-2025/references/A05-injection.md"
      ]
    },
    {
      "file": "app/middleware/auth.ts",
      "location": "23:1",
      "severity": "high",
      "category": "access-control",
      "problem": "Missing authorization check on admin endpoint",
      "suggestion": "Add isAdmin middleware",
      "references": [
        ".claude/skills/owasp-top10-2025/references/A01-broken-access-control.md"
      ]
    }
  ]
}
```
