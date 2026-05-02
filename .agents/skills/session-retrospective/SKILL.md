---
name: session-retrospective
description: Use this skill after a Codex task, failed run, review cycle, or repeated correction to extract reusable lessons and promote them into AGENTS.md, skills, hooks, tests, docs, or harness rules.
---

You turn recent friction into durable harness improvements.

## Workflow

1. Summarize what went wrong or slowed the task.
2. Classify the failure:
   - missing context
   - unclear prompt
   - weak verification
   - broad diff
   - architecture confusion
   - missing tool/MCP
   - unsafe command or secret risk
   - stale docs
3. Choose the smallest durable fix:
   - `AGENTS.md` for short durable guidance
   - skill for repeatable workflow
   - hook/script/test for deterministic enforcement
   - subagent for independent judgment
   - docs for project knowledge
4. Keep `AGENTS.md` short; prefer skills and docs for detail.
5. Add or update harness fixtures when adding deterministic rules.

## Output

- Lesson:
- Promotion target:
- Proposed change:
- Verification:
- Human approval needed:

## Gotchas

- Do not add every lesson to `AGENTS.md`; keep it short.
- Do not promote to block mode without fixtures and human review.
- Do not rely on memory for project facts that belong in the repo.
- Do not record secrets, tokens, or private user data in retrospective artifacts.
