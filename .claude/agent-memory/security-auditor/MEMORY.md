# Security Auditor Agent Memory

## Project Security Profile

**Tech Stack**: React Router v7 + React 19 + TypeScript + Cloudflare Workers
**Authentication**: Not yet implemented (planned)
**CMS**: Notion API integration
**Deployment**: Cloudflare Workers (wrangler)

---

## Recurring Security Patterns

### Information Disclosure
- **Pattern**: Development error messages expose raw Error.message and stack traces
- **Location**: `app/root.tsx` ErrorBoundary (lines 84-96)
- **Risk**: DEV mode may leak database URLs, API keys, internal paths
- **Mitigation**: Implement error message sanitization even in DEV mode

### React 19 XSS Prevention
- **Auto-escaping**: React 19 automatically escapes all JSX text content
- **Safe components**: Error components (NotFoundState, ErrorState) are XSS-safe by default
- **Advisory**: Props accepting user input should still use Zod validation for defense-in-depth

---

## Security-Sensitive File Locations

### Error Handling
- `app/root.tsx` - Global ErrorBoundary with conditional debug output
- `app/presentation/components/error/` - Reusable error UI components
- `app/presentation/routes/$.tsx` - 404 catch-all route

### Authentication (Future)
- Not yet implemented - watch for auth logic in future audits

### Environment Configuration
- `import.meta.env.DEV` - Used for conditional debug features
- No `.env` files found in git (good practice)

---

## Common Vulnerability Patterns to Watch

### High Priority
1. **Information Disclosure**: Raw error messages in any user-facing context
2. **Dependency Vulnerabilities**: Check `bun audit` for transitive dependencies (shadcn CLI tools)
3. **XSS in Props**: User-controlled strings passed to components without validation

### Medium Priority
1. **Stack Trace Exposure**: Even in DEV mode, should sanitize paths
2. **Missing Input Validation**: Props that may receive URL params or user input

---

## Dependency Security Notes

### Known Issues (2026-02-05)
- `@isaacs/brace-expansion` <=5.0.0: High severity, transitive from shadcn
- `@modelcontextprotocol/sdk` 1.10.0-1.25.3: High severity, transitive from shadcn
- **Impact**: Dev dependencies only, not runtime vulnerabilities
- **Action**: Run `bun update` to patch

---

## OWASP Compliance Status

| Category | Status | Notes |
|----------|--------|-------|
| A01 - Access Control | Not audited | No auth logic yet |
| A02 - Cryptographic Failures | ✅ Pass | No hardcoded secrets |
| A03 - Injection | ⚠️ Advisory | XSS-safe but add validation |
| A09 - Logging Failures | ⚠️ Issue | Error disclosure in DEV |

---

## Recommended Security Patterns

### Error Message Sanitization
```typescript
const sanitizeErrorMessage = (message: string): string => {
  return message
    .replace(/postgresql:\/\/[^@]+@[^\s]+/g, 'postgresql://[REDACTED]')
    .replace(/api[_-]?key[=:]\s*[^\s]+/gi, 'API_KEY=[REDACTED]')
    .replace(/\/Users\/[^\/]+/g, '/Users/[USER]');
};
```

### Props Validation for User Input
```typescript
import { z } from 'zod';

const ErrorMessageSchema = z.string()
  .max(500)
  .refine((msg) => !/<script|javascript:/i.test(msg));
```

---

## Future Audit Focus Areas

1. **Notion API Integration**: Check for API key handling, rate limiting, input sanitization
2. **Authentication Implementation**: When added, audit for OWASP A01, A07 compliance
3. **Invoice Data Handling**: Ensure proper access control, no IDOR vulnerabilities
4. **PDF Generation**: Check for injection vulnerabilities in PDF rendering
5. **File Upload**: If implemented, audit for malicious file upload protection

---

*Last Updated: 2026-02-05*
*Audit Commit: 259e94a*
