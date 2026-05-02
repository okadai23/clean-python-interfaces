#!/usr/bin/env node
import childProcess from "node:child_process";
import process from "node:process";

const isWindows = process.platform === "win32";

function probe(command, args = ["--version"]) {
  const result = childProcess.spawnSync(command, args, {
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: !result.error && result.status === 0,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
    error: result.error?.message
  };
}

const checks = [
  ["uv", ["--version"]],
  ["uvx", ["--version"]],
  ["uv", ["run", "python", "--version"]],
  ["uv", ["run", "python", "scripts/harness/run_rule_tests.py"]]
];

let failed = false;
for (const [command, args] of checks) {
  const result = probe(command, args);
  const printable = [command, ...args].join(" ");
  if (result.ok) {
    console.log(`[ok] ${printable}${result.output ? ` -> ${result.output}` : ""}`);
  } else {
    failed = true;
    console.log(`[fail] ${printable}${result.error ? ` -> ${result.error}` : ""}${result.output ? ` -> ${result.output}` : ""}`);
  }
}

if (failed) {
  console.log("\nInstall uv:");
  console.log("  macOS/Linux: curl -LsSf https://astral.sh/uv/install.sh | sh");
  console.log("  Windows: powershell -ExecutionPolicy ByPass -c \"irm https://astral.sh/uv/install.ps1 | iex\"");
  process.exit(1);
}

console.log("\nuv integration looks healthy.");

