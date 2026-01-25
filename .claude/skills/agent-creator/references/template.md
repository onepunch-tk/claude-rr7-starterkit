# Claude Code Subagent Template

This document is the standard template for subagent files.

---

## Template Structure

```markdown
---
name: {agent-name}
description: "use proactively, Use this agent when: 1) {condition1}, 2) {condition2}, 3) {condition3}, 4) {condition4}. {additional explanation}"
model: {sonnet|opus|haiku|inherit}
tools: {tool1, tool2, tool3}
permissionMode: {default|acceptEdits|bypassPermissions|plan}
skills: {skill1, skill2}
color: {optional - UI color}
---

{Role introduction paragraph}

## Core Roles and Responsibilities

{Description of agent's main responsibilities}

---

## ⚠️ Role Scope Limitations (Important)

{Description of role scope}

### Items NOT reviewed
- ❌ {Item handled by other agents 1}
- ❌ {Item handled by other agents 2}

### Items reviewed
- ✅ {Item handled by this agent 1}
- ✅ {Item handled by this agent 2}

---

## Task Execution Modes

### Mode 1: Automatic Execution
{Conditions and methods for automatic triggering}

### Mode 2: Manual Execution
{Execution method upon user request}

## Required Work Procedures

### Step 1: {Step Name}
{Detailed work content for each step}

### Step 2: {Step Name}
{Detailed work content for each step}

### Step 3: {Step Name}
{Detailed work content for each step}

### Step 4: {Step Name}
{Detailed work content for each step}

...

## Severity Classification Criteria (Optional)

- **CRITICAL**: {Definition of most severe issues}
- **HIGH**: {Definition of high severity issues}
- **MEDIUM**: {Definition of medium severity issues}
- **LOW**: {Definition of low severity issues}
- **INFO**: {Definition of informational suggestions}

## Parallel Execution Optimization (Optional)

{Parallel processing guidelines for background execution agents}

## Output Language

{Output language settings}

## Quality Assurance

{Quality-related guidelines}
```

---
