# PLANS.md

Use this file for long-running work, handoffs, and context resets. Keep only active or recently completed plans that help the next coding agent.

## Active Plan Template

```md
## YYYY-MM-DD Task Title

Status: Active
Owner: Codex

### Goal

- ...

### Acceptance Criteria

- ...

### Architecture Boundary

- Models:
- Utilities:
- Interfaces:
- Application composition root:
- Documentation/harness:

### Plan

1. ...
2. ...
3. ...

### Verification

- [ ] `npm run verify:fast`
- [ ] `npm run verify:e2e` if user-visible behavior changed
- [ ] `npm run docs:verify` if docs changed
- [ ] `npm run harness:diff-scope`

### Handoff Notes

- Changed files:
- Open questions:
- Risks:
```
