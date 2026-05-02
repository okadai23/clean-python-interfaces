#!/usr/bin/env python3
import json
import re
import sys

PATTERNS = [
    (re.compile(r"sk-[A-Za-z0-9_\-]{20,}"), "OpenAI API key-like token"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key id-like token"),
    (
        re.compile(r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"),
        "private key",
    ),
    (
        re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]{8,}"),
        "inline credential",
    ),
]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"continue": True}))
        return 0

    prompt = str(payload.get("prompt", ""))
    for pattern, label in PATTERNS:
        if pattern.search(prompt):
            print(
                json.dumps(
                    {
                        "decision": "block",
                        "reason": f"Prompt appears to contain a secret: {label}. Remove it and use dummy values.",
                    }
                )
            )
            return 0

    print(json.dumps({"continue": True}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
