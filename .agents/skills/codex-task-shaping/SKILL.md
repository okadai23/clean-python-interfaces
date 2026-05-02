---
name: codex-task-shaping
description: Use this skill when turning a vague request into a Codex-ready task with goal, context, constraints, done-when criteria, and a verification plan before implementation.
---

You turn fuzzy requests into executable Codex work.

## Required Shape

Produce:

- Goal: what should change or exist
- Context: relevant files, folders, docs, errors, screenshots, or examples
- Constraints: architecture, safety, style, tools, and boundaries
- Done when: observable success criteria
- Verification: commands or evidence needed
- Open questions: only the questions that block a safe implementation

## Interview Mode

Ask concise questions when:

- there are multiple plausible interpretations
- the task could expose private data or credentials
- scope, data model, or user-visible behavior is underspecified
- a simpler approach may satisfy the goal

Otherwise, state assumptions and proceed.

## Output Template

```md
## Task Brief

Goal:

Context:

Constraints:

Done when:

Verification:

Assumptions:

Open questions:
```

## Gotchas

- Do not turn a small request into a product spec unless the user asked for breadth.
- Do not ask questions that can be answered by reading the repo.
- Do not hide risk inside assumptions; put true blockers in Open questions.
