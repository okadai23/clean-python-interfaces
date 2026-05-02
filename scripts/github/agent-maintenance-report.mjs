#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";

function capture(command, args = []) {
  const result = childProcess.spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32"
  });
  if (result.error || result.status !== 0) return "";
  return (result.stdout ?? "").trim();
}

const status = capture("git", ["status", "--short"]);
const diffStat = capture("git", ["diff", "--stat"]);
const failuresPath = "harness/failures.jsonl";
const failures = fs.existsSync(failuresPath)
  ? fs.readFileSync(failuresPath, "utf8").trim().split(/\r?\n/).filter(Boolean).slice(-20)
  : [];

const body = [
  "## Agent Maintenance Report",
  "",
  "The agent harness detected or produced maintenance changes.",
  "",
  "## Changed Files",
  "",
  status ? `\n\`\`\`text\n${status}\n\`\`\`` : "No git status output available.",
  "",
  "## Diff Stat",
  "",
  diffStat ? `\n\`\`\`text\n${diffStat}\n\`\`\`` : "No diff stat available.",
  "",
  "## Recent Harness Failures",
  "",
  failures.length ? `\n\`\`\`jsonl\n${failures.join("\n")}\n\`\`\`` : "No harness failure log found.",
  "",
  "## Review Notes",
  "",
  "- Review CI before merging.",
  "- Confirm no secrets or private data are present.",
  "- Confirm generated files are intentional."
].join("\n");

fs.mkdirSync(".agent-maintenance", { recursive: true });
fs.writeFileSync(".agent-maintenance/report.md", body, "utf8");
console.log(".agent-maintenance/report.md");

