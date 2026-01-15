# Playwright MCP 도구 레퍼런스

## 네비게이션

### browser_navigate

URL로 이동.

```javascript
{ 
  name: 'browser_navigate', 
  arguments: { 
    url: '<target-url>' 
  } 
}
```

### browser_go_back

히스토리 뒤로 이동.

```javascript
{ 
  name: 'browser_go_back', 
  arguments: {} 
}
```

### browser_go_forward

히스토리 앞으로 이동.

```javascript
{ 
  name: 'browser_go_forward', 
  arguments: {} 
}
```

## 정보 수집

### browser_snapshot

접근성 트리 캡처. **모든 상호작용 전에 먼저 호출하여 ref 획득 필수.**

```javascript
{ 
  name: 'browser_snapshot', 
  arguments: {} 
}
```

**응답 예시:**

```yaml
- navigation [ref=e1]:
  - link "Home" [ref=e2]
  - link "About" [ref=e3]
- main [ref=e4]:
  - heading "Welcome" [ref=e5]
  - form [ref=e6]:
    - textbox "Email" [ref=e7]
    - textbox "Password" [ref=e8]
    - button "Login" [ref=e9]
  - link "Forgot password?" [ref=e10]
- footer [ref=e11]:
  - text "© 2024 Company" [ref=e12]
```

**ref 식별 패턴:**

| 요소 타입 | 패턴 | 용도 |
|----------|------|------|
| 텍스트 입력 | `textbox "<label>" [ref=eX]` | 폼 입력 |
| 버튼 | `button "<label>" [ref=eX]` | 클릭 액션 |
| 링크 | `link "<text>" [ref=eX]` | 네비게이션 |
| 체크박스 | `checkbox "<label>" [ref=eX]` | 옵션 선택 |
| 드롭다운 | `combobox "<label>" [ref=eX]` | 옵션 선택 |
| 에러 메시지 | `alert [ref=eX]` 또는 `text "<error>" [ref=eX]` | 오류 확인 |

### browser_console_messages

콘솔 로그 수집.

```javascript
// 에러만 수집
{ 
  name: 'browser_console_messages', 
  arguments: { 
    onlyErrors: true 
  } 
}

// 전체 로그 수집
{ 
  name: 'browser_console_messages', 
  arguments: { 
    onlyErrors: false 
  } 
}
```

**응답 예시:**

```json
{
  "messages": [
    {
      "type": "error",
      "text": "Uncaught TypeError: Cannot read property 'map' of undefined",
      "location": "app.js:42"
    },
    {
      "type": "warning",
      "text": "React does not recognize the `customProp` prop",
      "location": "Component.jsx:15"
    }
  ]
}
```

### browser_take_screenshot

스크린샷 캡처.

```javascript
// 전체 페이지 스크린샷
{ 
  name: 'browser_take_screenshot', 
  arguments: { 
    fullPage: true, 
    filename: '<filename>.png' 
  } 
}

// 특정 요소 스크린샷
{ 
  name: 'browser_take_screenshot', 
  arguments: { 
    ref: '<element-ref>', 
    filename: '<filename>.png' 
  } 
}

// JPEG 포맷
{ 
  name: 'browser_take_screenshot', 
  arguments: { 
    fullPage: false, 
    type: 'jpeg',
    filename: '<filename>.jpg' 
  } 
}
```

### browser_network_requests

네트워크 요청 조회.

```javascript
{ 
  name: 'browser_network_requests', 
  arguments: {} 
}
```

**응답 예시:**

```json
{
  "requests": [
    {
      "url": "https://api.example.com/users",
      "method": "GET",
      "status": 200,
      "duration": 245
    },
    {
      "url": "https://api.example.com/auth/login",
      "method": "POST",
      "status": 401,
      "duration": 189
    }
  ]
}
```

## 상호작용

### browser_click

요소 클릭. ref는 browser_snapshot에서 획득.

```javascript
// 기본 클릭
{ 
  name: 'browser_click', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>'
  } 
}

// 더블 클릭
{ 
  name: 'browser_click', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    doubleClick: true
  } 
}

// 우클릭
{ 
  name: 'browser_click', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    button: 'right'
  } 
}

// 수정자 키와 함께 클릭
{ 
  name: 'browser_click', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    modifiers: ['Control']  // ['Shift'], ['Alt'], ['Meta']
  } 
}
```

### browser_type

텍스트 입력 필드에 값 입력.

```javascript
// 기본 입력
{ 
  name: 'browser_type', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    text: '<input-text>'
  } 
}

// 입력 후 Enter 키 (폼 제출)
{ 
  name: 'browser_type', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    text: '<input-text>',
    submit: true
  } 
}

// 천천히 타이핑 (타이핑 시뮬레이션)
{ 
  name: 'browser_type', 
  arguments: { 
    element: '<element-description>',
    ref: '<element-ref>',
    text: '<input-text>',
    slowly: true
  } 
}
```

### browser_select_option

드롭다운/셀렉트 박스 옵션 선택.

```javascript
// 단일 선택
{ 
  name: 'browser_select_option', 
  arguments: { 
    element: '<dropdown-description>',
    ref: '<element-ref>',
    values: ['<option-value>']
  } 
}

// 다중 선택
{ 
  name: 'browser_select_option', 
  arguments: { 
    element: '<dropdown-description>',
    ref: '<element-ref>',
    values: ['<option-1>', '<option-2>']
  } 
}
```

### browser_hover

마우스 호버 (툴팁, 드롭다운 메뉴 등 트리거).

```javascript
{ 
  name: 'browser_hover', 
  arguments: { 
    element: '<element-description>', 
    ref: '<element-ref>' 
  } 
}
```

### browser_drag

드래그 앤 드롭.

```javascript
{ 
  name: 'browser_drag', 
  arguments: { 
    startElement: '<source-description>',
    startRef: '<source-ref>',
    endElement: '<target-description>',
    endRef: '<target-ref>'
  } 
}
```

### browser_press_key

키보드 키 입력.

```javascript
// 단일 키
{ 
  name: 'browser_press_key', 
  arguments: { 
    key: 'Enter' 
  } 
}

// 조합 키
{ 
  name: 'browser_press_key', 
  arguments: { 
    key: 'Control+a' 
  } 
}

// 특수 키
{ 
  name: 'browser_press_key', 
  arguments: { 
    key: 'Escape' 
  } 
}
```

**지원 키:**

| 키 | 설명 |
|---|------|
| `Enter` | 엔터 |
| `Tab` | 탭 |
| `Escape` | ESC |
| `Backspace` | 백스페이스 |
| `Delete` | 삭제 |
| `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` | 방향키 |
| `Control+a` | 전체 선택 |
| `Control+c` | 복사 |
| `Control+v` | 붙여넣기 |

## 대기 및 검증

### browser_wait_for

조건 대기.

```javascript
// 텍스트 출현 대기
{ 
  name: 'browser_wait_for', 
  arguments: { 
    text: '<expected-text>' 
  } 
}

// 텍스트 사라짐 대기
{ 
  name: 'browser_wait_for', 
  arguments: { 
    textGone: '<disappearing-text>' 
  } 
}

// 시간 대기 (초 단위)
{ 
  name: 'browser_wait_for', 
  arguments: { 
    time: <seconds> 
  } 
}
```

**사용 예시:**

| 시나리오 | 설정 |
|----------|------|
| 로딩 완료 대기 | `textGone: 'Loading...'` |
| 성공 메시지 대기 | `text: 'Success'` |
| 에러 메시지 대기 | `text: 'Error'` |
| 리다이렉트 대기 | `text: 'Dashboard'` |
| API 응답 대기 | `time: 3` |

### browser_verify_element_visible

요소 가시성 검증.

```javascript
{ 
  name: 'browser_verify_element_visible', 
  arguments: { 
    role: '<aria-role>',
    accessibleName: '<accessible-name>'
  } 
}
```

**지원 role:**

| role | 설명 |
|------|------|
| `button` | 버튼 |
| `link` | 링크 |
| `textbox` | 텍스트 입력 |
| `checkbox` | 체크박스 |
| `radio` | 라디오 버튼 |
| `combobox` | 드롭다운 |
| `heading` | 제목 |
| `img` | 이미지 |
| `alert` | 알림 |
| `dialog` | 다이얼로그 |

## 디버깅

### browser_start_tracing

Playwright 트레이싱 시작 (디버깅용).

```javascript
{ 
  name: 'browser_start_tracing', 
  arguments: {} 
}
```

### browser_stop_tracing

트레이싱 중지 및 저장.

```javascript
{ 
  name: 'browser_stop_tracing', 
  arguments: {
    filename: '<trace-filename>.zip'
  } 
}
```

## 탭 관리

### browser_tab_list

열린 탭 목록 조회.

```javascript
{ 
  name: 'browser_tab_list', 
  arguments: {} 
}
```

**응답 예시:**

```json
{
  "tabs": [
    { "index": 0, "url": "https://example.com", "title": "Home" },
    { "index": 1, "url": "https://example.com/login", "title": "Login" }
  ],
  "activeTab": 0
}
```

### browser_tab_new

새 탭 열기.

```javascript
{ 
  name: 'browser_tab_new', 
  arguments: { 
    url: '<url>' 
  } 
}
```

### browser_tab_select

탭 전환.

```javascript
{ 
  name: 'browser_tab_select', 
  arguments: { 
    index: <tab-index> 
  } 
}
```

### browser_tab_close

탭 닫기.

```javascript
{ 
  name: 'browser_tab_close', 
  arguments: { 
    index: <tab-index> 
  } 
}
```

## 출력

### browser_pdf_save

현재 페이지를 PDF로 저장.

```javascript
{ 
  name: 'browser_pdf_save', 
  arguments: { 
    filename: '<filename>.pdf' 
  } 
}
```

## 인증 플로우 예시

### 이메일/패스워드 로그인

```javascript
// 1. 로그인 페이지로 이동
{ name: 'browser_navigate', arguments: { url: '<login-url>' } }

// 2. 페이지 스냅샷 획득 (ref 확인)
{ name: 'browser_snapshot', arguments: {} }

// 3. 이메일 입력 (스냅샷에서 textbox "Email" [ref=e7] 확인)
{ 
  name: 'browser_type', 
  arguments: { 
    element: 'Email textbox',
    ref: 'e7',
    text: '<user-email>'
  } 
}

// 4. 패스워드 입력 (스냅샷에서 textbox "Password" [ref=e8] 확인)
{ 
  name: 'browser_type', 
  arguments: { 
    element: 'Password textbox',
    ref: 'e8',
    text: '<user-password>'
  } 
}

// 5. 로그인 버튼 클릭 (스냅샷에서 button "Login" [ref=e9] 확인)
{ 
  name: 'browser_click', 
  arguments: { 
    element: 'Login button',
    ref: 'e9'
  } 
}

// 6. 로그인 성공 확인
{ name: 'browser_wait_for', arguments: { text: 'Welcome' } }
// 또는
{ name: 'browser_wait_for', arguments: { textGone: 'Sign in' } }
// 또는
{ name: 'browser_verify_element_visible', arguments: { role: 'button', accessibleName: 'Logout' } }
```

### 로그인 실패 처리

```javascript
// 에러 메시지 확인을 위한 스냅샷
{ name: 'browser_snapshot', arguments: {} }

// 응답에서 에러 패턴 확인:
// - alert "Invalid credentials" [ref=eX]
// - text "Wrong password" [ref=eX]
// - text "User not found" [ref=eX]

// 콘솔 에러 확인
{ name: 'browser_console_messages', arguments: { onlyErrors: true } }

// 네트워크 요청 실패 확인 (401, 403 등)
{ name: 'browser_network_requests', arguments: {} }
```

### 2FA/OTP 입력

```javascript
// 1. OTP 입력 화면 대기
{ name: 'browser_wait_for', arguments: { text: 'verification code' } }

// 2. 스냅샷으로 OTP 필드 확인
{ name: 'browser_snapshot', arguments: {} }

// 3. OTP 입력 (스냅샷에서 textbox "Code" [ref=eX] 확인)
{ 
  name: 'browser_type', 
  arguments: { 
    element: 'OTP textbox',
    ref: '<otp-field-ref>',
    text: '<otp-code>',
    submit: true
  } 
}

// 4. 인증 완료 확인
{ name: 'browser_wait_for', arguments: { text: 'Dashboard' } }
```

### 소셜 로그인 (OAuth)

```javascript
// 1. 소셜 로그인 버튼 클릭
{ 
  name: 'browser_click', 
  arguments: { 
    element: 'Google login button',
    ref: '<google-button-ref>'
  } 
}

// 2. 새 창/팝업 확인
{ name: 'browser_tab_list', arguments: {} }

// 3. OAuth 창으로 전환
{ name: 'browser_tab_select', arguments: { index: 1 } }

// 4. OAuth 창에서 로그인 진행
{ name: 'browser_snapshot', arguments: {} }
// ... 이메일/패스워드 입력 ...

// 5. 원래 탭으로 복귀
{ name: 'browser_tab_select', arguments: { index: 0 } }

// 6. 로그인 완료 확인
{ name: 'browser_wait_for', arguments: { text: 'Welcome' } }
```

## 일반적인 폼 필드 패턴

스냅샷에서 자주 발견되는 필드 패턴.

### 로그인 폼

```yaml
# 영문
- textbox "Email" [ref=eX]
- textbox "Username" [ref=eX]
- textbox "Password" [ref=eX]
- button "Login" [ref=eX]
- button "Sign in" [ref=eX]
- link "Forgot password?" [ref=eX]

# 한글
- textbox "이메일" [ref=eX]
- textbox "아이디" [ref=eX]
- textbox "비밀번호" [ref=eX]
- button "로그인" [ref=eX]
- link "비밀번호 찾기" [ref=eX]
```

### 회원가입 폼

```yaml
- textbox "Name" [ref=eX]
- textbox "Email" [ref=eX]
- textbox "Password" [ref=eX]
- textbox "Confirm password" [ref=eX]
- checkbox "I agree to terms" [ref=eX]
- button "Sign up" [ref=eX]
- button "Register" [ref=eX]
```

### 검색 폼

```yaml
- textbox "Search" [ref=eX]
- searchbox "Search" [ref=eX]
- button "Search" [ref=eX]
```

### 연락처 폼

```yaml
- textbox "Name" [ref=eX]
- textbox "Email" [ref=eX]
- textbox "Phone" [ref=eX]
- textbox "Message" [ref=eX]
- button "Submit" [ref=eX]
- button "Send" [ref=eX]
```

## 에러 메시지 패턴

스냅샷에서 자주 발견되는 에러 패턴.

```yaml
# 인증 에러
- alert "Invalid credentials" [ref=eX]
- text "Wrong password" [ref=eX]
- text "User not found" [ref=eX]
- text "Account locked" [ref=eX]

# 유효성 검사 에러
- text "Email is required" [ref=eX]
- text "Invalid email format" [ref=eX]
- text "Password too short" [ref=eX]

# 서버 에러
- text "Something went wrong" [ref=eX]
- text "Server error" [ref=eX]
- text "Please try again" [ref=eX]

# 네트워크 에러
- text "Network error" [ref=eX]
- text "Connection failed" [ref=eX]
```