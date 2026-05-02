---
name: github-issue-pr-automation
description: Use this skill when publishing agent maintenance fixes to GitHub by creating an Issue, branch, commit, push, and Pull Request with explicit confirmation.
---

You publish agent maintenance safely through GitHub.

## Workflow

1. Confirm the working tree contains only intended changes.
2. Run verification:
   - `npm run verify:fast`
   - `npm run docs:verify`
   - `npm run harness:diff-scope`
3. Generate a maintenance report:
   - `npm run github:report`
4. Dry-run the GitHub operation:
   - `npm run github:issue-pr:dry -- --title "..."`
5. Ask for explicit user confirmation before using `--confirm`.
6. With confirmation, create:
   - GitHub Issue
   - maintenance branch
   - commit
   - pushed branch
   - Pull Request linked to the issue

## Guardrails

- Creating Issues and Pull Requests is external communication. Do not use `--confirm` without explicit user approval at action time.
- Do not publish secrets, private data, logs with credentials, or unrelated diffs.
- Do not merge the PR automatically.
- Do not force push.
- Use `GH_TOKEN` or authenticated `gh`; do not read credentials from files.
