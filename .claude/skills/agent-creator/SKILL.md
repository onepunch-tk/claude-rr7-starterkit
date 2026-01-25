---
name: agent-creator
description: "Guide for creating Claude Code subagent files (.md). Use when: (1) Creating a new subagent, (2) Modifying or improving an existing agent, (3) Defining the agent's role scope or trigger conditions, (4) Configuring agent settings (model, tools, permissionMode). Includes templates, examples, and tool references."
---

# Subagent Creation Guide

## Writing Workflow

1. **Copy Template**: Copy structure from [references/template.md](./references/template.md)
2. **Reference Examples**: Check similar patterns in [references/example.md](./references/example.md)
3. **Write Section by Section**: Follow the guide below to write content
4. **Select Tools**: Choose necessary tools from [references/tools.md](./references/tools.md)
5. **Verify Checklist**: Final inspection

---

## Storage Location

| Location | Purpose | Priority |
|----------|---------|----------|
| `.claude/agents/` | Project-specific | High |
| `~/.claude/agents/` | Global shared | Low |

---

## YAML Frontmatter

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | kebab-case name | `code-reviewer` |
| `description` | Trigger conditions (numbered list) | See pattern below |

### Optional Fields

| Field | Default | Options |
|-------|---------|---------|
| `model` | inherit | `opus`, `sonnet`, `haiku`, `inherit` |
| `tools` | Inherit all | See [Tool Reference](./references/tools.md) |
| `permissionMode` | default | `default`, `acceptEdits`, `bypassPermissions`, `plan` |
| `skills` | - | List of skills to auto-load |
| `color` | - | UI color (`red`, `purple`, `blue`, `green`, etc.) |

### Description Writing Pattern

```yaml
description: "use proactively, Use this agent when: 1) condition1, 2) condition2, 3) condition3, 4) condition4. Additional explanation."
```

### Description Writing Guidelines

- **Must include `use proactively`**: Include at the beginning of description for Claude to automatically delegate to the agent
- **Numbered trigger conditions**: List conditions in 1), 2), 3), 4) format after `Use this agent when:`
- **Additional explanation**: Add description of agent characteristics or execution method at the end

### Model Selection Criteria

| Model | Purpose |
|-------|---------|
| `inherit` | Inherit parent model (recommended default) |
| `opus` | Complex analysis, deep reasoning |
| `sonnet` | General tasks with balanced performance |
| `haiku` | Simple tasks requiring fast response |

---

## Required Body Sections

### 1. Role Introduction

```markdown
You are a **{expert title}**. Based on {experience/expertise}, you perform {responsibilities}.
```

### 2. Core Roles and Responsibilities

Agent's main functions, automatic/manual execution, tools/references used

### 3. Role Scope Limitations (Important)

Prevent role overlap with other agents:

```markdown
### Items NOT reviewed
- ❌ {Items handled by other agents}

### Items reviewed
- ✅ {Items handled by this agent}
```

### 4. Task Execution Modes

- **Mode 1 - Automatic Execution**: Trigger conditions, automatically collected information
- **Mode 2 - Manual Execution**: User-specified scope

### 5. Required Work Procedures

Step-by-step process (specify tools, reference resources, decision criteria)

### 6. Output Language

```markdown
All analysis results, comments, and reports are written in **Korean**.
```

---

## Optional Sections

| Section | Purpose |
|---------|---------|
| Severity Classification Criteria | Review/validation agents |
| Parallel Execution Optimization | Background execution agents |
| Quality Assurance | Minimize false positives, result specificity |

---

## Checklist

### Required Items

- [ ] Is `name` written in kebab-case?
- [ ] Does `description` specify trigger conditions in a numbered list?
- [ ] Does it follow the [template](./references/template.md) structure?
- [ ] Was the [example](./references/example.md) pattern referenced?

### Optional Items

- [ ] Is `model` appropriately selected? (`inherit` recommended)
- [ ] Is `tools` restriction needed? ([Tool Reference](./references/tools.md))
- [ ] Is `permissionMode` needed?

### Quality Items

- [ ] Does the role scope not overlap with other agents?
- [ ] Are required work procedures clear step by step?
- [ ] Is the output language specified?

---

## Reference Documents

| Document | Description |
|----------|-------------|
| [template.md](./references/template.md) | Basic template structure |
| [example.md](./references/example.md) | Actual implementation examples |
| [tools.md](./references/tools.md) | List of available tools |
