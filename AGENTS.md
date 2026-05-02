# AGENTS.md

## Purpose

This repository is a Python 3.13 project for `clean_interfaces`, a small framework that exposes CLI, REST API, and MCP interfaces behind shared models, settings, logging, and file utilities.

Keep this file short. Put reusable workflows in `.agents/skills`, deterministic checks in `scripts`, custom agents in `.codex/agents` and `.claude/agents`, and recurring rules in `harness/rules.yaml`.

## Working Agreements

- Explore the existing code before editing.
- For unclear or multi-file tasks, use Explore -> Plan -> Implement -> Verify.
- For complex work, keep the active plan in `PLANS.md`.
- Prefer small, reversible changes with focused tests.
- Use `uv` and `nox`; do not use `pip`, Poetry, or ad hoc virtualenv commands for project dependency management.
- Touch only files that trace to the request. Report unrelated findings instead of fixing them silently.
- Treat documentation as part of the deliverable when public API, CLI behavior, configuration, architecture, or developer commands change.
- For reviews, use `code_review.md` and lead with actionable findings.
- Do not read `.env`, `.env.*`, private keys, credential stores, `.ssh/`, `.aws/`, or `secrets/`.
- Do not introduce real secrets. Use dummy values in examples, tests, fixtures, and docs.
- Ask before adding production dependencies, enabling external network calls, publishing packages, or creating GitHub issues/PRs.

## Architecture

- `src/clean_interfaces/models` owns Pydantic data shapes and must not import app, interface, or utility modules.
- `src/clean_interfaces/utils` owns settings, logging, and file helpers and must not import app or interface modules.
- `src/clean_interfaces/interfaces` owns inbound adapters for CLI, REST API, and MCP; it may depend on models, settings, and utilities.
- `src/clean_interfaces/app.py` is the composition root that wires settings, logging, and interface selection.
- Keep user-visible behavior in interfaces thin and move shared behavior into models or utilities when it is reused.

## TDD Workflow

- State acceptance criteria before non-trivial implementation.
- For user-visible behavior, add or update an E2E or acceptance-level test first when feasible.
- For model, settings, or utility behavior, add focused unit tests.
- Confirm a new regression test fails for the expected reason when practical.
- Implement the smallest useful change, then refactor after tests pass.

## Required Commands

Use the commands that exist in this repository:

- Fast verification: `npm run verify:fast` or `pnpm verify:fast`
- Full verification: `npm run verify` or `pnpm verify`
- E2E verification: `npm run verify:e2e` or `pnpm verify:e2e`
- Documentation verification: `npm run docs:verify` or `pnpm docs:verify`
- Architecture check: `npm run arch` or `pnpm arch`
- Secret scan: `npm run secrets` or `pnpm secrets`
- Harness rule tests: `npm run harness:test` or `pnpm harness:test`
- Diff scope review: `npm run harness:diff-scope` or `pnpm harness:diff-scope`

Use nox directly for narrow Python checks:

- `uv run --extra dev nox -s lint`
- `uv run --extra dev nox -s format_code`
- `uv run --extra dev nox -s sort`
- `uv run --extra dev nox -s typing`
- `uv run --extra dev nox -s test_unit`
- `uv run --extra dev nox -s test_e2e`
- `uv run --extra dev nox -s test`
- `uv run --extra dev nox -s docs`

Only run fix sessions intentionally:

- `uv run --extra dev nox -s lint_fix`
- `uv run --extra dev nox -s format_fix`
- `uv run --extra dev nox -s sort_fix`

## Documentation Maintenance

Before finishing code changes, check whether docs are impacted by:

- public API, CLI commands, REST/MCP behavior, or configuration
- interface selection, logging, settings, or file handling behavior
- architecture boundaries or dependency rules
- testing strategy, runbooks, or GitHub automation

Do not manually edit generated sections marked with `<!-- GENERATED:*:start -->` and `<!-- GENERATED:*:end -->`; run the matching generator.

## Definition Of Done

- Relevant tests were added or updated.
- Fast verification passed, or failures are reported with the exact blocker.
- E2E verification was run for user-visible behavior, or the reason for skipping it is stated.
- Architecture and secret checks pass for changed areas.
- Impacted docs were updated or a no-doc-change rationale is given.
- Diff scope is explainable: every changed file has a direct reason tied to the request.

## Personal Overrides

Use `AGENTS.override.md` for local preferences. Do not commit it.
