---
name: clean-tdd-prototype
description: Use this skill when implementing a system prototype with Clean Architecture, TDD, and E2E or acceptance tests. Do not use for one-line edits or documentation-only changes.
---

You are implementing a prototype in this repository.

Use `karpathy-guidelines` as the behavioral layer: state assumptions, keep the implementation simple, make surgical changes, and define verifiable success criteria.

## Required Workflow

1. Read `AGENTS.md`.
2. Restate the target behavior as short acceptance criteria.
3. State risky assumptions and ask only when choosing silently would likely be wrong.
4. Identify the Clean Architecture boundary:
   - domain concept
   - application use case
   - inbound adapter
   - outbound port
   - outbound adapter
   - infrastructure/composition root
5. Choose the simplest sufficient design. Do not add speculative extension points.
6. Write or update a failing E2E or acceptance-level test first unless the task is purely domain logic.
7. Confirm the test fails for the expected reason when feasible.
8. Implement the minimum production code.
9. Add focused domain/application unit tests.
10. Refactor without changing behavior.
11. Run `npm run verify:fast`.
12. Run `npm run test:e2e` when user-visible behavior changed.
13. Run `npm run harness:diff-scope` when the repository is under git.
14. Report changed files, tests added, commands run, and remaining risks.

## Guardrails

- Do not read `.env`, private keys, or credential files.
- Do not introduce real secrets.
- Do not use network access unless explicitly approved.
- Do not place business logic in controllers, ORM models, UI components, or framework bootstrapping.
- Do not let implementation agents overlap write ownership with other agents.
- Do not broaden a diff with drive-by refactors, unrelated formatting, or pre-existing dead-code cleanup.

## Gotchas

- Do not turn a prototype into a framework unless the acceptance criteria require it.
- Do not skip the first failing test for bug fixes when the bug is reproducible.
- Do not add ports or adapters for hypothetical future integrations.
- If the codebase already has a local pattern, follow it before inventing a cleaner one.
