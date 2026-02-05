# Code Reviewer Agent Memory

## Project-Specific Patterns

### Error Handling Components (Added: 2026-02-05)
- **Pattern**: Error state components use shadcn/ui Button with `asChild` pattern
- **Convention**: Component files use kebab-case (e.g., `error-state.tsx`) while component names use PascalCase
- **Accessibility**: Project prioritizes ARIA attributes - `role="alert"` for errors, `role="status"` for informational states
- **Test IDs**: Components use `data-testid` attributes following pattern: `{component-name}-{element-type}` (e.g., `error-state`, `error-icon`)

### React Router v7 Usage
- **Error Boundaries**: Uses `isRouteErrorResponse` from react-router to differentiate route errors
- **Route Props**: Error boundary receives `Route.ErrorBoundaryProps` typed from route files
- **Meta Function**: SEO meta tags defined via `MetaFunction` export from react-router

### CLAUDE.md Convention Clarifications Needed
- **Local Handlers**: Convention states "handlers use arrow functions" but doesn't clarify if this applies to local handlers within component bodies
- **Finding**: Local handlers like `const handleRetry = () => {}` inside components are acceptable and correct, but CLAUDE.md should explicitly state this to avoid confusion

## Common Code Quality Issues

### Type Safety Anti-Patterns to Watch For
1. **Optional Props Without Validation**: When multiple optional props interact (e.g., `actionLabel`, `actionHref`, `onRetry`), use discriminated unions to enforce valid combinations
2. **Duplicated Conditional Logic**: Watch for button label resolution logic scattered across multiple locations - consolidate to single source of truth

### React 19 Compliance
- **Status**: ✅ All reviewed files correctly avoid `useCallback` and `useMemo`
- **Trust the Compiler**: Project properly relies on React 19 compiler for optimization

## Recurring Suggestions

### Documentation Patterns
- **Complex Prop Interactions**: When props have interdependencies, add JSDoc comments explaining valid combinations
- **Deprecation Notices**: Use detailed JSDoc with `@deprecated` tag and migration examples (see `not-found.tsx`)

### Test Maintainability
- **Test ID Constants**: Consider extracting `data-testid` values to constants for easier test maintenance (low priority)
- **Pattern**: `export const TEST_IDS = { COMPONENT_NAME: 'value' } as const`

## Files to Monitor

### Frequently Modified Components
- `app/root.tsx` - Error boundary may need updates as error handling evolves
- `app/presentation/components/error/` - New error handling pattern directory

### Convention-Critical Files
- `CLAUDE.md` - May need updates to clarify local vs exported function conventions
- `docs/PROJECT-STRUCTURE.md` - Reference for architectural decisions

## Review Efficiency Notes

### Files to Exclude (Already Verified)
- Barrel exports (`index.ts`) - minimal logic, just re-exports
- Files matching exclusion patterns work correctly

### Quick Checks
1. **React 19**: Search for `useCallback` and `useMemo` first
2. **Type Safety**: Look for optional props with complex interactions
3. **ARIA**: Verify `role` and `aria-live` on error/status components
4. **Component Export**: Verify `export default function` for components

## Architectural Insights

### Clean Architecture Adherence
- **Presentation Layer**: Error components correctly isolated in `presentation/components/error/`
- **No Domain Logic**: Components are pure UI with props, no business logic
- **Reusability**: New error components designed for reuse across application

### Design System Integration
- **shadcn/ui**: Properly uses Button component with `asChild` pattern
- **Tailwind**: Effective use of design tokens (`muted`, `foreground`, `muted-foreground`)
- **Theme Support**: Components respect dark mode via Tailwind classes

## Success Metrics

### Review Session 2026-02-05
- **Files Reviewed**: 6
- **Issues Found**: 7 (0 Critical, 0 High, 3 Medium, 4 Low)
- **Code Quality Grade**: HIGH ✅
- **React 19 Compliance**: 100% ✅
- **CLAUDE.md Adherence**: 95% (minor clarification needed)
