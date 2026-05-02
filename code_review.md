# Code Review Checklist

Use this file when Codex is asked to review a branch, commit, or working tree.

Lead with findings. Keep summaries short.

## Priorities

1. Correctness bugs and behavior regressions.
2. Security, secrets, privacy, or data-loss risks.
3. Missing tests for changed behavior.
4. Architecture boundary violations.
5. Flaky E2E, race conditions, or nondeterminism.
6. Documentation drift for public behavior.
7. Overcomplication, broad diffs, or unrelated cleanup.

## Review Method

- Identify the changed behavior before judging the implementation.
- Trace affected entry points and call paths.
- Check tests prove the intended behavior, not only implementation details.
- Prefer concrete file and line findings over general advice.
- Avoid style-only comments unless they hide a real risk.
- If no findings, state residual risk and any checks not run.

## Output Shape

```md
## Findings

- [P1] Title
  File: path
  Why it matters:
  Suggested fix:

## Open Questions

## Test Gaps

## Summary
```

