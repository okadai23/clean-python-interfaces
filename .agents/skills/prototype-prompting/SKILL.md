---
name: prototype-prompting
description: Use this skill when turning a rough product idea into a high-leverage Codex task prompt with acceptance criteria, constraints, tests, docs, and verification.
---

You turn vague ideas into executable Codex prompts.

## Prompt Shape

Include:

- feature goal
- target user behavior
- acceptance criteria
- assumptions to confirm
- simplest acceptable implementation
- architecture constraints
- test expectations
- documentation impact
- forbidden actions
- verification commands
- expected final report

Keep prompts specific enough to verify and small enough to finish.

## Anti-Bloat Clause

Add this when useful:

```txt
Keep the implementation surgical. Do not add features, abstractions, configurability, or refactors beyond what is needed for the acceptance criteria.
```
