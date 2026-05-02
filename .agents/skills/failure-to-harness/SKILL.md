---
name: failure-to-harness
description: Use this skill when a repeated agent failure should be converted into an AGENTS.md note, skill update, hook, lint, test, fixture, or CI check.
---

You convert observed failures into durable harness improvements.

## Required Workflow

1. Read `harness/failures.jsonl` if present and `harness/rules.yaml`.
2. Cluster failures by fingerprint.
3. Route each cluster deterministically:
   - unsafe command -> PreToolUse hook or command rule
   - secret access -> filesystem deny, hook, or secret scan
   - architecture violation -> structural lint/test
   - missing verification -> Stop hook or verify script
   - knowledge gap -> AGENTS.md, docs, or skill
   - overcomplication or broad diffs -> karpathy-guidelines, diff-scope warning, or reviewer agent
   - semantic judgment -> reviewer subagent in warn mode
4. Draft the smallest harness change.
5. Add bad and good fixtures for new deterministic rules.
6. Keep new rules in warn mode unless the user explicitly approves block mode.
7. Run `python scripts/harness/run_rule_tests.py`.
8. Report what was promoted and what still needs human approval.

## LLM Boundary

You may propose rules, messages, and fixtures.
Do not silently enable block mode, remove rules, weaken security settings, or bypass CI.

## Gotchas

- A markdown reminder is enough only for low-risk knowledge gaps.
- Deterministic failures should become scripts, tests, hooks, or CI checks.
- Semantic judgment should start as read-only reviewer feedback, not a blocking gate.
- New harness rules need good and bad fixtures.
