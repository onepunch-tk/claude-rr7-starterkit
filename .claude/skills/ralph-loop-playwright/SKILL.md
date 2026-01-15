---
name: ralph-loop-playwright
description: |
  자동화된 디버깅 루프 스킬. Playwright MCP와 연동하여 웹 오류를 자동으로 수집, 분석, 해결, 테스트하는 4단계 반복 워크플로우.
argument-hint: [goal] [url] [max] [email] [password]
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__playwright__*
---

# Ralph-Loop Playwright 디버깅 스킬

## 파라미터 파싱

사용자 입력에서 다음 파라미터를 추출한다:

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| `goal` | ✅ | 해결 목표 (첫 번째 인자) |
| `url` | ❌ | 테스트 URL (두 번째 인자) |
| `max` | ❌ | 최대 루프 횟수 (세 번째 인자, 미지정시 무제한) |
| `email` | ❌ | 로그인 이메일 (네 번째 인자) |
| `password` | ❌ | 로그인 비밀번호 (다섯 번째 인자) |

## 실행 워크플로우

```
LOOP_COUNT = 0

WHILE (LOOP_COUNT < max OR max == 0):
    LOOP_COUNT++

    IF LOOP_COUNT == 1 AND credentials 존재:
        PHASE 0: 인증

    PHASE 1: 오류 수집
    PHASE 2: 원인 분석
    PHASE 3: 코드 수정
    PHASE 4: 테스트

    IF 테스트 통과:
        "✅ GOAL 달성" 출력 후 종료

    IF LOOP_COUNT >= max AND max > 0:
        "⚠️ 최대 시도 횟수 도달" 출력 후 종료

END WHILE
```

---

## PHASE 0: 인증 (첫 루프에서 credentials 존재시)

### 단계 0-1: 로그인 페이지 이동
```
mcp__playwright__browser_navigate({ url: "<login-url>" })
```

### 단계 0-2: 페이지 스냅샷으로 폼 요소 ref 획득
```
mcp__playwright__browser_snapshot({})
```

스냅샷에서 다음 패턴의 요소 ref를 식별:
- Email/Username: `textbox "Email"`, `textbox "이메일"`, `textbox "Username"`, `textbox "아이디"`
- Password: `textbox "Password"`, `textbox "비밀번호"`
- Submit: `button "Login"`, `button "Sign in"`, `button "로그인"`

### 단계 0-3: credentials 입력
```
mcp__playwright__browser_type({
  element: "Email textbox",
  ref: "<email-ref>",
  text: "<email>"
})

mcp__playwright__browser_type({
  element: "Password textbox",
  ref: "<password-ref>",
  text: "<password>"
})

mcp__playwright__browser_click({
  element: "Login button",
  ref: "<submit-ref>"
})
```

### 단계 0-4: 인증 결과 확인
```
mcp__playwright__browser_snapshot({})
```

**성공 조건**: URL 변경, 로그인 폼 사라짐, 환영 메시지 출현
**실패 조건**: 에러 메시지 출현, 로그인 폼 유지

---

## PHASE 1: 오류 수집

### 단계 1-1: 콘솔 에러 수집
```
mcp__playwright__browser_console_messages({ level: "error" })
```

### 단계 1-2: 페이지 스냅샷 획득
```
mcp__playwright__browser_snapshot({})
```

### 단계 1-3: 스크린샷 캡처
```
mcp__playwright__browser_take_screenshot({ fullPage: true })
```

### 단계 1-4: 네트워크 요청 실패 확인
```
mcp__playwright__browser_network_requests({})
```

### 수집 결과 정리

수집된 정보를 다음 형식으로 정리:

```
collected_data:
  console_errors: [에러 메시지 목록]
  network_failures: [실패한 요청 목록]
  page_state: [현재 페이지 상태]
```

---

## PHASE 2: 원인 분석

### 분석 프로세스

1. **에러 메시지 파싱**
   - 스택 트레이스에서 파일 경로와 라인 번호 추출
   - 에러 타입 분류 (TypeError, NetworkError, SyntaxError 등)

2. **소스 코드 검토**
   - 에러에서 추출한 파일 경로의 코드를 Read 도구로 읽기
   - 관련 import/export 확인

3. **근본 원인 식별**
   - 직접 원인 파악
   - 수정 대상 파일 및 라인 결정

### 분석 결과 정리

```
analysis_result:
  error_type: "<에러 분류>"
  root_cause: "<원인>"
  affected_files:
    - path: "<파일 경로>"
      line: <라인 번호>
  suggested_fix: "<수정 방향>"
```

---

## PHASE 3: 코드 수정

### 수정 원칙

1. **최소 변경**: 문제 해결에 필요한 최소한의 코드만 수정
2. **스타일 유지**: 기존 코드 스타일과 일관성 유지
3. **부작용 최소화**: 다른 기능에 영향 주지 않도록 주의

### 수정 절차

1. Read 도구로 수정 대상 파일 읽기
2. Edit 도구로 코드 수정 적용
3. 필요시 타입 검사 실행: `bun run typecheck` 또는 `bunx tsc --noEmit`

### 수정 기록

```
fix_applied:
  files_modified:
    - path: "<파일 경로>"
      changes:
        - before: "<수정 전>"
          after: "<수정 후>"
          reason: "<수정 이유>"
```

---

## PHASE 4: 테스트

### 단계 4-1: 페이지 새로고침
```
mcp__playwright__browser_navigate({ url: "<target-url>" })
```

### 단계 4-2: 페이지 로드 대기
```
mcp__playwright__browser_wait_for({ time: 2 })
```

### 단계 4-3: 에러 재확인
```
mcp__playwright__browser_console_messages({ level: "error" })
```

### 단계 4-4: 페이지 상태 확인
```
mcp__playwright__browser_snapshot({})
```

### 테스트 결과 판정

**PASS 조건** (모두 충족시):
- 콘솔 에러 없음 또는 기존 에러 해결됨
- 목표로 한 기능이 정상 작동
- 예상 UI 요소가 표시됨

**FAIL 조건** (하나라도 해당시):
- 동일 에러 반복 발생
- 새로운 에러 발생
- 목표 기능 미작동

---

## 에러 패턴별 해결 가이드

| 에러 패턴 | 일반적 원인 | 해결 방향 |
|----------|------------|----------|
| `Cannot read property 'X' of undefined` | null/undefined 참조 | 옵셔널 체이닝 또는 null 체크 |
| `Failed to fetch` | API 연결 실패 | 서버 상태, CORS 설정 확인 |
| `Unexpected token` | JSON 파싱 오류 | 응답 형식 확인 |
| `401 Unauthorized` | 인증 실패 | 토큰 갱신 로직 확인 |
| `404 Not Found` | 경로 오류 | 라우트 설정 확인 |
| `500 Internal Server Error` | 서버 오류 | 서버 로그 확인 |

---

## 종료 조건

| 조건 | 출력 | 종료 코드 |
|------|------|----------|
| Goal 달성 | ✅ GOAL 달성 (N회 시도) | 성공 |
| Max 도달 | ⚠️ 최대 시도 횟수(N) 도달 | 부분 실패 |
| 치명적 오류 | ❌ 복구 불가능한 오류 발생 | 실패 |

---

## 루프 진행 상황 출력 형식

각 루프 시작시:
```
═══════════════════════════════════════
RALPH-LOOP #N
Goal: <goal>
═══════════════════════════════════════
```

각 Phase 시작시:
```
[N/4] <Phase 이름>...
```

루프 종료시:
```
테스트 결과: PASS/FAIL
다음 액션: 종료/재시도
```
