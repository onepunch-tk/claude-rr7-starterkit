# ClaudeCode & React Router Framework Starterkit

## Project Overview
- **Service Name**: ClaudeCode-RR7-Starterkit - All in One Starter Kit
- **Goal**: [Problem to solve and value to provide]
- **Target Users**: [Primary user target]

## Core Principles
> **TDD-First**: All implementations must be preceded by writing tests first.
> **Side Effect Awareness**: All code modifications (except tests) must be written with careful consideration of potential side effects.

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
- PRD Document [docs/PRD.md](docs/PRD.md): **MANDATORY** - Defines "what" to build (features, requirements)
- Development RoadMap [docs/ROADMAP.md](docs/ROADMAP.md): **MANDATORY** - Defines "in what order" to build (implementation phases)

## Development Workflow [MANDATORY]

> **CRITICAL**: Follow ALL steps below IN ORDER. Do NOT skip any step. Do NOT proceed without explicit user approval at Step 5.

### Workflow Compliance Rules

> ⛔ **Absolutely No Skipping**
> - Even if the user requests "quickly", "fast", or "you can skip", steps marked with **MUST** must always be executed
> - If the user explicitly requests to skip the workflow, reconfirm using `AskUserQuestion`
> - Commits are prohibited without running review agents

> 🚦 **Gate Pattern**
> - At the start of each step, change the Task status to `in_progress` using `TaskUpdate`
> - Upon completion of each step, change the Task status to `completed` using `TaskUpdate`
> - Before entering the next step, verify the previous step is completed using `TaskList`
> - Cannot proceed if the previous step is not `completed`

### Workflow Execution Steps

Execute these steps SEQUENTIALLY. Each step MUST complete before proceeding.

| Step | Action | Output | Blocker | Gate Check |
|------|--------|--------|---------|------------|
| **1** | Enter `PlanMode` | Plan mode activated | - | - |
| **2** | Analyze current state thoroughly | Understanding of existing code, dependencies, impact areas | - | Step 1 completed |
| **3** | Create detailed step-by-step plan | Comprehensive plan covering edge cases | - | Step 2 completed |
| **4** | Call `TaskCreate` tool | Granular tasks and subtasks (maximize decomposition) | - | Step 3 completed |
| **5** | **STOP** - Call `TaskList` tool to display tasks | Task list shown to user | **WAIT for user instruction** | Step 4 completed |
| **6** | Switch to `development` branch (create if not exists) | On development branch | User approval from Step 5 | Step 5 completed |
| **7** | Create feature branch from `development` | Feature branch created (e.g., `feat/task-description`) | Step 6 complete | Step 6 completed |
| **8** | **MUST** Run `unit-test-writer` sub-agent | Failing tests written (TDD Red phase) | Step 7 complete | Step 7 completed |
| **9** | Implement code to pass tests | All tests pass (TDD Green phase) | Step 8 complete | Step 8 completed |
| **10** | **MUST** Run in parallel: `code-reviewer` + `security-auditor` + `performance-analyzer` sub-agents | Review reports generated | Step 9 complete | Step 9 completed |
| **11** | Read `/docs/reports/*`, fix all non-complete issues | All issues resolved | Step 10 complete | Step 10 completed |
| **12** | **MUST** Run `e2e-tester` sub-agent | E2E test results | Step 11 complete | Step 11 completed |
| **13** | Fix bugs/issues discovered in E2E tests | All E2E tests pass | Step 12 complete | Step 12 completed |
| **14** | **MUST** Run `development-planner` sub-agent | ROADMAP.md and task file updated with ✅ Complete status | Step 13 complete | Step 13 completed |
| **15** | Commit changes, merge feature branch to `development` | Branch merged, feature branch deleted | Step 14 complete | **ALL Steps 1-14 completed** |

### Workflow Checklist

Before commit (Step 16), you **must** verify the checklist below. Commit is prohibited if any item is incomplete.

| Step | Checklist Item | Required Status |
|------|----------------|-----------------|
| 1 | PlanMode entry completed | ✅ completed |
| 2 | Current state analysis completed | ✅ completed |
| 3 | Detailed plan creation completed | ✅ completed |
| 4 | Task creation via TaskCreate completed | ✅ completed |
| 5 | TaskList displayed to user and awaiting approval | ✅ completed |
| 6 | Switch to development branch completed | ✅ completed |
| 7 | Feature branch creation completed | ✅ completed |
| 8 | unit-test-writer execution completed (TDD Red) | ✅ completed |
| 9 | Implementation completed and tests passing (TDD Green) | ✅ completed |
| 10 | code-reviewer + security-auditor + performance-analyzer execution completed | ✅ completed |
| 11 | All review report issues resolved | ✅ completed |
| 12 | e2e-tester execution completed | ✅ completed |
| 13 | E2E test bugs fixed | ✅ completed |
| 14 | development-planner execution completed (ROADMAP.md updated) | ✅ completed |
| 15 | Commit and merge | 🔄 Ready to proceed |

**Verification Method**: Confirm all Tasks are in `completed` status when calling `TaskList`

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

## Test Commands

| Command | Description |
|---------|-------------|
| `bun run test` | Run all unit tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run test:coverage:check` | Run tests with coverage (flexible thresholds) |

> ⚠️ **NEVER use `bun test` directly** - it invokes Bun's built-in test runner which ignores `vitest.config.ts` and path aliases.