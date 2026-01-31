# ClaudeCode & React Router Framework Starterkit

## Project Overview
- **Service Name**: ClaudeCode-RR7-Starterkit - All in One Starter Kit
- **Goal**: [Problem to solve and value to provide]
- **Target Users**: [Primary user target]

## Core Principles
> **TDD-First**: All implementations must be preceded by writing tests first.

## Tech Stack
- **Package Manager**
  - bun
- **Language**: TypeScript
- **Backend & SSR Frontend**
  - **basic** React Router Framework Mode v7+
  - **node-based (user choice)**
    - express/fastify + React Router Framework Mode v7+
- **UI**
  - shadcn/ui
  - tailwind css v4+
- **Authentication**
  - better-auth v1.4+
- **DB & File Storage**
  - Supabase
- **Deployment (user choice)**
  - **node**: Docker Compose (Docker + nginx Docker)
  - **Cloudflare**: wrangler
- **Lint & Formatter**
  - biome

## Critical Documents
- Project Structure [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md): **MANDATORY** - Reference before ANY task
- Common Mistakes & Solutions [docs/NOTE.md](docs/NOTE.md): **MANDATORY** - Record frequent mistakes after code modifications to prevent repetition

## Development Workflow [MANDATORY]

> **CRITICAL**: Follow ALL steps below IN ORDER. Do NOT skip any step. Do NOT proceed without explicit user approval at Step 5.

### Workflow Execution Steps

Execute these steps SEQUENTIALLY. Each step MUST complete before proceeding.

| Step | Action | Output | Blocker |
|------|--------|--------|---------|
| **1** | Enter `PlanMode` | Plan mode activated | - |
| **2** | Analyze current state thoroughly | Understanding of existing code, dependencies, impact areas | - |
| **3** | Create detailed step-by-step plan | Comprehensive plan covering edge cases | - |
| **4** | Call `TaskCreate` tool | Granular tasks and subtasks (maximize decomposition) | - |
| **5** | **STOP** - Display task list to user | Task list shown | **WAIT for user instruction** |
| **6** | Run `unit-test-writer` sub-agent | Failing tests written (TDD Red phase) | User approval from Step 5 |
| **7** | Implement code to pass tests | All tests pass (TDD Green phase) | Step 6 complete |
| **8** | Run background agents in parallel: `code-reviewer` + `security-code-reviewer` | Review reports generated | Step 7 complete |
| **9** | Read `/docs/reports/*`, fix all non-complete issues | All issues resolved | Step 8 complete |
| **10** | Run `e2e-tester` sub-agent | E2E tests pass | Step 9 complete |
| **11** | Update `/docs/NOTE.md` with lessons learned | Knowledge documented | Step 10 complete |

### Critical Checkpoints

```
IF Step 4 (TaskCreate) complete:
  → MUST show task list to user
  → MUST wait for explicit user instruction
  → DO NOT auto-execute any task

IF Step 8 (code review) complete:
  → MUST read all report files in /docs/reports/
  → MUST fix issues where status != "complete"
  → THEN proceed to Step 10

IF any step fails:
  → STOP execution
  → Report failure to user
  → WAIT for user instruction
```

## Code Conventions [MANDATORY]
### React 19 Optimization & Performance [STRICT]
- **Trust React Compiler**: Since the project uses React 19, the compiler automatically handles rendering optimization. **The use of `useCallback` and `useMemo` is strictly prohibited unless absolutely necessary.**
- **Manual Optimization Restrictions**:
  - **DO NOT** use `useCallback` or `useMemo` by default.
  - Exceptions are granted **ONLY** when performance degradation is empirically proven or computational costs are extremely high.
  - Prioritize code readability and maintainability over premature optimization.

### Function Definition Principles
- **General Functions (Logic, Utils, Handlers, Libs)**:
  - **MUST**: Use **Arrow Functions**.
  - Format: `export const functionName = () => { ... }`
- **React Components**:
  - **MUST**: Use **`export default function`**.
  - Format: `export default function ComponentName() { ... }`

### Type Safety Principles
- **NO `any`**: The explicit use of the `any` type is **strictly prohibited** in all cases.
  - If an external library returns `any`, cast it to `unknown` first, then narrow it down.
- **Use `unknown`**: When the shape of data is uncertain, use `unknown`.
  - **MUST**: Validate data using **Type Guards**, **Zod**, or the **`is`** keyword before using it.

### Generics Usage
- **Constraints**: When using Generics (`T`), always enforce constraints using `extends` to ensure type safety.
  - *Bad*: `const functionName = <T>(arg: T) => { ... }`
  - *Good*: `const functionName = <T extends Record<string, unknown>>(arg: T) => { ... }`
- **Defaults**: Provide safe default types for generics if necessary.

## File Creation Rules
| Pattern | Reason |
|---------|--------|
| `*.d.ts` | Type declarations only |
| `**/types.ts`, `**/types/**` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.config.ts` | Configuration files |
| `**/constants.ts`, `**/const.ts` | Static values only |
| `**/*.css`, `**/*.scss` | Style files |
