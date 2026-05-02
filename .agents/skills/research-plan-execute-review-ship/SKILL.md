---
name: research-plan-execute-review-ship
description: Use this skill for complex or multi-step development work that should be run as Research -> Plan -> Execute -> Review -> Ship with phase gates and verification.
---

Use this workflow for non-trivial changes.

## Research

- Read `AGENTS.md`, `PLANS.md`, `code_review.md`, and relevant docs.
- Locate affected code paths before editing.
- Prefer targeted search and small file reads.

## Plan

- State assumptions.
- Define acceptance criteria.
- Break work into phases.
- Attach verification to each phase.
- Note which docs may be impacted.

## Execute

- Implement one phase at a time.
- Keep the diff surgical.
- Use the simplest sufficient design.
- Do not overlap write ownership with other agents.

## Review

- Run relevant verification commands.
- Run `npm run harness:diff-scope` when under git.
- Review against `code_review.md`.
- Use focused read-only subagents for large changes.

## Ship

- Update docs or explain no-doc-change.
- Summarize changed files, tests, commands, assumptions, and residual risk.

## Gotchas

- Do not use this full workflow for obvious one-line edits.
- Do not keep planning after the next safe step is clear.
- Do not let subagents duplicate the same work; split by question or ownership.
- Do not call work shipped until verification and review are accounted for.
