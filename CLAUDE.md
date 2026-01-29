# ClaudeCode & React Router Framework Staterkit

## 프로젝트 개요
- **서비스명**: ClaudeCode-RR7-Starterkit - All in One 스타터킷
- **목표**: [해결고자 하는 문제와 제공하는 가치]
- **대상**: [주요 사용자 타겟]

## 기술 스택
- **Package Manager**
  - bun
- **Language**: TypeScript
- **백엔드 & SSR 프론트**
  - **basic** React Router Framework Mode v7+
  - **node 기반(사용자 선택)**
    - express/fastify + React Router Framework Mode v7+
- **UI**
  - shadcn/ui
  - tailwind css v4+
- **인증**
  - better-auth v1.4+
- **DB·파일 저장**
  - Supabase
- **배포(사용자 선택)**
  - **node**: Docker Compose (Docker, nginx Docker로 구성)
  - **Cloudflare**: wrangler
- **lint & formatter**
  - biome

## 핵심 문서
- 프로젝트 구조 [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md): **YOU MUST** 모든 작업 전에 반드시 참조
- 빈번한 실수와 해결 방법 기억 [docs/NOTE.md](docs/NOTE.md): **YOU MUST** 테스트를 통해 코드 수정 작업 후 자주 실수하는 항목은 이 파일에 기재하여 실수를 반복하지 않도록 함

## 공통 작업 가이드 
### 개발 프로세스
- 모든 작업은 **MUST** `PlanMode`로 진행하세요.
- 모든 작업은 **MUST** TDD 기반(**Services Logic** / **Handlers** / **Libs** / **Helpers** / **Utils** / **Components** / **Routes Page Components** / **Etc Function**)으로 `unit-test-writer` sub agent를 실행하여 테스트코드를 먼저 작성하고 실제 코드를 구현하세요.
- 모든 작업은
  1. 먼저 현재 상태를 철저히 분석하고,
  2. 단계별로 생각하여 철저하게 계획을 세우고,
  3. **MUST** `TaskCreate` Tool 을 호출하여 **최대한 단계별로 세분화**하여 Task, SubTask를 만드세요.
  4. Task 생성이 완료되면 **MUST** 절대 혼자 작업을 진행하지말고 생성된 Task 목록을 사용자에게 보여주고 Task 작업 지시를 기다리세요!!
  5. 모든 코드 작업은 **side effect**를 고려하여 신중하게 코드 작업을 진행합니다.
  6. 작업 지시를 받고 코드 완성 후에는 바로 종료하지말고, `code-reviewer` `security-code-reviewer`  sub agent를 백그라운드에서 병렬로 실행하세요.
  7. 코드 품질 리뷰와 보안 코드 리뷰가 완료되면 `/docs/reports`의 report 파일들을 분석하여 `status:complate` 가 아닌 이슈들을 확인하여 수정하세요.
  8. 모든 작업 완료 후 빈번한 실수와 해결 방법은 `/docs/NOTE.md`에 반영하여 다음 작업 시 참조할 수 있도록 하세요.

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

## 파일 생성 규칙
| Pattern | Reason |
|---------|--------|
| `*.d.ts` | Type declarations only |
| `**/types.ts`, `**/types/**` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.config.ts` | Configuration files |
| `**/constants.ts`, `**/const.ts` | Static values only |
| `**/*.css`, `**/*.scss` | Style files |
