#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

SECRET_PATTERNS = [
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

GENERATED_RE = re.compile(
    r"<!--\s*GENERATED:[^:]+:start\s*-->.*?<!--\s*GENERATED:[^:]+:end\s*-->", re.S
)


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check_changed_file.py <path>")
        return 2

    path = Path(sys.argv[1])
    if not path.exists() or not path.is_file():
        return 0

    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return 0

    failures = []
    for pattern, label in SECRET_PATTERNS:
        if pattern.search(text):
            failures.append(f"possible secret detected: {label}")

    if path.suffix == ".md" and "GENERATED:" in text:
        starts = len(re.findall(r"<!--\s*GENERATED:[^:]+:start\s*-->", text))
        ends = len(re.findall(r"<!--\s*GENERATED:[^:]+:end\s*-->", text))
        blocks = len(GENERATED_RE.findall(text))
        if starts != ends or blocks != starts:
            failures.append("generated section markers are unbalanced")

    if path.name.lower().startswith(".env"):
        failures.append("editing .env-like files is not allowed in this harness")

    if failures:
        print(json.dumps({"file": str(path), "failures": failures}, indent=2))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
