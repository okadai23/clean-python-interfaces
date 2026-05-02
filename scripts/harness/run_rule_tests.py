#!/usr/bin/env python3
import json
import re
from pathlib import Path

DENY_PATTERNS = [
    re.compile(r"\brm\s+-rf\s+(/|\$HOME|~|\.|\*)", re.I),
    re.compile(r"\b(npm|pnpm|yarn)\s+publish\b", re.I),
    re.compile(r"\b(curl|wget)\b.*\|\s*(sh|bash|pwsh|powershell)\b", re.I),
    re.compile(
        r"(^|\s)\.env(\s|$)|id_rsa|id_ed25519|\.pem|\.ssh|\.aws|secrets[\\/]", re.I
    ),
]


def decision(command: str) -> str:
    return "deny" if any(p.search(command) for p in DENY_PATTERNS) else "allow"


def run_fixture(path: Path) -> tuple[bool, str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    command = data.get("tool_input", {}).get("command", "")
    expected = data.get("expect")
    actual = decision(command)
    return (
        actual == expected,
        f"{path}: expected {expected}, got {actual} for {command!r}",
    )


def main() -> int:
    failures = []
    for folder in (Path("harness/fixtures/bad"), Path("harness/fixtures/good")):
        for path in sorted(folder.glob("*.json")):
            ok, message = run_fixture(path)
            if not ok:
                failures.append(message)

    if failures:
        print("Harness rule fixture failures:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Harness rule fixtures passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
