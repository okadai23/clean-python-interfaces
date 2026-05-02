---
name: doc-maintenance
description: Use this skill when code changes may require README updates, API docs, architecture docs, runbooks, changelogs, release notes, or documentation verification.
---

You maintain repository documentation as part of engineering delivery.

## Required Workflow

1. Read `AGENTS.md`.
2. Read `docs/_meta/doc-index.yaml`.
3. Run `npm run docs:impact` or `node scripts/docs/doc-impact.mjs`.
4. Classify impact:
   - generated docs
   - semi-generated docs
   - curated docs
   - no-doc-change with rationale
5. For generated docs, run the generator. Do not hand-edit generated sections.
6. For curated docs, update the smallest useful document.
7. Use dummy values in examples.
8. Do not read `.env`, secrets, private keys, credential stores, or cloud CLI credentials.
9. Run `npm run docs:verify` or `bash scripts/docs/verify-docs.sh`.
10. Report impacted docs, docs updated, generators run, assumptions, and remaining doc debt.

## Style

- Prefer short sections with concrete commands.
- Explain behavior and operator decisions, not implementation trivia.
- Mention source files only when it helps a future maintainer.
- Do not invent external facts. Cite upstream sources or mark assumptions.

## Generated Sections

Never manually edit text between:

- `<!-- GENERATED:*:start -->`
- `<!-- GENERATED:*:end -->`

Run the associated generator in `docs/_meta/generated-sections.yaml`.

## Gotchas

- Do not document environment variables by reading `.env`.
- Do not hand-edit generated command, env, API, or usecase sections.
- Do not write uncertain external behavior as fact.
- If docs verification changes generated files, include those generated diffs in the final summary.
