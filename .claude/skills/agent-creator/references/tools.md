# Subagent Tool Reference

This is a list of tools available for subagents.
If the `tools` field is omitted, all tools are inherited.

---

## Core Tools

| Tool | Description |
|------|-------------|
| `Read` | Read file contents |
| `Write` | Create or overwrite files |
| `Edit` | Precise editing of existing files |
| `Glob` | Find files by pattern matching |
| `Grep` | Search file contents with regex |
| `Bash` | Execute shell commands |
| `Task` | Create subagents (not recommended from subagents) |

## Interaction Tools

| Tool | Description |
|------|-------------|
| `AskUser` | Ask user questions for clarification |
| `TodoWrite` | Manage task lists |

## Web Tools

| Tool | Description |
|------|-------------|
| `WebFetch` | Fetch and process web content |
| `WebSearch` | Web search |

## MCP Tools

Tools from configured MCP servers are also available.
MCP tool names follow the `mcp__<server>__<tool>` pattern.

---

## Common Tool Combinations

### Read-Only Research

```yaml
tools: Read, Grep, Glob, Bash
```

**Use case:** Code analysis, documentation review, codebase exploration

### Code Modification

```yaml
tools: Read, Write, Edit, Grep, Glob, Bash
```

**Use case:** Feature implementation, bug fixes, refactoring

### Minimal Write Permission

```yaml
tools: Read, Grep, Glob
```

**Use case:** Security audit, code review (reports only)

### Full Access

Omitting the `tools` field inherits all tools.

---

## Tool Selection Guide

| Agent Type | Recommended Tool Combination |
|------------|------------------------------|
| Analysis/Review Only | `Read, Grep, Glob` |
| Analysis + Command Execution | `Read, Grep, Glob, Bash` |
| Code Generation/Modification | `Read, Write, Edit, Grep, Glob, Bash` |
| Full Permission Needed | Omit `tools` field |
