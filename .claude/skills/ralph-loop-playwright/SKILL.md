---
name: ralph-loop-playwright
description: |
  자동화된 디버깅 루프 스킬. Playwright MCP와 연동하여 웹/앱 오류를 자동으로 수집, 분석, 해결, 테스트하는 4단계 반복 워크플로우.
  사용 시점: (1) 웹앱/모바일앱 오류 자동 디버깅, (2) E2E 테스트 실패 원인 분석 및 해결, (3) UI 버그 자동 수정, (4) 반복적인 오류 해결 작업 자동화, (5) 로그인/인증 관련 오류 디버깅.
  트리거: "오류 해결해줘", "버그 고쳐줘", "디버깅 루프 실행", "ralph-loop", "자동 디버깅", "로그인 에러 수정"
argument-hint: [goal] [url] [max] [email] [password]
allowed-tools: Read, Write, Bash, mcp__playwright
---

# Ralph-Loop Playwright 디버깅 스킬

## 개요

4단계 반복 디버깅 루프를 통해 오류를 자동으로 해결하는 스킬.

## 파라미터

| 파라미터 | 필수 | 타입 | 설명 |
|---------|------|------|------|
| `goal` | ✅ | string | 해결하고자 하는 문제 또는 달성 목표 |
| `max` | ❌ | number | 최대 루프 횟수 (미지정시 goal 달성까지 무한 반복) |
| `url` | ❌ | string | 테스트 대상 URL (웹앱인 경우) |
| `credentials` | ❌ | object | 인증 정보 (로그인이 필요한 경우) |

### credentials 구조

```json
{
  "credentials": {
    "email": "<user-email>",
    "password": "<user-password>",
    "username": "<user-name>",
    "phone": "<phone-number>",
    "otp": "<otp-code>",
    "custom": {
      "<field-name>": "<field-value>"
    }
  }
}
```

## 워크플로우

```
┌─────────────────────────────────────────────────┐
│                  RALPH-LOOP                      │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ 1. 수집  │ -> │ 2. 분석  │ -> │ 3. 해결  │  │
│  └──────────┘    └──────────┘    └──────────┘  │
│       ^                               │         │
│       │         ┌──────────┐          │         │
│       └─────────│ 4. 테스트│<─────────┘         │
│                 └──────────┘                    │
│                      │                          │
│              goal 달성? ──> 종료                │
└─────────────────────────────────────────────────┘
```

### 1단계: 오류 수집 (Collect)

Playwright MCP 도구를 사용하여 오류 정보 수집.

**필수 수집 항목:**

```javascript
// 1-1. 콘솔 에러 수집
{ 
  name: 'browser_console_messages', 
  arguments: { 
    onlyErrors: true 
  } 
}

// 1-2. 페이지 접근성 스냅샷 (요소 ref 획득)
{ 
  name: 'browser_snapshot', 
  arguments: {} 
}

// 1-3. 현재 화면 스크린샷
{ 
  name: 'browser_take_screenshot', 
  arguments: { 
    fullPage: true, 
    filename: 'error-state.png' 
  } 
}

// 1-4. 네트워크 요청 실패 확인
{ 
  name: 'browser_network_requests', 
  arguments: {} 
}
```

**수집 결과 포맷:**

```yaml
collected_data:
  console_errors:
    - type: error
      message: "<error-message>"
      source: "<file>:<line>"
  network_failures:
    - url: "<request-url>"
      status: <status-code>
      method: "<HTTP-method>"
  page_snapshot:
    url: "<current-url>"
    title: "<page-title>"
    elements: "<accessibility-tree>"
  screenshot: "<filepath>"
```

### 2단계: 원인 분석 (Analyze)

수집된 정보를 기반으로 오류 원인 분석.

**분석 프로세스:**

```
1. 에러 메시지 파싱
   ├── 스택 트레이스에서 파일/라인 추출
   ├── 에러 타입 분류 (TypeError, NetworkError, SyntaxError 등)
   └── 관련 변수/함수 식별

2. 패턴 매칭
   ├── 알려진 오류 패턴과 비교
   ├── 유사 오류 해결 사례 참조
   └── 프레임워크별 일반적인 이슈 확인

3. 컨텍스트 분석
   ├── 관련 소스 코드 파일 검토
   ├── 의존성 및 import 확인
   └── 환경 설정 검토

4. 근본 원인 식별
   ├── 직접 원인 vs 간접 원인 구분
   ├── 영향 범위 파악
   └── 수정 우선순위 결정
```

**분석 결과 포맷:**

```yaml
analysis_result:
  error_type: "<error-classification>"
  root_cause: "<identified-cause>"
  affected_files:
    - path: "<file-path>"
      line: <line-number>
      code: "<problematic-code>"
  related_components:
    - "<component-name>"
  suggested_fix:
    description: "<fix-description>"
    confidence: <0-100>
    complexity: "<low|medium|high>"
```

### 3단계: 오류 해결 (Fix)

분석 결과를 바탕으로 코드 수정.

**수정 프로세스:**

```
1. 수정 대상 파일 열기
   └── 분석에서 식별된 affected_files 기반

2. 수정 사항 적용
   ├── 최소 변경 원칙 준수
   ├── 기존 코드 스타일 유지
   └── 부작용 최소화

3. 변경 내용 검증
   ├── 문법 오류 확인
   ├── import/export 정합성 확인
   └── 타입 오류 확인 (TypeScript인 경우)
```

**수정 로그 포맷:**

```yaml
fix_applied:
  files_modified:
    - path: "<file-path>"
      changes:
        - line: <line-number>
          before: "<original-code>"
          after: "<modified-code>"
          reason: "<change-reason>"
  rollback_possible: true
  backup_created: "<backup-path>"
```

### 4단계: 테스트 (Test)

수정 후 검증 테스트 수행.

**테스트 프로세스:**

```javascript
// 4-1. 페이지 새로고침 또는 이동
{ 
  name: 'browser_navigate', 
  arguments: { 
    url: '<target-url>' 
  } 
}

// 4-2. 페이지 로드 대기
{ 
  name: 'browser_wait_for', 
  arguments: { 
    textGone: 'Loading' 
  } 
}

// 4-3. 에러 재확인
{ 
  name: 'browser_console_messages', 
  arguments: { 
    onlyErrors: true 
  } 
}

// 4-4. 예상 요소 가시성 검증
{ 
  name: 'browser_verify_element_visible', 
  arguments: { 
    role: '<expected-role>', 
    accessibleName: '<expected-name>' 
  } 
}

// 4-5. 예상 텍스트 출현 확인
{ 
  name: 'browser_wait_for', 
  arguments: { 
    text: '<success-indicator>' 
  } 
}
```

**테스트 결과 판정:**

```yaml
test_result:
  status: "<pass|fail>"
  checks:
    - name: "console_errors"
      passed: <boolean>
      details: "<error-count> errors found"
    - name: "element_visible"
      passed: <boolean>
      details: "<element> is visible"
    - name: "expected_text"
      passed: <boolean>
      details: "<text> appeared"
  next_action: "<retry|complete|escalate>"
```

## 인증 플로우

로그인/인증이 필요한 테스트의 경우 다음 플로우를 따른다.

### 인증 플로우 다이어그램

```
┌─────────────────────────────────────────────────────────┐
│                    인증 플로우                           │
│                                                         │
│  1. 페이지 스냅샷 획득                                   │
│     └── browser_snapshot                                │
│              │                                          │
│              ▼                                          │
│  2. 인증 폼 필드 식별                                    │
│     ├── email/username 필드 ref 획득                    │
│     ├── password 필드 ref 획득                          │
│     └── submit 버튼 ref 획득                            │
│              │                                          │
│              ▼                                          │
│  3. credentials 입력                                    │
│     ├── browser_type (email/username)                   │
│     ├── browser_type (password)                         │
│     └── browser_click (submit) 또는 submit: true        │
│              │                                          │
│              ▼                                          │
│  4. 인증 결과 확인                                       │
│     ├── 성공: 대시보드/홈으로 이동 확인                  │
│     ├── 실패: 에러 메시지 수집                          │
│     └── 2FA: OTP 입력 플로우 진입                       │
│              │                                          │
│              ▼                                          │
│  5. 메인 워크플로우 진행                                 │
└─────────────────────────────────────────────────────────┘
```

### 인증 필드 매핑

일반적인 로그인 폼 필드와 Playwright 선택자 매핑.

**이메일/유저네임 필드:**

```javascript
// 스냅샷에서 다음 패턴으로 식별
// - textbox "Email" [ref=eX]
// - textbox "Username" [ref=eX]
// - textbox "이메일" [ref=eX]
// - textbox "아이디" [ref=eX]

{ 
  name: 'browser_type', 
  arguments: { 
    element: 'Email textbox',
    ref: '<identified-ref>',
    text: credentials.email,
    submit: false
  } 
}
```

**패스워드 필드:**

```javascript
// 스냅샷에서 다음 패턴으로 식별
// - textbox "Password" [ref=eX]
// - textbox "비밀번호" [ref=eX]
// - [type=password] 속성

{ 
  name: 'browser_type', 
  arguments: { 
    element: 'Password textbox',
    ref: '<identified-ref>',
    text: credentials.password,
    submit: false
  } 
}
```

**제출 버튼:**

```javascript
// 스냅샷에서 다음 패턴으로 식별
// - button "Login" [ref=eX]
// - button "Sign in" [ref=eX]
// - button "로그인" [ref=eX]
// - button "Submit" [ref=eX]

{ 
  name: 'browser_click', 
  arguments: { 
    element: 'Login button',
    ref: '<identified-ref>'
  } 
}
```

### 인증 성공/실패 판정

**성공 조건:**

```javascript
// 다음 중 하나 이상 충족
// 1. URL 변경 (로그인 페이지 -> 대시보드)
// 2. 환영 메시지 출현
// 3. 로그인 폼 사라짐
// 4. 사용자 프로필 요소 출현

{ 
  name: 'browser_wait_for', 
  arguments: { 
    text: 'Welcome' 
  } 
}

{ 
  name: 'browser_wait_for', 
  arguments: { 
    textGone: 'Sign in' 
  } 
}

{ 
  name: 'browser_verify_element_visible', 
  arguments: { 
    role: 'button', 
    accessibleName: 'Logout' 
  } 
}
```

**실패 조건:**

```javascript
// 다음 중 하나 이상 해당
// 1. 에러 메시지 출현
// 2. URL 변경 없음
// 3. 로그인 폼 여전히 존재
// 4. 콘솔 에러 발생

{ 
  name: 'browser_snapshot', 
  arguments: {} 
}
// 결과에서 에러 메시지 확인:
// - text "Invalid credentials" [ref=eX]
// - text "Wrong password" [ref=eX]
// - alert [ref=eX]
```

### 2FA/OTP 처리

OTP가 필요한 경우 credentials.otp 사용.

```javascript
// OTP 입력 필드 식별
// - textbox "Verification code" [ref=eX]
// - textbox "OTP" [ref=eX]
// - textbox "인증 코드" [ref=eX]

{ 
  name: 'browser_type', 
  arguments: { 
    element: 'OTP textbox',
    ref: '<identified-ref>',
    text: credentials.otp,
    submit: true
  } 
}
```

### 소셜 로그인 처리

OAuth/소셜 로그인 버튼 클릭 후 별도 창 처리.

```javascript
// 소셜 로그인 버튼 식별
// - button "Continue with Google" [ref=eX]
// - button "Sign in with Apple" [ref=eX]
// - button "카카오로 로그인" [ref=eX]

{ 
  name: 'browser_click', 
  arguments: { 
    element: 'Google login button',
    ref: '<identified-ref>'
  } 
}

// 새 창/탭 처리
{ 
  name: 'browser_tab_list', 
  arguments: {} 
}

{ 
  name: 'browser_tab_select', 
  arguments: { 
    index: 1 
  } 
}
```

## 사용 예시

### 기본 사용

```yaml
goal: "메인 페이지 렌더링 에러 해결"
url: "http://localhost:3000"
```

### 최대 시도 횟수 지정

```yaml
goal: "결제 버튼 클릭 시 오류 해결"
url: "http://localhost:3000/checkout"
max: 5
```

### 로그인 테스트

```yaml
goal: "로그인 페이지 500 에러 해결"
url: "http://localhost:3000/login"
max: 3
credentials:
  email: "test@example.com"
  password: "testPassword123!"
```

### 유저네임 기반 로그인

```yaml
goal: "로그인 후 대시보드 접근 에러 수정"
url: "http://localhost:3000/login"
max: 5
credentials:
  username: "testuser"
  password: "testPassword123!"
```

### 2FA 포함 로그인

```yaml
goal: "2FA 인증 후 세션 유지 오류 해결"
url: "http://localhost:3000/login"
max: 3
credentials:
  email: "test@example.com"
  password: "testPassword123!"
  otp: "123456"
```

### 커스텀 필드 로그인

```yaml
goal: "회원 로그인 오류 수정"
url: "http://localhost:3000/member/login"
max: 3
credentials:
  custom:
    memberId: "MEMBER001"
    pin: "1234"
    securityAnswer: "MyPetName"
```

### 소셜 로그인 테스트

```yaml
goal: "카카오 로그인 연동 오류 해결"
url: "http://localhost:3000/login"
max: 3
credentials:
  provider: "kakao"
  email: "test@kakao.com"
  password: "kakaoPassword!"
```

## 에러 패턴 및 해결 가이드

### 일반적인 에러 패턴

| 에러 타입 | 패턴 | 일반적인 원인 | 해결 방향 |
|----------|------|--------------|----------|
| TypeError | `Cannot read property 'X' of undefined` | null/undefined 참조 | 옵셔널 체이닝 또는 null 체크 추가 |
| NetworkError | `Failed to fetch` | API 서버 연결 실패 | 서버 상태 확인, CORS 설정 검토 |
| SyntaxError | `Unexpected token` | JSON 파싱 오류 | 응답 형식 확인 |
| AuthError | `401 Unauthorized` | 인증 토큰 만료/무효 | 토큰 갱신 로직 확인 |
| ValidationError | `Invalid input` | 입력 값 검증 실패 | 폼 유효성 검사 로직 확인 |

### 로그인 관련 에러 패턴

| 에러 메시지 | 원인 | 해결 방향 |
|------------|------|----------|
| `Invalid credentials` | 잘못된 이메일/비밀번호 | credentials 값 확인 |
| `User not found` | 존재하지 않는 계정 | 계정 존재 여부 확인 |
| `Account locked` | 로그인 시도 초과 | 계정 잠금 해제 또는 대기 |
| `Session expired` | 세션 타임아웃 | 재로그인 필요 |
| `CSRF token mismatch` | CSRF 토큰 불일치 | 페이지 새로고침 후 재시도 |

## Playwright MCP 도구 레퍼런스

상세 내용은 [references/playwright-tools.md](references/playwright-tools.md) 참조.

### 핵심 도구 요약

| 카테고리 | 도구 | 용도 |
|---------|------|------|
| 네비게이션 | `browser_navigate` | URL 이동 |
| 네비게이션 | `browser_go_back` | 뒤로 가기 |
| 네비게이션 | `browser_go_forward` | 앞으로 가기 |
| 정보 수집 | `browser_snapshot` | 접근성 트리 캡처 (ref 획득) |
| 정보 수집 | `browser_console_messages` | 콘솔 로그 수집 |
| 정보 수집 | `browser_take_screenshot` | 스크린샷 캡처 |
| 정보 수집 | `browser_network_requests` | 네트워크 요청 조회 |
| 상호작용 | `browser_click` | 요소 클릭 |
| 상호작용 | `browser_type` | 텍스트 입력 |
| 상호작용 | `browser_select_option` | 드롭다운 선택 |
| 상호작용 | `browser_hover` | 마우스 호버 |
| 상호작용 | `browser_drag` | 드래그 앤 드롭 |
| 대기/검증 | `browser_wait_for` | 조건 대기 |
| 대기/검증 | `browser_verify_element_visible` | 요소 가시성 검증 |
| 디버깅 | `browser_start_tracing` | 트레이싱 시작 |
| 탭 관리 | `browser_tab_list` | 탭 목록 조회 |
| 탭 관리 | `browser_tab_new` | 새 탭 열기 |
| 탭 관리 | `browser_tab_select` | 탭 전환 |
| 탭 관리 | `browser_tab_close` | 탭 닫기 |
| 출력 | `browser_pdf_save` | PDF 저장 |

## 종료 조건

루프는 다음 조건에서 종료:

| 조건 | 설명 | 결과 |
|------|------|------|
| Goal 달성 | 테스트 통과, 에러 없음 | ✅ 성공 |
| Max 도달 | 최대 시도 횟수 초과 | ⚠️ 부분 실패 |
| 수동 중단 | 사용자 개입 | ⏹️ 중단 |
| 치명적 오류 | 복구 불가능한 상태 | ❌ 실패 |

## 실행
```bash
./scripts/ralph-loop.sh --goal "$1" --url "$2" --max "$3" --email "$4" --password "$5"
```