# Playwright MCP 도구 레퍼런스

## 네비게이션

```
browser_navigate({ url: "<url>" })        // URL 이동
browser_navigate_back({})                  // 뒤로 가기
```

## 정보 수집

```
browser_snapshot({})                       // 접근성 트리 (ref 획득 필수)
browser_console_messages({ level: "error" })  // 콘솔 로그
browser_take_screenshot({ fullPage: true })   // 스크린샷
browser_network_requests({})               // 네트워크 요청
```

### browser_snapshot 응답 예시

```
- form [ref=e1]:
  - textbox "Email" [ref=e2]
  - textbox "Password" [ref=e3]
  - button "Login" [ref=e4]
```

## 상호작용

```
browser_click({ element: "설명", ref: "<ref>" })
browser_type({ element: "설명", ref: "<ref>", text: "<텍스트>" })
browser_type({ element: "설명", ref: "<ref>", text: "<텍스트>", submit: true })  // Enter 포함
browser_select_option({ element: "설명", ref: "<ref>", values: ["<값>"] })
browser_hover({ element: "설명", ref: "<ref>" })
browser_press_key({ key: "Enter" })
browser_press_key({ key: "Escape" })
```

## 대기

```
browser_wait_for({ text: "<텍스트>" })        // 텍스트 출현 대기
browser_wait_for({ textGone: "<텍스트>" })    // 텍스트 사라짐 대기
browser_wait_for({ time: <초> })              // 시간 대기
```

## 탭 관리

```
browser_tabs({ action: "list" })              // 탭 목록
browser_tabs({ action: "new" })               // 새 탭
browser_tabs({ action: "select", index: N })  // 탭 전환
browser_tabs({ action: "close", index: N })   // 탭 닫기
```

## 폼 일괄 입력

```
browser_fill_form({
  fields: [
    { name: "Email", type: "textbox", ref: "<ref>", value: "<값>" },
    { name: "Password", type: "textbox", ref: "<ref>", value: "<값>" }
  ]
})
```

## 자주 사용하는 필드 패턴

| 유형 | 스냅샷 패턴 |
|------|------------|
| 이메일 | `textbox "Email"`, `textbox "이메일"` |
| 비밀번호 | `textbox "Password"`, `textbox "비밀번호"` |
| 로그인 버튼 | `button "Login"`, `button "Sign in"`, `button "로그인"` |
| 에러 메시지 | `alert "..."`, `text "Invalid..."` |
