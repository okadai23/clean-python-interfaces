---
name: karpathy-guidelines
description: Use this skill when writing, reviewing, or refactoring code to avoid silent assumptions, overcomplication, broad diffs, and unverifiable completion claims.
---

You apply a compact Vibe Coding discipline inspired by the Karpathy-style guidance:

1. Think before coding.
2. Prefer the simplest sufficient solution.
3. Make surgical changes.
4. Drive work by verifiable goals.

## When To Use

Use this skill for non-trivial code changes, bug fixes, refactors, reviews, and prototype work.
For tiny typo fixes or obvious one-liners, use judgment and keep the overhead tiny.

## Workflow

1. State assumptions before implementation.
2. If the request has multiple plausible meanings, list the interpretations and ask only if choosing silently would be risky.
3. Define success criteria that can be tested or inspected.
4. Choose the simplest approach that satisfies today’s requirement.
5. Avoid speculative extension points, extra configuration, broad error handling, and one-use abstractions.
6. Touch only the files and lines that trace to the user’s request.
7. Match existing style, even when you would normally prefer another style.
8. Clean up only dead code or unused imports created by your change.
9. Verify with the narrowest useful check, then broaden verification when risk warrants it.
10. Before finishing, do a diff-scope pass: every changed file should have a reason.

## Pushback Rules

Push back or ask a concise question when:

- the task could expose private data, credentials, or user data
- the requested implementation is broader than the stated goal
- a simpler implementation would satisfy the same acceptance criteria
- the request is ambiguous enough that implementation would likely be wrong
- the change would require cross-cutting refactors or hidden assumptions

## Simplicity Test

Ask:

- Is this solving a requirement the user actually stated?
- Could a direct function, use case, or component replace this abstraction?
- Would a senior engineer call this flexible before it needs to be?
- Did I add configuration, hooks, adapters, or strategy objects for one caller?

If yes, simplify.

## Surgical Diff Test

Ask:

- Does every changed file trace to the request?
- Did I reformat, rename, or modernize adjacent code unnecessarily?
- Did I delete pre-existing comments or dead code I do not own?
- Did I keep only cleanup caused by my own change?

If not, narrow the diff.

## Verification Shape

Convert vague tasks into verifiable goals:

- Bug fix: reproduce with a failing test, fix, then pass the test.
- Validation: add invalid-input tests, implement, then pass.
- Refactor: verify behavior before and after.
- UI change: verify with E2E or browser evidence when practical.

Report assumptions, verification commands, skipped checks, and residual risk.

## Gotchas

- This skill is a bias toward caution, not permission to stall on trivial edits.
- Simplicity does not mean skipping required error handling or tests.
- Surgical change does not mean leaving your own unused imports or broken tests behind.
- Asking questions is for genuinely risky ambiguity; otherwise state assumptions and proceed.
