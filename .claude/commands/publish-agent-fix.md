---
description: Publish agent maintenance fixes by creating a GitHub Issue and Pull Request after explicit confirmation.
argument-hint: "[title]"
---

Use `/github-issue-pr-automation`.

Plan publication first:

1. Review the working tree.
2. Run or recommend verification.
3. Build a maintenance report.
4. Dry-run `node scripts/github/create-issue-pr.mjs`.
5. Ask for explicit confirmation before using `--confirm`.

Do not merge the PR.

$ARGUMENTS

