#!/usr/bin/env node
import childProcess from "node:child_process";
import { runNodeScript } from "../lib/runner.mjs";

function changedFiles() {
  try {
    const output = childProcess.execFileSync("git", ["diff", "--name-only"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    return null;
  }
}

const changed = changedFiles();
if (changed === null) {
  console.log("No git diff available. Running docs verification once.");
  runNodeScript("scripts/docs/verify-docs.mjs");
  process.exit(0);
}

if (!changed.length) {
  console.log("No changes detected. Documentation verification skipped.");
  process.exit(0);
}

const docRelevant = /^(src\/|tests\/|scripts\/|docs\/|README\.md|package\.json|AGENTS\.md|\.codex\/|\.agents\/|harness\/)/;
if (changed.some((file) => docRelevant.test(file.replaceAll("\\", "/")))) {
  console.log("Doc-relevant changes detected. Running docs verification...");
  runNodeScript("scripts/docs/verify-docs.mjs");
} else {
  console.log("No doc-relevant changes detected.");
}

