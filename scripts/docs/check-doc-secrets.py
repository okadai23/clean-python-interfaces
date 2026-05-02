#!/usr/bin/env python3
import re
from pathlib import Path

PATTERNS = [
    (re.compile(r"sk-[A-Za-z0-9_\-]{20,}"), "OpenAI key-like token"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS key-like token"),
    (
        re.compile(r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"),
        "private key",
    ),
    (
        re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]{8,}"),
        "inline credential",
    ),
]
ALLOWLIST = ["dummy", "example", "postgresql://user:password@localhost"]


def main() -> int:
    failures = []
    for path in [
        Path("README.md"),
        *Path("docs").rglob("*.md"),
        *Path("docs").rglob("*.yaml"),
    ]:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        lines = [
            line
            for line in text.splitlines()
            if not any(token in line.lower() for token in ALLOWLIST)
        ]
        scan = "\n".join(lines)
        for pattern, label in PATTERNS:
            if pattern.search(scan):
                failures.append(f"{path}: {label}")
    if failures:
        print("Potential documentation secrets found:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("Documentation secret scan passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
