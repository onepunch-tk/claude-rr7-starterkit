# Performance Analyzer Agent Memory

## Project-Specific Context

**Tech Stack**: React 19 + React Router v7 + TypeScript + Tailwind CSS v4 + shadcn/ui

**Critical Convention**: This project uses React 19 with the React Compiler. Manual `useCallback` and `useMemo` are **STRICTLY PROHIBITED** unless empirically proven necessary.

## Established Performance Baselines

### Error Boundary Components
- **Expected Impact**: Negligible (not hot paths - only render on errors)
- **Acceptable Bundle Size**: 3-5KB for complete error handling system
- **SSR Requirements**: Must be fully SSR-compatible (no client-only APIs)
- **Time Complexity**: O(1) for error state components (static rendering)

### Component Categories by Performance Priority

**Hot Path Components** (high priority optimization):
- List/table components with data iteration
- Components rendered in loops
- High-frequency re-render components (form inputs, animations)

**Cold Path Components** (low priority optimization):
- Error boundaries and error states
- Modal/dialog components
- One-time render layouts

## Common Performance Patterns

### React 19 Optimization Strategy
1. **Trust the Compiler**: React 19 compiler handles most optimizations automatically
2. **Avoid Manual Memoization**: Only use when empirically proven necessary
3. **Focus on Architecture**: State colocation, component composition, proper data fetching

### Bundle Size Best Practices
- lucide-react icons: Use named imports (tree-shakeable), ~0.5-1KB per icon
- shadcn/ui components: Already optimized, minimal bundle impact
- Critical components (errors, layouts): Keep in main bundle for reliability

### SSR Compatibility Checklist
- ✅ No `window`, `document`, or browser-only APIs in component body
- ✅ Use `import.meta.env.DEV` for dev-only features (vite handles this correctly)
- ✅ Avoid `useEffect` for critical rendering logic

## Performance Issues by Severity

### Critical (Must Fix Before Merge)
- Memory leaks (uncleaned intervals, subscriptions)
- Unbounded array/object growth
- O(n²) or higher algorithms in hot paths
- N+1 query patterns

### High (Should Fix Before Merge)
- Missing pagination for large lists
- Over-fetching data (retrieve unused fields)
- Missing virtualization for long lists (>100 items)
- Unnecessary API calls in loops

### Medium (Can Defer with Justification)
- Function recreation in cold path components
- Minor conditional logic complexity
- Missing cache opportunities (non-critical data)

### Low (Optional)
- Documentation improvements
- Style/readability optimizations in performant code
- Premature optimizations

## Anti-Patterns Detected

### Function Definitions
❌ **Avoid**: Handler functions defined inside components that are only used once
```typescript
// Inside ErrorBoundary
const handleRetry = () => {
  window.location.reload();
};
```

✅ **Prefer**: Inline handlers for simple operations or module-level constants
```typescript
// Inline
<Button onClick={() => window.location.reload()}>Retry</Button>

// Or module-level if reused
const reloadPage = () => window.location.reload();
```

**Rationale**: In React 19, the compiler optimizes most cases. Function recreation in cold paths (error boundaries) has negligible impact. Focus on readability.

## Bundle Size Analysis Methodology

1. **Measure New Dependencies**: Check if new imports add to bundle
2. **Verify Tree-Shaking**: Ensure ES modules with named imports
3. **Icon Libraries**: lucide-react is tree-shakeable (use named imports)
4. **Critical vs Code-Split**: Error handling must be in main bundle

## Lessons Learned

### 2026-02-05: Error Component Performance Analysis
- Error boundary components are cold paths (only render on errors)
- Even with minor inefficiencies (function recreation), performance impact is negligible
- Focus on SSR compatibility and accessibility over micro-optimizations
- React 19 compiler eliminates need for manual memoization in presentational components
- Bundle size impact for error handling (~3KB) is acceptable and necessary for reliability

### Component Design Principles
- **Pure Presentational Components**: No side effects, fully SSR-compatible
- **Type Safety**: Always use TypeScript interfaces, avoid `any`
- **Accessibility First**: Proper ARIA attributes in error states
- **Convention Over Configuration**: Follow project's React 19 patterns

## Tools and Commands

### Performance Profiling
```bash
# Bundle analysis (when needed)
bun run build && ls -lh dist/client/**/*.js

# Test performance
bun test -- --run performance

# Check for memory leaks in tests
bun test -- --run --reporter=verbose
```

### Performance Metrics to Track
- Time Complexity: O(1), O(n), O(n log n), O(n²), etc.
- Space Complexity: Memory footprint per component instance
- Bundle Size: gzipped size of new code
- SSR Compatibility: Server-render time impact
- Re-render Frequency: How often component updates

## Next Steps

When analyzing future components:
1. Classify as hot path or cold path
2. Verify React 19 convention compliance (no manual memoization)
3. Check SSR compatibility
4. Measure bundle size impact for new dependencies
5. Focus on algorithmic complexity for data processing logic
6. Prioritize issues by real-world impact, not theoretical concerns
