# Commands

<!-- GENERATED:package-commands:start -->
| Script | Command |
| --- | --- |
| `arch` | `node scripts/check-boundaries.mjs` |
| `claude:check` | `node scripts/claude/check-native.mjs` |
| `docs:build` | `uv run --extra dev nox -s docs` |
| `docs:commands` | `node scripts/docs/generate-command-docs.mjs` |
| `docs:env` | `node scripts/docs/generate-env-docs.mjs` |
| `docs:generate` | `node scripts/docs/generate-docs.mjs` |
| `docs:impact` | `node scripts/docs/doc-impact.mjs` |
| `docs:links` | `node scripts/docs/check-doc-links.mjs` |
| `docs:secrets` | `uv run python scripts/docs/check-doc-secrets.py` |
| `docs:snippets` | `node scripts/docs/check-doc-snippets.mjs` |
| `docs:stale` | `node scripts/docs/check-doc-staleness.mjs` |
| `docs:usecases` | `node scripts/docs/generate-usecase-docs.mjs` |
| `docs:verify` | `node scripts/docs/verify-docs.mjs` |
| `format` | `uv run --extra dev nox -s format_code` |
| `format:fix` | `uv run --extra dev nox -s format_fix` |
| `github:issue-pr` | `node scripts/github/create-issue-pr.mjs --confirm` |
| `github:issue-pr:dry` | `node scripts/github/create-issue-pr.mjs` |
| `github:report` | `node scripts/github/agent-maintenance-report.mjs` |
| `harness:diff-scope` | `node scripts/harness/check-diff-scope.mjs` |
| `harness:promote` | `uv run python scripts/harness/promote_failures.py` |
| `harness:test` | `uv run python scripts/harness/run_rule_tests.py` |
| `lint` | `uv run --extra dev nox -s lint` |
| `lint:fix` | `uv run --extra dev nox -s lint_fix` |
| `secrets` | `uv run python scripts/secret-scan.py` |
| `security` | `uv run --extra dev nox -s security` |
| `sort` | `uv run --extra dev nox -s sort` |
| `sort:fix` | `uv run --extra dev nox -s sort_fix` |
| `test` | `uv run --extra dev nox -s test` |
| `test:e2e` | `uv run --extra dev nox -s test_e2e` |
| `test:integration` | `node scripts/noop-if-missing.mjs test:integration` |
| `test:unit` | `uv run --extra dev nox -s test_unit` |
| `typecheck` | `uv run --extra dev nox -s typing` |
| `uv:doctor` | `node scripts/uv-doctor.mjs` |
| `verify` | `node scripts/verify.mjs` |
| `verify:e2e` | `node scripts/verify-e2e.mjs` |
| `verify:fast` | `node scripts/verify-fast.mjs` |
<!-- GENERATED:package-commands:end -->
