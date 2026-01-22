# Error Pattern Reference

## Common JavaScript Errors

| Pattern | Cause | Resolution Direction |
|---------|-------|---------------------|
| `Cannot read property 'X' of undefined` | null/undefined reference | Use optional chaining (`?.`) |
| `Cannot read property 'X' of null` | null reference | Add null check or optional chaining |
| `X is not a function` | Calling non-function value | Check type, verify import |
| `X is not defined` | Variable/function not defined | Missing import, check scope |
| `Unexpected token` | Syntax error | JSON parsing error or syntax error |

## Network Errors

| Pattern | Cause | Resolution Direction |
|---------|-------|---------------------|
| `Failed to fetch` | API call failure | Check server status, CORS, URL |
| `NetworkError` | Network connection issue | Check server status, proxy |
| `401 Unauthorized` | Authentication failure | Check token logic, session |
| `403 Forbidden` | No permission | Check user permissions, API key |
| `404 Not Found` | Resource not found | Check URL path, routes |
| `500 Internal Server Error` | Server error | Check server logs |

## React Errors

| Pattern | Cause | Resolution Direction |
|---------|-------|---------------------|
| `Invalid hook call` | Hook rules violation | Call only at component top level |
| `Objects are not valid as a React child` | Rendering object directly | Use JSON.stringify or access properties |
| `Each child should have a unique "key" prop` | Missing key | Add key to list items |
| `Maximum update depth exceeded` | Infinite render loop | Check useEffect dependency array |

## TypeScript Errors

| Pattern | Cause | Resolution Direction |
|---------|-------|---------------------|
| `Type 'X' is not assignable to type 'Y'` | Type mismatch | Fix type definition or cast type |
| `Property 'X' does not exist on type 'Y'` | Property doesn't exist | Extend interface or use type guard |
| `Argument of type 'X' is not assignable` | Argument type mismatch | Check function signature |

## Browser Errors

| Pattern | Cause | Resolution Direction |
|---------|-------|---------------------|
| `CORS policy` | CORS policy violation | Configure server CORS, use proxy |
| `Mixed Content` | Loading HTTP resource on HTTPS | Change URL to HTTPS |
| `Content Security Policy` | CSP violation | Modify CSP header |
