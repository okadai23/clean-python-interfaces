#!/usr/bin/env python3
import collections
import json
from pathlib import Path

FAILURES = Path("harness/failures.jsonl")


def classify(record: dict, count: int) -> str:
    severity = str(record.get("severity") or "").lower()
    kind = str(record.get("kind") or "").lower()
    reason = str(record.get("reason") or "").lower()
    if severity == "high" or "denied" in kind or "not allowed" in reason:
        return "blocking_hook_candidate"
    if count >= 2 and "architecture" in kind:
        return "structural_lint_warn_candidate"
    if count >= 2 and ("knowledge" in kind or "docs" in kind):
        return "agents_md_or_skill_candidate"
    if count >= 3:
        return "reviewer_agent_warn_candidate"
    return "observe_only"


def main() -> int:
    if not FAILURES.exists():
        print("No harness/failures.jsonl found. Nothing to promote.")
        return 0

    rows = []
    for line in FAILURES.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            continue

    clusters = collections.defaultdict(list)
    for row in rows:
        clusters[row.get("fingerprint") or row.get("kind") or "unknown"].append(row)

    print("# Failure Promotion Report\n")
    for fingerprint, items in sorted(
        clusters.items(), key=lambda kv: (-len(kv[1]), kv[0])
    ):
        route = classify(items[-1], len(items))
        print(f"## {fingerprint}")
        print(f"- count: {len(items)}")
        print(f"- route: {route}")
        print(f"- latest kind: {items[-1].get('kind', 'unknown')}")
        if items[-1].get("reason"):
            print(f"- latest reason: {items[-1].get('reason')}")
        print(
            "- suggested next step: add or update a rule in `harness/rules.yaml`, create good/bad fixtures, run `python scripts/harness/run_rule_tests.py`, then keep new rules in warn mode before block mode.\n"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
