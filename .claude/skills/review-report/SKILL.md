---
name: review-report
description: "코드 리뷰 및 보안 리뷰 결과를 JSON 파일로 저장하는 범용 리포트 스킬. 디렉토리로 리뷰 유형 구분 (reports/code-review/, reports/security-review/). 스크립트 자동 호출로 JSON 파일 생성. code-reviewer, security-reviewer 에이전트가 리뷰 완료 후 사용."
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash(python:*)
---

# Review Report

리뷰 결과를 구조화된 JSON 파일로 저장하는 범용 스킬.

## 핵심 기능

1. **JSON 형식 리포트 생성**: 구조화된 이슈 목록 저장
2. **디렉토리 기반 분류**: 리뷰 유형별 자동 분류
3. **스크립트 자동 호출**: 토큰 절약을 위한 Python 스크립트 활용

---

## 리포트 생성 절차

이 skill을 사용하여 리포트를 생성하려면 다음 단계를 따르세요:

### 1단계: 이슈 데이터 정리

발견된 이슈들을 JSON 배열로 정리합니다:

```json
[
  {
    "file": "app/components/example.tsx",
    "location": "23:5",
    "severity": "high",
    "category": "type-safety",
    "problem": "any 타입 사용으로 타입 안전성 위반",
    "suggestion": "unknown 타입으로 변경 후 Type Guard 적용"
  }
]
```

### 2단계: 스크립트 실행

Bash 도구로 다음 명령을 실행합니다:

```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output <디렉토리> \
  --issues '<JSON 배열>'
```

**출력 디렉토리:**
- 코드 리뷰: `reports/code-review`
- 보안 리뷰: `reports/security-review`

**예시 (코드 리뷰):**
```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output reports/code-review \
  --issues '[{"file":"app/components/Button.tsx","location":"15:3","severity":"high","category":"type-safety","problem":"any 타입 사용","suggestion":"unknown 사용 권장"}]'
```

**이슈가 없는 경우:**
```bash
python .claude/skills/review-report/scripts/generate_report.py \
  --output reports/code-review \
  --issues '[]'
```

### 3단계: 결과 확인

실행 후 "리포트 생성 완료" 메시지와 파일 경로를 확인합니다.

추가로 파일 생성 여부를 확인합니다:
```bash
ls -la reports/code-review/*.json | tail -1
```

---

## 이슈 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| file | O | 파일 경로 |
| location | O | 라인:컬럼 (예: "23:5") |
| severity | O | critical / high / medium / low |
| category | O | 이슈 분류 (type-safety, convention, security 등) |
| problem | O | 문제점 상세 설명 |
| suggestion | O | 수정 제안 |
| references | X | 참조한 문서 경로 배열 (선택사항) |

---

## 심각도 기준

- **critical**: 런타임 에러, 보안 취약점 (즉시 수정 필요)
- **high**: 타입 안전성, 주요 컨벤션 위반
- **medium**: 코드 품질, 성능 개선 권장
- **low**: 스타일, 문서화 권장

---

## 리뷰 유형별 카테고리

### 코드 리뷰 (reports/code-review/)

- `type-safety`: 타입 안전성 (any 사용, 제네릭 제약 누락 등)
- `convention`: 코드 컨벤션 (함수 선언 방식, 네이밍 등)
- `react19`: React 19 최적화 규칙 (불필요한 메모이제이션 등)
- `deprecated-api`: 더 이상 사용되지 않는 API
- `code-quality`: 코드 품질 (중복, 복잡도 등)

### 보안 리뷰 (reports/security-review/)

- `injection`: 인젝션 취약점 (SQL, XSS, Command 등)
- `access-control`: 접근 제어 문제
- `auth-failure`: 인증/세션 관리 문제
- `crypto-failure`: 암호화 관련 문제
- `security-misconfig`: 보안 설정 오류

---

## 파일명 규칙

`{8자리_랜덤해시}_{YYYYMMDD}.json`

예: `a1b2c3d4_20260119.json`

---

## JSON 이스케이프 주의사항

- 작은따옴표(')가 JSON 내부에 있으면 `'\''`로 이스케이프
- 큰따옴표(")는 JSON 표준이므로 그대로 사용
- 한글 문자열은 그대로 사용 가능

---

## 참고 자료

- JSON 스키마 상세: `references/json-schema.md`
- 보안 리뷰 참조: `.claude/skills/owasp-top10-2025/references/`
