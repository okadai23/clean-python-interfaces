#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

CHECKED_SUFFIXES = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".py",
    ".md",
    ".json",
    ".yaml",
    ".yml",
}


def touched_paths(tool_input: object) -> list[str]:
    if not isinstance(tool_input, dict):
        return []
    candidates = []
    for key in ("file_path", "path"):
        value = tool_input.get(key)
        if isinstance(value, str):
            candidates.append(value)
    command = str(tool_input.get("command") or "")
    for marker in ("*** Add File:", "*** Update File:", "*** Delete File:"):
        for line in command.splitlines():
            if line.startswith(marker):
                candidates.append(line[len(marker) :].strip())
    return candidates


def remove_verify_stamp(cwd: Path) -> None:
    stamp = cwd / ".harness" / "last_verify_passed"
    try:
        if stamp.exists():
            stamp.unlink()
    except OSError:
        pass


def log_failure(cwd: Path, payload: dict, file_path: str, details: str) -> None:
    path = cwd / "harness" / "failures.jsonl"
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        record = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "kind": "post_edit_validation_failed",
            "file": file_path,
            "details": details[:4000],
            "tool_name": payload.get("tool_name"),
            "session_id": payload.get("session_id"),
            "fingerprint": f"post-edit:{Path(file_path).suffix}",
        }
        with path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError:
        pass


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    cwd = Path(payload.get("cwd") or os.getcwd())
    remove_verify_stamp(cwd)

    paths = touched_paths(payload.get("tool_input") or {})
    checked = [p for p in paths if Path(p).suffix in CHECKED_SUFFIXES]
    if not checked:
        print(json.dumps({}))
        return 0

    failures = []
    for path in checked:
        proc = subprocess.run(
            [sys.executable, "scripts/harness/check_changed_file.py", path],
            cwd=cwd,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=20,
        )
        if proc.returncode != 0:
            failures.append(f"{path}\n{proc.stdout.strip()}")
            log_failure(cwd, payload, path, proc.stdout)

    if failures:
        print(
            json.dumps(
                {
                    "continue": False,
                    "stopReason": "Edited file policy failed:\n\n"
                    + "\n\n".join(failures),
                },
                ensure_ascii=False,
            )
        )
        return 0

    print(json.dumps({}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
