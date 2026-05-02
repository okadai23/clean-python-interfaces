#!/usr/bin/env python3
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

BLOCKED_COMMAND_PATTERNS = [
    (re.compile(r"\bsudo\b", re.I), "sudo is not allowed"),
    (
        re.compile(r"\brm\s+-rf\s+(/|\$HOME|~|\.|\*)", re.I),
        "destructive rm -rf is not allowed",
    ),
    (re.compile(r"\bchmod\s+-R\s+777\b", re.I), "chmod -R 777 is not allowed"),
    (re.compile(r"\bchown\s+-R\b", re.I), "recursive chown is not allowed"),
    (re.compile(r"\bgit\s+push\s+--force\b", re.I), "force push is not allowed"),
    (
        re.compile(r"\b(npm|pnpm|yarn)\s+publish\b", re.I),
        "package publish is not allowed",
    ),
    (
        re.compile(r"\b(curl|wget)\b.*\|\s*(sh|bash|pwsh|powershell)\b", re.I),
        "curl/wget piping to shell is not allowed",
    ),
    (
        re.compile(r"\b(ssh|scp|rsync)\b", re.I),
        "remote shell/file transfer is not allowed",
    ),
    (
        re.compile(r"\b(aws|gcloud|az)\b", re.I),
        "cloud CLI access is not allowed from Codex",
    ),
]

SECRET_READ_PATTERNS = [
    (
        re.compile(
            r"(^|\s)(cat|type|less|more|tail|head|sed|awk|grep|rg|Get-Content)\s+.*\.env(\s|$)",
            re.I,
        ),
        "attempt to read .env",
    ),
    (
        re.compile(
            r"(^|\s)(cat|type|less|more|tail|head|sed|awk|grep|rg|Get-Content)\s+.*(id_rsa|id_ed25519|\.pem)(\s|$)",
            re.I,
        ),
        "attempt to read private key material",
    ),
    (
        re.compile(
            r"(^|\s)(cat|type|less|more|tail|head|sed|awk|grep|rg|Get-Content)\s+.*(\.ssh|\.aws|secrets[\\/])",
            re.I,
        ),
        "attempt to read credential store",
    ),
]


def extract_command(tool_input: object) -> str:
    if isinstance(tool_input, dict):
        for key in ("command", "cmd", "script"):
            if key in tool_input:
                return str(tool_input.get(key) or "")
        return json.dumps(tool_input, ensure_ascii=False)
    return str(tool_input or "")


def log_failure(payload: dict, kind: str, reason: str, command: str) -> None:
    cwd = Path(payload.get("cwd") or os.getcwd())
    path = cwd / "harness" / "failures.jsonl"
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        record = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "kind": kind,
            "reason": reason,
            "command": command[:2000],
            "tool_name": payload.get("tool_name"),
            "session_id": payload.get("session_id"),
            "fingerprint": f"{kind}:{reason.lower().replace(' ', '-')}",
        }
        with path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError:
        pass


def deny(payload: dict, reason: str, command: str) -> None:
    event = payload.get("hook_event_name")
    log_failure(payload, "pre_tool_denied", reason, command)
    if event == "PermissionRequest":
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PermissionRequest",
                        "decision": {"behavior": "deny", "message": reason},
                    }
                }
            )
        )
    else:
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": reason,
                    }
                }
            )
        )


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({}))
        return 0

    command = extract_command(payload.get("tool_input") or {})
    for pattern, reason in BLOCKED_COMMAND_PATTERNS + SECRET_READ_PATTERNS:
        if pattern.search(command):
            deny(payload, reason, command)
            return 0

    print(json.dumps({}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
