---
name: tdd
description: "TDD (Test-Driven Development) 규칙과 패턴. 사용 시점: (1) 유닛 테스트 작성, (2) 테스트 대상 결정, (3) TDD 사이클 따르기. Vitest/Jest를 사용하는 Expo, React Native, React Router, NestJS 지원."
---

# TDD Skill

Node/TypeScript/React 프로젝트를 위한 TDD 규칙 및 패턴 정의.

> **Note**: 이 문서는 **규칙과 지침**만 정의합니다. 구체적인 실행 로직과 코드 예제는 `unit-test-writer` 에이전트를 참조하세요.

---

## 테스트 대상 규칙

### 반드시 테스트

| 패턴 | 설명 |
|------|------|
| `*.service.ts` | 서비스 함수 |
| `*.helper.ts`, `*.util.ts` | 헬퍼/유틸리티 함수 |
| `*.tsx` (컴포넌트) | React 컴포넌트 |
| `loader`, `action` | 라우트 로더/액션 |
| `*.schema.ts` | Zod 스키마 |
| `use*.ts` | 커스텀 훅 |

### 테스트 제외

| 패턴 | 이유 |
|------|------|
| `*.d.ts` | 타입 선언만 포함 |
| `**/types.ts`, `**/types/**` | 타입 정의만 포함 |
| `**/*.port.ts` | 인터페이스 정의만 포함 |
| `**/index.ts` | 배럴 파일 (재내보내기) |
| `*.config.ts` | 설정 파일 |
| `**/constants.ts`, `**/const.ts` | 정적 값만 포함 |
| `**/components/ui/**` | shadcn/ui 자동 생성 |
| `**/*.css`, `**/*.scss` | 스타일 파일 |

---

## 네이밍 규칙

소스 → 테스트 경로 매핑:

| 소스 경로 | 테스트 경로 |
|-----------|-------------|
| `app/services/auth.service.ts` | `__tests__/services/auth.service.test.ts` |
| `app/components/Button.tsx` | `__tests__/components/Button.test.tsx` |
| `app/domain/user/user.schema.ts` | `__tests__/domain/user/user.schema.test.ts` |
| `src/utils/format.ts` | `__tests__/utils/format.test.ts` |

**패턴**: 루트 폴더를 `__tests__/`로 교체하고, 확장자 앞에 `.test` 추가.

---

## TDD 사이클

### Red → Green → Refactor

```
1. Red    - 실패하는 테스트 작성
2. Green  - 테스트 통과하는 최소 코드 작성
3. Refactor - 코드 개선 (테스트 유지)
```

### 사이클 상세

**Phase 1: Red**
- 기대 동작을 테스트로 정의
- 테스트 실행 → 반드시 실패 확인

**Phase 2: Green**
- 테스트 통과하는 가장 단순한 코드 작성
- 과도한 설계 금지

**Phase 3: Refactor**
- 중복 제거
- 가독성 개선
- 테스트 재실행 → 통과 확인

---

## AAA 패턴

모든 테스트는 AAA (Arrange-Act-Assert) 패턴을 따릅니다.

| 단계 | 역할 | 예시 |
|------|------|------|
| **Arrange** | 테스트 데이터 및 환경 준비 | 모킹, 입력값 생성 |
| **Act** | 테스트 대상 실행 | 함수 호출, 이벤트 발생 |
| **Assert** | 결과 검증 | expect 문 |

```typescript
it("시나리오 설명", () => {
  // Arrange: 준비
  // Act: 실행
  // Assert: 검증
});
```

---

## 프레임워크별 테스트 환경

| 프레임워크 | 테스트 러너 | 주요 도구 | 비고 |
|-----------|------------|----------|------|
| **Expo** | Jest | jest-expo, @testing-library/react-native | Vitest 미지원 |
| **React Native** | Jest | @testing-library/react-native | Vitest 미지원 |
| **React Router v7** | Vitest/Jest | createRoutesStub, createMemoryRouter | Vitest 권장 |
| **NestJS** | Jest | @nestjs/testing, Test.createTestingModule | Jest 기본 |

### 테스트 러너 선택 기준

- **Expo/React Native**: **Jest 전용** (네이티브 모듈 호환성)
- **React Router v7**: Vitest 권장 (ESM 지원, 빠른 속도)
- **NestJS**: Jest 기본 제공 (공식 지원)

---

## 출력 언어 규칙

| 항목 | 언어 |
|------|------|
| 테스트 설명 (`it`, `describe`) | 한글 |
| 변수/함수명 | 영어 |
| 코드 주석 | 한글 |
| 콘솔 출력 | 한글 |

---

## 품질 체크리스트

테스트 완료 전 확인:

- [ ] 테스트 파일이 네이밍 규칙을 따름
- [ ] 모든 테스트에 한글 설명 포함
- [ ] AAA 패턴 준수
- [ ] `beforeEach`에서 모킹 초기화
- [ ] 테스트 코드에 `any` 타입 없음
- [ ] 모든 테스트 통과
- [ ] 타입 체크 통과
