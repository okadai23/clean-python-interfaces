#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from pathlib import Path


def has_repo_files(cwd: Path) -> bool:
    return any(
        (cwd / name).exists() for name in ("package.json", "src", "tests", "scripts")
    )


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"continue": True}))
        return 0

    if payload.get("stop_hook_active"):
        print(json.dumps({"continue": True}))
        return 0

    cwd = Path(payload.get("cwd") or os.getcwd())
    if not has_repo_files(cwd):
        print(
            json.dumps(
                {
                    "continue": True,
                    "systemMessage": "No repository verification targets found.",
                }
            )
        )
        return 0

    command = ["node", "scripts/verify-fast.mjs"]
    if not (cwd / "scripts" / "verify-fast.mjs").exists():
        print(
            json.dumps(
                {
                    "continue": True,
                    "systemMessage": "scripts/verify-fast.mjs is missing; final gate skipped.",
                }
            )
        )
        return 0

    try:
        proc = subprocess.run(
            command,
            cwd=cwd,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=280,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
        print(
            json.dumps(
                {
                    "decision": "block",
                    "reason": f"Quality gate could not complete: {exc}. Run a targeted check and fix failures before finishing.",
                }
            )
        )
        return 0

    output = proc.stdout[-6000:]
    if proc.returncode != 0:
        print(
            json.dumps(
                {
                    "decision": "block",
                    "reason": (
                        "Quality gate failed. Fix the failure, then rerun `npm run verify:fast`.\n\n"
                        f"Command: {' '.join(command)}\n\n"
                        f"Output tail:\n{output}"
                    ),
                }
            )
        )
        return 0

    stamp = cwd / ".harness" / "last_verify_passed"
    try:
        stamp.parent.mkdir(parents=True, exist_ok=True)
        stamp.write_text("passed\n", encoding="utf-8")
    except OSError:
        pass

    print(
        json.dumps(
            {
                "continue": True,
                "systemMessage": "Quality gate passed: scripts/verify-fast.mjs",
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
