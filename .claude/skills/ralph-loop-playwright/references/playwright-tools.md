# Playwright MCP Tools Reference

## Navigation

```
browser_navigate({ url: "<url>" })        // Navigate to URL
browser_navigate_back({})                  // Go back
```

## Information Collection

```
browser_snapshot({})                       // Accessibility tree (required to get refs)
browser_console_messages({ level: "error" })  // Console logs
browser_take_screenshot({ fullPage: true })   // Screenshot
browser_network_requests({})               // Network requests
```

### browser_snapshot Response Example

```
- form [ref=e1]:
  - textbox "Email" [ref=e2]
  - textbox "Password" [ref=e3]
  - button "Login" [ref=e4]
```

## Interaction

```
browser_click({ element: "description", ref: "<ref>" })
browser_type({ element: "description", ref: "<ref>", text: "<text>" })
browser_type({ element: "description", ref: "<ref>", text: "<text>", submit: true })  // Include Enter
browser_select_option({ element: "description", ref: "<ref>", values: ["<value>"] })
browser_hover({ element: "description", ref: "<ref>" })
browser_press_key({ key: "Enter" })
browser_press_key({ key: "Escape" })
```

## Waiting

```
browser_wait_for({ text: "<text>" })        // Wait for text to appear
browser_wait_for({ textGone: "<text>" })    // Wait for text to disappear
browser_wait_for({ time: <seconds> })       // Wait for time
```

## Tab Management

```
browser_tabs({ action: "list" })              // Tab list
browser_tabs({ action: "new" })               // New tab
browser_tabs({ action: "select", index: N })  // Switch tab
browser_tabs({ action: "close", index: N })   // Close tab
```

## Batch Form Input

```
browser_fill_form({
  fields: [
    { name: "Email", type: "textbox", ref: "<ref>", value: "<value>" },
    { name: "Password", type: "textbox", ref: "<ref>", value: "<value>" }
  ]
})
```

## Common Field Patterns

| Type | Snapshot Pattern |
|------|------------------|
| Email | `textbox "Email"` |
| Password | `textbox "Password"` |
| Login Button | `button "Login"`, `button "Sign in"` |
| Error Message | `alert "..."`, `text "Invalid..."` |
