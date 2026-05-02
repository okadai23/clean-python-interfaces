# Coding Agent Harness

This repository includes a project-local harness for Codex, Claude Code, and other coding agents.

## Core Files

- `AGENTS.md` defines persistent working agreements and required verification commands.
- `PLANS.md` is for long-running plans and handoffs.
- `code_review.md` defines the review checklist and findings-first output shape.
- `.agents/skills/` stores reusable workflows.
- `.codex/agents/` and `.claude/agents/` store custom agent definitions.
- `harness/rules.yaml` records recurring safety and quality rules.

## Standard Workflow

1. Explore relevant code and tests before editing.
2. State acceptance criteria for non-trivial work.
3. Add or update focused tests.
4. Implement the smallest useful change.
5. Update impacted docs.
6. Run verification.
7. Review the diff scope before finishing.

## Verification

```bash no-run
npm run verify:fast
npm run verify
npm run docs:verify
npm run harness:diff-scope
```

Use `pnpm` with the same script names when that is the local package runner.

## Generated Documentation

Generated blocks are marked with comments such as:

```md no-run
<!-- GENERATED:package-commands:start -->
<!-- GENERATED:package-commands:end -->
```

Do not hand-edit text inside those markers. Run the matching generator in `docs/_meta/generated-sections.yaml`.
