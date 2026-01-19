# Review Report JSON Schema

리뷰 리포트 JSON 파일의 구조 정의.

## 전체 구조

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
      "problem": "any 타입 사용으로 타입 안전성 위반",
      "suggestion": "unknown 타입으로 변경 후 isUser Type Guard 적용",
      "references": [
        ".claude/skills/lib-docs/react/references/components.md"
      ]
    },
    {
      "file": "app/utils/helpers.ts",
      "location": "45:1",
      "severity": "medium",
      "category": "convention",
      "problem": "일반 함수 선언 사용 (function 키워드)",
      "suggestion": "화살표 함수로 변경: export const formatDate = () => { ... }",
      "references": []
    }
  ]
}
```

## 필드 상세 정의

### metadata 객체

| 필드 | 타입 | 설명 |
|------|------|------|
| createdAt | string (ISO 8601) | 리포트 생성 시간 |
| totalIssues | number | 총 이슈 개수 |
| severityCount | object | 심각도별 이슈 개수 |

### severityCount 객체

| 필드 | 타입 | 설명 |
|------|------|------|
| critical | number | 치명적 이슈 개수 |
| high | number | 높은 심각도 이슈 개수 |
| medium | number | 중간 심각도 이슈 개수 |
| low | number | 낮은 심각도 이슈 개수 |

### issues 배열 요소

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| file | string | O | 파일 경로 (프로젝트 루트 기준 상대 경로) |
| location | string | O | "라인:컬럼" 형식 (예: "23:5") |
| severity | string | O | "critical" / "high" / "medium" / "low" |
| category | string | O | 이슈 분류 카테고리 |
| problem | string | O | 문제점 상세 설명 (구체적으로) |
| suggestion | string | O | 수정 제안 (구체적인 코드 또는 방법) |
| references | string[] | X | 참조한 skill 문서 경로 배열 |

## 카테고리 목록

### 코드 리뷰 카테고리

- `type-safety`: any 타입 사용, 제네릭 제약 누락, Type Guard 미사용
- `convention`: 함수 선언 방식, 네이밍 컨벤션, 주석 언어
- `react19`: 불필요한 useCallback/useMemo 사용
- `deprecated-api`: 더 이상 사용되지 않는 API 사용
- `code-quality`: 코드 중복, 복잡도, 테스트 가능성

### 보안 리뷰 카테고리

- `injection`: SQL, XSS, Command, LDAP 인젝션
- `access-control`: 권한 검증 누락, IDOR
- `auth-failure`: 인증 우회, 세션 관리 문제
- `crypto-failure`: 약한 암호화, 하드코딩된 키
- `security-misconfig`: CORS, 헤더, 에러 노출
- `ssrf`: Server-Side Request Forgery
- `data-integrity`: 데이터 무결성 검증 누락

## 예시: 이슈가 없는 경우

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

## 예시: 보안 리뷰

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
      "problem": "사용자 입력이 SQL 쿼리에 직접 삽입됨",
      "suggestion": "파라미터화된 쿼리 또는 ORM 사용",
      "references": [
        ".claude/skills/owasp-top10-2025/references/A05-injection.md"
      ]
    },
    {
      "file": "app/middleware/auth.ts",
      "location": "23:1",
      "severity": "high",
      "category": "access-control",
      "problem": "관리자 엔드포인트에 권한 검증 누락",
      "suggestion": "isAdmin 미들웨어 추가",
      "references": [
        ".claude/skills/owasp-top10-2025/references/A01-broken-access-control.md"
      ]
    }
  ]
}
```
