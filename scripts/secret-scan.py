#!/usr/bin/env python3
import re
from pathlib import Path

SKIP_DIRS = {
    ".git",
    ".mypy_cache",
    ".nox",
    ".pytest_cache",
    ".ruff_cache",
    ".venv",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "docs/build",
    "htmlcov",
    "node_modules",
    "site",
    ".codex/log",
}
SKIP_SUFFIXES = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".pdf",
    ".zip",
    ".gz",
    ".lock",
}
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
ALLOWLIST = [
    "dummy",
    "example",
    "postgresql://user:password@localhost",
]


def should_skip(path: Path) -> bool:
    parts = set(path.parts)
    if parts & SKIP_DIRS:
        return True
    return path.suffix.lower() in SKIP_SUFFIXES


def main() -> int:
    root = Path.cwd()
    failures = []
    for path in root.rglob("*"):
        if should_skip(path) or not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        lowered = text.lower()
        if any(token in lowered for token in ALLOWLIST):
            scan_text = "\n".join(
                line
                for line in text.splitlines()
                if not any(token in line.lower() for token in ALLOWLIST)
            )
        else:
            scan_text = text
        for pattern, label in PATTERNS:
            if pattern.search(scan_text):
                failures.append(f"{path}: {label}")

    if failures:
        print("Potential secrets found:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Secret scan passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
