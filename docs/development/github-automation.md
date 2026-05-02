# GitHub Automation

The harness includes scripts for publishing agent maintenance work as a GitHub issue and pull request.

## Local Dry Run

Build a maintenance report:

```bash no-run
npm run github:report
```

Preview issue, branch, commit, push, and pull request commands without mutating GitHub:

```bash no-run
npm run github:issue-pr:dry -- --title "Agent harness maintenance" --body-file .agent-maintenance/report.md
```

## Confirmed Publication

Only run the confirmed command after reviewing the diff, report, and verification results:

```bash no-run
npm run github:issue-pr -- --title "Agent harness maintenance" --body-file .agent-maintenance/report.md
```

The confirmed script requires authenticated `gh` and `git` remotes. It creates an issue, creates a branch, commits current changes, pushes the branch, and opens a pull request.

## GitHub Actions

- `.github/workflows/docs-quality.yml` checks documentation impact and docs verification on pull requests.
- `.github/workflows/agent-maintenance-pr.yml` can be triggered manually to publish generated maintenance changes.

Keep the default path as dry-run locally unless the user explicitly asks to publish.
