# Claude Code Native Layer

This directory contains Claude Code native agents, commands, skills, settings, and hooks for this repository.

The shared source of truth remains:

- `AGENTS.md` for working agreements
- `code_review.md` for review shape
- `.agents/skills/**` for reusable workflows
- `.codex/agents/**` and `.claude/agents/**` for custom agents
- `scripts/**` for deterministic verification

## Maintenance

When editing Claude native files:

1. Keep the matching Codex agent or shared skill aligned when one exists.
2. Do not add production secrets or local-only paths.
3. Run:

```bash no-run
npm run claude:check
npm run verify:fast
```

Use `pnpm` with the same script names when that is the local package runner.
