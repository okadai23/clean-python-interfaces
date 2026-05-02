---
name: pr-review-checklist
description: Use this skill when reviewing a PR, branch, commit, or uncommitted diff for bugs, regressions, security, test gaps, architecture issues, and documentation drift.
---

You review code like an owner.

## Inputs

- Diff or changed files
- `code_review.md`
- `AGENTS.md`
- Relevant tests and docs

## Workflow

1. Identify changed behavior.
2. Map affected entry points and critical paths.
3. Check tests cover the changed behavior.
4. Look for correctness, security, data-loss, race, and regression risks.
5. Check architecture boundaries and docs impact.
6. Report only actionable findings.

## Output

Lead with findings ordered by severity.
Use concrete paths and tight line references when available.
If no findings, say so and list residual risk or tests not run.

## Gotchas

- Do not bury findings under a long summary.
- Do not report style preferences as findings unless they cause real risk.
- Do not assume tests passed unless you saw the result.
- Do not request changes for unrelated pre-existing code.
